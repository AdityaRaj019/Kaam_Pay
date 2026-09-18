/**
 * chat.types.ts — Type definitions for Chat module
 */

export interface AttachmentPayload {
  url: string;
  publicId: string;
  fileType: string;
  fileName: string;
  fileSize: number;
}

export interface ChatMessagePayload {
  chatRoomId: string;
  orderId: string;
  senderId: string;
  recipientId: string;
  text?: string;
  attachments?: AttachmentPayload[];
}

export interface ChatUserSummary {
  id: string;
  name: string;
  image?: string | null;
  email?: string;
  role?: string;
}

export interface ConversationCard {
  orderId: string;
  chatRoomId: string;
  orderStatus: string;
  gigTitle: string;
  gigPrice: number;
  otherUser: ChatUserSummary;
  lastMessage: {
    id: string;
    text: string | null;
    senderId: string;
    senderName: string;
    hasAttachments: boolean;
    createdAt: Date;
  } | null;
  updatedAt: Date;
}

export interface InitChatInput {
  orderId?: string;
  freelancerId?: string;
  gigId?: string;
}

export interface DownloadAttachmentQuery {
  url?: string;
  fileName?: string;
  publicId?: string;
}
