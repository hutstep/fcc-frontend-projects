$(document).ready(function () {
  var intId = 0,
    sound = new Audio("audio/bell.ogg"),
    pause = 0,
    contBtn = 0,
    seconds = parseInt($("#workMinutes").text()) * 60;

  $("#startBtn").click(function () {
    if (intId && $(this).text() === "Continue Work") {
      clearInterval(intId);
      $(this).text("Pause Work");
      contBtn = 1;
      intId = setInterval(counter, 1000);
    } else if (intId) {
      clearInterval(intId);
      $(this).text("Resume Work");
      intId = 0;
    } else {
      intId = setInterval(counter, 1000);
      $(this).text("Pause Work");
    }
  });

  $("#resetBtn").click(function () {
    if (intId) {
      clearInterval(intId);
      intId = 0;
    }
    $("#startBtn").text("Start Work");
    $("#timer").text($("#workMinutes").text() + ":00");
    seconds = parseInt($("#workMinutes").text()) * 60;
    $("#progressbar").css("width", "100%");
  });

  $("i").click(function () {
    var val = parseInt($(this).siblings("span").text()),
      clickId = $(this).siblings("span").attr("id");
    if ($(this).text() === "add") {
      val++;
      $(this).siblings("span").text(val.toString());
      if ((pause && clickId === "pauseMinutes") ||
        (!pause && clickId === "workMinutes")) {
        $("#timer").text(val.toString() + ":00");
        seconds = val * 60;
      }
    } else if (val > 1) {
      val--;
      $(this).siblings("span").text(val.toString());
      if ((pause && clickId === "pauseMinutes") ||
        (!pause && clickId === "workMinutes")) {
        $("#timer").text(val.toString() + ":00");
        seconds = val * 60;
      }
    }
  });

  function counter() {
    var minSec = $("#timer").text().split(":");
    if (parseInt(minSec[0]) === 0 && parseInt(minSec[1]) === 0) {
      // play sound & stop intervall
      clearInterval(intId);
      sound.play();
      if (pause) {
        minSec[0] = $("#workMinutes").text();
        seconds = minSec[0] * 60;
        pause = 0;
        $("#startBtn").text("Pause Work");
      } else {
        minSec[0] = $("#pauseMinutes").text();
        seconds = minSec[0] * 60;
        pause = 1;
        $("#startBtn").text("Continue Work");
      }
      intId = setInterval(counter, 1000);
    } else if (contBtn) {
      minSec[0] = $("#workMinutes").text();
      minSec[1] = "00";
      seconds = minSec[0] * 60;
      pause = 0;
      contBtn = 0;
    } else if (parseInt(minSec[1]) === 0) {
      minSec[0] = parseInt(minSec[0]) - 1;
      minSec[0] = minSec[0].toString();
      minSec[1] = "59";
    } else {
      minSec[1] = parseInt(minSec[1]) - 1;
      if (minSec[1] < 10) {
        minSec[1] = "0" + minSec[1].toString();
      } else {
        minSec[1] = minSec[1].toString();
      }
    }
    $("#timer").text(minSec.join(":"));
    // calculate progressbar width in %
    $("#progressbar").css("width", (100 - ((parseInt(minSec[0]) * 60 + parseInt(minSec[1])) / seconds * 100)).toFixed() + "%");
  }
});