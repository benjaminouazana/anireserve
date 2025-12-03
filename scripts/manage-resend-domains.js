#!/usr/bin/env node
/**
 * Script pour gérer les domaines Resend depuis la ligne de commande
 * 
 * Usage:
 *   node scripts/manage-resend-domains.js list
 *   node scripts/manage-resend-domains.js get <domain-id>
 *   node scripts/manage-resend-domains.js create <domain-name>
 *   node scripts/manage-domains.js verify <domain-id>
 *   node scripts/manage-domains.js update <domain-id> --open-tracking --click-tracking
 *   node scripts/manage-domains.js remove <domain-id>
 *   node scripts/manage-domains.js setup <domain-name>
 */

const { Resend } = require('resend');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../apps/web/.env.local') });

// Initialiser Resend avec la clé API
const resendApiKey = process.env.RESEND_API_KEY || 're_YaufuMTW_LVJ8N4CdbffuSEVU6B1EYMrx';
const resend = new Resend(resendApiKey);

// Fonctions de gestion des domaines
async function listDomains() {
  try {
    const domains = await resend.domains.list();
    console.log('📋 Domaines disponibles:', JSON.stringify(domains, null, 2));
    return domains;
  } catch (error) {
    if (error.message && error.message.includes('restricted_api_key')) {
      console.error('\n❌ ERREUR : Votre clé API est restreinte !');
      console.error('📝 Solution :');
      console.error('   1. Allez sur https://resend.com/api-keys');
      console.error('   2. Créez une nouvelle clé API avec "Full access" ou "Manage domains"');
      console.error('   3. Mettez à jour RESEND_API_KEY dans apps/web/.env.local');
      console.error('   4. Réessayez la commande\n');
      console.error('📚 Guide complet : CREER_CLE_API_RESEND_COMPLETE.md\n');
    } else {
      console.error('❌ Erreur lors de la récupération des domaines:', error.message);
    }
    throw error;
  }
}

async function getDomain(domainId) {
  try {
    const domain = await resend.domains.get(domainId);
    console.log('📧 Détails du domaine:', JSON.stringify(domain, null, 2));
    return domain;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du domaine:', error.message);
    throw error;
  }
}

async function createDomain(domainName) {
  try {
    const domain = await resend.domains.create({ name: domainName });
    console.log('✅ Domaine créé avec succès:', JSON.stringify(domain, null, 2));
    return domain;
  } catch (error) {
    if (error.message && error.message.includes('restricted_api_key')) {
      console.error('\n❌ ERREUR : Votre clé API est restreinte !');
      console.error('📝 Solution :');
      console.error('   1. Allez sur https://resend.com/api-keys');
      console.error('   2. Créez une nouvelle clé API avec "Full access" ou "Manage domains"');
      console.error('   3. Mettez à jour RESEND_API_KEY dans apps/web/.env.local');
      console.error('   4. Réessayez la commande\n');
      console.error('📚 Guide complet : CREER_CLE_API_RESEND_COMPLETE.md\n');
    } else {
      console.error('❌ Erreur lors de la création du domaine:', error.message);
    }
    throw error;
  }
}

async function verifyDomain(domainId) {
  try {
    const result = await resend.domains.verify(domainId);
    console.log('✅ Vérification du domaine:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du domaine:', error.message);
    throw error;
  }
}

async function updateDomain(domainId, options) {
  try {
    const domain = await resend.domains.update({
      id: domainId,
      ...options,
    });
    console.log('✅ Domaine mis à jour:', JSON.stringify(domain, null, 2));
    return domain;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du domaine:', error.message);
    throw error;
  }
}

async function removeDomain(domainId) {
  try {
    const result = await resend.domains.remove(domainId);
    console.log('✅ Domaine supprimé:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du domaine:', error.message);
    throw error;
  }
}

async function setupDomain(domainName, options = { openTracking: false, clickTracking: true }) {
  try {
    // 1. Lister les domaines existants
    const existingDomains = await listDomains();
    
    // 2. Vérifier si le domaine existe déjà
    const existingDomain = existingDomains.data?.find(d => d.name === domainName);
    
    if (existingDomain) {
      console.log('ℹ️  Le domaine existe déjà:', existingDomain.id);
      
      // Mettre à jour les paramètres
      if (options.openTracking !== undefined || options.clickTracking !== undefined) {
        await updateDomain(existingDomain.id, options);
      }
      
      return existingDomain;
    }
    
    // 3. Créer le nouveau domaine
    const newDomain = await createDomain(domainName);
    
    // 4. Mettre à jour les paramètres si nécessaire
    if (newDomain.id && (options.openTracking !== undefined || options.clickTracking !== undefined)) {
      await updateDomain(newDomain.id, options);
    }
    
    return newDomain;
  } catch (error) {
    console.error('❌ Erreur lors de la configuration du domaine:', error.message);
    throw error;
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];

  // Vérifier les flags
  const openTracking = process.argv.includes('--open-tracking');
  const clickTracking = process.argv.includes('--click-tracking');

  try {
    switch (command) {
      case 'list':
        console.log('📋 Liste des domaines...\n');
        await listDomains();
        break;

      case 'get':
        if (!arg1) {
          console.error('❌ Usage: node scripts/manage-resend-domains.js get <domain-id>');
          process.exit(1);
        }
        console.log(`📧 Récupération du domaine ${arg1}...\n`);
        await getDomain(arg1);
        break;

      case 'create':
        if (!arg1) {
          console.error('❌ Usage: node scripts/manage-resend-domains.js create <domain-name>');
          process.exit(1);
        }
        console.log(`✅ Création du domaine ${arg1}...\n`);
        await createDomain(arg1);
        break;

      case 'verify':
        if (!arg1) {
          console.error('❌ Usage: node scripts/manage-resend-domains.js verify <domain-id>');
          process.exit(1);
        }
        console.log(`🔍 Vérification du domaine ${arg1}...\n`);
        await verifyDomain(arg1);
        break;

      case 'update':
        if (!arg1) {
          console.error('❌ Usage: node scripts/manage-resend-domains.js update <domain-id> [--open-tracking] [--click-tracking]');
          process.exit(1);
        }
        console.log(`🔄 Mise à jour du domaine ${arg1}...\n`);
        const updateOptions = {};
        if (openTracking) updateOptions.openTracking = true;
        if (clickTracking) updateOptions.clickTracking = true;
        await updateDomain(arg1, updateOptions);
        break;

      case 'remove':
        if (!arg1) {
          console.error('❌ Usage: node scripts/manage-resend-domains.js remove <domain-id>');
          process.exit(1);
        }
        console.log(`🗑️  Suppression du domaine ${arg1}...\n`);
        await removeDomain(arg1);
        break;

      case 'setup':
        if (!arg1) {
          console.error('❌ Usage: node scripts/manage-resend-domains.js setup <domain-name>');
          process.exit(1);
        }
        console.log(`⚙️  Configuration complète du domaine ${arg1}...\n`);
        await setupDomain(arg1, {
          openTracking: false,
          clickTracking: true,
        });
        console.log('\n✅ Configuration terminée!');
        console.log('📝 Prochaines étapes:');
        console.log('   1. Ajoutez les enregistrements DNS indiqués par Resend');
        console.log('   2. Attendez la propagation DNS (peut prendre jusqu\'à 48h)');
        console.log('   3. Exécutez: node scripts/manage-resend-domains.js verify <domain-id>');
        break;

      default:
        console.log(`
📧 Gestionnaire de domaines Resend

Usage:
  node scripts/manage-resend-domains.js <command> [arguments] [options]

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
  node scripts/manage-resend-domains.js list
  node scripts/manage-resend-domains.js create anireserve.com
  node scripts/manage-resend-domains.js setup anireserve.com
  node scripts/manage-resend-domains.js update 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d --click-tracking
  node scripts/manage-resend-domains.js verify 5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d
        `);
        process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (error.response) {
      console.error('Détails:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

main();

