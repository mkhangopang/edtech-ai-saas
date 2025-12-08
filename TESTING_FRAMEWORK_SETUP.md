# 🧪 Testing Framework Setup Guide

## 📦 Installed Packages

- **Jest**: JavaScript testing framework
- **React Testing Library**: For testing React components
- **@testing-library/jest-dom**: Custom jest matchers for DOM assertions
- **@testing-library/user-event**: Fire events the same way the user does
- **ts-jest**: TypeScript support for Jest
- **@types/jest**: TypeScript definitions for Jest
- **jest-environment-jsdom**: JSDOM environment for DOM testing
- **identity-obj-proxy**: Mock CSS modules

## 📁 Directory Structure

```
/__tests__/
  ├── components/     # Component tests
  ├── pages/          # Page tests
  └── api/            # API route tests
```

## ⚙️ Configuration Files

### `jest.config.js`
Main Jest configuration with:
- TypeScript support via `ts-jest`
- JSDOM environment for browser-like testing
- Path mapping for imports
- CSS module mocking
- Test file transformations

### `jest.setup.js`
Setup file that runs before each test file with:
- Jest DOM matchers
- Navigation mocks
- DOM API mocks

## ▶️ Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## ✅ Current Tests

1. **Dashboard Page Test**: Basic rendering test
2. **Testing Infrastructure**: Validates Jest and RTL setup

## 🎯 Next Steps

1. **Component Tests**:
   - PDF upload component
   - Document listing
   - Credit display

2. **Page Tests**:
   - Login/Signup flows
   - Dashboard functionality
   - Generate page

3. **API Tests**:
   - Text extraction endpoint
   - Content generation endpoint
   - Auth endpoints

## 📝 Test Patterns

### Mocking Next.js Router
```javascript
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));
```

### Mocking Supabase Client
```javascript
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
    // ... other mocks
  }),
}));
```

## 🧪 Best Practices

1. **Test Realistic User Behavior**: Use `@testing-library/user-event` instead of `fireEvent`
2. **Test UI State Changes**: Verify loading states, error messages, success states
3. **Mock External Dependencies**: Supabase, OpenAI, Stripe
4. **Focus on Critical Paths**: PDF upload → Text extraction → Content generation
5. **Use Descriptive Test Names**: Clearly describe what is being tested

## 🚀 Benefits

- **Confidence**: Verify critical functionality works
- **Regression Prevention**: Catch breaking changes
- **Documentation**: Tests serve as usage examples
- **Refactoring Safety**: Change code without fear