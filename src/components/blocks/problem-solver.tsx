/**
 * Problem Solver Block Component
 * 
 * This component renders an interactive problem solver that guides students
 * through mathematical problem solutions step by step.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProblemSolverParameters, ProblemSolverStep } from '@/lib/block-templates/problem-solver-block';

// Define props interface extending the block parameters
interface ProblemSolverProps {
  parameters: ProblemSolverParameters;
  id: string;
  title?: string;
  description?: string;
  onStepComplete?: (stepIndex: number, userInput?: string) => void;
  onComplete?: () => void;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({
  parameters,
  id,
  title,
  description,
  onStepComplete,
  onComplete
}) => {
  // Get parameters with defaults
  const {
    problem,
    steps,
    showHints = true,
    progressiveReveal = true,
    requireUserInput = false,
    feedbackLevel = 'detailed',
    solutionVisible = 'after-attempt',
  } = parameters;

  // Use id as a unique identifier for elements
  const blockId = `problem-solver-${id}`;
  
  // State for tracking progress through the problem
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [showingSolution, setShowingSolution] = useState<boolean>(solutionVisible === 'always');
  const [inputError, setInputError] = useState<string | null>(null);
  const [showingHint, setShowingHint] = useState<Record<number, boolean>>({});

  // Function to check if a step is visible based on settings
  const isStepVisible = (index: number): boolean => {
    if (!progressiveReveal) return true;
    if (showingSolution) return true;
    return index <= currentStepIndex;
  };

  // Function to check if a step is completed
  const isStepCompleted = (index: number): boolean => {
    return completedSteps.includes(index);
  };

  // Handle proceeding to the next step
  const handleNextStep = () => {
    if (requireUserInput && !userInputs[currentStepIndex]) {
      setInputError('Please provide your answer before continuing.');
      return;
    }

    // Mark the current step as completed
    if (!isStepCompleted(currentStepIndex)) {
      setCompletedSteps(prev => [...prev, currentStepIndex]);
      
      // Call the onStepComplete callback if provided
      if (onStepComplete) {
        onStepComplete(currentStepIndex, userInputs[currentStepIndex]);
      }
    }

    // If we're not at the last step, move to the next step
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setInputError(null);
    } else {
      // If we're at the last step, mark as showing solution
      setShowingSolution(true);
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Handle user input change
  const handleInputChange = (stepIndex: number, value: string) => {
    setUserInputs(prev => ({ ...prev, [stepIndex]: value }));
    setInputError(null);
  };

  // Toggle hint visibility for a step
  const toggleHint = (stepIndex: number) => {
    setShowingHint(prev => ({ ...prev, [stepIndex]: !prev[stepIndex] }));
  };

  // Reset the problem
  const resetProblem = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setUserInputs({});
    setShowingSolution(solutionVisible === 'always');
    setInputError(null);
    setShowingHint({});
  };

  // Show all steps (reveal solution)
  const showSolution = () => {
    setShowingSolution(true);
  };

  // Render a step with appropriate styling and interactive elements
  const renderStep = (step: ProblemSolverStep, index: number) => {
    const isVisible = isStepVisible(index);
    const isCompleted = isStepCompleted(index);
    const isCurrent = currentStepIndex === index;
    const showInput = requireUserInput && isCurrent && !isCompleted;
    const showHintButton = showHints && step.hint && isVisible;
    const isHintVisible = showingHint[index];

    return (
      <div 
        key={`step-${index}`}
        className={`p-4 border rounded-md mb-3 transition-all ${
          !isVisible 
            ? 'hidden' 
            : isCompleted 
              ? 'bg-green-50 border-green-200' 
              : isCurrent 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{`Step ${index + 1}: ${step.description}`}</span>
          {isCompleted && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>
        
        {showInput ? (
          <div className="mb-3">
            <div className="flex items-center">
              <input
                type="text"
                value={userInputs[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Enter your answer here"
                className="p-2 border rounded w-full"
              />
              <Button 
                className="ml-2" 
                onClick={() => handleNextStep()}
              >
                Check
              </Button>
            </div>
            {inputError && (
              <p className="text-red-500 text-sm mt-1">{inputError}</p>
            )}
          </div>
        ) : (
          isVisible && (
            <div className="p-2 bg-white rounded border border-gray-200 mb-3">
              <div 
                className="font-mono text-base" 
                dangerouslySetInnerHTML={{ __html: step.expression.replace(/\*/g, '×').replace(/\//g, '÷') }} 
              />
            </div>
          )
        )}
        
        {isVisible && feedbackLevel !== 'minimal' && step.explanation && isCompleted && (
          <div className="text-sm text-gray-700 mb-2">
            <p>{step.explanation}</p>
          </div>
        )}
        
        {showHintButton && (
          <button
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            onClick={() => toggleHint(index)}
          >
            {isHintVisible ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}
        
        {showHintButton && isHintVisible && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm">
            {step.hint}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id={blockId} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Block Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-bold text-lg text-blue-600">{title || 'Problem Solver'}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      {/* Problem Statement */}
      <div className="p-4 border-b border-gray-100">
        <div className="mb-2 font-medium">Problem:</div>
        <div className="p-3 bg-gray-50 rounded">
          {problem}
        </div>
      </div>
      
      {/* Solution Steps */}
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Solution:</h4>
            <div className="space-x-2">
              {!showingSolution && solutionVisible !== 'never' && (
                <Button variant="outline" size="sm" onClick={showSolution}>
                  Show All Steps
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={resetProblem}>
                Reset
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {steps.map((step, index) => renderStep(step, index))}
          </div>
          
          {/* Next Step Button */}
          {!showingSolution && currentStepIndex < steps.length - 1 && isStepCompleted(currentStepIndex) && (
            <Button 
              className="w-full mt-4" 
              onClick={handleNextStep}
            >
              Next Step
            </Button>
          )}
          
          {/* Complete Button */}
          {!showingSolution && currentStepIndex === steps.length - 1 && isStepCompleted(currentStepIndex) && (
            <Button 
              className="w-full mt-4" 
              onClick={handleNextStep}
            >
              Complete
            </Button>
          )}
          
          {/* Completion Message */}
          {showingSolution && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-green-700 font-medium">Solution Complete!</p>
              {feedbackLevel === 'detailed' && (
                <p className="text-green-600 text-sm mt-1">
                  You&apos;ve successfully worked through all steps of this problem.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// React memo optimization
export default React.memo(ProblemSolver);
