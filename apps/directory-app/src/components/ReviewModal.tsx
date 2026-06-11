"use client";

import { useState } from "react";
import { FiStar, FiUpload, FiX } from "react-icons/fi";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  networkName: string;
  networkSlug: string;
  onSubmitted?: () => void;
}

const initialRatings = { ease_of_use: 0, payment_speed: 0, support_quality: 0 };

export default function ReviewModal({ open, onClose, networkName, networkSlug, onSubmitted }: ReviewModalProps) {
  const [overall, setOverall] = useState(0);
  const [ratings, setRatings] = useState(initialRatings);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleStar = (val: number) => setOverall(val);
  const handleSubRating = (field: keyof typeof ratings, val: number) => setRatings(r => ({ ...r, [field]: val }));

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!overall || !review || !name || !email) {
      setError("Please fill all required fields and provide a rating.");
      return;
    }
    setUploading(true);
    
    try {
      // Check if Supabase is available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      console.log('=== REVIEW SUBMISSION DEBUG ===');
      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key exists:', !!supabaseKey);
      console.log('Network Slug:', networkSlug);
      console.log('Review Data:', {
        overall_rating: overall,
        ease_of_use: ratings.ease_of_use,
        payment_speed: ratings.payment_speed,
        support_quality: ratings.support_quality,
        review_text: review,
        name,
        email
      });

      if (supabaseUrl && supabaseKey) {
        console.log('✅ Supabase credentials found, attempting to connect...');
        
        const { createClientComponentClient } = await import("@supabase/auth-helpers-nextjs");
        const supabase = createClientComponentClient();
        
        console.log('✅ Supabase client created successfully');
        
        // Test database connection
        console.log('🔍 Testing database connection...');
        const { data: testData, error: testError } = await supabase
          .from('reviews')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.error('❌ Database connection test failed:', testError);
          setError(`Database connection failed: ${testError.message}`);
          setUploading(false);
          return;
        }
        
        console.log('✅ Database connection successful');
        
        let screenshot_url = null;
        if (screenshot) {
          console.log('📸 Uploading screenshot...');
          const { data, error: uploadError } = await supabase.storage.from("general-images").upload(`payment-screenshots/${Date.now()}-${screenshot.name}`, screenshot);
          if (uploadError) {
            console.error('❌ Screenshot upload error:', uploadError);
            setError("Failed to upload screenshot.");
            setUploading(false);
            return;
          }
          screenshot_url = data?.path ? supabase.storage.from("general-images").getPublicUrl(data.path).data.publicUrl : null;
          console.log('✅ Screenshot uploaded:', screenshot_url);
        }
        
        const reviewData = {
          network_slug: networkSlug,
          network_name: networkName,
          user_name: name,
          rating: overall,
          overall_rating: overall,
          ease_of_use: ratings.ease_of_use,
          payment_speed: ratings.payment_speed,
          support_quality: ratings.support_quality,
          review_text: review,
          screenshot_url: screenshot_url
        };
        
        console.log('📝 Submitting review data to Supabase:', reviewData);
        
        const { data: insertData, error: insertError } = await supabase.from("reviews").insert([reviewData]);
        
        console.log('📊 Insert result:', { data: insertData, error: insertError });
        
        if (insertError) {
          console.error('❌ Review insert error:', insertError);
          setError(`Failed to submit review: ${insertError.message}`);
          setUploading(false);
          return;
        }
        
        console.log('✅ Review submitted successfully!');
        console.log('=== END DEBUG ===');
      } else {
        console.log('❌ Supabase credentials not found');
        console.log('Review data that would be submitted:', {
          network_slug: networkSlug,
          network_name: networkName,
          user_name: name,
          rating: overall,
          overall_rating: overall,
          ease_of_use: ratings.ease_of_use,
          payment_speed: ratings.payment_speed,
          support_quality: ratings.support_quality,
          review_text: review
        });
      }
      
      setSuccess(true);
      setOverall(0);
      setRatings(initialRatings);
      setReview("");
      setName("");
      setEmail("");
      setScreenshot(null);
      if (onSubmitted) onSubmitted();
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      setError(`Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <FiX className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-blue-700 mb-4">{networkName}</h2>
        {success ? (
          <div className="text-green-600 font-semibold text-center py-6">
            Thank you! Your review has been submitted for approval.
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-600 mb-2 text-sm">Your overall rating of this network <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <button type="button" key={i} onClick={() => handleStar(i)} className="focus:outline-none">
                  <FiStar className={`w-6 h-6 ${i <= overall ? 'text-blue-400 fill-current' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-2 text-sm">Rate different aspects <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-bold text-gray-400 mb-1">EASE OF USE</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button type="button" key={i} onClick={() => handleSubRating('ease_of_use', i)} className="focus:outline-none">
                      <div className={`w-4 h-4 rounded ${i <= ratings.ease_of_use ? 'bg-blue-200' : 'bg-blue-50'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 mb-1">PAYMENT SPEED</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button type="button" key={i} onClick={() => handleSubRating('payment_speed', i)} className="focus:outline-none">
                      <div className={`w-4 h-4 rounded ${i <= ratings.payment_speed ? 'bg-blue-200' : 'bg-blue-50'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 mb-1">SUPPORT QUALITY</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button type="button" key={i} onClick={() => handleSubRating('support_quality', i)} className="focus:outline-none">
                      <div className={`w-4 h-4 rounded ${i <= ratings.support_quality ? 'bg-blue-200' : 'bg-blue-50'}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-2 text-sm">Your review <span className="text-red-500">*</span></label>
            <textarea className="w-full min-h-[80px] bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" value={review} onChange={e => setReview(e.target.value)} required maxLength={1000} />
          </div>
          <div>
            <label className="block font-semibold text-gray-600 mb-2 text-sm">Upload your payment screenshot! <span className="text-gray-400 font-normal">(optional)</span></label>
            <label className="inline-flex items-center gap-2 px-3 py-2 border border-blue-200 rounded cursor-pointer bg-blue-50 hover:bg-blue-100 text-sm">
              <FiUpload className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-blue-600">UPLOAD IMAGE</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleScreenshot} />
            </label>
            {screenshot && <span className="ml-2 text-xs text-gray-500">{screenshot.name}</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-600 mb-2 text-sm">Name <span className="text-red-500">*</span></label>
              <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-2 text-sm">Email <span className="text-red-500">*</span></label>
              <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm" value={email} onChange={e => setEmail(e.target.value)} required type="email" />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm" disabled={uploading}>
            {uploading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
} 