import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  elCountriesList: document.querySelector('.country-list'),
  elInfoCountryCard: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(find, DEBOUNCE_DELAY));

function find(e) {
  const inutvalue = e.target.value.trim();
  if (inutvalue) {
    fetchCountries(inutvalue).then(checkAnswerArrLength).catch(getError);
  }
}

function getError() {
  refs.elCountriesList.innerHTML = '';
  refs.elInfoCountryCard.innerHTML = '';
  return Notify.failure('Oops, there is no country with that name');
}

function checkAnswerArrLength(arr) {
  if (arr.length) {
    if (arr.length <= 10 && arr.length >= 2) {
      return markupCountriesList(arr);
    }
    if (arr.length > 10) {
      return Notify.info(
        'Too many matches found. Please enter more specific name.'
      );
    }
    return markupCountryInfo(arr);
  }
  return error;
}

function markupCountryInfo(countries) {
  const countryLangValues = countries.map(el =>
    Object.values(el.languages).join(', ')
  );

  const markup = countries.map(
    el => `<div class='country__info'>
  <div class='country__info-wrap'>
    <img
      class='country__info-flag'
      src='${el.flags.svg}'
      alt='${el.name.official}'
    />
    <h2 class='country__info-title'>${el.name.official}</h2>
  </div>
  <p class='country__info-meta'><span class='country__info-label'>Capital:
    </span>${el.capital}</p>
  <p class='country__info-meta'><span class='country__info-label'>Population:
    </span>${el.population}</p>
  <p class='country__info-meta'><span class='country__info-label'>Languages:
     </span> ${countryLangValues}
    </p>
</div>`
  );

  refs.elCountriesList.innerHTML = '';
  refs.elInfoCountryCard.innerHTML = markup;
}

function markupCountriesList(countries) {
  const markup = countries
    .map(
      el => `<li class='country-list__item'>
      <img
        class='country__flag'
        src='${el.flags.svg}'
        alt='${el.name.official}'
      />
      <p class='country__label'>${el.name.common}</p>
    </li>
        `
    )
    .join('');
  refs.elInfoCountryCard.innerHTML = '';
  refs.elCountriesList.innerHTML = markup;
}
