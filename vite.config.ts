import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get repository name from environment variable for GitHub Pages
// If GITHUB_REPOSITORY is set (e.g., "username/repo-name"), use repo-name as base
// Otherwise, use root path for local development
const getBasePath = () => {
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
    return `/${repoName}/`
  }
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: getBasePath(),
})
