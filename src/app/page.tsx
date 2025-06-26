import LandingComponent from "@/components/HomePage/LandingComponent";
import OrderNowComponent from "@/components/HomePage/OrderNowComponent";
import SkillsComponent from "@/components/HomePage/SkillsComponent";


export default async function Home() {
  return (
    <main>
      <LandingComponent />
      <SkillsComponent />
      <OrderNowComponent />
    </main>
  );
}