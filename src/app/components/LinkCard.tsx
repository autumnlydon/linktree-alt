import { Link } from '../data/mockData';

interface LinkCardProps {
  link: Link;
}

export default function LinkCard({ link }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 mb-3 text-center text-gray-800 transition-all bg-white rounded-lg shadow hover:shadow-md hover:scale-[1.01]"
    >
      {link.title}
    </a>
  );
} 