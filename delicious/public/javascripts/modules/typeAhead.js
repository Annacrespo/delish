const axios = require('axios');

function typeAhead(search) {
    if (!search) return; //if no search is on the page do not run the function
    //need input and results
    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.on('input', function(){
        if(!this.value) {
            //if no value hide the search results
            searchResults.style.display = 'none';
            return;
        }
    //show the search results!
    searchResults.style.display = 'block';    
    
    //use axios to get endpoint
        console.log(this.value);
    axios
        .get(`/api/search?q=${this.value}`)
        .then(res => {
            console.log("hiii");
        
        });
    });
};

export default typeAhead;