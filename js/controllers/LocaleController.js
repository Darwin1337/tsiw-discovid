import Localidade from "../models/LocalidadesModel.js"

export default class LocaleController {
  constructor() {
    this.localidades = localStorage.localidades ? JSON.parse(localStorage.localidades) : [];
  }

  GetAllLocales() {
    return this.localidades;
  }

  GetNameById(id) {
    return this.localidades.find(localidade => localidade.id == id);
  }

  SearchLocaleByName(nome) {
    return this.localidades.find(localidade => localidade.nome.toLowerCase() === nome.toLowerCase());
  }

  GetLatAndLongFromGoogleAddress(geocoder, address) {
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === 'OK') {
        return results[0].geometry.location;
      } else {
        throw Error("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  GetGoogleAddresFromLatAndLong(geocoder, lat, long) {
    const latlng = {
      lat: parseFloat(lat),
      lng: parseFloat(long),
    };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          map.setZoom(11);
          const marker = new google.maps.Marker({
            position: latlng,
            map: map,
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    });
  }
}
