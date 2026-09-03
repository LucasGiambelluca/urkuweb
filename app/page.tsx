import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import HeroStats from "@/components/home/HeroStats";
import Story from "@/components/home/Story";
import Timeline from "@/components/home/Timeline";
import StreamingPreview from "@/components/home/StreamingPreview";
import VisitSection from "@/components/home/VisitSection";
import ServicesHubSection from "@/components/home/ServicesHubSection";
import ImpactGrid from "@/components/home/ImpactGrid";
import CommerceSection from "@/components/home/CommerceSection";
import SponsorShowcase from "@/components/home/SponsorShowcase";
import AdvertisingSection from "@/components/home/AdvertisingSection";
import NewsFeed from "@/components/home/NewsFeed";
import ContactSection from "@/components/home/ContactSection";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <HeroStats />
        <Story />
        <Timeline />
        <StreamingPreview />
        <VisitSection />
        <ServicesHubSection />
        <ImpactGrid />
        <CommerceSection />
        <SponsorShowcase />
        <NewsFeed />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}