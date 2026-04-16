module.exports = {
  apps: [
    {
      name: 'gitleads-api',
      script: 'dist/index.js',
      cwd: '/opt/gitleads/packages/api',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'gitleads-web',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/opt/gitleads/packages/web',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
