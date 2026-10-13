declare var $: any;

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
// Demo data: the booking form works without a map service or a backend.
// Locations, distances, times and prices below are sample values.

var demoLocations = [
  "Cairo International Airport",
  "Downtown Cairo",
  "Cairo Festival City",
  "Giza Pyramids",
  "Maadi",
  "6th of October City"
];

// sample road distance in km between two locations, by their position in the list above
var demoDistances = {
  "0-1": 22, "0-2": 14, "0-3": 38, "0-4": 30, "0-5": 55,
  "1-2": 20, "1-3": 14, "1-4": 12, "1-5": 32,
  "2-3": 34, "2-4": 18, "2-5": 52,
  "3-4": 16, "3-5": 22,
  "4-5": 38
};

// sample travel time: 2 minutes per km
var demoMinutesPerKm = 2;

// demo prices
var demoVehicles = {
  economy: { name: "Mercedes-Benz E220 Economy", perKm: 0.8, perHour: 20 },
  business: { name: "Mercedes-Benz E220 Business", perKm: 1.1, perHour: 28 },
  first: { name: "Mercedes-Benz E220 First Class", perKm: 1.5, perHour: 40 }
};
var demoBaseFare = 5;       // added to every distance ride
var demoExtraHourPrice = 10; // each extra waiting hour on a distance ride
var demoDepositRate = 0.3;   // 30% deposit

var pageMode = "distance";

function formatMoney(amount) {
  return "$" + amount.toFixed(2);
}

function formatTime(minutes) {
  return Math.floor(minutes / 60) + "h " + (minutes % 60) + "m";
}

// 2026-11-01 -> 01-11-2026
function formatDate(value) {
  var parts = value.split("-");
  return parts.length === 3 ? parts[2] + "-" + parts[1] + "-" + parts[0] : value;
}

function fillLocationSelect(select, placeholder) {
  select.innerHTML = "";
  var first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  select.appendChild(first);
  demoLocations.forEach(function (name, index) {
    var option = document.createElement("option");
    option.value = String(index);
    option.textContent = name;
    select.appendChild(option);
  });
}

function getInput(id) {
  return document.getElementById(id) as any;
}

// read the ride details from step 1 and work out the sample distance and time
function getRide() {
  var pickup = getInput("pickup-location").value;
  var dropoff = getInput("dropoff-location").value;
  var ride = {
    mode: pageMode,
    date: getInput("pickup-date").value,
    time: getInput("pickup-time").value,
    pickup: pickup,
    dropoff: dropoff,
    pickupName: pickup === "" ? "" : demoLocations[Number(pickup)],
    dropoffName: dropoff === "" ? "" : demoLocations[Number(dropoff)],
    hours: Number(getInput("duration-hours").value),
    extraHours: Number(getInput("extra-time").value),
    distanceKm: 0,
    minutes: 0
  };

  if (ride.mode === "hourly") {
    ride.minutes = ride.hours * 60;
  } else if (pickup !== "" && dropoff !== "" && pickup !== dropoff) {
    var a = Math.min(Number(pickup), Number(dropoff));
    var b = Math.max(Number(pickup), Number(dropoff));
    ride.distanceKm = demoDistances[a + "-" + b];
    ride.minutes = ride.distanceKm * demoMinutesPerKm;
  }
  return ride;
}

// demo price for one vehicle
function getPrice(vehicleId, ride) {
  var vehicle = demoVehicles[vehicleId];
  var vehiclePrice = 0;
  var extraPrice = 0;
  if (ride.mode === "hourly") {
    vehiclePrice = vehicle.perHour * ride.hours;
  } else {
    vehiclePrice = demoBaseFare + vehicle.perKm * ride.distanceKm;
    extraPrice = demoExtraHourPrice * ride.extraHours;
  }
  var total = vehiclePrice + extraPrice;
  return {
    vehiclePrice: vehiclePrice,
    extraPrice: extraPrice,
    total: total,
    deposit: total * demoDepositRate
  };
}

function getSelectedVehicle() {
  var checked = document.querySelector('input[name="product"]:checked') as any;
  return checked ? checked.value : "";
}

// step 1: the route summary shown in place of the map
function updateRoutePanel() {
  var ride = getRide();
  document.getElementById("route-from").textContent = ride.pickupName || "Choose a pickup location";
  if (ride.mode === "hourly") {
    document.getElementById("route-to-label").textContent = "DURATION";
    document.getElementById("route-to").textContent = ride.hours + " hour(s) with the driver";
    document.getElementById("distance-result").textContent = "Not used";
  } else {
    document.getElementById("route-to-label").textContent = "TO";
    document.getElementById("route-to").textContent = ride.dropoffName || "Choose a drop-off location";
    document.getElementById("distance-result").textContent = ride.distanceKm + " km";
  }
  document.getElementById("time-result").textContent = formatTime(ride.minutes);
}

// fill every summary panel and the vehicle prices from what was entered
function updateSummary() {
  var ride = getRide();
  var vehicleId = getSelectedVehicle();
  var price = vehicleId ? getPrice(vehicleId, ride) : { vehiclePrice: 0, extraPrice: 0, total: 0, deposit: 0 };
  var hourly = ride.mode === "hourly";

  var values = {
    service: hourly ? "Hourly" : "Distance",
    routeLabel: hourly ? "PICKUP" : "FROM - TO",
    route: hourly ? ride.pickupName : ride.pickupName + " - " + ride.dropoffName,
    dateTime: formatDate(ride.date) + ", " + ride.time,
    extraLabel: hourly ? "DURATION" : "EXTRA TIME",
    extra: (hourly ? ride.hours : ride.extraHours) + " hours",
    distance: hourly ? "Not used" : ride.distanceKm + " km",
    time: formatTime(ride.minutes),
    vehicle: vehicleId ? demoVehicles[vehicleId].name : "Not selected",
    vehiclePrice: formatMoney(price.vehiclePrice),
    extraPrice: formatMoney(price.extraPrice),
    total: formatMoney(price.total),
    deposit: formatMoney(price.deposit),
    firstName: getInput("first-name").value.trim(),
    lastName: getInput("last-name").value.trim(),
    email: getInput("email").value.trim(),
    phone: getInput("phone").value.trim() || "Not given",
    payment: (document.querySelector('input[name="payment"]:checked') as any).value
  };

  // values are added as text
  $("[data-summary]").each(function () {
    this.textContent = values[this.getAttribute("data-summary")];
  });

  // mark the selected vehicle card
  $('input[name="product"]').each(function () {
    $(this).closest(".card").toggleClass("vehicle-selected", this.checked);
  });

  // price of each vehicle for this ride
  $("[data-price]").each(function () {
    this.textContent = formatMoney(getPrice(this.getAttribute("data-price"), ride).total);
  });
}

// returns a message when a step is not complete, or "" when it can continue
function validateStep(stepIndex) {
  var ride = getRide();
  if (stepIndex === 0) {
    if (ride.date === "" || ride.time === "") {
      return "Choose a pickup date and time.";
    }
    if (ride.pickup === "") {
      return "Choose a pickup location.";
    }
    if (ride.mode === "distance" && (ride.dropoff === "" || ride.dropoff === ride.pickup)) {
      return "Choose a drop-off location that is different from the pickup location.";
    }
  }
  if (stepIndex === 1 && getSelectedVehicle() === "") {
    return "Select a vehicle.";
  }
  if (stepIndex === 2) {
    var email = getInput("email").value.trim();
    if (getInput("first-name").value.trim() === "" || getInput("last-name").value.trim() === "" || !/^\S+@\S+\.\S+$/.test(email)) {
      return "Enter your first name, last name and a valid e-mail address.";
    }
  }
  return "";
}

// Distance or Hourly
function changeMode(mode: string) {
  pageMode = mode;
  var hourly = mode === "hourly";
  $("#home-tab").toggleClass("active", !hourly);
  $("#profile-tab").toggleClass("active", hourly);
  getInput("dropoff-group").hidden = hourly;
  getInput("extra-title").hidden = hourly;
  getInput("extra-group").hidden = hourly;
  getInput("duration-group").hidden = !hourly;
  $(".step-error").text("");
  updateRoutePanel();
  // keep the page where it is, the tab links are not real links
  return false;
}


$(document).ready(function () {

  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  var current = 1;
  var steps : any= $("fieldset").length ;

  fillLocationSelect(getInput("pickup-location"), "Choose a pickup location");
  fillLocationSelect(getInput("dropoff-location"), "Choose a drop-off location");
  updateRoutePanel();
  updateSummary();
  $("#first-stage select").on("change", updateRoutePanel);
  $('input[name="product"]').on("change", updateSummary);
  // a message goes away as soon as something in that step changes
  $("fieldset").on("input change", function () {
    $(this).find(".step-error").text("");
  });

  setProgressBar(current);

  $(".next").click(function () {

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    // check this step before moving on
    var message = validateStep($("fieldset").index(current_fs));
    current_fs.find(".step-error").text(message);
    if (message !== "") {
      return;
    }
    updateSummary();

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

  function setProgressBar(curStep:any) {
    var percent : any = parseFloat("" + 100 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
      .css("width", percent + "%")
  }

  $(".submit").click(function () {
    return false;
  })

  // Submit: this is a demo, nothing is sent anywhere
  $("#submit-booking").click(function () {
    $("fieldset").stop(true, true).hide();
    $("#booking-complete").prop("hidden", false);
  });

  // Start again: clear the form and go back to step 1
  $("#start-again").click(function () {
    (document.getElementById("msform") as any).reset();
    $("#booking-complete").prop("hidden", true);
    $("fieldset").stop(true, true).hide().css("opacity", 1);
    $("fieldset").first().show();
    $("#progressbar li").removeClass("active").first().addClass("active");
    $(".step-error").text("");
    current = 1;
    setProgressBar(current);
    changeMode("distance");
    updateSummary();
    window.scrollTo(0, 0);
  });





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
