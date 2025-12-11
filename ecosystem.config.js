module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/var/www/anireserve/apps/web',
    // Avec output: standalone, utiliser le serveur standalone
    script: 'node',
    args: '.next/standalone/server.js',
    // Optimisation: utiliser tous les CPU disponibles en mode cluster
    instances: process.env.PM2_INSTANCES || 'max', // 'max' utilise tous les CPU
    exec_mode: 'cluster', // Mode cluster pour meilleures performances
    // Limite mémoire: redémarrer si > 500MB
    max_memory_restart: '500M',
    // Logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Redémarrage automatique
    autorestart: true,
    watch: false,
    // Variables d'environnement
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Variables d'environnement de production (override)
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
