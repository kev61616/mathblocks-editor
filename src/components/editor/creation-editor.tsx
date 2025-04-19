/**
 * Creation Editor Component
 * 
 * This component provides the main interface for creating interactive math lessons
 * using a block-based approach. It includes block insertion, configuration, and
 * organization capabilities.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, DownloadIcon, TextIcon, CogIcon, Layers } from 'lucide-react';
import dynamic from 'next/dynamic';
import { EquationExplorerParameters } from '@/lib/block-templates/equation-explorer-block';
import { ProblemSolverParameters } from '@/lib/block-templates/problem-solver-block';
import { ConceptVisualizerParameters } from '@/lib/block-templates/concept-visualizer-block';
import { DataExplorerParameters } from '@/lib/block-templates/data-explorer-block';
import TextGenerationDialog from './text-generation-dialog';
import SelectFromLibraryDialog from '@/components/blocks/dialogs/SelectFromLibraryDialog';
import { UIBlock } from '@/types/block-types';

// Dynamically import block components to avoid SSR issues with browser APIs
const EquationExplorer = dynamic(
  () => import('@/components/blocks/equation-explorer'),
  { ssr: false }
);

const ProblemSolver = dynamic(
  () => import('@/components/blocks/problem-solver'),
  { ssr: false }
);

const ConceptVisualizer = dynamic(
  () => import('@/components/blocks/concept-visualizer'),
  { ssr: false }
);

const DataExplorer = dynamic(
  () => import('@/components/blocks/data-explorer'),
  { ssr: false }
);

// Define available block types
const BLOCK_TYPES = [
  {
    id: 'equation-explorer',
    name: 'Equation Explorer',
    description: 'Interactive visualization of mathematical functions',
    icon: '📊',
    defaultParams: {
      equation: 'y = x^2',
      variables: ['x'],
      range: { x: [-10, 10] },
      initialValues: { x: 0 },
    }
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Step-by-step guided problem solutions',
    icon: '🧩',
    defaultParams: {
      problem: 'Solve for x: 2x + 3 = 7',
      steps: [
        {
          description: 'Subtract 3 from both sides',
          expression: '2x = 4',
          explanation: 'To isolate the term with the variable, we subtract 3 from both sides of the equation.'
        },
        {
          description: 'Divide both sides by 2',
          expression: 'x = 2',
          explanation: 'To solve for x, we divide both sides by the coefficient of x, which is 2.'
        }
      ],
    }
  },
  {
    id: 'concept-visualizer',
    name: 'Concept Visualizer',
    description: 'Visual exploration of mathematical concepts',
    icon: '🔍',
    defaultParams: {
      conceptType: 'function-transformation',
      baseFunction: 'y = x^2',
      transformations: [
        { type: 'translation', axis: 'x', value: 0 },
        { type: 'translation', axis: 'y', value: 0 },
        { type: 'scale', axis: 'x', value: 1 },
        { type: 'scale', axis: 'y', value: 1 },
      ]
    }
  },
  {
    id: 'data-explorer',
    name: 'Data Explorer',
    description: 'Interactive data visualization and analysis',
    icon: '📈',
    defaultParams: {
      dataSource: 'inline',
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 9 },
        { x: 4, y: 16 },
        { x: 5, y: 25 }
      ],
      chartType: 'scatter',
      dataColumns: ['x', 'y'],
    }
  },
  {
    id: 'text-content',
    name: 'Text Content',
    description: 'Explanatory text with formatting options',
    icon: '📝',
    defaultParams: {
      content: 'Enter your text content here...',
      format: 'markdown'
    }
  }
];

// Type for generic block parameters
type BlockParameters = Record<string, unknown>;

// Interface for a block instance
interface BlockInstance {
  id: string;
  type: string;
  parameters: BlockParameters;
  title: string;
  description: string;
}

// Type assertions to help TypeScript understand parameter types
function asEquationExplorerParams(params: BlockParameters): EquationExplorerParameters {
  return params as unknown as EquationExplorerParameters;
}

function asProblemSolverParams(params: BlockParameters): ProblemSolverParameters {
  return params as unknown as ProblemSolverParameters;
}

function asConceptVisualizerParams(params: BlockParameters): ConceptVisualizerParameters {
  return params as unknown as ConceptVisualizerParameters;
}

function asDataExplorerParams(params: BlockParameters): DataExplorerParameters {
  return params as unknown as DataExplorerParameters;
}

// Interface for editor props
interface CreationEditorProps {
  initialBlocks?: BlockInstance[];
  projectId?: string; // Used for future integration with project management
  onSave?: (blocks: BlockInstance[]) => void;
}

export default function CreationEditor({
  initialBlocks = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectId, // Used for future integration with project management
  onSave
}: CreationEditorProps) {
  // State for blocks in the editor
  const [blocks, setBlocks] = useState<BlockInstance[]>(initialBlocks);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [editorTitle, setEditorTitle] = useState<string>('Untitled Lesson');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState<boolean>(false);
  const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState<boolean>(false);

  // Load blocks on initial render if provided
  useEffect(() => {
    if (initialBlocks.length > 0) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  // Mark editor as dirty when blocks change
  useEffect(() => {
    if (blocks.length > 0) {
      setIsDirty(true);
    }
  }, [blocks]);

  // Add a new block to the editor
  const addBlock = (blockType: string) => {
    const blockTemplate = BLOCK_TYPES.find(type => type.id === blockType);
    
    if (!blockTemplate) return;
    
    const newBlock: BlockInstance = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      parameters: { ...blockTemplate.defaultParams },
      title: blockTemplate.name,
      description: blockTemplate.description
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setActiveBlockId(newBlock.id);
    setIsBlockMenuOpen(false);
  };

  // Remove a block from the editor
  const removeBlock = (blockId: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== blockId));
    if (activeBlockId === blockId) {
      setActiveBlockId(null);
    }
  };

  // Update a block's parameters
  const updateBlockParameters = (blockId: string, newParameters: Record<string, unknown>) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId 
          ? { ...block, parameters: { ...block.parameters, ...newParameters } }
          : block
      )
    );
  };

  // Move a block up or down in the order
  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    if (blockIndex === -1) return;
    
    if (direction === 'up' && blockIndex > 0) {
      const newBlocks = [...blocks];
      [newBlocks[blockIndex], newBlocks[blockIndex - 1]] = [newBlocks[blockIndex - 1], newBlocks[blockIndex]];
      setBlocks(newBlocks);
    } else if (direction === 'down' && blockIndex < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
      setBlocks(newBlocks);
    }
  };

  // Save the current state of the editor
  const saveProject = () => {
    if (onSave) {
      onSave(blocks);
    }
    setIsDirty(false);
  };

  // Generate HTML export of the lesson
  const exportHTML = () => {
    // This will be implemented in the export system
    console.log('Export HTML functionality will be implemented');
  };

  // Request AI-generated content with LLM integration
  const generateContent = () => {
    setIsGenerateDialogOpen(true);
  };

  // Handle inserting generated text
  const handleInsertGeneratedText = (text: string) => {
    const newBlock: BlockInstance = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text-content',
      parameters: { 
        content: text,
        format: 'markdown'
      },
      title: 'Generated Content',
      description: 'AI-generated explanatory text'
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  // Handle adding a block from the library
  const handleAddFromLibrary = (block: UIBlock) => {
    // Convert UIBlock to BlockInstance
    const newBlock: BlockInstance = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: block.type,
      parameters: { ...block.parameters },
      title: block.name,
      description: block.description
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setActiveBlockId(newBlock.id);
  };

  // Render a block based on its type
  const renderBlock = (block: BlockInstance) => {
    const isActive = activeBlockId === block.id;
    
    return (
      <div 
        key={block.id} 
        className={`mb-6 relative ${isActive ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => setActiveBlockId(block.id)}
      >
        {isActive && (
          <div className="absolute right-2 top-2 flex space-x-2 z-10">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => moveBlock(block.id, 'up')}
              disabled={blocks.findIndex(b => b.id === block.id) === 0}
            >
              ↑
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => moveBlock(block.id, 'down')}
              disabled={blocks.findIndex(b => b.id === block.id) === blocks.length - 1}
            >
              ↓
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => removeBlock(block.id)}
            >
              ×
            </Button>
          </div>
        )}
        
        {block.type === 'equation-explorer' && (
          <EquationExplorer
            id={block.id}
            parameters={asEquationExplorerParams(block.parameters)}
            title={block.title}
            description={block.description}
          />
        )}
        
        {block.type === 'problem-solver' && (
          <ProblemSolver
            id={block.id}
            parameters={asProblemSolverParams(block.parameters)}
            title={block.title}
            description={block.description}
          />
        )}
        
        {block.type === 'concept-visualizer' && (
          <ConceptVisualizer
            id={block.id}
            parameters={asConceptVisualizerParams(block.parameters)}
            title={block.title}
            description={block.description}
          />
        )}
        
        {block.type === 'data-explorer' && (
          <DataExplorer
            id={block.id}
            parameters={asDataExplorerParams(block.parameters)}
            title={block.title}
            description={block.description}
          />
        )}
        
        {block.type === 'text-content' && (
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-lg text-blue-600">{block.title}</h3>
            <div className="prose mt-2">
              <p>{String(block.parameters.content || '')}</p>
            </div>
            {isActive && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  value={String(block.parameters.content || '')}
                  onChange={(e) => updateBlockParameters(block.id, { content: e.target.value })}
                  rows={5}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-0 focus:ring-0 focus:outline-none"
          />
          {isDirty && <span className="ml-2 text-xs text-gray-500">(Unsaved)</span>}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={generateContent}>
            <TextIcon className="w-4 h-4 mr-2" />
            Generate Text
          </Button>
          <Button variant="outline" onClick={exportHTML}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={saveProject}>Save</Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Block Insertion Buttons */}
            <div className="flex justify-center space-x-2">
              <Button
                onClick={() => setIsBlockMenuOpen(!isBlockMenuOpen)}
                variant="outline"
                className="w-full max-w-md"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Block
              </Button>
              <Button
                onClick={() => setIsLibraryDialogOpen(true)}
                variant="outline"
                className="w-full max-w-md"
              >
                <Layers className="w-4 h-4 mr-2" />
                From Library
              </Button>
            </div>

            {/* Block Selection Menu */}
            {isBlockMenuOpen && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg max-w-md mx-auto mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Select Block Type</h3>
                <div className="grid grid-cols-1 gap-2">
                  {BLOCK_TYPES.map((blockType) => (
                    <button
                      key={blockType.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md text-left"
                      onClick={() => addBlock(blockType.id)}
                    >
                      <div className="text-2xl">{blockType.icon}</div>
                      <div>
                        <div className="font-medium">{blockType.name}</div>
                        <div className="text-xs text-gray-500">{blockType.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Blocks Content */}
            <div className="space-y-6">
              {blocks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">Your lesson is empty. Add a block to get started.</p>
                </div>
              ) : (
                blocks.map(block => renderBlock(block))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h3 className="font-medium text-gray-700 mb-3">Properties</h3>
              
              {activeBlockId ? (
                <div>
                  <div className="text-sm text-gray-500 mb-4">
                    Configure the selected block
                  </div>
                  {/* Block configuration UI will go here */}
                  <div className="text-center mt-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveBlockId(null)}
                    >
                      <CogIcon className="w-4 h-4 mr-2" />
                      Edit Block Settings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Select a block to configure its properties
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <TextGenerationDialog
        isOpen={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onInsert={handleInsertGeneratedText}
      />
      
      <SelectFromLibraryDialog
        open={isLibraryDialogOpen}
        onOpenChange={setIsLibraryDialogOpen}
        onSelectBlock={handleAddFromLibrary}
      />
    </div>
  );
}
