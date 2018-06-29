<?php
//mini script used when collecting data from the DarkSky API.$_COOKIE
//used to collect current and historial weather data using a given geolocation and time.
include_once "functions.php";
$params = $_POST['latitude'].",".$_POST['longitude'].",".$_POST['time'];
$suffix = "?exclude=currently,flags";
$url = "https://api.darksky.net/forecast/f4ebad3283719b925f1382bf0d361ad5/".$params.$suffix;
$result = getHTML($url);
echo $result;
?>