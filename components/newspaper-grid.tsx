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
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const selectedCountry = searchParams.get("country") || "argentina"

  useEffect(() => {
    async function fetchNewspapers() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/scrape")
        if (!response.ok) {
          throw new Error("Error al cargar los periódicos")
        }
        const data = await response.json()
        setNewspapers(data)
      } catch (error) {
        console.error("Error fetching newspapers:", error)
        setError("No se pudieron cargar los periódicos. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    fetchNewspapers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-lg">Cargando portadas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  const currentNewspapers = newspapers[selectedCountry] || []

  if (currentNewspapers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-500">No hay portadas disponibles para este país.</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {currentNewspapers.map((newspaper) => (
        <NewspaperCover key={newspaper.id} title={newspaper.title} imageUrl={newspaper.imageUrl} />
      ))}
    </div>
  )
}

