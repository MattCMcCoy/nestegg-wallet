# Hooks and CI Setup

This document outlines the hooks, CI/CD workflows, and automation tools configured for Nestegg Wallet.

## ✅ Currently Configured

### 1. GitHub Actions CI Workflow (`.github/workflows/ci.yml`)
- **Lint**: Checks code style and linting rules
- **Format**: Verifies code formatting
- **Typecheck**: Validates TypeScript types
- **Build**: Ensures the project builds successfully (newly added)

### 2. Dependabot (`.github/dependabot.yml`)
- Automatically creates PRs for dependency updates
- Runs weekly
- Groups production and development dependencies separately
- Limits to 10 open PRs at a time

### 3. CodeQL Security Scanning (`.github/workflows/codeql.yml`)
- Automated security vulnerability scanning
- Runs on pushes and PRs to main
- Scheduled weekly scans
- JavaScript/TypeScript code analysis

### 4. Renovate (`.github/renovate.json`)
- Alternative to Dependabot with more configuration options
- Currently configured with automerge enabled

## 🤔 Recommended Additions

### Pre-commit Hooks (Husky + lint-staged)
Consider adding pre-commit hooks to catch issues before commits:

```bash
# Install dependencies
pnpm add -D husky lint-staged

# Initialize Husky
pnpm exec husky init

# Add pre-commit hook
echo "pnpm exec lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit
```

Then add to `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Commit Message Validation (Commitlint)
Enforce conventional commit messages:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

Create `commitlint.config.js`:
```js
export default {
  extends: ['@commitlint/config-conventional']
};
```

Add to `.husky/commit-msg`:
```bash
pnpm exec commitlint --edit $1
```

### PR Comment Workflow
Add a workflow to comment on PRs with build/test results using actions like `@actions/github-script`.

### Deployment Workflow
If deploying to Vercel, consider:
- `.github/workflows/deploy.yml` - Automatic deployments on merge to main
- Vercel GitHub integration (simpler, but workflow gives more control)

### Release Workflow
For semantic versioning and releases:
- `.github/workflows/release.yml` - Automate version bumps and GitHub releases
- Consider tools like `semantic-release` or `release-please`

## 📝 Notes

- **Dependabot vs Renovate**: You have both configured. Consider choosing one:
  - **Dependabot**: Simpler, native GitHub integration
  - **Renovate**: More features, better for monorepos, more configuration options
  
  Recommendation: Keep Renovate (more powerful for monorepos) and remove Dependabot, OR use Dependabot if you prefer simplicity.

- **Pre-commit hooks**: Not added automatically as they require local setup. Add if you want to enforce quality before commits (recommended for team projects).

- **Testing**: If you add tests later, consider:
  - Adding a `test` job to CI
  - Code coverage reporting
  - E2E testing workflows (Playwright, Cypress)
