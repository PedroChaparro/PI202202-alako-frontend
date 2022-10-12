// dark and light
const icon = document.getElementById('icon');
// requesting videos
const formulario = document.getElementById('formulario');
// initializing var of intervalID for future work
let intervalID;

// dark and light
icon.onclick = function () {
	document.body.classList.toggle('theme-dark');
	if (document.body.classList.contains('theme-dark')) {
		icon.src = '/icons/sun-icon.svg';
	} else {
		icon.src = '/icons/moon-icon.svg';
	}
};

// event to request videos after press enter
formulario.addEventListener('submit', async (e) => {
	e.preventDefault();

	//requesting key of search
	const responseKey = await fetch('http://localhost:9090/search', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.fromEntries(new FormData(formulario))),
	});

	//dataKey will be sended in the body of next request
	const dataKey = await responseKey.json();

	//requesting videos
	intervalID = setInterval(async () => {
		const resposeVid = await fetch('http://localhost:9090/result/obtain', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key: dataKey.uuid }),
		});
		let section = '';
		let data = await resposeVid;

		//if 200 setInterval calls must stop
		if (resposeVid.status == 200) {
			clearInterval(intervalID);
			data = await data.json();
			const videos = data.response;

			//if there is some video in the response
			if (Object.keys(videos).length > 0) {
				const template = document.getElementById('template-2');
				//section is the container of templates and future clones
				section = document.getElementById('articles-container');
				const cards = section.querySelectorAll('.video-placeholder');

				//removing predetermined empty template (6 cards)
				cards.forEach((card) => card.remove());

				//generating cards from template with the data from the response
				videos.forEach((element) => {
					const tags = element.tags.split(', ', 3);
					const templateClone = template.content.cloneNode(true);
					const templateCloneTitle = templateClone.querySelector('.title');

					templateCloneTitle.textContent = element.title; //title
					templateClone.querySelector('.url');
					templateCloneTitle.setAttribute('href', element.url); //urlvideo in title
					templateClone.querySelector('.url').setAttribute('href', element.url); //url in img
					templateClone.querySelector('img').setAttribute('src', element.thumbnail); //thumbnail

					const assignTags = templateClone
						.querySelector('.video-tags')
						.querySelectorAll('p'); //tags

					//just generate 3 tags
					for (let ii = 0; ii < 3; ii++) {
						assignTags[ii].textContent = tags[ii];
					}

					//adding to section the clones
					section.appendChild(templateClone);
				});
			} else {
				loading();
			}
		} else {
			loading();
		}
	}, 3000);
});
loading();

function loading() {
	const section = document.getElementById('articles-container');
	const templateOne = document.querySelector('template');
	const cards = section.querySelectorAll('.video-placeholder');
	const cards_videos = section.querySelectorAll('.video');

	cards.forEach((card) => {
		card.remove();
	});
	cards_videos.forEach((card) => {
		card.remove();
	});

	for (let ii = 0; ii < 6; ii++) {
		const templateCloneOne = templateOne.content.cloneNode(true);
		section.appendChild(templateCloneOne);
	}
}
