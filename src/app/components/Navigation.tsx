import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="p-8 md:p-10 lg:p-12 flex justify-end items-center gap-6 md:gap-8">
      <Link
        href="/?view=sign-in"
        className="px-10 md:px-12 lg:px-16 py-5 md:py-6 lg:py-8 text-white hover:text-white/90 transition-colors duration-200 text-2xl md:text-3xl lg:text-4xl font-semibold"
      >
        Log in
      </Link>
      <Link
        href="/?view=sign-up"
        className="px-10 md:px-12 lg:px-16 py-5 md:py-6 lg:py-8 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors duration-200 text-2xl md:text-3xl lg:text-4xl font-semibold"
      >
        Sign up
      </Link>
    </nav>
  );
} 