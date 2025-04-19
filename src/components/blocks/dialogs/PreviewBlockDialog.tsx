'use client';

import React from 'react';
import { UIBlock } from '@/types/block-types';
import { blockTypeIcons } from '@/components/blocks/ui/BlockTypeIcons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PreviewBlockDialogProps {
  block: UIBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PreviewBlockDialog: React.FC<PreviewBlockDialogProps> = ({
  block,
  open,
  onOpenChange
}) => {
  if (!block) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Block Preview: {block.name}</DialogTitle>
          <DialogDescription>
            Preview how this block will appear in a lesson.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-white border rounded-md p-6 w-full h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
                {blockTypeIcons[block.type]}
              </div>
              <h3 className="text-lg font-medium mb-2">{block.name}</h3>
              <p className="text-gray-500 mb-4">{block.description}</p>
              <div className="bg-gray-100 p-3 rounded inline-block mx-auto text-sm text-gray-700">
                <p>Block of type: <span className="font-medium">{block.type}</span></p>
                <p>Parameters: {Object.keys(block.parameters).length}</p>
                <div className="mt-2 text-left max-w-xs mx-auto">
                  <h4 className="font-medium mb-1">Parameter Values:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(block.parameters).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{key}:</span>{' '}
                        {typeof value === 'object' 
                          ? JSON.stringify(value) 
                          : String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 italic">Interactive preview would render here</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewBlockDialog;
