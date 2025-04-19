'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface EditorContentProps {
  htmlContent?: string;
  jsonContent?: string;
  selectedFile?: {
    id: string;
    name: string;
    type: 'source' | 'block';
  } | null;
}

/**
 * Main editor content area with tabs for different views
 */
export const EditorContent: React.FC<EditorContentProps> = ({
  htmlContent = '',
  jsonContent = '',
  selectedFile = null
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <Tabs defaultValue="visual" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 bg-gray-50 px-4">
          <TabsList className="bg-transparent h-12 flex-row space-x-2 overflow-auto">
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="flex-1 overflow-auto p-6">
          {selectedFile ? (
            <div>
              {/* Here we would render the actual block editor based on selectedFile */}
              <p>Editing {selectedFile.name}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h6" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Select a block to edit</h3>
              <p className="text-sm max-w-md mx-auto">
                Choose a block file from the sidebar to start editing, or select a source file to analyze and transform into blocks.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="html" className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-md p-4 font-mono text-sm text-gray-800 h-full overflow-auto">
            {/* HTML code display */}
            <pre>{htmlContent || 'No HTML content available'}</pre>
          </div>
        </TabsContent>

        <TabsContent value="json" className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-md p-4 font-mono text-sm text-gray-800 h-full overflow-auto">
            {/* JSON content display */}
            <pre>{jsonContent || 'No JSON content available'}</pre>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 overflow-auto p-6 flex justify-center items-start">
          <div className="bg-white border border-gray-200 rounded-md shadow-sm w-full max-w-2xl">
            <div className="border-b border-gray-200 p-4">
              <h3 className="font-bold text-lg text-blue-600">Preview</h3>
              <p className="text-sm text-gray-600 mt-1">
                This is a preview of how your block will look in a lesson.
              </p>
            </div>
            <div className="p-4">
              {selectedFile ? (
                <div>
                  {/* Render a preview based on the selected file and its type */}
                  {selectedFile.type === 'block' ? (
                    <div className="space-y-4">
                      {/* This would be dynamically generated based on block type */}
                      <div className="bg-gray-100 rounded-md aspect-video flex items-center justify-center text-gray-400">
                        Preview for {selectedFile.name}
                      </div>
                      
                      {/* Example interactive controls */}
                      <div className="space-y-4">
                        <div>
                          <label className="flex justify-between text-sm mb-1">
                            <span>Parameter 1</span>
                            <span className="font-medium">2</span>
                          </label>
                          <input type="range" min="-5" max="5" step="0.1" defaultValue="2" className="w-full" />
                        </div>
                        
                        <div className="pt-2">
                          <div className="text-center font-medium text-lg">
                            Result
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <p>HTML source file preview</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>Select a file to preview</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorContent;
