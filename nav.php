<!-- Include bootstrap style navigation bar -->
<div class="row content">		
	<!-- Static navbar -->
	<nav class="navbar navbar-default">
		<div class="container-fluid">
			<!-- Main Navigation Links displayed here (Left hand side) --> 
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
				  <span class="sr-only">Toggle navigation</span>
				  <span class="icon-bar"></span>
				  <span class="icon-bar"></span>
				  <span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">UEA Bird Migration Viewer</a>
			</div>
			<!-- Main Navigation Links displayed here --> 
			<div id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li class="active"><a href="index.php">Home</a></li>
					<li><a href="#">About</a></li>
					<li><a href="#">Contact</a></li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="#">Action</a></li>
							<li><a href="#">Another action</a></li>
							<li><a href="#">Something else here</a></li>
							<li role="separator" class="divider"></li>
							<li class="dropdown-header">Nav header</li>
							<li><a href="#">Separated link</a></li>
							<li><a href="#">One more separated link</a></li>
						</ul>
					</li>
				</ul>
				<!-- Register/Login links displayed here. --> 
				<ul class="nav navbar-nav navbar-right">
					<?php
						//user is logged in.
						if(login_check($mysqli)) {
							echo '<li class="active"><a href="#">Logged in as: <strong>'.htmlentities($_SESSION['username']).'</strong></a></li>';
							echo '<li><a href="logout.php">Logout</a></li>';
						}
						//user is not logged in.
						else {
							echo '<li><a href="register.php">Register</a></li>';
							echo '<li><a href="login.php">Login</a></li>';
						}
					?>
				</ul>
			</div><!--/.nav-collapse -->
		</div><!--/.container-fluid -->
	</nav>
</div>