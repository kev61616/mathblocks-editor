/**
 * HTML Parser Utility
 * 
 * This module provides functionality for parsing HTML content and detecting
 * mathematical patterns that can be transformed into interactive blocks.
 */

/**
 * HTML Element with additional properties for transformation
 */
export interface SourceElement extends Element {
  textContent: string | null;
  innerHTML: string;
  tagName: string;
}

/**
 * Interface for transformation suggestion results
 */
export interface TransformationSuggestion {
  type: string;
  sourceElements: SourceElement[];
  description: string;
  confidence: number;
  blockParameters: Record<string, unknown>;
}

/**
 * Parse HTML content into a DOM structure for analysis
 * @param htmlContent HTML content string to parse
 * @returns Parsed Document
 */
export function parseHtmlContent(htmlContent: string): Document {
  // Use DOMParser to parse the HTML content
  const parser = new DOMParser();
  return parser.parseFromString(htmlContent, 'text/html');
}

/**
 * Generate transformation suggestions from HTML content
 * @param htmlContent HTML content to analyze
 * @returns Array of transformation suggestions
 */
export function generateTransformationSuggestions(htmlContent: string): TransformationSuggestion[] {
  const suggestions: TransformationSuggestion[] = [];
  
  // Parse the HTML content
  const doc = parseHtmlContent(htmlContent);
  
  // Look for patterns in the document
  detectEquationPatterns(doc, suggestions);
  detectProblemSolverPatterns(doc, suggestions);
  
  // Sort suggestions by confidence (highest first)
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Detect equation patterns in the document
 * @param doc Parsed HTML document
 * @param suggestions Array to add suggestions to
 */
function detectEquationPatterns(doc: Document, suggestions: TransformationSuggestion[]): void {
  // Look for equation patterns in various elements
  const potentialEquations = [
    ...Array.from(doc.querySelectorAll('p')),
    ...Array.from(doc.querySelectorAll('div')),
    ...Array.from(doc.querySelectorAll('span')),
    ...Array.from(doc.querySelectorAll('li')),
  ];
  
  for (const element of potentialEquations) {
    const text = element.textContent || '';
    
    // Skip elements with too little text
    if (text.length < 3) continue;
    
    // Look for equation patterns
    
    // Linear equations (e.g., y = mx + b, 2x + 3 = 7)
    const linearEquationPattern = /([a-z])\s*=\s*([0-9.]*[a-z])\s*[+\-]\s*([0-9.]+)|([0-9.]*[a-z])\s*[+\-]\s*([0-9.]+)\s*=\s*([0-9.]+)/i;
    if (linearEquationPattern.test(text)) {
      const equationText = text.match(linearEquationPattern)?.[0] || text;
      
      let variable = 'x';
      // Extract the variable from the equation
      const variableMatch = equationText.match(/([a-z])\s*=/i) || equationText.match(/([0-9.]*[a-z])/i);
      if (variableMatch && variableMatch[1]) {
        const matchedVar = variableMatch[1].match(/[a-z]/i);
        if (matchedVar) {
          variable = matchedVar[0].toLowerCase();
        }
      }
      
      suggestions.push({
        type: 'equationExplorer',
        sourceElements: [element as SourceElement],
        description: 'Interactive Linear Equation Explorer',
        confidence: 0.85,
        blockParameters: {
          equation: equationText.trim(),
          variables: [variable],
          range: { [variable]: [-10, 10] },
          initialValues: { [variable]: 0 },
          showGraph: true,
          showFormula: true,
        }
      });
      continue;
    }
    
    // Quadratic equations (e.g., y = x^2 + 2x + 1, x^2 + 3x - 4 = 0)
    const quadraticPattern = /([a-z])\s*=\s*([a-z])(\^2|\²)\s*[+\-]\s*([0-9.]*[a-z])\s*[+\-]\s*([0-9.]+)|([a-z])(\^2|\²)\s*[+\-]\s*([0-9.]*[a-z])\s*[+\-]\s*([0-9.]+)\s*=\s*([0-9.]+)/i;
    if (quadraticPattern.test(text)) {
      const equationText = text.match(quadraticPattern)?.[0] || text;
      
      let variable = 'x';
      // Extract the variable from the equation
      const variableMatch = equationText.match(/([a-z])\s*=/i) || equationText.match(/([a-z])(\^2|\²)/i);
      if (variableMatch && variableMatch[1]) {
        variable = variableMatch[1].toLowerCase();
      }
      
      suggestions.push({
        type: 'equationExplorer',
        sourceElements: [element as SourceElement],
        description: 'Interactive Quadratic Function Explorer',
        confidence: 0.9,
        blockParameters: {
          equation: equationText.trim(),
          variables: [variable],
          range: { [variable]: [-10, 10] },
          initialValues: { [variable]: 0 },
          showGraph: true,
          showFormula: true,
        }
      });
      continue;
    }
    
    // General mathematical expressions
    const mathPattern = /([a-z])\s*=\s*([0-9.a-z+\-*/^()]+)/i;
    if (mathPattern.test(text)) {
      const equationText = text.match(mathPattern)?.[0] || text;
      
      let variable = 'x';
      // Extract the variable from the equation
      const variableMatch = equationText.match(/([a-z])\s*=/i);
      if (variableMatch && variableMatch[1]) {
        variable = variableMatch[1].toLowerCase();
      }
      
      suggestions.push({
        type: 'equationExplorer',
        sourceElements: [element as SourceElement],
        description: 'Interactive Function Explorer',
        confidence: 0.7,
        blockParameters: {
          equation: equationText.trim(),
          variables: [variable],
          range: { [variable]: [-10, 10] },
          initialValues: { [variable]: 0 },
          showGraph: true,
          showFormula: true,
        }
      });
    }
  }
}

/**
 * Detect problem solver patterns in the document
 * @param doc Parsed HTML document
 * @param suggestions Array to add suggestions to
 */
function detectProblemSolverPatterns(doc: Document, suggestions: TransformationSuggestion[]): void {
  // Look for problems with step-by-step solutions
  
  // Find potential problem statements
  const potentialProblems = [
    ...Array.from(doc.querySelectorAll('h2 + p')),  // Heading followed by paragraph
    ...Array.from(doc.querySelectorAll('h3 + p')),  // Heading followed by paragraph
    ...Array.from(doc.querySelectorAll('h4 + p')),  // Heading followed by paragraph
    ...Array.from(doc.querySelectorAll('.problem')), // Elements with 'problem' class
    ...Array.from(doc.querySelectorAll('[data-type="problem"]')), // Elements with data-type="problem"
    ...Array.from(doc.querySelectorAll('p:has(strong)')), // Paragraphs with bold text
    ...Array.from(doc.querySelectorAll('div:has(p:first-child)')), // Divs with a paragraph as first child
  ];
  
  // Problem statement patterns
  const problemPatterns = [
    /solve\s+for\s+([a-z])\s*:\s*(.*?)/i,
    /find\s+the\s+value\s+of\s+([a-z])\s+/i,
    /calculate\s+the\s+([a-z])\s+/i,
    /determine\s+([a-z])\s+/i,
    /([a-z0-9.]+[a-z])\s*[+\-*/]\s*([0-9.]+)\s*=\s*([0-9.]+)/i,
  ];
  
  for (const element of potentialProblems) {
    const text = element.textContent || '';
    
    // Skip elements with too little text
    if (text.length < 10) continue;
    
    // Check if this is a mathematical problem
    let isProblem = false;
    let problemMatch: RegExpMatchArray | null = null;
    
    for (const pattern of problemPatterns) {
      problemMatch = text.match(pattern);
      if (problemMatch) {
        isProblem = true;
        break;
      }
    }
    
    // Skip if not a problem
    if (!isProblem) continue;
    
    // Look for solution steps in surrounding elements
    let steps: Array<{
      description: string;
      expression: string;
      explanation?: string;
    }> = [];
    
    // Try to find solution steps in subsequent elements or in a specified solution container
    const solutionContainer = element.closest('.problem-container')?.querySelector('.solution') || 
                              doc.querySelector(`#solution-${element.id}`) || 
                              findFollowingSteps(element);
    
    if (solutionContainer) {
      // Look for step elements within the solution container
      const stepElements = Array.from(solutionContainer.querySelectorAll('li, p, div.step'));
      
      // Extract steps from elements
      steps = stepElements.map((stepElement, index) => {
        const stepText = stepElement.textContent || '';
        
        // Try to identify parts of the step
        const expressionMatch = stepText.match(/([a-z0-9.=+\-*/^()]+)/i);
        const expression = expressionMatch ? expressionMatch[0] : `Step ${index + 1}`;
        
        return {
          description: `Step ${index + 1}`,
          expression: expression,
          explanation: stepText.replace(expression, '').trim(),
        };
      });
    } else {
      // If no structured solution found, create basic steps based on the problem
      if (problemMatch && problemMatch[0].includes('=')) {
        // For equation solving, create basic algebraic steps
        const equation = problemMatch[0];
        
        if (equation.match(/([0-9.]*[a-z])\s*[+\-]\s*([0-9.]+)\s*=\s*([0-9.]+)/i)) {
          // Linear equation like 2x + 3 = 7
          const variable = equation.match(/([a-z])/i)?.[1] || 'x';
          const coefficient = parseFloat(equation.match(/([0-9.]*)[a-z]/i)?.[1] || '1');
          const constant = parseFloat(equation.match(/[a-z]\s*[+\-]\s*([0-9.]+)/i)?.[1] || '0');
          const rightSide = parseFloat(equation.match(/=\s*([0-9.]+)/i)?.[1] || '0');
          
          const isolatedVariable = rightSide - constant;
          const solution = isolatedVariable / coefficient;
          
          steps = [
            {
              description: 'Isolate the variable term',
              expression: `${coefficient}${variable} = ${rightSide - constant}`,
              explanation: `Move constant to the right side by subtracting ${constant} from both sides.`
            },
            {
              description: 'Solve for the variable',
              expression: `${variable} = ${solution}`,
              explanation: `Divide both sides by the coefficient ${coefficient} to find the value of ${variable}.`
            }
          ];
        }
      }
    }
    
    // Only create a suggestion if we have a problem and at least one step
    if (steps.length > 0) {
      suggestions.push({
        type: 'problem-solver',
        sourceElements: [element as SourceElement],
        description: 'Interactive Problem Solver',
        confidence: 0.8,
        blockParameters: {
          problem: text.trim(),
          steps: steps,
          showHints: true,
          progressiveReveal: true,
          requireUserInput: false,
          feedbackLevel: 'detailed',
          solutionVisible: 'after-attempt',
        }
      });
    }
  }
}

/**
 * Find potential solution steps following a problem element
 * @param problemElement The element containing the problem
 * @returns Element containing the steps or null if not found
 */
function findFollowingSteps(problemElement: Element): Element | null {
  // Look for lists, divs, or sequences of paragraphs following the problem
  const orderedList = findNextSibling(problemElement, 'ol');
  if (orderedList) return orderedList;
  
  const unorderedList = findNextSibling(problemElement, 'ul');
  if (unorderedList) return unorderedList;
  
  const divContainer = findNextSibling(problemElement, 'div');
  if (divContainer && divContainer.children.length > 1) return divContainer;
  
  // If we can't find a structured container, just return null
  return null;
}

/**
 * Find the next sibling element matching the specified tag
 * @param element Element to start from
 * @param tagName Tag name to look for
 * @returns Matching element or null if not found
 */
function findNextSibling(element: Element, tagName: string): Element | null {
  let sibling = element.nextElementSibling;
  while (sibling) {
    if (sibling.tagName.toLowerCase() === tagName.toLowerCase()) {
      return sibling;
    }
    sibling = sibling.nextElementSibling;
  }
  return null;
}
