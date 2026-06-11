import Image from "next/image";

export default function CafeStorySection() {
  return (
    <section className="max-w-7xl py-16">
      <div className="bg-white rounded-3xl shadow-sm  ">
        {/* Image */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden h-96">
          <Image
            src="https://ilctucufscggrvgbjwue.supabase.co/storage/v1/object/public/website-assets/about/cafe-story-2.png"
            alt="Brew-Bite Cafe Interior"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="mt-6 space-y-3 p-6">
          <h2 className="text-xl font-semibold">Cafe Story</h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Brew-Bite Cafe was born from a passion for exceptional coffee and
            genuine community moments. We carefully source the finest beans and
            bake our pastries fresh daily, creating a warm and inviting space
            where people can relax and connect. Every sip is crafted with care,
            offering comfort, quality, and a memorable experience.
          </p>
        </div>
      </div>
    </section>
  );
}
