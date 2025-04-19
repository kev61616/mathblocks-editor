/**
 * Project-related type definitions
 */

export interface ProjectFile {
  id: string;
  name: string;
  type: 'source' | 'block';
  content?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  files: ProjectFile[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BlockParameter {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'checkbox' | 'select';
  value: string | number | boolean;
  options?: string[]; // For select type
}

export interface BlockData {
  id: string;
  type: string;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  content?: {
    title?: string;
    description?: string;
    instructions?: string;
    [key: string]: unknown;
  };
}
