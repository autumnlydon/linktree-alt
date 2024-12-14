import { users } from '../data/mockData';

export function getTopProfiles(limit: number = 5) {
  return Object.values(users)
    .sort((a, b) => a.analytics.popularityRank - b.analytics.popularityRank)
    .slice(0, limit);
} 