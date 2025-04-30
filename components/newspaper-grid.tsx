"use client"

import { useEffect, useState } from "react"
import { NewspaperCover } from "./newspaper-cover"
import { useSearchParams } from "next/navigation"

interface Newspaper {
  id: string
  title: string
  imageUrl: string
  country: string
}

export function NewspaperGrid() {
  const [newspapers, setNewspapers] = useState<Record<string, Newspaper[]>>({})
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const selectedCountry = searchParams.get("country") || "argentina"

  useEffect(() => {
    async function fetchNewspapers() {
      try {
        const response = await fetch("/api/scrape")
        const data = await response.json()
        setNewspapers(data)
      } catch (error) {
        console.error("Error fetching newspapers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewspapers()
  }, [])

  if (loading) {
    return <div>Cargando portadas...</div>
  }

  const currentNewspapers = newspapers[selectedCountry] || []

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {currentNewspapers.map((newspaper) => (
        <NewspaperCover key={newspaper.id} title={newspaper.title} imageUrl={newspaper.imageUrl} />
      ))}
    </div>
  )
}

