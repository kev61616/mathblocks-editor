import { BlockDefinition } from '@/lib/block-templates/block-model';

/**
 * Simplified BlockDefinition for UI operations
 */
export interface UIBlock extends Omit<BlockDefinition, 'content' | 'metadata'> {
  id: string;
  name: string;
  description: string;
  type: 'equation-explorer' | 'concept-visualizer' | 'problem-solver' | 'data-explorer';
  category: string;
  lastModified: string;
  parameters: Record<string, unknown>;
}

/**
 * Registry type definitions for block types
 */
export interface BlockTypeDefinition {
  name: string;
  description: string;
  defaultParameters: Record<string, unknown>;
}

export type BlockTypeRegistry = Record<string, BlockTypeDefinition>;

/**
 * Block filtering options
 */
export interface BlockFilterOptions {
  searchQuery: string;
  activeCategory: string;
}
