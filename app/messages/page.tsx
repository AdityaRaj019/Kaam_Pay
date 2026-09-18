'use client';

import React, { useState, useEffect, useMemo, Suspense,useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  ArrowLeft,
  Briefcase,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useSession } from '@/lib/auth/auth-client';
import { AppNavbar } from '@/components/AppNavbar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { PresenceDot } from '@/components/chat/PresenceDot';
import { connectSocket, getSocket } from '@/lib/socket';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface OtherUser {
  id: string;
  name: string;
  image?: string | null;
  email?: string;
  role?: string;
}

interface Conversation {
  orderId: string;
  chatRoomId: string;
  orderStatus: string;
  gigTitle: string;
  gigPrice: number;
  otherUser: OtherUser;
  lastMessage: {
    id: string;
    text: string | null;
    senderId: string;
    senderName: string;
    hasAttachments: boolean;
    createdAt: string;
  } | null;
  updatedAt: string;
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedOrderId = searchParams.get('orderId');

  const { data: session, isPending: isSessionPending } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(requestedOrderId);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isSessionPending && !session?.user) {
      router.push('/login');
    }
  }, [isSessionPending, session, router]);

  // Sync real-time presence across all contacts in the sidebar
  useEffect(() => {
    if (!session?.user) return;
    connectSocket();
    const socket = getSocket();

    const onUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    };

    const onUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    const onRoomPresence = ({ otherUserId, isOnline }: { otherUserId: string; isOnline: boolean }) => {
      if (isOnline) {
        setOnlineUserIds((prev) => new Set(prev).add(otherUserId));
      } else {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(otherUserId);
          return next;
        });
      }
    };

    socket.on('user_online', onUserOnline);
    socket.on('user_offline', onUserOffline);
    socket.on('room_presence', onRoomPresence);

    return () => {
      socket.off('user_online', onUserOnline);
      socket.off('user_offline', onUserOffline);
      socket.off('room_presence', onRoomPresence);
    };
  }, [session?.user]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/chat/conversations');
      const list: Conversation[] = data.data ?? [];
      setConversations(list);

      if (requestedOrderId) {
        setSelectedOrderId(requestedOrderId);
      } else if (list.length > 0 && !selectedOrderId) {
        setSelectedOrderId(list[0].orderId);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      toast.error('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  }, [requestedOrderId, selectedOrderId]);

  useEffect(() => {
    if (session?.user) {
      loadConversations();
    }
  }, [session?.user, loadConversations]);

  // Create a quick test order & chat room for easy testing
  const handleCreateDemoOrder = async () => {
    try {
      setIsCreatingDemo(true);
      // Fetch available gigs
      const { data: gigsData } = await api.get('/client/gigs?limit=5');
      const gigs = gigsData?.data?.gigs ?? [];

      let gig = gigs.find((g: { freelancerId: string }) => g.freelancerId !== session?.user?.id);
      if (!gig && gigs.length > 0) {
        gig = gigs[0];
      }

      if (!gig) {
        toast.error('No gigs available to start a conversation. Please create or seed gigs first.');
        return;
      }

      const { data: initData } = await api.post('/chat/init', {
        freelancerId: gig.freelancerId,
        gigId: gig.id,
      });

      toast.success('Conversation initiated successfully!');
      await loadConversations();
      if (initData?.data?.orderId) {
        setSelectedOrderId(initData.data.orderId);
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message || 'Failed to start demo conversation';
      toast.error(errorMsg);
    } finally {
      setIsCreatingDemo(false);
    }
  };

  // Filter conversations based on query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.otherUser.name.toLowerCase().includes(q) ||
        c.gigTitle.toLowerCase().includes(q) ||
        (c.lastMessage?.text && c.lastMessage.text.toLowerCase().includes(q)),
    );
  }, [conversations, searchQuery]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.orderId === selectedOrderId) ?? null,
    [conversations, selectedOrderId],
  );

  if (isSessionPending || (!session?.user && isLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#4a4bd7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const navbarUser = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      <AppNavbar user={navbarUser} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <MessageSquare className="w-7 h-7 text-[#4a4bd7]" />
              Messages
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Secure real-time chat with your clients and freelancers
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Escrow Secured
            </span>
          </div>
        </div>

        {/* Chat Workspace Box */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px] md:min-h-[600px] h-[calc(100dvh-180px)] md:h-[calc(100vh-210px)] max-h-[850px]">
          {/* Left Panel: Conversation Threads */}
          <div
            className={`
              md:col-span-5 lg:col-span-4 border-r border-slate-200 flex flex-col min-h-0 bg-slate-50/50
              ${selectedOrderId ? 'hidden md:flex' : 'flex'}
            `}
          >
            {/* Search filter */}
            <div className="p-3.5 border-b border-slate-200 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats or projects..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-[#4a4bd7] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading your conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4a4bd7] mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">No conversations yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                    Real-time chats start automatically when an order is placed.
                  </p>

                  <div className="mt-4 flex flex-col gap-2 w-full max-w-[200px]">
                    <Link
                      href="/find-work"
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#4a4bd7] text-white hover:bg-[#3b3cb8] transition-colors text-center shadow-sm"
                    >
                      Browse Available Gigs
                    </Link>
                    <button
                      type="button"
                      onClick={handleCreateDemoOrder}
                      disabled={isCreatingDemo}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      {isCreatingDemo ? 'Creating Demo Chat...' : 'Start Test Chat'}
                    </button>
                  </div>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.orderId === selectedOrderId;
                  return (
                    <button
                      key={conv.orderId}
                      type="button"
                      onClick={() => setSelectedOrderId(conv.orderId)}
                      className={`
                        w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer
                        ${isSelected ? 'bg-indigo-50/60 border-l-4 border-l-[#4a4bd7]' : 'hover:bg-slate-100/70'}
                      `}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {conv.otherUser.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={conv.otherUser.image}
                            alt={conv.otherUser.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#4a4bd7]/10 text-[#4a4bd7] font-bold text-sm flex items-center justify-center border border-[#4a4bd7]/20">
                            {conv.otherUser.name[0]?.toUpperCase()}
                          </div>
                        )}
                        <PresenceDot isOnline={onlineUserIds.has(conv.otherUser.id)} className="absolute bottom-0 right-0 ring-2 ring-white" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {conv.otherUser.name}
                          </p>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          {conv.gigTitle}
                        </p>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-slate-600 truncate max-w-[170px]">
                            {conv.lastMessage
                              ? conv.lastMessage.text ||
                                (conv.lastMessage.hasAttachments ? '📎 File attached' : 'Message')
                              : 'No messages yet'}
                          </p>

                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                            {conv.orderStatus}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Active Chat Window */}
          <div
            className={`
              md:col-span-7 lg:col-span-8 flex flex-col h-full min-h-0 bg-white
              ${selectedOrderId ? 'flex' : 'hidden md:flex'}
            `}
          >
            {activeConversation ? (
              <div className="flex flex-col h-full min-h-0">
                {/* Mobile Back Header */}
                <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderId(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to chats
                  </button>
                  <span className="text-xs text-slate-500 font-medium truncate">
                    {activeConversation.gigTitle}
                  </span>
                </div>

                {/* ChatWindow */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ChatWindow
                    orderId={activeConversation.orderId}
                    currentUserId={session.user.id}
                    otherUser={activeConversation.otherUser}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4a4bd7] mb-4 shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Select a conversation</h2>
                <p className="text-xs md:text-sm text-slate-500 max-w-sm mt-1">
                  Choose a chat from the sidebar to view order deliverables, discuss project specs,
                  and send attachments in real-time.
                </p>

                <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Encrypted WebSocket
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Instant Delivery
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#4a4bd7] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
