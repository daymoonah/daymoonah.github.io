fetch('recette.json')
  .then(response => response.json())
  .then(data => {
    const recettes = data.recette;
    const liste = document.getElementById('liste-recettes');

    recettes.forEach(recette => {
      const item = document.createElement('div');
      item.textContent = recette.titre;
      item.classList.add('recette-item');

      // Clique sur une recette pour l’afficher (fonction à faire)
      item.addEventListener('click', () => {
        afficherRecette(recette);
      });

      liste.appendChild(item);
    });
  })
  .catch(error => {
    console.error("Erreur lors du chargement du JSON :", error);
  });

  function afficherRecette(recette) {
  const tableau = document.getElementById('tableau');
  tableau.innerHTML = `
    <h2>${recette.titre}</h2>
    <h3>Ingrédients</h3>
    <ul>
      ${recette.ingredients.map(i => `<li>${i}</li>`).join('') || '<li>À remplir</li>'}
    </ul>
    <h3>Étapes</h3>
    <p>${recette.etapes || 'À venir...'}</p>
  `;

  // Pareil pour ton cahier si tu veux afficher "à_acheter"
  const cahier = document.getElementById('cahier');
  if (cahier) {
    cahier.innerHTML = `
      <h3>À acheter</h3>
      <ul>
        ${recette.a_acheter.map(i => `<li>${i}</li>`).join('') || '<li>À compléter</li>'}
      </ul>
    `;
  }
}