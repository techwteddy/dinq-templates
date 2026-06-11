"use client"
import { uploadDrawings } from "@/app/actions/gallery";
import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

export function BulkUploadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setStatus("loading");
    await uploadDrawings(formData);
    setStatus("success");
    formRef.current?.reset(); // Clear the file picker
    
    // Reset status after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-center transition-all">
      <Upload className={`mx-auto mb-4 ${status === 'success' ? 'text-green-500' : 'text-slate-400'}`} size={40} />
      
      <input 
        type="file" 
        name="drawings" // MUST match formData.getAll("drawings")
        multiple 
        accept="image/*" 
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-slate-800 file:text-blue-700 dark:file:text-blue-400 mb-4 cursor-pointer"
        required
      />

      <button 
        disabled={status === "loading"}
        type="submit" 
        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto ${
          status === "success" ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {status === "loading" && <Loader2 className="animate-spin" size={18} />}
        {status === "success" && <CheckCircle2 size={18} />}
        {status === "loading" ? "Uploading..." : status === "success" ? "Done!" : "Upload Drawings"}
      </button>
    </form>
  );
}