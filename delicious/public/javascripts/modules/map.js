import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
    center: { lat: 43.2, lng : -79.8 }, 
    zoom: 8
}

function loadPlaces(map, lat = 43.2, lng = -79.8) {
    axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
        .then(res => {
            const places = res.data;
            console.log(places);
            if (!places.length) {
                alert('No places found!');
                return;
            }

            //create a bounds
            const bounds = new google.maps.LatLngBounds();
            //bounds are extending for every marker

            //marker pins for locations
            const markers = places.map(place => {
                //array destructing and using array in res.data and create variables
                const [placeLng, placeLat] = place.location.coordinates;
                const position = {lat: placeLat, lng: placeLng};
                bounds.extend(position);
                //used to zoom in or out within a certain distance from all the markers
                const marker = new google.maps.Marker({ map, position });
                marker.place = place;

                //when marker is clicked place data is referenced with place variable
                return marker;
                //each marker has place object 
            });

            //then zoom the map to fit all the markers perfectly
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        });
}

function makeMap(mapDiv) {
    if(!mapDiv) return;
    //make our map and store in variable to refer

    const map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map);

    const input = $('[name="geolocate"]');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
    //place changed from add page
    const place = autocomplete.getPlace();
    console.log(place);
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());

    });
}

export default makeMap;