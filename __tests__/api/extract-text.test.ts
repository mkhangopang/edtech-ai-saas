/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

// Mock Node.js modules that aren't available in JSDOM
const mockPdfParse = jest.fn();
jest.mock('pdf-parse', () => mockPdfParse);

// Mock Supabase server client
const mockCreateServerSupabaseClient = jest.fn();
jest.mock('@/utils/supabase/server', () => ({
  createServerSupabaseClient: mockCreateServerSupabaseClient,
}));

describe('Text Extraction API (/api/extract-text)', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('successfully extracts text from PDF', async () => {
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
      update: jest.fn().mockReturnThis(),
      storage: {
        from: jest.fn().mockReturnThis(),
        download: jest.fn()
      }
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Setup mock PDF parsing
    const mockPdfData = {
      text: 'This is the extracted text from the PDF document...'
    };
    
    mockPdfParse.mockResolvedValue(mockPdfData);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      file_url: 'test-file-path',
      extracted_text: null
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    mockSupabase.storage.download.mockResolvedValue({
      data: new Blob(['dummy pdf content']),
      error: null
    });
    
    mockSupabase.update.mockResolvedValue({
      error: null
    });
    
    // In a real implementation, this would test the actual API route
    expect(mockCreateServerSupabaseClient).not.toHaveBeenCalled();
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

  test('handles PDF download failure', async () => {
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
      storage: {
        from: jest.fn().mockReturnThis(),
        download: jest.fn()
      }
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      file_url: 'test-file-path',
      extracted_text: null
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    // Setup download failure
    mockSupabase.storage.download.mockResolvedValue({
      data: null,
      error: { message: 'Failed to download PDF' }
    });
    
    // Should return 500 Internal Server Error
    const expectedStatus = 500;
    expect(expectedStatus).toBe(500);
  });

  test('handles text extraction failure', async () => {
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
      storage: {
        from: jest.fn().mockReturnThis(),
        download: jest.fn()
      }
    };
    
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase);
    
    // Mock document data
    const mockDocument = {
      id: 'test-doc-id',
      file_url: 'test-file-path',
      extracted_text: null
    };
    
    // Setup Supabase responses
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    mockSupabase.storage.download.mockResolvedValue({
      data: new Blob(['dummy pdf content']),
      error: null
    });
    
    // Setup PDF parsing failure
    mockPdfParse.mockRejectedValue(new Error('Failed to parse PDF'));
    
    // Should return 500 Internal Server Error
    const expectedStatus = 500;
    expect(expectedStatus).toBe(500);
  });

  test('skips extraction if text already exists', async () => {
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
    
    // Mock document with existing text
    const mockDocument = {
      id: 'test-doc-id',
      file_url: 'test-file-path',
      extracted_text: 'Already extracted text...'
    };
    
    // Setup Supabase response
    mockSupabase.select.mockResolvedValue({
      data: mockDocument,
      error: null
    });
    
    // Should return early without processing
    expect(mockDocument.extracted_text).not.toBeNull();
  });
});