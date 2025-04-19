/**
 * Equation Explorer Block Component
 * 
 * This component renders an interactive equation explorer that allows students
 * to manipulate variables in mathematical equations and see the results in real-time.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EquationExplorerParameters } from '@/lib/block-templates/equation-explorer-block';

// Define props interface extending the block parameters
interface EquationExplorerProps {
  parameters: EquationExplorerParameters;
  id: string;
  title?: string;
  description?: string;
  onParameterChange?: (paramName: string, value: number) => void;
}

export const EquationExplorer: React.FC<EquationExplorerProps> = ({
  parameters,
  id,
  title,
  description,
  onParameterChange,
}) => {
  // Use id as a unique identifier for elements
  const blockId = `equation-explorer-${id}`;
  
  // Get parameters with defaults
  const {
    equation,
    variables,
    range,
    initialValues,
    step = 0.1,
    showGraph = true,
    showFormula = true,
    showTable = false,
    graphDomain = [-10, 10],
    graphRange = [-10, 10],
    gridLines = true,
  } = parameters;

  // Set up state for variable values
  const [variableValues, setVariableValues] = useState<Record<string, number>>(initialValues);
  
  // Canvas ref for graph drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate current formula with substituted values
  const currentFormula = useMemo(() => {
    let result = equation;
    
    // Replace each variable with its current value
    Object.entries(variableValues).forEach(([variable, value]) => {
      // Use regex to replace variables, being careful about variable names that might be substrings of others
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      result = result.replace(regex, value.toString());
    });
    
    return result;
  }, [equation, variableValues]);

  // Handle slider changes
  const handleSliderChange = (variable: string, value: number) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
    
    if (onParameterChange) {
      onParameterChange(variable, value);
    }
  };

  // Draw the graph on canvas
  useEffect(() => {
    if (!showGraph || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid if enabled
    if (gridLines) {
      drawGrid(ctx, width, height, graphDomain, graphRange);
    }
    
    // Draw axes
    drawAxes(ctx, width, height, graphDomain, graphRange);
    
    // Parse and draw the equation
    try {
      drawEquation(ctx, width, height, currentFormula, graphDomain, graphRange);
    } catch (error) {
      console.error('Error drawing equation:', error);
      
      // Draw error message on canvas
      ctx.font = '14px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText('Error plotting equation', 20, 30);
    }
  }, [showGraph, currentFormula, graphDomain, graphRange, gridLines]);

  // Helper function to map a value from one range to another
  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  };

  // Draw grid on canvas
  const drawGrid = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    domain: [number, number], 
    range: [number, number]
  ) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    const xStep = (domain[1] - domain[0]) / 10;
    for (let x = domain[0]; x <= domain[1]; x += xStep) {
      const canvasX = mapRange(x, domain[0], domain[1], 0, width);
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    const yStep = (range[1] - range[0]) / 10;
    for (let y = range[0]; y <= range[1]; y += yStep) {
      const canvasY = mapRange(y, range[0], range[1], height, 0);
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(width, canvasY);
      ctx.stroke();
    }
  };

  // Draw axes on canvas
  const drawAxes = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    domain: [number, number], 
    range: [number, number]
  ) => {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    
    // X-axis (y = 0)
    if (range[0] <= 0 && range[1] >= 0) {
      const yZero = mapRange(0, range[0], range[1], height, 0);
      ctx.beginPath();
      ctx.moveTo(0, yZero);
      ctx.lineTo(width, yZero);
      ctx.stroke();
    }
    
    // Y-axis (x = 0)
    if (domain[0] <= 0 && domain[1] >= 0) {
      const xZero = mapRange(0, domain[0], domain[1], 0, width);
      ctx.beginPath();
      ctx.moveTo(xZero, 0);
      ctx.lineTo(xZero, height);
      ctx.stroke();
    }
  };

  // Simple equation parser and plotter for demonstration
  // In a real implementation, we would use a more robust math library
  const drawEquation = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    formula: string, 
    domain: [number, number], 
    range: [number, number]
  ) => {
    // Extract the right side of the equation (after "y =")
    const match = formula.match(/y\s*=\s*(.*)/);
    if (!match) return;
    
    const expression = match[1];
    ctx.strokeStyle = '#FF5722';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Simple evaluator - for demo purposes only
    // For a real app, we'd use a proper math expression evaluator
    const evaluateExpression = (expr: string, x: number): number => {
      // Replace x with its value
      const withX = expr.replace(/\bx\b/g, x.toString());
      
      // Safety check - in a real app, we'd do proper validation
      try {
        // eslint-disable-next-line no-eval
        return eval(withX);
      } catch {
        console.error('Error evaluating expression');
        return NaN;
      }
    };
    
    let isFirstPoint = true;
    const stepSize = (domain[1] - domain[0]) / width;
    
    for (let x = domain[0]; x <= domain[1]; x += stepSize) {
      try {
        const y = evaluateExpression(expression, x);
        
        if (isNaN(y)) continue;
        
        const canvasX = mapRange(x, domain[0], domain[1], 0, width);
        const canvasY = mapRange(y, range[0], range[1], height, 0);
        
        if (isFirstPoint) {
          ctx.moveTo(canvasX, canvasY);
          isFirstPoint = false;
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      } catch {
        continue;
      }
    }
    
    ctx.stroke();
  };

  // Format the equation for display, substituting current values
  const formatEquation = (eq: string, values: Record<string, number>): string => {
    let formatted = eq;
    
    // Highlight variables with their current values
    Object.entries(values).forEach(([variable, value]) => {
      // Use regex to find the variable, being careful about variable names that might be substrings of others
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      formatted = formatted.replace(regex, `<span class="text-blue-600 font-bold">${value}</span>`);
    });
    
    return formatted;
  };

  // Create data table for the equation
  const generateTableData = () => {
    if (!showTable) return null;
    
    const data: { x: number; y: number }[] = [];
    const xMin = graphDomain[0];
    const xMax = graphDomain[1];
    const stepSize = (xMax - xMin) / 10;
    
    const match = equation.match(/y\s*=\s*(.*)/);
    if (!match) return data;
    
    const expression = match[1];
    
    const evaluateExpression = (expr: string, x: number): number => {
      const withVariables = Object.entries(variableValues).reduce((acc, [variable, value]) => {
        const regex = new RegExp(`\\b${variable}\\b`, 'g');
        return acc.replace(regex, value.toString());
      }, expr);
      
      const withX = withVariables.replace(/\bx\b/g, x.toString());
      
      try {
        // eslint-disable-next-line no-eval
        return eval(withX);
      } catch {
        return NaN;
      }
    };
    
    for (let x = xMin; x <= xMax; x += stepSize) {
      const roundedX = Math.round(x * 100) / 100;
      const y = evaluateExpression(expression, roundedX);
      if (!isNaN(y)) {
        data.push({ x: roundedX, y: Math.round(y * 100) / 100 });
      }
    }
    
    return data;
  };

  // Calculate table data
  const tableData = useMemo(() => generateTableData(), [
    showTable, equation, variableValues, graphDomain
  ]);

  return (
    <div id={blockId} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Block Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-bold text-lg text-blue-600">{title || 'Equation Explorer'}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      {/* Graph Section */}
      {showGraph && (
        <div className="p-4 border-b border-gray-100">
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={300} 
            className="w-full h-auto bg-gray-50 rounded"
          />
        </div>
      )}
      
      {/* Controls Section */}
      <div className="p-4">
        {/* Formula Display */}
        {showFormula && (
          <div className="mb-6 py-2 px-4 bg-gray-50 rounded text-center">
            <div 
              className="text-lg font-medium" 
              dangerouslySetInnerHTML={{ __html: formatEquation(equation, variableValues) }}
            />
          </div>
        )}
        
        {/* Variable Sliders */}
        <div className="space-y-4">
          {variables.map(variable => {
            const min = range[variable]?.[0] ?? -10;
            const max = range[variable]?.[1] ?? 10;
            const value = variableValues[variable] ?? initialValues[variable] ?? 0;
            
            return (
              <div key={variable}>
                <label className="flex justify-between text-sm mb-1">
                  <span>{variable}</span>
                  <span className="font-medium">{value}</span>
                </label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => handleSliderChange(variable, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
        
        {/* Data Table */}
        {showTable && tableData && tableData.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Value Table</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">x</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">y</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tableData.map((row: { x: number; y: number }, index: number) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-gray-900">{row.x}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{row.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// React memo optimization
export default React.memo(EquationExplorer);
