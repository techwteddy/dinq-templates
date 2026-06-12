'use client';

import Image from 'next/image';

export function LeadershipSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-primary/2 to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-accent/8 to-secondary/8 rounded-full blur-3xl opacity-30 animate-float-x" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center animate-fade-in-up">
          {/* Left: Text content */}
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              Welcome & Greetings!
            </h2>

            <div className="relative pl-6 border-l-4 border-accent">
              <blockquote className="text-lg sm:text-xl leading-relaxed text-foreground/85 italic font-medium">
                It is with great pleasure that I welcome you to Lagos State University, the citadel of learning, the University of First Choice and the Nation's pride. Over the years, the institution has demonstrated excellence in its activities. We are irrevocably committed to sustaining this culture and indeed transmitting it from excellence to distinction. I once again welcome you to the "Preferred State University at the Centre of Excellence".
              </blockquote>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                Prof. Ibiyemi Olaitanji-Bello, mni, fnli, FSPSP, NPOM
              </p>
              <p className="text-lg text-secondary font-semibold">
                Vice Chancellor, Lagos State University
              </p>
            </div>
          </div>

          {/* Right: VC Image */}
          <div className="relative flex justify-center group">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-accent/30 bg-gradient-to-br from-accent/10 to-secondary/10 hover:border-accent transition-all duration-500 hover:shadow-3xl">
              <Image
                src="https://lasu.edu.ng/home/img/our_vc.png"
                alt="Prof. Ibiyemi Olaitanji-Bello, Vice Chancellor"
                fill
                className="object-cover w-full h-full"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse-glow" />
          </div>
        </div>

        {/* Faculty & Department Info */}
        <div className="mt-20 sm:mt-28 pt-20 sm:pt-28 border-t-2 border-accent/20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start animate-fade-in-up">
            {/* Left: Faculty Info */}
            <div className="space-y-6 order-2 lg:order-1">
              <h3 className="text-3xl font-bold text-primary">Faculty of Education</h3>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
                <p className="text-lg font-bold text-primary mb-4">Prof. Akindoju Olugbenga Gabriel</p>
                <p className="text-secondary font-semibold mb-4">Dean of Faculty</p>
                <p className="text-foreground/80 leading-relaxed">
                  Welcome to the Faculty of Education, the hub for training of 21st century would-be teachers. The Faculty provides the pedagogical knowledge and pedagogical content knowledge to make an effective teacher. There are presently five Departments: Educational Management, Human Kinetic Sports and Health Education, Language Arts and Social Science Education, Educational Foundation and Counseling Psychology and Science and Technology Education. It is the largest Faculty in the University and accommodates 22 programmes. All programmes of the Faculty are approved by the National Universities Commission.
                </p>
              </div>
            </div>

            {/* Right: Dean Image */}
            <div className="relative flex justify-center group order-1 lg:order-2">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-accent/30 bg-gradient-to-br from-accent/10 to-secondary/10 hover:border-accent transition-all duration-500 hover:shadow-3xl">
                <Image
                  src="https://lasu.edu.ng/home/profile_pics/349-1738882637.jpg"
                  alt="Prof. Akindoju Olugbenga Gabriel, Dean of Faculty"
                  fill
                  className="object-cover w-full h-full"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Department Section */}
        <div className="mt-20 sm:mt-28 pt-20 sm:pt-28 border-t-2 border-accent/20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start animate-fade-in-up">
            {/* Left: HOD Image */}
            <div className="relative flex justify-center group order-2 lg:order-1">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-accent/30 bg-gradient-to-br from-accent/10 to-secondary/10 hover:border-accent transition-all duration-500 hover:shadow-3xl">
                <Image
                  src="https://lasu.edu.ng/home/profile_pics/353-1738840757.jpeg"
                  alt="Assoc Prof Alabi Olaide Bukola, Head of Department"
                  fill
                  className="object-cover w-full h-full"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Right: Department Info */}
            <div className="space-y-6 order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-primary">Department of Science & Technology Education</h3>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg">
                <p className="text-lg font-bold text-primary mb-4">Assoc Prof Alabi Olaide Bukola</p>
                <p className="text-secondary font-semibold mb-4">Head of Department</p>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  The Department of Science and Technology Education resides in the Faculty of Education, Lagos State University, Ojo campus. The department has six units:
                </p>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                    <span className="text-accent font-bold">•</span>
                    <span>Biology Education</span>
                  </li>
                  <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                    <span className="text-accent font-bold">•</span>
                    <span>Chemistry Education</span>
                  </li>
                  <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                    <span className="text-accent font-bold">•</span>
                    <span>Computer Science Education</span>
                  </li>
                  <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                    <span className="text-accent font-bold">•</span>
                    <span>Educational Technology</span>
                  </li>
                  <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                    <span className="text-accent font-bold">•</span>
                    <span>Mathematics Education</span>
                  </li>
                  <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                    <span className="text-accent font-bold">•</span>
                    <span>Physics Education</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
