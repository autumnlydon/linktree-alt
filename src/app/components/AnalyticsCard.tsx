import { Analytics } from '../data/mockData';

interface AnalyticsCardProps {
  analytics: Analytics;
}

export default function AnalyticsCard({ analytics }: AnalyticsCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-white">{analytics.totalViews.toLocaleString()}</p>
        <p className="text-white/70 text-sm">Total Views</p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-white">#{analytics.popularityRank}</p>
        <p className="text-white/70 text-sm">Popularity Rank</p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-white">{analytics.linkClicks.toLocaleString()}</p>
        <p className="text-white/70 text-sm">Total Clicks</p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-white">
          {((analytics.linkClicks / analytics.totalViews) * 100).toFixed(1)}%
        </p>
        <p className="text-white/70 text-sm">Click Rate</p>
      </div>
    </div>
  );
} 