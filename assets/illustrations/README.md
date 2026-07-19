# Illustrations (Reveal section)

La section 2 comporte 3 emplacements réservés pour vos illustrations. Voici comment les ajouter :

## Option 1 : Fichiers locaux (recommandé)
1. Déposez vos fichiers SVG/PNG dans ce dossier : `illustration-1.svg`, `illustration-2.svg`, `illustration-3.svg`
2. Dans `index.html`, remplacez chaque bloc par :
   ```html
   <div class="illustration-slot">
     <img src="assets/illustrations/illustration-1.svg" alt="Fleur" />
   </div>
   ```
3. Taille recommandée : carré 200–400px, fond transparent, lignes simples.
4. Format : SVG (léger) ou PNG (pour photos).

## Option 2 : Supprimer/ajouter des illustrations
- **Moins** : supprimez le `<div class="illustration-slot">` entier
- **Plus** : dupliquez un `<div class="illustration-slot">` et changez le `src`

## Option 3 : Data URI (intégrer directement)
Pour les petits fichiers SVG, vous pouvez les intégrer directement :
```html
<div class="illustration-slot">
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="max-width:70%">
    <circle cx="50" cy="50" r="40" stroke="#D9A441" fill="none"/>
  </svg>
</div>
```

## Comment me fournir vos fichiers

Vous pouvez me les envoyer de plusieurs façons :

1. **Fichiers via Claude** : téléchargez-moi les fichiers (JPG/PNG/SVG) dans le chat — je les placerai dans les bons dossiers
2. **Base64** : si c'est une image petite, convertissez-la en base64 et donnez-moi le code (https://www.base64-image.de/)
3. **URLs externes** : fournissez-moi les URLs si vos images sont déjà hébergées en ligne
4. **Accès local** : vous pouvez copier-coller les fichiers directement dans `assets/images/` et `assets/illustrations/` via l'Explorateur Windows
