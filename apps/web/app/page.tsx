import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { DeployPan } from "@/components/deploy-pan";
import { Education } from "@/components/education";
import { StackMarquee } from "@/components/stack-marquee";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Nav />
      <Hero />
      <Experience />
      <DeployPan />
      <Education />
      <StackMarquee />
      <Footer />
    </main>
  );
}
