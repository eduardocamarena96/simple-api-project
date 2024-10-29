const animeSearchForm = document.getElementById("anime-search-form");
const searchInput = document.getElementById("search-input");

const animeId = 1; // just setting a default id -> refers to cowboy bebop

animeSearchForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const name = searchInput.value;

  const animeId = getAnimeId(name);

  fetchAnimeData(animeId).then((data) => {
    addAnimeInfo(data.data);
  });
}

function getAnimeId(name) {
  if (hashmap[name.toLowerCase()]) return hashmap[name.toLowerCase()];

  return 0;
}

// functions to create and add elements to dom

function addAnimeInfo(animeInfo) {
  if (document.getElementById("anime-info-container")) {
    document.getElementById("anime-info-container").remove();
  }

  if (document.getElementById("characters-list-container")) {
    document.getElementById("characters-list-container").remove();
  }

  const animeInfoContainer = document.createElement("div");
  animeInfoContainer.setAttribute("id", "anime-info-container");

  const animeTitle = document.createElement("h1");
  animeTitle.innerText = animeInfo.title;

  const synopsisTitle = document.createElement("h1");
  synopsisTitle.innerText = "Synopsis: ";

  const synopsis = document.createElement("p");
  synopsis.innerText = animeInfo.synopsis;

  const image = document.createElement("img");
  image.src = animeInfo.images.jpg.image_url;

  animeInfoContainer.appendChild(animeTitle);
  animeInfoContainer.appendChild(image);
  animeInfoContainer.appendChild(synopsisTitle);
  animeInfoContainer.appendChild(synopsis);

  document.body.appendChild(animeInfoContainer);

  getCharactersData(animeInfo.mal_id).then((data) => {
    addCharactersData(data.data);
  });
}

function addCharactersData(charactersInfo) {
  const charactersListContainer = document.createElement("div");
  charactersListContainer.setAttribute("id", "characters-list-container");

  const charactersListTitle = document.createElement("h1");
  charactersListTitle.innerText = "List of Characters:";

  const charactersList = document.createElement("div");
  charactersList.classList.add("characters-list");

  const characterElementsArray = charactersInfo.slice(0, 10).map((element) => {
    const characterElement = document.createElement("div");

    const characterText = document.createElement("h1");
    characterText.classList.add("character-txt");
    characterText.innerText = element.character.name;

    const characterImage = document.createElement("img");
    characterImage.classList.add("character-img");
    characterImage.src = element.character.images.jpg.image_url;

    characterElement.appendChild(characterText);
    characterElement.appendChild(characterImage);

    return characterElement;
  });

  characterElementsArray.forEach((element) => {
    charactersList.appendChild(element);
  });

  charactersListContainer.appendChild(charactersListTitle);
  charactersListContainer.appendChild(charactersList);

  document.body.appendChild(charactersListContainer);
}

// Async functions to get data

async function fetchAnimeData(id) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function getCharactersData(animeId) {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${animeId}/characters`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
