import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash", 
});

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI("YOUR_API_KEY_HERE");

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash"
// });

// const result = await model.generateContent("Hello");
// console.log(result.response.text());