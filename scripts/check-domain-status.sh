#!/bin/bash
# Script pour vérifier le statut du domaine Resend

DOMAIN_ID="633d2d3f-3787-4bb8-94b4-73d1181ed560"

echo "🔍 Vérification du statut du domaine..."
echo ""

# Vérifier le statut
STATUS=$(cd ~/Desktop/aniresa/AniReserve && npm run manage:domains get $DOMAIN_ID 2>&1 | grep -o '"status": "[^"]*"' | head -1 | cut -d'"' -f4)

if [ "$STATUS" = "verified" ]; then
  echo "✅ ✅ ✅ DOMAINE VÉRIFIÉ ! ✅ ✅ ✅"
  echo ""
  echo "🎉 Félicitations ! Votre domaine anireserve.com est maintenant configuré."
  echo "📧 Vos emails seront envoyés depuis noreply@anireserve.com"
  exit 0
elif [ "$STATUS" = "pending" ]; then
  echo "⏳ Statut : PENDING (en attente de propagation DNS)"
  echo ""
  echo "📝 Les enregistrements DNS sont en cours de propagation..."
  echo "⏱️  Cela peut prendre 5-30 minutes (parfois jusqu'à 48h)"
  echo ""
  echo "💡 Vérifiez manuellement les DNS :"
  echo "   dig TXT resend._domainkey.anireserve.com"
  echo "   dig TXT send.anireserve.com"
  echo ""
  echo "🔄 Relancez ce script dans quelques minutes :"
  echo "   bash scripts/check-domain-status.sh"
  exit 1
elif [ "$STATUS" = "failed" ]; then
  echo "❌ Statut : FAILED (échec de vérification)"
  echo ""
  echo "🔍 Vérifiez que tous les enregistrements DNS sont correctement ajoutés :"
  echo "   1. resend._domainkey (TXT)"
  echo "   2. send (TXT pour SPF)"
  echo "   3. send (MX)"
  echo ""
  echo "💡 Vérifiez avec :"
  echo "   dig TXT resend._domainkey.anireserve.com"
  echo "   dig TXT send.anireserve.com"
  echo "   dig MX send.anireserve.com"
  exit 1
else
  echo "❓ Statut inconnu : $STATUS"
  echo ""
  echo "🔍 Vérifiez manuellement :"
  echo "   npm run manage:domains get $DOMAIN_ID"
  exit 1
fi








