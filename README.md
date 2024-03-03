# [Le jeu de la vie](https://fr.wikipedia.org/wiki/Jeu_de_la_vie)

## erwanlr56@gmail.com

Le jeu de la vie c'est quoi 
  - [Un automate cellulaire](https://fr.wikipedia.org/wiki/Automate_cellulaire)
  - Ses règles sont très simple :
  ```js
    //si notre cellule vaut 0
    if (!status) {
        //alors on lui donne la valeur de 1 si elle a trois voisines
        nouvelleValeur=count == 3 ? 1 : 0
    //si notre cellule vaut 1
    }else{
        //on lui donne la valeur de 1 si elle a 2 ou 3 voisines
        nouvelleValeur=count == 3 || count == 2 ? 1 : 0
    }
    //sinon on l'a initialisée a 0
 ```

> La beauté du jeu consiste à voir les cases apparaitre, disparaitre, se combiner, mourir, évoluer comme un microEnvironnement, comme une petite société

