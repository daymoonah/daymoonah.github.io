let eleveSelectionne = null;

// Quand le formulaire "setup-form" est soumis (le joueur clique sur "Commencer l'aventure")
document.getElementById("setup-form").addEventListener("submit", function(e) {
  
  // Empêche le formulaire de recharger la page (comportement normal des formulaires HTML)
  e.preventDefault();

  // Récupère la valeur entrée dans le champ "nom du maître" et supprime les espaces inutiles
  const nommaitre = document.getElementById("nom_maitre").value.trim();

  // Pareil pour le champ "nom de l'école"
  const nomecole = document.getElementById("nom_ecole").value.trim();

  // Si les deux champs sont remplis (pas vides)
  if (nommaitre && nomecole) {

    // Stocke les infos dans le localStorage du navigateur (ça reste même si on recharge la page)
    localStorage.setItem("nommaitre", nommaitre);
    localStorage.setItem("nomecole", nomecole);
    localStorage.setItem("etatJeu", "setup");  // <== on stocke le flag setup

    // Met à jour le texte dans l'écran bienvenue
    //document.getElementById("maitre-display-bienvenue").textContent = nommaitre;
    //document.getElementById("ecole-display-bienvenue").textContent = nomecole;

    // Met à jour la petite fiche "bloc note" avec les infos saisies
    afficherNoteProfil(nommaitre, nomecole);

    // Cache le formulaire d’accueil (maintenant qu'on a les infos)
    document.getElementById("setup-form").style.display = "none";


    afficherBienvenue(true);
  } 
});

//############################################################################



//############################################################################

// Quand tout le contenu HTML est chargé (DOM prêt), on exécute cette fonction
window.addEventListener("DOMContentLoaded", () => {
  const maitre = localStorage.getItem("nommaitre");
  const ecole = localStorage.getItem("nomecole");
  const etat = localStorage.getItem("etatJeu");

  if (!maitre || !ecole) {
    // 👶 Première visite → montrer formulaire uniquement
    document.getElementById("setup-form").style.display = "block";
    document.getElementById("ecran-bienvenue").style.display = "none";
    document.getElementById("btn-suite").style.display = "none";
    return;
  }

   // Profil déjà rempli → on affiche les infos
  afficherNoteProfil(maitre, ecole);
  document.getElementById("setup-form").style.display = "none";

   // Selon l'état du jeu, on affiche ce qu'il faut
  if (etat === "setup") {
    //affiche l'écran de bienvenue
    afficherBienvenue(true);
  } else if (etat === "choixEleves") {
    //cache l'écran de bienvenue
    afficherBienvenue(false);

    //affiche la zone de choix des eleves
    document.getElementById("zone-choix-eleves").style.display = "block";
   // genererGrilleDansCercle(); // ou placerElevesDansCercle() selon ce que tu veux
    afficherElevesDansGrilleCercle();
  } else if (etat === "jeu") {
    //affiche la classe
    document.getElementById("classe-container").style.display = "block";
    genererGrilleClasse(); // ou autre selon ce que tu veux montrer ici
  } else {
    afficherBienvenue(false);
  }
});

//############################################################################

function afficherBienvenue(debut = true) {
  const ecran = document.getElementById("ecran-bienvenue");
  const h2 = ecran.querySelector("h2");
  const p = ecran.querySelector("p");
  const nomMaitre = localStorage.getItem("nommaitre") || "Maître·sse";
  const nomEcole = localStorage.getItem("nomecole") || "Ton école";

  if (debut) {
    h2.textContent = `Bienvenue, ${nomMaitre} !`;
    p.innerHTML = `Tu diriges désormais l'école <strong>${nomEcole}</strong>.`;
    document.getElementById("btn-suite").style.display = "inline-block";
  } else {
    h2.textContent = `Bon retour parmi nous, ${nomMaitre} !`;
    p.innerHTML = `Ravi de te revoir à la tête de <strong>${nomEcole}</strong>.`;
    document.getElementById("btn-suite").style.display = "none"; // Pas besoin de ce bouton ici
  }

  ecran.style.display = "block";
}

//############################################################################

// Quand on clique sur "passer à la suite"
document.getElementById("btn-suite").addEventListener("click", () => {
  // on passe au choix élèves
  localStorage.setItem("etatJeu", "choixEleves");

  //cache l'écran de bienvenue
  document.getElementById("ecran-bienvenue").style.display = "none";

  //affiche l'écran de choix des élèves
  document.getElementById("zone-choix-eleves").style.display = "block";

  afficherGrilleCercle();
  afficherElevesDansGrilleCercle();
});


//############################################################################

function afficherNoteProfil(nommaitre, nomecole) {
  // Met à jour le texte affiché dans le bloc profil avec le nom du maître et le nom de l'école
  document.getElementById("maitre-display").textContent = nommaitre;
  document.getElementById("ecole-display").textContent = nomecole;
  
  // Affiche le bouton "réinitialiser" (reset-button) pour pouvoir effacer les infos si besoin
  document.getElementById("reset-button").style.display = "inline-block";
}

//############################################################################

document.getElementById("reset-button").addEventListener("click", () => {
  // Supprime les infos du joueur dans le localStorage
  localStorage.removeItem("nommaitre");
  localStorage.removeItem("nomecole");
  localStorage.removeItem("etatJeu");  // <-- important !

  // Recharge la page pour repartir sur une base propre (formulaire réaffiché)
  location.reload();
});

//############################################################################
// Fonction qui génère la grille de la classe (un tableau de cases 10 colonnes x 20 lignes)

function genererGrilleClasse() {
  const grille = document.getElementById("grille-classe");
  grille.innerHTML = ''; // On vide le contenu précédent, si il y en avait un

  const totalCases = 10 * 20; // 200 cases au total
  for (let i = 0; i < totalCases; i++) {
    const div = document.createElement('div'); // création d'un div pour chaque case
    div.classList.add("case"); // ajout de la classe CSS 'case' pour le style
    div.textContent = i; // on affiche l'index de la case (utile pour debug)
    grille.appendChild(div); // on ajoute la case à la grille
  }
}

//############################################################################

function resetGrille() {
    //pour chaque case du tableau généré
  document.querySelectorAll('.case').forEach(cell => {
    //Supprime la couleur de fond de la cellule
    cell.style.backgroundColor = '';
    //vide lattribut data-objet
    cell.dataset.objet = '';
    //vide le contenu texte
    cell.textContent = '';
  });
}

//############################################################################

function genererDisposition(type) {
  //on récupère toutes les cases de la grille
  const cells = document.querySelectorAll('.case');
  if(cells.length === 0) return;
  //si jamais la grille est vide, on interromp la fonction
  resetGrille();

  if(type === 'rangee') {
    let ligne = 2; // on commence à la ligne 2 (pour laisser de la place en haut)
    for(let r=0; r<5; r++) { // 5 rangées
      let colDepart = 1; // on commence à la 2ème colonne (décalé pour centrer)
      for(let c=0; c<3; c++) { // 3 colonnes de tables par ligne
        let i = ligne * 10 + colDepart + c * 3;
        placerObjet(cells, i, 2, '#a0522d', 'table'); 
      }
      ligne += 3; // on saute 2 lignes entre chaque rangée
    }
  }

  //############################################################################

  //placement du tableau
  for (let i = 3; i < 7; i++) {
    let index = 19 * 10 + i; // ligne 19 (la dernière), colonnes 3 à 6
    cells[index].style.backgroundColor = '#003366'; // couleur bleu foncé
    cells[index].dataset.objet = 'tableau';
  }

  //placement du bureau du maitre
  for (let i = 1; i < 4; i++) {
    let index = 17 * 10 + i; // ligne 17, colonnes 1 à 3
    cells[index].style.backgroundColor = '#654321'; // marron foncé
    cells[index].dataset.objet = 'bureau';
  }
}

//Chargement de la grille au démarrage
document.addEventListener('DOMContentLoaded', () => {
  genererGrilleClasse();
});

//############################################################################

function placerObjet(cells, index, longueur, couleur, type) {
  for(let i=0; i<longueur; i++) {
    //cells → toutes les cases de la grille (récupérées avec document.querySelectorAll('.case'))
    //index → l’index de départ dans la grille (la case de départ où placer l’objet)
    //longueur → combien de cases occupe l’objet (ex : une table de 2 cases)
    //couleur → (non utilisé ici, mais pourrait servir à colorier)
    //type → le type d’objet (ex : "table", "bureau"…)
    const cell = cells[index + i];
    if(cell) {
      cell.classList.add(type);  // type = 'table', 'bureau', 'tableau'
      cell.title = type.charAt(0).toUpperCase() + type.slice(1); // "Table", "Bureau", etc
    }
  }
}

//############################################################################

//cette fonction ne sert pas encore, mais servira à préparer des ilots (table de 2*2) pour la fonction genererposition(ilot)
function placerIlot(cells, index) {
  // carré de 2x2
  const ligne = Math.floor(index / 10);
  const col = index % 10;

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const i = (ligne + r) * 10 + (col + c);
      const cell = cells[i];
      if (cell) {
        cell.style.backgroundColor = "#cd853f";
        cell.dataset.objet = "ilot";
      }
    }
  }
}

//############################################################################

  // Ajoute un élève visuellement dans la grille, à la position correspondant à la case donnée
  // caseIndex : indice de la case dans la grille (0 à 199 pour une grille 10x20)
  // nom : le prénom de l'élève (on affiche juste la première lettre en majuscule)
function ajouterEleve(caseIndex, nom) {
  const eleves = document.getElementById('eleves');  // conteneur global des élèves affichés
  const eleveDiv = document.createElement('div');    // création d'un nouvel élément div pour l'élève
  eleveDiv.classList.add('eleve');                   // classe CSS pour style de l'élève (taille, forme, couleur, etc.)
  eleveDiv.textContent = nom[0].toUpperCase();       // on met la première lettre du prénom en majuscule comme label visible
  eleveDiv.style.position = 'absolute';              // positionnement absolu pour placer précisément dans la grille

  const tailleCase = 30;                              // taille en pixels d'une case de la grille (largeur et hauteur)
  const ligne = Math.floor(caseIndex / 10);          // calcul de la ligne dans la grille
  const col = caseIndex % 10;                         // calcul de la colonne dans la grille

  // Positionnement pixel précis de l'élève dans la grille (en fonction ligne/colonne * taille de la case)
  eleveDiv.style.top = ligne * tailleCase + 'px';
  eleveDiv.style.left = col * tailleCase + 'px';

  eleves.appendChild(eleveDiv);                       // on ajoute ce div à l'élément 'eleves' dans le DOM
}

//############################################################################

// Supprime tous les éléments enfants du conteneur 'eleves', nettoyant ainsi tous les élèves affichés
function nettoyerEleves() {
  const eleves = document.getElementById('eleves');
  eleves.innerHTML = '';                              // vider le contenu HTML du conteneur
}

//############################################################################

const couleursFilles = [
  "#FF69B4", // rose vif
  "#FFC0CB", // rose clair
  "#DA70D6", // mauve
  "#EE82EE", // violet clair
  "#FFD700", // jaune doré
  "#FFA500", // orange
  "#FF4500", // rouge orangé
  "#FF1493", // rose profond
  "#FFB6C1", // rose pâle
  "#E6E6FA", // lavande
  "#FF6347", // tomate (rouge orangé clair)
  "#F08080", // light coral (rouge clair)
  "#FFA07A", // saumon clair
  "#FF8C00", // orange foncé
  "#Fuchsia", // fuchsia
  "#FF00FF", // magenta
  "#FFDAB9", // pêche
  "#FFE4E1", // rose très pâle
  "#FF69B4", // rose vif (répété mais ça va)
  "#FF7F50",  // corail
  "#a63d82", 
  "#c31610", 
  "#ec5544", 
  "#ee670b",
  "#ed9f0f",
  "#edb613",
  "#efc755", 
  "#edb664", 
];

const couleursGarcons = [
  "#0000FF", // bleu
  "#1E90FF", // dodger blue
  "#00BFFF", // deep sky blue
  "#008080", // teal
  "#228B22", // forest green
  "#32CD32", // lime green
  "#006400", // dark green
  "#00FF7F", // spring green
  "#3CB371", // medium sea green
  "#40E0D0", // turquoise
  "#4682B4", // steel blue
  "#5F9EA0", // cadet blue
  "#6495ED", // cornflower blue
  "#7FFF00", // chartreuse
  "#7CFC00", // lawn green
  "#00FA9A", // medium spring green
  "#ADFF2F", // green yellow
  "#008080", // teal (répété)
  "#20B2AA", // light sea green
  "#2E8B57",  // sea green
  "#0b2771",
  "#2258b2", 
  "#20205e", 
  "#0e5068",
];


//############################################################################

//Liste des prénoms séparés par genre
const prenomsGarcons = ["Léo", "Noah", "Hugo", "Lucas", "Enzo", "Gabriel", "Raphael", "Louis", "Maël", "Jules", "Adam"];
const prenomsFilles = ["Emma", "Jade", "Lina", "Chloé", "Camille", "Anna", "Tina", "Nina", "Lya", "Julie", "Alexandra", "Manon"];
const qualites = ["curieux", "sociable", "créatif", "gentil", "patient", "dynamique"];
const defauts = ["timide", "discret", "désordonné", "impatient", "rêveur", "têtu"];

//############################################################################
//#
//#_____________________Ici on garde
//#
//############################################################################

function genererTraits(arr, nombre) {

  let resultat = [];
  while (resultat.length < nombre) {
    let t = arr[Math.floor(Math.random() * arr.length)];
    if (!resultat.includes(t)) resultat.push(t);
  }
  return resultat;
}

//############################################################################

function genererEleve() {
  const genres = ["m", "f"];
  const genre = genres[Math.floor(Math.random() * genres.length)];

  // Choix prénom selon genre
  const prenom = (genre === "m") 
    ? prenomsGarcons[Math.floor(Math.random() * prenomsGarcons.length)] 
    : prenomsFilles[Math.floor(Math.random() * prenomsFilles.length)];

  // Couleur selon genre
  const couleur = (genre === "m") 
    ? couleursGarcons[Math.floor(Math.random() * couleursGarcons.length)] 
    : couleursFilles[Math.floor(Math.random() * couleursFilles.length)];

  
  return {
    id: crypto.randomUUID(),
    prenom,
    genre,
    couleur,
    dateNaissance: genererDateNaissance(),
    niveau: {
      maths: rand(30, 100),
      francais: rand(30, 100),
      histoiregeo: rand(30, 100),
      sciences: rand(30, 100),
      sport: rand(30, 100),
      langues: rand(30, 100)
    },
    qualites: genererTraits(qualites, 2),
    defauts: genererTraits(defauts, 2)
  };
}

//############################################################################

function genererDateNaissance() {
  const annee = rand(2011, 2017);
  const mois = rand(1, 12);
  const jour = rand(1, 28);
  return `${jour}/${mois}/${annee}`;
}

//############################################################################

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//############################################################################
//#
//#_____________________jusque la
//#
//############################################################################

function afficherInfosEleve(eleve) {
  const zone = document.getElementById("info-eleve");

  const qualites = Array.isArray(eleve.qualites) ? eleve.qualites.join(", ") : "Aucune";
  const defauts = Array.isArray(eleve.defauts) ? eleve.defauts.join(", ") : "Aucun";
  
  //console.log(eleve)

   zone.innerHTML = `
    <h3 style="color: ${eleve.couleur}; margin:0">${eleve.prenom} (${eleve.genre === "m" ? "Garçon" : "Fille"})</h3>
    <p>Né(e) le ${eleve.dateNaissance}</p>
    <p><strong>Stats :</strong><br>
       Maths : ${eleve.niveau.maths}<br>
       Français : ${eleve.niveau.francais}<br>
       Histoire : ${eleve.niveau.histoiregeo}<br>
       Sciences : ${eleve.niveau.sciences}<br>
       Sport : ${eleve.niveau.sport}<br>
       Langues : ${eleve.niveau.langues}</p>
    <p><strong>Qualités :</strong> ${qualites}</p>
    <p><strong>Défauts :</strong> ${defauts}</p>
    <button id="btn-deselection">Désélectionner</button>
  `;

  document.getElementById("btn-deselection").addEventListener("click", () => {
    eleveSelectionne = null;
    zone.innerHTML = `<p><em>Survole ou clique sur un élève pour voir ses infos ici.</em></p>`;
  });
}

//############################################################################

function genererGrilleDansCercle(nbLignes = 8, nbColonnes = 8) {
  const tailleCase = 40;
  const rayon = (Math.min(nbLignes, nbColonnes) * tailleCase) / 2;
  const centre = {
    x: (nbColonnes * tailleCase) / 2,
    y: (nbLignes * tailleCase) / 2
  };

  const container = document.getElementById("sac-eleves");
  container.innerHTML = "";

  for (let y = 0; y < nbLignes; y++) {
    for (let x = 0; x < nbColonnes; x++) {
      const posX = x * tailleCase;
      const posY = y * tailleCase;

      const distance = Math.sqrt(
        Math.pow(posX + tailleCase / 2 - centre.x, 2) +
        Math.pow(posY + tailleCase / 2 - centre.y, 2)
      );

      const caseDiv = document.createElement("div");
      caseDiv.className = "cell-cercle";

      if (distance <= rayon) {
        const eleve = initEleves();

        const eleveDiv = document.createElement("div");
        eleveDiv.className = "eleve-rond";
        eleveDiv.style.backgroundColor = eleve.couleur;
        eleveDiv.textContent = eleve.prenom[0].toUpperCase();

        // Hover/click
        eleveDiv.addEventListener("mouseenter", () => {
          if (!eleveSelectionne) {
            afficherInfosEleve(eleve);
          }
        });
        
        eleveDiv.addEventListener("mouseleave", () => {
          if (!eleveSelectionne) {
            document.getElementById("info-eleve").innerHTML =
            `<p><em>Survole ou clique sur un élève pour voir ses infos ici.</em></p>`;
          }
        });

        eleveDiv.addEventListener("click", () => {
          eleveSelectionne = eleve;
          afficherInfosEleve(eleve);

        });

        caseDiv.appendChild(eleveDiv);
      }

      container.appendChild(caseDiv);
    }
  }
}

//############################################################################

function afficherGrilleCercle(nbLignes = 10, nbColonnes = 10) {
  const tailleCase = 40;
  const rayon = (Math.min(nbLignes, nbColonnes) * tailleCase) / 2;
  const centre = {
    x: (nbColonnes * tailleCase) / 2,
    y: (nbLignes * tailleCase) / 2
  };

  const container = document.getElementById("sac-eleves");
  container.innerHTML = "";
  container.style.position = "relative";
  container.style.width = nbColonnes * tailleCase + "px";
  container.style.height = nbLignes * tailleCase + "px";

  for (let y = 0; y < nbLignes; y++) {
    for (let x = 0; x < nbColonnes; x++) {
      const posX = x * tailleCase;
      const posY = y * tailleCase;

      const distance = Math.sqrt(
        Math.pow(posX + tailleCase / 2 - centre.x, 2) +
        Math.pow(posY + tailleCase / 2 - centre.y, 2)
      );

      if (distance <= rayon) {
        const caseDiv = document.createElement("div");
        caseDiv.className = "cell-cercle";
        caseDiv.style.width = tailleCase + "px";
        caseDiv.style.height = tailleCase + "px";
        caseDiv.style.position = "absolute";
        caseDiv.style.left = posX + "px";
        caseDiv.style.top = posY + "px";

        container.appendChild(caseDiv);
      }
    }
  }
}

function afficherElevesDansGrilleCercle(nbLignes = 10, nbColonnes = 10) {
  const tailleCase = 40;
  const rayon = (Math.min(nbLignes, nbColonnes) * tailleCase) / 2;
  const centre = {
    x: (nbColonnes * tailleCase) / 2,
    y: (nbLignes * tailleCase) / 2
  };

  const container = document.getElementById("sac-eleves");
  container.innerHTML = ""; // Vide la zone

  for(let y=0; y < nbLignes; y++) {
    for(let x=0; x < nbColonnes; x++) {
      const posX = x * tailleCase;
      const posY = y * tailleCase;
      const distance = Math.sqrt(
        Math.pow(posX + tailleCase/2 - centre.x, 2) +
        Math.pow(posY + tailleCase/2 - centre.y, 2)
      );

      /*console.log("Ajout d'un élève à ", x, y);*/

      const caseDiv = document.createElement("div");
      caseDiv.className = "cell-cercle";
      caseDiv.style.position = 'absolute';
      caseDiv.style.width = tailleCase + "px";
      caseDiv.style.height = tailleCase + "px";
      caseDiv.style.left = posX + "px";
      caseDiv.style.top = posY + "px";

      if(distance <= rayon) {
        const eleve = genererEleve();

        const eleveDiv = document.createElement("div");
        eleveDiv.className = "eleve-rond";
        eleveDiv.style.backgroundColor = eleve.couleur;
        eleveDiv.textContent = eleve.prenom[0].toUpperCase();

        // Hover + click pour infos
        eleveDiv.addEventListener("mouseenter", () => {
  if (!eleveSelectionne) {
    afficherInfosEleve(eleve);
  }
});

eleveDiv.addEventListener("mouseleave", () => {
  if (!eleveSelectionne) {
    document.getElementById("info-eleve").innerHTML =
      `<p><em>Survole ou clique sur un élève pour voir ses infos ici.</em></p>`;
  }
});

eleveDiv.addEventListener("click", () => {
  eleveSelectionne = eleve;
  afficherInfosEleve(eleve);
});

        caseDiv.appendChild(eleveDiv);
      } else {
        caseDiv.style.display = 'none';
      }

      container.appendChild(caseDiv);
    }
  }
}

function reinitialiserInfosEleve() {
  eleveSelectionne = null;
  document.getElementById("info-eleve").innerHTML =
    `<p><em>Survole ou clique sur un élève pour voir ses infos ici.</em></p>`;
}

// Récupérer la liste des élèves du localStorage (le post-it)
function recupererEleves() {
  const elevesString = localStorage.getItem("eleves");
  if (elevesString) {
    return JSON.parse(elevesString); // Transforme la chaîne en tableau d'objets élèves
  }
  return null; // Rien trouvé
}

// Générer la liste des élèves ET la stocker dans localStorage
function genererEtStockerEleves() {
  const eleves = [];
  for (let i = 0; i < 20; i++) {  // Par exemple 20 élèves
    eleves.push(genererEleve()); // Ta fonction qui crée un élève
  }
  localStorage.setItem("eleves", JSON.stringify(eleves)); // Sauvegarde au format texte
  return eleves;
}

// Fonction d'initialisation à appeler au démarrage
function initEleves() {
  let eleves = recupererEleves(); // Essaie de prendre la liste stockée
  if (!eleves) { // Si elle n'existe pas
    eleves = genererEtStockerEleves(); // Génère et stocke
  }
  return eleves; // Retourne la liste pour l’utiliser
}
