import { getLandingData } from "@/lib/contentful";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { SpecializationsSection } from "@/components/sections/SpecializationsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { ReelsSection } from "@/components/sections/ReelsSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { AppointmentSection } from "@/components/sections/AppointmentSection";

export const revalidate = 3600;

export default async function Home() {
  const data = await getLandingData();

  return (
    <div className="min-h-screen bg-sand text-slate-900">
      <SiteHeader />
      <main>
        <HeroSection />
        <SpecializationsSection data={data.specializations} />
        <ServicesSection data={data.services} />
        <PricingSection data={data.pricing} />
        <TeamSection data={data.team} />
        <ReelsSection data={data.reels} />
        <BlogSection data={data.blog} />
        <TestimonialsSection data={data.testimonials} />
        <ResearchSection data={data.research} />
        <LocationsSection />
        <SponsorsSection data={data.sponsors} />
        <AppointmentSection />
      </main>
      <SiteFooter />
    </div>
  );
}
