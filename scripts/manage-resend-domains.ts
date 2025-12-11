#!/usr/bin/env ts-node
/**
 * Script pour gérer les domaines Resend depuis la ligne de commande
 * 
 * Usage:
 *   npm run manage:domains list
 *   npm run manage:domains get <domain-id>
 *   npm run manage:domains create <domain-name>
 *   npm run manage:domains verify <domain-id>
 *   npm run manage:domains update <domain-id> --open-tracking --click-tracking
 *   npm run manage:domains remove <domain-id>
 *   npm run manage:domains setup <domain-name>
 */

import * as domainUtils from '../apps/web/src/lib/resend-domains';

const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

// Vérifier les flags
const openTracking = process.argv.includes('--open-tracking');
const clickTracking = process.argv.includes('--click-tracking');

async function main() {
  try {
    switch (command) {
      case 'list':
        console.log('📋 Liste des domaines...\n');
        await domainUtils.listDomains();
        break;

      case 'get':
        if (!arg1) {
          console.error('❌ Usage: npm run manage:domains get <domain-id>');
          process.exit(1);
        }
        console.log(`📧 Récupération du domaine ${arg1}...\n`);
        await domainUtils.getDomain(arg1);
        break;

      case 'create':
        if (!arg1) {
          console.error('❌ Usage: npm run manage:domains create <domain-name>');
          process.exit(1);
        }
        console.log(`✅ Création du domaine ${arg1}...\n`);
        await domainUtils.createDomain(arg1);
        break;

      case 'verify':
        if (!arg1) {
          console.error('❌ Usage: npm run manage:domains verify <domain-id>');
          process.exit(1);
        }
        console.log(`🔍 Vérification du domaine ${arg1}...\n`);
        await domainUtils.verifyDomain(arg1);
        break;

      case 'update':
        if (!arg1) {
          console.error('❌ Usage: npm run manage:domains update <domain-id> [--open-tracking] [--click-tracking]');
          process.exit(1);
        }
        console.log(`🔄 Mise à jour du domaine ${arg1}...\n`);
        const updateOptions: { openTracking?: boolean; clickTracking?: boolean } = {};
        if (openTracking) updateOptions.openTracking = true;
        if (clickTracking) updateOptions.clickTracking = true;
        await domainUtils.updateDomain(arg1, updateOptions);
        break;

      case 'remove':
        if (!arg1) {
          console.error('❌ Usage: npm run manage:domains remove <domain-id>');
          process.exit(1);
        }
        console.log(`🗑️  Suppression du domaine ${arg1}...\n`);
        await domainUtils.removeDomain(arg1);
        break;

      case 'setup':
        if (!arg1) {
          console.error('❌ Usage: npm run manage:domains setup <domain-name>');
          process.exit(1);
        }
        console.log(`⚙️  Configuration complète du domaine ${arg1}...\n`);
        await domainUtils.setupDomain(arg1, {
          openTracking: false,
          clickTracking: true,
        });
        console.log('\n✅ Configuration terminée!');
        console.log('📝 Prochaines étapes:');
        console.log('   1. Ajoutez les enregistrements DNS indiqués par Resend');
        console.log('   2. Attendez la propagation DNS (peut prendre jusqu\'à 48h)');
        console.log('   3. Exécutez: npm run manage:domains verify <domain-id>');
        break;

      default:
        console.log(`
📧 Gestionnaire de domaines Resend

Usage:
  npm run manage:domains <command> [arguments] [options]

Commandes disponibles:
  list                                    - Lister tous les domaines
  get <domain-id>                         - Obtenir les détails d'un domaine
  create <domain-name>                    - Créer un nouveau domaine
  verify <domain-id>                      - Vérifier un domaine
  update <domain-id> [options]            - Mettre à jour un domaine
  remove <domain-id>                      - Supprimer un domaine
  setup <domain-name>                     - Configuration complète (créer + configurer)

Options pour 'update':
  --open-tracking                         - Activer le suivi d'ouverture
  --click-tracking                        - Activer le suivi des clics

Exemples:
  npm run manage:domains list
  npm run manage:domains create anireserve.com
  npm run manage:domains setup anireserve.com
  npm run manage:domains update 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d --click-tracking
  npm run manage:domains verify 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d
        `);
        process.exit(1);
    }
  } catch (error: any) {
    console.error('\n❌ Erreur:', error.message);
    if (error.response) {
      console.error('Détails:', error.response);
    }
    process.exit(1);
  }
}

main();






