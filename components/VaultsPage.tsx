import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_VAULTS } from '../constants';
import { Vault } from '../types';
import { FeaturedVault } from './FeaturedVault';
import { VaultCard } from './VaultCard';
import { VaultDetails } from './VaultDetails';

export const VaultsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'Performance' | 'TVL' | 'APY' | 'Newest'>('Performance');
  const [assetFilter, setAssetFilter] = useState<'All' | 'ETH' | 'USDC' | 'WBTC'>('All');
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);

  // Custom Dropdown State
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const featuredVault = MOCK_VAULTS.find(v => v.isFeatured) || MOCK_VAULTS[0];

  const filteredVaults = useMemo(() => {
    return MOCK_VAULTS
      .filter(vault => {
        const matchesSearch = vault.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              vault.manager.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAsset = assetFilter === 'All' || vault.asset === assetFilter;
        return matchesSearch && matchesAsset && !vault.isFeatured; // Exclude featured from grid
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'Performance': return b.weeklyChange - a.weeklyChange;
          case 'TVL': return b.tvl - a.tvl;
          case 'APY': return b.apy - a.apy;
          case 'Newest': return b.createdAt - a.createdAt;
          default: return 0;
        }
      });
  }, [searchQuery, sortBy, assetFilter]);

  const handleInvestInFeatured = () => {
    setSelectedVault(featuredVault);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a vault is selected, show details view
  if (selectedVault) {
    return (
      <VaultDetails 
        vault={selectedVault} 
        onBack={() => setSelectedVault(null)} 
      />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-300">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 font-display text-text-light dark:text-text-dark">Featured Vault</h1>
      
      <FeaturedVault vault={featuredVault} onInvest={handleInvestInFeatured} />

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Sort - Custom UI Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex items-center justify-between w-full bg-card-light dark:bg-card-dark border ${isSortOpen ? 'border-primary ring-1 ring-primary' : 'border-border-light dark:border-border-dark'} rounded-lg px-4 h-[52px] focus:outline-none transition-all`}
            >
              <div className="flex items-center">
                <span className="text-sm text-text-light/70 dark:text-text-dark/70 mr-2">Sort by:</span>
                <span className="text-text-light dark:text-text-dark font-medium">{sortBy}</span>
              </div>
              <span className={`material-icons-outlined text-text-light/70 dark:text-text-dark/70 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {isSortOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
                {(['Performance', 'TVL', 'APY', 'Newest'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                      ${sortBy === option 
                        ? 'bg-primary text-black font-semibold' 
                        : 'text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/5'}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-1 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-1 h-[52px]">
            {(['All', 'ETH', 'USDC', 'WBTC'] as const).map((asset) => (
              <button
                key={asset}
                onClick={() => setAssetFilter(asset)}
                className={`flex-1 text-sm font-semibold rounded-md transition-colors
                  ${assetFilter === asset 
                    ? 'bg-primary text-black' 
                    : 'text-text-light/70 dark:text-text-dark/70 hover:bg-black/5 dark:hover:bg-white/5'}
                `}
              >
                {asset}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-light/50 dark:text-text-dark/50">search</span>
            <input 
              type="search" 
              placeholder="Search vaults..." 
              className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg py-3.5 pl-12 pr-4 focus:ring-1 focus:ring-primary focus:border-primary text-text-light dark:text-text-dark placeholder-text-light/50 dark:placeholder-text-dark/50 outline-none transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredVaults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map(vault => (
            <VaultCard 
              key={vault.id} 
              vault={vault} 
              onViewDetails={(v) => {
                setSelectedVault(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-icons-outlined text-6xl text-text-light/20 dark:text-text-dark/20 mb-4">search_off</span>
          <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">No vaults found</h3>
          <p className="text-text-light/50 dark:text-text-dark/50 max-w-md">
            We couldn't find any vaults matching your search criteria. Try adjusting your filters or search term.
          </p>
          <button 
             onClick={() => { setSearchQuery(''); setAssetFilter('All'); }}
             className="mt-6 text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};