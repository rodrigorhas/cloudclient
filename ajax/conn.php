<?php
	session_start();

	// Define database connection constants
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASSWORD', '923885');
	define('DB_NAME', 'docs');

	//$_SESSION['hash'] = "8d8dc8365532102b95949085d2c28b7f";

	$mysqli = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);

?>
