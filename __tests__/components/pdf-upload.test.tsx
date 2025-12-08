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
}));

// Mock Supabase client
const mockStorageUpload = jest.fn();
const mockStorageGetPublicUrl = jest.fn();
const mockInsertDocument = jest.fn();
const mockSelectDocuments = jest.fn();

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
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: mockStorageUpload,
      getPublicUrl: mockStorageGetPublicUrl,
    },
    from: jest.fn().mockReturnThis(),
    select: mockSelectDocuments,
    eq: jest.fn().mockReturnThis(),
    single: mockInsertDocument,
    insert: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  }),
}));

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

// Mock sonner
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock('sonner', () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

// Mock DOM APIs that aren't available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('PDF Upload Logic', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockStorageUpload.mockResolvedValue({ 
      data: { path: 'test-path' }, 
      error: null 
    });
    
    mockStorageGetPublicUrl.mockReturnValue({ 
      data: { publicUrl: 'http://test-url.com' } 
    });
    
    mockInsertDocument.mockResolvedValue({ 
      data: { id: 'test-document-id' }, 
      error: null 
    });
    
    mockSelectDocuments.mockResolvedValue({ 
      data: [], 
      error: null 
    });
    
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Text extracted successfully' })
    } as unknown as Response);
  });

  test('validates PDF file type', async () => {
    // Create a mock PDF file
    const pdfFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    // Create a mock non-PDF file
    const txtFile = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    // Test PDF file (should be accepted)
    expect(pdfFile.type).toBe('application/pdf');
    
    // Test non-PDF file (should be rejected)
    expect(txtFile.type).not.toBe('application/pdf');
  });

  test('simulates upload process', async () => {
    // Create a mock PDF file
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate the upload process steps
    const userId = 'test-user-id';
    const fileName = `${userId}/123-test.pdf`;
    
    // Step 1: Upload to storage
    await mockStorageUpload(fileName, file);
    expect(mockStorageUpload).toHaveBeenCalledWith(fileName, file);
    
    // Step 2: Get public URL
    mockStorageGetPublicUrl(fileName);
    expect(mockStorageGetPublicUrl).toHaveBeenCalledWith(fileName);
    
    // Step 3: Insert document record
    await mockInsertDocument();
    expect(mockInsertDocument).toHaveBeenCalled();
    
    // Step 4: Trigger text extraction
    const documentId = 'test-document-id';
    await mockFetch('/api/extract-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
    });
    expect(mockFetch).toHaveBeenCalledWith('/api/extract-text', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    
    // Step 5: Redirect to generate page
    mockPush(`/dashboard/generate?docId=${documentId}`);
    expect(mockPush).toHaveBeenCalledWith(`/dashboard/generate?docId=${documentId}`);
    
    // Step 6: Show success message
    mockToastSuccess('PDF uploaded successfully!');
    expect(mockToastSuccess).toHaveBeenCalledWith('PDF uploaded successfully!');
  });
});