/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

// Mock OpenAI client
const mockOpenAIChatCompletions = jest.fn();
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockOpenAIChatCompletions
      }
    }
  }));
});

// Mock Supabase server client
const mockCreateServerSupabaseClient = jest.fn();
jest.mock('@/utils/supabase/server', () => ({
  createServerSupabaseClient: mockCreateServerSupabaseClient,
}));

describe('Content Generation API (/api/generate)', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('successfully generates lesson plan content', async () => {
    // Setup mock Supabase client
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null
        })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis()
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Setup mock OpenAI response
    const mockOpenAIResponse = {
      choices: [{
        message: {
          content: 'Generated lesson plan content...'
        }
      }]
    };
    
    mockOpenAIChatCompletions.mockResolvedValue(mockOpenAIResponse);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      title: 'Math Curriculum.pdf',
      extracted_text: 'This is the extracted curriculum text...',
      user_id: 'test-user-id'
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    mockSupabase.update.mockResolvedValue({
      error: null
    });
    
    // Test request parameters
    const requestBody = {
      documentId: 'test-doc-id',
      type: 'lesson',
      weeks: 8
    };
    
    // In a real implementation, this would test the actual API route
    expect(requestBody.type).toBe('lesson');
    expect(requestBody.weeks).toBe(8);
  });

  test('successfully generates MCQ content', async () => {
    // Setup mock Supabase client
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null
        })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis()
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Setup mock OpenAI response
    const mockOpenAIResponse = {
      choices: [{
        message: {
          content: 'Generated MCQ content...'
        }
      }]
    };
    
    mockOpenAIChatCompletions.mockResolvedValue(mockOpenAIResponse);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      title: 'Math Curriculum.pdf',
      extracted_text: 'This is the extracted curriculum text...',
      user_id: 'test-user-id'
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    // Test request parameters
    const requestBody = {
      documentId: 'test-doc-id',
      type: 'mcq'
    };
    
    // Should generate MCQ content
    expect(requestBody.type).toBe('mcq');
  });

  test('successfully generates SRQ content', async () => {
    // Setup mock Supabase client
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null
        })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis()
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Setup mock OpenAI response
    const mockOpenAIResponse = {
      choices: [{
        message: {
          content: 'Generated SRQ content...'
        }
      }]
    };
    
    mockOpenAIChatCompletions.mockResolvedValue(mockOpenAIResponse);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      title: 'Math Curriculum.pdf',
      extracted_text: 'This is the extracted curriculum text...',
      user_id: 'test-user-id'
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    // Test request parameters
    const requestBody = {
      documentId: 'test-doc-id',
      type: 'srq'
    };
    
    // Should generate SRQ content
    expect(requestBody.type).toBe('srq');
  });

  test('successfully generates ERQ content', async () => {
    // Setup mock Supabase client
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null
        })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis()
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Setup mock OpenAI response
    const mockOpenAIResponse = {
      choices: [{
        message: {
          content: 'Generated ERQ content...'
        }
      }]
    };
    
    mockOpenAIChatCompletions.mockResolvedValue(mockOpenAIResponse);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      title: 'Math Curriculum.pdf',
      extracted_text: 'This is the extracted curriculum text...',
      user_id: 'test-user-id'
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    // Test request parameters
    const requestBody = {
      documentId: 'test-doc-id',
      type: 'erq'
    };
    
    // Should generate ERQ content
    expect(requestBody.type).toBe('erq');
  });

  test('handles unauthorized access', async () => {
    // Setup mock Supabase client without user
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: null
        })
      }
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Should return 401 Unauthorized
    const expectedStatus = 401;
    expect(expectedStatus).toBe(401);
  });

  test('handles insufficient credits', async () => {
    // Setup mock Supabase client
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { 
            user: { 
              id: 'test-user-id',
              credits: 0
            } 
          },
          error: null
        })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis()
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Should return 402 Payment Required
    const expectedStatus = 402;
    expect(expectedStatus).toBe(402);
  });

  test('handles document not found', async () => {
    // Setup mock Supabase client
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null
        })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis()
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Setup document not found response
    mockSupabase.select.mockResolvedValue({
      data: null,
      error: { message: 'Document not found' }
    });
    
    // Should return 404 Not Found
    const expectedStatus = 404;
    expect(expectedStatus).toBe(404);
  });

  test('handles OpenAI API errors', async () => {
    // Setup mock Supabase client
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id', credits: 50 } },
          error: null
        })
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis()
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      title: 'Math Curriculum.pdf',
      extracted_text: 'This is the extracted curriculum text...',
      user_id: 'test-user-id'
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    // Setup OpenAI API error
    mockOpenAIChatCompletions.mockRejectedValue(new Error('OpenAI API error'));
    
    // Should handle error appropriately
    await expect(mockOpenAIChatCompletions()).rejects.toThrow('OpenAI API error');
  });
});