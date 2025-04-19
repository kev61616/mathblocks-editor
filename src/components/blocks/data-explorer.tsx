/**
 * Data Explorer Block Component
 * 
 * This component provides interactive data visualization and analysis
 * with support for various chart types, data transformations, and
 * regression analysis.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DataExplorerParameters, 
  RegressionOptions
} from '@/lib/block-templates/data-explorer-block';

// Define props interface extending the block parameters
interface DataExplorerProps {
  parameters: DataExplorerParameters;
  id: string;
  title?: string;
  description?: string;
  onParameterChange?: (parameters: Partial<DataExplorerParameters>) => void;
}

// Sample data for demo purposes
const sampleData = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 9 },
  { x: 4, y: 16 },
  { x: 5, y: 25 }
];

// Data point interface
interface DataPoint {
  [key: string]: number | string | boolean | null;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({
  parameters,
  id,
  title,
  description,
  onParameterChange
}) => {
  // Extract parameters with defaults
  const {
    dataSource = 'inline',
    data = sampleData,
    chartType = 'scatter',
    title: chartTitle = 'Data Visualization',
    dataColumns = ['x', 'y'],
    regressionOptions = {
      enabled: false,
      type: 'linear',
      displayEquation: true,
      displayR2: true
    }
  } = parameters;

  // Canvas reference for chart rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for chart and data management
  const [processedData, setProcessedData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(dataColumns);
  const [regressionResults, setRegressionResults] = useState<{
    equation: string;
    r2: number;
    points: {x: number; y: number}[];
  } | null>(null);
  
  // Load and process data on mount and when parameters change
  useEffect(() => {
    loadData();
  }, [dataSource, data]);
  
  // Update chart when parameters or processed data change
  useEffect(() => {
    if (processedData.length > 0 && canvasRef.current) {
      renderChart();
    }
  }, [processedData, chartType, selectedColumns, regressionResults]);
  
  // Load data from the specified source
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let loadedData: DataPoint[] = [];
      
      if (dataSource === 'inline') {
        loadedData = Array.isArray(data) ? [...data] as DataPoint[] : [];
      } else {
        // For other data sources, we'd implement fetching logic
        // For now, we'll just use the sample data
        loadedData = sampleData;
      }
      
      setProcessedData(loadedData);
      
      // Calculate regression if enabled
      if (regressionOptions.enabled && loadedData.length > 0) {
        calculateRegression(loadedData);
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please check your data source and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate regression for the selected columns
  const calculateRegression = (data: DataPoint[]) => {
    if (selectedColumns.length < 2) return;
    
    // Extract x and y values
    const xValues = data.map(point => Number(point[selectedColumns[0]]) || 0);
    const yValues = data.map(point => Number(point[selectedColumns[1]]) || 0);
    
    // Only proceed if we have valid data points
    if (xValues.some(isNaN) || yValues.some(isNaN)) {
      setRegressionResults(null);
      return;
    }
    
    // Simple linear regression implementation
    if (regressionOptions.type === 'linear') {
      // Calculate linear regression
      const n = xValues.length;
      const sumX = xValues.reduce((sum, x) => sum + x, 0);
      const sumY = yValues.reduce((sum, y) => sum + y, 0);
      const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
      const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // Calculate R-squared
      const predictedY = xValues.map(x => slope * x + intercept);
      const meanY = sumY / n;
      const totalSS = yValues.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0);
      const residualSS = yValues.reduce((sum, y, i) => sum + Math.pow(y - predictedY[i], 2), 0);
      const r2 = 1 - (residualSS / totalSS);
      
      // Generate regression line points
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const points = [
        { x: minX, y: slope * minX + intercept },
        { x: maxX, y: slope * maxX + intercept }
      ];
      
      // Set regression results
      setRegressionResults({
        equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
        r2,
        points
      });
    } else {
      setRegressionResults(null);
    }
  };
  
  // Render the chart 
  const renderChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // In a real implementation, we would use a charting library
    // This is a simplified implementation for demo purposes
    
    // Draw chart title
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(chartTitle, canvas.width / 2, 20);
    
    // Add a placeholder text
    ctx.font = '14px Arial';
    ctx.fillText(`${chartType} chart of ${selectedColumns[1]} vs ${selectedColumns[0]}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`${processedData.length} data points`, canvas.width / 2, canvas.height / 2 + 30);
    
    if (regressionResults) {
      ctx.fillText(`Regression: ${regressionResults.equation}`, canvas.width / 2, canvas.height / 2 + 60);
      ctx.fillText(`R² = ${regressionResults.r2.toFixed(4)}`, canvas.width / 2, canvas.height / 2 + 90);
    }
  };
  
  // Toggle regression analysis
  const toggleRegression = () => {
    const newRegressionOptions = {
      ...regressionOptions,
      enabled: !regressionOptions.enabled
    };
    
    // Update parameters if callback is provided
    if (onParameterChange) {
      onParameterChange({ regressionOptions: newRegressionOptions });
    }
    
    // Calculate regression if enabled
    if (newRegressionOptions.enabled) {
      calculateRegression(processedData);
    } else {
      setRegressionResults(null);
    }
  };
  
  // Handle column selection change
  const handleColumnChange = (columnIndex: number, columnName: string) => {
    const newSelectedColumns = [...selectedColumns];
    newSelectedColumns[columnIndex] = columnName;
    setSelectedColumns(newSelectedColumns);
    
    if (onParameterChange) {
      onParameterChange({ dataColumns: newSelectedColumns });
    }
    
    if (regressionOptions.enabled) {
      calculateRegression(processedData);
    }
  };
  
  // Get available columns from the data
  const availableColumns = useMemo(() => {
    if (processedData.length === 0) return [];
    
    const columns = new Set<string>();
    processedData.forEach(point => {
      Object.keys(point).forEach(key => columns.add(key));
    });
    
    return Array.from(columns);
  }, [processedData]);
  
  // Unique ID for the block
  const blockId = `data-explorer-${id}`;
  
  return (
    <div id={blockId} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Block Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-bold text-lg text-blue-600">{title || 'Data Explorer'}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 p-4 border-b border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Main content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Chart Area */}
            <div className="md:col-span-2 bg-gray-50 p-4 rounded border">
              <canvas 
                ref={canvasRef} 
                width={600} 
                height={400} 
                className="w-full h-64 md:h-full"
              ></canvas>
            </div>
            
            {/* Controls Area */}
            <div className="space-y-4">
              {/* Chart Controls */}
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium mb-3">Chart Settings</h4>
                
                {/* Column Selector */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">X Axis</label>
                    <select
                      value={selectedColumns[0] || ''}
                      onChange={(e) => handleColumnChange(0, e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded"
                    >
                      {availableColumns.map(column => (
                        <option key={`x-${column}`} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Y Axis</label>
                    <select
                      value={selectedColumns[1] || ''}
                      onChange={(e) => handleColumnChange(1, e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded"
                    >
                      {availableColumns.map(column => (
                        <option key={`y-${column}`} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Chart Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Chart Type</label>
                  <select
                    value={chartType}
                    onChange={(e) => {
                      if (onParameterChange) {
                        onParameterChange({ 
                          chartType: e.target.value as DataExplorerParameters['chartType'] 
                        });
                      }
                    }}
                    className="block w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="scatter">Scatter Plot</option>
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="histogram">Histogram</option>
                    <option value="box">Box Plot</option>
                    <option value="heatmap">Heat Map</option>
                  </select>
                </div>
              </div>
              
              {/* Regression Controls */}
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium mb-3">Regression Analysis</h4>
                
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id={`regression-toggle-${id}`}
                    checked={regressionOptions.enabled}
                    onChange={toggleRegression}
                    className="mr-2"
                  />
                  <label htmlFor={`regression-toggle-${id}`} className="text-sm font-medium">
                    Enable Regression
                  </label>
                </div>
                
                {regressionOptions.enabled && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        value={regressionOptions.type}
                        onChange={(e) => {
                          const newOptions = {
                            ...regressionOptions,
                            type: e.target.value as RegressionOptions['type']
                          };
                          if (onParameterChange) {
                            onParameterChange({ regressionOptions: newOptions });
                          }
                        }}
                        className="block w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="linear">Linear</option>
                        <option value="exponential">Exponential</option>
                        <option value="logarithmic">Logarithmic</option>
                        <option value="polynomial">Polynomial</option>
                        <option value="power">Power</option>
                      </select>
                    </div>
                    
                    {regressionResults && (
                      <div className="bg-blue-50 p-3 rounded border border-blue-100">
                        <p className="text-sm font-medium">{regressionResults.equation}</p>
                        <p className="text-sm">R² = {regressionResults.r2.toFixed(4)}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadData()}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// React memo optimization
export default React.memo(DataExplorer);
