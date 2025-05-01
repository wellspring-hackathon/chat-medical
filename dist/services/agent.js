"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponse = getResponse;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({
    apiKey: "AIzaSyCj28uzHfwfJ_xtEcl5shLXltWI9cKGmTU"
});
const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    config: {
        systemInstruction: "answer as concisely as possible",
    }
});
async function getResponse(query) {
    const response = await chat.sendMessage({
        message: `${query}`
    });
    return response.text;
}
