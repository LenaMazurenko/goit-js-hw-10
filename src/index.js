import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import debounce from 'lodash.debounce';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 500;

input.value = '';

function handleInput(e) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  const { value } = e.target;

  if (value.trim() === '') return;
  fetchCountries(value.trim())
    .then(data => {
      if (data.length === 1) {
        renderCountryInfo(data);
        return;
      }
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      if (data.length > 2 || data.length <= 10) {
        renderCountryList(data);
        return;
      }
    })
    .catch(error => {
      Notify.failure(`Oops, there is no country with that name  ${error}`);
    });
}
input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function renderCountryList(data) {
  const markup = data
    .map(element => {
      return `<li class="list-item"><span>${element.flag}</span><span>${element.name.common}</span></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(data) {
  const markup = data
    .map(element => {
      return `<span>${element.flag}</span><span>${element.name.common}</span><p><b>Capital:</b> ${
        element.capital[0]
      }</p><p><b>Population:</b> ${element.population}</p><p><b>Languages:</b> ${Object.values(
        element.languages,
      )}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}
