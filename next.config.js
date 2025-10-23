const { execSync } = require('child_process');

// Get the current git commit hash and message
const getCommitInfo = () => {
  try {
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const commitMessage = execSync('git log -1 --pretty=%s').toString().trim();
    return { commitHash, commitMessage };
  } catch (e) {
    console.warn('Could not get git commit info:', e.message);
    return { commitHash: 'unknown', commitMessage: 'unknown' };
  }
};

const { commitHash, commitMessage } = getCommitInfo();

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
    NEXT_PUBLIC_COMMIT_HASH: commitHash,
    NEXT_PUBLIC_COMMIT_MESSAGE: commitMessage,
  },
  generateBuildId: () => commitHash,
}

module.exports = nextConfig
