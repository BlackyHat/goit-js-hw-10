import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries.js';

class Country {
  constructor({ input, elCountriesList, elInfoCountryCard, DEBOUNCE_DELAY }) {
    this.input = input;
    this.elCountriesList = elCountriesList;
    this.elInfoCountryCard = elInfoCountryCard;
    this.DEBOUNCE_DELAY = DEBOUNCE_DELAY;
  }

  markupCountriesList(countries) {
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

  markupCountryInfo(countries) {
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

    this.elCountriesList.innerHTML = '';
    this.elInfoCountryCard.innerHTML = markup;
  }

  getError() {
    this.clearFindedList.bind(this)();
    return Notify.failure('Oops, there is no country with that name');
  }

  checkAnswerArrLength(arr) {
    this.clearFindedList.bind(this)();

    if (arr.length) {
      if (arr.length <= 10 && arr.length >= 2) {
        return this.markupCountriesList.bind(this)(arr);
      }

      if (arr.length > 10) {
        this.clearFindedList.bind(this)();
        return Notify.info(
          'Too many matches found. Please enter more specific name.'
        );
      }
      return this.markupCountryInfo.bind(this)(arr);
    }
    return error;
  }

  clearFindedList() {
    this.elCountriesList.innerHTML = '';
    this.elInfoCountryCard.innerHTML = '';
  }

  find(e) {
    const inutvalue = e.target.value.trim();
    if (inutvalue) {
      fetchCountries(inutvalue)
        .then(this.checkAnswerArrLength.bind(this))
        .catch(this.getError.bind(this));
    }
  }
  addListeners() {
    this.input.addEventListener(
      'input',
      debounce(this.find.bind(this), this.DEBOUNCE_DELAY)
    );
  }

  init() {
    this.addListeners();
  }
}

const refs = {
  input: document.querySelector('#search-box'),
  elCountriesList: document.querySelector('.country-list'),
  elInfoCountryCard: document.querySelector('.country-info'),
  DEBOUNCE_DELAY: 300,
};

new Country(refs).init();
