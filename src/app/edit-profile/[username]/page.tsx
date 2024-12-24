import EditProfileForm from './EditProfileForm';

export default async function EditProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return <EditProfileForm username={params.username} />;
} 