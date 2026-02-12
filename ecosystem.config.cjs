module.exports = {
  apps: [
    {
      name: 'payload-app',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--no-deprecation',
        PORT: '3016',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
    },
  ],
}
