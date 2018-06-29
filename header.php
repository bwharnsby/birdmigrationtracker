<?php 
include_once 'register.inc.php';
include_once 'db_connect.php';
include_once 'functions.php';
 
sec_session_start();

$_SESSION['days'] = range(1, 31);
$_SESSION['months'] = ["Jan"=>1, "Feb"=>2, "Mar"=>3, "Apr"=>4, "May"=>5, "Jun"=>6, "Jul"=>7, "Aug"=>8, "Sep"=>9, "Oct"=>10, "Nov"=>11, "Dec"=>12];
$_SESSION['years'] = range(2016, 2020);
 
if(login_check($mysqli)) $logged = 'in';
else $logged = 'out';
?>
<!DOCTYPE html>
<html>
<head>
	<title>Bird Migration Viewer</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="">
	<meta name="author" content="">

	<!-- Bootstrap Core CSS -->
	<link href="css/bootstrap.min.css" rel="stylesheet">

	<!-- Custom CSS -->
	<link href="css/stylish-portfolio.css" rel="stylesheet">

	<!-- My CSS-->
	<link href="css/newcss.css" rel="stylesheet">

	<!-- Custom Fonts -->
	<link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">
	
	<!-- UEA Icon -->
	<link href="https://www.uea.ac.uk/uea-html5-theme/images/favicon.ico" rel="Shortcut Icon" />
	
	<!-- Logins -->
	<script type="text/javascript" src="js/sha512.js"></script> 
	<script type="text/javascript" src="js/forms.js"></script> 
	
	<!-- Google JS API -->
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
</head>
<body>
	<div class="container-fluid">