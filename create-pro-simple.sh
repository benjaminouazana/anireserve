#!/bin/bash

echo "Création du professionnel via l'API..."

curl -X POST http://localhost:3003/api/pro/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Coach",
    "email": "sarah@example.com",
    "password": "test123",
    "city": "Jérusalem",
    "serviceType": "Coach sportif",
    "description": "Coach sportif spécialisée en remise en forme et perte de poids",
    "languages": "fr,he,en"
  }'

echo ""
echo ""
echo "✅ Si tu vois un JSON avec les infos du professionnel, c'est bon !"
echo "Tu peux maintenant te connecter sur http://localhost:3003/pro/login"
echo "Email: sarah@example.com"
echo "Mot de passe: test123"











