---
title: 'Pipeline d''analyse cerveau-comportement : de bout en bout, du DICOM aux statistiques'
description: Survol d'un pipeline allant de l'IRM aux statistiques, de la conversion BIDS à la morphométrie basée sur les déformations jusqu'à l'analyse multivariée PLSC sur HPC.
authors:
  - cian-monnin
type: article
---

## Introduction

Un groupe de recherche disposait d'images IRM pondérées en T1 (un
mélange de fichiers DICOM et NIfTI) accompagnées d'un tableur de
mesures comportementales, cognitives et démographiques. La
question : la structure cérébrale est-elle liée au comportement ?

## Étape 1 : des images à la structure

D'abord, tout a été regroupé dans un seul jeu de données BIDS. Les
DICOM bruts ont été convertis avec **dcm2bids** ([dépôt](https://github.com/UNFmontreal/Dcm2Bids)) ; les fichiers NIfTI existants ont
été renommés et intégrés à la même structure BIDS. Cela a fourni une
organisation cohérente pour les outils en aval, quel que soit le
format source.

Le prétraitement a été assuré par **Synthstrip_N3** ([dépôt](https://github.com/CoBrALab/synthstrip_N3)), qui réalise l'extraction du crâne
et la correction du champ de biais N3. Il est maintenu par CoBrALab.

À partir des T1 mis au format BIDS, la **morphométrie basée sur les
déformations (DBM)** a été calculée via
`optimized_antsMultivariateTemplateConstruction` ([dépôt](https://github.com/CoBrALab/optimized_antsMultivariateTemplateConstruction)),
qui construit un gabarit moyen non biaisé. Les champs de déformation
résultants sont convertis en cartes de déterminant jacobien pour
l'analyse statistique.

## Étape 2 : modèles univariés - l'approche standard

Des modèles linéaires voxel par voxel ont été ajustés pour chaque
mesure comportementale :

```
jacobian ~ group + sex + age + behavioural_score
```

Les modèles ont été soumis via SLURM sur la grappe
[Trillium](https://docs.alliancecan.ca/wiki/Trillium) de l'Alliance
de recherche numérique du Canada. Une correction FDR a été appliquée
sur l'ensemble des voxels.

Un mode de défaillance caractéristique des méthodes univariées face à
des signaux distribués : chaque voxel testé individuellement engendre
un fardeau de comparaisons multiples qui enfouit les effets faibles
mais distribués.

## Étape 3 : pivot multivarié - PLSC

La corrélation des moindres carrés partiels (PLSC) évite le problème
des comparaisons multiples en modélisant conjointement le cerveau et
le comportement :

- **Matrice X :** sujets × voxels (jacobiens logarithmiques)
- **Matrice Y :** sujets × mesures comportementales

La PLSC trouve des paires de variables latentes (VL). Ce sont des
patrons cérébraux pondérés et des patrons comportementaux pondérés,
corrélés au maximum.

**Validation a posteriori :** les scores des VL ont été régressés sur
l'âge et le sexe afin d'écarter tout facteur de confusion.

## Étape 4 : livrables

- **Graphiques de saturation comportementale** - Diagrammes en barres
  avec IC bootstrap à 95 % par mesure. Les mesures dont l'IC ne
  croise pas zéro contribuent de façon fiable au patron comportemental
  latent.
- **Cartes cérébrales** - Volumes de ratio bootstrap (en pratique des
  scores z pour les poids de voxels) écrits en MINC et superposés au
  gabarit. Coupes coronales, sagittales et axiales. Versions seuillées
  (|BSR| > 1,95) et non seuillées.
- **Tableau de variance** - Toutes les VL avec valeurs singulières,
  pourcentage de variance et valeurs p de permutation.
- **Tableaux a posteriori** - Résultats OLS de l'âge et du sexe en
  fonction des scores des VL.

## Détails d'infrastructure

**Conception du pipeline :** un seul paramètre `ANALYSIS_NAME` pilote
tout le flux de travail. Chaque script lit les chemins et paramètres
depuis des variables d'environnement. Les répertoires de sortie sont
nommés automatiquement à partir de la configuration
(`plsc_outputs_boot1000_perm5000_YYYYMMDD_HHmm`). Cela permet de
refaire les graphiques d'anciennes exécutions sans relancer les
modèles.

**Points de reprise :** l'analyse PLSC (~5 h) enregistre les résultats
bruts dans un pickle une fois terminée. Relancer le post-traitement
évite le chargement coûteux des jacobiens et le calcul de la PLS.

**Gestion des dépendances (HPC) :** installer `pypyls` sur la grappe a
demandé quelques bricolages. Il fallait des versions anciennes
épinglées de `setuptools` et `numpy`, plus une installation depuis git
sans isolation de build, et les bons modules chargés au préalable. Une
fois les contraintes de version fixées, l'environnement était
reproductible.

## Résumé

- dcm2bids/BIDS -> Synthstrip_N3 -> DBM -> cartes jacobiennes
  logarithmiques
- Modèles univariés voxel par voxel par mesure comportementale
  (corrigés FDR)
- PLSC pour la modélisation conjointe cerveau-comportement, évitant le
  fardeau des comparaisons multiples
- Régression a posteriori des VL sur l'âge et le sexe pour vérifier
  l'absence de facteur de confusion
- Livrables complets : cartes cérébrales, graphiques de saturation,
  tableaux récapitulatifs, résultats bruts

---

_Outils : [dcm2bids](https://github.com/UNFmontreal/Dcm2Bids), [Synthstrip_N3](https://github.com/CoBrALab/synthstrip_N3), [optimized_antsMultivariateTemplateConstruction](https://github.com/CoBrALab/optimized_antsMultivariateTemplateConstruction), [pypyls](https://github.com/netneurolab/pypyls)_
