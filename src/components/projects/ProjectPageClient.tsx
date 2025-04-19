'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectSidebar, { ProjectFile } from '@/components/projects/ProjectSidebar';
import EditorContent from '@/components/projects/EditorContent';
import PropertiesPanel from '@/components/projects/PropertiesPanel';
import ProjectService from '@/lib/projects/project-service';
import { BlockParameter } from '@/types/project-types';

interface ProjectPageClientProps {
  projectId: string;
}

/**
 * Client component for the project page handling all interactive elements
 */
export const ProjectPageClient: React.FC<ProjectPageClientProps> = ({ projectId }) => {
  const router = useRouter();
  
  // State
  const [project, setProject] = useState<{ id: string; name: string; files: ProjectFile[] } | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [jsonContent, setJsonContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Basic block properties
  const [blockType, setBlockType] = useState<string>('Linear Equation Explorer');
  const [title, setTitle] = useState<string>('Explore Linear Equations');
  const [description, setDescription] = useState<string>(
    'Use the sliders to change the slope and y-intercept of the linear equation.'
  );
  
  // Block parameters
  const [parameters, setParameters] = useState<BlockParameter[]>([
    {
      id: 'initialSlope',
      label: 'Initial Slope',
      type: 'number',
      value: 2
    },
    {
      id: 'initialIntercept',
      label: 'Initial Y-intercept',
      type: 'number',
      value: -1
    },
    {
      id: 'showControls',
      label: 'Show Controls',
      type: 'checkbox',
      value: true
    },
    {
      id: 'allowReset',
      label: 'Allow Reset',
      type: 'checkbox',
      value: true
    }
  ]);
  
  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await ProjectService.getProject(projectId);
        
        if (!projectData) {
          setError('Project not found');
          router.push('/dashboard');
          return;
        }
        
        setProject(projectData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project');
        setLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, router]);
  
  // Load file content when selected file changes
  useEffect(() => {
    const loadFileContent = async () => {
      if (!selectedFile || !project) return;
      
      try {
        const content = await ProjectService.getFileContent(project.id, selectedFile.id);
        
        if (content) {
          if (selectedFile.type === 'source') {
            setHtmlContent(content);
            setJsonContent('');
          } else if (selectedFile.type === 'block') {
            setJsonContent(content);
            setHtmlContent('');
            
            // If it's a block file, try to parse and set properties/parameters
            try {
              const blockData = JSON.parse(content);
              if (blockData) {
                setBlockType(blockData.type || 'Linear Equation Explorer');
                setTitle(blockData.content?.title || blockData.name || 'Block');
                setDescription(blockData.content?.description || blockData.description || '');
                
                // Convert parameters object to array of BlockParameter
                if (blockData.parameters) {
                  const paramArray: BlockParameter[] = Object.entries(blockData.parameters).map(
                    ([key, value]) => {
                      const type = typeof value === 'boolean' 
                        ? 'checkbox' 
                        : typeof value === 'number' 
                          ? 'number' 
                          : 'text';
                      
                      return {
                        id: key,
                        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                        type,
                        value: value as string | number | boolean
                      };
                    }
                  );
                  
                  setParameters(paramArray);
                }
              }
            } catch (e) {
              console.error('Error parsing block data:', e);
            }
          }
        }
      } catch (err) {
        console.error('Error loading file content:', err);
      }
    };
    
    loadFileContent();
  }, [selectedFile, project]);
  
  // Handle file selection
  const handleFileClick = (file: ProjectFile) => {
    setSelectedFile(file);
  };
  
  // Handle adding a new file
  const handleAddFile = () => {
    console.log('Add file clicked');
    // In a real implementation, this would open a dialog to create a new file
  };
  
  // Handle changing title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    // In a real implementation, this would update the file content
  };
  
  // Handle changing description
  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    // In a real implementation, this would update the file content
  };
  
  // Handle changing a parameter
  const handleParameterChange = (id: string, value: unknown) => {
    setParameters(prevParams => 
      prevParams.map(param => 
        param.id === id ? { ...param, value: value as string | number | boolean } : param
      )
    );
    // In a real implementation, this would update the file content
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-600 text-xl font-medium mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  
  // If project is loaded, render the project interface
  return project ? (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <ProjectHeader projectName={project.name} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ProjectSidebar 
          files={project.files} 
          onFileClick={handleFileClick} 
          onAddFileClick={handleAddFile} 
        />

        {/* Main Editor */}
        <EditorContent 
          htmlContent={htmlContent}
          jsonContent={jsonContent}
          selectedFile={selectedFile}
        />

        {/* Properties Panel */}
        <PropertiesPanel 
          blockType={blockType}
          title={title}
          description={description}
          parameters={parameters}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onParameterChange={handleParameterChange}
        />
      </div>
    </div>
  ) : null;
};

export default ProjectPageClient;
