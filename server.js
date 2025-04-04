import express from "express";
import dotenv from "dotenv";
import { fetchStrapiPosts } from "./services/strapiService.js";
import { saveMarkdownFiles } from "./services/markdownService.js";
import { buildHugo } from "./services/hugoService.js";
import { deployToFTP } from "./services/ftpService.js";
import { pushChangesToGitHub } from "./services/githubService.js";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("🚀 Server running");
});

app.post("/generate-and-deploy", async (req, res) => {
  try {
    console.log("🚀 Fetching Strapi Data...");
    const posts = await fetchStrapiPosts();

    console.log("📝 Converting to Markdown...");
    await saveMarkdownFiles(posts);

    console.log("⚡ Building Hugo...");
    await buildHugo();

    console.log("📦 Deploying to GitHub...");
    await pushChangesToGitHub(posts[0]?.title); // Pass the title of the first post for commit message

    // console.log("📤 Deploying to FTP...");
    // await deployToFTP();

    res.status(200).send("✅ Blog updated and deployed successfully!");
  } catch (error) {
    res.status(500).send(`❌ Error: ${error.message}`);
  }
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);
