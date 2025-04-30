"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const COUNTRIES = [
  { id: "argentina", name: "Argentina" },
  { id: "brasil", name: "Brasil" },
  { id: "usa", name: "Estados Unidos" },
  { id: "uruguay", name: "Uruguay" },
  { id: "chile", name: "Chile" },
  { id: "colombia", name: "Colombia" },
  { id: "ecuador", name: "Ecuador" },
  { id: "paraguay", name: "Paraguay" },
  { id: "peru", name: "Peru" },
  
]

export function CountrySelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCountry = searchParams.get("country") || "argentina"

  const handleCountryChange = (value: string) => {
    router.push(`/?country=${value}`)
  }

  return (
    <div className="w-full max-w-xs">
      <Select value={currentCountry} onValueChange={handleCountryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un país" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

