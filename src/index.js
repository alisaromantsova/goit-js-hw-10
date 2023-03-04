import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const body = document.querySelector('body');
const input = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

body.style.background = '#B5CEFF';
body.style.width = '500px';
body.style.margin = 'auto';
body.style.display = 'flex';
body.style.flexDirection = 'column';
input.style.marginTop = '20px';
input.style.alignSelf = 'center';
ul.style.margin = 0;
ul.style.padding = 0;

let value = '';
let markup = '';
const onInput = e => {
  value = e.target.value.trim();
  if (value === '') {
    return;
  }

  fetchCountries(value)
    .then(result => renderResult(result))
    .catch(error => {
      clearMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};
input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function renderResult(result) {
  if (result.length > 10) {
    clearMarkup();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (result.length >= 2 && result.length <= 10) {
    div.innerHTML = '';
    markup = result
      .map(country => {
        return `<li style="display:flex; text-decoration:none; align-items:center; gap: 10px">
          <img src="${country.flag}" width="20"/>
          <p>${country.name}</p>
        </li>`;
      })
      .join('');

    ul.innerHTML = markup;
  } else if (result.length === 1) {
    clearMarkup();
    markup = result
      .map(country => {
        const lang = country.languages.map(lang => lang.name).join(', ');
        console.log(lang);
        return `<div style="display:flex; align-items:center; gap: 10px"><img src="${country.flag}" width="30"/>
        <h2>${country.name}</h2></div>
          <p><b>Capital:</b> ${country.capital}</p>
          <p><b>Population:</b> ${country.population}</p>
          <p><b>Languages:</b> ${lang}`;
      })
      .join('');

    div.innerHTML = markup;
  }
}
function clearMarkup() {
  div.innerHTML = '';
  ul.innerHTML = '';
}
