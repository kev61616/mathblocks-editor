'use client';

import { useParams } from 'next/navigation';
import ProjectPageClient from '@/components/projects/ProjectPageClient';

/**
 * Project page component - client-side implementation
 * This avoids complex server/client component type issues with dynamic routes
 */
export default function ProjectPage() {
  // Get the project ID directly from the URL using useParams
  // Note: useParams() only works in client components (marked with 'use client')
  const params = useParams();
  const projectId = params?.id as string;

  // Pass the ID to our client component that handles all the fetching and rendering
  return <ProjectPageClient projectId={projectId} />;
}
