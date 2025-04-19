'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export interface ProjectFile {
  id: string;
  name: string;
  type: 'source' | 'block';
}

interface ProjectSidebarProps {
  files: ProjectFile[];
  onFileClick?: (file: ProjectFile) => void;
  onAddFileClick?: () => void;
}

/**
 * Sidebar component for the project view showing file list
 */
export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  files,
  onFileClick = () => {},
  onAddFileClick = () => {}
}) => {
  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Files</h2>
        <div className="space-y-1">
          {files.map((file) => (
            <button
              key={file.id}
              className="flex items-center px-2 py-2 w-full rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => onFileClick(file)}
            >
              {file.type === 'source' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-orange-500">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8 13h2" />
                  <path d="M8 17h2" />
                  <path d="M14 13h2" />
                  <path d="M14 17h2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 8h6M9 12h6M9 16h6" />
                </svg>
              )}
              {file.name}
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <Button variant="outline" className="w-full justify-start" onClick={onAddFileClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
