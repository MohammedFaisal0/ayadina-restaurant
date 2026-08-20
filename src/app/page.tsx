import { AnnouncementTeaser } from "@/components/home/AnnouncementTeaser";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickInfoStrip } from "@/components/home/QuickInfoStrip";

export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickInfoStrip />
      <FeaturedDishes />
      <AnnouncementTeaser />
    </>
  );
}
