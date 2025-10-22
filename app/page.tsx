import Link from "next/link";

export default function Home() {
  const pillars = [
    {
      title: "Research",
      description: "PhD in Natural Language Processing with a contemporary obsession in Large Language Models.",
      href: "/research",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Teaching",
      description: "Professor teaching fundamental computer science courses in addition to AI-related courses.",
      href: "/teaching",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Entrepreneurship",
      description: "Building innovative mobile applications that solve real-world problems.",
      href: "/apps",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto mb-6 relative overflow-hidden rounded-full">
            <img
              src="/profile_picture.jpeg"
              alt="Tarek Sakakini"
              width={192}
              height={192}
              className="w-48 h-48 object-cover object-center scale-125"
            />
          </div>
          <div className="flex items-baseline justify-center mb-4">
            <img 
              src="/personal_logo.png" 
              alt="Tarek Sakakini Logo" 
              className="w-16 h-16 object-contain mr-0 self-center -mt-4"
            />
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 font-serif">
              arek Sakakini
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Computer Science Researcher, Professor & Entrepreneur
          </p>
          <p className="text-lg text-gray-500 mt-4 max-w-3xl mx-auto">
            PhD in Natural Language Processing with expertise in machine learning, 
            passionate educator, and mobile app developer building innovative solutions.
          </p>
        </div>
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pillars.map((pillar, index) => (
          <Link
            key={index}
            href={pillar.href}
            className="group bg-white rounded-lg border-4 border-gray-800 p-8 hover:shadow-lg hover:border-gray-900 transition-all duration-300"
          >
            <div className="text-gray-600 group-hover:text-gray-900 mb-4">
              {pillar.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {pillar.title}
            </h3>
            <p className="text-gray-600 group-hover:text-gray-700">
              {pillar.description}
            </p>
            <div className="mt-4 text-sm text-gray-500 group-hover:text-gray-700">
              Learn more →
            </div>
          </Link>
        ))}
      </div>


      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Let's Connect
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Interested in collaboration, research opportunities, or learning more about my work? 
          I'd love to hear from you.
        </p>
        <div className="flex justify-center">
          <a
            href="mailto:tarek.sakakini@gmail.com"
            className="inline-flex items-center px-6 py-3 border border-gray-800 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}