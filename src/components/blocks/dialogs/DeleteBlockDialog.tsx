'use client';

import React from 'react';
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

interface DeleteBlockDialogProps {
  block: UIBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (blockId: string) => void;
}

export const DeleteBlockDialog: React.FC<DeleteBlockDialogProps> = ({
  block,
  open,
  onOpenChange,
  onDelete
}) => {
  if (!block) return null;

  const handleDelete = () => {
    onDelete(block.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Block</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this block? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium text-gray-900">{block.name}</p>
            <p className="text-sm text-gray-500 mt-1">{block.description}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
          >
            Delete Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBlockDialog;
