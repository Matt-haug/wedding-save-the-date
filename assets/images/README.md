# Photo de couverture (Hero)

La section d'accueil utilise actuellement un dégradé CSS en guise de placeholder. Pour ajouter votre vraie photo :

## Option 1 : Fichier local (recommandé)
1. Déposez votre image dans ce dossier avec le nom `hero.jpg` (ou `hero.png`, `hero.webp`, etc).
2. Dans `css/style.css`, trouvez la règle `.hero` et remplacez-la par :
   ```css
   .hero {
     background: linear-gradient(rgba(46, 42, 34, 0.35), rgba(46, 42, 34, 0.35)), url("../assets/images/hero.jpg") center/cover no-repeat;
     /* ... reste des propriétés ... */
   }
   ```
3. Recommandé : une photo paysage/portrait d'au moins 1600px de large, bien exposée, avec espace libre où se trouvent les textes.

## Option 2 : Data URI (pour tester sans fichier)
Convertissez votre image JPG en base64 et utilisez :
```css
background: linear-gradient(...), url("data:image/jpeg;base64,/9j/4AAQSkZJRg...") center/cover no-repeat;
```
(Services gratuits: https://www.base64-image.de/)

## Option 3 : URL externe
Si votre image est hébergée en ligne :
```css
background: linear-gradient(...), url("https://example.com/your-image.jpg") center/cover no-repeat;
```
