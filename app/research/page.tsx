export default function Research() {
  const publications = [
    {
      title: "Context-Aware Automatic Text Simplification of Health Materials in Low-Resource Domains",
      authors: "Tarek Sakakini, et al.",
      venue: "Proceedings of the Association for Computational Linguistics (ACL)",
      year: "2020",
      link: "https://aclanthology.org/2020.louhi-1.13/",
      type: "Workshop Paper"
    },
    {
      title: "Equipping Educational Applications with Domain Knowledge",
      authors: "Tarek Sakakini, Hongyu Gong, Jong Yoon Lee, Robert Schloss, Jinjun Xiong, Suma Bhat",
      venue: "Proceedings of the Fourteenth Workshop on Innovative Use of NLP for Building Educational Applications",
      year: "2019",
      link: "https://aclanthology.org/W19-4448/",
      type: "Workshop Paper"
    },
    {
      title: "MORSE: Semantic-ally Drive-n MORpheme SEgment-er",
      authors: "Tarek Sakakini, Suma Bhat, Pramod Viswanath",
      venue: "Proceedings of the 55th Annual Meeting of the Association for Computational Linguistics (ACL)",
      year: "2017",
      link: "https://aclanthology.org/anthology-files/pdf/P/P17/P17-1051.pdf",
      type: "Conference Paper"
    },
    {
      title: "Fixing the Infix: Unsupervised Discovery of Root-and-Pattern Morphology",
      authors: "Tarek Sakakini, Suma Bhat, Pramod Viswanath",
      venue: "ArXiv",
      year: "2017",
      link: "https://arxiv.org/abs/1702.02211",
      type: "Archive Paper"
    }
  ];

  const reviewingService = [
    {
      year: "2026",
      venues: [
        { abbr: "NeurIPS", full: "Conference on Neural Information Processing Systems" },
        { abbr: "EMNLP", full: "Conference on Empirical Methods in Natural Language Processing" },
        { abbr: "COLM", full: "Conference on Language Modeling" },
        { abbr: "ACL", full: "Annual Meeting of the Association for Computational Linguistics" },
        { abbr: "ICLR", full: "International Conference on Learning Representations" },
        { abbr: "EACL", full: "European Chapter of the Association for Computational Linguistics" },
        { abbr: "ARR", full: "ACL Rolling Review (January 2026)" }
      ]
    },
    {
      year: "2025",
      venues: [
        { abbr: "COLM", full: "Conference on Language Modeling" },
        { abbr: "ICML", full: "International Conference on Machine Learning" }
      ]
    }
  ];

  const researchAreas = [
    { name: "Large Language Models and Agentic AI", type: "current" },
    { name: "Morphological Analysis", type: "past" },
    { name: "Domain-specific Language Models", type: "past" },
    { name: "Machine Translation for Biomedical Text", type: "past" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Research</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
        PhD in Natural Language Processing with a contemporary obsession in Large Language Models.
        </p>
      </div>

      {/* Research Areas */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Research Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researchAreas.map((area, index) => (
            <div key={index} className="relative">
              <div className={`w-full px-6 py-4 rounded-xl text-sm font-medium h-20 flex items-center ${
                area.type === 'current' 
                  ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between gap-3 w-full">
                  <span className="flex-1 truncate">{area.name}</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-lg flex-shrink-0 ${
                    area.type === 'current' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {area.type === 'current' ? 'Current' : 'Past'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Publications</h2>
        <div className="space-y-6">
          {publications.map((pub, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <a href={pub.link} className="hover:text-gray-700 transition-colors">
                      {pub.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-2">{pub.authors}</p>
                  <p className="text-gray-500 text-sm mb-2">{pub.venue}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{pub.year}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {pub.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Service */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Community Service</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviewer</h3>
          <div className="space-y-3">
            {reviewingService.map((group) => (
              <div key={group.year} className="flex items-start">
                <span className="text-sm font-medium text-gray-500 w-14 shrink-0 mt-1">{group.year}</span>
                <div className="flex flex-wrap gap-2">
                  {group.venues.map((venue) => (
                    <span
                      key={venue.abbr}
                      title={venue.full}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full cursor-default"
                    >
                      {venue.abbr}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Profiles */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Academic Profiles</h2>
        <div className="flex justify-start">
          <a
            href="https://scholar.google.com/citations?user=yigqnMoAAAAJ&hl=en&oi=ao"
            className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 0-.315.06-.44.18l-5.128 5.128-2.128-2.128c-.125-.12-.271-.18-.44-.18-.169 0-.315.06-.44.18-.12.125-.18.271-.18.44 0 .169.06.315.18.44l2.568 2.568c.125.12.271.18.44.18.169 0 .315-.06.44-.18l5.568-5.568c.12-.125.18-.271.18-.44 0-.169-.06-.315-.18-.44-.125-.12-.271-.18-.44-.18z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Google Scholar</h3>
              <p className="text-sm text-gray-600">View citations and publications</p>
            </div>
          </a>
          
        </div>
      </div>

    </div>
  );
}
