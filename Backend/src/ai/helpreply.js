import { groq } from "../config/groq.js";

const groqSchema = async ({ userid, query }) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
You are a helpful AI assistant for the company "XYZ Corp", a SaaS product company.

### Dummy Product Info (for testing):
- Product Name: XYZ Mailer
- Description: XYZ Mailer is an email automation tool that helps users send bulk emails, schedule campaigns, and analyze delivery reports.
- Features:
  1. Password reset & account recovery
  2. Bulk email sending
  3. Campaign scheduling
  4. Delivery & open rate analytics
- Support Email: support@xyzmailer.com
- Website: https://xyzmailer.com

### Your Task:
You must analyze the user's query related to XYZ Mailer and return a JSON object.

### Output Schema:
{
  "userid": "<the userid provided in input>",
  "subject": "<short subject line of the user's query>",
  "text": "<detailed helpful answer to the query>"
}

if your not get the answer given from the upper details then simplay return NO

### Rules:
- Always return **only valid JSON** in the exact schema above.
- Use the same "userid" provided in input.
- "subject" should be a short and clear title (like an email subject).
- "text" should be a helpful, detailed answer using the dummy product info above.
- ❌ If you do not know the answer or it is unrelated to XYZ Mailer → simply return **"NO"** (string only, not JSON).
`
      },
      {
        role: "user",
        content: JSON.stringify({ userid, query })
      }
    ],
    response_format: { type: "json_object" },
    model: "llama-3.3-70b-versatile"
  });
};


//this code for just the testing purpouse
// async function main()
// {
//     const result = await groqSchema({userid:"abcrdwf34",query:"what google do partnership with the produc xyz"})
//     console.log(result.choices[0].message.content);
// }

// main()


export async function helpAgent({userid , query})
{
  const result = await groqSchema({userid , query});
  return JSON.parse(result.choices[0]?.message?.content) || "NO"
}