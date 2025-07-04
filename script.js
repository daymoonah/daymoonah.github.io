const btnkudget = document.getElementById('btnkudget');
const takleau = document.getElementById('takleau');
const prout = "caca";

btnkudget.addEventListener('click', () => {
	takleau.innerHTML = `<p>${prout}</p>`;
});