/**
 * Transformation Interface Component
 * 
 * This component provides the interface for transforming static HTML content
 * into interactive blocks. It displays the original content, highlights
 * detected mathematical patterns, and allows the user to select and 
 * configure transformations.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  generateTransformationSuggestions, 
  parseHtmlContent,
  TransformationSuggestion 
} from '@/lib/utils/html-parser';
import { EquationExplorerParameters } from '@/lib/block-templates/equation-explorer-block';
import { ProblemSolverParameters } from '@/lib/block-templates/problem-solver-block';
import { ConceptVisualizerParameters } from '@/lib/block-templates/concept-visualizer-block';
import { DataExplorerParameters } from '@/lib/block-templates/data-explorer-block';
import dynamic from 'next/dynamic';

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

interface TransformationInterfaceProps {
  htmlContent: string;
  onTransformationComplete?: (blocks: Array<{
    id: string;
    type: string;
    parameters: Record<string, unknown>;
    title: string;
    description: string;
  }>) => void;
}

export default function TransformationInterface({
  htmlContent,
  onTransformationComplete
}: TransformationInterfaceProps) {
  const [suggestions, setSuggestions] = useState<TransformationSuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [transformedBlocks, setTransformedBlocks] = useState<Array<{
    id: string;
    type: string;
    parameters: Record<string, unknown>;
    title: string;
    description: string;
  }>>([]);
  const [activeTab, setActiveTab] = useState<'original' | 'preview'>('original');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Analyze HTML content when component mounts or content changes
  useEffect(() => {
    if (htmlContent) {
      analyzeContent();
    }
  }, [htmlContent]);

  // Function to analyze the HTML content and generate transformation suggestions
  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    try {
      // Parse the HTML content
      parseHtmlContent(htmlContent);
      
      // Generate transformation suggestions
      const transformationSuggestions = generateTransformationSuggestions(htmlContent);
      setSuggestions(transformationSuggestions);
      
      // By default, select high-confidence suggestions
      const highConfidenceSuggestions = transformationSuggestions
        .filter(suggestion => suggestion.confidence >= 0.7)
        .map(suggestion => suggestion.type + ':' + suggestion.sourceElements[0].textContent);
      setSelectedSuggestions(highConfidenceSuggestions);
      
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to handle suggestion selection toggle
  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId) 
        ? prev.filter(id => id !== suggestionId) 
        : [...prev, suggestionId]
    );
  };

  // Function to apply selected transformations
  const applyTransformations = () => {
    const blocks = suggestions
      .filter(suggestion => {
        const suggestionId = suggestion.type + ':' + suggestion.sourceElements[0].textContent;
        return selectedSuggestions.includes(suggestionId);
      })
      .map((suggestion, index) => {
        // Create a block configuration based on the suggestion
        return {
          id: `block-${index}-${Date.now()}`,
          type: suggestion.type,
          parameters: suggestion.blockParameters,
          title: suggestion.description,
          description: `Transformed from ${suggestion.sourceElements[0].tagName} element`
        };
      });
    
    setTransformedBlocks(blocks);
    setActiveTab('preview');
    
    if (onTransformationComplete) {
      onTransformationComplete(blocks);
    }
  };

  // Generate a unique ID for a suggestion
  const getSuggestionId = (suggestion: TransformationSuggestion) => {
    return suggestion.type + ':' + suggestion.sourceElements[0].textContent;
  };

  // Render a block based on its type and parameters
  const renderBlock = (block: {
    id: string;
    type: string;
    parameters: Record<string, unknown>;
    title: string;
    description: string;
  }) => {
    switch (block.type) {
      case 'equationExplorer':
        // Ensure the parameters match what the component expects
        const equationParams: EquationExplorerParameters = {
          equation: String(block.parameters.equation || 'y = x'),
          variables: Array.isArray(block.parameters.variables) 
            ? block.parameters.variables.map(v => String(v)) 
            : ['x'],
          range: (block.parameters.range as Record<string, [number, number]>) || { x: [-10, 10] },
          initialValues: (block.parameters.initialValues as Record<string, number>) || { x: 0 },
          // Optional parameters
          step: typeof block.parameters.step === 'number' ? block.parameters.step : 0.1,
          showGraph: typeof block.parameters.showGraph === 'boolean' ? block.parameters.showGraph : true,
          showFormula: typeof block.parameters.showFormula === 'boolean' ? block.parameters.showFormula : true,
          showTable: typeof block.parameters.showTable === 'boolean' ? block.parameters.showTable : false,
          graphDomain: Array.isArray(block.parameters.graphDomain) 
            ? block.parameters.graphDomain as [number, number] 
            : [-10, 10],
          graphRange: Array.isArray(block.parameters.graphRange) 
            ? block.parameters.graphRange as [number, number] 
            : [-10, 10],
        };
        
        return (
          <EquationExplorer
            key={block.id}
            id={block.id}
            parameters={equationParams}
            title={block.title}
            description={block.description}
          />
        );
        
      case 'problemSolver':
      case 'problem-solver':
        // Ensure the parameters match what the component expects
        const problemParams: ProblemSolverParameters = {
          problem: String(block.parameters.problem || 'Solve for x: 2x + 3 = 7'),
          steps: Array.isArray(block.parameters.steps) 
            ? block.parameters.steps 
            : [
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
          // Optional parameters
          showHints: typeof block.parameters.showHints === 'boolean' ? block.parameters.showHints : true,
          progressiveReveal: typeof block.parameters.progressiveReveal === 'boolean' ? block.parameters.progressiveReveal : true,
          requireUserInput: typeof block.parameters.requireUserInput === 'boolean' ? block.parameters.requireUserInput : false,
          feedbackLevel: ['minimal', 'moderate', 'detailed'].includes(String(block.parameters.feedbackLevel)) 
            ? block.parameters.feedbackLevel as 'minimal' | 'moderate' | 'detailed' 
            : 'detailed',
          solutionVisible: ['always', 'after-attempt', 'never'].includes(String(block.parameters.solutionVisible)) 
            ? block.parameters.solutionVisible as 'always' | 'after-attempt' | 'never' 
            : 'after-attempt',
        };
        
        return (
          <ProblemSolver
            key={block.id}
            id={block.id}
            parameters={problemParams}
            title={block.title}
            description={block.description}
          />
        );
        
      case 'conceptVisualizer':
      case 'concept-visualizer':
        // Ensure the parameters match what the component expects
        const conceptParams: ConceptVisualizerParameters = {
          conceptType: String(block.parameters.conceptType || 'function-transformation') as 
            'function-transformation' | 'vector-operation' | 'geometric-transformation' | 
            'trigonometric-circle' | 'coordinate-system' | 'slope-intercept',
          baseFunction: String(block.parameters.baseFunction || 'y = x^2'),
          // Optional parameters
          transformations: Array.isArray(block.parameters.transformations) 
            ? block.parameters.transformations 
            : [
                { type: 'translation', axis: 'x', value: 0 },
                { type: 'translation', axis: 'y', value: 0 },
                { type: 'scale', axis: 'x', value: 1 },
                { type: 'scale', axis: 'y', value: 1 },
              ],
          domain: Array.isArray(block.parameters.domain) 
            ? block.parameters.domain as [number, number] 
            : [-10, 10],
          range: Array.isArray(block.parameters.range) 
            ? block.parameters.range as [number, number] 
            : [-10, 10],
          showGrid: typeof block.parameters.showGrid === 'boolean' ? block.parameters.showGrid : true,
          showAxis: typeof block.parameters.showAxis === 'boolean' ? block.parameters.showAxis : true,
          showLabels: typeof block.parameters.showLabels === 'boolean' ? block.parameters.showLabels : true,
          interactive: typeof block.parameters.interactive === 'boolean' ? block.parameters.interactive : true,
          animationSpeed: typeof block.parameters.animationSpeed === 'number' ? block.parameters.animationSpeed : 1,
          description: typeof block.parameters.description === 'string' 
            ? block.parameters.description 
            : 'Explore how transformations affect the graph of a function',
        };
        
        return (
          <ConceptVisualizer
            key={block.id}
            id={block.id}
            parameters={conceptParams}
            title={block.title}
            description={block.description}
          />
        );
      
      case 'dataExplorer':
      case 'data-explorer':
        // Ensure the parameters match what the component expects
        const dataParams: DataExplorerParameters = {
          dataSource: String(block.parameters.dataSource || 'inline') as 'inline' | 'url' | 'csv' | 'json',
          data: Array.isArray(block.parameters.data) 
            ? block.parameters.data 
            : [
                { x: 1, y: 2 },
                { x: 2, y: 4 },
                { x: 3, y: 9 },
                { x: 4, y: 16 },
                { x: 5, y: 25 }
              ],
          chartType: String(block.parameters.chartType || 'scatter') as 
            'line' | 'bar' | 'scatter' | 'pie' | 'histogram' | 'box' | 'heatmap',
          dataColumns: Array.isArray(block.parameters.dataColumns) 
            ? block.parameters.dataColumns as string[]
            : ['x', 'y'],
          title: String(block.parameters.title || 'Data Visualization'),
          regressionOptions: typeof block.parameters.regressionOptions === 'object' && block.parameters.regressionOptions !== null
            ? block.parameters.regressionOptions as DataExplorerParameters['regressionOptions']
            : {
                enabled: false,
                type: 'linear',
                displayEquation: true,
                displayR2: true
              }
        };
        
        return (
          <DataExplorer
            key={block.id}
            id={block.id}
            parameters={dataParams}
            title={block.title}
            description={block.description}
          />
        );
        
      default:
        return (
          <div key={block.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-lg font-medium">{block.title}</h3>
            <p className="text-sm text-gray-500">{block.description}</p>
            <p className="mt-2 text-sm">Block type &apos;{block.type}&apos; renderer not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'original'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('original')}
        >
          Original Content
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'preview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Interactive Preview
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
        {/* Main Content Area */}
        <div className="col-span-2 p-4 border-r border-gray-200">
          {activeTab === 'original' ? (
            <>
              {isAnalyzing ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Analyzing content...</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="prose max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: htmlContent }} 
                      className="p-4 border border-gray-200 rounded bg-gray-50"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={analyzeContent} variant="outline" className="mr-2">
                      Re-analyze Content
                    </Button>
                    <Button onClick={applyTransformations}>
                      Apply Transformations
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              {transformedBlocks.length > 0 ? (
                transformedBlocks.map(block => renderBlock(block))
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <p className="text-gray-500">No transformations applied yet.</p>
                    <Button onClick={() => setActiveTab('original')} variant="outline" className="mt-2">
                      Go to Original Content
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-4">Detected Mathematics</h3>
          
          {isAnalyzing ? (
            <p className="text-sm text-gray-500">Analyzing content...</p>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => {
                const suggestionId = getSuggestionId(suggestion);
                const isSelected = selectedSuggestions.includes(suggestionId);
                
                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded border ${
                      isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                    } cursor-pointer`}
                    onClick={() => toggleSuggestion(suggestionId)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSuggestion(suggestionId)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {suggestion.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Confidence: {Math.round(suggestion.confidence * 100)}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {suggestion.sourceElements[0].textContent?.trim()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-4">
                <Button 
                  onClick={applyTransformations} 
                  className="w-full"
                  disabled={selectedSuggestions.length === 0}
                >
                  Apply Selected ({selectedSuggestions.length})
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">No mathematical patterns detected.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try selecting a different piece of content or manually create blocks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
