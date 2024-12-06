export interface Link {
  id: string;
  title: string;
  url: string;
}

export interface User {
  username: string;
  displayName: string;
  bio: string;
  links: Link[];
}

export const users: { [key: string]: User } = {
  john: {
    username: 'john',
    displayName: 'John Doe',
    bio: 'Full-stack developer & open source enthusiast',
    links: [
      {
        id: '1',
        title: 'Personal Blog',
        url: 'https://blog.johndoe.com',
      },
      {
        id: '2',
        title: 'GitHub Profile',
        url: 'https://github.com/johndoe',
      },
      {
        id: '3',
        title: 'LinkedIn',
        url: 'https://linkedin.com/in/johndoe',
      },
    ],
  },
  jane: {
    username: 'jane',
    displayName: 'Jane Smith',
    bio: 'UI/UX Designer & Creative Developer',
    links: [
      {
        id: '1',
        title: 'Portfolio',
        url: 'https://janesmith.com',
      },
      {
        id: '2',
        title: 'Dribbble',
        url: 'https://dribbble.com/janesmith',
      },
      {
        id: '3',
        title: 'X',
        url: 'https://x.com/janesmith',
      },
    ],
  },
  autumn: {
    username: 'autumn',
    displayName: 'Autumn Lydon',
    bio: 'Full-time lovergirl, Part-time developer',
    links: [
      {
        id: '1',
        title: 'Manifesto',
        url: 'https://manifesto.autumnlydon.com',
      },
      {
        id: '2',
        title: 'Diary',
        url: 'https://diary.autumnlydon.com',
      },
      {
        id: '3',
        title: 'X so I can make my bf famous',
        url: 'https://x.com/autumnlydon',
      },
    ],
  },bahij: {
    username: 'bahij',
    displayName: 'Bahij Nemeh',
    bio: 'Full-time workaholic, Part-time loverboy',
    links: [
      {
        id: '1',
        title: 'Manifesto',
        url: 'https://quark-vacation-3ef.notion.site/Tism-Manifesto-14dbd382bd66803fadb7dee4896244f9?pvs=4',
      },
      {
        id: '2',
        title: 'My owner',
        url: 'https://x.com/autumnlydon',
      },
      {
        id: '3',
        title: 'X so I can become famous',
        url: 'https://x.com/tismastic',
      },
    ],
  },
}; 