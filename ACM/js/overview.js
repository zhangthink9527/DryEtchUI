var setIntervalID;
var x0 = 500;//大圈中心点
var y0 = 300;
var r = 110;
var lr = 70;

function getPoints(angle) {
    var hudu = (2 * Math.PI / 360) * angle;
    var x1 = r * Math.cos(hudu);
    var y1 = r * Math.sin(hudu);
    var x3 = x1 + x0;
    var y3 = y1 + y0;
    return [x3 - lr, y3 - lr];
}

function getMousePos(event) {
    var e = event || window.event;
    alert("x:" + e.clientX + ", y:" + clientY);
}

$(document).ready(function () {
    $("#btnRun").click(function () {
        if ($("#btnRun").val() == "AutoRun") {
            $("#btnRun").val("Stop");
            var arrayObj = ["broken", "processed", "processing", "unprocessed", "semiprocessed"];
            var i = 1;
            setIntervalID = setInterval(function () {
                var p1 = getPoints((6 * i) % 360);
                var p2 = getPoints((6 * i + 120) % 360);
                var p3 = getPoints((6 * i + 240) % 360);
                $("#firstWinfer").attr("style", "position: absolute; left:" + p1[0] + "px; top:" + p1[1] + "px");
                $("#secondWinfer").attr("style", "position: absolute; left:" + p2[0] + "px; top:" + p2[1] + "px");
                $("#thirdWinfer").attr("style", "position: absolute; left:" + p3[0] + "px; top:" + p3[1] + "px");
                $("#firstWinfer").attr("class", arrayObj[i % 5]);
                $("#secondWinfer").attr("class", arrayObj[(i + 1) % 5]);
                $("#thirdWinfer").attr("class", arrayObj[(i - 1) % 5]);
                i++;
            }, 500);
        }
        else {
            $("#btnRun").val("AutoRun");
            clearInterval(setIntervalID)
        }


    });
    var first = getPoints(0);
    var sec = getPoints(120);
    var three = getPoints(240);
    $("#firstWinfer").attr("style", "position: absolute; left:" + first[0] + "px; top:" + first[1] + "px");
    //console.log("sec,position: absolute; left:" +p2x + "px; top:" + sec[1] + "px");
    $("#secondWinfer").attr("style", "position: absolute; left:" + sec[0] + "px; top:" + sec[1] + "px");
    $("#thirdWinfer").attr("style", "position: absolute; left:" + three[0] + "px; top:" + three[1] + "px");
    //console.log("three,position: absolute; left:" + three[0] + "px; top:" + three[1] + "px");

    $("#firstWinfer,#secondWinfer,#thirdWinfer").contextMenu('myMenu1',
     {
         bindings:
          {
              'forward': function (t) {
                  alert('Trigger was ' + t.id + '\nAction was forward');
              },
              'back': function (t) {
                  alert('Trigger was ' + t.id + '\nAction was back');
              },
              'close': function (t) {
                  alert('Trigger was ' + t.id + '\nAction was close');
              },
              'open': function (t) {
                  alert('Trigger was ' + t.id + '\nAction was open');
              }
          }

     });

   
    setPropertyChange(updateProperty);

});

//document.onmousemove = mouseMove;
function mouseMove(ev) {
    ev = ev || window.event;
    var mousePos = mouseCoords(ev);
}
function mouseCoords(ev) {
    if (ev.pageX || ev.pageY) {
        console.log(ev.pageX + "," + ev.pageY)
        return { x: ev.pageX, y: ev.pageY };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

var updateProperty = function (data) {
    console.log(data.parameters[0].id);
}