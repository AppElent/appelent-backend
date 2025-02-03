import * as cheerio from "cheerio";
import { CheeseResult, CheeseSearchResult } from "../routes/cheese";
import ScrapingService from "./ScrapingService";

export default class KaasNLService {
  getProductInfoKey(key: string): string {
    switch (key) {
      case "Herkomst":
        return "origin";
      case "Melksoort":
        return "milkType";
      case "Merk":
        return "brand";
      case "Allergenen":
        return "allergens";
      case "Biologische kaas":
        return "organic";
      case "Eetbare korst":
        return "edibleRind";
      case "Vegetarische kaas":
        return "vegetarian";
      case "Gemaakt van rauwe melk":
        return "rawMilk";
    }
    return key;
  }

  async getProductData(url: string): Promise<CheeseResult> {
    // Initialize the scraping service
    const scraper = await ScrapingService.create(url);
    // Get taste rating (mild, strong, 1-5)
    const tasteRating = scraper.getElement(".span-circle span.active").length;
    // Get taste categories
    const tasteCategories = scraper.getTexts(
      ".kazen_individual_part .kazen_individual"
    );

    // Fetch the HTML content of the URL
    // const html = await (await fetch(url)).text();

    // Get the processed HTML from Cheerio
    // Load the HTML into cheerio
    // const $ = cheerio.load(html);
    // // Extract the product data
    // // Taste has 5 spans, each with a class of active if the taste is present, return the number of spans with the class active
    // const tasteRating = $(".span-circle span.active").length;
    // // Get taste information
    // const tasteCategories = $(".kazen_individual_part .kazen_individual")
    //   .map((_, el) => $(el).text().trim())
    //   .get();
    // const infoTable = $(".kazen_additional-info");
    // Initialize an object to hold the extracted data
    const productInfo: any = {};

    // Loop through each table row and extract key-value pairs
    scraper.getElement(".kazen_additional-info tbody tr").each((i, row) => {
      const key = scraper.$(row).find("td").first().text().trim(); // Get the key
      let value: string | boolean = scraper
        .$(row)
        .find("td")
        .last()
        .text()
        .trim(); // Get the value
      if (value.toLowerCase() === "ja") {
        value = true;
      } else if (value.toLowerCase() === "nee") {
        value = false;
      }
      if (key !== "") {
        productInfo[this.getProductInfoKey(key)] = value;
      }
    });

    const data = {
      name: scraper.getText("h1.title"),
      flavorIntensity: tasteRating as 1 | 2 | 3 | 4 | 5,
      tasteCategories,
      description: scraper.getText(".part-description"),
      productInfo,
    };
    return data;
  }

  async searchData(query: string): Promise<CheeseSearchResult[]> {
    // Fetch the HTML content of the URL
    const url = `https://www.kaas.nl/?s=${query}`;
    const html = await (await fetch(url)).text();
    const $ = cheerio.load(html);
    const products: {
      name: string;
      image?: string;
      flag?: string;
      url?: string;
    }[] = [];

    $(".search_res").each((index, artikel) => {
      const name = $(artikel).find(".search_title h5").text().trim();
      const image = $(artikel).find(".search_image img").attr("src");
      const flag = $(artikel).find(".search_flag img").attr("src");
      const url =
        $(artikel)
          .attr("onclick")
          ?.match(/window\.location\.href='([^']+)'/)?.[1] || "";

      products.push({ name, image, flag, url } as CheeseSearchResult);
    });

    return products;
  }
}

// const kaasNLService = new KaasNLService();
// kaasNLService
//   .getProductData("https://www.kaas.nl/kazen/brie-fleur-de-pre-60/")
//   .then(console.log);
