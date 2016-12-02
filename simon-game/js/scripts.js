$(document).ready(function () {
  var startBtn = 0,
    firstTime = 1,
    strictMode = 0,
    playing = 0,
    computerArr = [],
    playerArr = [],
    colorsArr = ["greenbtn", "redbtn", "bluebtn", "yellowbtn"],
    sounds = {
      win: document.getElementById('win'),
      fail: document.getElementById('fail'),
      c: document.getElementById('c'),
      d: document.getElementById('d'),
      e: document.getElementById('e'),
      f: document.getElementById('f')
    };

  function isPlaying() {
    playing = 1;
  }

  function hasEnded() {
    playing = 0;
  }
  for (var s in sounds) {
    if (sounds.hasOwnProperty(s)) {
      sounds[s].addEventListener('playing', isPlaying);
      sounds[s].addEventListener('ended', hasEnded);
    }
  }
  // browser is not working with audio api
  /*  if (!(window.AudioContext || window.webkitAudioContext)) {
      alert("Sorry, this game is not working with your browser. Please use the latest version of Chrome or Firefox.");
    }*/
  $(".colbtn").click(function () {
    if (startBtn === 0 || playing === 1) {
      return 0;
    }
    playerArr.push($(this).attr("id"));
    if (playerArr[playerArr.length - 1] === computerArr[playerArr.length - 1]) {
      changeColorPlayer($(this).attr("id"), 0);
      // 20 repeats to win
      if (playerArr.length === computerArr.length && computerArr.length === 20) {
        setTimeout(function () {
          sounds.win.play();
          instructionsToggle();
          $("#won").fadeIn(600).delay(1500).fadeOut(600, instructionsToggle);
          reset();
        }, 1000);
      } else if (playerArr.length === computerArr.length) {
        playerArr = [];
        setTimeout(function () {
          ai();
        }, 1500);
      }
    } else {
      playerArr = [];
      changeColorPlayer($(this).attr("id"), 1);
      if (strictMode) {
        computerArr = [];
        $("#countText").text("--");
        setTimeout(function () {
          ai();
        }, 1500);
      } else {
        setTimeout(function () {
          ai(1);
        }, 1500);
      }
    }
  });

  $("#start").click(function () {
    /*
      Play all sounds muted on first start.
      This is needed for mobile browsers like Chrome mobile.
      They play a sound only when there was a click or it was played before.
    */
    if (firstTime === 1) {
      firstTime = 0;
      startBtn = 1;
      $(this).text("Reset");
      for (var sound in sounds) {
        if (sounds.hasOwnProperty(sound)) {
          sounds[sound].volume = 0;
          sounds[sound].play();
        }
      }
      setTimeout(function () {
        sounds.win.volume = 1;
      }, 3000);
      setTimeout(function () {
        for (var sound in sounds) {
          if (sounds.hasOwnProperty(sound) && sound !== 'win') {
            sounds[sound].volume = 1;
          }
        }
        ai();
      }, 1200);
    } else {
      if (!startBtn) {
        ai();
        startBtn = 1;
        $(this).text("Reset");
      } else {
        reset();
      }
    }
  });

  $("#strict").click(function () {
    if (strictMode) {
      strictMode = 0;
      $("#icon").text("thumb_down").removeClass("green-text").addClass("red-text");
    } else {
      strictMode = 1;
      $("#icon").text("thumb_up").removeClass("red-text").addClass("green-text");
    }
  });

  function ai(error) {
    if (!error) {
      computerArr.push(colorsArr[Math.floor(Math.random() * colorsArr.length)]);
    }

    $("#countText").text(computerArr.length.toString());

    playSound(computerArr[0]);
    $("#" + computerArr[0]).addClass("darken-2");
    var count = 1,
      timer = 1100;
    if (computerArr.length > 1) {
      var intId = setInterval(function () {
        $("#" + computerArr[count - 1]).removeClass("darken-2");
        playSound(computerArr[count]);
        $("#" + computerArr[count]).addClass("darken-2");
        count++;
        if (count === computerArr.length) {
          clearInterval(intId);
          setTimeout(function () {
            $("#" + computerArr[count - 1]).removeClass("darken-2");
          }, timer);
        }
      }, timer);
    } else {
      setTimeout(function () {
        $("#" + computerArr[0]).removeClass("darken-2");
      }, timer);
    }
  }

  function changeColorPlayer(id, error) {
    playSound(id, error);
    $("#" + id).addClass("darken-2");
    setTimeout(function () {
      $("#" + id).removeClass("darken-2");
    }, 810);
  }

  function playSound(id, error) {
    if (error) {
      sounds.fail.play();
    } else {
      switch (id) {
        case "greenbtn":
          sounds.c.play();
          break;
        case "redbtn":
          sounds.e.play();
          break;
        case "bluebtn":
          sounds.d.play();
          break;
        case "yellowbtn":
          sounds.f.play();
          break;
      }
    }
  }

  function reset() {
    $("#start").text("Start");
    startBtn = 0;
    computerArr = [];
    playerArr = [];
    $("#countText").text("--");
    if (strictMode) {
      strictMode = 0;
      $("#icon").text("thumb_down").removeClass("green-text").addClass("red-text");
    }
  }

  function instructionsToggle() {
    $("#instructions").toggle();
  }

});