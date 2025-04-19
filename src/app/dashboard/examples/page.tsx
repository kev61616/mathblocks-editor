/**
 * Example Blocks Page
 * 
 * This page demonstrates various interactive blocks that can be created with MathBlocks Editor.
 * It serves as a showcase of the different block types and their capabilities.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the EquationExplorer to avoid server/client rendering mismatch
// This is necessary because the component uses browser APIs like canvas
const EquationExplorer = dynamic(
  () => import('@/components/blocks/equation-explorer'),
  { ssr: false }
);

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-blue-600 font-bold text-xl">
                MathBlocks Editor
              </Link>
            </div>
            <div>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Interactive Block Examples</h1>
          <p className="mt-2 text-gray-600">
            Explore examples of interactive blocks that can be created with MathBlocks Editor.
            These demonstrations showcase the power and flexibility of the block system.
          </p>
        </div>

        {/* Example Blocks */}
        <div className="space-y-10">
          {/* Linear Equation Explorer */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Linear Equation Explorer</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <EquationExplorer
                id="linear-example"
                parameters={{
                  equation: 'y = mx + b',
                  variables: ['m', 'b'],
                  range: { m: [-5, 5], b: [-5, 5] },
                  initialValues: { m: 1, b: 0 },
                  showGraph: true,
                  showFormula: true,
                  showTable: true,
                  graphDomain: [-10, 10],
                  graphRange: [-10, 10],
                }}
                title="Explore Linear Equations"
                description="Adjust the slope (m) and y-intercept (b) to see how they affect the graph of a linear equation."
              />
            </div>
          </section>

          {/* Quadratic Equation Explorer */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quadratic Function Explorer</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <EquationExplorer
                id="quadratic-example"
                parameters={{
                  equation: 'y = ax² + bx + c',
                  variables: ['a', 'b', 'c'],
                  range: { a: [-3, 3], b: [-5, 5], c: [-5, 5] },
                  initialValues: { a: 1, b: 0, c: 0 },
                  showGraph: true,
                  showFormula: true,
                  graphDomain: [-5, 5],
                  graphRange: [-5, 15],
                }}
                title="Explore Quadratic Functions"
                description="Adjust the coefficients to see how they affect the shape and position of the parabola."
              />
            </div>
          </section>

          {/* Sine Function Explorer */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Trigonometric Function Explorer</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <EquationExplorer
                id="sine-example"
                parameters={{
                  equation: 'y = a * sin(bx + c)',
                  variables: ['a', 'b', 'c'],
                  range: { a: [0.1, 5], b: [0.1, 5], c: [0, 6.28] },
                  initialValues: { a: 1, b: 1, c: 0 },
                  showGraph: true,
                  showFormula: true,
                  graphDomain: [-10, 10],
                  graphRange: [-5, 5],
                }}
                title="Explore Sine Functions"
                description="Adjust the amplitude (a), frequency (b), and phase shift (c) to see how they affect the sine wave."
              />
            </div>
          </section>
        </div>

        {/* More Information */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">About Interactive Blocks</h2>
          <p className="text-blue-700">
            Interactive blocks can be created from your existing HTML math content using the MathBlocks Editor.
            These blocks can then be embedded in your notes, lessons, or assessments to enhance student engagement
            and understanding. Each block is fully configurable and can be customized to suit your specific needs.
          </p>
          <div className="mt-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
            >
              Start creating your own blocks
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
