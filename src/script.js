// dark and light
const icon = document.getElementById('icon');
// selecting form
const formulario = document.getElementById('formulario');
// selectin icon-search
const search = document.getElementById('search-icon');
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
formulario.addEventListener('submit', searchingVideos );
// event to request videos after click icon-search
search.addEventListener('submit', searchingVideos );

loading();

async function searchingVideos (e) {
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
				//section is the container of cards
				section = document.getElementById('articles-container');
				const cards = section.querySelectorAll('.video-placeholder');

				//removing predetermined empty (6 cards)
				cards.forEach((card) => card.remove());

				//generating cards from the data from the response
				videos.forEach((element) => {
					let tags = element.tags.split(', ', 3);
					let auxTags = '';

					//this helps when tags are empty or less than 3
					tags.forEach(element => {
						auxTags += `<p class="video-tag">${element}</p>`;
					});

					section.innerHTML +=
						`
						<article class="video template-2">
							<a
								href="${element.url}"
								target="_blank"
								referrerpolicy="no-referrer"
								class="url"
							>
								<div class="video-image">
									<!-- Video image -->
									<div class="video-image-container">
										<img class="img-video" src="${element.thumbnail}" alt="" />
										<!-- Play button container -->
										<div class="video-play">
											<img src="icons/play-icon.svg" alt="" />
										</div>
									</div></div
							></a>

							<h2 class="video-title">
								<a
									href="${element.url}"
									target="_blank"
									referrerpolicy="no-referrer"
									class="title"
									>${element.title}</a
								>
							</h2>

							<div class="video-tags">
								${auxTags}
							</div>
						</article>
						`;
				});
			} else {
				loading();
			}
		} else {
			loading();
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
		section.innerHTML +=
			`
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
