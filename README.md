# Nuit de l'Info 2026

Dépôt de notre équipe pour la [Nuit de l'Info 2026](https://www.nuitdelinfo.com/).

## Équipe

-

## Stack

- [Astro](https://docs.astro.build) : site statique, zéro JavaScript envoyé par défaut
- [Tailwind CSS](https://tailwindcss.com) : seul le CSS utilisé est généré
- TypeScript strict
- [Biome](https://biomejs.dev) : lint et formatage

## Démarrer

Node.js 22.23 ou plus récent est requis.

```sh
npm install
npm run dev      # http://localhost:4321
```

| Commande          | Rôle                                        |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | serveur de développement                    |
| `npm run build`   | génère le site dans `dist/`                 |
| `npm run preview` | sert le site généré                         |
| `npm run check`   | lint, format et types (à lancer avant push) |
| `npm run format`  | corrige automatiquement le format           |

## Organisation

```
src/
  layouts/Layout.astro   gabarit commun (lien d'évitement, header, footer)
  pages/                 une page = un fichier .astro
  styles/global.css      Tailwind + règles globales
public/                  fichiers servis tels quels
scripts/ecoindex.mjs     estimation EcoIndex à partir de Lighthouse
```

## CI (GitHub Actions)

À chaque push et pull request :

| Job      | Vérifie                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Qualité  | Biome, `astro check`, build                                                                              |
| Sécurité | `npm audit` (failles critiques et hautes), gitleaks (secrets commités)                                   |
| Audits   | Lighthouse (perf ≥ 90, accessibilité = 100, bonnes pratiques et SEO ≥ 90), EcoIndex ≥ B, pa11y WCAG 2 AA |

Dependabot propose chaque semaine les mises à jour des dépendances et des actions.

## Règles de l'équipe

- **Green IT** : pas de librairie ajoutée sans en avoir besoin, images via `astro:assets` (`<Image />`), polices système, pas de vidéo en lecture auto.
- **Accessibilité** : préférer les gris `zinc`/`slate` à `neutral` (pa11y ne sait pas lire leurs couleurs et signale de faux problèmes de contraste). HTML sémantique, un seul `<h1>` par page, `alt` sur toutes les images, tout doit marcher au clavier.
- **Sécurité** : jamais de secret dans le code (utiliser `.env`, ignoré par Git). La CSP est générée par Astro (`astro.config.mjs`) : ajouter une source externe = l'ajouter dans `security.csp.directives`.
