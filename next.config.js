const { execSync } = require('child_process');

// Get the current git commit hash and message
const getGitHistory = () => {
  try {
    // Get current commit info
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const commitMessage = execSync('git log -1 --pretty=%s').toString().trim();
    
    // Get full git history
    const history = execSync('git log --pretty=format:"%h|%s|%ad" --date=short -n 10')
      .toString()
      .trim()
      .split('\n')
      .map(line => {
        const [hash, message, date] = line.split('|');
        return { hash, message, date };
      });

    return { 
      currentCommit: { hash: commitHash, message: commitMessage },
      history
    };
  } catch (e) {
    console.warn('Could not get git info:', e.message);
    return { 
      currentCommit: { hash: 'unknown', message: 'unknown' },
      history: []
    };
  }
};

const { currentCommit, history } = getGitHistory();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/shopping-list-app' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shopping-list-app/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_CURRENT_COMMIT: JSON.stringify(currentCommit),
    NEXT_PUBLIC_COMMIT_HISTORY: JSON.stringify(history)
  },
  generateBuildId: () => currentCommit.hash,
}

module.exports = nextConfig
