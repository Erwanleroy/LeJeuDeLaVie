/*
    Author  : erwanlr56@gmail.com / https://github.com/erwanlr56
    Date    : 11/02/2024
    Version : 
            -G00R00C00 : Création du jeu avec P5.js
*/

var tailleGrille=500
var largeurCanvas=tailleGrille*1.5
var hauteurCanvas=tailleGrille
var grille = []
var oldGrille = []
var nombreDeCases=100
var resolutionGrille=tailleGrille/nombreDeCases
var tauxDePopulation=0.2
var nombreDimageParSecondes=100
//composant DOM
var startButton,addButton,removeButton,clearButton, nbGenerationDiv, nbFrameDiv, nbFrameInput
var startDrawing = 0
var dessinUser = 1
var nombreDeGeneration = 0

function setup(){
    createCanvas(largeurCanvas,hauteurCanvas)

    //ajout des fonctionnalités permise au User
    startButton = createButton('Lancer le jeu').position(20, height + 20).mousePressed(lancementDeLaPartie);
    addButton = createButton('Ajouter un carré').position(150, height + 20).mousePressed(()=>{dessinUser=1});
    removeButton = createButton('Enlever un carré').position(300, height + 20).mousePressed(()=>{dessinUser=0});
    clearButton = createButton('Supprimer tous les carrés').position(450, height + 20).mousePressed(supprimerTousLesCarres);
    nbGenerationInput = createInput('Nombre de générations : '+nombreDeGeneration).position(largeurCanvas+10, 20).attribute('readonly', 'true');
    nbFrameDiv = createDiv('Nombre d\'images/sec : ').position(largeurCanvas+10, 50)
    nbFrameInput = createInput(nombreDimageParSecondes).position(largeurCanvas+10, 80)


    //initialisation du tableau
    for (let i = 0; i < nombreDeCases*2; i++) {
        grille[i] = []
        oldGrille[i] = []
        for (let j = 0; j < nombreDeCases; j++) {
            //créé un chiffre entre 0 et 1 + la variable du taux d'environnement 
            //si on est supérieur a 1 -> notre case vaudra 1 et sera de couleur noire
            if (random(1)+tauxDePopulation>1){
                grille[i][j]=1
                fill(0);
            }else{
                //sinon 0 + Blanc
                grille[i][j]=0
                fill(255);
            }
            //et on dessine la case
            square(i*resolutionGrille,j*resolutionGrille,resolutionGrille)
        }
    }
    //propre à p5.js cest la cadence d'appel de la fonction draw()
}

function draw(){
    //ne se lance qu'à l'appuie sur l'entrée User
    if (startDrawing==0) {
        return
    }
    //trace le nombre d'itérations
    nombreDeGeneration++
    nbGenerationInput.value('Nombre de générations : ' + nombreDeGeneration);
    let widthNbGeneration=textWidth('Nombre de générations : ' + nombreDeGeneration)
    nbGenerationInput.size(widthNbGeneration+10)
    //garde l'état de la grille pour que les modifications que nous apporterons n'affecte pas les calculs
    oldGrille = JSON.parse(JSON.stringify(grille));
    for (let i = 0; i < grille.length; i++) {
        for (let j = 0; j < grille[0].length; j++) {
            //on vérifie les regles pour connaitre le prochain etat de la cellule (voir la fonction lesRegles())
            if (lesRegles(i,j)==1){
                grille[i][j]=1
                fill(0);
            }else{
                grille[i][j]=0
                fill(250);
            }
            square(i*resolutionGrille,j*resolutionGrille,resolutionGrille)
        }
    }
}

function lesRegles(i,j) {
    //nouvelle valeur sera l'output qui vaudra l'état de la nouvelle cellule
    //count sera le compteur de voisins
    var nouvelleValeur,count = 0
    //status= la cellule qu'on analyse
    var status=oldGrille[i][j]
    //ici on tourne sur les cellule de i-1 j-1 à i+1 j+1
//
//     [i-1][j-1]  [i][j-1]   [i+1][j-1]
//     [i-1][j]     status      [i+1][j]
//     [i-1][j+1]  [i][j+1]   [i+1][j+1]

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            //si la cellule est notre cellule annalysée elle n'est pas a compter, on regarde que les voisins
            if (x === 0 && y === 0) continue;
            //gestion des bords en utilisant modulo
            let col = (i + x + grille.length) % grille.length;
            let row = (j + y + grille[0].length) % grille[0].length;
            //ici on vérifie si la cellule vérifier vaut 1 on rajoute 1 au compteur
            count+=oldGrille[col][row] == 1 ? 1 : 0;
        }
    }
    //https://fr.wikipedia.org/wiki/Jeu_de_la_vie
    //une cellule morte possédant exactement trois cellules voisines vivantes devient vivante (elle naît) ;
    //une cellule vivante possédant deux ou trois cellules voisines vivantes le reste, sinon elle meurt.
    
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
    //on renvoi cette valeur
    return nouvelleValeur
}

function lancementDeLaPartie() {
    startDrawing=1;
    //liste de ce que j'ai a supprimer
    [startButton, addButton, removeButton, clearButton, nbFrameDiv, nbFrameInput]
    //suppression 
    .forEach(element => element && element.remove());
    nombreDimageParSecondes = float(nbFrameInput.value());
    frameRate(float(nombreDimageParSecondes))
}

//la cest la fonction de dessin
function mouseDragged() {
    //si le jeu est lancé on ne pourra plus qu'ajouter des cellules
    if (startDrawing == 1) {
        dessinUser=1
    }
    //on trouve quel case est associée à l'emplacement de la souris
    let col = floor(mouseX / resolutionGrille);
    let row = floor(mouseY / resolutionGrille);

    //si on est en mode dessin
    if (dessinUser) {
        //on passe les cases cliquées à 1
        grille[col][row] = 1;
    //sinon
    } else {
        //non
        grille[col][row] = 0;
    }
    //si la case vaut 1 on la rempli en #000 (noir) sinon #255 (blanc)
    fill(grille[col][row] ? 0 : 255);
    square(col * resolutionGrille, row * resolutionGrille, resolutionGrille);
}

//fonction de clear
function supprimerTousLesCarres() {
    for (let i = 0; i < grille.length; i++) {
      for (let j = 0; j < grille[0].length; j++) {
        //on passe toutes les cellules à 0
        grille[i][j] = 0;
        //toutes en blanc
        fill(255);
        square(i * resolutionGrille, j * resolutionGrille, resolutionGrille);
      }
    }
}
