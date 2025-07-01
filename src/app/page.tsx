import LandingComponent from "@/components/HomePage/LandingComponent";
import SkillsComponent from "@/components/HomePage/SkillsComponent";
import OrderNowComponent from "@/components/HomePage/OrderNowComponent";
import CompanyIntro from "@/components/HomePage/CompanyIntro";
import TasksBoard from "@/components/HomePage/TaskBoard";
import YoutubeGrid from "@/components/HomePage/YoutubeGrid";
import { fetchYouTubeVideos } from "@/actions/youtubeFunc";



export default async function Home() {

  const youtubeData = await fetchYouTubeVideos();

  return (
    <main>
      <LandingComponent />
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-100 dark:from-[#0a192f] dark:via-[#1e293b] dark:to-[#0f172a] transition-all duration-700 py-10 px-4 md:px-0">
        <SkillsComponent />
        <OrderNowComponent />
        <div className="flex flex-col lg:flex-row gap-8 items-stretch mt-20 container mx-auto">
          <CompanyIntro />
          <TasksBoard />
        </div>
        <YoutubeGrid channel={youtubeData.channel} videos={youtubeData.videos} />
      </div>
    </main>
  );
}