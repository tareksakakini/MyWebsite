import Link from 'next/link';

const tools = [
  {
    title: 'Number Bases',
    description:
      'Explore binary, octal, hexadecimal, and other bases. Adjust digits at each position and see how they map to decimal values. Includes an interactive quiz.',
    href: '/teaching/tools/number-bases',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function TeachingTools() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/teaching" className="hover:text-gray-900 transition-colors">Teaching</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Tools</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Teaching Tools</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Interactive web apps designed to help students explore and practice core computer science concepts.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-400 transition-all duration-200"
          >
            <div className="text-gray-500 group-hover:text-gray-900 mb-4 transition-colors">
              {tool.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
            <p className="text-gray-600 text-sm">{tool.description}</p>
            <span className="inline-block mt-4 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              Open tool →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
