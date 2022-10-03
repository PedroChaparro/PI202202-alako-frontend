// dark and light
const icon = document.getElementById('icon');
// requesting videos
const formulario = document.getElementById('formulario');

// dark and light
icon.onclick = function () {
	document.body.classList.toggle('theme-dark');
	if (document.body.classList.contains('theme-dark')) {
		icon.src = '/icons/sun-icon.svg';
	} else {
		icon.src = '/icons/moon-icon.svg';
	}
};

// requesting videos
formulario.addEventListener('submit', async (e) => {
	e.preventDefault();
	const response = await fetch(
		''
	);
	if (response.ok) {
		const data = await response.json();
		const videos = data.response;
		const template = document.querySelector('template');
		// todo: definir dónde se inserta
		const section = document.getElementById('articles-container');

		videos.forEach((element) => {

			const tags = element.tags.split(', ', 3);
			const templateClone = template.content.cloneNode(true);
			const templateCloneTitle = templateClone.getElementById('title');

			templateCloneTitle.textContent = element.title;
			templateCloneTitle.setAttribute('href', element.url);
			templateClone.getElementById('url').setAttribute('href', element.url);
			templateClone.querySelector('img').setAttribute('src', element.thumbnail);

			const assignTags = templateClone.getElementById('tags').querySelectorAll('p');
			for (let ii = 0; ii < 3; ii++) {
				assignTags[ii].textContent = tags[ii];
			}

			section.appendChild(templateClone);
		});
	} else {
		console.log('Nothing');
	}
});

