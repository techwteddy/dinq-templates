import Hero from "@/components/sections/hero";
import Packages from "@/components/sections/packages";
import About from "@/components/sections/about";
import Services from "@/components/sections/services";
import Projects from "@/components/sections/projects";
import Differentiators from "@/components/sections/differentiators";
import Reviews from "@/components/sections/reviews";
import Contact from "@/components/sections/contact";
import Divider from "@/components/ui/divider";

export default function Home() {
  return (
    <>
      {/* Background blobs for homepage */}
      <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#6b4a4f]"></div>
      <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#4a4560]"></div>
      <div className="bg-[#e3f2fd] absolute top-[35rem] -z-10 right-[-20rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#2d3d52]"></div>
      <div className="bg-[#f3e5f5] absolute top-[55rem] -z-10 left-[-25rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#3d2f47]"></div>
      <div className="bg-[#fce4ec] absolute top-[75rem] -z-10 right-[10rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#4a3540]"></div>
      <div className="bg-[#e8eaf6] absolute top-[95rem] -z-10 left-[-30rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#353d52]"></div>
      <div className="bg-[#e3f2fd] absolute top-[105rem] -z-10 right-[-20rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#2d3d52]"></div>
      <div className="bg-[#f3e5f5] absolute top-[115rem] -z-10 left-[-25rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#3d2f47]"></div>
      <div className="bg-[#fce4ec] absolute top-[125rem] -z-10 right-[10rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#4a3540]"></div>
      <div className="bg-[#e8eaf6] absolute top-[135rem] -z-10 left-[-30rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#353d52]"></div>
      <div className="bg-[#fbe2e3] absolute top-[145rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#6b4a4f]"></div>
      <div className="bg-[#dbd7fb] absolute top-[155rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#4a4560]"></div>

      <main id="main-content" className="flex flex-col items-center px-4 w-full">
      <Hero
        headline="Steady hands for serious products"
        subheadline="We design and build calm, reliable software end-to-end, from early ideas to production systems."
        primaryCTA={{
          label: "Start a project",
          href: "#contact",
        }}
        secondaryCTA={{
          label: "See selected work",
          href: "#work",
        }}
        microcopy="Selective engagements. Clear scope. Thoughtful execution."
      />
      <Divider />
      <Packages />
      <Divider />
      <About />
      <Services />
      <Divider />
      <Projects />
      <Divider />
      <Reviews />
      <Divider />
      <Contact />
    </main>
    </>
  );
}
