import { getJson } from "serpapi";
import dotenv from "dotenv"

dotenv.config({})
console.log(process.env.TAVILY_API_KEY)

console.log("taivly api key", process.env.TAVILY_API_KEY)
export async function websearch({ query }) {
    

   const data = await  getJson({
        engine: "google",
        q: query,
        location: "Seattle-Tacoma, WA, Washington, United States",
        hl: "en",
        gl: "us",
        google_domain: "google.com",
        num: "10",
        start: "10",
        safe: "active",
        api_key: process.env.TAVILY_API_KEY
    }, (json) => {
        console.log(json["organic_results"]);
    });

    console.log(data)
}



