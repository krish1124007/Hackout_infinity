import { groq } from "../config/groq.js";
import { websearch } from "../tools/websearch.tools.js"; // your Tavily search tool

const policyAgentSchema = async ({ userid, query }) => {
  return groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    top_p: 0.9,
    stream: false,
    messages: [
      {
        role: "system",
        content: `
You are an AI Policy Analysis Agent focused only on **energy and hydrogen policy**.  
You can call the "websearch" tool when you need fresh or detailed policy/regulatory data.  

### Output Schema:
{
  "userid": "<the userid provided in input>",
  "subject": "<short subject line summarizing the policy query>",
  "policy_analysis": "<detailed explanation of the policy context, risks, and opportunities>",
  "recommendations": [
    "<recommendation 1>",
    "<recommendation 2>",
    "<recommendation 3>"
  ],
  "regulatory_risks": [
    "<risk 1>",
    "<risk 2>"
  ]
}

### Rules:
- Always return only valid JSON in the schema above.  
- If the query is **not related to policy/regulation**, return just "NO".  
- If policy info is missing or outdated, call the **websearch tool** first.  
`
      },
      {
        role: "user",
        content: JSON.stringify({ userid, query })
      }
    ],
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
    ],
    response_format: { type: "json_object" }
  });
};

export async function policyAgent({ userid, query }) {
  const result = await policyAgentSchema({ userid, query });

  // If tool call is suggested
  if (result.choices[0]?.message?.tool_calls) {
    const toolCall = result.choices[0].message.tool_calls[0];
    if (toolCall.function.name === "websearch") {
      const searchResults = await websearch({ query: JSON.parse(toolCall.function.arguments).query });

      // Re-run model with search results injected
      const enriched = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Use the websearch results to refine the policy analysis." },
          { role: "user", content: JSON.stringify({ userid, query }) },
          { role: "assistant", content: JSON.stringify(searchResults) }
        ],
        response_format: { type: "json_object" }
      });
      return JSON.parse(enriched.choices[0]?.message?.content) || "NO";
    }
  }

  return JSON.parse(result.choices[0]?.message?.content) || "NO";
}
