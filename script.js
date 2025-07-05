fetch('recette.json')
  .then(response => response.json())
  .then(data => {
    const recettes = data.recette;
    const liste = document.getElementById('liste-recettes');

    recettes
      .sort((a, b) => a.titre.localeCompare(b.titre))
      .forEach(recette => {
        const item = document.createElement('div');
        item.textContent = recette.titre;
        item.classList.add('recette-item');

        item.addEventListener('click', () => {
          afficherRecette(recette);
        });

        liste.appendChild(item);
      });
  })
  .catch(error => {
    console.error("Erreur lors du chargement du JSON :", error);
  });

// 🟢 Fonction déplacée ici, hors du fetch
function afficherRecette(recette) {
  const takleau = document.getElementById('takleau');
  takleau.innerHTML = `
    <h2>${recette.titre}</h2>
    <h3>Ingrédients</h3>
    <ul>
      ${recette.ingredients?.map(i => `<li>${i}</li>`).join('') || '<li>À remplir</li>'}
    </ul>
    <h3>Étapes</h3>
    <p>${recette.etapes || 'À venir...'}</p>
  `;

  const moncontenu = document.getElementById('moncontenu');
  if (moncontenu) {
    moncontenu.innerHTML = `
      <h3>À acheter</h3>
      <ul>
        ${recette.a_acheter?.map(i => `<li>${i}</li>`).join('') || '<li>À compléter</li>'}
      </ul>
    `;
  }
}