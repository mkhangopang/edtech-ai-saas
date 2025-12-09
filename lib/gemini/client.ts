import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateWithGemini({
  curriculum,
  userPrompt,
  contentType
}: {
  curriculum: string;
  userPrompt: string;
  contentType: string;
}) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  });

  const systemPrompt = `You are an expert pedagogical AI assistant.

FULL CURRICULUM CONTEXT (loaded in your 1M token memory):
${curriculum}

Your task: Generate high-quality ${contentType} based on the user's request.
Tag all content with appropriate Bloom's Taxonomy levels.
Be specific, practical, and aligned with the curriculum above.`;

  const fullPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}`;

  // Generate content
  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();
  
  return text;
}

export async function generateWithGeminiStream({
  curriculum,
  userPrompt,
  contentType
}: {
  curriculum: string;
  userPrompt: string;
  contentType: string;
}) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  });

  const systemPrompt = `You are an expert pedagogical AI assistant.

FULL CURRICULUM CONTEXT (loaded in your 1M token memory):
${curriculum}

Your task: Generate high-quality ${contentType} based on the user's request.
Tag all content with appropriate Bloom's Taxonomy levels.
Be specific, practical, and aligned with the curriculum above.`;

  const fullPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}`;

  // Stream response
  const result = await model.generateContentStream(fullPrompt);
  
  return result.stream;
}