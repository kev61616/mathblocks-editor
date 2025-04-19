/**
 * Data Explorer Block Definition
 * 
 * This module defines the Data Explorer block type, which allows students
 * to visualize and interact with mathematical data sets through various
 * chart types and data analysis tools.
 */

import { BlockTypeDefinition } from './block-model';

/**
 * Data Explorer block type definition
 */
export const DataExplorerBlock: BlockTypeDefinition = {
  type: 'data-explorer',
  name: 'Data Explorer',
  description: 'Interactive visualization and analysis of mathematical data sets',
  
  // Default parameters for the block
  defaultParameters: {
    dataSource: 'inline',
    data: [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 9 },
      { x: 4, y: 16 },
      { x: 5, y: 25 }
    ],
    chartType: 'scatter',
    xAxisLabel: 'X Axis',
    yAxisLabel: 'Y Axis',
    title: 'Data Visualization',
    showLegend: true,
    showGridLines: true,
    enableZoom: true,
    enablePan: true,
    enableTooltips: true,
    enableDataLabels: false,
    colorScheme: 'default',
    trendLine: 'none',
    dataColumns: ['x', 'y'],
    sortData: false,
    calculatedFields: [],
    regressionOptions: {
      enabled: false,
      type: 'linear',
      displayEquation: true,
      displayR2: true
    }
  },
  
  // Required parameters that must be provided
  requiredParameters: [
    'data',
    'chartType'
  ],
  
  // Parameter validation functions
  parameterValidation: {
    dataSource: (value): boolean => 
      typeof value === 'string' && 
      ['inline', 'url', 'csv', 'json'].includes(value as string),
    
    data: (value): boolean => {
      // Data can be an array of objects or a 2D array
      if (!Array.isArray(value)) return false;
      
      if (value.length === 0) return true; // Empty data is valid
      
      // If first element is an object, check that all elements are objects
      if (typeof value[0] === 'object' && value[0] !== null) {
        return value.every(item => typeof item === 'object' && item !== null);
      }
      
      // If first element is an array, check that all elements are arrays
      if (Array.isArray(value[0])) {
        return value.every(item => Array.isArray(item));
      }
      
      return false;
    },
    
    chartType: (value): boolean => 
      typeof value === 'string' && 
      ['line', 'bar', 'scatter', 'pie', 'histogram', 'box', 'heatmap']
        .includes(value as string),
    
    xAxisLabel: (value): boolean => typeof value === 'string',
    
    yAxisLabel: (value): boolean => typeof value === 'string',
    
    title: (value): boolean => typeof value === 'string',
    
    showLegend: (value): boolean => typeof value === 'boolean',
    
    showGridLines: (value): boolean => typeof value === 'boolean',
    
    enableZoom: (value): boolean => typeof value === 'boolean',
    
    enablePan: (value): boolean => typeof value === 'boolean',
    
    enableTooltips: (value): boolean => typeof value === 'boolean',
    
    enableDataLabels: (value): boolean => typeof value === 'boolean',
    
    colorScheme: (value): boolean => 
      typeof value === 'string' && 
      ['default', 'blues', 'greens', 'oranges', 'purples', 'rainbow', 'grayscale']
        .includes(value as string),
    
    trendLine: (value): boolean => 
      typeof value === 'string' && 
      ['none', 'linear', 'exponential', 'logarithmic', 'polynomial']
        .includes(value as string),
    
    dataColumns: (value): boolean => 
      Array.isArray(value) && 
      value.every(col => typeof col === 'string'),
    
    sortData: (value): boolean => typeof value === 'boolean',
    
    calculatedFields: (value): boolean => 
      Array.isArray(value) && 
      value.every(field => 
        typeof field === 'object' &&
        field !== null &&
        typeof field.name === 'string' &&
        typeof field.formula === 'string'
      ),
    
    regressionOptions: (value): boolean => {
      if (typeof value !== 'object' || value === null) return false;
      
      const options = value as RegressionOptions;
      return (
        typeof options.enabled === 'boolean' &&
        typeof options.type === 'string' &&
        typeof options.displayEquation === 'boolean' &&
        typeof options.displayR2 === 'boolean'
      );
    }
  },
  
  // Available parameter definitions for UI generation
  availableParameters: [
    {
      name: 'dataSource',
      type: 'string',
      required: false,
      description: 'Source type for the data (inline, url, csv, json)',
      defaultValue: 'inline',
    },
    {
      name: 'data',
      type: 'array',
      required: true,
      description: 'Dataset to visualize (array of objects or 2D array)',
      defaultValue: [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 9 },
        { x: 4, y: 16 },
        { x: 5, y: 25 }
      ],
    },
    {
      name: 'chartType',
      type: 'string',
      required: true,
      description: 'Type of chart to display (line, bar, scatter, pie, histogram, box, heatmap)',
      defaultValue: 'scatter',
    },
    {
      name: 'xAxisLabel',
      type: 'string',
      required: false,
      description: 'Label for the X axis',
      defaultValue: 'X Axis',
    },
    {
      name: 'yAxisLabel',
      type: 'string',
      required: false,
      description: 'Label for the Y axis',
      defaultValue: 'Y Axis',
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Title of the chart',
      defaultValue: 'Data Visualization',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      required: false,
      description: 'Whether to show the legend',
      defaultValue: true,
    },
    {
      name: 'showGridLines',
      type: 'boolean',
      required: false,
      description: 'Whether to show grid lines',
      defaultValue: true,
    },
    {
      name: 'enableZoom',
      type: 'boolean',
      required: false,
      description: 'Whether to enable zoom functionality',
      defaultValue: true,
    },
    {
      name: 'enablePan',
      type: 'boolean',
      required: false,
      description: 'Whether to enable pan functionality',
      defaultValue: true,
    },
    {
      name: 'enableTooltips',
      type: 'boolean',
      required: false,
      description: 'Whether to enable tooltips on data points',
      defaultValue: true,
    },
    {
      name: 'enableDataLabels',
      type: 'boolean',
      required: false,
      description: 'Whether to show data labels directly on the visualization',
      defaultValue: false,
    },
    {
      name: 'colorScheme',
      type: 'string',
      required: false,
      description: 'Color scheme for the visualization',
      defaultValue: 'default',
    },
    {
      name: 'trendLine',
      type: 'string',
      required: false,
      description: 'Type of trend line to show',
      defaultValue: 'none',
    },
    {
      name: 'dataColumns',
      type: 'array',
      required: false,
      description: 'Columns to use from the dataset',
      defaultValue: ['x', 'y'],
    },
    {
      name: 'sortData',
      type: 'boolean',
      required: false,
      description: 'Whether to sort data before visualization',
      defaultValue: false,
    },
    {
      name: 'calculatedFields',
      type: 'array',
      required: false,
      description: 'Additional calculated fields based on the dataset',
      defaultValue: [],
    },
    {
      name: 'regressionOptions',
      type: 'object',
      required: false,
      description: 'Options for regression analysis',
      defaultValue: {
        enabled: false,
        type: 'linear',
        displayEquation: true,
        displayR2: true
      },
    },
  ],
};

/**
 * Register the Data Explorer block with the registry
 */
export function registerDataExplorerBlock(): void {
  // Import dynamically to avoid circular dependencies
  import('./block-model').then(({ BlockRegistry }) => {
    const registry = BlockRegistry.getInstance();
    registry.registerBlockType(DataExplorerBlock);
  });
}

/**
 * Interface for calculated field
 */
export interface CalculatedField {
  name: string;
  formula: string;
  description?: string;
}

/**
 * Interface for regression options
 */
export interface RegressionOptions {
  enabled: boolean;
  type: 'linear' | 'exponential' | 'logarithmic' | 'polynomial' | 'power';
  degree?: number; // For polynomial regression
  displayEquation: boolean;
  displayR2: boolean;
  lineColor?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
}

/**
 * Helper type for Data Explorer Block parameters
 */
export interface DataExplorerParameters {
  dataSource: 'inline' | 'url' | 'csv' | 'json';
  data: Array<Record<string, unknown>> | unknown[][];
  chartType: 'line' | 'bar' | 'scatter' | 'pie' | 'histogram' | 'box' | 'heatmap';
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  showLegend?: boolean;
  showGridLines?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableTooltips?: boolean;
  enableDataLabels?: boolean;
  colorScheme?: 'default' | 'blues' | 'greens' | 'oranges' | 'purples' | 'rainbow' | 'grayscale';
  trendLine?: 'none' | 'linear' | 'exponential' | 'logarithmic' | 'polynomial';
  dataColumns?: string[];
  sortData?: boolean;
  calculatedFields?: CalculatedField[];
  regressionOptions?: RegressionOptions;
}
