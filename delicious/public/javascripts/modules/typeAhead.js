import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores
    .map(store => {
    return `
      <a href="/stores/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `;
  })
    .join('');
}

function typeAhead(search) {
  if (!search) 
    return;
  
  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function () {
    // if there is no value, quit it!
    if (!this.value) {
      searchResults.style.display = 'none';
      return; // stop!
    }

    // show the search results!
    searchResults.style.display = 'block';

    axios
      .get(`/api/v1/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
          return;
        } else {

          // tell them nothing came back use dompurify library to prevent any javascript
          // inside html search results
          searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value}</div>`);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });
  //handle keyboard inputs
  searchInput.on('keyup', (e) => {
    //if they aren't pressing up, down, or enter skip it
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }
    //allows you to use arrow keys to navigate through search results active class
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    //if someone presses down or up which one will be the next one
    let next;
    if (e.keyCode === 40 && current) {
      // if down is pressed and there is a current one selected then the next one will
      // turn into the current one
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      // if down is pressed and there is no current search result is selected the next
      // one will be the first one
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      // if up arrow is pressed and it is at the first search result go to the last
      // search result
      next = current.previousElementSibling || items[items.length - 1]
    } else if (e.keyCode === 38) {
      //if up is pressed the next will be the last one
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      // if enter is selected and there is a current search result take them to that
      // page
      window.location = current.href;
      return;
    }
    //add the active class and deselects
    if (current) {
      current
        .classList
        .remove(activeClass);
    }
    {
      next
        .classList
        .add(activeClass);
    }
  });
}

export default typeAhead;