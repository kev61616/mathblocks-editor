/**
 * Concept Visualizer Block Definition
 * 
 * This module defines the Concept Visualizer block type, which allows students
 * to visualize and explore mathematical concepts through interactive diagrams.
 */

import { BlockTypeDefinition } from './block-model';

/**
 * Concept Visualizer block type definition
 */
export const ConceptVisualizerBlock: BlockTypeDefinition = {
  type: 'concept-visualizer',
  name: 'Concept Visualizer',
  description: 'Interactive visualization of mathematical concepts with dynamic parameters',
  
  // Default parameters for the block
  defaultParameters: {
    conceptType: 'function-transformation',
    baseFunction: 'y = x^2',
    transformations: [
      { type: 'translation', axis: 'x', value: 0 },
      { type: 'translation', axis: 'y', value: 0 },
      { type: 'scale', axis: 'x', value: 1 },
      { type: 'scale', axis: 'y', value: 1 },
    ],
    domain: [-10, 10],
    range: [-10, 10],
    showGrid: true,
    showAxis: true,
    showLabels: true,
    interactive: true,
    animationSpeed: 1,
    description: 'Explore how transformations affect the graph of a function',
  },
  
  // Required parameters that must be provided
  requiredParameters: [
    'conceptType',
    'baseFunction',
  ],
  
  // Parameter validation functions
  parameterValidation: {
    conceptType: (value): boolean => 
      typeof value === 'string' && 
      ['function-transformation', 'vector-operation', 'geometric-transformation', 
       'trigonometric-circle', 'coordinate-system', 'slope-intercept'].includes(value as string),
    
    baseFunction: (value): boolean => 
      typeof value === 'string' && value.trim().length > 0,
    
    transformations: (value): boolean => 
      Array.isArray(value) && 
      value.every(transformation => 
        typeof transformation === 'object' && 
        transformation !== null &&
        typeof transformation.type === 'string' &&
        typeof transformation.axis === 'string' &&
        typeof transformation.value === 'number'
      ),
    
    domain: (value): boolean => 
      Array.isArray(value) && 
      value.length === 2 && 
      value.every(v => typeof v === 'number'),
    
    range: (value): boolean => 
      Array.isArray(value) && 
      value.length === 2 && 
      value.every(v => typeof v === 'number'),
    
    showGrid: (value): boolean => typeof value === 'boolean',
    
    showAxis: (value): boolean => typeof value === 'boolean',
    
    showLabels: (value): boolean => typeof value === 'boolean',
    
    interactive: (value): boolean => typeof value === 'boolean',
    
    animationSpeed: (value): boolean => 
      typeof value === 'number' && value >= 0 && value <= 2,
    
    description: (value): boolean => 
      typeof value === 'string',
  },
  
  // Available parameter definitions for UI generation
  availableParameters: [
    {
      name: 'conceptType',
      type: 'string',
      required: true,
      description: 'Type of mathematical concept to visualize (function-transformation, vector-operation, geometric-transformation, trigonometric-circle, coordinate-system, slope-intercept)',
      defaultValue: 'function-transformation',
    },
    {
      name: 'baseFunction',
      type: 'string',
      required: true,
      description: 'The base function or concept to visualize',
      defaultValue: 'y = x^2',
    },
    {
      name: 'transformations',
      type: 'array',
      required: false,
      description: 'Array of transformations to apply to the concept',
      defaultValue: [
        { type: 'translation', axis: 'x', value: 0 },
        { type: 'translation', axis: 'y', value: 0 },
        { type: 'scale', axis: 'x', value: 1 },
        { type: 'scale', axis: 'y', value: 1 },
      ],
    },
    {
      name: 'domain',
      type: 'array',
      required: false,
      description: 'Domain range for the visualization [min, max]',
      defaultValue: [-10, 10],
    },
    {
      name: 'range',
      type: 'array',
      required: false,
      description: 'Range values for the visualization [min, max]',
      defaultValue: [-10, 10],
    },
    {
      name: 'showGrid',
      type: 'boolean',
      required: false,
      description: 'Whether to show the grid in the visualization',
      defaultValue: true,
    },
    {
      name: 'showAxis',
      type: 'boolean',
      required: false,
      description: 'Whether to show the axes in the visualization',
      defaultValue: true,
    },
    {
      name: 'showLabels',
      type: 'boolean',
      required: false,
      description: 'Whether to show labels in the visualization',
      defaultValue: true,
    },
    {
      name: 'interactive',
      type: 'boolean',
      required: false,
      description: 'Whether the visualization allows user interaction',
      defaultValue: true,
    },
    {
      name: 'animationSpeed',
      type: 'number',
      required: false,
      description: 'Speed of animations (0-2, where 1 is normal speed)',
      defaultValue: 1,
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Description of the visualization for educational context',
      defaultValue: 'Explore how transformations affect the graph of a function',
    },
  ],
};

/**
 * Register the Concept Visualizer block with the registry
 */
export function registerConceptVisualizerBlock(): void {
  // Import dynamically to avoid circular dependencies
  import('./block-model').then(({ BlockRegistry }) => {
    const registry = BlockRegistry.getInstance();
    registry.registerBlockType(ConceptVisualizerBlock);
  });
}

/**
 * Transformation interface for Concept Visualizer Block
 */
export interface Transformation {
  type: 'translation' | 'scale' | 'rotation' | 'reflection';
  axis: 'x' | 'y' | 'origin' | 'line';
  value: number;
  lineEquation?: string; // For reflection across a line
}

/**
 * Helper type for Concept Visualizer Block parameters
 */
export interface ConceptVisualizerParameters {
  conceptType: 'function-transformation' | 'vector-operation' | 'geometric-transformation' | 
               'trigonometric-circle' | 'coordinate-system' | 'slope-intercept';
  baseFunction: string;
  transformations?: Transformation[];
  domain?: [number, number];
  range?: [number, number];
  showGrid?: boolean;
  showAxis?: boolean;
  showLabels?: boolean;
  interactive?: boolean;
  animationSpeed?: number;
  description?: string;
}
