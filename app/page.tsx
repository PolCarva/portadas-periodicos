"use client"

import { Suspense } from "react"
import { NewspaperGrid } from "@/components/newspaper-grid"
import { CountrySelector } from "@/components/country-selector"

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Portadas de Periódicos</h1>

        <div className="flex gap-4 mb-8">
          <Suspense fallback={<div>Cargando selector...</div>}>
            <CountrySelector />
          </Suspense>
        </div>

        <Suspense fallback={<div>Cargando portadas...</div>}>
          <NewspaperGrid />
        </Suspense>
      </div>
    </main>
  )
}

