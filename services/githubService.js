import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function pushChangesToGitHub() {
  const repoPath = path.resolve(__dirname, "../hugo-site");

  try {
    console.log("📂 Navigating to Hugo project...");

    // Stage changes
    execSync("git add .", { cwd: repoPath });

    // Check if there's anything to commit
    const statusOutput = execSync("git status --porcelain", {
      cwd: repoPath,
    }).toString();

    if (statusOutput.trim() === "") {
      console.log("🟡 No changes to commit. Skipping push.");
      return;
    }

    // Commit and push
    console.log("📦 Committing and pushing to GitHub...");
    execSync('git commit -m "Update blog post from Strapi"', { cwd: repoPath });
    execSync("git push origin main", { cwd: repoPath });

    console.log("✅ Blog successfully pushed to GitHub");
  } catch (error) {
    console.error("❌ Failed to push blog:", error.message);
    process.exit(1);
  }
}
