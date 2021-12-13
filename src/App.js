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
    const resp = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/films`, {
      headers: {
        apikey: process.env.REACT_APP_SUPABASE_KEY,
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
      },
    });
    const data = await resp.json();
    const filmData = data.map((f) => {
      if (f.title[f.title.length - 1] === ' ') {
        return [
          f.title,
          f.title.toLowerCase().replace(/\s+/g, '-').slice(0, -1),
          f.box_office_totals,
          f.academy_award_nominations,
        ];
      } else {
        return [
          f.title,
          f.title.toLowerCase().replace(/\s+/g, '-'),
          f.box_office_totals,
          f.academy_award_nominations,
        ];
      }
    });
    setFilms(filmData);
  };

  const getCharacters = async () => {
    const resp = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/characters`, {
      headers: {
        apikey: process.env.REACT_APP_SUPABASE_KEY,
        Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
      },
    });
    const data = await resp.json();
    const charData = data.map((c) => {
      if (c.birth !== 'Unknown' && c.death !== 'Unknown') {
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
