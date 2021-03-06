<?php
error_reporting(0);

include_once('conn.php');

$mysqli->query("use docs");

if(isset($_SESSION['hash'])) $hash = $_SESSION['hash'];
$module = $_GET['module'];

function remove_accents($string) {
	if ( !preg_match('/[\x80-\xff]/', $string) )
		return $string;

	$chars = array(
	    // Decompositions for Latin-1 Supplement
		chr(195).chr(128) => 'A', chr(195).chr(129) => 'A',
		chr(195).chr(130) => 'A', chr(195).chr(131) => 'A',
		chr(195).chr(132) => 'A', chr(195).chr(133) => 'A',
		chr(195).chr(135) => 'C', chr(195).chr(136) => 'E',
		chr(195).chr(137) => 'E', chr(195).chr(138) => 'E',
		chr(195).chr(139) => 'E', chr(195).chr(140) => 'I',
		chr(195).chr(141) => 'I', chr(195).chr(142) => 'I',
		chr(195).chr(143) => 'I', chr(195).chr(145) => 'N',
		chr(195).chr(146) => 'O', chr(195).chr(147) => 'O',
		chr(195).chr(148) => 'O', chr(195).chr(149) => 'O',
		chr(195).chr(150) => 'O', chr(195).chr(153) => 'U',
		chr(195).chr(154) => 'U', chr(195).chr(155) => 'U',
		chr(195).chr(156) => 'U', chr(195).chr(157) => 'Y',
		chr(195).chr(159) => 's', chr(195).chr(160) => 'a',
		chr(195).chr(161) => 'a', chr(195).chr(162) => 'a',
		chr(195).chr(163) => 'a', chr(195).chr(164) => 'a',
		chr(195).chr(165) => 'a', chr(195).chr(167) => 'c',
		chr(195).chr(168) => 'e', chr(195).chr(169) => 'e',
		chr(195).chr(170) => 'e', chr(195).chr(171) => 'e',
		chr(195).chr(172) => 'i', chr(195).chr(173) => 'i',
		chr(195).chr(174) => 'i', chr(195).chr(175) => 'i',
		chr(195).chr(177) => 'n', chr(195).chr(178) => 'o',
		chr(195).chr(179) => 'o', chr(195).chr(180) => 'o',
		chr(195).chr(181) => 'o', chr(195).chr(182) => 'o',
		chr(195).chr(182) => 'o', chr(195).chr(185) => 'u',
		chr(195).chr(186) => 'u', chr(195).chr(187) => 'u',
		chr(195).chr(188) => 'u', chr(195).chr(189) => 'y',
		chr(195).chr(191) => 'y',
	    // Decompositions for Latin Extended-A
		chr(196).chr(128) => 'A', chr(196).chr(129) => 'a',
		chr(196).chr(130) => 'A', chr(196).chr(131) => 'a',
		chr(196).chr(132) => 'A', chr(196).chr(133) => 'a',
		chr(196).chr(134) => 'C', chr(196).chr(135) => 'c',
		chr(196).chr(136) => 'C', chr(196).chr(137) => 'c',
		chr(196).chr(138) => 'C', chr(196).chr(139) => 'c',
		chr(196).chr(140) => 'C', chr(196).chr(141) => 'c',
		chr(196).chr(142) => 'D', chr(196).chr(143) => 'd',
		chr(196).chr(144) => 'D', chr(196).chr(145) => 'd',
		chr(196).chr(146) => 'E', chr(196).chr(147) => 'e',
		chr(196).chr(148) => 'E', chr(196).chr(149) => 'e',
		chr(196).chr(150) => 'E', chr(196).chr(151) => 'e',
		chr(196).chr(152) => 'E', chr(196).chr(153) => 'e',
		chr(196).chr(154) => 'E', chr(196).chr(155) => 'e',
		chr(196).chr(156) => 'G', chr(196).chr(157) => 'g',
		chr(196).chr(158) => 'G', chr(196).chr(159) => 'g',
		chr(196).chr(160) => 'G', chr(196).chr(161) => 'g',
		chr(196).chr(162) => 'G', chr(196).chr(163) => 'g',
		chr(196).chr(164) => 'H', chr(196).chr(165) => 'h',
		chr(196).chr(166) => 'H', chr(196).chr(167) => 'h',
		chr(196).chr(168) => 'I', chr(196).chr(169) => 'i',
		chr(196).chr(170) => 'I', chr(196).chr(171) => 'i',
		chr(196).chr(172) => 'I', chr(196).chr(173) => 'i',
		chr(196).chr(174) => 'I', chr(196).chr(175) => 'i',
		chr(196).chr(176) => 'I', chr(196).chr(177) => 'i',
		chr(196).chr(178) => 'IJ',chr(196).chr(179) => 'ij',
		chr(196).chr(180) => 'J', chr(196).chr(181) => 'j',
		chr(196).chr(182) => 'K', chr(196).chr(183) => 'k',
		chr(196).chr(184) => 'k', chr(196).chr(185) => 'L',
		chr(196).chr(186) => 'l', chr(196).chr(187) => 'L',
		chr(196).chr(188) => 'l', chr(196).chr(189) => 'L',
		chr(196).chr(190) => 'l', chr(196).chr(191) => 'L',
		chr(197).chr(128) => 'l', chr(197).chr(129) => 'L',
		chr(197).chr(130) => 'l', chr(197).chr(131) => 'N',
		chr(197).chr(132) => 'n', chr(197).chr(133) => 'N',
		chr(197).chr(134) => 'n', chr(197).chr(135) => 'N',
		chr(197).chr(136) => 'n', chr(197).chr(137) => 'N',
		chr(197).chr(138) => 'n', chr(197).chr(139) => 'N',
		chr(197).chr(140) => 'O', chr(197).chr(141) => 'o',
		chr(197).chr(142) => 'O', chr(197).chr(143) => 'o',
		chr(197).chr(144) => 'O', chr(197).chr(145) => 'o',
		chr(197).chr(146) => 'OE',chr(197).chr(147) => 'oe',
		chr(197).chr(148) => 'R',chr(197).chr(149) => 'r',
		chr(197).chr(150) => 'R',chr(197).chr(151) => 'r',
		chr(197).chr(152) => 'R',chr(197).chr(153) => 'r',
		chr(197).chr(154) => 'S',chr(197).chr(155) => 's',
		chr(197).chr(156) => 'S',chr(197).chr(157) => 's',
		chr(197).chr(158) => 'S',chr(197).chr(159) => 's',
		chr(197).chr(160) => 'S', chr(197).chr(161) => 's',
		chr(197).chr(162) => 'T', chr(197).chr(163) => 't',
		chr(197).chr(164) => 'T', chr(197).chr(165) => 't',
		chr(197).chr(166) => 'T', chr(197).chr(167) => 't',
		chr(197).chr(168) => 'U', chr(197).chr(169) => 'u',
		chr(197).chr(170) => 'U', chr(197).chr(171) => 'u',
		chr(197).chr(172) => 'U', chr(197).chr(173) => 'u',
		chr(197).chr(174) => 'U', chr(197).chr(175) => 'u',
		chr(197).chr(176) => 'U', chr(197).chr(177) => 'u',
		chr(197).chr(178) => 'U', chr(197).chr(179) => 'u',
		chr(197).chr(180) => 'W', chr(197).chr(181) => 'w',
		chr(197).chr(182) => 'Y', chr(197).chr(183) => 'y',
		chr(197).chr(184) => 'Y', chr(197).chr(185) => 'Z',
		chr(197).chr(186) => 'z', chr(197).chr(187) => 'Z',
		chr(197).chr(188) => 'z', chr(197).chr(189) => 'Z',
		chr(197).chr(190) => 'z', chr(197).chr(191) => 's'
		);

$string = strtr($string, $chars);

return $string;
}


function select_child_ids($parent_id,&$ida) {

	global $mysqli;
	global $file_menuOptions;
	global $folder_menuOptions;


	$result = $mysqli->query("SELECT * FROM files WHERE deleted = 0 and id = " . $parent_id);
	if($result->num_rows){
		$r = $result->fetch_assoc();

		$fileInfo = json_decode($r['file_info']);
		$sql_menuOptions = $mysqli->query("SELECT * FROM files_meta WHERE meta_key = 'menuOptions' AND file_id = '". $parent_id ."'") or die($mysqli->error);
		$menuOptions = "";			

			//echo $sql_menuOptions->num_rows;

			//if($sql_menuOptions->num_rows){
		$r_menuOptions = $sql_menuOptions->fetch_assoc();
		$menuOptions = explode(",", $r_menuOptions['meta_value']);							
			//}else{
			//	$menuOptions = array('detalhes');
			//}
		$fileInfo->menuOptions = $menuOptions;

		$r['info'] = $fileInfo;

		$r['children'] = array();
		$query = "SELECT * FROM files WHERE deleted = 0 and parent = " . $r['id'];
		$result = $mysqli->query($query) or die($mysqli->error);

		while($row = $result->fetch_assoc()){
			$fileInfo = json_decode($row['file_info']);
			if($result->num_rows){
				$row['children'] = array();
				if($row['id']){
					$row['is_folder'] = $row['is_folder'];
					$row['is_root'] = $row['is_root'];
					$row['deleted'] = $row['deleted'];
						//$sql_menuOptions = $mysqli->query("SELECT * FROM files_meta WHERE meta_key = 'menuOptions' AND file_id = '". $row['id'] ."'");

						/*if($sql_menuOptions->num_rows){
							$r_menuOptions = $sql_menuOptions->fetch_assoc();
							$fileInfo->menuOptions = explode(",", $r_menuOptions['meta_value']);
						}else{
							$fileInfo->menuOptions = array('abrir');
						}*/

						$fileInfo->menuOptions = $menuOptions;
						

						/*if($row['is_folder'] != "1" ){
							$fileInfo->menuOptions = $folder_menuOptions;
						} else {
							$fileInfo->menuOptions = array('abrir');
						}*/


						//print_r($r['info']);
						$row['info'] = $fileInfo;
						$r['children'][] = $row;
						select_child_ids($row['id'], $row['children']);

					}
				}else{
					return false;
				}
			}		
			array_push($ida, $r);
		}

	}

	function createTree(&$list, $parent){
		$tree = array();
		foreach ($parent as $k=>$l){
			if(isset($list[$l['id']])){
				$l['children'] = createTree($list, $list[$l['id']]);
			}
			$tree[] = $l;
		} 
		return $tree;
	}

	$file_menuOptions = array('abrir','renomear','mover','compartilhar','download','link','favoritar','detalhes','remover');
	$folder_menuOptions = array('abrir','renomear','mover','compartilhar','favoritar','remover');

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

		// Start buffered download
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

	function download($fileHash, $fileName, $fileType, $video, $download){
			//echo "DOWNLOADING";
		$downloadRate = 2048;
		$quoted = sprintf('"%s"', addcslashes(basename($fileName), '"\\'));			
		$file = '../user_files/' . $fileHash;

			//if(false){
		if(!$video){

			$finfo = finfo_open(FILEINFO_MIME_TYPE);
			header('Content-Type: '.finfo_file($finfo, $file));
			$finfo = finfo_open(FILEINFO_MIME_ENCODING);
			header('Content-Transfer-Encoding: '.finfo_file($finfo, $file));
			header('Content-disposition: attachment; filename="'. $fileName .'"');
				readfile($file); // do the double-download-dance (dirty but worky)
				flush();

			} else {
				header("Content-type: " . $fileType);

				if (isset($_SERVER['HTTP_RANGE']))  { // do it for any device that supports byte-ranges not only iPhone

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
			//}
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

		function createItem ($item, $isFolder, $type) {
			$newItem = new stdClass();

			$newItem->file_name = $item['nome'];
			$newItem->is_folder = $isFolder;
			$newItem->deleted = 0;
		//$newItem->children = array($sharedFolder);
			$newItem->id = $item['id'];

			if(!$isFolder) {
				$newItem->raw = $item;
			}

			if($item->menuOptions) {
				$newItem->menuOptions = $item->menuOptions;
			}

			if(isset($type)) {
				$newItem->type = $type;
			}

			return $newItem;
		}

		switch ($module) {
			case "getFile":

			$download = $_GET['dl'];
			$video = $_GET['video'];
			$fileId = $_GET['id'];
			$fileHash = $_GET['hash'];

			$query = "SELECT
			*				
			FROM
			arquivos
			WHERE							
			hash = '". $fileHash ."'
			LIMIT 1";


			$result = $mysqli->query($query) or die($mysqli->error);

			if($result->num_rows){
				$row = $result->fetch_assoc();
				download($row['hash'], $row['nome'], $row['type'], $video, $download);
			}

			break;

			case "getDepartamentos":

			$mysqli->query("use names utf8");
			$result = $mysqli->query("select * from departamentos") or die($mysqli->error);

			$json = array();
			while ($item = $result->fetch_assoc()) {
				$item['nome'] = utf8_encode($item['nome']);
				array_push($json, createItem($item, 1, "departamentos"));
			}

			echo json_encode($json);
			break;

			case "getTipoDeArquivos":

			$query = "select * from tipo_de_arquivos";
			if($_GET['departamento']) $query .= " where departamento = ". $_GET['departamento'];

			$query .= " ORDER BY nome";

			$result = $mysqli->query($query);

			$json = array();
			while ($item = $result->fetch_assoc()) {
				$item['nome'] = utf8_encode($item['nome']);
				$finalItem = ($_GET['departamento']) ? createItem($item, 1, "tipo_de_arquivo") : $item;
				array_push($json, $finalItem);
			}

			echo json_encode($json);

			break;

			case "getArquivos":

			$empresa = $_SESSION['empresa'];
			$ano = $_GET['ano'];
			$mes = $_GET['mes'];
			$tipo = $_GET['tipo_de_arquivo'];

			$mysqli->query("set names utf8");

			$query = "SELECT 
			a.id,
			a.ano,
			a.mes,
			a.type,
			a.hash,
			a.nome,
			a.data,
			a.obs,
			d.nome as departamento,
			t.nome as tipo,
			e.nome as empresa,
			u.name as usuario
			FROM 
			arquivos as a
			LEFT JOIN departamentos as d ON d.id = a.departamento
			LEFT JOIN tipo_de_arquivos as t ON t.id = a.tipo
			LEFT JOIN empresas as e ON e.id = a.empresa
			LEFT JOIN usuarios as u ON u.id = a.usuario
			WHERE a.empresa = " . $empresa;

			if($tipo || $ano || $mes) $query .= " and ";

			if($tipo) $query .= "tipo = " . $tipo;

			$query .= " ORDER BY a.mes, a.ano, a.data";

			$result = $mysqli->query($query);

			$json = array();
			while ($item = $result->fetch_assoc()) {
				//$item['nome'] = utf8_encode(implode(" - ", array($item['tipo'], $item['referencia'])));
				$item["menuOptions"] = array("abrir", "download", "compartilhar");

				array_push($json, $item);
			}

			echo json_encode($json);

			break;
			case "trash":

			$ids = $_POST['ids'];
			$deleted = $_POST['deleted'];
			$ids = str_replace("[", "", $ids);
			$ids = str_replace("]", "", $ids);
			$ids = str_replace('"', "'", $ids);
			$query = "UPDATE			
			files
			SET
			`deleted` = ". $deleted ."
			WHERE
			files.group_hash = '$hash' 
			AND
			files.id
			IN (". $ids .")";

			$sql = $mysqli->query($query) or die($mysqli->error);			

			break;
			case "uploadFile":		
			$up_id = md5(uniqid(rand(), true));

			$mysqli->query("set names utf8");

			$tipo = $_POST['tipo'];
			$ano = $_POST['ano'];
			$mes = $_POST['mes'];
			$nome = $_POST['nome'];
			$departamento = $_POST['departamento'];
			$observacao = $_POST['observacao'];

			$fileField = $_FILES['fileAttach'];

			$fileTmpname = $fileField['tmp_name'];
			$fileName = utf8_decode($fileField['name']);
			$fileSize = $fileField['size'];
			$fileType = $fileField['type'];

			$folder = "../user_files/";

			$originalFile = $folder . $up_id;

			if(move_uploaded_file($fileTmpname, $originalFile)) {

				chmod($originalFile, 0766);

				$query = "INSERT INTO arquivos (`tipo`, `ano`, `mes`, `tamanho`, `data`, `empresa`, `usuario`, `type`, `hash`, `departamento`, `obs`) VALUES ('$tipo', '$ano', '$mes', '$fileSize', NOW(), '1', '1', '$fileType', '$up_id', '$departamento', '$observacao')";

				$result = $mysqli->query($query) or die($mysqli->error);

				echo json_encode(array("uploaded" => true));
				exit();
			}

			echo json_encode(array("uploaded" => false));

			break;
			case "authUser":

			$cnpj = $_POST['cnpj'];		
			$username = $_POST['username'];		
			$password = md5($_POST['password']);

			if(!isset($cnpj) && !isset($username) && !isset($password)) exit();

			$queryEmpresa = $mysqli->query("select * from empresas where cnpj = " . $cnpj)->fetch_assoc() or die ($mysqli->error);

			$queryUsuario = $mysqli->query("SELECT * FROM usuarios WHERE  username = '". $username ."' AND password = '". $password ."' LIMIT 1") or die($mysqli->error);
			$user = $queryUsuario->fetch_assoc();

			$hasAccess = $mysqli->query("select * from empresa_usuario where empresa = " . $queryEmpresa['id'] . " and usuario = " . $user['id']) or die ($mysqli->error);

			if(!$queryUsuario->num_rows) {
				echo json_encode(array("error" => true, "message" => "Usuário não encontrado"));
				exit();
			}

			if(!$hasAccess->num_rows) {
				echo json_encode(array("error" => true, "message" => "Esse usuário não tem acesso a essa empresa"));
				exit();
			}

			if($queryUsuario->num_rows && $hasAccess->num_rows){
				$_SESSION['hash'] = $user['hash'];
				$_SESSION['empresa'] = $queryEmpresa['id'];

				echo json_encode(array("data" => $user));
			}

			break;
			case "checkUserSession":

			if(isset($_SESSION['hash']))
				echo json_encode(array("hash" => $_SESSION['hash']));

			break;
			case "logout":
			unset($_SESSION['hash']);
			unset($_SESSION['empresa']);
			break;

			case "signin":
			/*$mysqli->query("insert into groups (name, timestamp) values ('$_SESSION[hash]', current_timestamp)") or die($mysqli->error);
			$mysqli->query("insert into groups_meta (group_hash, group_hash) values ('$_SESSION[hash]', '$_SESSION[hash]')")  or die($mysqli->error);*/
			break;
		}

		?>
