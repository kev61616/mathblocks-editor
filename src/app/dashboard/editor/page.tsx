'use client';

import React from 'react';
import CreationEditor from '@/components/editor/creation-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Math Lesson Creator</h1>
          </div>
        </div>
      </div>

      {/* Editor component */}
      <div className="max-w-7xl mx-auto">
        <CreationEditor />
      </div>
    </div>
  );
}
