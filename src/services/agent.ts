import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCj28uzHfwfJ_xtEcl5shLXltWI9cKGmTU"
});
const chat = ai.chats.create({
  model: "gemini-2.0-flash",
  config: {
    systemInstruction: "answer as concisely as possible",
  }
});

export async function getResponse(query: string) {
  const response = await chat.sendMessage({
    message: `${query}`
  });
  return response.text;
}
