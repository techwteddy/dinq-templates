const grubhub  = process.env.NEXT_PUBLIC_GRUBHUB_URL;
const doordash = process.env.NEXT_PUBLIC_DOORDASH_URL;
const ubereats = process.env.NEXT_PUBLIC_UBEREATS_URL;

const MenuCategories = () => {
  const platforms = [
    { url: grubhub,  src: '/Grubhub.webp',  alt: 'Order on Grubhub',   width: 120, height: 42, className: 'h-10' },
    { url: doordash, src: '/Doordash.webp', alt: 'Order on DoorDash',  width: 140, height: 50, className: 'h-10' },
    { url: ubereats, src: '/ubereats.png',  alt: 'Order on Uber Eats', width: 120, height: 42, className: 'h-7'  },
  ].filter(p => p.url);

  if (platforms.length === 0) return null;

  return (
    <div className="w-full bg-orange-50">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-your-orange mb-6 mt-5">
            Available on your favorite delivery platforms:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {platforms.map((p) => (
              
                key={p.src}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-transform duration-300 hover:scale-110 block"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  className={`object-contain w-auto ${p.className}`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCategories;
