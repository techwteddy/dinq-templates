import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { url: string; alt?: string; caption?: string } }) => (
      <figure className="my-8">
        <div className="relative w-full h-80 rounded-xl overflow-hidden">
          <Image src={value.url} alt={value.alt || ""} fill className="object-cover" />
        </div>
        {value.caption && (
          <figcaption className="text-center text-gray-400 text-sm mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-bold text-dark mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-bold text-dark mt-6 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-6">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-dark">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    underline: ({ children }: { children?: React.ReactNode }) => <span className="underline">{children}</span>,
    link: ({ children, value }: { children: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        {children}
      </a>
    ),
  },
};

async function getNewsItem(id: string) {
  try {
    return await client.fetch(`
      *[_type == "news" && (slug.current == $id || _id == $id)][0] {
        "id": coalesce(slug.current, _id),
        "image": image.asset->url,
        "title": title.en,
        "titleAr": title.ar,
        "titleDe": title.de,
        "excerpt": excerpt.en,
        "excerptAr": excerpt.ar,
        "excerptDe": excerpt.de,
        "content": content.en[]{
          ...,
          _type == "image" => {
            ...,
            "url": asset->url
          }
        },
        "contentAr": content.ar[]{
          ...,
          _type == "image" => {
            ...,
            "url": asset->url
          }
        },
        "contentDe": content.de[]{
          ...,
          _type == "image" => {
            ...,
            "url": asset->url
          }
        },
        "date": date,
        category,
      }
    `, { id });
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const item = await getNewsItem(id);

  if (!item) notFound();

  const getTitle = () => locale === "ar" ? item.titleAr : locale === "de" ? item.titleDe : item.title;
  const getContent = () => locale === "ar" ? item.contentAr : locale === "de" ? item.contentDe : item.content;
  const getExcerpt = () => locale === "ar" ? item.excerptAr : locale === "de" ? item.excerptDe : item.excerpt;

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="relative h-[50vh]">
        {item.image ? (
          <>
            <Image src={item.image} alt={getTitle()} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-primary/90" />
        )}
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
          <Link href={`/${locale}/news`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft size={16} />
            {locale === "ar" ? "العودة للأخبار" : locale === "de" ? "Zurück zu Nachrichten" : "Back to News"}
          </Link>
          {item.category && (
            <span className="text-white/70 text-sm mb-2">{item.category} • {item.date}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white max-w-3xl">{getTitle()}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        {getExcerpt() && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-primary pl-4">
            {getExcerpt()}
          </p>
        )}

        {getContent()?.length > 0 ? (
          <PortableText value={getContent()} components={portableTextComponents} />
        ) : (
          <p className="text-gray-400 text-center py-8">
            {locale === "ar" ? "المحتوى قيد الإعداد" : locale === "de" ? "Inhalt wird vorbereitet" : "Content coming soon"}
          </p>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition-colors">
            <ArrowLeft size={16} />
            {locale === "ar" ? "العودة لكل الأخبار" : locale === "de" ? "Alle Nachrichten" : "Back to all news"}
          </Link>
        </div>
      </section>

    </div>
  );
}