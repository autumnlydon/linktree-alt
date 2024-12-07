export interface Link {
  id: string;
  title: string;
  url: string;
  clicks?: number;
}

export interface Analytics {
  totalViews: number;
  popularityRank: number;
  linkClicks: number;
  lastUpdated: string;
}

export interface User {
  username: string;
  displayName: string;
  bio: string;
  links: Link[];
  analytics: Analytics;
}

export const users: { [key: string]: User } = {
  john: {
    username: 'john',
    displayName: 'John Doe',
    bio: 'Full-stack developer & open source enthusiast',
    analytics: {
      totalViews: 1234,
      popularityRank: 15,
      linkClicks: 847,
      lastUpdated: '2024-01-12T15:30:00Z'
    },
    links: [
      {
        id: '1',
        title: 'Personal Blog',
        url: 'https://blog.johndoe.com',
        clicks: 423
      },
      {
        id: '2',
        title: 'GitHub Profile',
        url: 'https://github.com/johndoe',
        clicks: 289
      },
      {
        id: '3',
        title: 'LinkedIn',
        url: 'https://linkedin.com/in/johndoe',
        clicks: 135
      },
    ],
  },
  jane: {
    username: 'jane',
    displayName: 'Jane Smith',
    bio: 'UI/UX Designer & Creative Developer',
    analytics: {
      totalViews: 2541,
      popularityRank: 8,
      linkClicks: 1432,
      lastUpdated: '2024-01-12T15:30:00Z'
    },
    links: [
      {
        id: '1',
        title: 'Portfolio',
        url: 'https://janesmith.com',
        clicks: 856
      },
      {
        id: '2',
        title: 'Dribbble',
        url: 'https://dribbble.com/janesmith',
        clicks: 412
      },
      {
        id: '3',
        title: 'X',
        url: 'https://x.com/janesmith',
        clicks: 164
      },
    ],
  },
  autumn: {
    username: 'autumn',
    displayName: 'Autumn Lydon',
    bio: 'Full-time lovergirl, Part-time developer',
    analytics: {
      totalViews: 3876,
      popularityRank: 3,
      linkClicks: 2145,
      lastUpdated: '2024-01-12T15:30:00Z'
    },
    links: [
      {
        id: '1',
        title: 'Manifesto',
        url: 'https://manifesto.autumnlydon.com',
        clicks: 945
      },
      {
        id: '2',
        title: 'Diary',
        url: 'https://diary.autumnlydon.com',
        clicks: 723
      },
      {
        id: '3',
        title: 'X so I can make my bf famous',
        url: 'https://x.com/autumnlydon',
        clicks: 477
      },
    ],
  },
  bahij: {
    username: 'bahij',
    displayName: 'Bahij Nemeh',
    bio: 'Full-time workaholic, Part-time loverboy',
    analytics: {
      totalViews: 1543,
      popularityRank: 12,
      linkClicks: 892,
      lastUpdated: '2024-01-12T15:30:00Z'
    },
    links: [
      {
        id: '1',
        title: 'Manifesto',
        url: 'https://quark-vacation-3ef.notion.site/Tism-Manifesto-14dbd382bd66803fadb7dee4896244f9?pvs=4',
        clicks: 345
      },
      {
        id: '2',
        title: 'My owner',
        url: 'https://x.com/autumnlydon',
        clicks: 289
      },
      {
        id: '3',
        title: 'X so I can become famous',
        url: 'https://x.com/tismastic',
        clicks: 258
      },
    ],
  },
}; 