'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import {
    Save,
    X,
    Plus,
    Trash2,
    Upload,
    Maximize2,
    Sparkles,
    Info,
    Layout
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface ProductFormProps {
    initialData?: any;
    mode?: 'create' | 'edit';
}

export default function ProductForm({ initialData, mode = 'create' }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [benefits, setBenefits] = useState(initialData?.benefits || ['']);
    const [ingredients, setIngredients] = useState(initialData?.ingredients || ['']);

    const addField = (setter: any, current: string[]) => setter([...current, '']);
    const removeField = (setter: any, current: string[], index: number) => {
        if (current.length > 1) setter(current.filter((_, i) => i !== index));
    };
    const updateField = (setter: any, current: string[], index: number, value: string) => {
        const next = [...current];
        next[index] = value;
        setter(next);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const sku = formData.get('sku') as string;
        const short_description = formData.get('short_description') as string;
        const price = parseFloat(formData.get('price') as string);
        const mrp = parseFloat(formData.get('mrp') as string);
        const stock_quantity = parseInt(formData.get('stock_quantity') as string);
        const is_active = (e.currentTarget as any).elements.is_active.checked;

        // Simple slug generation
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

        try {
            const productPayload = {
                name,
                slug,
                category,
                sku,
                short_description,
                price,
                mrp,
                stock_quantity,
                benefits: benefits.filter((b: string) => b.trim() !== ''),
                ingredients: ingredients.filter((i: string) => i.trim() !== ''),
                is_active,
                images: initialData?.images || ['/placeholder.png'], // Placeholder for now
            };

            let error;
            if (mode === 'edit' && initialData?.id) {
                const { error: editError } = await supabase
                    .from('products')
                    .update(productPayload)
                    .eq('id', initialData.id);
                error = editError;
            } else {
                const { error: createError } = await supabase
                    .from('products')
                    .insert([productPayload]);
                error = createError;
            }

            if (error) throw error;

            toast.success('MISSION DATA SECURED ✦');
        } catch (error: any) {
            console.error('DATABASE PERSISTENCE FAILURE:', error);
            toast.error(error.message || 'COMMUNICATION BREAKDOWN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-10 pb-20">
            {/* Left Column: Input Fields */}
            <div className="lg:col-span-8 space-y-8">

                {/* Section 1: Core Intel */}
                <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-acid/5 rounded-full blur-2xl -z-10" />
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-ink text-acid p-2.5 rounded-xl border-2 border-ink shadow-hard-sm">
                            <Info className="w-5 h-5" />
                        </div>
                        <h2 className="font-display text-xl uppercase italic">CORE INTEL</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Formula Designation (Name)</label>
                            <input type="text" name="name" defaultValue={initialData?.name} placeholder="e.g. AMRIT HAIR SYSTEM" className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none transition-all" required />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Sector (Category)</label>
                                <select name="category" defaultValue={initialData?.category || 'Hair Care'} className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm">
                                    <option>Hair Care</option>
                                    <option>Skin Care</option>
                                    <option>Bestsellers</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Unit Identifier (SKU)</label>
                                <input type="text" name="sku" defaultValue={initialData?.sku} placeholder="HM-XXXX-001" className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-4 font-mono font-bold outline-none shadow-hard-sm" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Briefing (Short Description)</label>
                            <textarea name="short_description" rows={2} defaultValue={initialData?.short_description} className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm resize-none"></textarea>
                        </div>
                    </div>
                </section>

                {/* Section 2: Financials & Stock */}
                <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-ink text-acid p-2.5 rounded-xl border-2 border-ink shadow-hard-sm">
                            <Layout className="w-5 h-5" />
                        </div>
                        <h2 className="font-display text-xl uppercase italic">RESOURCES & VALUE</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Active Price (₹)</label>
                            <input type="number" name="price" defaultValue={initialData?.price} className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Blueprint Price (MRP)</label>
                            <input type="number" name="mrp" defaultValue={initialData?.mrp} className="w-full bg-paper border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm opacity-60 italic" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Cargo Qty (Stock)</label>
                            <input type="number" name="stock_quantity" defaultValue={initialData?.stock_quantity} className="w-full bg-acid border-2 border-ink rounded-xl px-4 py-4 font-sans font-bold outline-none shadow-hard-sm" required />
                        </div>
                    </div>
                </section>

                {/* Section 3: Dynamic Data Lists */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Benefits */}
                    <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display text-lg uppercase italic">BENEFITS ✦</h2>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField(setBenefits, benefits)} className="p-2 min-w-0">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {benefits.map((b: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input value={b} onChange={(e) => updateField(setBenefits, benefits, i, e.target.value)} className="flex-1 bg-paper border-2 border-ink rounded-lg px-3 py-2 text-xs font-bold" />
                                    <button type="button" onClick={() => removeField(setBenefits, benefits, i)} className="text-red-400 hover:text-red-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Ingredients */}
                    <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display text-lg uppercase italic">ALCHEMY 🧪</h2>
                            <Button type="button" variant="outline" size="sm" onClick={() => addField(setIngredients, ingredients)} className="p-2 min-w-0">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {ingredients.map((ing: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input value={ing} onChange={(e) => updateField(setIngredients, ingredients, i, e.target.value)} className="flex-1 bg-paper border-2 border-ink rounded-lg px-3 py-2 text-xs font-bold" />
                                    <button type="button" onClick={() => removeField(setIngredients, ingredients, i)} className="text-red-400 hover:text-red-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Right Column: Imagery & Publishing */}
            <div className="lg:col-span-4 space-y-8">

                {/* Visual Assets */}
                <section className="bg-white border-2 border-ink rounded-[2.5rem] p-8 shadow-hard">
                    <h2 className="font-display text-xl uppercase italic mb-6">VISUAL ASSETS</h2>
                    <div className="aspect-square bg-paper border-2 border-ink border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 group cursor-pointer hover:bg-stone/10 transition-colors relative overflow-hidden">
                        {initialData?.images?.[0] ? (
                            <Image
                                src={initialData.images[0]}
                                alt="Preview"
                                width={300}
                                height={300}
                                className="object-contain p-4"
                                unoptimized
                            />
                        ) : (
                            <>
                                <Upload className="w-10 h-10 opacity-20 mb-4 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Drop Cargo to Upload</p>
                            </>
                        )}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-square bg-paper border-2 border-ink border-dashed rounded-lg flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                                <Plus className="w-4 h-4" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status & Save */}
                <section className="bg-ink text-paper border-2 border-ink rounded-[2.5rem] p-8 shadow-hard sticky top-32">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-paper/10 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-acid" />
                                <span className="text-xs font-bold uppercase italic">MISSION ACTIVE</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="is_active" id="is_active" defaultChecked={initialData ? initialData.is_active : true} className="sr-only peer" />
                                <div className="w-11 h-6 bg-paper/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-acid after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-acid/40"></div>
                            </label>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-paper/10">
                            <Button type="submit" disabled={loading} className="w-full py-6 text-xl uppercase italic shadow-hard-acid">
                                {loading ? 'UPLOADING...' : mode === 'create' ? 'EXECUTE PUB' : 'SAVE CHANGES'}
                            </Button>
                            <Button type="button" variant="outline" className="w-full border-paper/10 text-paper/40 hover:bg-red-900/40 hover:text-red-400">
                                ABORT MISSION
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
