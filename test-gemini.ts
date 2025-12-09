import { generateWithGemini } from './lib/gemini/client';

async function testGeminiIntegration() {
  console.log('Testing Gemini integration...');
  
  try {
    const result = await generateWithGemini({
      curriculum: "This is a sample curriculum about mathematics for grade 8 students. It covers algebra, geometry, and statistics.",
      userPrompt: "Create a lesson plan for algebra",
      contentType: "lesson plan"
    });
    
    console.log('✅ Gemini integration successful!');
    console.log('Generated content:');
    console.log(result);
  } catch (error) {
    console.error('❌ Error testing Gemini integration:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGeminiIntegration();
}