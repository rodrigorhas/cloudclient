<?php
	
	function ChooseCompany ($cnpj, $params = array("omitMessages" => false, "bypass" => false)) {
		global $mysqli;
		global $_SESSION;

		if($params["bypass"] || empty($_SESSION["empresa-id"])) {
			$res = $mysqli->query("select * from empresas where cnpj = $cnpj");

			if($res->num_rows) {
				$empresa = $res->fetch_assoc();

				$_SESSION['empresa-cnpj'] = $empresa['cnpj'];
				$_SESSION['empresa-id'] = $empresa['id'];

				if(!$params["omitMessages"]) {
					echo json_encode(array("success" => true, "empresa" => $empresa));
					exit();
				}
			}

			if(!$params["omitMessages"]) {
				echo json_encode(array("success" => false, "error" => "Empresa não encontrada..."));
			}
		}
	}

	function rangeDownload($file) {
		$fp = @fopen($file, 'rb');

		$size   = filesize($file); // File size
		$length = $size;           // Content length
		$start  = 0;               // Start byte
		$end    = $size - 1;       // End byte
		// Now that we've gotten so far without errors we send the accept range header
		/* At the moment we only support single ranges.
		 * Multiple ranges requires some more work to ensure it works correctly
		 * and comply with the spesifications: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
		 *
		 * Multirange support annouces itself with:
		 * header('Accept-Ranges: bytes');
		 *
		 * Multirange content must be sent with multipart/byteranges mediatype,
		 * (mediatype = mimetype)
		 * as well as a boundry header to indicate the various chunks of data.
		 */
		header("Accept-Ranges: 0-$length");
		// header('Accept-Ranges: bytes');
		// multipart/byteranges
		// http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
		if (isset($_SERVER['HTTP_RANGE'])) {

			$c_start = $start;
			$c_end   = $end;
			// Extract the range string
			list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
			// Make sure the client hasn't sent us a multibyte range
			if (strpos($range, ',') !== false) {

				// (?) Shoud this be issued here, or should the first
				// range be used? Or should the header be ignored and
				// we output the whole content?
				header('HTTP/1.1 416 Requested Range Not Satisfiable');
				header("Content-Range: bytes $start-$end/$size");
				// (?) Echo some info to the client?
				exit;
			}
			// If the range starts with an '-' we start from the beginning
			// If not, we forward the file pointer
			// And make sure to get the end byte if spesified
			if ($range0 == '-') {

				// The n-number of the last bytes is requested
				$c_start = $size - substr($range, 1);
			}
			else {

				$range  = explode('-', $range);
				$c_start = $range[0];
				$c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
			}
			/* Check the range and make sure it's treated according to the specs.
			 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
			 */
			// End bytes can not be larger than $end.
			$c_end = ($c_end > $end) ? $end : $c_end;
			// Validate the requested range and return an error if it's not correct.
			if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {

				header('HTTP/1.1 416 Requested Range Not Satisfiable');
				header("Content-Range: bytes $start-$end/$size");
				// (?) Echo some info to the client?
				exit;
			}
			$start  = $c_start;
			$end    = $c_end;
			$length = $end - $start + 1; // Calculate new content length
			fseek($fp, $start);
			header('HTTP/1.1 206 Partial Content');
		}
		// Notify the client the byte range we'll be outputting
		header("Content-Range: bytes $start-$end/$size");
		header("Content-Length: $length");
		//header("Connection: close");

		// Start buffered downloadk
		$buffer = 1024 * 16;
		set_time_limit(0); // Reset time limit for big files
		while(!feof($fp) && ($p = ftell($fp)) <= $end && !connection_aborted()) {

			if ($p + $buffer > $end) {

				// In case we're only outputtin a chunk, make sure we don't
				// read past the length
				$buffer = $end - $p + 1;
			}
			flush(); // Free up memory. Otherwise large files will trigger PHP's memory limit.							
			if(connection_aborted()){
				echo "0\r\n\r\n";
				ob_flush();
				flush();
				exit;
			}
			echo fread($fp, $buffer);
		}

		fclose($fp);
	}

	function download($fileHash, $fileName, $fileType, $video, $download) {

		$downloadRate = 2048;
		$quoted = sprintf('"%s"', addcslashes(basename($fileName), '"\\'));			
		$folder = implode(array("..", "user_files", $empresa, $_SESSION['username']), $fileHash, "/");

		if(!$video) {

			$finfo = finfo_open(FILEINFO_MIME_TYPE);
			header('Content-Type: '.finfo_file($finfo, $file));
			$finfo = finfo_open(FILEINFO_MIME_ENCODING);
			header('Content-Transfer-Encoding: '.finfo_file($finfo, $file));
			header('Content-disposition: attachment; filename="'. $fileName .'"');
				readfile($file);
				flush();

			} else {

				header("Content-type: " . $fileType);

				if (isset($_SERVER['HTTP_RANGE'])) {

					rangeDownload($file);
				}

				else {

					header("Content-Length: ".filesize($file));
					
					$file = fopen($file, "r");
					while(!feof($file)){
						set_time_limit(0);
						print fread($file, 2048);						
						flush();
					}

					fclose($file);
				}				
			}

			exit();
	}

	function strpos_r($haystack, $needle){

		if(strlen($needle) > strlen($haystack))
			trigger_error(sprintf("%s: length of argument 2 must be <= argument 1", __FUNCTION__), E_USER_WARNING);

		$seeks = array();
		while($seek = strrpos($haystack, $needle))
		{
			array_push($seeks, $seek);
			$haystack = substr($haystack, 0, $seek);
		}
		return $seeks;
	}

	function getUserByHash ($hash) {
		global $mysqli;

		$query = $mysqli->query("SELECT * FROM usuarios WHERE hash = '$hash' LIMIT 1") or die($mysqli->error);
		$user = $query->fetch_assoc();
		return $user;
	}

	function GenQuery ($query, $model) {

		//var_dump($model);

		foreach ($model as $key => $value) {
			if(!empty($value)) {
				$query .= " and $key = '$value'";
			}
		}

		//var_dump($query);

		return $query;
	}

	function UserCheck ($info) {
		global $mysqli;
		global $_USER_TYPES;

		if($info["user-type"] == $_USER_TYPES["CLIENTE"]) {
			$queryResponse = $mysqli->query("select id, visualizado_em from arquivos where visualizado_em is null and departamento = ". $info["departamento"] ." and tipo = ". $info["tipo"] ." and empresa = ". $info["empresa-id"]) or die($mysqli->error);

			if($queryResponse->num_rows) {
				$queryResponse2 = $mysqli->query("update arquivos set visualizado_em = NOW() where empresa = ". $info["empresa-id"] ." and departamento = ". $info["departamento"] ." and tipo = ". $info["tipo"] ." and visualizado_em is null") or die ($mysqli->error);
			}
		}
	}

	function isBoolean($value) {
	   if ($value && strtolower($value) !== "false") {
	      return true;
	   } else {
	      return false;
	   }
	}

	function exists ($value, $array) {
		return array_search($value, $array);
	}

	function AllowTo ($array) {
		return exists($_SESSION["user-type"], $array);
	}

	function safeCheck ($value) {
		if(!empty($value) && $value != "null" && sizeof($value) > 0) {
			return $value;
		}

		else return NULL;
	}

	function safe ($value, $flag) {
		if($flag) {
			$value = (safeCheck($_POST[$value])) ? $_POST[$value] : $_GET[$value];
			return safeCheck($value);
		}

		else return safeCheck($value);
	}