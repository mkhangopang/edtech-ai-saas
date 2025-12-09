// Debug script to test redirect functionality
console.log('=== REDIRECT DEBUG SCRIPT ===');

// Simulate the redirect logic from dashboard/page.tsx
const docData = { id: 'test-document-id' };
console.log('Document data:', docData);

if (docData && docData.id) {
  const redirectUrl = `/dashboard/generate?docId=${docData.id}`;
  console.log('Redirect URL would be:', redirectUrl);
  console.log('Expected redirect URL format: /dashboard/generate?docId=test-document-id');
} else {
  console.log('No document ID found - would show error toast');
}

// Test the generate page URL parsing
const testUrl = new URL('http://localhost:3000/dashboard/generate?docId=test-document-id');
const docId = testUrl.searchParams.get('docId');
console.log('Parsed docId from URL:', docId);

console.log('=== END DEBUG SCRIPT ===');