# Personal Website

A minimalist, elegant personal website built with Next.js 14, TypeScript, and Tailwind CSS. This website showcases your work as a Computer Science researcher, professor, and entrepreneur.

## Features

- **Responsive Design**: Mobile-first approach with clean, minimalist aesthetic
- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, and Tailwind CSS
- **Performance Optimized**: Static site generation for fast loading times
- **SEO Ready**: Proper meta tags and semantic HTML structure
- **Accessible**: Built with accessibility best practices

## Sections

- **Home**: Introduction and overview of your three main pillars
- **Research**: Publications, research areas, and academic credentials
- **Teaching**: Current and past courses, teaching philosophy
- **Apps**: Portfolio of mobile applications and entrepreneurial work

## Getting Started

### Prerequisites

- Node.js 18.20.8 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd MyWebsite
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Personal Information

Update the following files with your personal information:

1. **Header Component** (`components/Header.tsx`):
   - Replace "Your Name" with your actual name

2. **Footer Component** (`components/Footer.tsx`):
   - Update email address
   - Add your university information
   - Update social media links

3. **Home Page** (`app/page.tsx`):
   - Update the hero section with your name and bio
   - Modify the quick stats section

4. **Research Page** (`app/research/page.tsx`):
   - Add your actual publications
   - Update research areas and interests
   - Add links to Google Scholar, ORCID, etc.

5. **Teaching Page** (`app/teaching/page.tsx`):
   - List your actual courses
   - Update institution information
   - Add office hours and contact details

6. **Apps Page** (`app/apps/page.tsx`):
   - Showcase your actual mobile apps
   - Update app descriptions and links
   - Add real download statistics

### Styling

The website uses Tailwind CSS for styling. You can customize:

- Colors in `tailwind.config.ts`
- Fonts in `app/layout.tsx`
- Global styles in `app/globals.css`

### Adding a Profile Photo

1. Add your profile photo to the `public/` directory
2. Update the avatar section in `app/page.tsx` to use your image:

```tsx
<Image
  src="/your-photo.jpg"
  alt="Your Name"
  width={128}
  height={128}
  className="rounded-full"
/>
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `out` folder to Netlify

### Other Platforms

The website can be deployed to any platform that supports static sites or Node.js applications.

## Project Structure

```
MyWebsite/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── research/          # Research section
│   ├── teaching/          # Teaching section
│   ├── apps/              # Apps portfolio
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Footer with contact info
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
└── package.json           # Dependencies
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Inter Font**: Clean, professional typography

## Contributing

This is a personal website template. Feel free to fork and customize it for your own use.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help customizing the website, please open an issue in the repository.

---

Built with ❤️ using Next.js and Tailwind CSS