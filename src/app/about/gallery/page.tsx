import { Metadata } from "next";
import GalleryView from "./GalleryView";
import { getGalleryAlbums } from "@/actions/gallery/albumManagement";

export const metadata: Metadata = {
  title: "Photography Gallery - Captured Moments by Shawkat Hossain Maruf",
  description: "Explore Shawkat Hossain Maruf's photography gallery showcasing captured moments, travel experiences, and creative work organized in albums. View stunning photos from various locations and events.",
  keywords: [
    "Photography Gallery",
    "Shawkat Hossain Photos",
    "Travel Photography",
    "Photo Albums",
    "Creative Photography",
    "Captured Moments",
    "Photography Portfolio",
    "Image Gallery",
  ],
  alternates: {
    canonical: "https://shawkath646.pro/about/gallery",
  },
  openGraph: {
    title: "Photography Gallery - Captured Moments by Shawkat Hossain Maruf",
    description: "Explore my photography gallery showcasing captured moments, travel experiences, and creative work organized in albums.",
    url: "https://shawkath646.pro/about/gallery",
    siteName: "Shawkat Hossain Maruf Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://shawkath646.pro/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Photography Gallery by Shawkat Hossain Maruf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shawkath646",
    creator: "@shawkath646",
    title: "Photography Gallery - Captured Moments by Shawkat Hossain Maruf",
    description: "Explore my photography gallery showcasing captured moments and creative work.",
    images: ["https://shawkath646.pro/profile.jpg"],
  },
};

export default async function GalleryPage() {
  const albumList = await getGalleryAlbums();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-24 pb-16 px-3 sm:px-4 lg:px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-xl opacity-60 animate-float"></div>
        <div className="absolute top-1/4 -right-8 w-32 h-32 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl opacity-40 animate-float-reverse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-cyan-200 dark:bg-cyan-900/30 rounded-full blur-xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-200 dark:bg-pink-900/30 rounded-full blur-xl opacity-45 animate-float-reverse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-emerald-200 dark:bg-emerald-900/30 rounded-full blur-xl opacity-30 animate-float" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-22 h-22 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-xl opacity-40 animate-float-reverse" style={{ animationDelay: '2.8s' }}></div>

        {/* Morphing Blob */}
        <div className="absolute top-2/3 right-2/3 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-fuchsia-200/20 dark:from-indigo-900/20 dark:to-fuchsia-900/10 opacity-40 animate-morph"></div>

        {/* Gradient Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent"></div>
        <div className="absolute top-0 right-1/6 w-px h-2/3 bg-gradient-to-b from-transparent via-indigo-300/20 to-transparent"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-1/3 left-1/5 w-8 h-8 border border-cyan-300/30 dark:border-cyan-500/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-1/5 w-6 h-6 border border-blue-300/30 dark:border-blue-500/20 rotate-12 animate-pulse"></div>
        <div className="absolute top-2/3 left-1/6 w-10 h-10 border-2 border-purple-300/30 dark:border-purple-500/20 rotate-[30deg] animate-spin-slow" style={{ animationDuration: '30s' }}></div>
        <div className="absolute top-1/6 right-1/6 w-7 h-7 border border-emerald-300/30 dark:border-emerald-500/20 rotate-[15deg] animate-pulse" style={{ animationDuration: '5s' }}></div>

        {/* Concentric Circles */}
        <div className="absolute top-[60%] left-[8%]">
          <div className="w-16 h-16 rounded-full border border-purple-300/20 dark:border-purple-500/15 animate-pulse-fade"></div>
          <div className="absolute inset-3 rounded-full border border-purple-300/30 dark:border-purple-500/20 animate-pulse-fade" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute inset-6 rounded-full border border-purple-300/40 dark:border-purple-500/25 animate-pulse-fade" style={{ animationDelay: '1.4s' }}></div>
        </div>

        {/* Triangles */}
        <div className="absolute top-[15%] left-[35%] w-0 h-0 border-l-[10px] border-l-transparent border-b-[16px] border-b-pink-300/30 dark:border-b-pink-500/20 border-r-[10px] border-r-transparent animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
        <div className="absolute top-[70%] left-[60%] w-0 h-0 border-l-[14px] border-l-transparent border-b-[20px] border-b-blue-300/30 dark:border-b-blue-500/20 border-r-[14px] border-r-transparent rotate-[30deg] animate-float-reverse" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>

        {/* Circles */}
        <div className="absolute top-1/4 left-2/3 w-4 h-4 rounded-full border border-cyan-300/40 dark:border-cyan-500/25 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-4 h-4 rounded-full border border-indigo-300/40 dark:border-indigo-500/25 animate-ping" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 right-1/5 w-3 h-3 rounded-full bg-cyan-300/20 dark:bg-cyan-500/15 animate-pulse-fade" style={{ animationDuration: '7s' }}></div>

        {/* Hexagons */}
        <div className="absolute top-[45%] right-[20%] w-10 h-10 border border-blue-300/30 dark:border-blue-500/20 animate-float"
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', animationDuration: '18s', animationDelay: '3s' }}></div>
        
        {/* Star */}
        <div className="absolute top-[38%] left-[20%] w-8 h-8 bg-gradient-to-br from-yellow-300/20 to-orange-300/10 dark:from-yellow-500/15 dark:to-orange-500/10 animate-pulse-fade"
          style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDuration: '8s' }}></div>

        {/* Camera Icon Shapes (Photography themed) */}
        <div className="absolute top-[25%] right-[30%] w-10 h-8 border border-slate-300/30 dark:border-slate-500/20 rounded-md animate-float" style={{ animationDuration: '22s' }}>
          <div className="absolute top-1/2 left-1/2 w-5 h-5 border-2 border-slate-300/40 dark:border-slate-500/25 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <GalleryView albumList={albumList} />
      </div>
    </main>
  );
}
