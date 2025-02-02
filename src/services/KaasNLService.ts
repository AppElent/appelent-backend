import * as cheerio from "cheerio";

export default class KaasNLService {
  async getProductData(url: string): Promise<any> {
    // Fetch the HTML content of the URL
    const html = await (await fetch(url)).text();

    // Get the processed HTML from Cheerio
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    // Extract the product data
    // Taste has 5 spans, each with a class of active if the taste is present, return the number of spans with the class active
    const tasteRating = $(".span-circle span.active").length;
    // Get taste information
    const tasteCategories = $(".kazen_individual_part .kazen_individual")
      .map((_, el) => $(el).text().trim())
      .get();
    // const infoTable = $(".kazen_additional-info");
    // Initialize an object to hold the extracted data
    const productInfo: any = {};

    // Loop through each table row and extract key-value pairs
    $(".kazen_additional-info tbody tr").each((i, row) => {
      const key = $(row).find("td").first().text().trim(); // Get the key
      const value = $(row).find("td").last().text().trim(); // Get the value
      productInfo[key] = value;
    });

    const data = {
      name: $("h1.title").text(),
      taste: tasteRating,
      tasteCategories,
      description: $(".part-description").text().trim(),
      productInfo,
    };
    return data;
  }

  async searchData(query: string): Promise<any> {
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

      products.push({ name, image, flag, url });
    });

    return products;
  }
}

// const kaasNLService = new KaasNLService();
// kaasNLService
//   .getProductData("https://www.kaas.nl/kazen/brie-fleur-de-pre-60/")
//   .then(console.log);
