// Global Variables
var worldImage = new Image();
worldImage.src = "images/world2.png";
worldImage.onload = function() { drawWorld(); };


// Ensure lat and long stay between -180 and 180
function varCheck(id) {
    var val = document.getElementById(id).value;
    var min, max;
    
    if ( id == 'lat' ) {
        min = -90;
        max = 90;
    } else {
        min = -180;
        max = 180;
    }
    
    if ( isNaN(val) ) {
        document.getElementById(id).value = 0;
        return;
    }
    
    // Make sure val is an integer
    if ( ! isInt(val) ) {
        val = Math.round(val);
    }
    
    // Make sure it is divisible by 2
    if ( val % 2 ) {
        val++;
    }
    
    // Ensure Outer Ranges
    if ( val <= min ) {
        document.getElementById(id).value = min;
    }
    else if (val >= max)  {
        document.getElementById(id).value = max;
    }
    else {
        document.getElementById(id).value = val;
    }
    
    if ( id == 'lat' ) {
        $("#latSlider").slider('option', 'value', val);
    } else {
        $("#longSlider").slider('option', 'value', val);
    }
    
    // Update Canvas
    drawWorld();
    
    return;
}

function isInt(n) {
    var er = /^-?[0-9]+$/;
    
    return er.test(n);
}

function drawWorld() {
    var c   = document.getElementById("world");
    var ctx = c.getContext("2d");
    
    ctx.clearRect(0,0, c.width, c.height);
    ctx.drawImage(worldImage, 0, 0);
    
    drawWorldPosition();
}

function drawWorldPosition() {            
    var lat  = document.getElementById("lat").value;
    var long = document.getElementById("long").value;
    
    var x = 0;
    var y = 0;
    
    // Convert Longitude first
    if ( Math.abs(long) < 181 ) {
        x = Math.round(326 + (long * 1.675 ));
    }
    
    // Convert Latitude second
    if ( Math.abs(lat) < 41 ) {
        y = Math.round(218 - (lat  * 1.75));
    }
    else if ( lat > 0 && lat < 81 ) {
        y = Math.round(148 - ((lat-40)  * 2.6));
    }
    else if ( lat < 0 && lat > -81 ) {
        y = Math.round(288 + ((Math.abs(lat)-40)  * 2.6));
    }
    else if ( lat < -80 ) {
        y = Math.round(392 + ((Math.abs(lat)-80)  * 1));
    }
    else {
        y = Math.round(44 - ((lat-80)  * 1.5));
    }
    
    // Load Canvas Variables
    var c   = document.getElementById("world");
    var ctx = c.getContext("2d");
    
    // Create circle
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    
    ctx.fillStyle = "#FFFF00";
    ctx.fill();
    
}

$(function() {
    $( "#latSlider" ).slider({
        orientation: "vertical",
        range: false,
        min: -90,
        max: 90,
        value: 0,
        step: 2,
        slide: function( event, ui ) {
            $( "#lat" ).val( ui.value );
            drawWorld();
        }
    });
    $( "#longSlider" ).slider({
        orientation: "horizontal",
        range: false,
        min: -180,
        max: 180,
        value: 0,
        step: 2,
        slide: function( event, ui ) {
            $( "#long" ).val( ui.value );
            drawWorld();
        }
    });
});