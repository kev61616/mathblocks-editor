'use client';

import React, { useState } from 'react';
import { UIBlock } from '@/types/block-types';
import { blockTypeDefinitions } from '@/lib/blocks/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CreateBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBlock: (blockData: Omit<UIBlock, 'id' | 'lastModified'>) => void;
}

export const CreateBlockDialog: React.FC<CreateBlockDialogProps> = ({
  open,
  onOpenChange,
  onCreateBlock
}) => {
  const [blockName, setBlockName] = useState('');
  const [blockDescription, setBlockDescription] = useState('');
  const [blockType, setBlockType] = useState<UIBlock['type']>('equation-explorer');
  const [blockCategory, setBlockCategory] = useState('Algebra');

  const handleCreateBlock = () => {
    const defaultParams = blockTypeDefinitions[blockType].defaultParameters;
    
    onCreateBlock({
      name: blockName,
      description: blockDescription,
      type: blockType,
      category: blockCategory,
      parameters: defaultParams
    });

    // Reset form
    setBlockName('');
    setBlockDescription('');
    setBlockType('equation-explorer');
    setBlockCategory('Algebra');
    onOpenChange(false);
  };

  const isFormValid = blockName.trim() && blockDescription.trim() && blockCategory.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Block</DialogTitle>
          <DialogDescription>
            Create a new block to use in your math lessons.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="blockType" className="block text-sm font-medium text-gray-700 mb-1">
              Block Type
            </label>
            <select
              id="blockType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as UIBlock['type'])}
            >
              {Object.entries(blockTypeDefinitions).map(([type, def]) => (
                <option key={type} value={type}>
                  {def.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {blockTypeDefinitions[blockType]?.description}
            </p>
          </div>
          <div>
            <label htmlFor="blockName" className="block text-sm font-medium text-gray-700 mb-1">
              Block Name
            </label>
            <input
              id="blockName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="e.g. Quadratic Function Explorer"
            />
          </div>
          <div>
            <label htmlFor="blockDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="blockDescription"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={blockDescription}
              onChange={(e) => setBlockDescription(e.target.value)}
              placeholder="Describe what this block does"
            />
          </div>
          <div>
            <label htmlFor="blockCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="blockCategory"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={blockCategory}
              onChange={(e) => setBlockCategory(e.target.value)}
              placeholder="e.g. Algebra, Geometry, Statistics"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateBlock} 
            disabled={!isFormValid}
          >
            Create Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlockDialog;
