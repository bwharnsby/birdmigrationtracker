//define map variable.
var map;

/*
 * Handles change of data plotted
 * @returns {undefined}
 */
function submitChange() {
    var birdLabel = [];
    var birdId = [];
    var x = document.getElementById("frm1");

    var i;
    //Getting the labels for the birds from form
    for(i = 0; i < x.length; i += 2) {
        birdLabel.push(x.elements[i].value);
		birdId.push(x.elements[i+1].value);
    }
	
    //Loading the data and drawinf to map
    loadBirdData(birdId, 0);
    initMap(birdId, birdLabel);

	//modify display if 
    var x = document.getElementById('bird_states');
    if (x.style.display !== 'none') {
        x.style.display = 'none';
    }
}

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

function UpdateSlider(value) {
    document.getElementById("demo").innerHTML = value;
}

function CreateSlider(data) {
    var x = document.createElement("INPUT");
    x.type = 'range';
    x.min = 0;
    x.value = data.length;
    x.max = data.length;
    x.id = 'myRange';
    x.oninput = UpdateSlider(x.value);

    var div = document.getElementById("myRange");
    document.getElementById("myRange").max = data.length;

    div.appendChild(x);
}

function cleanSlider() {
    var x = document.createElement("INPUT");
    x.type = 'range';
    x.min = 0;
    x.value = 0;
    x.max = 0;
    x.id = 'myRange';
    x.oninput = UpdateSlider(0);

    var div = document.getElementById("myRange");
    document.getElementById("myRange").max = 0;

    div.appendChild(x);
}

google.load('visualization', '1');
window.onload = function fileLoad() {
    //Placeholder lost of birds and labels
	/*
    var birdIds = [
		'1axF_T58njreOuFwBIc6qvd07DCw3zpOluvFeMYf1', '1y1BRKE3hQfAZbBUK8tasKRtrwMYVNNFBdAl1zji3',
        '16hg7lJhgVZlAm_0Oz7x-8QunXsIXoRMsacqBNbV_', '1YW_ghwhvBXjs2ULPgROS4gEciv9yPiyHglbiEcnS'
	];
	*/
	var birdIds = [
		'1ML3N5K7tZrKx1gAPeE_6f5-55rlBbPeeCmYZb06M'
	];
    var birdLabels = ['Baron', 'Fluffy', 'Sherlock', 'Mendel'];
	
    //1 indicates that states are available for the data set
    loadBirdData(birdIds, 1);
    initMap(birdIds, birdLabels);
	
    //Hide the change data div
	/*
    var x = document.getElementById('bird_states');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    }
	*/
};
/*
 * Uses GET calls to call all the data from fusion tables
 */
function loadBirdData(birdIds, k) {
    var allBirdsLocations = {one: [], two: [], three: [], four: []};
    var ourRequest = new XMLHttpRequest();

    ourRequest.open(
		"GET", 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT * FROM ' + 
		birdIds[0] + '&key=AIzaSyDrZwKrgy_ICOxYb_TlQvRqGcoKqV61GoQ'
	);
    ourRequest.onload = function() {
        var ourData = JSON.parse(ourRequest.responseText);
        var thisBirdLocations = handleResponse(ourData, k);
        allBirdsLocations.one = thisBirdLocations;
        bird2();
    };
    ourRequest.onerror = function() {
        alert("Something went wrong");
    };
    ourRequest.send();

    function bird2() {
        var ourRequest = new XMLHttpRequest();
        ourRequest.open(
			"GET", 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT * FROM ' + 
			birdIds[1] + '&key=AIzaSyAzgHV5fAFf_CxukA8B5z9-4x2JBBBj1sU'
		);
        ourRequest.onload = function() {
            var ourData = JSON.parse(ourRequest.responseText);
            var thisBirdLocations = handleResponse(ourData, k);

            allBirdsLocations.two = thisBirdLocations;
            bird3();

        };
        ourRequest.onerror = function() {
            alert("Something went wrong");
        };
        ourRequest.send();
    }

    function bird3() {
        var ourRequest = new XMLHttpRequest();
        ourRequest.open(
			"GET", 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT * FROM ' + 
			birdIds[2] + '&key=AIzaSyAzgHV5fAFf_CxukA8B5z9-4x2JBBBj1sU'
		);
        ourRequest.onload = function() {
            var ourData = JSON.parse(ourRequest.responseText);
            var thisBirdLocations = handleResponse(ourData, k);

            allBirdsLocations.three = thisBirdLocations;
            bird4();

        };
        ourRequest.onerror = function() {
            alert("Something went wrong");
        };
        ourRequest.send();
    }

    function bird4() {
        var ourRequest = new XMLHttpRequest();
        ourRequest.open(
			"GET", 'https://www.googleapis.com/fusiontables/v2/query?sql=SELECT * FROM ' + 
			birdIds[3] + '&key=AIzaSyAzgHV5fAFf_CxukA8B5z9-4x2JBBBj1sU'
		);
        ourRequest.onload = function() {
            var ourData = JSON.parse(ourRequest.responseText);
            var thisBirdLocations = handleResponse(ourData, k);
            allBirdsLocations.four = thisBirdLocations;
            drawCluster(allBirdsLocations);
            initMap.initaliseArrays(allBirdsLocations);
        };
        ourRequest.onerror = function() {
            alert("Something went wrong");
        };
        ourRequest.send();
    }
}


/*
 * Handles the response
 * Returns a locations array for the birds
 */
function handleResponse(response, hasState) {
    var locationsArray = [];

    for (var i = 0; i < response.rows.length; i++) {
        var lng = response.rows[i][0];
        var lat = response.rows[i][1];
        var time = response.rows[i][2];
        
        if (hasState === 1) {
            var state = response.rows[i][3];
        }
        //Creates a lat long object from the JSON data
        var latlng = new google.maps.LatLng(lat, lng);

        if (hasState === 1) {
            var birdRecord = {latlng: latlng, timestamp: time, hasState: true, states: state};
        }
        else {
            var birdRecord = {latlng: latlng, timestamp: time, hasState: false};
        }

        locationsArray.push(birdRecord);

    }
    return locationsArray;
}

google.setOnLoadCallback(fileLoad);

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
* 	Build the map to display here.
*/
function initMap(tableIds, birdLabels) {
    var markers = [];
	var infowindow = new google.maps.InfoWindow();

	//load the map with zoom and central co-ordinates.
    window.map = new google.maps.Map(
		document.getElementById('map'), 
		{
			center: {lat: 37.151895, lng: -8.64675166699999},
			zoom: 5
		}
	);

    function moveToLocation(lat, lng, zoom) {
        var center = new google.maps.LatLng(lat, lng);
        // using global variable:
        window.map.panTo(center);
        window.map.setZoom(zoom);
    }

    var image = {
        url: 'img/marker.png',
        scaledSize: new google.maps.Size(20, 20) // scaled size
    };

	//baron
    var baronlayer = new google.maps.FusionTablesLayer({
        query: {
            select: 'location-long',
            from: tableIds[0]
			//  from: '1qBdyp73TsjbSdw5QiJGUTOPoLac-Tcyrq-GMVMv1'
        }, 
		options: {
            styleId: 2,
            templateId: 4
        }
    });
    var baronObject = {title: birdLabels[0], bool: true, color: "#f2f220", array: []};

	/*
	//fluffy
    var fluffyLayer = new google.maps.FusionTablesLayer({
        query: {
            select: 'location-long',
            from: tableIds[1]
                    //from: '1cwG49QKg7COvA5XvOgPOk7cvdcy2wPowmTVhyrTF'
        }, 
		options: {
            styleId: 2,
            templateId: 2
        }
    });
    var fluffyObject = {title: birdLabels[1], bool: true, color: "#008000", array: []};
	
	//sherlock
    var sherlocklayer = new google.maps.FusionTablesLayer({
        query: {
            select: 'location-long',
            from: tableIds[2]
                    // from: '11vF0NzM5ly9QR_mTMNHFNrXPMqw7U-QrZRxldDyq'
        }, 
		options: {
            styleId: 2,
            templateId: 2
        }
    });
    var sherlockObject = {title: birdLabels[2], bool: true, color: "#551A8B", array: []};

	//final layer
    var anotherlayer = new google.maps.FusionTablesLayer({
        query: {
            select: 'location-long',
            from: tableIds[3]
                    // from: '11vF0NzM5ly9QR_mTMNHFNrXPMqw7U-QrZRxldDyq'
        }, 
		options: {
            styleId: 2,
            templateId: 2
        }
    });
	var anotherLayerObject = {title: birdLabels[3], bool: true, color: "#FF0000", array: []};
    */
	//add all to the map.
	baronlayer.setMap(window.map);
	/*
    fluffyLayer.setMap(window.map);
    sherlocklayer.setMap(window.map);
    anotherlayer.setMap(window.map);
	*/
   
    //Baron Button
    var BaronDiv = document.createElement('div');
    var centerControl = new ToggleLayers(BaronDiv, window.map, baronObject, baronlayer);
    BaronDiv.index = 1;
    //window.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(BaronDiv);
	document.getElementById('map-settings').appendChild(BaronDiv);
	/*
    //Alonzo Button
    var FluffyDiv = document.createElement('div');
    var centerControl1 = new ToggleLayers(FluffyDiv, window.map, fluffyObject, fluffyLayer);
    FluffyDiv.index = 1;
    window.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(FluffyDiv);
	
    //Bucket Button
    var SherlockDiv = document.createElement('div');
    var centerControl1 = new ToggleLayers(SherlockDiv, window.map, sherlockObject, sherlocklayer);
    SherlockDiv.index = 1;
    window.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(SherlockDiv);
	
    //Bucket Button
    var AnotherDiv = document.createElement('div');
    var centerControl1 = new ToggleLayers(AnotherDiv, window.map, anotherLayerObject, anotherlayer);
    AnotherDiv.index = 1;
    window.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(AnotherDiv);
	*/
	//initialise arrays for all birds will be added to the map.
    initMap.initaliseArrays = function(allBirds) {
        moveToLocation(allBirds.one[0].latlng.lat(), allBirds.one[0].latlng.lng(), 5);
        baronObject.array = allBirds.one;
        //fluffyObject.array = allBirds.two;
        //sherlockObject.array = allBirds.three;
        //anotherLayerObject.array = allBirds.four;
    };

	/*
	 * Ensures that only one bird is on to allow the slider to work
	 */
    initMap.getBirdOn = function(value) {
        //var allBirdObjects = [baronObject, fluffyObject, sherlockObject, anotherLayerObject];
        var allBirdObjects = [baronObject];
        var trueCount = 0;
        var i;

        for(i = 0; i < allBirdObjects.length; i++) {
            if(allBirdObjects[i].bool === true) {
                trueCount++;
            }
        }
		
        //If there is only one bird currently on
        if (trueCount === 1) {
            for (i = 0; i < allBirdObjects.length; i++) {
                if (allBirdObjects[i].bool === true) {
                    CreateSlider(allBirdObjects[i].array);
                    sliderValue(allBirdObjects[i].array, value);
                    UpdateSlider(value);
                }
            }
        } 
		else {
            cleanSlider();
            clearMarkerArray();
        }
    };

	/*
	 * Show time and date for location the slider is currently on
	 */
    function sliderValue(bird, value) {
        moveToLocation(bird[value].latlng.lat(), bird[value].latlng.lng(), 8);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(bird[value].latlng.lat(), bird[value].latlng.lng()),
            map: window.map,
            icon: image
        });

        infowindow.setContent(bird[value].timestamp);
        infowindow.open(window.map, marker);
        markers.push(marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);
		
        setTimeout(function() {marker.setAnimation(null);}, 750);
    }
  
    function clearMarkerArray() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
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
    };

    function clearArray() {
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
}


function drawCluster(allBirds) {
    var markerCluster;

    //Combine all birds data to produce the cluster
    var combined1 = allBirds.one.concat(allBirds.two);
    var combined2 = allBirds.three.concat(allBirds.four);
    var combined = combined1.concat(combined2);

    var clusterObject = {title: "Cluster map", bool: false, varO: markerCluster, locations: combined, map: window.map};
    //ClusterMap stuff
    var ClusterMapDiv = document.createElement('div');
    var centerControl1 = new ClusterToMap(ClusterMapDiv, clusterObject);
    ClusterMapDiv.index = 1;
    window.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(ClusterMapDiv);

    if(allBirds.one[0].hasState === true) {
        showStates(combined);
    }
}


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

