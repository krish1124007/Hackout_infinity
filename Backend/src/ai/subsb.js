import { groq } from "../config/groq.js";
import { websearch } from "../tools/websearch.tools.js"; // your Tavily search tool

const messages = []


const policyAgentSchema = async ({ userid, query }) => {

  messages.push({
        role: "user",
        content: `
take this data ${query} in this area's government subsidy and any helps are available? 
if available, then how we can take the help from that. 
search that all benifit and policies and also all the goverment schemes that support here 

output format:
{
  "forlocation":"string",
  "schem":"full description of the scheme",
  "benifits:"all the befints come here",
  "onshort":"scheme in one line",
  "websitelink":"url of the website if available"
}  

only return pure JSON.  

You also have a tool "websearch". If no info in DB, call websearch.`
      })
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    top_p: 0.9,
    stream: false,
    messages: messages,
    tools: [
      {
        type: "function",
        function: {
          name: "websearch",
          description: "Search the web for latest energy/hydrogen policy or regulation updates",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Search query string" }
            },
            required: ["query"]
          }
        }
      }
    ]
    // ❌ removed response_format here
  });
};

export async function SUBCD({ userid, query, city = "Mundra port" }) {
  const result = await policyAgentSchema({ userid, query });

  const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.name === "websearch") {
    const searchResults = await websearch({
      query: `latest green hydrogen subsidy policy for ${city}`
    });

    
    // ✅ 2nd call (no tools, enforce JSON)
    messages.push({ role: "system", content: "Use the following websearch results to refine the policy analysis. Return only JSON in the required format." },
        { role: "user", content: JSON.stringify({ userid, query, city }) },
        { role: "system", content: "Websearch results: " + JSON.stringify(searchResults) })
    const enriched = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages:messages,
      response_format: { type: "json_object" } // ✅ safe here
    });

    try {
      return JSON.parse(enriched.choices[0]?.message?.content || "{}");
    } catch (e) {
      return { forlocation: city, schem: "Not found", onshort: "", websitelink: "" };
    }
  }

  // ✅ Stage 1 direct response (convert to JSON manually since no response_format there)
  try {
    return JSON.parse(result.choices[0]?.message?.content || "{}");
  } catch (e) {
    return { forlocation: city, schem: "Not found", onshort: "", websitelink: "" };
  }
}
