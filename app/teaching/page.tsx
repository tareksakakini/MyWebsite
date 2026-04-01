import Link from 'next/link';

export default function Teaching() {
  const upcomingCourses = [
    {
      title: "Introduction to Artificial Intelligence",
      code: "AI 300",
      description: "Fundamental concepts in artificial intelligence including search algorithms, knowledge representation, machine learning, and AI applications.",
      semester: "Spring 2026",
      students: "N/A",
      link: "#"
    },
    {
      title: "Introduction to Computer Information Science",
      code: "CISC 310",
      description: "Fundamental concepts in computer information science including programming basics, data structures, and computer systems.",
      semester: "Spring 2026",
      students: "N/A",
      link: "#"
    }
  ];

  const pastCourses = [
    {
      title: "Introduction to Computer Information Science",
      code: "CISC 310",
      description: "Fundamental concepts in computer information science including programming basics, data structures, and computer systems.",
      semester: "Fall 2025",
      students: "N/A"
    }
  ];


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Teaching</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Professor teaching fundamental computer science courses in addition to AI-related courses.
        </p>
      </div>


      {/* Upcoming Courses */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Upcoming Courses</h2>
        <div className="space-y-6">
          {upcomingCourses.map((course, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <a href={course.link} className="hover:text-gray-700 transition-colors">
                    {course.title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-2">Folsom Lake College • {course.code} • {course.semester}</p>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Courses */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Past Courses</h2>
        <div className="space-y-6">
          {pastCourses.map((course, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-2">Folsom Lake College • {course.code} • {course.semester}</p>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teaching Tools */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Teaching Tools</h2>
        <p className="text-gray-600 mb-6">
          Interactive web apps to help students explore and practice core concepts.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/teaching/tools/binary-numbers"
            className="group bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-gray-400 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-gray-700">Binary Numbers</h3>
            <p className="text-sm text-gray-600">Toggle bits to learn how binary maps to decimal values.</p>
            <span className="inline-block mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
              Open tool →
            </span>
          </Link>
        </div>
        <div className="mt-4">
          <Link href="/teaching/tools" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            View all tools →
          </Link>
        </div>
      </div>

    </div>
  );
}
