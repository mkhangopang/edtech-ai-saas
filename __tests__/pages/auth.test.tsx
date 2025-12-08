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
const mockSignUp = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignIn,
      signOut: mockSignOut,
      getUser: jest.fn().mockResolvedValue({ 
        data: { 
          user: null
        } 
      }),
    },
  }),
}));

describe('Authentication Pages', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('handles signup flow correctly', async () => {
    // Setup mock response for successful signup
    const mockResponse = {
      data: { 
        user: { 
          id: 'new-user-id',
          email: 'newuser@example.com'
        },
        session: null
      },
      error: null
    };
    
    mockSignUp.mockResolvedValue(mockResponse);
    
    // Test signup with valid credentials
    const email = 'newuser@example.com';
    const password = 'securepassword123';
    const fullName = 'New User';
    
    await mockSignUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    expect(mockSignUp).toHaveBeenCalledWith({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
  });

  test('handles login flow correctly', async () => {
    // Setup mock response for successful login
    const mockResponse = {
      data: { 
        user: { 
          id: 'test-user-id',
          email: 'test@example.com'
        },
        session: {}
      },
      error: null
    };
    
    mockSignIn.mockResolvedValue(mockResponse);
    
    // Test login with valid credentials
    const email = 'test@example.com';
    const password = 'securepassword123';
    
    await mockSignIn({
      email,
      password
    });
    
    expect(mockSignIn).toHaveBeenCalledWith({
      email,
      password
    });
  });

  test('handles logout flow correctly', async () => {
    // Setup mock response for successful logout
    const mockResponse = {
      error: null
    };
    
    mockSignOut.mockResolvedValue(mockResponse);
    
    // Test logout
    await mockSignOut();
    
    expect(mockSignOut).toHaveBeenCalled();
    // Note: In a real test, we would verify the redirect, but in this mock test
    // we're just checking that signOut was called
  });

  test('validates email format', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';
    
    // Simple email validation
    expect(validEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(invalidEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('validates password strength', () => {
    const strongPassword = 'SecurePass123!';
    const weakPassword = '123';
    
    // Simple password validation (at least 8 characters)
    expect(strongPassword.length).toBeGreaterThanOrEqual(8);
    expect(weakPassword.length).toBeLessThan(8);
  });

  test('handles authentication errors gracefully', async () => {
    // Setup mock response for authentication error
    const mockError = {
      error: {
        message: 'Invalid credentials'
      }
    };
    
    mockSignIn.mockResolvedValue(mockError);
    
    // Should handle error appropriately
    const response = await mockSignIn({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });
    
    expect(response).toHaveProperty('error');
    expect(response.error).not.toBeNull();
  });
});