#!/bin/bash

cd /root/Interface-Repair || exit

echo "📦 Mise à jour du dépôt..."
git pull origin main

echo "📦 Installation des dépendances..."
npm install

echo "🔧 Résolution du problème de permission pour Vite..."
# Approche alternative pour exécuter Vite
export PATH="$PATH:$(pwd)/node_modules/.bin"

echo "🔨 Build de l'application..."
# Utiliser npx pour éviter les problèmes de permission
npx vite build

# Vérifier si le build a réussi
if [ $? -ne 0 ]; then
    echo "❌ Le build a échoué, arrêt du déploiement."
    exit 1
fi

echo "🚚 Déploiement dans le dossier Hestia..."
# Créer le répertoire de destination s'il n'existe pas
mkdir -p /home/smdrepair/web/smdrepair.fr/public_html/

# Supprimer l'ancien contenu
rm -rf /home/smdrepair/web/smdrepair.fr/public_html/*

# Copier les nouveaux fichiers
cp -r dist/* /home/smdrepair/web/smdrepair.fr/public_html/

# S'assurer que les permissions sont correctes
chown -R smdrepair:smdrepair /home/smdrepair/web/smdrepair.fr/public_html/
chmod -R 755 /home/smdrepair/web/smdrepair.fr/public_html/

echo "✅ Déploiement terminé dans Hestia!"
