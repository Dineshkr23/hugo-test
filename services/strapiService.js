import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { STRAPI_API_URL, STRAPI_HEADERS } from "../config/strapi.js";
export async function fetchStrapiPosts() {
  try {
    const response = await axios.get(STRAPI_API_URL, {
      headers: STRAPI_HEADERS,
    });

    const data = response.data;
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid Strapi response format");
    }

    return data.data.map(
      ({ title, description, slug, createdAt, cover, author, blocks }) => ({
        title,
        description,
        slug,
        createdAt,
        cover,
        author,
        blocks,
      })
    );
  } catch (error) {
    console.error("❌ Strapi Fetch Error:", error.message);
    throw error;
  }
}
