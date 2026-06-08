import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import Future from "@/components/landing/Future";
import Roadmap from "@/components/landing/Roadmap";
import CTA from "@/components/landing/CTA";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#F8F5F0] text-[#1A1A1A] pt-24">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Benefits />
      <Future />
      <Roadmap />
      <FAQ />
      <CTA />
      <Footer />

      <a
  href="https://wa.me/34694259636?text=Hola.%20He%20visto%20A%20Pedir%20de%20Mesa%20y%20me%20gustaría%20solicitar%20una%20demostración."
  target="_blank"
  rel="noopener noreferrer"
  className="
    md:hidden
    fixed
    bottom-5
    right-5
    z-50
    bg-[#C46A2D]
    text-white
    px-5
    py-4
    rounded-full
    shadow-xl
    font-semibold
    hover:scale-105
    transition
  "
>
  💬 Demo
</a>
    </main>
  );
}