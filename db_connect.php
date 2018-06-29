<!-- php snippet to start the database connection, allowing users to login or register -->
<?php
include_once 'definitions.php';
$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
?>