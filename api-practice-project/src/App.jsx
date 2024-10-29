import { useState, useEffect } from "react";
import hashmap from "./name-to-id.json";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const [animeInfo, setAnimeInfo] = useState(null);
  const [animeId, setAnimeId] = useState(1);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchAnimeData(id) {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

        await delay(1000);

        const data = await response.json();

        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAnimeData(animeId).then((data) => setAnimeInfo(data));
  }, [animeId]);

  function getAnimeId(name) {
    if (hashmap[name.toLowerCase()]) return hashmap[name.toLowerCase()];

    return 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const id = getAnimeId(input);
    setAnimeId(id);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        Enter Anime Title to Search:{" "}
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <input type="submit" />
      </form>
      {animeInfo ? <Anime anime={animeInfo.data} /> : <div>Loading...</div>}
    </div>
  );
}

function Anime({ anime }) {
  const [isFavorite, setIsFavorite] = useState(false);

  function handleFavorite() {
    setIsFavorite((prev) => !prev);
  }

  if (!anime) return <div>Not Found</div>;

  return (
    <div>
      <div className="title-icon-container">
        <h1>{anime.title}</h1>
        {isFavorite ? (
          <StarFilled handleFavorite={handleFavorite} />
        ) : (
          <StarRegular handleFavorite={handleFavorite} />
        )}
      </div>

      <img src={anime.images.jpg.image_url} />
      <h1>Synopsis:</h1>
      <p>{anime.synopsis}</p>
      <ListOfCharacters animeID={anime.mal_id} />
    </div>
  );
}

function ListOfCharacters({ animeID }) {
  const [charactersList, setCharactersList] = useState(null);

  useEffect(() => {
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

    getCharactersData(animeID).then((data) => {
      setCharactersList(data.data);
    });
  }, [animeID]);

  return (
    <div>
      <h1>List of Characters:</h1>
      <div className="characters-list">
        {charactersList &&
          charactersList
            .slice(0, 10)
            .map((element) => (
              <Character
                key={element.character.name}
                character={{
                  name: element.character.name,
                  image: element.character.images.jpg.image_url,
                }}
              />
            ))}
      </div>
    </div>
  );
}

function Character({ character }) {
  return (
    <div>
      <h1 className="character-txt">{character.name}</h1>
      <img className="character-img" src={character.image} />
    </div>
  );
}

function StarFilled({ handleFavorite }) {
  return (
    <svg
      className="star-icon"
      onClick={handleFavorite}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
    >
      <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
    </svg>
  );
}

function StarRegular({ handleFavorite }) {
  return (
    <svg
      className="star-icon"
      onClick={handleFavorite}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
    >
      <path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z" />
    </svg>
  );
}