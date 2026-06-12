import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-ink text-paper pt-16 pb-8 border-t-2 border-ink">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center group mb-6">
                            <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden group-hover:-rotate-3 transition-transform bg-white rounded-full p-2">
                                <Image
                                    src="/images/logo-icon.png"
                                    alt="HealMitra"
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                            </div>
                        </Link>
                        <p className="text-sm opacity-60 max-w-[240px] font-medium leading-relaxed">
                            Authentic Ayurveda for the brave. Healing that doesn't hide. Rooted in wisdom, crafted for today.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-display text-lg text-acid uppercase tracking-wider">SHOP</h4>
                        <ul className="space-y-3 text-sm font-bold opacity-80">
                            <li><Link href="/shop" className="hover:text-acid transition-colors">NEW DROPS</Link></li>
                            <li><Link href="/shop?category=Hair Care" className="hover:text-acid transition-colors">HAIR CARE</Link></li>
                            <li><Link href="/shop?category=Skin Care" className="hover:text-acid transition-colors">SKIN CARE</Link></li>
                            <li><Link href="/shop" className="hover:text-acid transition-colors">BESTSELLERS</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-display text-lg text-acid uppercase tracking-wider">SUPPORT</h4>
                        <ul className="space-y-3 text-sm font-bold opacity-80">
                            <li><Link href="/shipping" className="hover:text-acid transition-colors">SHIPPING INFO</Link></li>
                            <li><Link href="/about" className="hover:text-acid transition-colors">OUR STORY</Link></li>
                            <li><Link href="/contact" className="hover:text-acid transition-colors">CONTACT US</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-display text-lg text-acid uppercase tracking-wider">SOCIALS</h4>
                        <div className="flex gap-4">
                            <a href="#" className="bg-paper text-ink p-3 rounded-xl hover:bg-acid transition-colors border-2 border-ink shadow-hard-sm"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="bg-paper text-ink p-3 rounded-xl hover:bg-acid transition-colors border-2 border-ink shadow-hard-sm"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="bg-paper text-ink p-3 rounded-xl hover:bg-acid transition-colors border-2 border-ink shadow-hard-sm"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-paper/20 text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <p>© 2026 HEALMITRA SCENTS. EST. 2026.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-acid">PRIVACY</Link>
                        <Link href="#" className="hover:text-acid">TERMS</Link>
                        <Link href="#" className="hover:text-acid">UDYAM-MH-13-0101419</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
