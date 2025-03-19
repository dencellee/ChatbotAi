<script lang="ts">
  import MarkdownIt from "markdown-it";

  let response = "";
  let chat = "";
  let loading = false;
  const md = new MarkdownIt();

  let messages: { role: "user" | "bot"; content: string }[] = [];

  const onSubmit = async () => {
    if (!chat.trim()) return;

    messages = [...messages, { role: "user", content: chat }];

    loading = true;
    response = "";
    const userInput = chat;
    chat = "";

    try {
      const req = await fetch("http://localhost:5173/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat: userInput }),
      });

      const res = await req.json();

      const rawResponse = res?.message?.content || "";
      const cleanedResponse = rawResponse.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      response = cleanedResponse;

      messages = [...messages, { role: "bot", content: cleanedResponse }];

    } catch (err) {
      console.error("Error:", err);
      response = "Something went wrong. Please try again.";
      messages = [...messages, { role: "bot", content: response }];
    } finally {
      loading = false;
    }
  };
</script>

<!-- Chat Wrapper -->
<div class="chat-container">
  
  <!-- Messages -->
  <div class="chat-messages">
    {#each messages as msg}
      <div class="message-row {msg.role}">
        <div class="message">
          {@html md.render(msg.content)}
        </div>
      </div>
    {/each}

    {#if loading}
      <div class="message-row bot">
        <div class="message thinking">
          Thinking...
        </div>
      </div>
    {/if}
  </div>

  <!-- Input -->
  <div class="chat-input">
    <input
      type="text"
      bind:value={chat}
      placeholder="Type your message..."
      on:keydown={(e) => e.key === 'Enter' && onSubmit()}
    />

    <button on:click={onSubmit} disabled={loading}>
      Send
    </button>
  </div>
</div>

<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f4f4f4;
    border: 1px solid #ddd;
  }

  .chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message-row {
    display: flex;
  }

  .message-row.user {
    justify-content: flex-end;
  }

  .message-row.bot {
    justify-content: flex-start;
  }

  .message {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .message-row.user .message {
    background-color: #007bff;
    color: white;
  }

  .message-row.bot .message {
    background-color: #e0e0e0;
    color: #333;
  }

  .thinking {
    opacity: 0.6;
    font-style: italic;
  }

  .chat-input {
    display: flex;
    padding: 12px;
    border-top: 1px solid #ddd;
    background-color: white;
  }

  .chat-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    outline: none;
    margin-right: 8px;
    font-size: 14px;
  }

  .chat-input button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .chat-input button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }

  .chat-input button:hover:not(:disabled) {
    background-color: #0056b3;
  }

</style>
