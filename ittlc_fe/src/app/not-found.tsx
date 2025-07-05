import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100">
      <div className="text-center">
        <h1 className="dark:invert text-6xl font-bold text-black mb-4">404</h1>
        <h2 className="dark:invert text-2xl font-semibold text-black mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
