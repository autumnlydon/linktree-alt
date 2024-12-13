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
        url: 'https://janesmith.design',
      },
      {
        id: '2',
        title: 'Dribbble',
        url: 'https://dribbble.com/janesmith',
      },
      {
        id: '3',
        title: 'Twitter',
        url: 'https://twitter.com/janesmith',
      },
    ],
  },
}; 