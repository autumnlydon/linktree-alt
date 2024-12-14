import { Analytics } from '../data/mockData';

interface AnalyticsCardProps {
  analytics: Analytics;
}

function TrendIndicator({ value }: { value: number }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <span className={`text-sm ml-2 ${
      isPositive ? 'text-green-300' : 
      isNeutral ? 'text-white/60' : 
      'text-red-300'
    }`}>
      {isPositive ? '↑' : isNeutral ? '−' : '↓'} 
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function RankChange({ value }: { value: number }) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <span className={`text-sm ml-2 ${
      isPositive ? 'text-green-300' : 
      isNeutral ? 'text-white/60' : 
      'text-red-300'
    }`}>
      {isPositive ? '↑' : isNeutral ? '−' : '↓'} 
      {Math.abs(value)} spots
    </span>
  );
}

export default function AnalyticsCard({ analytics }: AnalyticsCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-white">
          {analytics.totalViews.toLocaleString()}
          <TrendIndicator value={analytics.trends.viewsChange} />
        </p>
        <p className="text-white/70 text-sm">Total Views</p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-white">
          #{analytics.popularityRank}
          <RankChange value={analytics.trends.rankChange} />
        </p>
        <p className="text-white/70 text-sm">Popularity Rank</p>
      </div>
      
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
        <p className="text-2xl font-bold text-white">
          {analytics.linkClicks.toLocaleString()}
          <TrendIndicator value={analytics.trends.clicksChange} />
        </p>
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