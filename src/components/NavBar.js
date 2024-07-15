import React, { useEffect, useRef } from "react";
import { useState } from "react";
function Logo() {
  return (
    <div className="logo">
      <span role="img">🎬</span>
      <h1>MovieExplorer</h1>
    </div>
  );
}
function InputBox({ query, setQuery }) {
  const inputElement = useRef(null);
  useEffect(function () {
    inputElement.current.focus();
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}
function Result({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

export default function NavBar({ movies, query, setQuery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <InputBox query={query} setQuery={setQuery} />
      <Result movies={movies} />
    </nav>
  );
}
