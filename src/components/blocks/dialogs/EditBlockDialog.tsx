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

interface EditBlockDialogProps {
  block: UIBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveChanges: (blockId: string, parameters: Record<string, unknown>) => void;
}

export const EditBlockDialog: React.FC<EditBlockDialogProps> = ({
  block,
  open,
  onOpenChange,
  onSaveChanges
}) => {
  const [editedParameters, setEditedParameters] = useState<Record<string, unknown>>({});

  // Reset parameters when block changes
  useEffect(() => {
    if (block) {
      setEditedParameters({ ...block.parameters });
    }
  }, [block]);

  if (!block) return null;

  const handleParameterChange = (key: string, value: unknown) => {
    setEditedParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveChanges = () => {
    onSaveChanges(block.id, editedParameters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Block Parameters</DialogTitle>
          <DialogDescription>
            Modify the parameters for {block.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {Object.entries(editedParameters).map(([key, value]) => {
              // Render different input types based on parameter value
              if (typeof value === 'boolean') {
                return (
                  <div key={key} className="flex items-center">
                    <input
                      id={key}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={value as boolean}
                      onChange={(e) => handleParameterChange(key, e.target.checked)}
                    />
                    <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                  </div>
                );
              } else if (typeof value === 'number') {
                return (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      id={key}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={value as number}
                      onChange={(e) => handleParameterChange(key, parseFloat(e.target.value))}
                    />
                  </div>
                );
              } else if (Array.isArray(value)) {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {value.map((item, index) => (
                        <div key={index} className="flex items-center mb-2 last:mb-0">
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={item}
                            onChange={(e) => {
                              const newArray = [...value];
                              newArray[index] = e.target.value;
                              handleParameterChange(key, newArray);
                            }}
                          />
                          <button 
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              const newArray = value.filter((_, i) => i !== index);
                              handleParameterChange(key, newArray);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button 
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          const newArray = [...value, ''];
                          handleParameterChange(key, newArray);
                        }}
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      id={key}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={value as string}
                      onChange={(e) => handleParameterChange(key, e.target.value)}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlockDialog;
