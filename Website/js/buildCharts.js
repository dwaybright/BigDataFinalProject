var recordData = null;
var airTempData;
var seaTempData;
var specificHumidityData;
var relativeHumidityData;
var timeLength = 5;
var lastLatitude = null;
var lastLongitude = null;


function initCharts() {
    document.getElementById("serverResponse").innerHTML = "Initializing...";
    
    lastLatitude = document.getElementById("lat").value;
    lastLongitude = document.getElementById("long").value;
    
    drawEverything();
    
    document.getElementById("serverResponse").innerHTML = "Chart Update Complete";
}

function updateCharts() {
    document.getElementById("serverResponse").innerHTML = "Updating Charts...";
    
    var lat  = document.getElementById("lat").value;
    var long = document.getElementById("long").value;
    
    if ( lat != lastLatitude || long != lastLongitude ) {
        drawEverything();
    }
    
    lastLatitude = lat;
    longLatitude = long;
    
    document.getElementById("serverResponse").innerHTML = "Chart Update Complete";
}

// Entry point - Collects Data then Plots
function drawEverything() {    
    collectData();
    drawCharts();
}

function reDrawOnly() {
    drawCharts();
}

// Retrieve data for this lat/long 
function collectData() {
    var lat  = document.getElementById("lat").value;
    var long = document.getElementById("long").value;
    
    // Loads records into global var "recordData"
    getDataForLoc(lat, long);
}

// Draw Charts after Data is collected
function drawCharts() {
    drawAirTempChart();
    drawSeaTempChart();
    drawSpecificHumidityChart();
    drawRelativeHumidityChart();
}

function getChartDataTable( variableLabel, timeLimit ) {    
    // List Dates from most recent to least recent
    var keys = Object.keys(recordData);
    
    if ( keys.length == 0 ) {
        return [];
    }
    
    var tempData = [ ['Month', 'Mean', 'Stdev+1', 'Stdev-1'] ];
    
    var lastPoint = recordData[ keys[ keys.length-1 ] ]['Date'];
    var lastDate = lastPoint.split("-");
    var month = parseInt(lastDate[1]);
    var year  = parseInt(lastDate[0]) - timeLimit;
    var tempDate, label;
    
    
    // Build data set
    for( var i = 0; i < (timeLimit * 12); i++ ){
        // Start one month forward and "timeLimit" years back
        month++;
        
        if ( month == 13 ) {
            month = 1;
            year++;
        }
        
        // Build tempDate key      
        if( month < 10 ) {
            tempDate = year + "-0" + month + "-01";
            label    = year + "-0" + month;
        } else {
            tempDate = year + "-" + month + "-01";
            label    = year + "-" + month;
        }
        
        // Build Record to Display
        if ( tempDate in recordData ) {
            var tempAir = recordData[tempDate]['Variables'][variableLabel];
            
            var mean  = (Math.round(tempAir['mean']  * 10)) / 10;
            var stdev = (Math.round(tempAir['stdev'] * 10)) / 10;
            
            if ( mean < -200 ) {
                tempData.push( [ label, null, null, null ] );
            }
            else if (stdev < -200 ) {
                tempData.push( [ label, mean, null, null ] );
            }
            else {
                tempData.push( [ label, mean, mean + stdev, mean - stdev ] );
            }
        } else {
            tempData.push( [ label, null, null, null ] );
        }
    }
    
    return tempData;
}

function drawAirTempChart() {    
    var data = google.visualization.arrayToDataTable( getChartDataTable( 'A', timeLength ) );
    
    // Set options
    var options = {
        title : 'Air Temperature',
        vAxis : { title : "Celsius" },
        curveType : 'function',
        legend : { position: 'bottom' },
        backgroundColor : '#AFEEEE',
        interpolateNulls: true
    };
    
    // Create chart and draw it!
    var chart = new google.visualization.LineChart( document.getElementById("airtemp") );
    chart.draw(data, options);
}

function drawSeaTempChart() {
    var data = google.visualization.arrayToDataTable(getChartDataTable( 'S', timeLength ));
    
    var options = {
        title : 'Sea Temperature',
        vAxis : { title : "Celsius" },
        curveType : 'function',
        legend : { position: 'bottom' },
        backgroundColor : '#98FB98'
    };
    
    var chart = new google.visualization.LineChart( document.getElementById("seatemp") );
    
    chart.draw(data, options);
}

function drawSpecificHumidityChart() {
    var data = google.visualization.arrayToDataTable(getChartDataTable( 'Q', timeLength ));
    
    var options = {
        title : 'Specific Humidity',
        vAxis : { title : "g / kg" },
        curveType : 'function',
        legend : { position: 'bottom' },
        backgroundColor : '#98FB98'
    };
    
    var chart = new google.visualization.LineChart( document.getElementById("specifichumidity") );
    
    chart.draw(data, options);
}

function drawRelativeHumidityChart() {
    var data = google.visualization.arrayToDataTable(getChartDataTable( 'R', timeLength ));
    
    var options = {
        title : 'Relative Humidity',
        vAxis : { title : "%" },
        curveType : 'function',
        legend : { position: 'bottom' },
        backgroundColor : '#98FB98'
    };
    
    var chart = new google.visualization.LineChart( document.getElementById("relativehumidity") );
    
    chart.draw(data, options);
}

