module.exports = {
  apps: [
    {
      name: 'Jiweman Backend',
      script: './bin/www',
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      // instances: 2,
      autorestart: true,
      // watch: true,
      max_memory_restart: '1G',
      node_args: '--max_old_space_size=1024',
      env: {
        NODE_ENV: 'staging',
        PORT: 8080,
      },
    },
  ],
};
