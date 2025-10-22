export default function Apps() {
  const apps = [
    {
      title: "Yalla",
      description: "Social planning app that helps friends and groups organize outings, events, and activities. Features group coordination, and event planning.",
      category: "Social",
      status: "Live",
      downloads: "1K+",
      rating: "4.5",
      techStack: ["Swift", "Firebase", "OneSignal"],
      features: ["Group Planning", "Event Coordination", "Social Networking", "Real-time Updates"],
      links: {
        appStore: "https://apps.apple.com/us/app/yalla-plan-your-next-outing/id6742435514",
        googlePlay: "#",
        website: "https://github.com/tareksakakini/CliqueApp"
      },
      image: "/YallaLogo.png"
    },
    {
      title: "HangoutAgent",
      description: "iOS app where the AI agent helps you plan your next hangout.",
      category: "Social",
      category2: "Agentic AI",
      status: "In Beta",
      downloads: "Beta",
      rating: "N/A",
      techStack: ["Swift", "Firebase", "OneSignal", "OpenAI"],
      features: ["Group Planning", "Event Coordination", "Outing Ideation", "Real-Time Messaging"],
      links: {
        appStore: "#",
        googlePlay: "#",
        website: "https://github.com/tareksakakini/HangoutAgent"
      },
      image: "/HangoutAgentLogo.png"
    },
    {
      title: "SipLocal",
      description: "An iOS app that brings all coffee shops together into one platform. You can find nearby coffee shops, make online orders, and augment your coffee shop experience with in-app interactions.",
      category: "Local Discovery",
      category2: "Two-sided Marketplace",
      status: "Pre Launch",
      downloads: "Beta",
      rating: "N/A",
      techStack: ["Swift", "Firebase", "Square", "Clover", "Stripe", "OneSignal"],
      features: ["Local Discovery", "Mobile Orders", "Coffee Passport", "Streamlined Onboarding"],
      links: {
        appStore: "#",
        googlePlay: "#",
        website: "https://github.com/tareksakakini/SipLocal"
      },
      image: "/SipLocalLogo.png"
    }
  ];


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Mobile Apps</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Building innovative mobile applications that solve real-world problems.
        </p>
      </div>

      {/* Apps Portfolio */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">App Portfolio</h2>
        <div className="space-y-12">
          {apps.map((app, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {/* App Image */}
                <div className="md:w-1/3">
                  <div className="h-64 md:h-full bg-gray-100 flex items-center justify-center">
                    <img
                      src={app.image}
                      alt={`${app.title} logo`}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>

                {/* App Details */}
                <div className="md:w-2/3 p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{app.title}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {app.category}
                      </span>
                      {app.category2 && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                          {app.category2}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-sm rounded ${
                        app.status === 'Live' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{app.description}</p>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {app.techStack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {app.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  {index === 0 && (
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={app.links.appStore}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        App Store
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
