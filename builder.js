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
    "tv": [
        [2, 1, 3, ["light","icon"], "t14", "&#xf75e;"], // Mute
        [2, 1, 5, ["light","icon"], "t13", "&#xf580;"], // Vol Down
        [2, 1, 7, ["light","icon"], "t12", "&#xf57e;"], // Vol Up
        [2, 1, 9, ["power","icon"], "t2f_1*1s2f_1*1p2f_3", "&#xf426;"], // All Power Off
        [2, 1, 11, ["power","icon"], "t15", "&#xf425;"], // TV Power Toggle

        //[3, 3, 1, ["dark","icon"], "le9lc4*1p2f_1*4le9", "&#xf035;", "apple"], // Apple TV
        [3, 3, 1, ["dark","icon"], null, "&#xf035;", "apple"], // Apple TV
        //[3, 3, 4, ["dark","icon"], "lcclc4*1s2e_1*5lcc", "&#xf95f;", "bluray"], // Bluray
        [3, 3, 4, ["dark","icon"], null, "&#xf95f;", "bluray"], // Bluray
        [3, 3, 7, ["dark","icon"], "h5c", "&#xf7e0;"], // HDMI
        [3, 3, 10, ["dark","icon"], "h5d", "&#xf840;"], // Switch

        [4, 6, 5, ["light","icon"], "t74", "&#xf736;"], // Up
        [4, 10, 1, ["light","icon"], "t34", "&#xf730;"], // Left
        [4, 10, 9, ["light","icon"], "t33", "&#xf733;"], // Right
        [4, 14, 5, ["light","icon"], "t75", "&#xf72d;"], // Down
        [4, 10, 5, ["dark", "icon"], "t65", "&#10022;"], // Enter

        [2, 8, 3, ["light","icon"], "t60", "&#xf493;"], // Menu
        [2, 8, 9, ["light","icon"], "t63", "&#xf311;"], // Back
        //[2, 14, 3, ["light","icon"], "ldc", "&#xf7fc;"], // 3D
        //[2, 14, 9, ["light","icon"], "l5b", "&#xffe5;"], // Exit

        //Numbers:
        [2, 18, 1, ["dark"], "t09", "0"],
        [2, 18, 3, ["dark"], "t00", "1"],
        [2, 18, 5, ["dark"], "t01", "2"],
        [2, 18, 7, ["dark"], "t02", "3"],
        [2, 18, 9, ["dark"], "t03", "4"],
        [2, 20, 1, ["dark"], "t04", "5"],
        [2, 20, 3, ["dark"], "t05", "6"],
        [2, 20, 5, ["dark"], "t06", "7"],
        [2, 20, 7, ["dark"], "t07", "8"],
        [2, 20, 9, ["dark"], "t08", "9"]
    ],
    "apple": [
        [2, 1, 1, ["dark","icon"], null, "&#xf141;", "tv"], // Back to TV
        [2, 1, 3, ["light","icon"], "t14", "&#xf75e;"], // Mute
        [2, 1, 5, ["light","icon"], "t13", "&#xf580;"], // Vol Down
        [2, 1, 7, ["light","icon"], "t12", "&#xf57e;"], // Vol Up
        [2, 1, 9, ["power","icon"], "t15", "&#xf903;"], // TV Power Toggle (Sleep Icon)
        [2, 1, 11, ["power","icon"], "p2f_3", "&#xf425;"], // Apple TV Sleep

        [4, 6, 5, ["light","icon"], "p05", "&#xf736;"], // Up
        [4, 10, 1, ["light","icon"], "p04", "&#xf730;"], // Left
        [4, 10, 9, ["light","icon"], "p03", "&#xf733;"], // Right
        [4, 14, 5, ["light","icon"], "p06", "&#xf72d;"], // Down
        [4, 10, 5, ["dark", "icon"], "p2e", "&#10022;"], // Enter

        [2, 14, 3, ["light","icon"], "p01", "&#xf493;"], // Menu
        [2, 14, 9, ["light","icon"], "p2f", "&#xf40e;"], // Play/Pause

        [2, 20, 11, ["power","icon"], "h5b", "&#xfd1c;"], // Choose Input
    ],
    "bluray": [
        [2, 1, 1, ["dark","icon"], null, "&#xf141;", "tv"], // Back to TV
        [2, 1, 3, ["light","icon"], "t14", "&#xf75e;"], // Mute
        [2, 1, 5, ["light","icon"], "t13", "&#xf580;"], // Vol Down
        [2, 1, 7, ["light","icon"], "t12", "&#xf57e;"], // Vol Up
        [2, 1, 9, ["power","icon"], "t15", "&#xf903;"], // TV Power Toggle (Sleep Icon)
        [2, 1, 11, ["power","icon"], "s15", "&#xf425;"], // Blu-ray Power Toggle

        [4, 6, 5, ["light","icon"], "s39", "&#xf736;"], // Up
        [4, 10, 1, ["light","icon"], "s3b", "&#xf730;"], // Left
        [4, 10, 9, ["light","icon"], "s3c", "&#xf733;"], // Right
        [4, 14, 5, ["light","icon"], "s3a", "&#xf72d;"], // Down
        [4, 10, 5, ["dark", "icon"], "s3d", "&#10022;"], // Enter

        [2, 8, 1, ["light","icon"], "s29", "&#xf493;"], // Pop-Up Menu
        [2, 6, 3, ["light","icon"], "s43", "&#xf311;"], // Back
        [2, 6, 9, ["light","icon"], "s1a", "&#xf40a;"], // Play
        [2, 8, 11, ["light","icon"], "s19", "&#xf3e4;"], // Pause
        [2, 14, 1, ["light","icon"], "s56", "&#xf4ab;"], // Prev Chapter
        [2, 14, 11, ["light","icon"], "s57", "&#xf4ac;"], // Next Chapter
        [2, 16, 3, ["light","icon"], "s1b", "&#xf45f;"], // Rewind
        [2, 16, 9, ["light","icon"], "s1c", "&#xf211;"], // Fast-Forward

        [2, 20, 1, ["dark","icon"], "s63", "&#xfd99;"], // CC
        [2, 20, 3, ["dark","icon"], "s2c", "&#xfb87;"], // Top Menu
        [2, 20, 5, ["dark","icon"], "s42", "&#xf2dc;"], // Home
        [2, 20, 7, ["dark","icon"], "s16", "&#xf1ea;"], // Eject

        [2, 20, 11, ["power","icon"], "h5a", "&#xfd1c;"], // Choose Input
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
    connection.onopen = () => {
      isConnected = true;
      if (whenConnected != null) {
          var temp = whenConnected;
          whenConnected = null;
          temp();
      }
    };
    connection.onerror = (error) => {
        isConnected = false;
        //alert("Connection Error: " + JSON.stringify(error));
    };
    connection.onmessage = (e) => {
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
            webSocketConnect();
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
        useNav = "tv";
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
