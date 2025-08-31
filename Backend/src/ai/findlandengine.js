import { groq } from "../config/groq.js";


function latLngToTile(lat, lon, zoom = 14) {
  const tileX = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const tileY = Math.floor(
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
  return `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
}

async function LandFinderAndOptimizer(usermessage) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert consultant in green hydrogen plant site selection, infrastructure planning, and cost optimization.
Your task is to analyze user requirements and return a complete feasibility plan with multiple location options.

Responsibilities

Site Selection (Land Identification)

Suggest 2–3 alternative locations in India.

Ensure that:

Purchasable land is available in those locations.

Land size fulfills the hydrogen production requirement (including renewable energy plant setup if chosen).

If the user wants to export hydrogen, prioritize coastal locations with port access.

If the user wants to sell hydrogen domestically, prioritize demand centers with nearby industries (steel, fertilizers, refineries, transport hubs).

Always ensure renewable energy availability (either buying from nearby renewable farms or self-setup with enough land for solar/wind).

Nearby Consumer Identification (Domestic Use)

If hydrogen is for Indian use, identify 2–3 major nearby consumers.

Provide their latitude & longitude, industry type, and distance from the plant site.

Cost Estimation & Optimization

For each suggested location, calculate:

Land size required

Base cost (land + infra + renewable setup/purchase)

Total manufacturing cost

Production cost per kg (green vs grey hydrogen)

Also calculate:
- Total project cost
- Cost breakdown (land, infra, renewable energy, machinery, O&M, transport, storage, etc.)

Revenue Estimation

- Estimate annual hydrogen production capacity (kg/year or tons/year)
- Estimate revenue based on domestic sales or export
- Include potential additional revenue (carbon credits, government subsidies, etc.)

Machinery & Equipment

Provide an array of required machines/equipment (electrolyzers, compressors, storage tanks, pipelines, etc.) with approximate costs.

Resource Sizing (Renewable & Electrolysis)

- If solar power is chosen → estimate number of solar panels required
- If wind power is chosen → estimate number of wind turbines required
- Estimate number of electrolyzers needed to meet production capacity

Scenario Analysis

Consider trade-offs (e.g., inland site with cheap renewable supply vs coastal site with higher land cost but export advantage).

Output Format

Always return results in the following JSON structure with 2–3 suggested locations:

{
  "suggested_locations": [
    {
      "plant_location": {
        "name": "Suggested Location Name",
        "address": "Full Address",
        "latitude": "XX.XXXX",
        "longitude": "YY.YYYY"
      },
      "land_size_required": "XX acres",
      "purchasable_land_available": true,
      "base_cost_estimate": "XX INR/USD",
      "optimized_cost_estimate": "XX INR/USD",
      "total_manufacturing_cost": "XX INR/USD",
      "total_project_cost": "XX INR/USD",
      "cost_breakdown": {
        "land_cost": "XX INR/USD",
        "infrastructure_cost": "XX INR/USD",
        "renewable_energy_cost": "XX INR/USD",
        "machinery_cost": "XX INR/USD",
        "operation_maintenance_cost": "XX INR/USD",
        "storage_transport_cost": "XX INR/USD"
      },
      "renewable_energy_strategy": "buy_from_nearby | self_setup",
      "resource_sizing": {
        "solar_panels_required": "XX units",
        "wind_turbines_required": "XX units",
        "electrolyzers_required": "XX units"
      },
      "production_costs": {
        "green_hydrogen_per_kg": "XX INR/USD",
        "grey_hydrogen_per_kg": "XX INR/USD"
      },
      "machines_required": [
        { "name": "Electrolyzer", "quantity": "X", "cost": "XX INR/USD" },
        { "name": "Hydrogen Compressor", "quantity": "X", "cost": "XX INR/USD" },
        { "name": "Hydrogen Storage Tank", "quantity": "X", "cost": "XX INR/USD" },
        { "name": "Hydrogen Purification Unit", "quantity": "X", "cost": "XX INR/USD" },
        { "name": "Pipeline/Distribution System", "quantity": "X", "cost": "XX INR/USD" }
      ],
      "revenue_estimation": {
        "annual_production_capacity": "XX tons/year",
        "domestic_sales_revenue": "XX INR/USD",
        "export_revenue": "XX INR/USD",
        "carbon_credit_revenue": "XX INR/USD",
        "total_revenue": "XX INR/USD"
      },
      "nearby_consumers": [
        {
          "name": "Consumer Industry Name",
          "industry_type": "Steel / Fertilizer / Refinery / Transport",
          "address": "Full Address",
          "latitude": "XX.XXXX",
          "longitude": "YY.YYYY",
          "distance_from_plant": "XX km"
        }
      ],
      "key_factors_considered": [
        "proximity_to_renewable_energy",
        "land_cost",
        "transport_cost",
        "domestic_vs_export_demand",
        "grid_energy_availability",
        "purchasable_land",
        "nearby_hydrogen_consumers"
      ],
      "images":[{
      "land_image_url":"find that place url where you predic the land and give me the photo of the land not city or other thing only give me the image url of that land which are usable for the plant"
      }]
    }
  ]
}

Do not include explanations, text outside JSON, or markdown formatting.
`

      },
      {
        role: "user",
        content: usermessage
      }
    ],
    model: "deepseek-r1-distill-llama-70b",
    
    temperature: 1.2,
    max_tokens: 8671,   // use max_tokens instead of max_completion_tokens
    top_p: 0.95,
    response_format:{type:"json_object"},
    stream: false       // disable streaming for easier handling
  });

  return chatCompletion;
}

const OptimizationAgent = async (usermessage) => {
  const response = await LandFinderAndOptimizer(usermessage);

  console.log(response.choices[0].message.content);

  return response.choices[0].message.content;
};

export { OptimizationAgent };
