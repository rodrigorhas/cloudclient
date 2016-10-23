<?php
	error_reporting(0);
	

	include_once('conn.php');
	
	
	if(isset($_SESSION['hash'])) $hash = $_SESSION['hash'];
	$module = $_GET['module'];

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
		
		$query = $mysqli->query("SELECT * FROM users WHERE hash = '$hash' LIMIT 1") or die($mysqli->error);
		$user = $query->fetch_assoc();
		return $user;
	}

	switch ($module) {
		case "getFile":

		//ajax/get.php?module=getFile&dl=0&id=144

		$download = $_GET['dl'];
		$video = $_GET['video'];
		$fileId = $_GET['id'];
		$fileHash = $_GET['hash'];
		
		$query = "SELECT
				*				
				FROM
				files
				WHERE							
				file_hash = '". $fileHash ."'
				LIMIT 1";
				

		$result = $mysqli->query($query) or die($mysqli->error);

		if($result->num_rows){
			$row = $result->fetch_assoc();			
			download($row['file_hash'], $row['file_name'], $row['file_type'], $video, $download);
		}
		
		break;
		case "tree":
			$mysqli->query("set names utf8");

				$query = "SELECT
						files.id,
						files.parent,
						files.is_root,
						files.is_folder,
						files.file_name,
						files.file_type,					
						files.deleted,
						files.file_hash,
						files.file_info
						FROM
						files
						WHERE
						files.deleted = 0 and
						files.group_hash = '". $hash ."'";
			
				$result = $mysqli->query($query) or die($mysqli->error);
			
				$arr = [];
			
				while($row =  $result->fetch_assoc()){
					$originalFile = "../user_files/" . $row['file_hash'];
					foreach($row as $key => $value ){
						//$row[$key] = utf8_encode($value);
					}			
					
					$fileInfo = json_decode($row['file_info']);
					
					if(!$row['is_folder']){
						$row['info'] = $fileInfo;					
						
					}else{
						$menuOptions = $folder_menuOptions;
						$fileInfo->menuOptions = $menuOptions;
						$row['info'] = $fileInfo;
					}
					$row['children'] = array();
					
					
					if($row['is_folder']){
						array_push($arr, $row);
					}else if(is_file($originalFile)){
						array_push($arr, $row);
						
					}
				}					
			
				$new = array();
				foreach ($arr as $a){
				    $new[$a['parent']][] = $a;
				}			
		

				$newTree = array();
				for($i = 0; $i< sizeof($arr); $i++){
					if($arr[$i]['is_root']){
						$newTree[] = $arr[$i];
					}
				}

				//print_r($new);

				$tree = createTree($new, $newTree);


				$arr = array();
				$query = "SELECT * FROM files_meta WHERE user_hash = '" . $hash . "' GROUP BY file_id";
				$result = $mysqli->query($query) or die($mysqli->error);
				while($r = $result->fetch_assoc()){					
					select_child_ids($r['file_id'] , $arr);
				}			

				$newTree = array();
				for($i = 0; $i< sizeof($arr); $i++){
					
					$newTree[] = $arr[$i];
					
				}

				$new = array();
				foreach ($arr as $a){
				    $new[$a['parent']][] = $a;
				}						

				//print_r($new);

				$tree1 = createTree($arr, $newTree);
				
				/*$sharedFolder = new stdClass();
				$sharedFolderInfo = new stdClass();

				$sharedFolderInfo->menuOptions = array('abrir', 'download');

				$sharedFolder->file_name = "Arquivos Compartilhados";
		    	$sharedFolder->is_folder = 1;
		    	$sharedFolder->is_root = 1;
		    	$sharedFolder->deleted = 0;
		    	$sharedFolder->children = $tree1;
		    	$sharedFolder->id = 0;
		    	$sharedFolder->info = $sharedFolderInfo;*/

				$rootObj = new stdClass();
				$rootObj->file_name = "Home";
		    	$rootObj->is_folder = 1;
		    	$rootObj->is_root = 1;
		    	$rootObj->deleted = 0;
		    	//$rootObj->children = array($sharedFolder);
		    	$rootObj->children = array();
		    	$rootObj->id = -1;

		    	for ($i=0; $i < sizeof($tree); $i++) { 
		    		$rootObj->children[] = $tree[$i];
		    	}

				$root = array(
					$rootObj
				);
				echo json_encode($root);

				break;

			case "treeTrash":
				$query = "SELECT
						files.id,
						files.parent,
						files.is_root,
						files.is_folder,
						files.file_name,
						files.file_type,
						files.deleted,
						files.file_hash,
						files.file_info
						FROM
						files
						WHERE
						files.deleted = 1 and
						files.user_hash = '". $hash ."'
						ORDER BY files.file_name";
			
				$result = $mysqli->query($query) or die($mysqli->error);
			
				$arr = [];
			
				while($row =  $result->fetch_assoc()){
					foreach($row as $key => $value ){
						$row[$key] = utf8_encode($value);
					}								
			
					$fileInfo = new stdClass();
					$row['info'] = json_decode($row['file_info']);
					$row['parent'] = "";
					$row['children'] = array();
					
					array_push($arr, $row);
				}
		
				echo json_encode($arr);
				break;

			case "treeShared":
				
				$arr = array();
				$query = "SELECT * FROM files_meta WHERE user_hash = " . $hash;
				$result = $mysqli->query($query);
				while($r = $result->fetch_array()){
					select_child_ids($r['id'] , $arr);
				}


				//print_r($myArr);

				$newTree = array();
				for($i = 0; $i< sizeof($arr); $i++){
					
					$newTree[] = $arr[$i];
					
				}

				$new = array();
				foreach ($arr as $a){
				    $new[$a['parent']][] = $a;
				}						

				//print_r($new);

				$tree = createTree($arr, $newTree);
				echo json_encode($tree);
				

				break;

			case "delete":
				$ids = $_GET['ids'];
				$query = "DELETE
				FROM
				files
				WHERE
				files.user_hash = '$hash' 
				AND
				files.id
				IN ('3','4')";

				//excluir o arquivo fisico;
				//excluir filhos
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
				files.user_hash = '$hash' 
				AND
				files.id
				IN (". $ids .")";

				$sql = $mysqli->query($query) or die($mysqli->error);			

				break;
			case "newFolder":

				$parentId = ($_POST['pid']) ? $_POST['pid'] :  'null';
				$isRoot = ($_POST['pid']) ? 0 :  1;

				$folderName = "Nova Pasta";

				$query = "INSERT INTO files (`user_hash`, `parent`, `is_folder`, `is_root`, `file_name`) VALUES ('". $hash ."', ". $parentId .", 1, ". $isRoot .", '". $folderName ."')";
				$result = $mysqli->query($query) or die($mysqli->error);
				$folderId = $mysqli->insert_id;

				$menuOptions = $folder_menuOptions;

				$obj = new stdClass();
				$objInfo = new stdClass();
				$objInfo->menuOptions = $file_menuOptions;

				$obj->id = $folderId;
				$obj->file_name = $folderName;
				$obj->file_size = "";
				$obj->file_type = "";			
				$obj->parent = $parentId;
				$obj->info = $objInfo;
				$obj->is_folder = 1;
				$obj->is_root = $isRoot;
				$obj->deleted = 0;

				echo json_encode($obj);

				break;
			case "move":
				
				$ids = $_POST['ids'];
				$pid = $_POST['pid'];
				$isRoot = "0";

				if($pid == ""){
					$isRoot = "1";
				}

				$ids = str_replace("[", "", $ids);
				$ids = str_replace("]", "", $ids);
				$ids = str_replace('"', "'", $ids);			
				$query = "UPDATE files SET `parent` = '". $pid ."', `deleted` = 0, `is_root` = '". $isRoot ."' WHERE user_hash = '". $hash  ."' AND `id` in (". $ids .") ";			
				$result = $mysqli->query($query) or die($mysqli->error);
				
				echo "Movido " . $mysqli->affected_rows;

				break;

			case "rename":
				
				$newName = $mysqli->real_escape_string($_POST['newname']);			
				//$newName = $_POST['newname'];			
				$id = $_POST['id'];

				$query = "UPDATE files SET `file_name` = '".$newName."' WHERE  id='". $id ."' AND user_hash = '". $hash  ."'";			
				$result = $mysqli->query($query) or die($mysqli->error);			
				
				echo "Renomeado " . $mysqli->affected_rows;

				break;

			case "uploadFile":		
				# get.php?module=uploadFile&pid=10
				$up_id = md5(uniqid(rand(), true));

				$parentId = ($_GET['pid']) ? $_GET['pid'] :  -1;
				$isRoot = $_GET['ir'];

				//echo $up_id;		
				
				$fileField = $_FILES['fileAttach'];

				$fileTmpname = $fileField['tmp_name'];
				$fileName = utf8_decode($fileField['name']);
				$fileSize = $fileField['size'];
				$fileType = $fileField['type'];

				

				$folder = "../user_files/";


				$obj = new stdClass();
				
				$obj->hash = $up_id;
				
				$originalFile = $folder . $up_id;
				if(move_uploaded_file($fileTmpname, $originalFile)){

					chmod($originalFile, 0766);

					$fileInfo = new stdClass();
						
					$fileInfo->size = filesize($originalFile);
			
					$fileInfo->c_time = date('d/m/Y h:i:s', filectime($originalFile));
					$fileInfo->m_time = date('d/m/Y h:i:s', filemtime($originalFile));
					$fileInfo->a_time = date('d/m/Y h:i:s', fileatime($originalFile));
				
					$menuOptions = $file_menuOptions;
					$fileInfo->menuOptions = $menuOptions;
					
					$finfo = $fileType;

					$fileInfo->type = substr($fileName, strripos($fileName, ".")) . " (" . $finfo. ")";

					$obj->info = $fileInfo;
				
					$file_info = json_encode($fileInfo);
					
					$query = "INSERT INTO files (`user_hash`, `is_root`, `parent`, `is_folder`, `file_name`, `file_type`, `file_hash`, `file_info`) VALUES ('". $hash ."', '". $isRoot ."', '". $parentId ."', 0, '". $fileName ."','". $fileType ."', '". $up_id ."' , '" . $file_info . "')";
					$result = $mysqli->query($query) or die($mysqli->error);
					$obj->id = $mysqli->insert_id;

				}
				echo json_encode($obj);


			break;
		case "getUserImg":
				
				$u = $_POST['u'];			

				$query = "SELECT * FROM users WHERE  username = '". $u ."' LIMIT 1";
				$result = $mysqli->query($query) or die($mysqli->error);
				
				if($result->num_rows){
					$r = $result->fetch_assoc();
					echo $r['user_img'];
				}else{
					echo "404";
				}

				break;

		case "authUser":
				
				$u = $_POST['u'];		
				$p = md5($_POST['p']);	

				if(isset($u)){				
					$query = "SELECT * FROM users WHERE  username = '". $u ."' AND password = '". $p ."' LIMIT 1";
					$result = $mysqli->query($query) or die($mysqli->error);
					
					if($result->num_rows){
						$r = $result->fetch_assoc();
						$_SESSION['hash'] = $r['hash'];
						echo $_SESSION['hash'];
							
					}else{
						echo "404";
					}				
				}else{
					echo "1";
				}

				break;
		case "checkUserSession":

				if(isset($_SESSION['hash']))
					echo $_SESSION['hash'];

				break;
		case "logout":
							
				unset($_SESSION['hash']);

				break;

		case "signin":
		/*$mysqli->query("insert into groups (name, timestamp) values ('$_SESSION[hash]', current_timestamp)") or die($mysqli->error);
		$mysqli->query("insert into groups_meta (group_hash, user_hash) values ('$_SESSION[hash]', '$_SESSION[hash]')")  or die($mysqli->error);*/

		var_dump(getUserByHash($_SESSION['hash']));
		var_dump($_POST);
		var_dump($_GET);
		break;
	}

?>
