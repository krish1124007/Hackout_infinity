import { groq } from "../config/groq.js";

async function LandFinderAndOptimizer(usermessage) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
You are an expert AI consultant specializing in renewable energy, green hydrogen production, and industrial optimization.  
The user will provide you structured input data in this format:

{
  "location": {
    "lon": "String (longitude)",
    "lat": "String (latitude)"
  },
  "current_grey_plant_setup": "String - details of existing grey hydrogen/industrial setup",
  "land_and_infrastructure": "String - availability & status of land, buildings, utilities",
  "renewable_energy_source": "String - solar, wind, hydro, etc.",
  "water_availability": "String - description of water sources and capacity",
  "storage_and_transport": "String - infrastructure for hydrogen storage & logistics",
  "end_use_market": "String - nearby industries/markets that will use hydrogen",
  "ai_process": "Boolean - whether to optimize via AI"
}

Your task:
1. Analyze the data and prepare a detailed **conversion plan** for transforming the given plant into a **Green Hydrogen Production Plant**.  
2. Provide output strictly in **valid JSON object** format.  
3. Include the following keys in the JSON response:

{
  "roadmap": "Step by step roadmap of plant conversion",
  "land_cutting_and_area": "Estimated land cutting, preparation, and usable land area",
  "capital_cost_estimate": "Detailed cost breakdown (electrolyzers, infra, renewables, water, storage, transport, others)",
  "operational_cost_estimate": "Yearly/Monthly OPEX",
  "expected_revenue": "Revenue projections with breakdown",
  "payback_period": "Years/months required to recover investment",
  "risks_and_mitigations": "List of major risks and mitigation strategies",
  "suggested_locations": [
    {
      "plant_location": {
        "latitude": "float",
        "longitude": "float"
      },
      "reason": "Why this location is suitable",
      "land_area_required": "sq km/hectares",
      "estimated_cost": "USD or INR",
      "expected_revenue": "USD or INR"
    }
  ],
  "timeline": "Phased timeline of implementation"
}

⚠️ Important:
- Always return a **valid JSON object** only.  
- Do not include markdown, explanations, or text outside JSON.  
- Fill all values realistically with approximate numbers.  
- Latitude and longitude must be numeric (float).  
- Make estimates industry-grade and logical.
`
      },
      {
        role: "user",
        content: usermessage
      }
    ],
    model: "deepseek-r1-distill-llama-70b",
    temperature: 1,
    max_tokens: 6000,
    top_p: 0.9,
    response_format: { type: "json_object" },
    stream: false
  });

  return chatCompletion;
}

export async function transAgent(message)
{
  const response = await LandFinderAndOptimizer(message);

  return response.choices[0].message.content
}
