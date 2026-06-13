'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export type FileUploadProps = {
  value?: string
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in bytes
  label?: string
  disabled?: boolean
  preview?: boolean
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload Image',
  disabled = false,
  preview = true,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setError(null)

    // Call onChange with the file
    onChange(file)
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setError(null)
    onChange(null)

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {preview && previewUrl ? (
        <div className="relative inline-block">
          <div className="border-border relative h-32 w-32 overflow-hidden rounded-lg border-2">
            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {label}
        </Button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-muted-foreground text-xs">
        Max size: {maxSize / (1024 * 1024)}MB. Accepted: {accept}
      </p>
    </div>
  )
}
