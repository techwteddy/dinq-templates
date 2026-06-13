import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok)
      throw new Error(`Failed to fetch: ${response.statusText}`);

    const html = await response.text();

    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      $('meta[name="twitter:title"]').attr("content") ||
      "Untitled Page";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    let content = "";

    const selectors = [
      "article",
      ".article-body",
      ".story-body",
      ".content-body",
      "main",
      "#main-content",
      ".post-content",
    ];

    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element
          .find("p")
          .map((i, el) => $(el).text())
          .get()
          .join("\n\n");
        if (content.length > 100) break;
      }
    }

    if (!content || content.length < 50) {
      content = $("p")
        .map((i, el) => $(el).text())
        .get()
        .join("\n\n");
    }

    if (!content || content.length < 50) {
      content = description;
    }

    const finalContent = content.slice(0, 5000);

    return NextResponse.json({
      title: title.trim(),
      content:
        finalContent.trim() || "Could not extract text. Please copy manually.",
    });
  } catch (error: any) {
    console.error("Scrape Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL", details: error.message },
      { status: 500 },
    );
  }
}
