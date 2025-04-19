/**
 * Concept Visualizer Block Component
 * 
 * This component renders an interactive visualization of mathematical concepts
 * with support for various visualization types and interactive transformations.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ConceptVisualizerParameters,
  Transformation 
} from '@/lib/block-templates/concept-visualizer-block';

// Define props interface extending the block parameters
interface ConceptVisualizerProps {
  parameters: ConceptVisualizerParameters;
  id: string;
  title?: string;
  description?: string;
  onParameterChange?: (parameters: Partial<ConceptVisualizerParameters>) => void;
}

export const ConceptVisualizer: React.FC<ConceptVisualizerProps> = ({
  parameters,
  id,
  title,
  description,
  onParameterChange
}) => {
  // Extract parameters with defaults
  const {
    conceptType,
    baseFunction,
    transformations = [],
    domain = [-10, 10],
    range = [-10, 10],
    showGrid = true,
    showAxis = true,
    showLabels = true,
    interactive = true,
    animationSpeed = 1
  } = parameters;

  // Canvas reference for drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for tracking transformations
  const [activeTransformations, setActiveTransformations] = useState<Transformation[]>(transformations);
  const [animating, setAnimating] = useState<boolean>(false);
  const [activeTransformationIndex, setActiveTransformationIndex] = useState<number>(-1);
  
  // Additional state for specific concept visualizations
  const [functionExpression, setFunctionExpression] = useState<string>(baseFunction);
  
  // Transformation range bounds
  const transformationBounds = {
    translation: [-10, 10],
    scale: [0.1, 5],
    rotation: [0, 360],
  };
  
  // Parse the function expression into a callable function
  const parsedFunction = useMemo(() => {
    try {
      // Simple parsing for expressions like "y = x^2", "y = 2*x + 1"
      // In a production app, use a proper math expression parser
      const expressionMatch = baseFunction.match(/y\s*=\s*(.*)/i);
      if (!expressionMatch) return (x: number) => x;
      
      const expression = expressionMatch[1].trim()
        .replace(/\^/g, '**') // Convert ^ to **
        .replace(/(\d+)x/g, '$1*x'); // Convert 2x to 2*x
      
      // Create a function that evaluates the expression
      return new Function('x', `return ${expression}`) as (x: number) => number;
    } catch (error) {
      console.error('Error parsing function:', error);
      return (x: number) => x;
    }
  }, [baseFunction]);
  
  // Initialize the canvas when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      // Set canvas dimensions
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Set up canvas scaling
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.translate(rect.width / 2, rect.height / 2);
        ctx.scale(rect.width / (domain[1] - domain[0]), -rect.height / (range[1] - range[0]));
        ctx.translate(-(domain[0] + domain[1]) / 2, -(range[0] + range[1]) / 2);
      }
      
      // Draw the visualization
      drawVisualization();
    }
  }, [
    canvasRef, 
    domain, 
    range, 
    showGrid, 
    showAxis, 
    showLabels, 
    activeTransformations,
    conceptType,
    functionExpression
  ]);
  
  // Function to apply transformations to a point
  const applyTransformations = (x: number, y: number): [number, number] => {
    let transformedX = x;
    let transformedY = y;
    
    activeTransformations.forEach(transformation => {
      if (transformation.type === 'translation') {
        if (transformation.axis === 'x') transformedX += transformation.value;
        if (transformation.axis === 'y') transformedY += transformation.value;
      } else if (transformation.type === 'scale') {
        if (transformation.axis === 'x') transformedX *= transformation.value;
        if (transformation.axis === 'y') transformedY *= transformation.value;
      } else if (transformation.type === 'rotation' && transformation.axis === 'origin') {
        // Rotate around origin
        const radians = (transformation.value * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        const newX = transformedX * cos - transformedY * sin;
        const newY = transformedX * sin + transformedY * cos;
        
        transformedX = newX;
        transformedY = newY;
      }
    });
    
    return [transformedX, transformedY];
  };
  
  // Draw the visualization on the canvas
  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx);
    }
    
    // Draw axes if enabled
    if (showAxis) {
      drawAxes(ctx);
    }
    
    // Draw concept visualization based on type
    switch (conceptType) {
      case 'function-transformation':
        drawFunctionTransformation(ctx);
        break;
      case 'vector-operation':
        drawVectorOperation(ctx);
        break;
      case 'geometric-transformation':
        drawGeometricTransformation(ctx);
        break;
      case 'trigonometric-circle':
        drawTrigonometricCircle(ctx);
        break;
      case 'coordinate-system':
        drawCoordinateSystem(ctx);
        break;
      case 'slope-intercept':
        drawSlopeIntercept(ctx);
        break;
      default:
        drawFunctionTransformation(ctx); // Default to function transformation
    }
    
    // Draw labels if enabled
    if (showLabels) {
      drawLabels(ctx);
    }
  };
  
  // Draw the coordinate grid
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 0.05;
    
    // Draw vertical grid lines
    for (let x = Math.ceil(domain[0]); x <= Math.floor(domain[1]); x++) {
      if (x === 0) continue; // Skip the x-axis
      ctx.moveTo(x, range[0]);
      ctx.lineTo(x, range[1]);
    }
    
    // Draw horizontal grid lines
    for (let y = Math.ceil(range[0]); y <= Math.floor(range[1]); y++) {
      if (y === 0) continue; // Skip the y-axis
      ctx.moveTo(domain[0], y);
      ctx.lineTo(domain[1], y);
    }
    
    ctx.stroke();
  };
  
  // Draw the coordinate axes
  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 0.1;
    
    // X-axis
    ctx.moveTo(domain[0], 0);
    ctx.lineTo(domain[1], 0);
    
    // Y-axis
    ctx.moveTo(0, range[0]);
    ctx.lineTo(0, range[1]);
    
    ctx.stroke();
  };
  
  // Draw function transformation visualization
  const drawFunctionTransformation = (ctx: CanvasRenderingContext2D) => {
    // Draw the original function (lighter color)
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.1;
    
    const step = (domain[1] - domain[0]) / 200;
    let firstPoint = true;
    
    for (let x = domain[0]; x <= domain[1]; x += step) {
      try {
        const y = parsedFunction(x);
        
        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      } catch {
        // Skip points that cause errors (e.g., division by zero)
      }
    }
    
    ctx.stroke();
    
    // Draw the transformed function
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6'; // Blue color
    ctx.lineWidth = 0.15;
    
    firstPoint = true;
    
    for (let x = domain[0]; x <= domain[1]; x += step) {
      try {
        const y = parsedFunction(x);
        
        // Apply transformations
        const [transformedX, transformedY] = applyTransformations(x, y);
        
        if (firstPoint) {
          ctx.moveTo(transformedX, transformedY);
          firstPoint = false;
        } else {
          ctx.lineTo(transformedX, transformedY);
        }
      } catch {
        // Skip points that cause errors
      }
    }
    
    ctx.stroke();
  };
  
  // Draw vector operation visualization
  const drawVectorOperation = (ctx: CanvasRenderingContext2D) => {
    // Implement vector visualization
    // For now, we'll draw a simple vector
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 0.15;
    
    // Draw a vector from origin
    ctx.moveTo(0, 0);
    const [x, y] = applyTransformations(2, 1);
    ctx.lineTo(x, y);
    
    // Draw arrow head
    const headLen = 0.3;
    const angle = Math.atan2(y, x);
    
    ctx.lineTo(
      x - headLen * Math.cos(angle - Math.PI / 6),
      y - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x, y);
    ctx.lineTo(
      x - headLen * Math.cos(angle + Math.PI / 6),
      y - headLen * Math.sin(angle + Math.PI / 6)
    );
    
    ctx.stroke();
  };
  
  // Draw geometric transformation visualization
  const drawGeometricTransformation = (ctx: CanvasRenderingContext2D) => {
    // Implement geometric transformation visualization
    // For now, draw a simple square and its transformation
    const square = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ];
    
    // Draw original square
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.1;
    
    ctx.moveTo(square[0][0], square[0][1]);
    for (let i = 1; i < square.length; i++) {
      ctx.lineTo(square[i][0], square[i][1]);
    }
    ctx.closePath();
    ctx.stroke();
    
    // Draw transformed square
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 0.15;
    
    const [x0, y0] = applyTransformations(square[0][0], square[0][1]);
    ctx.moveTo(x0, y0);
    
    for (let i = 1; i < square.length; i++) {
      const [x, y] = applyTransformations(square[i][0], square[i][1]);
      ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.stroke();
  };
  
  // Draw trigonometric circle visualization
  const drawTrigonometricCircle = (ctx: CanvasRenderingContext2D) => {
    // Implement trigonometric circle visualization
    const radius = 2;
    
    // Draw the unit circle
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.1;
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw an angle
    const angle = Math.PI / 4; // 45 degrees
    
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 0.15;
    
    // Draw the angle arc
    ctx.arc(0, 0, 0.5, 0, angle);
    
    // Draw the radius line
    ctx.moveTo(0, 0);
    ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    
    // Draw the sine and cosine lines
    ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
    ctx.lineTo(radius * Math.cos(angle), 0);
    
    ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
    ctx.lineTo(0, radius * Math.sin(angle));
    
    ctx.stroke();
  };
  
  // Draw coordinate system visualization
  const drawCoordinateSystem = (ctx: CanvasRenderingContext2D) => {
    // Implement coordinate system visualization
    // This is a simplified version showing just the basics
    
    // Draw the grid (already done in drawGrid)
    
    // Plot some example points
    const points = [
      [2, 3],
      [-1, 2],
      [3, -2],
      [-2, -1]
    ];
    
    for (const point of points) {
      const [x, y] = applyTransformations(point[0], point[1]);
      
      ctx.beginPath();
      ctx.fillStyle = '#3b82f6';
      ctx.arc(x, y, 0.15, 0, 2 * Math.PI);
      ctx.fill();
    }
  };
  
  // Draw slope-intercept visualization
  const drawSlopeIntercept = (ctx: CanvasRenderingContext2D) => {
    // Implement slope-intercept visualization (y = mx + b)
    const m = 2; // Slope
    const b = 1; // Y-intercept
    
    // Draw the line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 0.15;
    
    const x1 = domain[0];
    const y1 = m * x1 + b;
    const x2 = domain[1];
    const y2 = m * x2 + b;
    
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Highlight the y-intercept
    ctx.beginPath();
    ctx.fillStyle = '#ef4444'; // Red
    ctx.arc(0, b, 0.15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Show the slope triangle
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e'; // Green
    ctx.lineWidth = 0.12;
    
    const xStart = 1;
    const yStart = m * xStart + b;
    const xEnd = xStart + 1;
    const yEnd = m * xEnd + b;
    
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.lineTo(xStart, yStart);
    
    ctx.stroke();
  };
  
  // Draw labels on the axes
  const drawLabels = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.resetTransform();
    
    const canvas = canvasRef.current;
    if (!canvas) {
      ctx.restore();
      return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate the origin in screen coordinates
    const originX = width / 2;
    const originY = height / 2;
    
    // X-axis labels
    for (let x = Math.ceil(domain[0]); x <= Math.floor(domain[1]); x++) {
      if (x === 0) continue; // Skip the origin
      
      const screenX = originX + (x * width) / (domain[1] - domain[0]);
      const screenY = originY + 15;
      
      ctx.fillText(x.toString(), screenX, screenY);
    }
    
    // Y-axis labels
    for (let y = Math.ceil(range[0]); y <= Math.floor(range[1]); y++) {
      if (y === 0) continue; // Skip the origin
      
      const screenX = originX - 15;
      const screenY = originY - (y * height) / (range[1] - range[0]);
      
      ctx.fillText(y.toString(), screenX, screenY);
    }
    
    // Origin label
    ctx.fillText('0', originX - 15, originY + 15);
    
    ctx.restore();
  };
  
  // Handle transformation change
  const handleTransformationChange = (index: number, property: keyof Transformation, value: number) => {
    if (!interactive) return;
    
    const newTransformations = [...activeTransformations];
    newTransformations[index] = {
      ...newTransformations[index],
      [property]: value
    };
    
    setActiveTransformations(newTransformations);
    
    if (onParameterChange) {
      onParameterChange({ transformations: newTransformations });
    }
  };
  
  // Add a new transformation
  const addTransformation = (type: Transformation['type'], axis: Transformation['axis']) => {
    const newTransformation: Transformation = {
      type,
      axis,
      value: 0
    };
    
    const newTransformations = [...activeTransformations, newTransformation];
    setActiveTransformations(newTransformations);
    
    if (onParameterChange) {
      onParameterChange({ transformations: newTransformations });
    }
  };
  
  // Remove a transformation
  const removeTransformation = (index: number) => {
    const newTransformations = activeTransformations.filter((_, i) => i !== index);
    setActiveTransformations(newTransformations);
    
    if (onParameterChange) {
      onParameterChange({ transformations: newTransformations });
    }
  };
  
  // Reset transformations
  const resetTransformations = () => {
    const newTransformations: Transformation[] = [
      { type: 'translation', axis: 'x', value: 0 },
      { type: 'translation', axis: 'y', value: 0 },
      { type: 'scale', axis: 'x', value: 1 },
      { type: 'scale', axis: 'y', value: 1 },
    ];
    
    setActiveTransformations(newTransformations);
    
    if (onParameterChange) {
      onParameterChange({ transformations: newTransformations });
    }
  };
  
  // Animate transformations
  const animateTransformations = () => {
    if (animating) {
      setAnimating(false);
      return;
    }
    
    setAnimating(true);
    let step = 0;
    
    const animation = () => {
      if (!animating) return;
      
      const newTransformations = [...activeTransformations];
      const stepSize = 0.02 * animationSpeed;
      
      // Apply animation step to all transformations
      for (let i = 0; i < newTransformations.length; i++) {
        const transformation = newTransformations[i];
        switch (transformation.type) {
          case 'translation':
            transformation.value = Math.sin(step) * 2;
            break;
          case 'scale':
            transformation.value = 1 + Math.sin(step) * 0.5;
            break;
          case 'rotation':
            transformation.value = (step * 180 / Math.PI) % 360;
            break;
        }
      }
      
      setActiveTransformations(newTransformations);
      step += stepSize;
      
      requestAnimationFrame(animation);
    };
    
    requestAnimationFrame(animation);
  };
  
  // Render transformation controls
  const renderTransformationControls = () => {
    if (!interactive) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <div className="font-medium">Transformations</div>
        
        {activeTransformations.map((transformation, index) => (
          <div 
            key={index} 
            className={`p-2 border rounded ${
              activeTransformationIndex === index 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200'
            }`}
            onClick={() => setActiveTransformationIndex(index)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {transformation.type} ({transformation.axis})
              </span>
              <button 
                className="text-xs text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTransformation(index);
                }}
              >
                Remove
              </button>
            </div>
            
            <div className="flex items-center">
              <input
                type="range"
                min={
                  transformation.type === 'translation' 
                    ? transformationBounds.translation[0] 
                    : transformation.type === 'scale' 
                      ? transformationBounds.scale[0] 
                      : transformationBounds.rotation[0]
                }
                max={
                  transformation.type === 'translation' 
                    ? transformationBounds.translation[1] 
                    : transformation.type === 'scale' 
                      ? transformationBounds.scale[1] 
                      : transformationBounds.rotation[1]
                }
                step={
                  transformation.type === 'rotation' ? 1 : 0.1
                }
                value={transformation.value}
                onChange={(e) => handleTransformationChange(
                  index, 
                  'value', 
                  parseFloat(e.target.value)
                )}
                className="flex-grow"
              />
              
              <span className="ml-2 text-sm w-12 text-right">
                {transformation.value.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addTransformation('translation', 'x')}
          >
            Add X-Translation
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addTransformation('translation', 'y')}
          >
            Add Y-Translation
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addTransformation('scale', 'x')}
          >
            Add X-Scale
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addTransformation('scale', 'y')}
          >
            Add Y-Scale
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addTransformation('rotation', 'origin')}
          >
            Add Rotation
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={resetTransformations}
          >
            Reset
          </Button>
          
          <Button 
            size="sm" 
            variant={animating ? 'outline' : 'primary'}
            onClick={animateTransformations}
          >
            {animating ? 'Stop Animation' : 'Animate'}
          </Button>
        </div>
      </div>
    );
  };
  
  // Block-specific configuration controls
  const renderConceptControls = () => {
    if (conceptType === 'function-transformation') {
      return (
        <div className="mt-4">
          <div className="font-medium mb-2">Function Expression</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={functionExpression}
              onChange={(e) => setFunctionExpression(e.target.value)}
              className="flex-grow p-2 border rounded"
              placeholder="e.g., y = x^2"
              disabled={!interactive}
            />
            <Button 
              size="sm"
              onClick={() => {
                if (onParameterChange) {
                  onParameterChange({ baseFunction: functionExpression });
                }
              }}
              disabled={!interactive || functionExpression === baseFunction}
            >
              Apply
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  // Unique ID for the block
  const blockId = `concept-visualizer-${id}`;
  
  return (
    <div id={blockId} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Block Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-bold text-lg text-blue-600">{title || 'Concept Visualizer'}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{parameters.description || description}</p>
        )}
      </div>
      
      {/* Visualization Canvas */}
      <div className="p-4">
        <div className="bg-gray-50 border border-gray-200 rounded aspect-square w-full overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            style={{ touchAction: 'none' }}
          />
        </div>
        
        {/* Controls */}
        {renderConceptControls()}
        {renderTransformationControls()}
      </div>
    </div>
  );
};

// React memo optimization
export default React.memo(ConceptVisualizer);
