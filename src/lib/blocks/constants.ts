import { UIBlock, BlockTypeRegistry } from '@/types/block-types';

/**
 * Registry simulation - in a real implementation these would come from the Block Registry
 */
export const blockTypeDefinitions: BlockTypeRegistry = {
  'equation-explorer': {
    name: 'Equation Explorer',
    description: 'Interactive visualization of equations and their properties',
    defaultParameters: {
      initialEquation: 'y = 2x + 1',
      showControls: true,
      variableRange: [-10, 10],
      showGrid: true,
    }
  },
  'concept-visualizer': {
    name: 'Concept Visualizer',
    description: 'Visual exploration of mathematical concepts',
    defaultParameters: {
      concept: 'quadratic_function',
      showLabels: true, 
      interactionMode: 'drag',
      showDescription: true,
    }
  },
  'problem-solver': {
    name: 'Problem Solver',
    description: 'Step-by-step interactive problem solver',
    defaultParameters: {
      problemType: 'linear_equation',
      showSteps: true,
      difficultyLevel: 'medium',
      autoCheck: true,
    }
  },
  'data-explorer': {
    name: 'Data Explorer',
    description: 'Statistical data visualization and analysis',
    defaultParameters: {
      chartType: 'bar',
      dataSource: 'sample',
      showStatistics: true,
      allowDataInput: true,
    }
  }
};

/**
 * Mock block data - in a real app, this would come from a database or API
 */
export const mockBlocks: UIBlock[] = [
  {
    id: 'block-1',
    name: 'Linear Equation Explorer',
    description: 'Interactive tool for exploring linear equations',
    type: 'equation-explorer',
    category: 'Algebra',
    lastModified: '2025-04-15T10:30:00Z',
    parameters: {
      initialSlope: 2,
      initialIntercept: -1,
      showControls: true,
      allowReset: true,
    }
  },
  {
    id: 'block-2',
    name: 'Quadratic Function Visualizer',
    description: 'Visual exploration of quadratic equations and their properties',
    type: 'concept-visualizer',
    category: 'Algebra',
    lastModified: '2025-04-16T14:20:00Z',
    parameters: {
      initialA: 1,
      initialB: 0,
      initialC: 0,
      showRoots: true,
      showVertex: true,
    }
  },
  {
    id: 'block-3',
    name: 'Systems of Equations Solver',
    description: 'Step-by-step interactive solver for linear systems',
    type: 'problem-solver',
    category: 'Algebra',
    lastModified: '2025-04-17T09:15:00Z',
    parameters: {
      methodOptions: ['substitution', 'elimination', 'graphical'],
      defaultMethod: 'elimination',
      showSteps: true,
    }
  },
  {
    id: 'block-4',
    name: 'Trigonometric Function Explorer',
    description: 'Interactive visualization of sine, cosine, and tangent functions',
    type: 'equation-explorer',
    category: 'Trigonometry',
    lastModified: '2025-04-14T16:45:00Z',
    parameters: {
      functions: ['sin', 'cos', 'tan'],
      amplitude: 1,
      period: 1,
      phase: 0,
    }
  },
  {
    id: 'block-5',
    name: 'Statistical Data Analyzer',
    description: 'Data visualization and statistical analysis tools',
    type: 'data-explorer',
    category: 'Statistics',
    lastModified: '2025-04-16T11:10:00Z',
    parameters: {
      chartTypes: ['histogram', 'scatter', 'box'],
      defaultChart: 'histogram',
      showMean: true,
      showMedian: true,
    }
  },
];

/**
 * Format date string for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
