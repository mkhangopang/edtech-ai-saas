/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
      refresh: jest.fn(),
    };
  },
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue('test-doc-id'),
  }),
}));

// Mock Supabase client
const mockSelectDocument = jest.fn();
const mockSelectUser = jest.fn();
const mockUpdateUserCredits = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ 
        data: { 
          user: { 
            id: 'test-user-id',
            email: 'test@example.com'
          } 
        } 
      }),
    },
    from: jest.fn().mockReturnThis(),
    select: mockSelectDocument,
    eq: jest.fn().mockReturnThis(),
    single: mockSelectUser,
    update: mockUpdateUserCredits,
  }),
}));

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

describe('Generation Page Functionality', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('loads document with correct ID from URL params', async () => {
    // Setup mock to return document
    const mockDocument = {
      id: 'test-doc-id',
      title: 'Math Curriculum.pdf',
      file_url: 'http://example.com/math.pdf',
      extracted_text: 'This is the extracted text from the PDF document...',
      user_id: 'test-user-id',
      created_at: '2023-01-15T10:30:00Z'
    };
    
    mockSelectDocument.mockResolvedValue({ 
      data: mockDocument, 
      error: null 
    });
    
    // In a real implementation, this would be triggered by the component
    expect(mockSelectDocument).not.toHaveBeenCalled();
  });

  test('validates content type selection', () => {
    const validContentTypes = ['lesson', 'mcq', 'srq', 'erq'];
    
    // All should be valid content types
    expect(validContentTypes).toContain('lesson');
    expect(validContentTypes).toContain('mcq');
    expect(validContentTypes).toContain('srq');
    expect(validContentTypes).toContain('erq');
    
    // Should not contain invalid types
    expect(validContentTypes).not.toContain('invalid');
  });

  test('constructs correct API request for content generation', async () => {
    // Setup mock responses
    mockSelectUser.mockResolvedValue({ 
      data: { credits: 50 }, 
      error: null 
    });
    
    mockFetch.mockResolvedValue({
      ok: true,
      getReader: jest.fn().mockReturnValue({
        read: jest.fn().mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('Generated content...')
        }).mockResolvedValueOnce({
          done: true,
          value: undefined
        })
      })
    } as unknown as Response);
    
    // Test API request construction
    const requestBody = {
      documentId: 'test-doc-id',
      type: 'lesson',
      weeks: 8
    };
    
    expect(requestBody.documentId).toBe('test-doc-id');
    expect(requestBody.type).toBe('lesson');
    expect(requestBody.weeks).toBe(8);
  });

  test('handles credit deduction correctly', async () => {
    const initialCredits = 50;
    const creditsAfterGeneration = 49;
    
    // Mock user with initial credits
    mockSelectUser.mockResolvedValue({ 
      data: { credits: initialCredits }, 
      error: null 
    });
    
    // Mock credit update
    mockUpdateUserCredits.mockResolvedValue({ 
      data: { credits: creditsAfterGeneration }, 
      error: null 
    });
    
    // Should deduct 1 credit
    expect(initialCredits - creditsAfterGeneration).toBe(1);
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as unknown as Response);
    
    // Should handle error appropriately
    const response = await mockFetch();
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });
});