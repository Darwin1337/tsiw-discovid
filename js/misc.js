$(".btn-pills").click(function(event) {
  for (let i = 0; i < $(".btn-pills").length; i++) {
    if ($(".btn-pills")[i] != event.target) {
      if ($(".btn-pills")[i].classList.contains("active-tab")) {
        $(".btn-pills")[i].classList.remove("active-tab");
      }
      if (!$(".btn-pills")[i].classList.contains("unactive-tab")) {
        $(".btn-pills")[i].classList.add("unactive-tab");
      }
    }
  }
  event.target.classList.remove("unactive-tab");
  event.target.classList.add("active-tab");

  for (tab of $(".tab-pane")) {
    if (tab.classList.contains("show")) {
      tab.classList.remove("show");
    }
    if (tab.classList.contains("active")) {
      tab.classList.remove("active");
    }
  }
  if (!$($(this).attr("data-bs-target")).hasClass("show")) {
    $($(this).attr("data-bs-target")).addClass("show");
  }
  if (!$($(this).attr("data-bs-target")).hasClass("active")) {
    $($(this).attr("data-bs-target")).addClass("active");
  }
});

function updateRange(a, b) {
  if (a == "currentMinPriceValue") {
    $("#" + a).html("<b>" + parseFloat(b).toFixed(2) + "€" + "</b>");
    $("#preco_max").attr("min", parseFloat(b).toFixed(2));
    let sthg = ((parseFloat(200) + parseFloat(parseFloat(b).toFixed(2))));
    if (String(sthg).indexOf(".") > -1) {
      sthg = parseInt(String(sthg).split(".")[0]);
    }
    $("#preco_max").attr("value", sthg/2);
    $("#preco_max").val(sthg/2);
    $("#maxMinPrice").html(parseFloat(b).toFixed(2) + "€");
    $("#currentMaxPriceValue").html("<b>" + parseFloat(sthg/2).toFixed(2) + "€</b>");
  } else if (a == "currentDistanceValue") {
    $("#" + a).html("<b>" + b + "km" + "</b>");
  } else if (a == "currentMaxPriceValue") {
    $("#" + a).html("<b>" + parseFloat(b).toFixed(2) + "€</b>");
  }
}

if ($("body").attr("id") == "index") {
  var x = document.getElementById("ceder-localizacao");
  //Ir buscar a latitude e longitude do utilizador
  x.addEventListener("click", function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        getLocalityFromLatLong(position.coords.latitude, position.coords.longitude)
      });
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  })
}
const clinicasPequenas=[]
//Criar um mapa e as suas defenições
function initMap() {

  const map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 10,
    center: {lat: 41.1749771, lng: -8.5462703},

  });
  //Invocar a função addMarker para adicionar um ponto ao mapa
  addMarker(map);
}

//Adicionar um marcador ao map
function addMarker(map) {
  for (let i = 0; i < clinicasPequenas.length; i++) {
    const beach = clinicasPequenas[i];
    const marker=new google.maps.Marker({
      position: { lat: beach[0], lng: beach[1]},
      map,
    });
    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
    const contentString=`<div><h5>${beach[3]}</h5></div>`
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
  }
}

//Descobrir a localidade onde o utilizador se encontra
function getLocalityFromLatLong(lat,long){
  $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].types[0] == "administrative_area_level_2") {
          let localidadeBanner=document.querySelector("#localidade-banner")
          localidadeBanner.value=""
          localidadeBanner.value=(data.results[i].address_components[0].long_name)
      }
    }
  });
}

function getLatLongFromAdressAndPin(address,nome){
  $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
    let lng=0
    let lat=0
    for (var i = 0; i < data.results.length; i++) {
      lat=data.results[i].geometry.location.lat
      lng=data.results[i].geometry.location.lng
    }
    clinicasPequenas.push([lat,lng,address,nome])
  });
}

if (document.querySelector("body").id == "sintomas") {
  document.getElementsByClassName("b")[0].addEventListener("click", event => {
    for (sintoma of document.getElementsByClassName("a")) {
      sintoma.disabled = document.getElementsByClassName("b")[0].checked;
    }
  });

  for (sintoma of document.getElementsByClassName("a")) {
    sintoma.addEventListener("click", event => {
      let isAnyChecked = Array.from(document.getElementsByClassName("a")).some(sin => sin.checked == true);
      if (isAnyChecked) {
        document.getElementsByClassName("b")[0].disabled = true;
      } else {
        document.getElementsByClassName("b")[0].disabled = false;
      }
    });
  }
}

document.querySelector("#teste1").addEventListener("click", () => {
  getLatLongFromAdressAndPin("R. da Ferraria 96, 4435-250","Clinica da Venda Nova")
  getLatLongFromAdressAndPin("Av. da Conduta 161, 4435-485")
  getLatLongFromAdressAndPin("R. Dom João de Castro Nº 509, 4435-674")
  getLatLongFromAdressAndPin("R. Dom António Castro Meireles 559, 4435-639")
  getLatLongFromAdressAndPin("Estrada da Circunvalação 706, 4435-178")
  getLatLongFromAdressAndPin("R. Fernão de Magalhães 314, 4435-481")
  getLatLongFromAdressAndPin("R. Dr. Eduardo Santos Silva 645, 4200-258")
  getLatLongFromAdressAndPin("R. 5 de Outubro 1, 4420-086")
  initMap()
});

document.querySelector("#teste2").addEventListener("click", () => {
  clearOverlays()
  initMap()
});

function clearOverlays() {
  clinicasPequenas.length = 0;
}
