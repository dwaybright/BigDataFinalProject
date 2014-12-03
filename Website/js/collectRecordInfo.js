var xmlhttp = null;

// Collects data for location
function getDataForLoc(lat, long) {
    var formData = new FormData();
    formData.append('lat_send', lat);
    formData.append('long_send', long);
    
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    document.getElementById("serverResponse").innerHTML = "Sending Request...";
    
    xmlhttp.open("POST", "getRecords.php", false);
    xmlhttp.onreadystatechange = dataReceived;
    xmlhttp.send(formData);
}

function dataReceived() {
    if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
        document.getElementById("serverResponse").innerHTML = "Request Received...";
        
        recordData = JSON.parse(xmlhttp.responseText);
    }
}