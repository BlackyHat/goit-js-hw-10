export function fetchCountries(country) {
  return fetch(
    `https://restcountries.com/v3.1/name/${country}?fields=name,capital,population,languages,flags`
  ).then(responce => {
    return responce.json();
  });
}
