import { users } from '../../data/mockData';
import AnalyticsCard from '../../components/AnalyticsCard';
import AnalyticsChart from '../../components/AnalyticsChart';
import Link from 'next/link';

export default function AnalyticsPage({
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href={`/${user.username}`}
              className="text-white/70 hover:text-white text-sm mb-2 inline-block"
            >
              ← Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-white/70">@{user.username}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Last Updated</p>
            <p className="text-white">
              {new Date(user.analytics.lastUpdated).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <AnalyticsCard analytics={user.analytics} />
        <AnalyticsChart analytics={user.analytics} />

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Link Performance</h3>
          <div className="space-y-4">
            {user.links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{link.title}</p>
                  <p className="text-white/70 text-sm">{link.url}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{link.clicks?.toLocaleString() || 0}</p>
                  <p className="text-white/70 text-sm">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 