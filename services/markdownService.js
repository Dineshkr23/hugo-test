import dotenv from "dotenv";
dotenv.config();
import fs from "fs/promises";
import path from "path";

const HUGO_CONTENT_DIR = path.resolve("hugo-site", "content", "posts");

export async function saveMarkdownFiles(posts) {
  try {
    await fs.mkdir(HUGO_CONTENT_DIR, { recursive: true });

    await Promise.all(
      posts.map(async (post) => {
        const { title, description, slug, createdAt, cover, author, blocks } =
          post;

        // Ensure clean YAML front matter formatting
        const frontMatter = `---
title: "${title}"
date: "${createdAt}"
slug: "${slug}"
draft: false
author: "${author?.name || "Unknown"}"
cover_image: "${cover?.formats?.large?.url || cover?.url || ""}"
---`;

        // Add cover image if available
        const coverImage = cover?.formats?.large?.url
          ? `\n![Cover Image](${cover.formats.large.url})\n`
          : "";

        // Process content blocks
        const contentBlocks = blocks
          .map((block) => {
            if (block.__component === "shared.rich-text") {
              return `## **Rich Text**\n${block.body}`;
            }
            if (block.__component === "shared.quote") {
              return `> **Quote:** *${block.title}*\n> ${block.body}`;
            }
            return "";
          })
          .join("\n\n");

        // Combine all Markdown parts
        const markdownContent = `${frontMatter}\n\n${description}\n\n${coverImage}\n${contentBlocks}`;

        // Define file path
        const filePath = path.join(HUGO_CONTENT_DIR, `${slug}.md`);
        await fs.writeFile(filePath, markdownContent.trim(), "utf8");
        console.log(`✅ Markdown saved: ${filePath}`);
      })
    );

    console.log("✅ All Markdown files created successfully");
  } catch (error) {
    console.error("❌ Markdown Generation Error:", error.message);
    throw error;
  }
}
