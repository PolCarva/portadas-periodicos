import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

interface ScrapeConfig {
  url: string;
  selector: string;
  multiple?: boolean;
  followLinks?: {
    linkSelector: string;
    imageSelector: string;
  };
}

const URLS: Record<string, ScrapeConfig[]> = {
  argentina: [
    {
      url: "https://es.kiosko.net/ar/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  paraguay: [
    {
      url: "https://es.kiosko.net/py/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    },
    {
      url: "https://www.popular.com.py/",
      selector: ".portada img",
      multiple: false
    }
  ],
  brasil: [
    {
      url: "https://es.kiosko.net/br/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  usa: [
    {
      url: "https://es.kiosko.net/us/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  uruguay: [
    {
      url: "https://es.kiosko.net/uy/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  chile: [
    {
      url: "https://es.kiosko.net/cl/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  colombia: [
    {
      url: "https://es.kiosko.net/co/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  ecuador: [
    {
      url: "https://es.kiosko.net/ec/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  peru: [
    {
      url: "https://es.kiosko.net/pe/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  venezuela: [
    {
      url: "https://es.kiosko.net/ve/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  bolivia: [
    {
      url: "https://es.kiosko.net/bo/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  mexico: [
    {
      url: "https://es.kiosko.net/mx/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  panama: [
    {
      url: "https://es.kiosko.net/pa/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
  dominicanRepublic: [
    {
      url: "https://es.kiosko.net/do/",
      selector: ".thcover",
      multiple: true,
      followLinks: {
        linkSelector: "a",
        imageSelector: "#portada"
      }
    }
  ],
}

export async function GET() {
  try {
    const results: Record<string, any[]> = {}

    for (const [country, configs] of Object.entries(URLS)) {
      const covers: any[] = []

      for (const config of configs) {
        try {
          const response = await fetch(config.url)
          const html = await response.text()
          const $ = cheerio.load(html)

          if (config.multiple) {
            const elements = config.followLinks 
              ? $(config.selector)
              : $(config.selector + " img");

            for (const element of elements.toArray()) {
              if (config.followLinks) {
                const $element = $(element);
                const link = $element.attr("href");
                const baseUrl = new URL(config.url);
                const fullUrl = new URL(link || "", baseUrl.origin);
                
                // Obtener la imagen de la página individual
                const detailResponse = await fetch(fullUrl.toString());
                const detailHtml = await detailResponse.text();
                const $detail = cheerio.load(detailHtml);
                
                const img = $detail(config.followLinks.imageSelector);
                const src = img.attr("src");
                const alt = $element.find("img").attr("alt");

                if (src) {
                  covers.push({
                    id: `${country}-${covers.length}`,
                    title: alt || "Unknown Newspaper",
                    imageUrl: src.startsWith("//") ? `https:${src}` : src,
                    country,
                    source: new URL(config.url).hostname,
                    originalLink: fullUrl.toString()
                  });
                }
              } else {
                const img = $(element);
                const src = img.attr("src");
                const alt = img.attr("alt");

                if (src) {
                  covers.push({
                    id: `${country}-${covers.length}`,
                    title: alt || "Unknown Newspaper",
                    imageUrl: src.startsWith("//") ? `https:${src}` : src,
                    country,
                    source: new URL(config.url).hostname
                  });
                }
              }
            }
          } else {
            const img = $(config.selector);
            const src = img.attr("src");
            const alt = img.attr("alt");

            if (src) {
              covers.push({
                id: `${country}-${covers.length}`,
                title: alt || "Unknown Newspaper",
                imageUrl: src.startsWith("//") ? `https:${src}` : src,
                country,
                source: new URL(config.url).hostname
              });
            }
          }
        } catch (error) {
          console.error(`Error scraping ${config.url}:`, error);
          continue;
        }
      }

      results[country] = covers;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: "Failed to scrape newspapers" }, { status: 500 });
  }
}

