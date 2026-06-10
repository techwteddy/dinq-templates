// src/components/WatercolorImage.tsx
import ZoomableImage from './ZoomableImage';

export default function WatercolorImage({
    src,
    alt,
    caption,
    priority = false,
    schema
}: {
    src: string;
    alt: string;
    caption?: string;
    priority?: boolean;
    schema?: Record<string, unknown>;
}) {
    return (
        <>
            {/* Inject ImageObject Schema for GEO bots */}
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ 
                        __html: JSON.stringify({
                            "license": "https://famoussheamus.com/about",
                            "acquireLicensePage": "https://famoussheamus.com/contact",
                            "copyrightNotice": "© 2026 Famous Sheamus Consulting",
                            "creditText": "Famous Sheamus Consulting",
                            ...schema 
                        }) 
                    }}
                />
            )}

            <figure className="my-10 border-l-4 border-teal-500 pl-6">
                <div className="overflow-hidden rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 bg-white rotate-[0.5deg] transition-transform duration-500 hover:rotate-0 hover:scale-[1.01]">
                    <ZoomableImage
                        src={src}
                        alt={alt}
                        width={1200}
                        height={675}
                        priority={priority}
                        className="w-full h-auto object-contain"
                    />
                </div>
                {caption && (
                    <figcaption className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                        {caption}
                    </figcaption>
                )}
            </figure>
        </>
    );
}