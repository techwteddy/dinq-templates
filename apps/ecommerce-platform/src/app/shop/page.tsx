'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/types/database';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Marquee from '@/components/layout/Marquee';
import ProductCard from '@/components/product/ProductCard';
import { Search, ChevronDown, SlidersHorizontal, Check, X } from 'lucide-react';

interface FilterProps {
    category: string;
    setCategory: (c: string) => void;
    categories: string[];
    scentProfiles: string[];
    toggleScentProfile: (p: string) => void;
    profiles: string[];
    priceRange: number;
    setPriceRange: (p: number) => void;
    brands: string[];
    searchBrands: string;
    setSearchBrands: (s: string) => void;
}

const FilterControls = ({
    category, setCategory, categories,
    scentProfiles, toggleScentProfile, profiles,
    priceRange, setPriceRange,
    brands, searchBrands, setSearchBrands
}: FilterProps) => (
    <div className="space-y-8">
        {/* Active Filters */}
        {(category !== 'All' || scentProfiles.length > 0) && (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Active Filters</h3>
                    <button
                        onClick={() => { setCategory('All'); scentProfiles.forEach(p => toggleScentProfile(p)); }}
                        className="text-[10px] font-bold underline decoration-dotted hover:text-red-600"
                    >Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {category !== 'All' && (
                        <button
                            onClick={() => setCategory('All')}
                            className="flex items-center gap-1 rounded border-2 border-ink bg-acid px-2 py-1 text-[10px] font-bold uppercase hover:bg-red-400 hover:line-through"
                        >
                            {category} <X className="h-3 w-3" />
                        </button>
                    )}
                    {scentProfiles.map(p => (
                        <button
                            key={p}
                            onClick={() => toggleScentProfile(p)}
                            className="flex items-center gap-1 rounded border-2 border-ink bg-white px-2 py-1 text-[10px] font-bold uppercase hover:bg-red-400 hover:line-through"
                        >
                            {p} <X className="h-3 w-3" />
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Category Filter */}
        <div className="border-t-2 border-ink pt-6">
            <h3 className="mb-4 text-sm font-display uppercase tracking-widest italic">Category</h3>
            <div className="space-y-3">
                {categories.slice(1).map(cat => (
                    <label key={cat} className="group flex cursor-pointer items-center gap-3">
                        <div className="relative flex h-5 w-5 items-center justify-center border-2 border-ink bg-white transition-all group-hover:shadow-hard-sm">
                            <input
                                type="checkbox"
                                checked={category === cat}
                                onChange={() => setCategory(category === cat ? 'All' : cat)}
                                className="peer absolute inset-0 opacity-0"
                            />
                            <Check className="h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <span className={`text-sm font-bold ${category === cat ? 'text-ink' : 'opacity-60'}`}>{cat.toUpperCase()}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Scent Profile */}
        <div className="border-t-2 border-ink pt-6">
            <h3 className="mb-4 text-sm font-display uppercase tracking-widest italic">Target Benefit</h3>
            <div className="space-y-3">
                {profiles.map(profile => (
                    <label key={profile} className="group flex cursor-pointer items-center gap-3">
                        <div className="relative flex h-5 w-5 items-center justify-center border-2 border-ink bg-white transition-all group-hover:shadow-hard-sm">
                            <input
                                type="checkbox"
                                checked={scentProfiles.includes(profile)}
                                onChange={() => toggleScentProfile(profile)}
                                className="peer absolute inset-0 opacity-0"
                            />
                            <Check className="h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <span className={`text-sm font-bold ${scentProfiles.includes(profile) ? 'text-ink' : 'opacity-60'}`}>{profile.toUpperCase()}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Price Range */}
        <div className="border-t-2 border-ink pt-6">
            <h3 className="mb-4 text-sm font-display uppercase tracking-widest italic">Max Price</h3>
            <div className="px-2">
                <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-acid cursor-pointer h-2 bg-paper border-2 border-ink rounded-full"
                />
                <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <div className="rounded border-2 border-ink bg-white px-2 py-1 shadow-hard-sm">₹0</div>
                    <div className="h-[2px] w-4 bg-ink"></div>
                    <div className="rounded border-2 border-ink bg-white px-2 py-1 shadow-hard-sm">₹{priceRange}</div>
                </div>
            </div>
        </div>

        {/* Brands Search */}
        <div className="border-t-2 border-ink pt-6">
            <h3 className="mb-4 text-sm font-display uppercase tracking-widest italic">Brand Library</h3>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search labs..."
                    value={searchBrands}
                    onChange={(e) => setSearchBrands(e.target.value)}
                    className="w-full rounded-lg border-2 border-ink bg-white py-3 pl-3 pr-10 text-[10px] font-bold uppercase shadow-hard-sm outline-none focus:bg-acid placeholder:opacity-40"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 opacity-40" />
            </div>
            <div className="max-h-40 space-y-2 overflow-y-auto pr-2 no-scrollbar">
                {brands.filter(b => b.toLowerCase().includes(searchBrands.toLowerCase())).map(brand => (
                    <label key={brand} className="group flex cursor-pointer items-center gap-3">
                        <div className="relative flex h-4 w-4 items-center justify-center border-2 border-ink bg-white">
                            <input type="checkbox" className="peer absolute inset-0 opacity-0" />
                            <Check className="h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100" />
                        </div>
                        <span className="text-[10px] font-bold opacity-60 group-hover:opacity-100 uppercase">{brand}</span>
                    </label>
                ))}
            </div>
        </div>
    </div>
);

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('Recommended');
    const [priceRange, setPriceRange] = useState<number>(1000);
    const [scentProfiles, setScentProfiles] = useState<string[]>([]);
    const [searchBrands, setSearchBrands] = useState('');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const categories = ['All', 'Hair Care', 'Skin Care', 'Bundles', 'Samples'];
    const profiles = ['Woody', 'Fresh / Citrus', 'Spicy / Oriental', 'Gourmand (Sweet)', 'Floral'];
    const brands = ['HealMitra Original', 'Vedic Roots', 'Natures Code', 'Botanical Bliss'];

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                let query = supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true);

                if (category !== 'All') {
                    query = query.eq('category', category);
                }

                if (sortBy === 'Price: Low to High') {
                    query = query.order('price', { ascending: true });
                } else if (sortBy === 'Price: High to Low') {
                    query = query.order('price', { ascending: false });
                } else if (sortBy === 'Newest Arrivals') {
                    query = query.order('created_at', { ascending: false });
                }

                const { data, error } = await query;
                if (error) throw error;
                setProducts(data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [category, sortBy]);

    const toggleScentProfile = (profile: string) => {
        setScentProfiles(prev =>
            prev.includes(profile) ? prev.filter(p => p !== profile) : [...prev, profile]
        );
    };

    return (
        <>
            <Marquee />
            <Navbar />
            <main className="min-h-screen bg-paper pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                    {/* Page Header */}
                    <header className="mb-8 flex flex-col justify-between gap-4 border-b-2 border-ink pb-8 md:flex-row md:items-end">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase opacity-40">
                                <Link href="/" className="hover:text-ink">Home</Link>
                                <span>/</span>
                                <span className="text-ink opacity-100 italic">Catalog</span>
                            </div>
                            <h1 className="font-display text-4xl md:text-6xl tracking-tighter text-ink uppercase leading-none italic">
                                ALL <span className="text-outline" style={{ WebkitTextStroke: '2px #0A2A1F' }}>PRODUCTS</span>
                            </h1>
                            <p className="mt-2 max-w-xl text-sm font-bold opacity-60">
                                Explore our library of authentic Ayurvedic formulations. Handcrafted small batches, high-contrast healing.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg border-2 border-ink bg-white px-4 py-3 text-xs font-bold uppercase shadow-hard-sm transition-transform hover:-translate-y-0.5 md:hidden"
                            >
                                <SlidersHorizontal className="h-4 w-4" /> Filters
                            </button>

                            <div className="relative group flex-1 md:flex-none">
                                <button className="flex w-full md:w-[220px] items-center justify-between rounded-lg border-2 border-ink bg-white px-4 py-3 text-xs font-bold uppercase transition-colors hover:bg-paper shadow-hard-sm">
                                    <span>SORT: {sortBy.toUpperCase()}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <div className="absolute right-0 top-full z-10 hidden w-full pt-2 group-hover:block">
                                    <div className="rounded-lg border-2 border-ink bg-white p-1 shadow-hard">
                                        {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Newest Arrivals'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => setSortBy(option)}
                                                className="block w-full text-left rounded px-3 py-2 text-[10px] font-bold uppercase hover:bg-acid"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Mobile Filter Drawer */}
                        <div
                            className={`md:hidden fixed inset-0 z-[100] transition-all duration-300 ${isMobileFiltersOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`}
                        >
                            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                            <div
                                className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-paper border-l-2 border-ink p-6 flex flex-col gap-8 transition-transform duration-300 transform ${isMobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="font-display text-2xl uppercase italic">FILTERS</h2>
                                    <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 border-2 border-ink rounded-lg bg-acid shadow-hard-sm">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                                    <FilterControls
                                        category={category} setCategory={setCategory} categories={categories}
                                        profiles={profiles} scentProfiles={scentProfiles} toggleScentProfile={toggleScentProfile}
                                        priceRange={priceRange} setPriceRange={setPriceRange}
                                        brands={brands} searchBrands={searchBrands} setSearchBrands={setSearchBrands}
                                    />
                                </div>

                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full bg-ink text-acid py-5 rounded-xl font-display text-lg shadow-hard-sm border-2 border-ink uppercase tracking-widest"
                                >
                                    SHOW {products.length} GEAR
                                </button>
                            </div>
                        </div>

                        {/* Desktop Sidebar Filters */}
                        <aside className="hidden w-64 flex-shrink-0 space-y-8 md:block">
                            <FilterControls
                                category={category} setCategory={setCategory} categories={categories}
                                profiles={profiles} scentProfiles={scentProfiles} toggleScentProfile={toggleScentProfile}
                                priceRange={priceRange} setPriceRange={setPriceRange}
                                brands={brands} searchBrands={searchBrands} setSearchBrands={setSearchBrands}
                            />
                        </aside>

                        {/* Product Grid Area */}
                        <div className="flex-1">

                            {/* Results Bar */}
                            <div className="mb-6 flex items-center justify-between rounded-xl bg-ink/5 p-4 border-2 border-ink/10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink">{products.length} RESULTS SECURED</span>
                                <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 italic">Ready for dispatch</span>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} className="bg-white border-2 border-ink rounded-2xl h-[450px] animate-pulse shadow-hard" />
                                    ))}
                                </div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 border-2 border-dashed border-ink/20 rounded-[2rem] bg-white">
                                    <div className="text-8xl mb-6">🌿</div>
                                    <h2 className="font-display text-3xl text-ink mb-4 italic uppercase">NOTHING FOUND</h2>
                                    <p className="font-bold opacity-40">Try another category or search term.</p>
                                </div>
                            )}

                            {/* Pagination / Load More */}
                            <div className="mt-16 flex flex-col items-center justify-center gap-6 border-t-2 border-dashed border-ink/10 pt-12">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Page status: nominal</span>
                                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-stone/30 border border-ink/10">
                                    <div
                                        className="h-full bg-ink"
                                        style={{ width: `${Math.min((products.length / 142) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <button className="bg-white border-2 border-ink px-10 py-5 rounded-xl font-display text-sm tracking-widest shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase italic">
                                    LOAD MORE GEAR
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
