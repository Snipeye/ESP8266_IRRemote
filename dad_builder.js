//builder.js:
isConnected = false;
connection = null;
webSocketResponseFunction = null;
currentBuild = null;
whenConnected = null;
webSocketQueue = [];
rebuildQueue = [];
queueCheckTimeout = null;
currentlySent = null;

window.addEventListener('load', () => {
    webSocketConnect();
    rebuildUI();
});

navOptions = {
    //[size, row, col, style, ir, inside, nav]
    "outlaw": [
        [2, 1, 3, ["light","icon"], "o48", "&#xf75e;"], // Mute
        [2, 1, 5, ["light","icon"], "o68", "&#xf580;"], // Vol Down
        [2, 1, 7, ["light","icon"], "oa8", "&#xf57e;"], // Vol Up
        // [2, 1, 9, ["power","icon"], "t2f_1*1s2f_1*1p2f_3", "&#xf426;"], // All Power Off
        [2, 3, 9, ["power","icon"], "o00", "&#xf426;"], // Outlaw Off
        [2, 1, 9, ["power","icon"], "o18", "&#xf425;"], // Outlaw On
        [2, 1, 11, ["power","icon"], "t15", "&#xf502;"], // TV Power Toggle

        [5, 7, 2, ["dark","icon"], "o32", "&#xf840;"], // This is the hdmi input, not used?
        [5, 12, 2, ["dark","icon"], null, "&#xf035;", "apple"], // AppleTV
        [5, 7, 7, ["dark","icon"], null, "&#xf95f;", "bluray"], // Bluray
        [5, 12, 7, ["dark","icon"], null, "&#xf386;", "onkyo"] // Switch
    ],
    "apple": [
        [2, 1, 1, ["dark","icon"], null, "&#xf141;", "outlaw"], // Back to TV
        [2, 1, 3, ["light","icon"], "o48", "&#xf75e;"], // Mute
        [2, 1, 5, ["light","icon"], "o68", "&#xf580;"], // Vol Down
        [2, 1, 7, ["light","icon"], "oa8", "&#xf57e;"], // Vol Up
        [2, 1, 9, ["power","icon"], "p2f_3", "&#xf425;"], // Apple TV Sleep
        [2, 1, 11, ["power","icon"], "t15", "&#xf502;"], // TV Power Toggle (TV Icon)
        [2, 3, 1, ["light","icon"], "p01","p"],
        [4, 6, 5, ["light","icon"], "p05", "&#xf736;"], // Up
        [4, 10, 1, ["light","icon"], "p04", "&#xf730;"], // Left
        [4, 10, 9, ["light","icon"], "p03", "&#xf733;"], // Right
        [4, 14, 5, ["light","icon"], "p06", "&#xf72d;"], // Down
        [4, 10, 5, ["dark", "icon"], "p2e", "&#10022;"], // Enter

        [2, 14, 3, ["light","icon"], "p01", "&#xf493;"], // Menu
        [2, 14, 9, ["light","icon"], "p2f", "&#xf40e;"], // Play/Pause

        [2, 20, 11, ["power","icon"], "o72", "&#xfd1c;"], // Choose Input
    ],
    "bluray": [
        [2, 1, 1, ["dark","icon"], null, "&#xf141;", "outlaw"], // Back to TV
        [2, 1, 3, ["light","icon"], "o48", "&#xf75e;"], // Mute
        [2, 1, 5, ["light","icon"], "o68", "&#xf580;"], // Vol Down
        [2, 1, 7, ["light","icon"], "oa8", "&#xf57e;"], // Vol Up
        [2, 1, 9, ["power","icon"], "n3d", "&#xf425;"], // Blu-ray Power Toggle
        [2, 1, 11, ["power","icon"], "t15", "&#xf502;"], // TV Power Toggle (TV Icon)

        [4, 6, 5, ["light","icon"], "n85", "&#xf736;"], // Up
        [4, 10, 1, ["light","icon"], "n87", "&#xf730;"], // Left
        [4, 10, 9, ["light","icon"], "n88", "&#xf733;"], // Right
        [4, 14, 5, ["light","icon"], "n86", "&#xf72d;"], // Down
        [4, 10, 5, ["dark", "icon"], "n82", "&#10022;"], // Enter

        [2, 8, 1, ["light","icon"], "n80", "&#xf493;"], // Option
        [2, 6, 3, ["light","icon"], "n81", "&#xf311;"], // Return
        [2, 6, 9, ["light","icon"], "n0a", "&#xf40a;"], // Play
        [2, 8, 11, ["light","icon"], "n06", "&#xf3e4;"], // Pause
        [2, 14, 1, ["light","icon"], "n49", "&#xf4ab;"], // Prev Chapter
        [2, 14, 11, ["light","icon"], "n4a", "&#xf4ac;"], // Next Chapter
        [2, 16, 3, ["light","icon"], "n04", "&#xf45f;"], // Rewind
        [2, 16, 9, ["light","icon"], "n05", "&#xf211;"], // Fast-Forward

        [2, 20, 1, ["dark","icon"], "n9b", "&#xfb87;"], // Top Menu
        [2, 20, 3, ["dark","icon"], "n57", "&#xf2dc;"], // Home
        [2, 20, 5, ["dark","icon"], "n01", "&#xf1ea;"], // Eject

        [2, 20, 11, ["power","icon"], "o4a", "&#xfd1c;"], // Choose Input
    ],
    "onkyo": [
        [2, 1, 1, ["dark","icon"], null, "&#xf141;", "outlaw"], // Back to TV
        [2, 1, 3, ["light","icon"], "o48", "&#xf75e;"], // Mute
        [2, 1, 5, ["light","icon"], "o68", "&#xf580;"], // Vol Down
        [2, 1, 7, ["light","icon"], "oa8", "&#xf57e;"], // Vol Up
        [2, 1, 9, ["power","icon"], "k04", "&#xf425;"], // Onkyo Power Toggle
        [2, 1, 11, ["power","icon"], "t15", "&#xf502;"], // TV Power Toggle (TV Icon)

        [4, 4, 5, ["light","icon"], "k1b", "&#xf40a;"], // Play
        [4, 6, 1, ["light","icon"], "k01", "&#xf45f;"], // Rewind
        [4, 10, 9, ["light","icon"], "k1d", "&#xf4ac;"], // Skip forward
        [4, 10, 1, ["light","icon"], "k1e", "&#xf4ab;"], // Skip backward
        [4, 6, 9, ["light","icon"], "k00", "&#xf211;"], // Fast-Forward
        [4, 8, 5, ["dark", "icon"], "k1f", "&#xf3e4;"], // Pause
        [4, 12, 5, ["light","icon"], "k1c", "&#xf4db;"], // Stop

        [2, 4, 3, ["dark","icon"], "k46", "&#xf49f;"], // Random
        [2, 4, 9, ["dark","icon"], "k06", "&#xf459;"], // Repeat
        [2, 14, 9, ["dark","icon"], "k0a", "&#xf2fd;"], // Display
        [2, 14, 3, ["dark","icon"], "k0b", "&#xf1ea;"], // Eject

        //Numbers:
        [2, 18, 1, ["dark"], "k0e", "0"],
        [2, 18, 3, ["dark"], "k10", "1"],
        [2, 18, 5, ["dark"], "k11", "2"],
        [2, 18, 7, ["dark"], "k12", "3"],
        [2, 18, 9, ["dark"], "k13", "4"],
        [2, 20, 1, ["dark"], "k18", "5"],
        [2, 20, 3, ["dark"], "k19", "6"],
        [2, 20, 5, ["dark"], "k1a", "7"],
        [2, 20, 7, ["dark"], "k0c", "8"],
        [2, 20, 9, ["dark"], "k0d", "9"],
        [2, 16, 11, ["dark","icon"], "k0e", "&#xf1be;"], // > 10
        [2, 18, 11, ["dark","icon"], "k08", "&#xf15a;"], // Clear

        [2, 16, 9, ["light","icon"], "k4a", "&#xf6e8;"], // Dimmer

        [2, 20, 11, ["power","icon"], "ob2", "&#xfd1c;"] // Choose Input
    ]
};

function webSocketConnect() {
    if (location.hostname != '') {
        connection = new WebSocket('ws://' + location.hostname + ':81/', ['arduino']);
    } else {
        connection = new WebSocket('wss://echo.websocket.org');
    }
    webSocketDetail();
}

function webSocketDetail() {
    console.log("Opening...");
    connection.onopen = () => {
        console.log("open!");
      isConnected = true;
      if (whenConnected != null) {
          whenConnected();
          whenConnected = null;
      }
    };
    connection.onerror = (error) => {
        console.log("err!");
        isConnected = false;
        //alert("Connection Error: " + JSON.stringify(error));
    };
    connection.onmessage = (e) => {
        console.log(e);
        if (webSocketQueue.length) {
            if (e.data == currentlySent) {
                webSocketQueue.splice(0, 1);
                currentlySent = null;
                clearTimeout(queueCheckTimeout);
            }
        }
        if (webSocketResponseFunction) {
            webSocketResponseFunction();
            webSocketResponseFunction = null;
        }
        if (webSocketQueue.length) {
            checkQueue();
        }
    };
    connection.onclose = () => {
        console.log("closed!");
      isConnected = false;
    };
}

function sendCode(str) {
    webSocketQueue.push(str);
    checkQueue();
}

function checkQueue() {
    if (webSocketQueue.length && !currentlySent) {
        if (isConnected) {
            try {
                connection.send(webSocketQueue[0]);
                currentlySent = webSocketQueue[0];
                queueCheckTimeout = setTimeout(problemAlert, 1000);
            } catch (problem) {
                isConnected = false;
                currentlySent = null;
                clearTimeout(queueCheckTimeout);
            }
        }
        if (!isConnected) {
            whenConnected = checkQueue;
        }
    }
}

function problemAlert() {
    alert("Unable to reach device. Please reset the remote control and restart the app.");
    clearTimeout(queueCheckTimeout);
}

function touchStart(event) {
    event.preventDefault();
    var myLink = event.srcElement;
    var ir = myLink.getAttribute("ir");
    if (ir) {
        sendCode("+"+myLink.getAttribute("ir"));
    }
}

function touchEnd(event) {
    event.preventDefault();
    let myLink = event.srcElement;
    var ir = myLink.getAttribute("ir");
    var shouldWait = false;
    if (ir) {
        sendCode("-"+myLink.getAttribute("ir"));
        shouldWait = true;
    }
    let nav = myLink.getAttribute("nav");
    if (nav) {
        rebuildQueue.push(nav);
        if (shouldWait) {
            webSocketResponseFunction = rebuildUI;
        } else {
            rebuildUI();
        }
    }
}

function rebuildUI() {
    let nav = null;
    if (rebuildQueue.length) {
        nav = rebuildQueue[0];
        rebuildQueue.splice(0,1);
    }
    var useNav = '';
    if (nav == null || nav == undefined || !navOptions.hasOwnProperty(nav)) {
        useNav = "outlaw";
    } else {
        useNav = nav;
    }
    if (currentBuild != useNav) {
        var allLinks = document.getElementsByTagName("a");
        for (var i=allLinks.length-1; i>=0; i--) {
            allLinks[i].parentNode.removeChild(allLinks[i]);
        }
        var toBuild = navOptions[useNav];
        for (var i=0; i<toBuild.length; i++) {
            buildButton(toBuild[i]);
        }
    }
    if (rebuildQueue.length) {
        rebuildUI();
    }
}

function buildButton(buttonSpec) {
    var counter = 0;
    var size = counter++;
    var row = counter++;
    var col = counter++;
    var style = counter++;
    var ir = counter++;
    var inside = counter++;
    var nav = counter++;
    var a = document.createElement("a");
    a.style.fontSize = ((buttonSpec[size]+1)*20) + "px";
    a.style.gridRowEnd = "span " + buttonSpec[size];
    a.style.gridColumnEnd = "span " + buttonSpec[size];
    a.style.gridRowStart = buttonSpec[row];
    a.style.gridColumnStart = buttonSpec[col];
    for (var z=0; z<buttonSpec[style].length; z++) {
        a.setAttribute(buttonSpec[style][z].substring(0,1),"");
    }
    if (buttonSpec[ir]) {
        a.setAttribute("ir",buttonSpec[ir]);
    }
    a.innerHTML = buttonSpec[inside];
    if (buttonSpec.length > nav) {
        a.setAttribute("nav",buttonSpec[nav]);
    }
    a.addEventListener('touchstart', touchStart);
    a.addEventListener('mousedown', touchStart);
    a.addEventListener('touchend', touchEnd);
    a.addEventListener('mouseup', touchEnd);
    document.getElementsByTagName("rb")[0].appendChild(a);
}
