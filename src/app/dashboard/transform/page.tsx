/**
 * Content Transformation Page
 * 
 * This page allows users to transform static HTML content into interactive blocks.
 * It provides a file upload interface and the transformation interface.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the TransformationInterface to avoid SSR issues
const TransformationInterface = dynamic(
  () => import('@/components/editor/transformation-interface'),
  { ssr: false }
);

export default function TransformPage() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [transformedBlocks, setTransformedBlocks] = useState<Array<{
    id: string;
    type: string;
    parameters: Record<string, unknown>;
    title: string;
    description: string;
  }>>([]);
  const [step, setStep] = useState<'upload' | 'transform' | 'save'>('upload');

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
      setIsUploading(false);
      setStep('transform');
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading the file. Please try again.');
    };
    reader.readAsText(file);
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      alert('Please upload an HTML file.');
      return;
    }
    
    setIsUploading(true);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
      setIsUploading(false);
      setStep('transform');
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading the file. Please try again.');
    };
    reader.readAsText(file);
  };

  // Prevent default behavior for drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle transformation completion
  const handleTransformationComplete = (blocks: Array<{
    id: string;
    type: string;
    parameters: Record<string, unknown>;
    title: string;
    description: string;
  }>) => {
    setTransformedBlocks(blocks);
    setStep('save');
  };

  // Render file upload UI
  const renderUploadStep = () => (
    <div className="mt-8 max-w-4xl mx-auto">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Uploading {fileName}...</p>
          </div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-12 w-12 text-gray-400"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <p className="mt-4 text-sm text-gray-600">
              Drag and drop your HTML file, or{' '}
              <label className="text-blue-500 font-medium cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-gray-500">Supports: .html, .htm</p>
          </>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Sample Content</h2>
        <p className="mt-1 text-sm text-gray-500">
          Don&apos;t have HTML content? Try one of our samples:
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium">Linear Equations</h3>
            <p className="text-sm text-gray-500 mt-1">
              Content about linear equations with examples and practice problems.
            </p>
          </div>
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h3 className="font-medium">Quadratic Functions</h3>
            <p className="text-sm text-gray-500 mt-1">
              Explanations of quadratic functions with graphs and formulas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render transformation step
  const renderTransformStep = () => (
    <div className="mt-8 max-w-6xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Transform: {fileName}</h2>
        <Button variant="outline" onClick={() => setStep('upload')}>
          Upload Different File
        </Button>
      </div>
      
      <TransformationInterface 
        htmlContent={htmlContent} 
        onTransformationComplete={handleTransformationComplete} 
      />
    </div>
  );

  // Render save step
  const renderSaveStep = () => (
    <div className="mt-8 max-w-4xl mx-auto">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-green-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Transformation Complete
            </h3>
            <p className="mt-1 text-sm text-green-700">
              {transformedBlocks.length} blocks were created successfully.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Save Your Work</h3>
          <div className="mt-5">
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700"
            >
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder={fileName.replace(/\.(html|htm)$/, '')}
            />
          </div>
          <div className="mt-5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder="Briefly describe your interactive content"
            ></textarea>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6">
            <Button variant="outline" onClick={() => setStep('transform')}>
              Back to Editor
            </Button>
            <Button>Save & Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-blue-600 font-bold text-xl">
                MathBlocks Editor
              </Link>
            </div>
            <div>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Transform HTML Content</h1>
          <p className="mt-2 text-gray-600">
            Upload your HTML math content to transform it into interactive blocks.
          </p>
        </div>

        {/* Step indicator */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-between">
            <span
              className={`px-3 bg-gray-50 text-sm font-medium ${
                step === 'upload' ? 'text-blue-600' : 'text-gray-500'
              }`}
              style={{ width: '33%', textAlign: 'center' }}
            >
              <span
                className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                  step === 'upload'
                    ? 'bg-blue-100 text-blue-800'
                    : step === 'transform' || step === 'save'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                } mr-2`}
              >
                1
              </span>
              Upload Content
            </span>
            <span
              className={`px-3 bg-gray-50 text-sm font-medium ${
                step === 'transform' ? 'text-blue-600' : step === 'save' ? 'text-gray-500' : 'text-gray-400'
              }`}
              style={{ width: '33%', textAlign: 'center' }}
            >
              <span
                className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                  step === 'transform'
                    ? 'bg-blue-100 text-blue-800'
                    : step === 'save'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                } mr-2`}
              >
                2
              </span>
              Transform
            </span>
            <span
              className={`px-3 bg-gray-50 text-sm font-medium ${
                step === 'save' ? 'text-blue-600' : 'text-gray-400'
              }`}
              style={{ width: '33%', textAlign: 'center' }}
            >
              <span
                className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                  step === 'save'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                } mr-2`}
              >
                3
              </span>
              Save Project
            </span>
          </div>
        </div>

        {/* Step Content */}
        {step === 'upload' && renderUploadStep()}
        {step === 'transform' && renderTransformStep()}
        {step === 'save' && renderSaveStep()}
      </main>
    </div>
  );
}
