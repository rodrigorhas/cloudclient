<?php
	session_start();

	error_reporting(0);

	/*define('DB_HOST', '192.168.7.3');
	define('DB_USER', 'cliente');
	define('DB_PASSWORD', 'q1w2e3r4');
	define('DB_NAME', 'docscacp');*/

	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASSWORD', '923885');
	define('DB_NAME', 'docscacp');

	$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
?>
