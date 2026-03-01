# Contributing Guide

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Code of Conduct](#code-of-conduct)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)
9. [Reporting Issues](#reporting-issues)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or pnpm
- Git
- Basic understanding of React, TypeScript, and Node.js

### Setup Development Environment

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ai-marketing-loop.git
cd ai-marketing-loop

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Install dependencies
npm install
cd server && npm install && cd ..

# 4. Create environment files
cp .env.example .env.local
cp server/.env.example server/.env

# 5. Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

---

## 📐 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. We expect all contributors to:

- Be respectful and inclusive
- Provide constructive criticism
- Focus on the code, not the person
- Help others grow and improve
- Maintain confidentiality where appropriate
- Report unacceptable behavior to maintainers

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing opinions and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discrimination, or hateful comments
- Trolling or inflammatory comments
- Personal attacks
- Publishing others' private information
- Other conduct considered inappropriate in a professional setting

---

## 🔄 Development Workflow

### Branch Naming Convention

```
feature/feature-name          # New features
fix/bugfix-name              # Bug fixes
docs/documentation-topic     # Documentation updates
refactor/refactor-name       # Code refactoring
test/test-description        # Testing improvements
chore/task-description       # Maintenance tasks
```

### Example Branch Names
```
feature/dashboard-widget-customization
fix/campaign-analytics-display
docs/api-documentation-update
refactor/api-client-architecture
test/unit-tests-for-forms
chore/update-dependencies
```

### Creating a Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**
   - Write clean, focused code
   - Follow coding standards
   - Add comments where needed
   - Test your changes frequently

3. **Commit regularly**
   ```bash
   git add .
   git commit -m "Add feature description"
   ```

4. **Push to repository**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create a Pull Request**
   - Go to GitHub
   - Create PR from your branch to `main`
   - Fill in the PR template
   - Request review from maintainers

---

## 📝 Coding Standards

### TypeScript/React

#### File Organization
```tsx
// 1. Imports
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

// 2. Type definitions
interface Props {
  title: string;
  onSubmit: (data: FormData) => Promise<void>;
}

// 3. Constants
const DEFAULT_TIMEOUT = 5000;

// 4. Component definition
export function MyComponent({ title, onSubmit }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (data: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  }, [onSubmit]);

  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 5. Export
export default MyComponent;
```

#### Naming Conventions
```tsx
// Components - PascalCase
function UserProfile() { }
const UserCard = () => { }

// Functions & variables - camelCase
function fetchUserData() { }
const user = { name: 'John' }

// Constants - UPPER_SNAKE_CASE (if they're truly constant)
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Private functions - prefixed with underscore
function _processData() { }

// Boolean variables & functions - is/has prefix
const isLoading = false;
const hasError = true;
function isValidEmail() { }
```

#### Type Safety
```tsx
// Always define types explicitly
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'analyst';
}

// Use union types for enums
type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

// Generic types when needed
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

### CSS/Tailwind

```tsx
// Use Tailwind classes instead of raw CSS
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Button
  </button>
</div>

// Use cn() helper for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-blue-100 border-blue-600',
  isError && 'bg-red-100 border-red-600'
)}>
  Content
</div>
```

### Code Quality

#### Keep Components Focused
- One responsibility per component
- Maximum 200 lines per component (for readability)
- Extract custom hooks for complex logic

#### Avoid Common Mistakes
```tsx
// ❌ DON'T: useEffect for data fetching
useEffect(() => {
  fetch('/api/data').then(setData);
}, []);

// ✅ DO: Use React Query
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: () => api.getData(),
});

// ❌ DON'T: Inline arrow functions in render
<Button onClick={() => this.handleClick()} />

// ✅ DO: Use useCallback
const handleClick = useCallback(() => {
  // handle click
}, [dependencies]);

// ❌ DON'T: Complex inline logic
<div>{user.address.street ? user.address.street : 'N/A'}</div>

// ✅ DO: Extract to a function or use optional chaining
<div>{user.address?.street ?? 'N/A'}</div>
```

---

## 💬 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons)
- **refactor**: Code refactoring without feature changes
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, etc.

### Scope
Scope specifies what part of the code is affected:
- `dashboard`
- `ads-manager`
- `strategy`
- `competitor-intel`
- `api`
- `auth`
- etc.

### Subject
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters
- Reference issues when applicable

### Body
- Explain **what** and **why**, not **how**
- Wrap at 72 characters
- Separated from subject by blank line

### Examples

```
feat(dashboard): add customizable widget layouts
  
Implement drag-and-drop widget customization allowing users
to personalize their dashboard layout. Layout preferences
are saved to localStorage and restored on next visit.

Fixes #123
```

```
fix(campaign-analytics): correct ROAS calculation

The ROAS was being calculated with incorrect formula.
Changed from (revenue - spend) / spend to revenue / spend.

Fixes #456
```

```
docs(api): update authentication endpoints documentation
```

---

## 🔀 Pull Request Process

### Before Creating a PR

1. **Ensure code quality**
   ```bash
   npm run lint      # Check for linting errors
   npm run test      # Run tests
   npm run build     # Verify build succeeds
   ```

2. **Update documentation** if needed
   - Code comments
   - README or FEATURES.md
   - API documentation
   - Setup instructions

3. **Create meaningful commit messages**
   - Follow commit guidelines
   - Group related changes
   - Keep commits focused

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes

## Screenshots (if applicable)
Attach screenshots for UI changes
```

### PR Review Process

1. **Maintainer Review**
   - Code quality assessment
   - Testing verification
   - Documentation review
   - Compatibility check

2. **Feedback & Iterations**
   - Address review comments
   - Request re-review if needed
   - Maintain clean commit history

3. **Approval & Merge**
   - PR approved by maintainer
   - Merge to main branch
   - Delete feature branch

---

## 🧪 Testing

### Testing Standards

#### Unit Tests
```tsx
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats USD amounts correctly', () => {
    const result = formatCurrency(1000, 'USD');
    expect(result).toBe('$1,000.00');
  });

  it('handles zero amounts', () => {
    const result = formatCurrency(0, 'USD');
    expect(result).toBe('$0.00');
  });

  it('handles negative amounts', () => {
    const result = formatCurrency(-100, 'USD');
    expect(result).toBe('-$100.00');
  });
});
```

#### Component Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

#### Running Tests
```bash
# Run all tests once
npm run test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test src/lib/utils.test.ts
```

### Testing Requirements
- Unit tests for utility functions
- Component tests for UI components
- Critical path tests for main features
- Minimum 70% code coverage target

---

## 📚 Documentation

### Code Comments

```tsx
// ✅ Good: Explains why, not what
export function calculateCPA(spend: number, conversions: number): number {
  // Avoid division by zero which would return Infinity
  if (conversions === 0) {
    return 0;
  }
  return spend / conversions;
}

// ❌ Bad: Obvious comments
function addNumbers(a: number, b: number): number {
  // Add a and b
  return a + b;
}
```

### Documentation for Functions

```tsx
/**
 * Calculate Return on Ad Spend (ROAS)
 * 
 * @param revenue - Total revenue generated from the campaign
 * @param spend - Total amount spent on the campaign
 * @returns ROAS ratio (e.g., 2.5 means $2.50 revenue per $1 spent)
 * @throws Error if spend is negative
 * 
 * @example
 * const roas = calculateROAS(10000, 4000);
 * console.log(roas); // 2.5
 */
export function calculateROAS(revenue: number, spend: number): number {
  if (spend < 0) {
    throw new Error('Spend cannot be negative');
  }
  return spend === 0 ? 0 : revenue / spend;
}
```

### Update Documentation Files

When making changes that affect:
- **Features**: Update [FEATURES.md](./FEATURES.md)
- **Architecture**: Update [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Changes**: Update [API.md](./API.md)
- **Setup Steps**: Update [SETUP.md](./SETUP.md)

---

## 🐛 Reporting Issues

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- Browser: Chrome 120
- OS: macOS 14.0
- Node version: 18.19.0
- React version: 18.2.0

## Screenshots
Attach screenshots if applicable

## Additional Context
Any other relevant information
```

### Issue Types
- **Bug Report**: Unexpected behavior
- **Feature Request**: New functionality
- **Documentation**: Missing or unclear docs
- **Enhancement**: Improvement to existing feature

---

## 📋 Checklist Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] New tests added for new functionality
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility tested
- [ ] Git history is clean
- [ ] No unrelated changes included

---

## 🎯 Development Tips

### Debugging

```tsx
// Use browser DevTools
console.log('value:', value);
console.warn('Alert:', message);
console.error('Error:', error);

// Use React DevTools browser extension
// https://react.dev/learn/react-developer-tools

// Use VS Code debugger
// Set breakpoints and step through code

// Use React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Performance Testing

```bash
# Build production bundle analysis
npm run build -- --analyzeMetrics

# Test with React Profiler
# Use browser DevTools > React tab > Profiler

# Test load times
# Use DevTools > Network tab
```

### Local Testing

```bash
# Test against production backend
VITE_API_BASE_URL=https://api.example.com npm run dev

# Test with production environment
npm run build && npm run preview
```

---

## 📞 Getting Help

- **Questions**: Create a discussion on GitHub
- **Issues**: Use the issue tracker
- **Chat**: Contact maintainers directly
- **Documentation**: Check [README.md](./README.md)

---

## 🙏 Thank You

Thank you for your interest in contributing! Your efforts help make this project better for everyone.

---

**Last Updated**: March 2026
