"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface NewspaperCoverProps {
  title: string
  imageUrl: string
  previewImageUrl?: string
  isPreview?: boolean
}

export function NewspaperCover({ title, imageUrl, previewImageUrl, isPreview }: NewspaperCoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105">
          <div className="relative w-full aspect-[3/4]">
            {previewImageUrl && isLoading && (
              <Image
                src={previewImageUrl}
                alt={`${title} (preview)`}
                className="transition-opacity duration-300"
                fill
                style={{ objectFit: "cover" }}
              />
            )}
            <Image
              src={imageUrl}
              alt={title}
              className={`transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              fill
              style={{ objectFit: "cover" }}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError(true)
                setIsLoading(false)
              }}
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold line-clamp-2">{title}</h2>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl min-w-[35vw] w-fit h-[80vh]">
        <div className="relative w-full h-[calc(70vh-3rem)]">
          <Image 
            src={imageUrl || "/placeholder.svg"} 
            alt={title} 
            fill 
            className="object-contain" 
            sizes="(max-width: 1536px) 100vw"
            priority
          />
        </div>
        <h2 className="text-xl font-semibold mt-2">{title}</h2>
      </DialogContent>
    </Dialog>
  )
}

