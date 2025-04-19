'use client';

import { Project, ProjectFile, BlockData } from '@/types/project-types';

// Mock project data - in a real app, this would come from a database or API
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Algebra Lesson',
    description: 'Introduction to linear equations and their applications',
    files: [
      { id: 'f1', name: 'linear-equations.html', type: 'source' },
      { id: 'f2', name: 'linear-equation-explorer.json', type: 'block' },
      { id: 'f3', name: 'equation-solver.json', type: 'block' },
    ],
    createdAt: '2025-03-15T12:00:00Z',
    updatedAt: '2025-04-10T14:30:00Z',
  },
  {
    id: '2',
    name: 'Quadratic Functions',
    description: 'Exploring quadratic functions and their graphs',
    files: [
      { id: 'f4', name: 'quadratic-functions.html', type: 'source' },
      { id: 'f5', name: 'quadratic-visualizer.json', type: 'block' },
    ],
    createdAt: '2025-03-20T09:45:00Z',
    updatedAt: '2025-04-05T11:15:00Z',
  },
  {
    id: '3',
    name: 'Trigonometry Basics',
    description: 'Introduction to trigonometric functions and the unit circle',
    files: [
      { id: 'f6', name: 'trigonometry.html', type: 'source' },
      { id: 'f7', name: 'angle-explorer.json', type: 'block' },
      { id: 'f8', name: 'unit-circle.json', type: 'block' },
    ],
    createdAt: '2025-03-25T15:20:00Z',
    updatedAt: '2025-04-12T10:00:00Z',
  },
];

// Sample block data for the linear equation explorer
const linearEquationExplorerData: BlockData = {
  id: 'linear-equation-explorer-1',
  type: 'linear-equation-explorer',
  name: 'Linear Equation Explorer - Basic',
  description: 'Interactive tool for exploring linear equations',
  parameters: {
    initialSlope: 2,
    initialIntercept: -1,
    showControls: true,
    allowReset: true
  },
  content: {
    title: 'Explore Linear Equations',
    description: 'Use the sliders to change the slope and y-intercept of the linear equation.',
    instructions: 'Observe how changes affect the graph.'
  }
};

// Sample HTML content for the linear equations file
const linearEquationsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Linear Equations</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <section class="concept-section concept-linear">
    <div class="concept-header">
      <div class="concept-icon"><i class="fas fa-chart-line"></i></div>
      <h2 class="concept-title">Linear Equation Solving Strategies</h2>
    </div>
    
    <div class="key-question">
      <p><i class="fas fa-question-circle"></i> <strong>Key Question:</strong> 
        What are the systematic steps you can follow to solve a linear equation?</p>
    </div>
    
    <!-- Interactive visualization -->
    <div class="interactive-visualization">
      <h4>Interactive Linear Equation</h4>
      <div id="linear-graph" class="jxgbox"></div>
      <div class="graph-controls">
        <div class="graph-control-hint">Try changing the slope and y-intercept values</div>
      </div>
    </div>
  </section>
</body>
</html>`;

/**
 * Project service provides methods for working with projects
 */
export class ProjectService {
  /**
   * Get all projects
   */
  static async getProjects(): Promise<Project[]> {
    // In a real app, this would fetch from API or database
    return Promise.resolve(mockProjects);
  }

  /**
   * Get a specific project by ID
   */
  static async getProject(id: string): Promise<Project | null> {
    const project = mockProjects.find(p => p.id === id);
    return Promise.resolve(project || null);
  }

  /**
   * Get file content for a specific file
   */
  static async getFileContent(projectId: string, fileId: string): Promise<string | null> {
    // In a real app, this would fetch the actual content from storage
    
    // For demo, return mock content for specific files
    if (fileId === 'f1') {
      return Promise.resolve(linearEquationsHtml);
    }
    
    if (fileId === 'f2') {
      return Promise.resolve(JSON.stringify(linearEquationExplorerData, null, 2));
    }
    
    return Promise.resolve(null);
  }

  /**
   * Save file content
   */
  static async saveFileContent(projectId: string, fileId: string, content: string): Promise<boolean> {
    // In a real app, this would save to storage
    console.log(`Saving file ${fileId} for project ${projectId}`);
    // Log the content length to use the content parameter and satisfy eslint
    console.log(`Content length: ${content.length} characters`);
    return Promise.resolve(true);
  }

  /**
   * Create a new file in a project
   */
  static async createFile(projectId: string, file: Omit<ProjectFile, 'id'>): Promise<ProjectFile | null> {
    // In a real app, this would create in storage
    const newFile: ProjectFile = {
      ...file,
      id: `f${Date.now()}`
    };
    
    console.log(`Creating file ${newFile.name} for project ${projectId}`);
    return Promise.resolve(newFile);
  }

  /**
   * Delete a file from a project
   */
  static async deleteFile(projectId: string, fileId: string): Promise<boolean> {
    // In a real app, this would delete from storage
    console.log(`Deleting file ${fileId} from project ${projectId}`);
    return Promise.resolve(true);
  }

  /**
   * Create a new project
   */
  static async createProject(project: Omit<Project, 'id' | 'files'>): Promise<Project | null> {
    // In a real app, this would create in storage
    const newProject: Project = {
      ...project,
      id: `p${Date.now()}`,
      files: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log(`Creating new project: ${newProject.name}`);
    return Promise.resolve(newProject);
  }
}

export default ProjectService;
