import { users } from '../data/mockData';
import LinkCard from '../components/LinkCard';
import Link from 'next/link';

export default function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const user = users[params.username.toLowerCase()];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">
            Sorry, this user does not exist in our system.
          </p>
          <Link
            href="/"
            className="inline-block py-2 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="w-full max-w-3xl py-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 border-2 border-white/30" />
          <p className="text-white/70 text-lg mb-1">@{user.username}</p>
          <h1 className="text-3xl font-bold text-white mb-2">{user.displayName}</h1>
          <p className="text-white/90 mb-4">{user.bio}</p>
          <Link
            href={`/${user.username}/analytics`}
            className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm transition-all"
          >
            View Analytics →
          </Link>
        </div>

        <div className="space-y-3">
          {user.links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-white/90 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 