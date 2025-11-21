import React from 'react';
import { Vault } from '../types';

interface FeaturedVaultProps {
  vault: Vault;
  onInvest: () => void;
}

export const FeaturedVault: React.FC<FeaturedVaultProps> = ({ vault, onInvest }) => {
  return (
    <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 mb-12">
      <div className="flex-1 w-full">
        <div className="flex items-center gap-4 mb-4">
          <img 
            alt="Vault logo" 
            className="w-10 h-10 rounded-full" 
            src={vault.managerAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCH7RmxvHMzXsY_aiNdG7YgliIOzbKcDll-Lih34f84TPwpTCNzoiV8N2CYH5vmEZTjMBzjMWx4ymCK9U0zSGl3m2MrUCJWzOD4l91JHXy7x5CzlvkD5CwTL8uVLQtI-1-s8OFiQnFD2Ka6BFrxHwpVCD6TbpzQGCxSC1VMQgwzWJhKkSGxUN81UnEIu-_qPG-RD932F8U4cvq0k944c3-9h5U5Hs_syMLOY4cbmbMKdCZZxB3UP1E5UL9T1AGPzsRDjHKwi8bjogI"}
          />
          <div>
            <h2 className="text-xl font-bold font-display text-text-light dark:text-text-dark">{vault.name}</h2>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70">by {vault.manager}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-1">TVL</p>
            <p className="text-2xl font-bold font-display text-text-light dark:text-text-dark">${(vault.tvl / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-1">APY</p>
            <p className="text-2xl font-bold font-display text-text-light dark:text-text-dark">{vault.apy.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-1">7d</p>
            <p className="text-2xl font-bold font-display text-green-500">+{vault.weeklyChange.toFixed(1)}%</p>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onInvest();
          }}
          className="w-full sm:w-auto bg-primary text-black font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 cursor-pointer"
        >
          Invest Now
        </button>
      </div>
      
      <div className="w-full md:w-2/5 h-48 md:h-auto md:self-stretch overflow-hidden rounded-lg">
        <img 
          alt="Performance mini-chart showing an upward trend" 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjZVTppMkmea6BQPf9Sc_PGC14Yq0ra-YJHlhVPjJB7qnW5_C_aECUzJQkgNQGOkLx_qYdZmFRv6UTUs9_wD7VCH95I_Hq6ScAIChJcvrp_-yJWEg_suUmyjfRmOMbBcOFJSOh5O655ZbbATZqJuhMlRttSYlGyaoS86i5vkhoac-ZiPTYuCbg-hvRHYecmC46qB4AlVVhnXLigwrqpEp0ptYiw_Z6hSJrBBJo-IRy8juS9U-YUJU1-8b4_v6viLsEQ7B3zEfKHxs"
        />
      </div>
    </div>
  );
};