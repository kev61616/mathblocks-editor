/**
 * Text Generation Dialog Component
 * 
 * This component provides a dialog interface for generating text content
 * using LLM services. It allows users to select content types and provide
 * prompts to generate explanations, examples, and more.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { generateText, GenerationParameters, GenerationResult } from '@/lib/llm/text-generation-service';

interface TextGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
}

export default function TextGenerationDialog({ 
  isOpen, 
  onClose, 
  onInsert 
}: TextGenerationDialogProps) {
  // State for generation parameters
  const [prompt, setPrompt] = useState<string>('');
  const [contentType, setContentType] = useState<'explanation' | 'introduction' | 'example' | 'summary'>('explanation');
  const [target, setTarget] = useState<'high-school' | 'middle-school' | 'elementary' | 'college'>('high-school');
  
  // State for generation process
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Handle content generation
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a prompt for generation');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const params: GenerationParameters = {
        prompt,
        contentType,
        target,
        temperature: 0.7
      };
      
      const result: GenerationResult = await generateText(params);
      setGeneratedText(result.text);
    } catch (err) {
      setError('Failed to generate text. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Insert the generated text and close the dialog
  const handleInsert = () => {
    onInsert(generatedText);
    onClose();
    
    // Reset the dialog state
    setPrompt('');
    setGeneratedText('');
  };

  // Reset the dialog when it's closed
  const handleClose = () => {
    onClose();
    setPrompt('');
    setGeneratedText('');
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Text Content</DialogTitle>
          <DialogDescription>
            Use AI to generate explanatory text for your lesson
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Generation Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content Type</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <Button
                variant={contentType === 'introduction' ? 'primary' : 'outline'}
                onClick={() => setContentType('introduction')}
                className="justify-start"
              >
                Introduction
              </Button>
              <Button
                variant={contentType === 'explanation' ? 'primary' : 'outline'}
                onClick={() => setContentType('explanation')}
                className="justify-start"
              >
                Explanation
              </Button>
              <Button
                variant={contentType === 'example' ? 'primary' : 'outline'}
                onClick={() => setContentType('example')}
                className="justify-start"
              >
                Example
              </Button>
              <Button
                variant={contentType === 'summary' ? 'primary' : 'outline'}
                onClick={() => setContentType('summary')}
                className="justify-start"
              >
                Summary
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Education Level</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <Button
                variant={target === 'elementary' ? 'primary' : 'outline'}
                onClick={() => setTarget('elementary')}
                className="justify-start"
              >
                Elementary
              </Button>
              <Button
                variant={target === 'middle-school' ? 'primary' : 'outline'}
                onClick={() => setTarget('middle-school')}
                className="justify-start"
              >
                Middle School
              </Button>
              <Button
                variant={target === 'high-school' ? 'primary' : 'outline'}
                onClick={() => setTarget('high-school')}
                className="justify-start"
              >
                High School
              </Button>
              <Button
                variant={target === 'college' ? 'primary' : 'outline'}
                onClick={() => setTarget('college')}
                className="justify-start"
              >
                College
              </Button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Prompt</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded h-24"
              placeholder={`What would you like to generate? For example:\n"Explain linear equations and their applications"`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Generation Button */}
          <div className="mb-4">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>

          {/* Generated Content */}
          {generatedText && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Generated Content</label>
              <div className="p-3 bg-gray-50 rounded border border-gray-200 max-h-60 overflow-y-auto">
                <div className="whitespace-pre-wrap">{generatedText}</div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleInsert} 
            disabled={!generatedText}
          >
            Insert Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
