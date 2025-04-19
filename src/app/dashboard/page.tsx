import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock project data - in a real app, this would come from a database
const mockProjects = [
  {
    id: '1',
    name: 'Algebra Lesson',
    updated: new Date(2025, 3, 15),
    blocks: 5,
    coverImage: '/img/algebra.png',
  },
  {
    id: '2',
    name: 'Quadratic Functions',
    updated: new Date(2025, 3, 12),
    blocks: 8,
    coverImage: '/img/quadratic.png',
  },
  {
    id: '3',
    name: 'Trigonometry Basics',
    updated: new Date(2025, 3, 10),
    blocks: 12,
    coverImage: '/img/trigonometry.png',
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-blue-600 font-bold text-xl">
                MathBlocks Editor
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <span className="font-medium text-sm">KB</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Link href="/dashboard/examples">
                <Button variant="outline" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
                  </svg>
                  View Examples
                </Button>
              </Link>
              
              <Link href="/dashboard/transform">
                <Button variant="outline">Import HTML</Button>
              </Link>

              <Link href="/dashboard/editor">
                <Button variant="outline">Create Lesson</Button>
              </Link>
              
              <Link href="/dashboard/projects/new">
                <Button>New Project</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
                <div className="h-36 bg-gray-100 flex items-center justify-center">
                  <div className="text-4xl">{project.name.charAt(0)}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {project.blocks} {project.blocks === 1 ? 'block' : 'blocks'}
                    </span>
                    <span>
                      Updated {project.updated.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Create New Project Card */}
          <Link href="/dashboard/projects/new">
            <div className="bg-white rounded-lg border border-gray-200 border-dashed h-full flex flex-col items-center justify-center p-6 transition-colors hover:bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Create New Project</h3>
              <p className="mt-1 text-sm text-gray-500 text-center">
                Start with a blank canvas or import existing content
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
