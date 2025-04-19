/**
 * Block Model - Defines the core structure for interactive blocks
 * 
 * This module provides the base interfaces and types for defining
 * interactive math blocks in the MathBlocks system.
 */

/**
 * Base interface for all block types
 */
export interface BlockDefinition {
  id: string;
  type: string;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  content: {
    title: string;
    description: string;
    [key: string]: unknown;
  };
  metadata: BlockMetadata;
}

/**
 * Metadata for blocks
 */
export interface BlockMetadata {
  createdAt: string;
  updatedAt: string;
  tags: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  version?: string;
  author?: string;
}

/**
 * Block registry for managing block types
 */
export class BlockRegistry {
  private static instance: BlockRegistry;
  private blockTypes: Map<string, BlockTypeDefinition> = new Map();

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): BlockRegistry {
    if (!BlockRegistry.instance) {
      BlockRegistry.instance = new BlockRegistry();
    }
    return BlockRegistry.instance;
  }

  /**
   * Register a new block type
   */
  public registerBlockType(blockType: BlockTypeDefinition): void {
    this.blockTypes.set(blockType.type, blockType);
  }

  /**
   * Get a block type by its identifier
   */
  public getBlockType(type: string): BlockTypeDefinition | undefined {
    return this.blockTypes.get(type);
  }

  /**
   * Get all registered block types
   */
  public getAllBlockTypes(): BlockTypeDefinition[] {
    return Array.from(this.blockTypes.values());
  }

  /**
   * Check if a block type is registered
   */
  public hasBlockType(type: string): boolean {
    return this.blockTypes.has(type);
  }

  /**
   * Create a new block instance of a specific type
   */
  public createBlock(type: string, options: CreateBlockOptions): BlockDefinition | null {
    const blockType = this.getBlockType(type);
    if (!blockType) {
      console.error(`Block type "${type}" not found in registry.`);
      return null;
    }

    // Merge default parameters with provided options
    const defaultParams = blockType.defaultParameters || {};
    const params = { ...defaultParams, ...options.parameters };

    // Create a new block instance
    const block: BlockDefinition = {
      id: options.id || generateBlockId(),
      type,
      name: options.name || blockType.name,
      description: options.description || blockType.description,
      parameters: params,
      content: {
        title: options.title || blockType.name,
        description: options.contentDescription || '',
        ...options.additionalContent,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: options.tags || [],
        difficulty: options.difficulty || 'basic',
        version: options.version || '1.0.0',
        author: options.author,
      },
    };

    return block;
  }

  /**
   * Validate a block against its type definition
   */
  public validateBlock(block: BlockDefinition): ValidationResult {
    const blockType = this.getBlockType(block.type);
    if (!blockType) {
      return {
        valid: false,
        errors: [`Block type "${block.type}" not found in registry.`],
      };
    }

    const errors: string[] = [];

    // Validate required parameters
    const requiredParams = blockType.requiredParameters || [];
    for (const param of requiredParams) {
      if (block.parameters[param] === undefined) {
        errors.push(`Missing required parameter: ${param}`);
      }
    }

    // Validate parameter types
    if (blockType.parameterValidation) {
      for (const [key, value] of Object.entries(block.parameters)) {
        const validator = blockType.parameterValidation[key];
        if (validator && !validator(value)) {
          errors.push(`Invalid value for parameter: ${key}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Definition for a block type
 */
export interface BlockTypeDefinition {
  type: string;
  name: string;
  description: string;
  defaultParameters?: Record<string, unknown>;
  requiredParameters?: string[];
  parameterValidation?: Record<string, (value: unknown) => boolean>;
  availableParameters?: ParameterDefinition[];
}

/**
 * Definition for a block parameter
 */
export interface ParameterDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  defaultValue?: unknown;
}

/**
 * Options for creating a new block
 */
export interface CreateBlockOptions {
  id?: string;
  name?: string;
  description?: string;
  parameters?: Record<string, unknown>;
  title?: string;
  contentDescription?: string;
  additionalContent?: Record<string, unknown>;
  tags?: string[];
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  version?: string;
  author?: string;
}

/**
 * Result of block validation
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Generate a unique ID for a block
 */
function generateBlockId(): string {
  return 'block-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
}
