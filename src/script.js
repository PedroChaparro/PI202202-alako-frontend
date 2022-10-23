import SearchHistory from "./storage.js";

const icon = document.getElementById('icon');
const formulario = document.getElementById('formulario');
const search = document.getElementById('search-icon');
const videoTemplate = document.getElementById('video-template');

// initializing var of intervalID for future work
let intervalID = -1;

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
formulario.addEventListener('submit', searchingVideos);
// event to request videos after click icon-search
search.addEventListener('click', searchingVideos);

loading();

async function searchingVideos(e) {
	e.preventDefault();
	loading();

	// Remove previous intervals
	if (intervalID !== -1) window.clearInterval(intervalID);

	const formEntries = Object.fromEntries(new FormData(formulario));
	const searchTerm = formEntries["search-criteria"];

	//requesting key of search
	const responseKey = await fetch('http://localhost:9090/search', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(formEntries),
	});

	//dataKey will be sended in the body of next request
	const dataKey = await responseKey.json();

	//requesting videos
	intervalID = setInterval(async () => {
		const responseVid = await fetch('http://localhost:9090/result/obtain', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key: dataKey.uuid }),
		});

		const data = await responseVid.json();

		//if 200 setInterval render videos of the res
		if (responseVid.status == 200) {
			const videos = data.response;
			window.clearInterval(intervalID);

			if (Object.keys(videos).length > 0) {
				//section is the container of cards
				const section = document.getElementById('articles-container');
				const cards = section.querySelectorAll('.video-placeholder');

				//removing predetermined empty (6 cards)
				cards.forEach((card) => card.remove());

				//generating cards from the data from the response
				videos.forEach((element) => {
					// Get ffirst non-empty tags
					let tags = element.tags.split(', ');
					tags = tags.filter((tag) => tag !== '');
					tags = tags.slice(0, 3);

					// Create tags  html structure
					let auxTags = '';

					//this helps when tags are empty or less than 3
					tags.forEach((element) => {
						auxTags += `<p class="video-tag">${element}</p>`;
					});

					const newVideo = section.appendChild(createCard(element, auxTags));

					// click listener
					const ancles = newVideo.getElementsByTagName("a");
					for (const a of ancles){
						a.addEventListener("click", ()=>{
							SearchHistory.saveEntry(searchTerm);
						});
					}
				});
			}
		}
	}, 3000);
}

//generating predetermined 6 empty cards
function loading() {
	const section = document.getElementById('articles-container');
	const cards = section.querySelectorAll('.video-placeholder');
	const cards_videos = section.querySelectorAll('.video');

	cards.forEach((card) => {
		card.remove();
	});
	cards_videos.forEach((card) => {
		card.remove();
	});

	for (let ii = 0; ii < 6; ii++) {
		section.innerHTML += `
				<article class="video-placeholder">
					<div class="video-placeholder__image"></div>
					<div class="video-placeholder__title"></div>
					<div class="video-placeholder__tags">
						<div class="video-placeholder__tag"></div>
						<div class="video-placeholder__tag"></div>
						<div class="video-placeholder__tag"></div>
					</div>
				</article>
			`;
	}
}

function createCard(video, tags) {
	let newv = videoTemplate.content.firstElementChild.cloneNode(true);
	newv.querySelector(".url").href      = video.url;
	newv.querySelector(".img-video").src = video.thumbnail;
	newv.querySelector(".img-video").alt = video.title;
	newv.querySelector(".title").href    = video.url;
	newv.querySelector(".title").textContent    = video.title;
	newv.querySelector(".video-tags").innerHTML = tags;
	return newv;
}
