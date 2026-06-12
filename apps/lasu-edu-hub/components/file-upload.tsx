'use client';

import { useState, useRef } from 'react';
import { uploadResourceFile } from '@/lib/storage';

interface FileUploadProps {
  courseId: string;
  onUploadSuccess: (url: string, fileName: string, fileSize: number) => void;
  onUploadError: (error: string) => void;
}

export function FileUpload({ courseId, onUploadSuccess, onUploadError }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      console.log('[v0] Starting file upload:', file.name);
      setProgress(30);

      const result = await uploadResourceFile(file, courseId);

      if (result) {
        setProgress(100);
        console.log('[v0] Upload successful');
        onUploadSuccess(result.url, result.fileName, result.fileSize);
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('[v0] Upload error:', error);
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      await handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-slate-700 hover:border-primary/50 hover:bg-muted/50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="space-y-3">
          <div className="text-3xl">📁</div>
          <div>
            <p className="font-semibold text-foreground">
              {isDragging ? 'Drop file here' : 'Drag and drop your file here'}
            </p>
            <p className="text-sm text-foreground/60">or click to browse</p>
            <p className="text-xs text-foreground/50 mt-2">
              Supports any file type (PDF, images, videos, documents, etc.)
            </p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          accept="*/*"
        />

        {/* Clickable Area */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 cursor-pointer"
          aria-label="Upload file"
        />
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-foreground/60 text-center">Uploading... {progress}%</p>
        </div>
      )}

      {/* Alternative: Traditional File Input */}
      <div className="relative">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-foreground/60
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-accent file:text-accent-foreground
            hover:file:bg-primary hover:file:text-primary-foreground
            disabled:opacity-50 disabled:cursor-not-allowed"
          accept="*/*"
        />
      </div>
    </div>
  );
}
