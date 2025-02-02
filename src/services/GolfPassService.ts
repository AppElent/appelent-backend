import * as cheerio from "cheerio";

export default class GolfPassService {
  async getData(url: string): Promise<any> {
    // Fetch the HTML content of the URL
    const html = await (await fetch(url)).text();

    // Get the processed HTML from Cheerio
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
  }

  async searchData(query: string): Promise<any> {
    // Fetch the HTML content of the URL
    const url = `https://www.golfpass.com/search?q=${query}&global=enabled#search-courses`;
    const html = await (await fetch(url)).text();
    const $ = cheerio.load(html);
    const courses: {
      name: string;
      image?: string;
      score?: string;
      url?: string;
      location?: string;
    }[] = [];

    $(".CoursePromo").each((index, course) => {
      const name = $(course).find(".CoursePromo-title a").text().trim();
      const url = $(course).find(".CoursePromo-title a").attr("href");
      const location = $(course)
        .find(".CoursePromo-locationString")
        .text()
        .trim();
      const score = $(course).find(".RatingStarItem-stars-value").text().trim();
      const image = $(course).find("img").attr("data-src");
      console.log($(course).find("img"));

      courses.push({ name, url, location, score, image });
    });

    return courses;
  }
}

// const kaasNLService = new KaasNLService();
// kaasNLService
//   .getProductData("https://www.kaas.nl/kazen/brie-fleur-de-pre-60/")
//   .then(console.log);
