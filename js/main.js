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


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: {
          lat: 26.8206,
          lng: 30.8025
      } //Egypt.
  });

  var directionsService = new google.maps.DirectionsService;
  var directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map,
      panel: document.getElementById('right-panel')
  });

  directionsRenderer.addListener('directions_changed', function() {
      computeTotalDistance(directionsRenderer.getDirections());
  });

  displayRoute('Egypt,cairo', 'Egypt,Alexandria', directionsService,
      directionsRenderer);
}

function displayRoute(origin, destination, service, display) {
  service.route({
      origin: origin,
      destination: destination,
      waypoints: [{
          location: new google.maps.LatLng(30.7865, 31.0004),
      }, {
          location: 'Egypt,damanhour'
      }, {
          location: 'Egypt,idku'
      }],
      travelMode: 'DRIVING',
      avoidTolls: true
  }, function(response, status) {
      if (status === 'OK') {
          display.setDirections(response);
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