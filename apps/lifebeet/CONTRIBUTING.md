# Contributing to Lifebeet

Thank you for your interest in contributing to Lifebeet! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/lifebeet.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Set up your development environment following [SETUP.md](./SETUP.md)

## Development Workflow

### Before Making Changes

1. Ensure you have the latest changes from main:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Making Changes

1. **Code Style**
   - Follow the existing code style
   - Use TypeScript for all new files
   - Use meaningful variable and function names
   - Add comments for complex logic

2. **Components**
   - Use Server Components by default
   - Only use Client Components when necessary (forms, interactivity)
   - Keep components small and focused

3. **Database Queries**
   - Always include `tenantId` in queries for multi-tenant isolation
   - Use Prisma transactions for related operations
   - Handle errors gracefully

4. **Security**
   - Never expose sensitive data
   - Always validate user input
   - Maintain tenant isolation in all operations

### Testing Your Changes

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Test your changes thoroughly:
   - Check functionality works as expected
   - Test edge cases
   - Verify multi-tenant isolation
   - Test in both light and dark modes

3. Build the project to check for errors:
   ```bash
   npm run build
   ```

### Committing Changes

1. Stage your changes:
   ```bash
   git add .
   ```

2. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add expense filtering by category"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:
   - Describe your changes
   - Link any related issues
   - Add screenshots if applicable
   - List any breaking changes

5. Wait for review and address any feedback

## Code Review Process

- All PRs require at least one approval
- Address review comments promptly
- Keep PRs focused and reasonably sized
- Update your PR branch if main has new changes

## Reporting Issues

When reporting issues, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the problem
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Browser, OS, Node.js version
6. **Screenshots**: If applicable

## Feature Requests

Feature requests are welcome! Please:

1. Check if the feature has already been requested
2. Describe the feature and its use case
3. Explain why it would be valuable
4. Consider how it fits with existing features

## Questions?

If you have questions:

1. Check [SETUP.md](./SETUP.md) for setup instructions
2. Check [API.md](./API.md) for API documentation
3. Search existing issues
4. Open a new issue with the question label

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what is best for the community

Thank you for contributing to Lifebeet!
