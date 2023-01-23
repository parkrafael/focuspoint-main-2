let runTimer;
let mins = 00;

function overlay() {

    document.getElementById("overlay").style.display = "block"
    document.getElementById("button").style.display = "none"

}

function start() {
    
    document.getElementById("button").style.display = "block"
    document.getElementById("overlay").style.display = "none"

    runTimer = setInterval(function () {
        var now = new Date().getTime();
        var timeleft = countDownDate - now;
        
        if (timeleft < 0) {
            clearInterval(runTimer);
            window.location.replace("timer.html");
        }
    }, 1000)

}
