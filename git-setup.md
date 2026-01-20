# Git Setup Commands

Follow these commands to push your code to the GitHub repository:

## 1. Initialize Git Repository (if not already done)
```bash
cd Task-Management-System--main
git init
```

## 2. Add Remote Repository
```bash
git remote add origin https://github.com/Ketanjedhe/Task_management.git
```

## 3. Check Current Status
```bash
git status
```

## 4. Add All Files (excluding those in .gitignore)
```bash
git add .
```

## 5. Commit Changes
```bash
git commit -m "Initial commit: Complete task management system with authentication, CRUD operations, and responsive UI"
```

## 6. Push to GitHub (force push to clear existing repo)
```bash
git push -f origin main
```

## Alternative: If you want to keep existing history
```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

## Verify Upload
After pushing, check your repository at:
https://github.com/Ketanjedhe/Task_management

## Files that will be uploaded:
- ✅ All source code (backend & frontend)
- ✅ Package.json files with dependencies
- ✅ .env.example files (for configuration reference)
- ✅ .gitignore files (to exclude sensitive files)
- ✅ README.md (comprehensive documentation)
- ✅ Setup scripts for easy installation

## Files that will be ignored:
- ❌ node_modules/ (will be excluded)
- ❌ .env files (sensitive data excluded)
- ❌ Build artifacts
- ❌ Log files
- ❌ IDE configuration files