module.exports = {
  apps: [
    {
      script: './dist/src/main.js',
      instances: 1,
      max_memory_restart: '500M',

      // Logging
      out_file: './out.log',
      error_file: './error.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',

      // Env Specific Config
      env_stage: {
        name: 'e-library-app-stage',
        NODE_ENV: 'stage',
        PORT: 3071,
        exec_mode: 'cluster_mode',
      },
      env_stage_v2: {
        name: 'e-library-app-stage-v2',
        NODE_ENV: 'stage-v2',
        PORT: 3072,
        exec_mode: 'cluster_mode',
      },
      env_stage_v3: {
        name: 'e-library-app-stage-v3',
        NODE_ENV: 'stage-v3',
        PORT: 3073,
        exec_mode: 'cluster_mode',
      },
      env_production: {
        name: 'e-library-app-production',
        NODE_ENV: 'production',
        PORT: 3073,
        exec_mode: 'cluster_mode',
      },
      env_development: {
        name: 'e-library-app-development',
        NODE_ENV: 'development',
        PORT: 3070,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          './node_modules',
          './package.json',
          './yarn.lock',
          './src',
          './.git',
          './.gitignore',
          './out.log',
          './error.log',
        ],
      },
    },
  ],
};
