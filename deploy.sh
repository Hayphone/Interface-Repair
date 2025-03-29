#!/bin/bash

cd /root/Interface-Repair || exit

echo "📦 Mise à jour du dépôt..."
git pull origin main

echo "📦 Installation des dépendances..."
npm install

echo "🔨 Build de l'application..."
npm run build

echo "🚚 Déploiement dans le dossier nginx..."
rm -rf /var/www/smdrepair.fr/*
cp -r dist/* /var/www/smdrepair.fr/

echo "✅ Déploiement terminé !"
