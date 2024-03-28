'use strict';

// This app requires a server to handle import statements
// and CORS issues
import * as utils from './utils.js';
import movies from './movies.js';


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Selectors                                            */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const searchInput = utils.select('.movie-search-input');
const matchedMoviesDisplay = utils.select('.matched-movies-wrapper ul');
const findButton = utils.select('.find-button');
const movieContainer = utils.select('.movie-information-container');
const form = utils.select('form'); 

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Search Suggestions                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function searchMovies(searchTerm) {
  const matchingMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchingTitles = matchingMovies.map(movie => movie.title);
  return matchingTitles.length > 5 ? matchingTitles.splice(0, 5) : matchingTitles;
}

function listMovies(input) {
  if (input.length < 3) {
    matchedMoviesDisplay.innerHTML = '';
    return;
  }

  matchedMoviesDisplay.innerHTML = '';
  const occurences = searchMovies(input);

  if (occurences.length > 0) {
    occurences.forEach(occurence => {
      const newLi = document.createElement('li');
      newLi.textContent = occurence;
      copyToInputOnClick(newLi);
      matchedMoviesDisplay.appendChild(newLi);
    })
    
  } else {
    matchedMoviesDisplay.innerHTML = '<li style="cursor: default; user-select: none;">Movie not found</li>';
  }
}

/* When an option is clicked, the text content is copied to the input field */
function copyToInputOnClick(element) {
  utils.listen('click', element, () => {
    searchInput.value = element.textContent;
    matchedMoviesDisplay.innerHTML = ''; // Clear the list
  });
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Get Movie                                            */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
function getMovie() {
  const movieFound = movies.find(movie => movie.title.trim().toLowerCase() === searchInput.value.trim().toLowerCase());

  let genres = '';
  movieFound.genre.forEach(singleGenre => {
    genres += `<span>${singleGenre}</span>`;
  });

  let movieDetailsHTML = `
  <div class="poster-wrapper">
    <figure>
      <img src="${movieFound.poster}" alt="${movieFound.title}">
    </figure>
  </div>
  <div class="information-container">
    <div class="information">
      <h2>${movieFound.title}</h2>
      <p class="release-duration">
        <span>${movieFound.year}</span> | <span>${movieFound.runningTime}</span>
      </p>
      <p class="description">${movieFound.description}</p>
      <p class="genres flex">
        ${genres}
      </p>
    </div>
  </div>
  `;

  movieContainer.innerHTML = movieDetailsHTML;
  movieContainer.classList.remove('hidden');
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*  Event listeners                                      */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - */
utils.listen('input', searchInput, () => listMovies(searchInput.value));
utils.listen('click', findButton, getMovie);
// prevents form from submitting
utils.listen('submit', form, (event) => {
  event.preventDefault();
});
