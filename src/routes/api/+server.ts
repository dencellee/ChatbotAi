import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
  const ollama = new Ollama({ host: "http://localhost:11434" });

  try {
    const body = await request.json();
    console.log("Incoming body:", body);

    const chatMessage = body.chat;
    if (!chatMessage) {
      console.error("No chat message received.");
      return json({ error: "No chat message provided" }, { status: 400 });
    }

    const user = {
      name: "Dencelle Bati",
      likes: [ "brownies", "fried chicken"],
      hobbies: ["Tekken 8", "Farlight84", "Valorant"],
      userType: "Master User",
    };

    console.log("Sending message to Ollama...");

    const chat = await ollama.chat({
      model: "deepseek-r1:latest",  // confirm this matches `ollama list`
      messages: [
        {
          role: "system",
          content: `You are a personal assistant for Dencelle Bati. You ONLY answer questions based on the following data: ${JSON.stringify(user)}. If not related, answer "I don't know".`,
        },
        {
          role: "user",
          content: chatMessage,
        },
      ],
    });

    console.log("Ollama chat response:", chat);

    return json(chat);
  } catch (error: any) {
    console.error("Server error:", error);

    // Send the actual error message back in the response for debugging
    return json(
      { error: "Internal Server Error", details: error.message || error },
      { status: 500 }
    );
  }
};
