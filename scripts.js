
let myFunc;

let focus = true;
var breakTime = 0;
var focusTime = 0;
var numRounds = 0;

function getInput() {
    focusTime = $("#study-input").val();
    breakTime = $("#break-input").val();
    numRounds = $("#session-input").val();
    inputChange(focusTime);
}


function inputChange(timeAmt) {
    $("#start").prop("disabled", true);
    $("#focus-disp").html("Focus");
    $("#sessions").html("Sessions: " + numRounds);
    let mins = 00;
    mins = timeAmt;
    console.log(focusTime);

    var countDownDate = new Date().getTime();

    //add minutes to countdown date
    countDownDate = addMinutes(countDownDate, mins);

    //add seconds to countdown date

    //with jquery
    myfunc = setInterval(function () {
        var now = new Date().getTime();
        var timeleft = countDownDate - now;
        time = timeleft;

        // Calculating the days, hours, minutes and seconds left
        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        if (hours > 0) {
            $("#hours").html(hours + ":")
            $("#hours").show();
        }

        minutes = minutes.toString().padStart(2, '0')

        seconds = seconds.toString().padStart(2, '0')

        $("#minutes").html(minutes);
        $("#seconds").html(seconds);

        if (timeleft < 0) {
            clearInterval(myfunc);
            $("#minutes").html("00");
            $("#seconds").html("00");

            if (numRounds > 0) {
                addTalley();
                inputChange(focusTime);
                numRounds--;
            } else {
                focus = false;
                breakFn();
            }
        }
    }, 1000)
}

function breakFn() {
    $("#focus-disp").html("Break");
    $("#start").prop("disabled", true);
    var countDownDate2 = new Date().getTime();

    //add minutes to countdown date
    countDownDate2 = addMinutes(countDownDate2, breakTime);
    console.log(countDownDate2);

    //add seconds to countdown date

    //with jquery
    myfunc = setInterval(function () {
        var now2 = new Date().getTime();
        var timeleft2 = countDownDate2 - now2;

        // Calculating the days, hours, minutes and seconds left
        var days = Math.floor(timeleft2 / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft2 % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft2 % (1000 * 60)) / 1000);

        if (hours > 0) {
            $("#hours").html(hours + ":")
            $("#hours").show();
        }

        minutes = minutes.toString().padStart(2, '0')

        seconds = seconds.toString().padStart(2, '0')

        console.log(timeleft2);
        $("#minutes").html(minutes);
        $("#seconds").html(seconds);

        if (timeleft2 < 0) {
            console.log("timeleft2 no work");
            clearInterval(myfunc);
            $("#minutes").html("00");
            $("#seconds").html("00");
        }
    }, 1000)
}



function callClearInterval() {
    clearInterval(myfunc);
    myFunc = null;
    $("#hours").hide();
    $("#minutes").html("00");
    $("#seconds").html("00");
    $("#mins-input").val("");
    $("#secs-input").val("");
    $("#start").prop("disabled", false);
}


function addMinutes(date, minutes) {
    return new Date(date + minutes * 60000);
}

function addSeconds(date, seconds) {
    return new Date(date + seconds * 1000);
}


var iframeElement = document.querySelector('iframe');
var iframeElementID = iframeElement.id;
var widget = SC.Widget(iframeElement);
var x = document.getElementById("play");

var numDisplayed = 0;

widget.bind(SC.Widget.Events.FINISH, function () {
    widget.getCurrentSound(function (currentSound) {
        document.getElementById("currentTrack").innerHTML = currentSound.title;
    });
});

function play() {
    if (x.innerHTML === "▶") {
        x.innerHTML = "||";
    } else {
        x.innerHTML = "▶";
    }
    widget.toggle();
};

function next() {
    x.innerHTML = "||";
    widget.next();
    widget.seekTo(0);
    widget.getCurrentSound(function (currentSound) {
        document.getElementById("currentTrack").innerHTML = currentSound.title;
    });
};

function prev() {
    x.innerHTML = "||";
    widget.prev();
    widget.seekTo(0);
    widget.getCurrentSound(function (currentSound) {
        document.getElementById("currentTrack").innerHTML = currentSound.title;
    });
};

widget.bind(SC.Widget.Events.READY, function () {
    widget.getCurrentSound(function (currentSound) {
        document.getElementById("currentTrack").innerHTML = currentSound.title;

        widget.getSounds(function (tracks) {
            for (var i in tracks) {
                if (tracks[i].title != undefined) {
                    $('#tracklist').append("<li class='track-item' id='" + i + "'" + ">" + tracks[i].title + "</li>");
                    numDisplayed++;

                }
            }

            $(".track-item").click(function () {
                var s = this.id
                widget.seekTo(0);
                widget.skip(s);
                x.innerHTML = "||"; widget.getCurrentSound(function (currentSound) {
                    document.getElementById("currentTrack").innerHTML = currentSound.title;
                });

            });



        });

    });
});

var myPlayer = {};
myPlayer.playlistInfo;


myPlayer.player = SC.Widget($('iframe')[0]);
myPlayer.player.bind(SC.Widget.Events.READY, function () {
    var tries = 0;
    function tryGetSounds() {
        myPlayer.player.getSounds(function (ret) {
            var notComplete = false;
            console.log(ret.length);
            for (var i = 0, len = ret.length; i < len; i++) {
                if (ret[i].title === undefined) {
                    notComplete = true;
                    tries++;
                    break;
                }
            }
            if (notComplete && tries < 20) {
                //console.log('Not complete. Try again in 200ms ...');
                setTimeout(function () {
                    tryGetSounds();
                }, 200);
            } else {
                console.log('Complete!');
                myPlayer.playlistInfo = ret;
                console.log(myPlayer.playlistInfo);
                for (var i in ret) {
                    if (ret[i].title != undefined && i > numDisplayed) {
                        //$('#tracklist').append("<li class='track-item' id='" + i + "'" + ">" + ret[i].title + "</li>");
                    }
                }
            }
        });
    }
    tryGetSounds();

});


function addTalley() {
    $('<li />').prop('class', 'tally').appendTo('#count');
    return false;
}