import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  const searchInput = document.querySelector('#search-input');
  const loader = document.querySelector('.loader');
  const errorElement = document.querySelector('.error');
  const breedList = document.querySelector('#breed-list');
  const catInfo = document.querySelector('.cat-info');

  errorElement.style.display = 'none';
  loader.style.display = 'block';
  breedList.style.display = 'none';
  catInfo.style.display = 'none';

  try {
    const breeds = await loadBreeds();
    breedList.style.display = 'none';

    searchInput.addEventListener('focus', () => {
      breedList.style.display = 'block';
    });

    searchInput.addEventListener('input', event => {
      const searchTerm = event.target.value.toLowerCase();
      filterBreeds(searchTerm, breeds);
    });

    document.addEventListener('click', event => {
      if (
        !searchInput.contains(event.target) &&
        !breedList.contains(event.target)
      ) {
        breedList.style.display = 'none';
      }
    });

    breedList.addEventListener('click', async event => {
      if (event.target.tagName === 'LI') {
        const breedId = event.target.getAttribute('data-breed-id');
        await loadCatInfo(breedId);
        breedList.style.display = 'none';
        searchInput.value = event.target.textContent;
      }
    });
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
    errorElement.style.display = 'block';
  } finally {
    loader.style.display = 'none';
  }
}

async function loadBreeds() {
  const breeds = await fetchBreeds();
  populateBreedList(breeds);
  return breeds;
}

function populateBreedList(breeds) {
  const breedList = document.querySelector('#breed-list');
  breedList.innerHTML = breeds
    .map(breed => `<li data-breed-id="${breed.id}">${breed.name}</li>`)
    .join('');
}

function filterBreeds(searchTerm, breeds) {
  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm)
  );
  populateBreedList(filteredBreeds);
}

async function loadCatInfo(breedId) {
  const loader = document.querySelector('.loader');
  const catInfo = document.querySelector('.cat-info');
  const errorElement = document.querySelector('.error');

  loader.style.display = 'block';
  catInfo.style.display = 'none';
  errorElement.style.display = 'none';

  try {
    const catData = await fetchCatByBreed(breedId);
    displayCatInfo(catData);
    catInfo.style.display = 'block';
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
    errorElement.style.display = 'block';
  } finally {
    loader.style.display = 'none';
  }
}

function displayCatInfo(catData) {
  const catInfo = document.querySelector('.cat-info');
  const breed = catData.breeds[0];

  catInfo.innerHTML = `
    <img src="${catData.url}" alt="${breed.name}" width="400">
    <h2>${breed.name}</h2>
    <p>${breed.description}</p>
    <p><strong>Temperament:</strong> ${breed.temperament}</p>
  `;
}
