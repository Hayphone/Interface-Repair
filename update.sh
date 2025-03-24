#!/bin/bash

echo "📦 Sauvegarde Git automatique en cours..."

# Étape 1 : Ajouter tous les fichiers modifiés
git add .

# Étape 2 : Demander un message de commit
read -p "📝 Entrez un message de commit : " msg

# Étape 3 : Commit avec le message
git commit -m "$msg"

# Étape 4 : Push vers le dépôt distant
git push origin main

echo "✅ Sauvegarde terminée avec succès !"
