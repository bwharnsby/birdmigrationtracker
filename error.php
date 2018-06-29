<!-- Load the error page if something unexpected happens during login. -->
<?php
$error = filter_input(INPUT_GET, 'err', $filter = FILTER_SANITIZE_STRING);
 
if (! $error) {
    $error = 'Oops! An unknown error happened.';
}
?>
<?php include("header.php"); include("nav.php"); include("banner.php"); ?>
	<div class="row content">
		<div class="col-sm-2 col-md-2 col-lg-2">
			<!-- buffer here -->
			<a class="btn btn-primary" href="index.php" role="button">Return to map view.</a>
		</div>
		<div class="col-sm-8 col-md-8 col-lg-8">
            <h1>There was a problem</h1>
            <p class="error"><?php echo $error; ?></p> 
            <p>You can now go back to the <a href="index.php">login page</a> and log in</p>
		</div>
		<div class="col-sm-2 col-md-2 col-lg-2">
			<!-- buffer here -->
		</div>
	</div>
<?php include("footer.php"); ?>