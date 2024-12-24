import EditProfileForm from './EditProfileForm';
import Navigation from '@/components/Navigation';
import { Suspense } from 'react';

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ username: string }> | { username: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <EditProfileForm username={resolvedParams.username} />
      </Suspense>
    </div>
  );
} 