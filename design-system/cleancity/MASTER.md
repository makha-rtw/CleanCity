# CleanCity — Design System v2 « Calme »

Refonte complète après retour client : la v1 était surchargée (badges partout, 5 couleurs, 3 polices, texte dense, chrome de démo dans l’en-tête).

## Principes
1. **Une action par écran.** Chaque écran mobile a un seul bouton principal.
2. **Peu de couleurs.** Neutres + un seul accent vert profond. Le rouge n’apparaît que pour « urgent ».
3. **Peu de texte.** Titres courts, une phrase d’aide maximum.
4. **La structure vient de l’espace et des filets**, pas des cartes colorées ni des pastilles.
5. **Mobile d’abord** : barre d’onglets en bas, bouton « Signaler » central, zones tactiles ≥ 44 px, signalement en plein écran.

## Couleurs (tokens HSL dans `globals.css`)
| Token | Clair | Sombre | Rôle |
|---|---|---|---|
| canvas | `#FAFAF8` | `#0E100F` | Fond |
| surface | `#FFFFFF` | `#161917` | Cartes, barres |
| subtle | `#F2F2EF` | `#1D201E` | Champs, segments |
| ink | `#16181A` | `#ECEDEB` | Texte |
| muted | `#676E6A` | `#9AA09C` | Texte secondaire (AA) |
| line | `#E6E5E1` | `#272B29` | Filets |
| accent | `#0F6C4A` | `#41C889` | Action principale, « terminé » |
| danger | `#B42318` | `#F07A6E` | Urgent uniquement |

## Typographie
- **Geist** pour tout (400 / 500 / 600). Titres serrés (`tracking -0.02 à -0.035em`).
- Chiffres en `tabular-nums`. Pas de police mono, pas de libellés en majuscules.

## Formes
- Boutons : pilule. Cartes : 20 px. Champs : 14 px.
- Ombres très légères, surtout des bordures 1 px.

## Logo
Carré arrondi encre, « C » ouvert formé d’une boucle, petite feuille verte au bout de la boucle (la seule touche de couleur).
