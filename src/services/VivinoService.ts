import console from "console";
import { WineResult, WineSearchResult } from "../routes/wine";
import ScrapingService from "./ScrapingService";

type WineTasteType = {
  intensity?: number;
  sweetness?: number;
  acidity?: number;
  tannin?: number;
  fizziness?: number;
};

export default class VivinoService {
  constructor() {}

  // async getData(url: string) {
  //   try {
  //     // Initialize the scraping service
  //     const scraper = await ScrapingService.create(url);
  //     const jsonld = scraper.getJsonLd();

  //     const rawData = scraper.getElementHtml(
  //       'script[data-component-name="WinePageTopSection"]'
  //     );
  //     const rawJson = rawData ? JSON.parse(rawData) : null;

  //     const wineId = rawJson?.pageInformation?.wine?.id;

  //     // Fetch taste data
  //     const tasteData = await (
  //       await fetch(
  //         `https://www.vivino.com/api/wines/${wineId}/tastes?language=nl`
  //       )
  //     ).json();

  //     // Get script with data-component-name WinePageTopSection

  //     // $(
  //     //   'script[data-component-name="WinePageTopSection"]'
  //     // ).html();
  //     //return JSON.parse(datatest as string);
  //     //console.log(tasteData);

  //     // const taste = $(
  //     //   ".tasteCharacteristics__tasteCharacteristics--2y2ix"
  //     // ).html();
  //     // console.log(taste);
  //     //   let wine;
  //     //   if (Array.isArray(jsonData)) {
  //     //     wine = jsonData[0];
  //     //   } else {
  //     //     wine = jsonData["@graph"]?.find((gr) => gr["@type"] === "Wine");
  //     //   }

  //     //   if (!wine) {
  //     //     throw new Error("Wine data not found in JSON-LD");
  //     //   }

  //     return {
  //       ...jsonld,
  //       tasteData,
  //       rawData,
  //     };
  //   } catch (error) {
  //     console.error("Error fetching wine data:", error);
  //     throw error;
  //   }
  // }

  MIN_TASTE_VALUE = 1;
  MAX_TASTE_VALUE = 5;

  getTasteData(data: WineTasteType): WineTasteType {
    const keys = ["intensity", "sweetness", "acidity", "tannin", "fizziness"];
    const returnData: WineTasteType = {};
    for (const key of keys) {
      const value = data[key as keyof WineTasteType];
      if (value === null || value === undefined) {
        continue;
      }
      const tastePercentage =
        ((value - this.MIN_TASTE_VALUE) /
          (this.MAX_TASTE_VALUE - this.MIN_TASTE_VALUE)) *
        100;
      returnData[key as keyof WineTasteType] = tastePercentage;
    }
    return returnData as WineTasteType;
  }

  async searchWine(query: string): Promise<WineSearchResult[]> {
    try {
      const url = `https://www.vivino.com/search/wines?q=${query}`;
      const scraper = await ScrapingService.create(url);
      const jsonld = scraper.getJsonLd();
      const result = jsonld.map((wine: any) => ({
        id: wine["@id"].split("/").pop(),
        name: wine.name,
        description: wine.description,
        url: wine["@id"],
        rating: {
          average: wine.aggregateRating?.ratingValue,
          count: wine.aggregateRating?.reviewCount,
        },
        brand: {
          id: wine.manufacturer?.name.replaceAll(" ", "_").toLowerCase(),
          name: wine.manufacturer?.name,
          url: wine.manufacturer?.url,
        },
      }));
      return result;
    } catch (error) {
      console.error("Error searching for wine:", error);
      throw error;
    }
  }

  async getWineData(
    url: string,
    options?: { debug: boolean }
  ): Promise<WineResult> {
    try {
      // Initialize the scraping service
      const scraper = await ScrapingService.create(url);
      const jsonld = scraper.getJsonLd();

      const rawData = scraper.getElementHtml(
        'script[data-component-name="WinePageTopSection"]'
      );
      const rawJson = rawData ? JSON.parse(rawData) : null;

      const wineId = rawJson?.pageInformation?.wine?.id;

      // Fetch taste data
      const tasteData = await (
        await fetch(
          `https://www.vivino.com/api/wines/${wineId}/tastes?language=nl`
        )
      ).json();
      const tasteResult = this.getTasteData(tasteData?.tastes?.structure);

      // Get script with data-component-name WinePageTopSection

      // $(
      //   'script[data-component-name="WinePageTopSection"]'
      // ).html();
      //return JSON.parse(datatest as string);
      //console.log(tasteData);

      // const taste = $(
      //   ".tasteCharacteristics__tasteCharacteristics--2y2ix"
      // ).html();
      // console.log(taste);
      //   let wine;
      //   if (Array.isArray(jsonData)) {
      //     wine = jsonData[0];
      //   } else {
      //     wine = jsonData["@graph"]?.find((gr) => gr["@type"] === "Wine");
      //   }

      //   if (!wine) {
      //     throw new Error("Wine data not found in JSON-LD");
      //   }

      return {
        id: rawJson?.pageInformation?.wine?.id,
        name: jsonld?.name,
        description: jsonld?.description,
        url: jsonld?.url,
        website: "Vivino",
        images: jsonld?.image,
        rating: {
          average: jsonld?.aggregateRating?.ratingValue,
          count: jsonld?.aggregateRating?.ratingCount,
        },
        price: {
          currency: jsonld?.offers?.priceCurrency,
          low: jsonld?.offers?.lowPrice,
          high: jsonld?.offers?.highPrice,
        },
        brand: {
          id: jsonld?.brand?.name?.replaceAll(" ", "_").toLowerCase(),
          name: jsonld?.brand?.name,
          url: jsonld?.brand?.url,
        },
        taste: tasteResult,

        // ...jsonld,
        // taste: tasteResult,
        // wine: {
        //   id: rawJson?.pageInformation?.wine?.id,
        //   name: rawJson?.pageInformation?.wine?.name,
        // },
        // // tasteData: tasteResult,
        // // tasteDataRaw: tasteData,
        raw: options?.debug
          ? {
              data: rawJson,
              taste: tasteData,
            }
          : undefined,
      };
    } catch (error) {
      console.error("Error fetching wine data:", error);
      throw error;
    }
  }
}

// const url = "https://www.vivino.com/NL/nl/bodega-norton-roble-malbec/w/3317";
// const service = new VivinoService();
// const data = await service.getWineData(url);
// console.log(data);
//console.log(await service.searchWine("norton malbec"));
