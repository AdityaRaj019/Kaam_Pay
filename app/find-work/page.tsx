'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, SlidersHorizontal, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { AppNavbar } from '@/components/AppNavbar';
import api from '@/lib/axios';
import type { Gig, GigDetail } from '@/types/gig';

import { loadSavedMap, persistSavedMap } from '@/components/find-work/utils';
import { GigCard, GigCardSkeleton } from '@/components/find-work/GigCard';
import { GigDetailPanel } from '@/components/find-work/GigDetailPanel';
import { FullModal } from '@/components/find-work/FullModal';
import { FilterDrawer, DEFAULT_FILTERS, type Filters } from '@/components/find-work/FilterDrawer';
import { SavedEmpty } from '@/components/find-work/SavedEmpty';

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FindWorkPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [categories, setCategories] = useState<string[]>([]);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [gigDetail, setGigDetail] = useState<GigDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [fullModal, setFullModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent');

  // ── Saved gigs state (synced with localStorage) ────────────────────────────
  const [savedMap, setSavedMap] = useState<Record<string, Gig>>({});

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setSavedMap(loadSavedMap());
  }, []);

  const toggleSave = useCallback((gig: Gig) => {
    setSavedMap((prev) => {
      const next = { ...prev };
      if (next[gig.id]) {
        delete next[gig.id];
      } else {
        next[gig.id] = gig;
      }
      persistSavedMap(next);
      return next;
    });
  }, []);

  const savedGigs = Object.values(savedMap);
  const savedCount = savedGigs.length;

  // ── Debounce search ────────────────────────────────────────────────────────
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  // Load categories once
  useEffect(() => {
    api
      .get<{ success: boolean; data: string[] }>('/client/categories')
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  // Fetch gigs (only when on 'recent' tab)
  const fetchGigs = useCallback(async () => {
    setLoadingGigs(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: LIMIT,
        sortBy: filters.sortBy,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.deliveryTime) params.deliveryTime = Number(filters.deliveryTime);

      const res = await api.get<{ success: boolean; data: { gigs: Gig[]; total: number } }>(
        '/client/gigs',
        { params },
      );
      setGigs(res.data.data.gigs);
      setTotal(res.data.data.total);
    } catch {
      setGigs([]);
    } finally {
      setLoadingGigs(false);
    }
  }, [debouncedSearch, filters, page]);

  useEffect(() => {
    void fetchGigs();
  }, [fetchGigs]);

  // Fetch gig detail when selected
  useEffect(() => {
    if (!selectedGigId) return;
    setLoadingDetail(true);
    setGigDetail(null);
    api
      .get<{ success: boolean; data: GigDetail }>(`/client/gigs/${selectedGigId}`)
      .then((res) => setGigDetail(res.data.data))
      .catch(() => setGigDetail(null))
      .finally(() => setLoadingDetail(false));
  }, [selectedGigId]);

  const handleGigClick = (gig: Gig) => {
    setSelectedGigId(gig.id);
    setFullModal(false);
  };

  const handleApplyFilters = () => {
    setFilters(pendingFilters);
    setPage(1);
  };
  const handleResetFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);
  const activeFiltersCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.deliveryTime,
  ].filter(Boolean).length;
  const panelOpen = Boolean(selectedGigId);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#2c3437]">
      <AppNavbar />

        {fullModal && gigDetail && (
          <FullModal
            gig={gigDetail}
            isSaved={Boolean(savedMap[gigDetail.id])}
            onClose={() => setFullModal(false)}
            onToggleSave={toggleSave}
          />
        )}

        <FilterDrawer
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          categories={categories}
          filters={pendingFilters}
          onChange={(f) => setPendingFilters((prev) => ({ ...prev, ...f }))}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        <main className="pt-6 sm:pt-8 pb-16 px-6 max-w-screen-2xl mx-auto">
          {/* Page header */}
          <section className="mb-6">
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#2c3437] mb-1.5">
              Find Work
            </h1>
            <p className="text-[#596064] text-sm">
              Discover gigs from talented freelancers across India
            </p>
          </section>

          {/* Search — only shown on 'recent' tab */}
          {activeTab === 'recent' && (
            <section className="mb-8">
              <div className="relative w-full max-w-2xl">
                <Search className="w-5 h-5 text-[#596064]/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="gig-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search gigs by title, description, category…"
                  className="w-full bg-white border border-[#dce4e8] rounded-2xl py-3.5 pl-12 pr-10 text-sm text-[#2c3437] placeholder:text-[#596064]/60 focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] transition-all shadow-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#596064] hover:bg-[#eaeff2] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Tabs + Filters row */}
          <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`font-headline font-bold text-base relative transition-colors pb-2 cursor-pointer ${
                  activeTab === 'recent'
                    ? 'text-[#4a4bd7]'
                    : 'text-[#596064]/70 hover:text-[#2c3437]'
                }`}
              >
                Most Recent
                {activeTab === 'recent' && (
                  <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-[#4a4bd7] rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`font-headline font-bold text-base relative transition-colors pb-2 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'saved' ? 'text-[#4a4bd7]' : 'text-[#596064]/70 hover:text-[#2c3437]'
                }`}
              >
                Saved Gigs
                {savedCount > 0 && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                      activeTab === 'saved'
                        ? 'bg-[#4a4bd7] text-white'
                        : 'bg-[#dce4e8] text-[#596064]'
                    }`}
                  >
                    {savedCount}
                  </span>
                )}
                {activeTab === 'saved' && (
                  <span className="absolute -bottom-0 left-0 w-full h-0.5 bg-[#4a4bd7] rounded-full" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === 'recent' && (
                <>
                  {filters.category && (
                    <span className="flex items-center gap-1.5 bg-[#4a4bd7]/10 text-[#4a4bd7] px-3 py-1.5 rounded-full text-xs font-semibold">
                      <span>{filters.category}</span>
                      <button
                        type="button"
                        aria-label="Remove category filter"
                        onClick={() => {
                          setFilters((f) => ({ ...f, category: '' }));
                          setPage(1);
                        }}
                        className="hover:opacity-80 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setFilterOpen(true)}
                    className="flex items-center gap-2 bg-white border border-[#dce4e8] px-4 py-2 rounded-full hover:border-[#4a4bd7]/40 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#596064]" />
                    <span className="text-sm font-semibold text-[#2c3437]">Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-[#4a4bd7] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  {total > 0 && (
                    <span className="text-xs text-[#596064] font-medium ml-1">
                      <span className="font-bold text-[#2c3437]">{total}</span> gigs
                    </span>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Main layout */}
          <div className="flex gap-6 items-start">
            {/* Gig list */}
            <div
              className={`transition-all duration-300 space-y-4 ${
                panelOpen ? 'w-[52%] flex-shrink-0' : 'w-full'
              }`}
            >
              {/* ── Recent tab ── */}
              {activeTab === 'recent' &&
                (loadingGigs ? (
                  Array.from({ length: 4 }).map((_, i) => <GigCardSkeleton key={i} />)
                ) : gigs.length === 0 ? (
                  <div className="kp-card p-16 text-center">
                    <SearchX className="w-12 h-12 text-[#acb3b7] mb-3 mx-auto stroke-[1.5]" />
                    <h3 className="font-headline font-bold text-lg text-[#2c3437] mb-2">
                      No gigs found
                    </h3>
                    <p className="text-[#596064] text-sm">Try adjusting your search or filters</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-6 px-6 py-2.5 rounded-full border border-[#4a4bd7]/30 text-[#4a4bd7] text-sm font-semibold hover:bg-[#4a4bd7]/5 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  gigs.map((gig) => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      isSelected={selectedGigId === gig.id}
                      isSaved={Boolean(savedMap[gig.id])}
                      onClick={() => handleGigClick(gig)}
                      onToggleSave={toggleSave}
                    />
                  ))
                ))}

              {/* ── Saved tab ── */}
              {activeTab === 'saved' &&
                (savedGigs.length === 0 ? (
                  <SavedEmpty />
                ) : (
                  savedGigs.map((gig) => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      isSelected={selectedGigId === gig.id}
                      isSaved={true}
                      onClick={() => handleGigClick(gig)}
                      onToggleSave={(g) => {
                        toggleSave(g);
                        if (g.id === selectedGigId) {
                          setSelectedGigId(null);
                          setGigDetail(null);
                        }
                      }}
                    />
                  ))
                ))}

              {/* Pagination — only on recent tab */}
              {activeTab === 'recent' && totalPages > 1 && !loadingGigs && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    aria-label="Previous page"
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-[#dce4e8] text-[#596064] hover:border-[#4a4bd7]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, i, arr) => (
                      <span key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="text-[#acb3b7] text-sm">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                            page === p
                              ? 'bg-[#4a4bd7] text-white shadow-md shadow-[#4a4bd7]/25'
                              : 'border border-[#dce4e8] text-[#596064] hover:border-[#4a4bd7]/40'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    aria-label="Next page"
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-[#dce4e8] text-[#596064] hover:border-[#4a4bd7]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Detail Panel */}
            {panelOpen && (
              <div
                className="flex-1 sticky top-20 rounded-3xl border border-[#dce4e8] bg-white overflow-hidden shadow-sm"
                style={{ maxHeight: 'calc(100vh - 6rem)' }}
              >
                <GigDetailPanel
                  gig={gigDetail}
                  loading={loadingDetail}
                  isSaved={gigDetail ? Boolean(savedMap[gigDetail.id]) : false}
                  onClose={() => {
                    setSelectedGigId(null);
                    setGigDetail(null);
                  }}
                  onExpand={() => setFullModal(true)}
                  onToggleSave={toggleSave}
                />
              </div>
            )}
          </div>

          {/* Full View Modal */}
          {fullModal && gigDetail && (
            <FullModal
              gig={gigDetail}
              isSaved={Boolean(savedMap[gigDetail.id])}
              onClose={() => setFullModal(false)}
              onToggleSave={toggleSave}
            />
          )}
        </main>
      </div>
  );
}
