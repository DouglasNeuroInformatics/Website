---
title: 'Déploiement local de grands modèles de langage pour un usage clinique et de recherche au Douglas'
extendedTitle: 'Mettre des grands modèles de langage auto-hébergés au service de l’Institut universitaire en santé mentale Douglas'
description: La Plateforme de neuroinformatique Douglas déploie des modèles à poids ouverts — Gemma 4, MedGemma 3, MedGemma 4 et Qwen 3.6 — servis localement avec vLLM, gardant les données sensibles des patients et de la recherche à l’intérieur de l’institut.
authors:
  - gabriel-devenyi
type: article
---

Les grands modèles de langage font désormais partie du travail clinique et de recherche au quotidien : rédaction de documentation, synthèse de la littérature, exploration de données. Mais les modèles commerciaux les plus performants sont hébergés par des tiers, et les utiliser signifie envoyer son texte — y compris, potentiellement, des renseignements sensibles sur les patients — vers des serveurs hors du contrôle de l’établissement. Pour un hôpital en santé mentale, c’est un problème à résoudre plutôt qu’à accepter.

La Plateforme de neuroinformatique Douglas s’y attaque directement : nous déployons des grands modèles de langage à poids ouverts sur notre propre matériel, servis localement aux cliniciens et aux chercheurs de l’Institut universitaire en santé mentale Douglas. Rien ne sort des murs.

## Les modèles

Nous avons retenu un ensemble de modèles à poids ouverts complémentaires pour couvrir l’éventail des besoins cliniques et de recherche :

- **[Gemma 4](https://huggingface.co/google/gemma-4-31B-it)** — le modèle ouvert généraliste de Google, utilisé comme outil polyvalent pour la rédaction, la synthèse, l’assistance au code et les questions générales.
- **[MedGemma 3](https://huggingface.co/google/medgemma-27b-it)** et **[MedGemma 4](https://huggingface.co/google/medgemma-1.5-4b-it)** — des variantes spécialisées en médecine, conçues pour le texte clinique et le raisonnement biomédical. Exécuter les deux générations nous permet de comparer leur qualité et leur comportement tout en offrant aux utilisateurs un modèle entraîné spécifiquement sur du contenu médical.
- **[Qwen 3.6](https://huggingface.co/Qwen/Qwen3.6-27B)** — un modèle multilingue performant, précieux dans un contexte bilingue français/anglais et compétitif en raisonnement et en programmation.

Offrir plusieurs modèles a son importance. Aucun modèle unique n’excelle en tout, et pouvoir diriger une tâche de synthèse clinique vers MedGemma tout en envoyant une tâche multilingue ou de code vers Qwen ou Gemma donne aux utilisateurs le bon outil sans compromis.

## Le service avec vLLM

Tous ces modèles sont servis au moyen de [vLLM](https://github.com/vllm-project/vllm), un moteur d’inférence conçu pour un service à haut débit et à faible latence. Le traitement par lots continu (continuous batching) et l’attention paginée (paged attention) de vLLM permettent à un seul serveur GPU de gérer efficacement de nombreux utilisateurs simultanés, et son API compatible avec celle d’OpenAI fait que les outils et scripts existants fonctionnent avec notre point d’accès local moyennant des modifications minimes — il suffit de les pointer vers notre URL interne plutôt que vers celle d’un fournisseur.

Cette compatibilité est un choix délibéré. Les chercheurs peuvent continuer à utiliser les bibliothèques et les intégrations d’éditeur qu’ils connaissent déjà, et les cliniciens disposent d’interfaces de clavardage familières, pendant que chaque requête est discrètement traitée à l’intérieur de l’institut.

## Pourquoi le local est important : la sécurité des données des patients

La raison centrale de ce travail est la sécurité des données. Les dossiers de santé mentale comptent parmi les données les plus sensibles que détient un hôpital, et ils portent à la fois une protection juridique et une forte obligation éthique. Envoyer ces données vers une API externe crée des risques réels :

- **Perte de contrôle.** Une fois que le texte quitte le réseau, on ne peut plus garantir où il est stocké, combien de temps il est conservé, ni qui peut y accéder. Les conditions des fournisseurs changent, et « nous n’entraînons pas nos modèles sur vos données » est une promesse, pas une garantie technique.
- **Exposition réglementaire.** La loi québécoise sur la protection des renseignements de santé et les cadres canadiens plus larges imposent des limites strictes à la divulgation de renseignements personnels de santé. Les faire transiter par un grand modèle de langage tiers peut constituer une divulgation que l’établissement n’est pas autorisé à faire.
- **Ré-identification.** Le texte clinique libre est notoirement difficile à dépersonnaliser de façon fiable. Même un texte qui semble anonymisé peut laisser filtrer des détails identifiants : « il suffit d’enlever les noms » n’est pas une mesure d’atténuation sûre.

L’auto-hébergement élimine ces risques à la source. Lorsque le modèle s’exécute sur du matériel administré par la plateforme, sur le réseau de l’institut :

- **Les données ne sortent jamais.** Les requêtes et les réponses demeurent sur l’infrastructure locale. Il n’y a aucune transmission externe à auditer, à sécuriser ou à laquelle se fier.
- **Nous contrôlons la conservation.** Les journaux, les caches et l’historique sont régis par nos propres politiques, et non par les paramètres par défaut d’un fournisseur.
- **Les accès sont auditables.** L’authentification et l’utilisation passent par des systèmes que l’institut exploite déjà, de sorte que les accès peuvent être gouvernés et révisés comme ceux de tout autre système clinique interne.
- **Aucune fuite vers l’entraînement.** Les modèles à poids ouverts servis localement ne réinjectent pas les entrées des utilisateurs dans le pipeline d’entraînement de qui que ce soit.

Résultat : un clinicien peut utiliser un modèle de langage pour aider à rédiger une note ou résumer un dossier, et un chercheur peut analyser des données d’étude sensibles avec l’aide d’un modèle, sans que l’un ou l’autre ait à arbitrer entre productivité et risque d’exposer des renseignements sur les patients. L’option sûre devient l’option par défaut.

## Aider les groupes à retirer les RP de leurs données

Le service local règle le problème de la transmission, mais de nombreux groupes de recherche et cliniques doivent aussi nettoyer les renseignements identifiants de leurs propres jeux de données avant de les partager, de les analyser ou de les archiver. C’est difficile à faire correctement à la main, et « il suffit d’effacer les noms » laisse passer les dates, les adresses, les numéros de dossier et les nombreuses autres façons d’identifier une personne dans du texte libre. La plateforme aide les groupes dans cette tâche directement.

Nous appuyons le retrait des renseignements personnels (RP) à l’aide de deux modèles ouverts de classification de jetons conçus pour cette fin :

- **[openai/privacy-filter](https://huggingface.co/openai/privacy-filter)** — un modèle d’environ 1,4 milliard de paramètres qui repère les renseignements personnels identifiables (noms, dates, adresses, identifiants et autres segments semblables) dans le texte. Il est rapide et sous licence Apache 2.0.
- **[OpenMed/privacy-filter-multilingual](https://huggingface.co/OpenMed/privacy-filter-multilingual)** — un ajustement fin de la même architecture qui étend la détection des RP à 16 langues, dont le français et l’anglais, entraîné sur les jeux de données de masquage de RP d’ai4privacy. Dans un institut bilingue, cela compte : un outil de caviardage qui ne comprend que l’anglais manquerait silencieusement les identifiants dans le texte clinique en français.

Ces modèles font de la classification de jetons plutôt que de la génération : ils localisent donc *où* se trouvent les segments sensibles sans réécrire le contenu environnant. Un groupe peut ainsi appliquer la politique qu’il lui faut — caviarder, pseudonymiser ou signaler — et réviser les résultats avant toute publication ou tout transfert. Le modèle bilingue gère notre mélange français/anglais; le modèle de base offre une option éprouvée pour les jeux de données surtout anglophones.

Comme les modèles de langage, ces outils s’exécutent localement, de sorte que les données nettoyées ne quittent jamais l’institut pendant le processus. La plateforme travaille avec chaque groupe pour adapter les outils à ses données et à son flux de travail, transformant la dépersonnalisation d’une corvée manuelle en une étape soutenue et reproductible.

## La suite

Ce déploiement est la fondation d’un ensemble plus large d’outils — recherche documentaire interne, extraction structurée à partir de texte clinique, assistants axés sur la recherche — tous bâtis sur une infrastructure qui garde les données là où elles doivent rester. À mesure que les modèles à poids ouverts s’améliorent, une pile servie localement permet au Douglas d’adopter de nouvelles capacités selon ses propres conditions, sans renégocier la sécurité des données à chaque fois.

Les modèles de langage locaux ne sont pas un compromis sur la capacité. Ils sont la façon dont un institut en santé mentale tire profit de l’IA moderne tout en préservant intacte sa première obligation : protéger les personnes dont il a la charge.

## Pourquoi une équipe comme la PNI est essentielle

Rien de tout cela ne se fait par défaut. Sélectionner des modèles, monter des serveurs GPU, configurer vLLM, sécuriser les points d’accès, intégrer l’authentification, soutenir le retrait bilingue des RP et faire fonctionner l’ensemble est un travail spécialisé qui dépasse largement la formation des cliniciens et des chercheurs — et au-delà de ce que la plupart d’entre eux ont le temps ou le mandat d’assumer. Laissée aux individus, la décision pratique se réduit à deux mauvaises options : coller des données sensibles dans le premier outil commercial venu, ou se passer entièrement de l’IA moderne.

Une équipe de neuroinformatique dédiée fait disparaître ce dilemme. La Plateforme de neuroinformatique Douglas existe précisément pour porter ce fardeau technique et opérationnel au nom de l’institut :

- **Infrastructure.** Acquérir et exploiter le matériel GPU, le moteur d’inférence et la pile de service pour qu’un modèle ne soit qu’un point d’accès que l’utilisateur peut appeler.
- **Sécurité et gouvernance.** Gérer l’authentification, le contrôle d’accès, la politique de journalisation et l’ingénierie de la confidentialité qui maintiennent les déploiements conformes aux obligations relatives aux données de santé.
- **Expertise et curation.** Suivre l’évolution rapide des modèles à poids ouverts, évaluer lesquels méritent d’être déployés et les retirer à mesure que de meilleurs arrivent — pour que les utilisateurs disposent de capacités à jour sans avoir à suivre le domaine eux-mêmes.
- **Soutien.** Travailler directement avec les groupes cliniques et de recherche pour adapter ces outils à des flux de travail réels, de la dépersonnalisation à l’analyse assistée par modèle.

C’est l’argument central en faveur de l’intégration d’une plateforme comme la PNI au sein d’un hôpital de recherche. Les capacités décrites ici — des modèles locaux performants, servis de façon sûre, avec un soutien à la confidentialité pour ceux qui les utilisent — ne sont pas réellement accessibles à un clinicien ou à un chercheur agissant seul. Elles le deviennent lorsqu’un établissement investit dans une équipe dont le travail consiste à les bâtir, à les sécuriser et à les maintenir. C’est cette équipe qui transforme « l’IA moderne, mais seulement si vous acceptez le risque pour la vie privée » en « l’IA moderne, sur une infrastructure à laquelle vous pouvez vous fier ».
