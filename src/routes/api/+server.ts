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
      age: 21,
      Gender: "Male",
      location: "West Bajac-Bajac, Olongapo City, Zambales",
      Education: "Bachelor of Science in Computer Science",
      likes: ["brownies", "fried chicken", "ice cream"],
      hobbies: ["mobile legends", "chess", "basketball", "watching movie", "billiards"],
      userType: "Master User",
    };

    console.log("Sending message to Ollama...");

    const chat = await ollama.chat({
      model: "deepseek-r1:1.5b", 
      messages: [
        {
          role: "system",
          content: `You are a helpful personal assistant for Dencelle Bati.
                    You have the following information about Dencelle Bati:${JSON.stringify(user)}
                    Your job is to answer any questions using this data.
                    Important rules:
                    - Only use the given data to answer, or infer based on what you know from the data.
                    - Do not make up random facts that aren't connected to the data.
                    - If there is no logical answer, respond: "Hmm, I couldn't find that in the info I have."
                    "`,
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

    return json(
      { error: "Internal Server Error", details: error.message || error },
      { status: 500 }
    );
  }
};
