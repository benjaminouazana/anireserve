// Fichier de configuration PM2 pour AniReserve
// Production-ready avec auto-restart et gestion des logs

module.exports = {
  apps: [{
    name: 'anireserve',
    cwd: '/root/anireserve/apps/web',
    script: 'npm',
    args: 'start',
    instances: 1, // Pour commencer, on peut augmenter plus tard
    exec_mode: 'fork', // fork mode pour Next.js (plus simple que cluster)
    watch: false, // Désactivé en production
    max_memory_restart: '1G', // Redémarrer si > 1GB de RAM
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/root/.pm2/logs/anireserve-error.log',
    out_file: '/root/.pm2/logs/anireserve-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    // Redémarrer automatiquement en cas d'erreur
    restart_delay: 4000,
    // Ignorer les fichiers à surveiller (si watch était activé)
    ignore_watch: [
      'node_modules',
      '.next',
      'logs',
      '*.log'
    ]
  }]
};

