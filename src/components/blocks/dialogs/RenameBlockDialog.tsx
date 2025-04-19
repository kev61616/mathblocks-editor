'use client';

import React, { useState, useEffect } from 'react';
import { UIBlock } from '@/types/block-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RenameBlockDialogProps {
  block: UIBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (blockId: string, name: string, description: string) => void;
}

export const RenameBlockDialog: React.FC<RenameBlockDialogProps> = ({
  block,
  open,
  onOpenChange,
  onRename
}) => {
  const [blockName, setBlockName] = useState('');
  const [blockDescription, setBlockDescription] = useState('');

  // Update the form when the block changes
  useEffect(() => {
    if (block) {
      setBlockName(block.name);
      setBlockDescription(block.description);
    }
  }, [block]);

  if (!block) return null;

  const handleRename = () => {
    onRename(block.id, blockName, blockDescription);
    onOpenChange(false);
  };

  const isFormValid = blockName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Block</DialogTitle>
          <DialogDescription>
            Update the name and description for this block.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!isFormValid}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameBlockDialog;
