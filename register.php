<!-- Allows the user to sign up for an account and enter their details. -->
<?php include("header.php"); include("nav.php"); include("banner.php"); ?>
	<div class="row content">
		<div class="col-sm-2 col-md-2 col-lg-2">
			<!-- Return to index mainpage. -->
			<a class="btn btn-primary" href="index.php" role="button">Return to map view.</a>
		</div>
		<div class="col-sm-8 col-md-8 col-lg-8">
			<!-- 
				Registration form to be output if the POST variables are not set or if the registration script caused an error. 
			-->
			<h1>Register with us</h1>
			<?php if(!empty($error_msg)) echo $error_msg; ?>
			
			<!-- Rules to follow when signing up as a user. --> 
			<ul class="list-group">
				<li>Usernames may contain only digits, upper and lowercase letters and underscores</li>
				<li>Emails must have a valid email format</li>
				<li>Passwords must be at least 6 characters long</li>
				<li>Passwords must contain
					<ul>
						<li>At least one uppercase letter (A..Z)</li>
						<li>At least one lowercase letter (a..z)</li>
						<li>At least one number (0..9)</li>
					</ul>
				</li>
				<li>Your password and confirmation must match exactly</li>
			</ul>

			<!-- Display form here. -->
			<form action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>" method="post" name="registration_form">
				<div class="form-group">
					<label for="username">Username: </label><input type='text' name='username' id='username' class="form-control"/>
				</div>
				<div class="form-group">
					<label for="email">Email: </label><input type="text" name="email" id="email" class="form-control"/>
				</div>
				<div class="form-group">
					<label for="password">Password: </label><input type="password" name="password" id="password" class="form-control"/>
				</div>
				<div class="form-group">
					<label for="confirmpwd">Confirm password: </label><input type="password" name="confirmpwd" id="confirmpwd" class="form-control"/>
				</div>
				<input type="button" value="Register" 
					onclick="return regformhash(
						this.form,
						this.form.username,
						this.form.email,
						this.form.password,
						this.form.confirmpwd
					);" 
				/> 
			</form>
			<br>
			<!-- Provide link to return to index.php -->
			<p>Return to the <a href="index.php">login page</a>.</p>
		</div>
		<div class="col-sm-2 col-md-2 col-lg-2">
			<!-- buffer here -->
		</div>
	</div>
<?php include("footer.php"); ?>	