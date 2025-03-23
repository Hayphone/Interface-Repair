/*
  # Correction des politiques de sécurité pour les réparations

  1. Modifications
    - Désactivation temporaire de RLS sur la table repairs
    - Suppression des anciennes politiques
  
  2. Sécurité
    - Permettre l'accès public à la table repairs
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can create repairs" ON repairs;
DROP POLICY IF EXISTS "Users can view repairs" ON repairs;
DROP POLICY IF EXISTS "Users can update repairs" ON repairs;
DROP POLICY IF EXISTS "Users can delete repairs" ON repairs;

-- Désactiver RLS sur la table repairs
ALTER TABLE repairs DISABLE ROW LEVEL SECURITY;