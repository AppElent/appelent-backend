import * as Cheerio from "cheerio";

export default class ScrapingService {
  private $: Cheerio.CheerioAPI;

  constructor(html: string) {
    this.$ = Cheerio.load(html);
  }

  static async create(url: string): Promise<ScrapingService> {
    const response = await fetch(url);
    const html = await response.text();
    return new ScrapingService(html);
  }

  getElement(selector: string): Cheerio.Cheerio<any> {
    return this.$(selector);
  }

  getElementHtml(selector: string): string | null {
    return this.$(selector).html();
  }

  // Get text content of an element by selector
  getText(selector: string): string {
    return this.$(selector).text().trim();
  }

  // Get attribute value of an element by selector
  getAttribute(selector: string, attribute: string): string | undefined {
    return this.$(selector).attr(attribute);
  }

  // Get multiple elements as an array of text
  getTexts(selector: string): string[] {
    return this.$(selector)
      .map((_, el) => this.$(el).text().trim())
      .get();
  }

  // Get multiple elements as an array of attribute values
  getAttributes(selector: string, attribute: string): string[] {
    return this.$(selector)
      .map((_, el) => this.$(el).attr(attribute))
      .get()
      .filter(Boolean);
  }

  // Get LD+JSON script content
  getJsonLd(): any {
    const jsonLdScriptRaw = this.$('script[type="application/ld+json"]');
    return jsonLdScriptRaw
      ? JSON.parse(jsonLdScriptRaw.html() as string)
      : null;
  }
}
