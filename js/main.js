$(document).ready(function () {

  // navBar

  $(window).on('scroll', function () {

    if ($(window).scrollTop() >= 80) {
      $('.navbar').addClass('change-bg');


    } else {
      $('.navbar').removeClass('change-bg');


    }

  })

  // navBar



  // set package boxes in the same height

  let locationName = $('.packages .package .card .list-group .list-group-item.location-name')

  let maxHeight = 0

  locationName.each(function () {
    if ($(this).outerHeight() > maxHeight) {
      maxHeight = $(this).outerHeight()
    }
  })

  locationName.outerHeight(maxHeight)

  // set package boxes in the same height


})




//////////////////////////////////////////////////////////////////////////////////////////////



$(document).ready(function () {

  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  var current = 1;
  var steps = $("fieldset").length;

  setProgressBar(current);

  $(".next").click(function () {

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //Add Class Active
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
      opacity: 0
    }, {
      step: function (now) {
        // for making fielset appear animation
        opacity = 1 - now;

        current_fs.css({
          'display': 'none',
          'position': 'relative'
        });
        next_fs.css({
          'opacity': opacity
        });
      },
      duration: 500
    });
    setProgressBar(++current);
  });

  $(".previous").click(function () {

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //Remove class active
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();

    //hide the current fieldset with style
    current_fs.animate({
      opacity: 0
    }, {
      step: function (now) {
        // for making fielset appear animation
        opacity = 1 - now;

        current_fs.css({
          'display': 'none',
          'position': 'relative'
        });
        previous_fs.css({
          'opacity': opacity
        });
      },
      duration: 500
    });
    setProgressBar(--current);
  });

  function setProgressBar(curStep) {
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
      .css("width", percent + "%")
  }

  $(".submit").click(function () {
    return false;
  })





  //////////////////start view more //////////////

  $('#show').click(function () {
    $('.menu').toggle("slide");
    var text = $(this).text();

    if (text == "More info") {
      /*if text inside #toggleMessage is Show...*/
      $(this).text("Less info"); /*Change button text to Hide*/

    } else {
      $(this).text("More info"); /*Change button text to Show*/
    }
  });

  ////////////////////end///////////
});


/////////////////////////////////////////////////////////////////

map

function initMap() {
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {
      lat: 26.8206,
      lng: 30.8025
    } //Egypt.
  });

  this.directionsService = new google.maps.DirectionsService;
  this.directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('right-panel')
  });

  this.directionsRenderer.addListener('directions_changed', function () {
    computeTotalDistance(this.directionsRenderer.getDirections());
  });

  originInput = document.getElementById("inputAddress");
  destInput = document.getElementById("inputAddress2");
  initOrigDestsAutocompelete();
  // displayRoute();

}
var originInput;
var destInput;
var directionsService;

function displayRoute() {
  this.directionsService.route({
    origin: {
      placeId: this.originPlaceId
    },
    waypoints: waypointPlaceIds.length?waypointPlaceIds:null,
    destination: {
      placeId: this.destinationPlaceId
    }, // waypoints,
    travelMode: 'DRIVING',
    avoidTolls: false
  }, function (response, status) {
    if (status === 'OK') {
      this.directionsRenderer.setDirections(response);
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}

function initWaypointsAutocompelete() {
  for (let i = 0; i < waypointInputs.length; i++) {
    const input = waypointInputs[i];
    const inputAutocomplete = new google.maps.places.Autocomplete(input);
    inputAutocomplete.setFields(["place_id"]);
    inputAutocomplete.addListener("place_changed", () => {
      const place = inputAutocomplete.getPlace();
      waypointObj = {
        placeId : place.place_id
      }
      waypointPlaceIds.push(waypointObj);
      this.displayRoute();
    });
  }
}


function initOrigDestsAutocompelete() {
  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  originAutocomplete.setFields(["place_id"]);
  setupPlaceChangedListener(originAutocomplete, "ORIG")

  const destAutocomplete = new google.maps.places.Autocomplete(destInput);
  destAutocomplete.setFields(["place_id"]);
  setupPlaceChangedListener(destAutocomplete, "DEST")


}

var originPlaceId;

var destinationPlaceId;

function setupPlaceChangedListener(autocomplete, mode) {
  autocomplete.bindTo("bounds", this.map);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }

    if (mode === "ORIG") {
      this.originPlaceId = place.place_id;
    }
    if (mode === "DEST") {
      this.destinationPlaceId = place.place_id;
    }
    if (this.originPlaceId && this.destinationPlaceId) {
      this.displayRoute();
    }
  });
}

// waypoint inputs logic
var waypointID = 0;
var waypointInputs = [];
var waypointPlaceIds = [];

function initAddWaypointButton() {
  const btn = $("#add-waypoint");
  btn.click(function (e) {
    e.preventDefault();
    console.log("clicked");
    createWaypointInput();
  });
}

function createWaypointInput() {
  const originaInput = document.getElementById("inputAddress");
  const newInput = document.createElement("input");
  newInput.setAttribute("class", "form-control pickup-input waypoint_class");
  newInput.setAttribute("id", "waypoint_" + waypointID);
  newInput.setAttribute("placeholder", "Enter a waypoint");

  const newLabel = document.createElement("label");
  newLabel.setAttribute("for", "waypoint_" + waypointID);
  newLabel.innerText = "Waypoint Location";

  // create input container
  const newInputContainer = document.createElement("div");
  newInputContainer.setAttribute("class", "inputAdress-waypoint");
  newInputContainer.setAttribute("id", "waypoint_container_" + waypointID);


  // add waypoint button
  const newbtn = document.createElement("button");
  newbtn.setAttribute("class", "pickup-button");
  newbtn.innerText = "+";
  $(newbtn).click(function (e) {
    e.preventDefault();
    createWaypointInput();
  });

  // remove waypoint button
  const deleteWatpoint = document.createElement("button");
  deleteWatpoint.setAttribute("class", "pickup-button delete-waypoint");
  deleteWatpoint.innerText = "-";

  $(deleteWatpoint).click(function (e) {
    e.preventDefault();
    newInputContainer.remove();
    let removed = waypointInputs.indexOf(newInput);
    for (var i = 0; i < waypointInputs.length; i++) {
      if (waypointInputs[i] === newInput) {
        waypointInputs.splice(i, 1);
        break;
      }
    }
  });


  originaInput.parentElement.parentElement.append(newInputContainer);
  newInputContainer.append(newLabel);
  newInputContainer.append(newInput);
  newInputContainer.append(deleteWatpoint);
  newInputContainer.append(newbtn);

  waypointID++;
  waypointInputs.push(newInput);
  initWaypointsAutocompelete();
}
initAddWaypointButton();