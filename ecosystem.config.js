module.exports = {
  apps: [
    {
      name: 'nest-server',
      script: './dist/main.js',
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      instances: 'max',
      max_memory_restart: '1G',
      args: '',
    },
  ],
};
