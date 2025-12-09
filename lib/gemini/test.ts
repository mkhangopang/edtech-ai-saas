import { generateWithGemini } from './client';

async function testGemini() {
  try {
    const result = await generateWithGemini({
      curriculum: "This is a sample curriculum about mathematics for grade 8 students. It covers algebra, geometry, and statistics.",
      userPrompt: "Create a lesson plan for algebra",
      contentType: "lesson plan"
    });
    
    console.log("Gemini generation successful:");
    console.log(result);
  } catch (error) {
    console.error("Error testing Gemini:", error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGemini();
}