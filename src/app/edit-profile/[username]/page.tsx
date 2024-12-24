import EditProfileForm from './EditProfileForm';
import { Suspense } from 'react';

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ username: string }> | { username: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfileForm username={resolvedParams.username} />
    </Suspense>
  );
} 