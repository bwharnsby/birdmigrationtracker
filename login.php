<!-- Load the page to allow the user to login. -->
<?php include("header.php"); include("nav.php"); include("banner.php"); ?>
	<div class="row content">
		<div class="col-sm-2 col-md-2 col-lg-2">
			<!-- include link to return back to index.php -->
			<a class="btn btn-primary" href="index.php" role="button">Return to map view.</a>
		</div>

		<div class="col-sm-8 col-md-8 col-lg-8">
			<h2>Enter Your Details</h2>
			<?php
				if (isset($_GET['error'])) {
					echo '<p class="error">Error Logging In!</p>';
				}
			?> 
			<!-- Include form to allow user to enter details. -->
			<form action="processlogin.php" method="post" name="login_form">
				<div class="form-group">
					<label for="email">Email: </label>
					<input type="text" name="email" class="form-control" />
				</div>
				<div class="form-group">
					<label for="password">Password: </label>
					<input type="password" name="password" id="password" class="form-control" />
				</div>
				<input type="submit" value="Login" class="btn btn-default" onclick="formhash(this.form, this.form.password);"/>
			</form>
			<br>
			<?php
				// check to see if user is logged in and then display appropriate settings.
				if(login_check($mysqli)) {
					echo '<p>Currently logged ' . $logged . ' as ' . htmlentities($_SESSION['username']) . '.</p>';
					echo '<p>Do you want to change user? <a href="includes/logout.php">Log out</a>.</p>';
				} 
				else {
					echo '<p>Currently logged ' . $logged . '.</p>';
					echo "<p>If you don't have a login, please <a href='register.php'>register</a></p>";
				}
			?>   
		</div>
			   
		<div class="col-sm-2 col-md-2 col-lg-2">
			<!-- buffer here -->
		</div>
	</div>
<?php include("footer.php"); ?>	