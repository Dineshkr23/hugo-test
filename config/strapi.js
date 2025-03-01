import dotenv from "dotenv";
dotenv.config();
export const STRAPI_API_URL = "https://cms.emovur.com/api/articles?populate=*";
export const STRAPI_HEADERS = {
  Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  "Content-Type": "application/json",
};
