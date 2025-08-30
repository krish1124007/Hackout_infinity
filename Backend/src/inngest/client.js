import { Inngest } from "inngest";
import dotenv from "dotenv"

dotenv.config()
console.log(process.env.INNGEST_EVENT_KEY)

export const inngest = new Inngest({
  id: "your-app-id"
  // eventKey: process.env.INNGEST_EVENT_KEY,   // ✅ Event key from Inngest dashboard
});
