import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

document.addEventListener('DOMContentLoaded', async () => {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const errorElement = document.querySelector('.error');
  const catInfo = document.querySelector('.cat-info');

  errorElement.style.display = 'none';
  loader.style.display = 'block';
  breedSelect.style.display = 'none';
  catInfo.style.display = 'none';

  try {
    const breeds = await fetchBreeds();
    populateBreedSelect(breeds);
    breedSelect.style.display = 'block';

    // Selectează automat prima rasă din listă
    if (breeds.length > 0) {
      const firstBreedId = breeds[0].id;
      breedSelect.value = firstBreedId;
      loadCatInfo(firstBreedId);
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
    errorElement.style.display = 'block';
  } finally {
    loader.style.display = 'none';
  }

  breedSelect.addEventListener('change', async event => {
    const breedId = event.target.value;

    if (!breedId) return;

    loadCatInfo(breedId);
  });
});

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

function populateBreedSelect(breeds) {
  const breedSelect = document.querySelector('.breed-select');
  const options = breeds
    .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
    .join('');
  breedSelect.innerHTML = options;
  new SlimSelect({ select: '.breed-select' });
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
