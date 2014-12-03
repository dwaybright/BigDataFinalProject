<?php
    // Currently only supports Group 3
    function getVariables($hexString, $group) {
        if( $group == "3" ) {
            $variables = array(
                "S" => generateVariable(0, $hexString, 0.01,  -501, 1,  4501),
                "A" => generateVariable(1, $hexString, 0.01, -8801, 1, 14601),
                "Q" => generateVariable(2, $hexString, 0.01,    -1, 1,  4001),
                "R" => generateVariable(3, $hexString, 0.1,     -1, 1,  1001)
            );
            
            return $variables;
        }
    }

    // Given parameters for a variable, parses information out of compressed record
    function generateVariable($offset, $hexString, $units, $base, $codeLOW, $codeHIGH) {
        $s1_code     = hexdec(substr($hexString, 16+($offset*4), 4));
	$s3_code     = hexdec(substr($hexString, 32+($offset*4), 4));
	$s5_code     = hexdec(substr($hexString, 48+($offset*4), 4));
	$mean_code   = hexdec(substr($hexString, 64+($offset*4), 4));
	$numObs_code = hexdec(substr($hexString, 80+($offset*4), 4));
	$stdev_code  = hexdec(substr($hexString, 96+($offset*4), 4));
	$mDay_code   = hexdec(substr($hexString, 112+$offset, 1));
	$ht_code     = hexdec(substr($hexString, 116+$offset, 1));
	$x_code      = hexdec(substr($hexString, 120+$offset, 1));
	$y_code      = hexdec(substr($hexString, 124+$offset, 1));

        if( $s1_code >= $codeLOW && $s1_code <= $codeHIGH ) {
            $s1 = ($s1_code + $base) * $units;
        } else {
            $s1 = -9999;
        }
        
        if( $s3_code >= $codeLOW && $s3_code <= $codeHIGH ) {
            $s3 = ($s3_code + $base) * $units;
        } else {
            $s3 = -9999;
        }
        
        if( $s5_code >= $codeLOW && $s5_code <= $codeHIGH ) {
            $s5 = ($s5_code + $base) * $units;
        } else {
            $s5 = -9999;
        }
        
        if( $mean_code >= $codeLOW && $mean_code <= $codeHIGH ) {
            $mean = ($mean_code + $base) * $units;
        } else {
            $mean = -9999;
        }
        
        if( $stdev_code == 0 ) {
            $stdev = -9999;
        } else {
            $stdev = ($stdev_code - 1) * $units;
        }
        
        if( $mDay_code == 0 ) {
            $mDay = -9999;
        } else {
            $mDay = ($mDay_code - 0) * 2;
        }
        
        if( $ht_code == 0 ) {
            $ht = -9999;
        } else {
            $ht = ($ht_code - 1) * 0.1;
        }
        
        // Combine values into array 
        $variable = array(
            "s1" => $s1,
            "s3" => $s3,
            "s5" => $s5,
            "mean" => $mean,
            "numObs" => $numObs_code,
            "stdev" => $stdev,
            "mDay" => $mDay,
            "ht" => $ht
        );
        
        return $variable;
    }

    require 'vendor/autoload.php';
    
    use Aws\DynamoDb\DynamoDbClient;
    use Aws\Common\Enum\Region;
    use Aws\DynamoDb\Enum\Type;
    use Aws\DynamoDb\Enum\KeyType;
    
    try {
        $lat  = $_POST['lat_send'];
        $long = $_POST['long_send'];
        
        //echo $lat;
        //echo $long;
        
        $client = DynamoDbClient::factory(
            array(
                'key'    => 'YOUR KEY',
                'secret' => 'YOUR SECRET KEY',
                'region' => 'YOUR REGION'
            )
        );
        
        $iterator = $client->getIterator("Query", array(
		"TableName" => "MonthlySummaries",
		"IndexName" => "Latitude-Longitude-index",
		"KeyConditions" => array(
			"Latitude" => array(
			    "ComparisonOperator" => "EQ",
			    "AttributeValueList" => array(
				array(Type::N => $lat)
			    )
			),
			"Longitude" => array(
			    "ComparisonOperator" => "EQ",
			    "AttributeValueList" => array(
				array(Type::N => $long)
			    )
			)
		),
		"Select" => "ALL_ATTRIBUTES"
	));
        
	// Each item will contain the attributes we added
	foreach ($iterator as $item) {
            // Unpack the record binary into a string of hex digits
            $rawRecord = base64_decode($item['Record']['S']);
	    $unpacked  = unpack("H*", $rawRecord);
	    $hexString = $unpacked[1];
	    
            if( $item['Month']['N'] < 10 ) {
		$time = $item['Year']['N'] . "-0" . $item['Month']['N'];
	    } else {
		$time = $item['Year']['N'] . "-" . $item['Month']['N'];
	    }
	    
	    $result[$item['Date']['S']] = array(
		"Date"      => $time,
		"Variables" => getVariables($hexString, 3)
	    );
	}
        
        // If there is no data for this grid...
        if( count($result) < 1 ) {
            $result = array();
            echo json_encode($result);
        }
        else {
            // Sort by date (which is the key)
            ksort($result);
            
            // Package for shipping to JavaScript
            $json = json_encode($result);
            
            // Send Query Results
            echo $json;
        }
            
    } catch (Exception $e) {
        echo $e->getMessage();
    }
?>