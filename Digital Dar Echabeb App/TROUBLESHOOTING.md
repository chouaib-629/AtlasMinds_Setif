# Troubleshooting Guide

## Vite MIME Type Error (NS_ERROR_CORRUPTED_CONTENT)

If you see an error like:
```
Loading module from "http://localhost:3000/src/App.tsx?t=..." was blocked because of a disallowed MIME type ("").
```

### Solution Steps:

1. **Stop the Vite dev server** (Ctrl+C in terminal)

2. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

3. **Clear browser cache:**
   - Chrome/Edge: Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Or hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

4. **Restart the dev server:**
   ```bash
   npm run dev
   ```

5. **If still not working, do a full clean:**
   ```bash
   rm -rf node_modules/.vite
   rm -rf dist
   npm run dev
   ```

### Alternative Quick Fix:

If you're in a hurry, try:
1. Hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Check if the dev server is still running and restart it

### Common Causes:

- File edited while dev server was running
- Vite cache corruption
- Browser cache issues
- File encoding problems

### Prevention:

- Always stop the dev server before major edits
- Use `npm run dev` instead of keeping it running for long periods

