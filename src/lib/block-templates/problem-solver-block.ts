/**
 * Problem Solver Block Definition
 * 
 * This module defines the Problem Solver block type, which allows students
 * to work through mathematical problems step by step with guidance and feedback.
 */

import { BlockTypeDefinition } from './block-model';

/**
 * Problem Solver block type definition
 */
export const ProblemSolverBlock: BlockTypeDefinition = {
  type: 'problem-solver',
  name: 'Problem Solver',
  description: 'Interactive tool for stepping through mathematical problem solutions with guidance',
  
  // Default parameters for the block
  defaultParameters: {
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
    showHints: true,
    progressiveReveal: true,
    requireUserInput: false,
    feedbackLevel: 'detailed',
    interactiveMode: 'guided',
    solutionVisible: 'after-attempt',
  },
  
  // Required parameters that must be provided
  requiredParameters: [
    'problem',
    'steps',
  ],
  
  // Parameter validation functions
  parameterValidation: {
    problem: (value): boolean => typeof value === 'string' && value.trim().length > 0,
    
    steps: (value): boolean => {
      return Array.isArray(value) && 
             value.length > 0 && 
             value.every(step => 
               typeof step === 'object' && 
               step !== null &&
               typeof step.description === 'string' && 
               typeof step.expression === 'string'
             );
    },
    
    showHints: (value): boolean => typeof value === 'boolean',
    
    progressiveReveal: (value): boolean => typeof value === 'boolean',
    
    requireUserInput: (value): boolean => typeof value === 'boolean',
    
    feedbackLevel: (value): boolean => 
      typeof value === 'string' && 
      ['minimal', 'moderate', 'detailed'].includes(value as string),
    
    interactiveMode: (value): boolean => 
      typeof value === 'string' && 
      ['guided', 'practice', 'assessment'].includes(value as string),
    
    solutionVisible: (value): boolean => 
      typeof value === 'string' && 
      ['always', 'after-attempt', 'never'].includes(value as string),
  },
  
  // Available parameter definitions for UI generation
  availableParameters: [
    {
      name: 'problem',
      type: 'string',
      required: true,
      description: 'The mathematical problem statement to solve',
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      description: 'Array of solution steps, each with description, expression, and explanation',
    },
    {
      name: 'showHints',
      type: 'boolean',
      required: false,
      description: 'Whether to show hints to guide the student',
      defaultValue: true,
    },
    {
      name: 'progressiveReveal',
      type: 'boolean',
      required: false,
      description: 'Whether to reveal steps progressively or all at once',
      defaultValue: true,
    },
    {
      name: 'requireUserInput',
      type: 'boolean',
      required: false,
      description: 'Whether the student must provide input at each step',
      defaultValue: false,
    },
    {
      name: 'feedbackLevel',
      type: 'string',
      required: false,
      description: 'Level of detail in feedback provided',
      defaultValue: 'detailed',
    },
    {
      name: 'interactiveMode',
      type: 'string',
      required: false,
      description: 'Mode of interaction (guided, practice, assessment)',
      defaultValue: 'guided',
    },
    {
      name: 'solutionVisible',
      type: 'string',
      required: false,
      description: 'When the complete solution is visible',
      defaultValue: 'after-attempt',
    },
  ],
};

/**
 * Register the Problem Solver block with the registry
 */
export function registerProblemSolverBlock(): void {
  // Import dynamically to avoid circular dependencies
  import('./block-model').then(({ BlockRegistry }) => {
    const registry = BlockRegistry.getInstance();
    registry.registerBlockType(ProblemSolverBlock);
  });
}

/**
 * Step interface for Problem Solver Block
 */
export interface ProblemSolverStep {
  description: string;
  expression: string;
  explanation?: string;
  hint?: string;
  userInput?: string;
}

/**
 * Helper type for Problem Solver Block parameters
 */
export interface ProblemSolverParameters {
  problem: string;
  steps: ProblemSolverStep[];
  showHints?: boolean;
  progressiveReveal?: boolean;
  requireUserInput?: boolean;
  feedbackLevel?: 'minimal' | 'moderate' | 'detailed';
  interactiveMode?: 'guided' | 'practice' | 'assessment';
  solutionVisible?: 'always' | 'after-attempt' | 'never';
}
