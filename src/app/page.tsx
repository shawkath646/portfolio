import { Metadata } from 'next';
import LandingComponent from "@/components/HomePage/LandingComponent";
import SkillsComponent from "@/components/HomePage/SkillsComponent";
import OrderNowComponent from "@/components/HomePage/OrderNowComponent";
import CompanyIntro from "@/components/HomePage/CompanyIntro";
import TasksBoard from "@/components/HomePage/TaskBoard";
import YoutubeGrid from "@/components/HomePage/YoutubeGrid";
import GallerySnapshot from "@/components/HomePage/GallerySnapshot";
import ShareFilesSection from "@/components/HomePage/ShareFilesSection";
import Pagination from "@/components/navigation/Pagination";
import fetchYouTubeVideos from "@/actions/googleServices/fetchYoutubeVideos";
import { fetchGallerySnapshot } from "@/actions/gallery/fetchGallerySnapshot";

const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://shawkath646.pro";

export const metadata: Metadata = {
  title: "Shawkat Hossain Maruf - Full-Stack Developer & Software Engineer",
  description: "Full-stack developer and Computer Science student at Sejong University specializing in React, Next.js, TypeScript, and Android development. Building modern web applications and mobile solutions with cutting-edge technologies.",
  keywords: [
    "Shawkat Hossain Maruf",
    "shawkath646",
    "Full Stack Developer",
    "Software Engineer",
    "Web Developer Portfolio",
    "React Developer",
    "Next.js Developer",
    "Android Developer",
    "Computer Science Student",
    "Sejong University",
    "Web Development",
    "Software Development",
    "Portfolio Website",
    "Tech Projects",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Shawkat Hossain Maruf - Full-Stack Developer & Software Engineer",
    description: "Explore the portfolio of a full-stack developer specializing in React, Next.js, and Android development. Building modern web and mobile solutions.",
    url: baseUrl,
    siteName: "Shawkat Hossain Maruf Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${baseUrl}/profile.jpg`,
        width: 1200,
        height: 630,
        alt: "Shawkat Hossain Maruf - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shawkath646",
    creator: "@shawkath646",
    title: "Shawkat Hossain Maruf - Full Stack Developer & Software Engineer",
    description: "Explore innovative web applications, Android apps, and data analysis projects.",
    images: [`${baseUrl}/profile.jpg`],
  },
};


export default async function Home() {
  // Fetch YouTube data and gallery images with error handling
  const youtubeData = await fetchYouTubeVideos();
  const galleryImages = await fetchGallerySnapshot(15);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      role="main"
      className="min-h-screen overflow-hidden"
      aria-label="Homepage content"
    >
      <LandingComponent />

      {/* Main Content Area */}
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] transition-all duration-700 py-10 px-4 md:px-0 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Orbs */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-xl opacity-60 animate-float"></div>
          <div className="absolute top-1/4 -right-8 w-32 h-32 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl opacity-40 animate-float-reverse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-cyan-200 dark:bg-cyan-900/30 rounded-full blur-xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-200 dark:bg-pink-900/30 rounded-full blur-xl opacity-45 animate-float-reverse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-emerald-200 dark:bg-emerald-900/30 rounded-full blur-xl opacity-30 animate-float" style={{ animationDelay: '3.5s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-22 h-22 bg-amber-200 dark:bg-amber-900/30 rounded-full blur-xl opacity-40 animate-float-reverse" style={{ animationDelay: '2.8s' }}></div>

          {/* Morphing Blob */}
          <div className="absolute top-2/3 right-2/3 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-fuchsia-200/20 dark:from-indigo-900/20 dark:to-fuchsia-900/10 opacity-40 animate-morph"></div>

          {/* Gradient Lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"></div>
          <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent"></div>
          <div className="absolute top-0 right-1/6 w-px h-2/3 bg-gradient-to-b from-transparent via-pink-300/20 to-transparent"></div>

          {/* Grid Pattern */}
          <div className="absolute top-[35%] left-[12%] w-24 h-24 grid grid-cols-3 gap-0.5 opacity-30 rotate-[15deg] animate-pulse-fade">
            {[...Array(9)].map((_, i) => (
              <div key={`grid-${i}`} className="w-full h-full border border-blue-300/30 dark:border-blue-500/30"></div>
            ))}
          </div>

          {/* Geometric Shapes */}
          {/* Squares & Diamonds */}
          <div className="absolute top-1/3 left-1/5 w-8 h-8 border border-cyan-300/30 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-1/3 right-1/5 w-6 h-6 border border-blue-300/30 rotate-12 animate-pulse"></div>
          <div className="absolute top-2/3 left-1/6 w-10 h-10 border-2 border-purple-300/30 rotate-[30deg] animate-spin-slow" style={{ animationDuration: '30s' }}></div>
          <div className="absolute top-1/6 right-1/6 w-7 h-7 border border-emerald-300/30 rotate-[15deg] animate-pulse" style={{ animationDuration: '5s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-6 h-6 border border-amber-300/30 rotate-[60deg] animate-spin-slow" style={{ animationDuration: '25s', animationDelay: '5s' }}></div>

          {/* Concentric Circles */}
          <div className="absolute top-[60%] left-[8%]">
            <div className="w-16 h-16 rounded-full border border-purple-300/20 animate-pulse-fade"></div>
            <div className="absolute inset-3 rounded-full border border-purple-300/30 animate-pulse-fade" style={{ animationDelay: '0.7s' }}></div>
            <div className="absolute inset-6 rounded-full border border-purple-300/40 animate-pulse-fade" style={{ animationDelay: '1.4s' }}></div>
          </div>

          {/* Triangles */}
          <div className="absolute top-[15%] left-[35%] w-0 h-0 border-l-[10px] border-l-transparent border-b-[16px] border-b-pink-300/30 border-r-[10px] border-r-transparent animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
          <div className="absolute top-[70%] left-[60%] w-0 h-0 border-l-[14px] border-l-transparent border-b-[20px] border-b-blue-300/30 border-r-[14px] border-r-transparent rotate-[30deg] animate-float-reverse" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-[20%] right-[25%] w-0 h-0 border-l-[8px] border-l-transparent border-b-[12px] border-b-emerald-300/30 border-r-[8px] border-r-transparent rotate-[15deg] animate-bounce-gentle" style={{ animationDuration: '12s' }}></div>

          {/* Circles */}
          <div className="absolute top-1/4 left-2/3 w-4 h-4 rounded-full border border-cyan-300/40 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className="absolute top-3/4 left-1/3 w-4 h-4 rounded-full border border-purple-300/40 animate-ping" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 right-1/5 w-3 h-3 rounded-full bg-cyan-300/20 animate-pulse-fade" style={{ animationDuration: '7s' }}></div>

          {/* Hexagons (created with clip-path) */}
          <div className="absolute top-[45%] right-[20%] w-10 h-10 border border-blue-300/30 animate-float"
            style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', animationDuration: '18s', animationDelay: '3s' }}></div>
          <div className="absolute bottom-[30%] right-[35%] w-8 h-8 bg-blue-300/10 animate-bounce-gentle"
            style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', animationDuration: '10s', animationDelay: '1s' }}></div>

          {/* Octagons */}
          <div className="absolute top-[15%] right-[15%] w-12 h-12 border border-amber-300/20 animate-spin-slow"
            style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', animationDuration: '35s' }}></div>

          {/* Star (created with clip-path) */}
          <div className="absolute top-[38%] left-[20%] w-8 h-8 bg-gradient-to-br from-yellow-300/20 to-orange-300/10 animate-pulse-fade"
            style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDuration: '8s' }}></div>

          {/* Plus Sign */}
          <div className="absolute top-[22%] right-[55%]">
            <div className="w-8 h-1.5 bg-emerald-300/30 relative">
              <div className="absolute w-1.5 h-8 bg-emerald-300/30 left-[41%] top-[-12px]"></div>
            </div>
          </div>

          {/* Curved Line */}
          <svg className="absolute top-[85%] left-[40%] w-32 h-16 opacity-30" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,25 Q50,0 100,25" stroke="rgba(147, 197, 253, 0.5)" fill="transparent" strokeWidth="1" className="animate-pulse-fade" />
          </svg>

          {/* Dotted pattern */}
          <div className="absolute bottom-[15%] right-[10%] grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={`dot-${i}`} className="w-1 h-1 rounded-full bg-blue-300/40"></div>
            ))}
          </div>

          {/* Dashed Circle */}
          <svg className="absolute top-[20%] left-[55%] w-16 h-16 opacity-40 animate-spin-slow" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '40s' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(147, 197, 253, 0.4)" strokeWidth="2" strokeDasharray="10 5" />
          </svg>
        </div>

        <div className="relative z-10">
          <SkillsComponent />
          <OrderNowComponent />

          {/* Company Info and Tasks Section */}
          <section
            aria-labelledby="company-info-title"
            className="mb-20 py-8 md:py-12"
            role="region"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <h2
                id="company-info-title"
                className="sr-only"
              >
                Company Information and Current Projects
              </h2>

              <div
                className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16 min-h-[50vh]"
                data-testid="company-tasks-container"
              >
                <div className="w-full lg:w-3/5 xl:w-[60%]">
                  <CompanyIntro />
                </div>
                <div className="w-full lg:w-2/5 xl:w-[40%] lg:mt-12">
                  <TasksBoard />
                </div>
              </div>
            </div>
          </section>

          {youtubeData.channel && (
            <YoutubeGrid
              channel={youtubeData.channel}
              videos={youtubeData.videos}
            />
          )}

          {galleryImages.length > 0 && (
            <GallerySnapshot images={galleryImages} />
          )}

          <ShareFilesSection />

          <Pagination
            nextPage="/about"
            nextPageLabel="About Me"
          />
        </div>
      </div>
    </main>
  );
}