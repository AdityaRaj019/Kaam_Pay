'use client';

import type { SortOption } from '@/types/gig';

export interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
  deliveryTime: string;
  sortBy: SortOption;
}

export const DEFAULT_FILTERS: Filters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  deliveryTime: '',
  sortBy: 'newest',
};

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onApply: () => void;
  onReset: () => void;
}

export function FilterDrawer({
  open,
  onClose,
  categories,
  filters,
  onChange,
  onApply,
  onReset,
}: FilterDrawerProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full z-40 w-80 bg-[#f7f9fb] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#dce4e8]">
          <h3 className="font-headline font-bold text-[#2c3437]">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#dce4e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[#596064]" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
              className="w-full bg-[#eaeff2] border-none rounded-xl px-4 py-3 text-sm text-[#2c3437] focus:ring-2 focus:ring-[#4a4bd7]/20"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="delivery_time">Fastest Delivery</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="w-full bg-[#eaeff2] border-none rounded-xl px-4 py-3 text-sm text-[#2c3437] focus:ring-2 focus:ring-[#4a4bd7]/20"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
              Price Range (₹)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onChange({ minPrice: e.target.value })}
                className="w-1/2 bg-[#eaeff2] border-none rounded-xl px-4 py-3 text-sm text-[#2c3437] focus:ring-2 focus:ring-[#4a4bd7]/20"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onChange({ maxPrice: e.target.value })}
                className="w-1/2 bg-[#eaeff2] border-none rounded-xl px-4 py-3 text-sm text-[#2c3437] focus:ring-2 focus:ring-[#4a4bd7]/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#596064] uppercase tracking-wider">
              Max Delivery Time (days)
            </label>
            <div>
              {[1, 3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    onChange({ deliveryTime: filters.deliveryTime === String(d) ? '' : String(d) })
                  }
                  className={`mr-2 mb-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.deliveryTime === String(d) ? 'bg-[#4a4bd7] text-white' : 'bg-[#eaeff2] text-[#596064] hover:bg-[#dce4e8]'}`}
                >
                  {d === 1 ? '1 day' : `${d} days`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#dce4e8] space-y-3">
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#4a4bd7] to-[#7073ff] text-white font-bold text-sm hover:opacity-90 transition-all"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full py-3 rounded-full border border-[#dce4e8] text-[#596064] font-medium text-sm hover:bg-[#eaeff2] transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
