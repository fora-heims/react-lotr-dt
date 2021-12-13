import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';

import CharacterList from './components/Characters/CharacterList';
import FilmList from './components/Films/FilmList';

function App() {
  const [films, setFilms] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    getFilms();
    getCharacters();
  }, []);

  const getFilms = async () => {
    const resp = await fetch('https://the-one-api.dev/v2/movie/', {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      },
    });
    const data = await resp.json();
    const fil = data.docs;
    const filmData = fil.map((f) => {
      return [
        f.name,
        // FIX ME: the line below requires attention. one of the images is not shoeing up due to an excessive '-' at the end of a title
        // NOTE: make sure you look at the response from the server - it may not be consistent
        f.name.toLowerCase().replace(/\s+/g, '-'),
        f.boxOfficeRevenueInMillions,
        f.academyAwardNominations,
      ];
    });
    setFilms(filmData);
  };

  const getCharacters = async () => {
    const resp = await fetch('https://the-one-api.dev/v2/character/', {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      },
    });
    const data = await resp.json();
    const char = data.docs;
    const charData = char.map((c) => {
      if (c.birth !== '' && c.death !== '') {
        return { ...c, dates: `${c.birth} - ${c.death}` };
      } else {
        return { ...c, dates: `Unknown` };
      }
    });
    setCharacters(charData);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavLink to="/films" data-testid="film-link">
            Films
          </NavLink>
          <NavLink to="/characters" data-testid="char-link">
            Characters
          </NavLink>
        </header>
        <Switch>
          <Route path="/films">
            <FilmList films={films} />
          </Route>
          <Route path="/characters">
            <CharacterList characters={characters} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
