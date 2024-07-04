import { fetchBreeds, fetchCatByBreed } from './cat-api'; // Importăm funcțiile necesare
import Notiflix from 'notiflix';
import Choices from 'choices.js';

let breeds = [];
let originalBreeds = [];
const breedSelect = document.getElementById('breed-select');
const carousel = document.querySelector('.carousel');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
let choices;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    showLoader();
    originalBreeds = await fetchBreeds();
    breeds = [...originalBreeds]; // Copiem rasele preluate pentru a menține lista originală
    console.log('Breeds fetched:', breeds); // Log de depanare
    createSearchBar();
    populateBreedSelect(breeds);
    await initializeCarousel(breeds); // Inițializăm caruselul și așteptăm să fie complet
    hideLoader();
  } catch (err) {
    hideLoader();
    showError(err.message);
  }
});

function createSearchBar() {
  const searchBar = document.createElement('input');
  searchBar.setAttribute('type', 'text');
  searchBar.setAttribute('id', 'breed-search');
  searchBar.setAttribute('placeholder', 'Caută o rasă...');
  breedSelect.parentNode.insertBefore(searchBar, breedSelect);

  searchBar.addEventListener('focus', () => {
    breedSelect.style.display = 'block'; // Afișează dropdown-ul când câmpul de căutare este focusat
    choices.showDropdown();
  });

  searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredBreeds = originalBreeds.filter(breed =>
      breed.name.toLowerCase().includes(searchTerm)
    );
    choices.clearChoices();
    const filteredOptions = filteredBreeds.map(breed => ({
      value: breed.id,
      label: breed.name,
    }));
    choices.setChoices(filteredOptions, 'value', 'label', true);
    choices.showDropdown(); // Asigură afișarea dropdown-ului după filtrare
  });

  document.addEventListener('click', event => {
    if (
      !breedSelect.parentNode.contains(event.target) &&
      event.target !== searchBar
    ) {
      breedSelect.style.display = 'none'; // Ascunde dropdown-ul când se face clic în afara acestuia
      choices.hideDropdown();
    }
  });

  // Asigură menținerea deschisă a dropdown-ului când se face clic în interiorul câmpului de căutare sau a dropdown-ului
  breedSelect.parentNode.addEventListener('mousedown', event => {
    event.preventDefault();
  });

  breedSelect.addEventListener('change', handleBreedSelect);
}

function populateBreedSelect(breeds) {
  const options = breeds.map(breed => ({
    value: breed.id,
    label: breed.name,
  }));
  choices = new Choices(breedSelect, {
    searchEnabled: false, // Dezactivează căutarea încorporată
    itemSelectText: '',
    shouldSort: false,
    placeholder: true,
    placeholderValue: 'Selectează o rasă...',
  });
  choices.setChoices(options, 'value', 'label', true);
}

function handleBreedSelect(event) {
  const breedId = event.target.value;
  const index = originalBreeds.findIndex(breed => breed.id === breedId);
  console.log('Selected breed index:', index); // Log de depanare
  $('.carousel').slick('slickGoTo', index);
}

async function initializeCarousel(breeds) {
  const breedImages = await Promise.all(
    breeds.map(async breed => {
      try {
        const catData = await fetchCatByBreed(breed.id);
        if (catData) {
          return { ...breed, imageUrl: catData.url };
        } else {
          return { ...breed, imageUrl: null };
        }
      } catch (error) {
        console.error(`Error fetching image for breed ${breed.id}:`, error);
        return { ...breed, imageUrl: null };
      }
    })
  );

  const slides = breedImages
    .map(breed => {
      return `
        <div class="slide" id="slide-${breed.id}">
          <div class="slide-content">
            ${
              breed.imageUrl
                ? `<img src="${breed.imageUrl}" alt="${breed.name}" width="400">`
                : ''
            }
            <h3>${breed.name}</h3>
            <p>${breed.description}</p>
          </div>
        </div>
      `;
    })
    .join('');
  carousel.innerHTML = slides;
  $(carousel).slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    variableWidth: true,
    adaptiveHeight: false, // Asigură că caruselul nu se adaptează la înălțimea slide-urilor
  });
}

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showError(message) {
  error.style.display = 'block';
  Notiflix.Notify.failure(message);
}
