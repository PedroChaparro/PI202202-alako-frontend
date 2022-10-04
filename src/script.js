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
	const responseKey = await fetch('http://localhost:9090/search', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.fromEntries(new FormData(formulario))),
	});
	const dataKey = await responseKey.json();

	let intervalID = setInterval(async () => {
		const res = await fetch('http://localhost:9090/result/obtain', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key: dataKey.uuid }),
		});
		let data = await res;

		if (res.status == 200) {
			clearInterval(intervalID);
			data = await data.json();
			console.log('object', data.response);
			let section = '';

			const videos = data.response;
			const template = document.getElementById('template-2');
			section = document.getElementById('articles-container');
			const cards = section.querySelectorAll('.video-placeholder');
			cards.forEach((card) => card.remove());
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
			loading();
		}
	}, 2000);

});
loading();

function loading() {
	const section = document.getElementById('articles-container');
	const templateOne = document.querySelector('template');
	for (let ii = 0; ii < 6; ii++) {
		const templateCloneOne = templateOne.content.cloneNode(true);
		section.appendChild(templateCloneOne);
	}
}

/* function startTimer(data, dataKey) {
	let data2;
	const video = setInterval(async function () {
		await fetch('http://localhost:9090/result/obtain', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key: dataKey.uuid }),
		})
			.then(function (response) {
				data = response;
				data2 = response.json();
				console.log(data2, 'sss');
				if (response.status == 200) {
					clearInterval(video);
				}
				return data2;
			})
			.then(function (data) {
				console.log('function', data);
				return data;
			});
	}, 5000);
	return data;
} */
