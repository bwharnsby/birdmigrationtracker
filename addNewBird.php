<!-- Include header, navigation and banner onto the page -->
<?php include("header.php"); include("nav.php"); include("banner.php"); ?>		
	<div class="row content">
		<!-- Link back to the map view -->
		<div class="col-sm-2 col-md-2 col-lg-2">
			<a class="btn btn-primary" href="index.php" role="button">Return to map view.</a>
		</div>
		<!-- form to add new bird. -->
		<div class="col-sm-8 col-md-8 col-lg-8">
			<h2>Enter new bird data here:</h2>
			<form method="post" action="processData.php">
			  <div class="form-group">
				<label for="nameOfBird">Name of Bird:</label>
				<input type="text" class="form-control" id="nameOfBird" name="nameOfBird" placeholder="Enter name of bird here...">
			  </div>
			  <div class="form-group">
				<label for="series">Series:</label>
				<select class="form-control" id="series" name="series">
					<?php foreach(array("White Storks 2016") as $w) echo "<option value='$w'>$w</option>"; ?>
				</select>
			  </div>
			  <div class="form-group">
				<label for="startYear">Start Year:</label>
				<select class="form-control" id="startYear" name="startYear">
					<?php for($i = 2000; $i <= date('Y'); $i++) echo "<option value='$i'>$i</option>"; ?>
				</select>
			  </div>
			  <div class="form-group">
				<label for="endYear">End Year:</label>
				<select class="form-control" id="endYear" name="endYear">
					<?php for($i = 2000; $i <= date('Y') + 5; $i++) echo "<option value='$i'>$i</option>"; ?>
				</select>
			  </div>
			  <div class="form-group">
				<label for="tableCode">Google Fusion Table Code:</label>
				<input type="text" class="form-control" id="tableCode" name="tableCode" placeholder="Enter table code...">
			  </div>
			  <button type="submit" class="btn btn-primary">Submit</button>
			</form>
		</div>
		<!-- buffer here -->
		<div class="col-sm-2 col-md-2 col-lg-2">
			<!-- buffer here -->
		</div>
	</div>
<?php include("footer.php"); ?>	