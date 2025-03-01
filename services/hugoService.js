import dotenv from "dotenv";
dotenv.config();
import { exec } from "child_process";
import util from "util";
import path from "path";

const execPromise = util.promisify(exec);
const HUGO_DIR = path.resolve("hugo-site");

export async function buildHugo() {
  try {
    console.log(`⚡ Running Hugo Build in: ${HUGO_DIR}`);

    const { stdout, stderr } = await execPromise("hugo", {
      cwd: HUGO_DIR,
    });

    if (stderr) {
      console.warn("⚠️ Hugo Warnings:", stderr);
    }

    console.log("✅ Hugo Build Successful:", stdout);
  } catch (error) {
    console.error("❌ Hugo Build Error:", error.message);
    console.error("🔍 Full Error Output:", error.stderr || error);
    throw error;
  }
}
