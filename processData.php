<?php
//data used to add bird data from forms to the CSV file containing all the bird data.

$results = [];
$errors = false;

foreach($_POST as $p) {
	if(!isset($p) || empty($p)) {
		$errors = true;
		break;
	}
	$results[] = htmlspecialchars($p);
}

if($errors) {
	echo "<h2>Data contains errors.</h2><br><a href='javascript:history.back()'>Go back to data form.</a>";
}
else {
	//open file
	$file = fopen("data/birdinfo.csv", "a+");
	//write to the file
	fputcsv($file, $results);
	//close the file.
	fclose($file);
	//print display
	echo "<h2>Bird data successfully added!</h2><br><a href='index.php'>Return to bird viewing page.</a>";
}
?>

