import { useState } from 'react';
import { UIBlock } from '@/types/block-types';
import { mockBlocks } from '@/lib/blocks/constants';

interface UseBlocksManagerProps {
  initialBlocks?: UIBlock[];
}

interface UseBlocksManagerReturn {
  blocks: UIBlock[];
  filteredBlocks: UIBlock[];
  searchQuery: string;
  activeCategory: string;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  categories: string[];
  duplicateBlock: (block: UIBlock) => void;
  deleteBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<UIBlock>) => void;
  createBlock: (blockData: Omit<UIBlock, 'id' | 'lastModified'>) => UIBlock;
}

/**
 * Custom hook for managing blocks and their operations
 */
export const useBlocksManager = ({ 
  initialBlocks = mockBlocks 
}: UseBlocksManagerProps = {}): UseBlocksManagerReturn => {
  const [blocks, setBlocks] = useState<UIBlock[]>(initialBlocks);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Get all unique categories
  const categories = ['All', ...Array.from(new Set(blocks.map(block => block.category)))];

  // Filter blocks based on search query and category
  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         block.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || block.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  /**
   * Create a new block with a unique ID
   */
  const createBlock = (blockData: Omit<UIBlock, 'id' | 'lastModified'>): UIBlock => {
    const newBlock: UIBlock = {
      ...blockData,
      id: `block-${Date.now()}`,
      lastModified: new Date().toISOString()
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    return newBlock;
  };

  /**
   * Duplicate an existing block
   */
  const duplicateBlock = (block: UIBlock): void => {
    const newBlock: UIBlock = {
      ...block,
      id: `block-${Date.now()}`,
      name: `${block.name} (Copy)`,
      lastModified: new Date().toISOString()
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
  };

  /**
   * Delete a block by its ID
   */
  const deleteBlock = (blockId: string): void => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
  };

  /**
   * Update a block with new values
   */
  const updateBlock = (blockId: string, updates: Partial<UIBlock>): void => {
    setBlocks(prevBlocks => prevBlocks.map(block => 
      block.id === blockId 
        ? { 
            ...block, 
            ...updates, 
            lastModified: new Date().toISOString() 
          } 
        : block
    ));
  };

  return {
    blocks,
    filteredBlocks,
    searchQuery,
    activeCategory,
    setSearchQuery,
    setActiveCategory,
    categories,
    duplicateBlock,
    deleteBlock,
    updateBlock,
    createBlock
  };
};
