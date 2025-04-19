'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProjectHeaderProps {
  projectName: string;
}

/**
 * Header component for the project view
 */
export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectName }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex-shrink-0">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">{projectName}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Preview
          </Button>
          <Button size="sm">
            Export
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;
