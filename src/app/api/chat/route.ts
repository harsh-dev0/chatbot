import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const result = await streamText({
      model: google("gemini-1.5-pro-latest"),
      messages,
      maxRetries: 2
    })
    return result.toDataStreamResponse({
      headers: { "Content-Type": "text/event-stream" }
    })
  } catch (error: unknown) {
    console.error('Error in chat route:', error);
    let message = "Unknown error"
    if (error instanceof Error) message = error.message
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}