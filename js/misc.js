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

//Criar um mapa e as suas defenições 
function initMap() {
  const coordenadas = { lat: 41.366514, lng: -8.74018 };
  const map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 15,
    center: coordenadas,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    draggable: false,
    scrollwheel: false
  });
  //Invocar a função addMarker para adicionar um ponto ao mapa 
  addMarker(coordenadas, map);
}

//Adicionar um marcador ao map
function addMarker(location, map) {
  new google.maps.Marker({
    position: location,
    map: map,
  });
}

//Descobrir a localidade onde o utilizador se encontra
function getLocalityFromLatLong(lat,long){
  let x= $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
    for (var i = 0; i < data.results.length; i++) {
      if (data.results[i].types[0] == "locality") {
          let localidadeBanner=document.querySelector("#localidade-banner")
          localidadeBanner.value=""
          localidadeBanner.value=(data.results[i].address_components[0].long_name)
      }
    }
    console.log(data)
  });
}