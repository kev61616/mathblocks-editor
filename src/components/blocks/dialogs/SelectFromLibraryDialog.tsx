'use client';

import React, { useState, useEffect } from 'react';
import { UIBlock } from '@/types/block-types';
import { blockTypeIcons } from '@/components/blocks/ui/BlockTypeIcons';
import { formatDate } from '@/lib/blocks/constants';
import { useBlocksManager } from '@/hooks/useBlocksManager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SelectFromLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBlock: (block: UIBlock) => void;
}

/**
 * Dialog for selecting a block from the library to use in the editor
 */
export const SelectFromLibraryDialog: React.FC<SelectFromLibraryDialogProps> = ({
  open,
  onOpenChange,
  onSelectBlock
}) => {
  const {
    filteredBlocks,
    searchQuery,
    activeCategory,
    setSearchQuery,
    setActiveCategory,
    categories
  } = useBlocksManager();

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Reset selected block when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedBlockId(null);
    }
  }, [open]);

  const handleSelectBlock = () => {
    const selectedBlock = filteredBlocks.find(block => block.id === selectedBlockId);
    if (selectedBlock) {
      onSelectBlock(selectedBlock);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Block from Library</DialogTitle>
          <DialogDescription>
            Choose a block from your library to add to your lesson.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-4 p-1">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search blocks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
            </div>
            
            <Tabs 
              defaultValue="All" 
              className="w-full md:w-auto" 
              value={activeCategory} 
              onValueChange={setActiveCategory}
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-5">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Block List */}
          <div className="flex-1 overflow-auto border rounded-md">
            {filteredBlocks.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto mb-4 text-gray-400">
                  <Filter className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredBlocks.map((block) => (
                  <div 
                    key={block.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${selectedBlockId === block.id 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setSelectedBlockId(block.id)}
                  >
                    <div className="flex items-start mb-2">
                      <div className="p-2 rounded-md bg-gray-100 mr-3">
                        {blockTypeIcons[block.type]}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{block.name}</h3>
                        <p className="text-xs text-gray-500">{block.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{block.description}</p>
                    <div className="text-xs text-gray-500">{formatDate(block.lastModified)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelectBlock}
            disabled={!selectedBlockId}
          >
            Use Selected Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectFromLibraryDialog;
