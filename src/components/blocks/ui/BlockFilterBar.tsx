'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface BlockFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  hasFiltersApplied: boolean;
  onClearFilters: () => void;
}

/**
 * Component for filtering and searching blocks
 */
export const BlockFilterBar: React.FC<BlockFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
  hasFiltersApplied,
  onClearFilters
}) => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search blocks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        
        <Tabs 
          defaultValue="All" 
          className="w-full md:w-auto" 
          value={activeCategory} 
          onValueChange={setActiveCategory}
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-2">
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {hasFiltersApplied && (
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlockFilterBar;
