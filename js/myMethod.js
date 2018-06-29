/*****************************************************************************************************\
|******************************************* MAIN METHODS ********************************************|
\*****************************************************************************************************/

/**
 * processes the dates given from the filter options on the page and makes them
 * ready for the SQL call to the Fusion Tables.
 */
function buildDatesAndLaunch(...args) {
    if(sessionStorage.getItem('birdName') == undefined) {
        alert("Please select a bird first!");
        return;
    }
    var birdName = sessionStorage.getItem('birdName');
    var from = args[2] + " " + args[1] + " " + args[0];
    var to = args[5] + " " + args[4] + " " + args[3];
    fileLoad(birdName, from, to);
}

/**
 * Given the table id, load the data from Fusion Tables, load Map and display data.
 */
function fileLoad(birdName, ...filterArgs) {
	var birdTableId = '1yCCPuOiwtUsAwK_5xNRrffA7bqzPYQMNG74E_X0-';
    var birdButtonLabel = 'Toggle On/Off';
    sessionStorage.setItem('birdName', birdName);
    //prevent bad calls
    if(birdName == undefined) {
        alert("Please choose a bird!");
        return;
	}
    //build query.
    var sqlQuery = "SELECT * FROM " + birdTableId;
    var filterClause = " WHERE 'Name'='" + birdName + "'";
    if(filterArgs.length > 0) {
        filterClause += " AND 'Timestamp'>='" + filterArgs[0] + "' AND 'Timestamp'<='" + filterArgs[1] + "'";
    }
    sqlQuery += filterClause;
	
    //1 indicates that states are available for the data set
    loadBirdData(birdTableId, birdName, sqlQuery, 1);
    initMap(birdTableId, birdName, filterClause, birdButtonLabel);
};

/*
* Retrieve weather data, from a given geolocation and date.
* WARNING --> To be changed and upgraded to be called once and stored with the GPS data.
*/
function getWeatherData(birdLocations) {
	var weatherData = [];
	for(var i = 0; i < birdLocations.length; i++) {
        //call every 200th marker.
		if(i % 200 == 0 && i > 0) {
			var lat = birdLocations[i]['pos'].lat();
			var lng = birdLocations[i]['pos'].lng();
			var time = birdLocations[i]['timestamp'];
			var m = moment(time, 'DD/MM/YYYY hh:mm:ss');
            var seconds = Date.parse(m.format()) / 1000;
            //get the data from DarkSky and add it to the current array.
			$.post('send.php', {latitude: lat, longitude: lng, time: seconds}).done(function(d){weatherData.push(processWeatherData(JSON.parse(d)));});
		}
    }
    //pass the data to the map to store.
	initMap.initialiseWeather(weatherData);
}

/**
 * setFilters changes the date filters so it automatically starts from the earliest starting point
 * to the latest ending point.
 * @param {*} locations --> contains a list of bird markers.
 */
function setFilters(locations) {
    var first = moment(locations[0].timestamp, 'DD/MM/YYYY hh:mm:ss');
    var last = moment(locations[locations.length-1].timestamp, 'DD/MM/YYYY hh:mm:ss');
    document.getElementById('fromDay').value = first.format('D');
    document.getElementById('fromMonth').value = first.format('MMM');
    document.getElementById('fromYear').value = first.format('YYYY');
    document.getElementById('toDay').value = last.format('D');
    document.getElementById('toMonth').value = last.format('MMM');
    document.getElementById('toYear').value = last.format('YYYY');
}

/*
* Extract components from response.
*/
function processWeatherData(response) {
	return response.hourly.summary;
}

/*
 * Uses GET calls to call all the data from fusion tables
 */
function loadBirdData(birdTableId, birdName, sqlQuery, k) {
    var birdLocations = {};
    var ourRequest = new XMLHttpRequest();
	var url = "https://www.googleapis.com/fusiontables/v2/query?sql=" +sqlQuery+ "&key=AIzaSyDrZwKrgy_ICOxYb_TlQvRqGcoKqV61GoQ";
    //prepare the request...
    ourRequest.open("GET", url);
    ourRequest.onload = function() {
        //if successful..
        var ourData = JSON.parse(ourRequest.responseText);
        if(ourData.rows == undefined) {
            return;
        }
        //process the locations.
        birdLocations = handleResponse(ourData, k);
        //get weather data and set the filters.
        getWeatherData(birdLocations);
        setFilters(birdLocations);
		//let the map store the data and prepare the slider to work immediately onload.
        initMap.initaliseArrays(birdLocations);
        initMap.getBirdOn(0);
    };
    ourRequest.onerror = function() {
        alert("Something went wrong");
    };
    ourRequest.send();
}


/*
 * Handles the response
 * Returns a locations array for the birds
 */
function handleResponse(response, hasState) {
    var locationsArray = [];
    if(response.rows == undefined) {
        alert("No data found.");
        return;
    }
    for (var i = 0; i < response.rows.length; i++) {
        //typical format from fusion table.
		//["430 Sherlock", -7.957661667, 37.85022, "16/06/2016 05:13:13", "0"]
        var lng = response.rows[i][1];
        var lat = response.rows[i][2];
        var time = response.rows[i][3];
        
        if (hasState === 1) {
            var state = response.rows[i][4];
        }
        //Creates a lat long object from the JSON data
        var latlng = new google.maps.LatLng(lat, lng);

        if (hasState === 1) {
            var birdRecord = {pos: latlng, timestamp: time, hasState: true, states: state};
        }
        else {
            var birdRecord = {pos: latlng, timestamp: time, hasState: false};
        }
        locationsArray.push(birdRecord);
    }
    return locationsArray;
}

/*
* 	Build the map to display here.
*/
function initMap(birdTableId, birdName, filterClause, birdButtonLabel) {
    var markers = [];
	var infowindow = new google.maps.InfoWindow();

	//load the map with zoom and central co-ordinates.
    var map = new google.maps.Map(
		document.getElementById('map'), 
		{
			center: {lat: 37.151895, lng: -8.64675166699999},
			zoom: 7
		}
	);

	//move the map to the given location at a given zoom level.
    function moveToLocation(lat, lng, zoom) {
        var center = new google.maps.LatLng(lat, lng);
        // using global variable:
        map.panTo(center);
        map.setZoom(zoom);
    }

    //if not bird name is supplied...
	if(birdName !== undefined) {
		var img = {
			url: 'img/marker.png',
			scaledSize: new google.maps.Size(20, 20) // scaled size
        };
        
        //add all to the map.
        var selectedLayer = changeViewOfMarkers(map, birdTableId, filterClause);
		selectedLayer.setMap(map);

		//General Button
		var swi = document.getElementById('switch');
		if(swi !== null) {
			while(swi.lastChild) {
				swi.removeChild(swi.lastChild);
			}
		}
        var switchDiv = document.createElement('div');
        
        //create button with all data.
        var selectedObj = {title: birdButtonLabel, bool: true, color: "#ff0000", array: [], weather: []};
		var centerControl = new ToggleLayers(switchDiv, map, selectedObj, selectedLayer);
		switchDiv.index = 1;
        swi.appendChild(switchDiv);
        
        /**
         * INITMAP INTERNAL FUNCTIONS.
         */
		
		//initialise arrays for all birds will be added to the map.
		initMap.initaliseArrays = function(allBirds) {
			moveToLocation(allBirds[0].pos.lat(), allBirds[0].pos.lng(), 5);
			selectedObj.array = allBirds;
		};
        
        //initialise the weather data to the map object.
		initMap.initialiseWeather = function(weather) {
			selectedObj.weather = weather;
		};

		/*
		 * Ensures that only one bird is on to allow the slider to work
		 */
		initMap.getBirdOn = function(value) {
			var trueCount = 0;
			var i;
			if(selectedObj.bool == true) {trueCount++;}
			//If there is only one bird currently on
			if (trueCount == 1) {
				if(selectedObj.bool == true) {
					createSlider(selectedObj.array);
                    sliderValue(selectedObj.array, value);
					updateSlider(
                        "Starting at: " + selectedObj.array[0].timestamp + "<br>" +
                        "Currently at: <strong>" + selectedObj.array[value].timestamp + "</strong><br>" +
                        "Finishing at: " + selectedObj.array[selectedObj.array.length-1].timestamp
                    );
				}
			} 
		};
    } //if name is undefined.
    
    /**
     * changeViewOfMarkers() filters done the data of a given bird so less or more markers are shown.
     * @param {*} map --> current Google Map var.
     * @param {*} birdTableId --> the hex api key
     * @param {*} whereClause --> the data to filter all info about the bird.
     */
    function changeViewOfMarkers(map, birdTableId, whereClause) {
        //the selected bird will be queried.
        whereClause = whereClause.split(" WHERE ").pop();
		return new google.maps.FusionTablesLayer({
			map: map,
			query: {
				select: "Longitude",
				from: birdTableId,
				where: whereClause
			}, 
			options: {
				styleId: 2,
				templateId: 4
			}
		});
    }

	/*
	 * Show time and date for location the slider is currently on
	 */
    function sliderValue(bird, value) {
        moveToLocation(bird[value].pos.lat(), bird[value].pos.lng(), 8);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(bird[value].pos.lat(), bird[value].pos.lng()),
            map: map,
            icon: img
        });

        infowindow.setContent(bird[value].timestamp);
        infowindow.open(window.map, marker);
        markers.push(marker);
		//console.log("markers " + markers);
        marker.setAnimation(google.maps.Animation.BOUNCE);
		
        setTimeout(function() {marker.setAnimation(null);}, 750);
    }
  
    function clearMarkerArray() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
} //end initMap function.

/*****************************************************************************************************\
|******************************************* SLIDER METHODS ******************************************|
\*****************************************************************************************************/

/*
 * Shows the hidden diov that allows for changing data plotted
 * @returns {undefined}
 */
function changeData() {
    var x = document.getElementById('map-display');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } 
	else {
        x.style.display = 'none';
    }
}

/**
 * update the slider with the new information.
 * @param {*} value -- value to update
 */
function updateSlider(value) {
    document.getElementById("demo").innerHTML = value;
}

/**
 * createSlider creates a new slider when a new bird is added to the map.
 * @param {*} data -- data about the bird is supplied.
 */
function createSlider(data) {
    var x = document.createElement("INPUT");
    x.type = 'range';
    x.min = 0;
    x.value = data.length;
    x.max = data.length;
    x.id = 'myRange';
    x.oninput = updateSlider(x.value);

    var div = document.getElementById("myRange");
    document.getElementById("myRange").max = data.length;

    div.appendChild(x);
}

/**
 * cleanSlider() clears the slider when a new bird is used or reset.
 */
function cleanSlider() {
    var x = document.createElement("INPUT");
    x.type = 'range';
    x.min = 0;
    x.value = 0;
    x.max = 0;
    x.id = 'myRange';
    x.oninput = updateSlider(0);

    var div = document.getElementById("myRange");
    document.getElementById("myRange").max = 0;

    div.appendChild(x);
}

/* Not required now */
//google.setOnLoadCallback(fileLoad);

function ToggleLayers(controlDiv, map, layerObject, layer) {
    // Set CSS for the control border.
    var controlUI = controlButton("Click to display this birds flight path", controlDiv);
    var controlText = controlTextFun(controlUI, layerObject);
    // CreateSlider(layerObject.array);
    // Setup the click  listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
        if (layerObject.bool) {
            layerObject.bool = false;
            layer.setMap(null);
            controlText.style.color = 'rgb(25,25,25)';
            initMap.getBirdOn(0);
        }
        else {
            controlText.style.color = layerObject.color;
            layerObject.bool = true;
            layer.setMap(map);
            initMap.getBirdOn(0);
        }
    });
}

/*
*	Create a Control Button Dynamically using JS and CSS.
*/
function controlButton(title, controlDiv) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.width = '120px';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.margin = '15px';
    controlUI.style.textAlign = 'center';
    controlUI.title = '⋎';
    controlDiv.appendChild(controlUI);
    return controlUI;
}

/*
*	Set the text and styling of the button here.
*/
function controlTextFun(controlUI, layerObject) {
    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = layerObject.color;
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = layerObject.title;
    controlUI.appendChild(controlText);
    return controlText;
}

/*
 * Draws the specified state to the map
 */
function showStates(array) {
    var allBirds = array;
    var markers = [];

    showStates.drawState = function(index) {
        clearArray();
        var image = {
            url: 'img/State.png',
            scaledSize: new google.maps.Size(20, 20) // scaled size
        };
        var i = 0;
        for(i; i < allBirds.length; i++) {
            if (allBirds[i].states === index.toString()) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(allBirds[i].latlng.lat(), allBirds[i].latlng.lng()),
                    map: window.map,
                    icon: image
                });
                markers.push(marker);
				
            }
        }
		console.log(markers);
    };

    /**
     * Clear markers when a new bird is loaded.
     */
    function clearArray() {
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
}

/*****************************************************************************************************\
|****************************************** CLUSTER METHODS ******************************************|
|****************************** NOTE -- NONE OF THESE METHODS ARE USED. ******************************|
\*****************************************************************************************************/

/**
 * Draw the cluster onto the Google Maps.
 */
function drawCluster(allBirds) {
    var markerCluster;

    var clusterObject = {
        title: "Cluster map", bool: false, varO: markerCluster, locations: allBirds, map: window.map
    };
    //ClusterMap stuff
    var ClusterMapDiv = document.createElement('div');
    var centerControl1 = new ClusterToMap(ClusterMapDiv, clusterObject);
    ClusterMapDiv.index = 1;
    window.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(ClusterMapDiv);

    if(allBirds.one[0].hasState === true) {
        showStates(combined);
    }
}

/**
 * NOT USED...
 * @param {*} controlDiv 
 * @param {*} object 
 */
function ClusterToMap(controlDiv, object) {
    // Set CSS for the control border.
    var controlUI = controlButton("Click to display clusters", controlDiv);
    var controlText = controlTextFun(controlUI, object);

    // Setup the click event listeners: 
    controlUI.addEventListener('click', function() {
        if (object.bool === false) {
            object.bool = true;
            addCluster(object);
            controlText.style.color = '#FF5733';
        }
        else {
            controlText.style.color = 'rgb(25,25,25)';
            object.bool = false;
            addCluster(object);
        }
    });
}

/**
 * NOT USED...
 * adds a complied cluster to the map. 
 * @param {*} object 
 */
function addCluster(object) {
    if(object.bool) {
        var image = {
            url: 'img/marker.png',
            scaledSize: new google.maps.Size(20, 20) // scaled size
        };
        var markers = [];
        for (var i = 0; i < object.locations.length; i++) {
            var marker = new google.maps.Marker({'position': object.locations[i].latlng});
            markers.push(marker);
        }
        object.varO = new MarkerClusterer(object.map, markers, {imagePath: 'img/m'});
    }
    else {
        object.varO.clearMarkers();
        object.varO.removeMarkers(markers, false);
    }
}

/**
 * For testing, print out the co-ordinates in a readable way.
 * @param {*} lat - latitude of a point.
 * @param {*} lng - longitude of a point.
 */
function printCoord(lat, lng) {
	console.log(lat + ", " + lng);
}