'use client';

import React from 'react';

interface BlockProperty {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'checkbox' | 'select';
  value: string | number | boolean;
  options?: string[]; // For select type
}

interface PropertiesPanelProps {
  blockType: string;
  title: string;
  description: string;
  parameters: BlockProperty[];
  onTitleChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onParameterChange?: (id: string, value: unknown) => void;
}

/**
 * Properties panel component for the right sidebar in project view
 */
export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  blockType,
  title,
  description,
  parameters,
  onTitleChange = () => {},
  onDescriptionChange = () => {},
  onParameterChange = () => {}
}) => {
  return (
    <div className="w-80 flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Properties</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block Type
            </label>
            <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>{blockType}</option>
              {/* Additional block types would be populated here */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Block Parameters</h3>
            
            <div className="space-y-3">
              {parameters.map((param) => (
                <div key={param.id}>
                  {param.type === 'text' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {param.label}
                      </label>
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={param.value as string}
                        onChange={(e) => onParameterChange(param.id, e.target.value)}
                      />
                    </div>
                  )}
                  
                  {param.type === 'number' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {param.label}
                      </label>
                      <input
                        type="number"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={param.value as number}
                        onChange={(e) => onParameterChange(param.id, Number(e.target.value))}
                      />
                    </div>
                  )}
                  
                  {param.type === 'textarea' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {param.label}
                      </label>
                      <textarea
                        rows={3}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={param.value as string}
                        onChange={(e) => onParameterChange(param.id, e.target.value)}
                      />
                    </div>
                  )}
                  
                  {param.type === 'checkbox' && (
                    <div className="flex items-center">
                      <input
                        id={param.id}
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={param.value as boolean}
                        onChange={(e) => onParameterChange(param.id, e.target.checked)}
                      />
                      <label htmlFor={param.id} className="ml-2 block text-sm text-gray-600">
                        {param.label}
                      </label>
                    </div>
                  )}
                  
                  {param.type === 'select' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {param.label}
                      </label>
                      <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={param.value as string}
                        onChange={(e) => onParameterChange(param.id, e.target.value)}
                      >
                        {param.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
