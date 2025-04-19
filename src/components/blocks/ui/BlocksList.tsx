'use client';

import React from 'react';
import { UIBlock } from '@/types/block-types';
import { blockTypeIcons } from '@/components/blocks/ui/BlockTypeIcons';
import { formatDate } from '@/lib/blocks/constants';

interface BlocksListProps {
  blocks: UIBlock[];
  onEditClick: (block: UIBlock) => void;
  onPreviewClick: (block: UIBlock) => void;
  onDuplicateClick: (block: UIBlock) => void;
  onRenameClick: (block: UIBlock) => void;
  onDeleteClick: (block: UIBlock) => void;
  onUseClick: (block: UIBlock) => void;
}

/**
 * Component for displaying a list of blocks in a table
 */
export const BlocksList: React.FC<BlocksListProps> = ({
  blocks,
  onEditClick,
  onPreviewClick,
  onDuplicateClick,
  onRenameClick,
  onDeleteClick,
  onUseClick
}) => {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Modified
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {blocks.map((block) => (
          <tr key={block.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="mr-3">
                  {blockTypeIcons[block.type]}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{block.name}</div>
                  <div className="text-sm text-gray-500">{block.description}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {block.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {block.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(block.lastModified)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onEditClick(block)}
                  className="text-indigo-600 hover:text-indigo-900"
                  title="Edit block parameters"
                >
                  Edit
                </button>
                <button
                  onClick={() => onPreviewClick(block)}
                  className="text-purple-600 hover:text-purple-900"
                  title="Preview this block"
                >
                  Preview
                </button>
                <button
                  onClick={() => onDuplicateClick(block)}
                  className="text-green-600 hover:text-green-900"
                  title="Create a duplicate of this block"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => onRenameClick(block)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Rename this block"
                >
                  Rename
                </button>
                <button
                  onClick={() => onDeleteClick(block)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete this block"
                >
                  Delete
                </button>
                <button 
                  onClick={() => onUseClick(block)}
                  className="text-amber-600 hover:text-amber-900"
                  title="Use this block in a project"
                >
                  Use
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BlocksList;
