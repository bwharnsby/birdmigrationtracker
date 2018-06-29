<!-- Loads the map, with the features and all the settings. -->
<?php include("header.php"); include("nav.php"); include("banner.php"); ?>		
	<div class="row content">
		<div class="col-sm-3 col-md-3 col-lg-3">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4>Choose a bird:</h4>
				</div>
				<!-- Table will be reprocessed upon data about birds. -->
				<div id="scrollable-t">
				<table class="table table-fixed">
					<thead>
						<tr>
							<th class="col-xs-1">#</th>
							<th class="col-xs-4">Bird Name</th>
							<th class="col-xs-4">Picture</th>
							<th class="col-xs-1">Year</th>
							<th class="col-xs-2">View?</th>
						</tr>
					</thead>
					<tbody>
						<?php
							//load bird data from file.
							$file = readFromFile("data/birdinfo.csv");
							//iterate through all birds and print in table.
							$id = 1;
							foreach($file as $birds) {
								if(!empty($birds)) {
									echo "<tr>";
									echo "<td class='col-xs-1'>".$id."</td>";
									echo "<td class='col-xs-4'>".$birds[0]."</td>";
									echo "<td class='col-xs-4'><img src='img/european-white-stork5.jpg' class='stork-img' /></td>";
									echo "<td class='col-xs-1'>".$birds[3]."</td>";
									echo "<td class='col-xs-2'>";
									echo '<a href="javascript:void(0);" onClick="fileLoad(\''.$birds[0].'\')">Toggle</a>';
									echo "</td>";
									echo "</tr>";
									$id++;
								}
							}
						?>
					</tbody>
				</table>
				</div>
			</div>
			<!-- Data options -->
			<div id="data-options">
				<div class="container-fluid">
					<h2>Data Options</h2>
					<?php
						//check to see which user is logged in and settings available to them.
						if(login_check($mysqli)) {
							if(htmlentities($_SESSION['username']) == "admin") {
								echo '<a class="btn btn-primary" href="addNewBird.php" role="button">Clear all data.</a><br><br>';
							}
							echo '<a class="btn btn-primary" href="clearBirdData.php" role="button">Add new bird.</a>';
						}
						else echo 'Please login to add data.';
					?>
					<br>
					<br>
				</div>
			</div>
		</div>
		<div class="col-sm-9 col-md-9 col-lg-9">
			<!-- Map -->
			<div id="contact" class="map">
				<div id="map-display">
					<!-- Map Display -->
				</div>
				<div id="map"></div>
			</div>
			<br>
			<!-- Map Settings -->
			<div id="map-settings">
				<div class="container-fluid">
					<h2>Map Settings</h2>
					<div id="settings">
						<!-- Filter markers on map by particular dates. -->
						<div id="bird_states">
							<h4>Filter by date:</h4>
							<label for="fromMonth">From: </label>
							<select name="fromDay" id="fromDay"><?php foreach($_SESSION['days'] as $v) echo "<option value='$v'>$v</option>"; ?></select>
							<select name="fromMonth" id="fromMonth"><?php foreach($_SESSION['months'] as $k => $v) echo "<option value='$k'>$k</option>"; ?></select>
							<select name="fromYear" id="fromYear">
								<?php foreach($_SESSION['years'] as $y) echo "<option value='$y'>$y</option>"; ?>
							</select>
							<label for="toMonth">To: </label>
							<select name="toDay" id="toDay"><?php foreach($_SESSION['days'] as $v) echo "<option value='$v'>$v</option>"; ?></select>
							<select name="toMonth" id="toMonth"><?php foreach($_SESSION['months'] as $k => $v) echo "<option value='$k'>$k</option>"; ?></select>
							<select name="toYear" id="toYear">
								<?php foreach($_SESSION['years'] as $y) echo "<option value='$y'>$y</option>"; ?>
							</select>
							<br>
							<button value="Go!" onClick="buildDatesAndLaunch(fromDay.value, fromMonth.value, fromYear.value, toDay.value, toMonth.value, toYear.value)">Go!</button>
						</div>
						<hr>
						<!-- Slider -->		
						<div id="slider">
							<h4>Slider:</h4>
							<br>
							<input name="sl" type="range" id="myRange" min="0" max="50" value="0" step="1" onchange="initMap.getBirdOn(this.value, true)"/>
						</div>
						<p id="demo"></p>
						<hr>
						<!-- On/Off button. -->
						<h4>Turn Plots On/Off:</h4><br>
						<div id="switch"></div>
						<div id="ft-data"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
<!-- Load javascript files to operate the map and methods to display markers. The footer gets appended too. -->
<?php include("mapScripts.php"); include("footer.php"); ?>	