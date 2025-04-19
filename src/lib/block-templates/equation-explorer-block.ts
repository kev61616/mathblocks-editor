/**
 * Equation Explorer Block Definition
 * 
 * This module defines the Equation Explorer block type, which allows students
 * to manipulate equation parameters and observe the effects on graphs and values.
 */

import { BlockTypeDefinition } from './block-model';

/**
 * Equation Explorer block type definition
 */
export const EquationExplorerBlock: BlockTypeDefinition = {
  type: 'equation-explorer',
  name: 'Equation Explorer',
  description: 'Interactive tool for exploring mathematical equations by manipulating variables and observing changes',
  
  // Default parameters for the block
  defaultParameters: {
    equation: 'y = x',
    variables: ['a'],
    range: { a: [-5, 5] },
    initialValues: { a: 1 },
    step: 0.1,
    showGraph: true,
    showFormula: true,
    showTable: false,
    graphDomain: [-10, 10],
    graphRange: [-10, 10],
    gridLines: true,
    animationSpeed: 'medium',
  },
  
  // Required parameters that must be provided
  requiredParameters: [
    'equation',
    'variables',
    'range',
    'initialValues',
  ],
  
  // Parameter validation functions
  parameterValidation: {
    equation: (value): boolean => typeof value === 'string' && value.trim().length > 0,
    
    variables: (value): boolean => {
      return Array.isArray(value) && 
             value.length > 0 && 
             value.every(v => typeof v === 'string');
    },
    
    range: (value): boolean => {
      if (typeof value !== 'object' || value === null) return false;
      
      // Check each variable has a valid range
      const ranges = value as Record<string, unknown>;
      return Object.values(ranges).every(r => 
        Array.isArray(r) && 
        r.length === 2 && 
        typeof r[0] === 'number' && 
        typeof r[1] === 'number' && 
        r[0] < r[1]
      );
    },
    
    initialValues: (value): boolean => {
      if (typeof value !== 'object' || value === null) return false;
      
      // Check each variable has a valid initial value
      const values = value as Record<string, unknown>;
      return Object.values(values).every(v => typeof v === 'number');
    },
    
    step: (value): boolean => typeof value === 'number' && value > 0,
    
    showGraph: (value): boolean => typeof value === 'boolean',
    
    showFormula: (value): boolean => typeof value === 'boolean',
    
    showTable: (value): boolean => typeof value === 'boolean',
    
    graphDomain: (value): boolean => 
      Array.isArray(value) && 
      value.length === 2 && 
      typeof value[0] === 'number' && 
      typeof value[1] === 'number' && 
      value[0] < value[1],
    
    graphRange: (value): boolean => 
      Array.isArray(value) && 
      value.length === 2 && 
      typeof value[0] === 'number' && 
      typeof value[1] === 'number' && 
      value[0] < value[1],
    
    gridLines: (value): boolean => typeof value === 'boolean',
    
    animationSpeed: (value): boolean => 
      typeof value === 'string' && 
      ['slow', 'medium', 'fast'].includes(value as string),
  },
  
  // Available parameter definitions for UI generation
  availableParameters: [
    {
      name: 'equation',
      type: 'string',
      required: true,
      description: 'The mathematical equation to explore (e.g., "y = mx + b")',
    },
    {
      name: 'variables',
      type: 'array',
      required: true,
      description: 'Variables that can be manipulated in the equation',
    },
    {
      name: 'range',
      type: 'object',
      required: true,
      description: 'Minimum and maximum values for each variable',
    },
    {
      name: 'initialValues',
      type: 'object',
      required: true,
      description: 'Starting values for each variable',
    },
    {
      name: 'step',
      type: 'number',
      required: false,
      description: 'Step size for variable controls',
      defaultValue: 0.1,
    },
    {
      name: 'showGraph',
      type: 'boolean',
      required: false,
      description: 'Whether to display the graph visualization',
      defaultValue: true,
    },
    {
      name: 'showFormula',
      type: 'boolean',
      required: false,
      description: 'Whether to display the dynamic formula',
      defaultValue: true,
    },
    {
      name: 'showTable',
      type: 'boolean',
      required: false,
      description: 'Whether to display a table of values',
      defaultValue: false,
    },
    {
      name: 'graphDomain',
      type: 'array',
      required: false,
      description: 'X-axis range for the graph',
      defaultValue: [-10, 10],
    },
    {
      name: 'graphRange',
      type: 'array',
      required: false,
      description: 'Y-axis range for the graph',
      defaultValue: [-10, 10],
    },
    {
      name: 'gridLines',
      type: 'boolean',
      required: false,
      description: 'Whether to display grid lines on the graph',
      defaultValue: true,
    },
    {
      name: 'animationSpeed',
      type: 'string',
      required: false,
      description: 'Speed of transitions when variables change',
      defaultValue: 'medium',
    },
  ],
};

/**
 * Register the Equation Explorer block with the registry
 */
export function registerEquationExplorerBlock(): void {
  // Import dynamically to avoid circular dependencies
  import('./block-model').then(({ BlockRegistry }) => {
    const registry = BlockRegistry.getInstance();
    registry.registerBlockType(EquationExplorerBlock);
  });
}

/**
 * Helper type for Equation Explorer Block parameters
 */
export interface EquationExplorerParameters {
  equation: string;
  variables: string[];
  range: Record<string, [number, number]>;
  initialValues: Record<string, number>;
  step?: number;
  showGraph?: boolean;
  showFormula?: boolean;
  showTable?: boolean;
  graphDomain?: [number, number];
  graphRange?: [number, number];
  gridLines?: boolean;
  animationSpeed?: 'slow' | 'medium' | 'fast';
}
