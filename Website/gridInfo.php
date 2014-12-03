<!DOCTYPE html>

<html>

<head>
    <title>Visualizing ICOADS R2.5 Monthly Summary Ocean Data</title>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="js/collectRecordInfo.js"></script>
    <script type="text/javascript" src='js/buildCharts.js'></script>
</head>

<body>
    <?php
	// From server, feed in requested latitude/longitude    
	$lat  = $_POST['lat'];
	$long = $_POST['long'];
	
	echo "<input type=\"hidden\" id=\"latitude\"  value=\"" . $lat  . "\">\n";
	echo "<input type=\"hidden\" id=\"longitude\" value=\"" . $long . "\">\n\n";
    ?>
    
    <p id="serverResponse">Initializing...</p>
    
    <br><br>
    
    <div id="airtemp" style="width: 600px; height: 400px;"></div>
    
    <br><br>
    
    <div id="seatemp" style="width: 600px; height: 400px;"></div>
    
    <br><br>
    
    <div id="specifichumidity" style="width: 600px; height: 400px;"></div>
    
    <br><br>
    
    <div id="relativehumidity" style="width: 600px; height: 400px;"></div>
    
    <br><br>

    <script>
	// Load Record Numbers
	//httpGET("getRecords.php", "getNumRecords");
	
	// Load Charts
	google.load("visualization", "1", {packages:["corechart"]});
	google.setOnLoadCallback(drawEverything);
    </script>
</body>

</html>
