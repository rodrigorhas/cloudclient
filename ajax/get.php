<?php
	
	error_reporting(E_ALL);

	include "conn.php";
	include "helper.php";
	include "removeAccents.php";

	$mysqli->query("use docs");

	if(isset($_SESSION['hash'])) $hash = $_SESSION['hash'];

	$module = safe("module", true);

	function getUserTypes () {
		$const = array(
			"FUNCIONARIO" => 1,
			"CHEFE" => 2,
			"CLIENTE" => 3
		);

		$const["INTERNO"] = array($const["FUNCIONARIO"], $const["CHEFE"]);

		return $const;
	}

	$_USER_TYPES = getUserTypes();

	$cert_id = 135;

	switch ($module) {
		case "checarValidadeCertidoes":

			$mysqli->query("set names utf8");

			$empresa = $_SESSION['empresa-id'];
			$days = 10;

			$query = "SELECT 
			a.id,
			a.ano,
			a.mes,
			a.nome,
			a.data,
			a.hash,
			a.vencimento,
			d.nome as departamento,
			t.nome as tipo,
			u.name as usuario
			FROM 
			arquivos as a
			LEFT JOIN departamentos as d ON d.id = a.departamento
			LEFT JOIN tipo_de_arquivos as t ON t.id = a.tipo
			LEFT JOIN usuarios as u ON u.id = a.usuario
			WHERE t.id = $cert_id
			AND CURDATE() >= vencimento - interval $days day
			AND a.empresa = " . $empresa;

			if($queryResponse = $mysqli->query($query)){
				if($queryResponse->num_rows) {
					$json = array();

					while($row = $queryResponse->fetch_assoc()) {
						array_push($json, $row);
					}

					echo json_encode(array("success" => true, "data" => $json));
					exit();
				}
			}

			echo json_encode(array("success" => false));

			break;

		case "checarValidadeDeTodasAsCertidoes":

			$mysqli->query("set names utf8");

			$days = 10;

			$query = "SELECT 
			a.id,
			a.ano,
			a.mes,
			a.nome,
			a.data,
			a.hash,
			a.vencimento,
			d.nome as departamento,
			t.nome as tipo,
			u.name as usuario,
			e.nome as empresa
			FROM 
			arquivos as a
			LEFT JOIN departamentos as d ON d.id = a.departamento
			LEFT JOIN tipo_de_arquivos as t ON t.id = a.tipo
			LEFT JOIN usuarios as u ON u.id = a.usuario
			LEFT JOIN empresas as e ON e.id = a.empresa
			WHERE t.id = $cert_id
			AND CURDATE() >= vencimento - interval $days day
			order by empresa";

			if($queryResponse = $mysqli->query($query)){
				if($queryResponse->num_rows) {
					$template = array();
					$temp = array();
					$json = array();

					$rowsCount = $queryResponse->num_rows;

					while($row = $queryResponse->fetch_assoc()) {
						$temp[$row["empresa"]][] = $row;
					}

					foreach ($temp as $empresa => $certidoes) {
						$json[] = array(
									"nome" => $empresa,
									"certidoes" => $certidoes
								);
					}

					$data = array(
								"count" => $rowsCount,
								"data" => $json
							);

					echo json_encode(
							array(
								"success" => true,
								"data" => $data
							)
						);

					if(safe('rotina', true)) {
						// after safe get input

						
					}

					exit();
				}
			}

			echo json_encode(array("success" => false));

			break;

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

			if($row["tipo"] == 136) { // Contrato Social
				$downloadFileName = $row["obs"];
			}

			else {
				$downloadFileName = $row["nome"];
			}

			echo $downloadFileName;

			download($row['hash'], $downloadFileName, $row['type'], $video, $download);
		}

		break;

		case "getDepartamentos":

		$mysqli->query("set names utf8");
		$result = $mysqli->query("select id, nome as file_name from departamentos order by nome") or die($mysqli->error);

		if($result->num_rows) {

			$json = array();

			while ($item = $result->fetch_assoc()) {
				array_push($json, $item);
			}

			echo json_encode(array("success" => true, "data" => $json));

			exit();
		}

		echo json_encode(array("success" => false));

		break;

		case "getTipoDeArquivos":

			$mysqli->query("set names utf8");

			$menuEmployee = array("docType.rename", "docType.remove");

			$dep = null;
			$empresa = $_SESSION['empresa-id'];

			if($_GET["departamento"]) $dep = $_GET['departamento'];
			else if($_POST["departamento"]) $dep = $_POST['departamento'];

			$query = "(select id, nome as file_name, departamento, 1 as isDefault
						from tipo_de_arquivos as ta
						where empresa is null". ($dep ? " and departamento = $dep" : "").")
						union
						(select id, nome as file_name, departamento, 0 as isDefault
						from tipo_de_arquivos as ta
						WHERE empresa = $empresa". ($dep ? " and departamento = $dep" : "").")
						order by file_name";

			$result = $mysqli->query($query);

			if($result->num_rows) {
				$json = array();

				while ($item = $result->fetch_assoc()) {
					if(AllowTo($_USER_TYPES["INTERNO"])) {
						$item["menuOptions"] = $menuEmployee;
					}

					array_push($json, $item);
				}

				echo json_encode(array("success" => true, "data" => $json));

				exit();
			}

			echo json_encode(array("success" => true, "data" => array()));

		break;

		case "getArquivos":

		$empresa = $_SESSION['empresa-id'];
		$ano = $_POST['ano'];
		$mes = $_POST['mes'];
		$tipo = $_POST['tipoDeArquivo'];
		$departamento = $_POST['departamento'];
		$pesquisa = intval($_POST["pesquisa"]);

		$menuEmployee = array("doc.abrir", "doc.download", "doc.editar"); // "doc.remover"
		$menuBoss = array("doc.abrir", "doc.download", "doc.editar", "doc.remover");
		$menuClient = array("doc.abrir", "doc.download");

		$mysqli->query("set names utf8");

		$query = "SELECT 
		a.id,
		a.ano,
		a.mes,
		a.type,
		a.hash,
		a.nome,
		a.data,
		a.vencimento,
		a.obs,
		a.visualizado_em,
		d.nome as departamento,
		t.nome as tipo,
		u.name as usuario,
		t.isParcelamento as isParcelamento,
		1 as available
		FROM 
		arquivos as a
		LEFT JOIN departamentos as d ON d.id = a.departamento
		LEFT JOIN tipo_de_arquivos as t ON t.id = a.tipo
		LEFT JOIN usuarios as u ON u.id = a.usuario
		WHERE a.empresa = " . $empresa;

		if($pesquisa && $tipo != $cert_id) {
			$query .= " and a.tipo != $cert_id";
		}

		$query = GenQuery($query, array(
			"a.mes" => $mes,
			"a.ano" => $ano,
			"a.departamento" => $departamento,
			"t.id" => $tipo
		));

		$query .= " ORDER BY a.mes DESC, a.ano DESC, a.id DESC";

		$result = $mysqli->query($query) or die($mysqli->error);

		if($result->num_rows) {
			$json = array();

			while ($item = $result->fetch_assoc()) {

				if($_SESSION['user-type'] == $_USER_TYPES["CHEFE"]) {
					$item["menuOptions"] = $menuBoss;
				}

				else if($_SESSION['user-type'] == $_USER_TYPES["FUNCIONARIO"]) {
					$item["menuOptions"] = $menuEmployee;
				}

				else if ($_SESSION['user-type'] == $_USER_TYPES["CLIENTE"]) {

					$hasMenu = true;

					if(safe($item["isParcelamento"])) {
						$vencimento = safe($item["vencimento"]);

						if($vencimento) {
							$vencimento = new DateTime($vencimento);
							$now = new DateTime("now");

							if($now >= $vencimento) {
								$item["available"] = false;
								$hasMenu = false;
							}
						}
					}

					if($hasMenu)
						$item["menuOptions"] = $menuClient;
				}

				$item['link'] = implode(array("user_files", $_SESSION['empresa-id'], $_SESSION['id'], $item["hash"]), "/");

				array_push($json, $item);
			}

			if($pesquisa == 0) {
				UserCheck(array(
					"departamento" => $departamento,
					"tipo" => $tipo,
					"user-type" => $_SESSION["user-type"],
					"empresa-id" => $_SESSION["empresa-id"]
				));
			}

			echo json_encode(array("success" => true, "data" => $json));

			exit();
		}

		echo json_encode(array("success" => true, "data" => array()));

		break;

		case "search":

		$empresa = $_SESSION['empresa-id'];
		$ano = safe($_POST['ano']);
		$vencimento = safe($_POST['vencimento']);
		$mes = safe($_POST['mes']);
		$tipo = safe($_POST['tipoDeArquivo']);
		$departamento = safe($_POST['departamento']);

		$menuEmployee = array("doc.abrir", "doc.download", "doc.editar"); // "doc.remover"
		$menuBoss = array("doc.abrir", "doc.download", "doc.editar", "doc.remover");
		$menuClient = array("doc.abrir", "doc.download");

		$mysqli->query("set names utf8");

		$query = "SELECT 
		a.id,
		a.ano,
		a.mes,
		a.type,
		a.hash,
		a.nome,
		a.data,
		a.vencimento,
		a.obs,
		a.visualizado_em,
		d.nome as departamento,
		t.nome as tipo,
		u.name as usuario
		FROM 
		arquivos as a
		LEFT JOIN departamentos as d ON d.id = a.departamento
		LEFT JOIN tipo_de_arquivos as t ON t.id = a.tipo
		LEFT JOIN usuarios as u ON u.id = a.usuario
		WHERE a.empresa = $empresa";

		if($tipo != $cert_id) {
			$query .= " and a.tipo != $cert_id";
		}

		if(isset($vencimento)) {
			$query .= " and month(a.vencimento) = month('$vencimento')
					and day(a.vencimento) <= day('$vencimento')";
		}

		$query = GenQuery($query, array(
			"a.mes" => $mes,
			"a.ano" => $ano,
			"a.departamento" => $departamento,
			"t.id" => $tipo
		));

		$query .= " ORDER BY a.mes DESC, a.ano DESC, a.id DESC" . (isset($vencimento) ? ", a.vencimento DESC" : "");

		$result = $mysqli->query($query) or die($mysqli->error);

		if($result->num_rows) {
			$json = array();

			while ($item = $result->fetch_assoc()) {
				if($_SESSION['user-type'] == $_USER_TYPES["CHEFE"]) {
					$item["menuOptions"] = $menuBoss;
				}

				else if($_SESSION['user-type'] == $_USER_TYPES["FUNCIONARIO"]) {
					$item["menuOptions"] = $menuEmployee;
				}

				else if ($_SESSION['user-type'] == $_USER_TYPES["CLIENTE"]) {
					$item["menuOptions"] = $menuClient;
				}

				array_push($json, $item);
			}

			echo json_encode(array("success" => true, "data" => $json));

			exit();
		}

		echo json_encode(array("success" => true, "data" => array()));

		break;

		case "deleteDoc":

		$id = $_POST['id'];
		$hash = $_POST['hash'];

		$res = $mysqli->query("delete from arquivos where id = $id limit 1") or die($mysqli->error);

		if($res) {
			if(unlink("../user_files/$hash")) {
				echo json_encode(array("success" => true));
				exit();
			}

			else {
				echo json_encode(array("success" => false, "error" => true, "message" => "Erro ao tentar excluir o arquivo..."));
				exit();	
			}
		}

		echo json_encode(array("success" => false));

		break;

		case "uploadFile":

			$up_id = md5(uniqid(rand(), true));

			$mysqli->query("set names utf8");

			$empresa = $_SESSION['empresa-id'];
			$usuario = $_SESSION['id'];

			$tipo = safe($_POST['tipo']);
			$ano = safe($_POST['ano']);
			$mes = safe($_POST['mes']);
			$nome = safe($_POST['nome']);
			$vencimento = safe($_POST['vencimento']);
			$departamento = safe($_POST['departamento']);
			$observacao = safe($_POST['observacao']);

			$fileField = $_FILES['fileAttach'];

			$fileTmpname = $fileField['tmp_name'];
			$fileName = (isset($nome)) ? $nome : $fileField['name'];
			$fileSize = $fileField['size'];
			$fileType = $fileField['type'];

			$rawName = basename($fileName, '.pdf');

			$folder = implode(array("..", "user_files", $empresa, $_SESSION['id']), "/") . "/";

			if (!is_dir($folder)) {
				$old = umask(0);
			    mkdir($folder, 0766, true);
				umask($old);
			}

			$originalFile = $folder . $up_id;

			if(move_uploaded_file($fileTmpname, $originalFile)) {

				chmod($originalFile, 0766);

				$query = "INSERT INTO arquivos (`nome`, `tipo`, `ano`, `mes`, `tamanho`, `data`, `empresa`, `usuario`, `type`, `hash`, `departamento`, `obs`, `vencimento`) VALUES ('$rawName', '$tipo', '$ano', '$mes', '$fileSize', NOW(), '$empresa', '$usuario', '$fileType', '$up_id', '$departamento', '$observacao', ". (isset($vencimento) ? "'$vencimento'" : 'DEFAULT') .")";

				$result = $mysqli->query($query) or die($mysqli->error);

				echo json_encode(array("success" => true));

				exit();
			}

			echo json_encode(array("success" => false));

		break;

		case "authUser":

			$username = $_POST['username'];
			$password = md5($_POST['password']);

			if(!isset($username) && !isset($password)) exit();

			$query = "SELECT id, hash, username, name, type FROM usuarios WHERE username = '$username' AND password = '$password' LIMIT 1";
			$queryUsuario = $mysqli->query($query) or die($mysqli->error);
			$user = $queryUsuario->fetch_assoc();

			if(!$queryUsuario->num_rows) {
				echo json_encode(array("error" => true, "message" => "Usuário/Senha incorreto(s)"));
				exit();
			}

			if($queryUsuario->num_rows) {
				$_SESSION['hash'] = $user['hash'];
				$_SESSION['id'] = $user['id'];
				$_SESSION['user-type'] = $user['type'];
				$_SESSION['username'] = $user['username'];

				echo json_encode(array("success" => true, "data" => $user));
			}

			break;

			case "checkUserSession":
				if(isset($_SESSION['hash'])) {

					$mysqli->query("set names utf8");

					$hash = $_SESSION['hash'];
					$id = $_SESSION["id"];
					
					$queryResponse = $mysqli->query("select * from usuarios where id = '$id'") or die ($mysqli->error);

					if($queryResponse->num_rows) {
						$user = $queryResponse->fetch_assoc();

						unset($user["password"]);

						$queryString = "
							SELECT Count(*) as count, e.nome
							FROM empresa_usuario AS eu
							LEFT JOIN empresas AS e ON e.id = eu.empresa
							WHERE usuario = $id";

						$soloModeQuery = $mysqli->query($queryString);

						if($soloModeQuery->num_rows) {
							$smq = $soloModeQuery->fetch_assoc();

							$user["soloMode"] = ($smq["count"] > 1 && $smq["count"] != 0) ? false : true;
						}

						$data = array("user" => $user);

						echo json_encode(array("hash" => $_SESSION['hash'], "data" => $data));
					}

					else {
						echo json_encode(array("success" => false, "error" => "Usuario nao encontrado"));
					}

				}
				else
					echo json_encode(array("hash" => false));

			break;
		case "logout":
			unset($_SESSION['id']);
			unset($_SESSION['hash']);
			unset($_SESSION['empresa-id']);
			unset($_SESSION['empresa-cnpj']);
			unset($_SESSION['user-type']);
			unset($_SESSION['username']);
		break;
		case "chooseCompany":

			$cnpj = $_POST['cnpj'];
			ChooseCompany($cnpj, array("omitMessages" => false, "bypass" => true));
			break;

		case "listEmpresas":

		$mysqli->query("set names utf8");

		$id = $_SESSION["id"];

		$queryString = "
			SELECT e.id, e.nome, e.cnpj, e.ativa
			FROM empresa_usuario AS eu
			LEFT JOIN empresas AS e ON e.id = eu.empresa
			WHERE usuario = $id
			ORDER BY e.ativa DESC, e.nome";

		$result = $mysqli->query($queryString);

		$json = array();

		if($result->num_rows) {
			while($row = $result->fetch_assoc()) {
				array_push($json, $row);
			}

			echo json_encode(array("success" => true, "data" => $json));
			exit();
		}

		else echo json_encode(array("success" => true, "data" => $json));

		break;

		case "getEmpresaInfo":

		$cnpj = safe("cnpj", true);

		ChooseCompany($cnpj, array("omitMessages" => true));

		$res = $mysqli->query("select * from empresas where cnpj = $cnpj");

		if($res->num_rows) {
			$empresa = $res->fetch_assoc();

			echo json_encode(array("success" => true, "data" => $empresa));
			exit();
		}

		echo json_encode(array("success" => false));

		break;

		case "newCompany":

		$nome = remove_accents($_POST['nome']);
		$cnpj = $_POST['cnpj'];

		$queryResponse = $mysqli->query("insert into empresas (nome, cnpj) values ('$nome', $cnpj)") or die($mysqli->error);

		if($mysqli->affected_rows) {

			$data = array(
				"id" => $mysqli->insert_id,
				"cnpj" => $cnpj,
				"nome" => $nome
			);

			echo json_encode(array("success" => true, "data" => $data, "message" => "Registro concluido..."));

			$company_id = $mysqli->insert_id;

			$usersQueryResponse = $mysqli->query("select id from usuarios where type = 1 or type = 2") or die($mysqli->error);

			if($usersQueryResponse->num_rows) {

				$queryPiece = array();

				while($user = $usersQueryResponse->fetch_assoc()) {
					$user_id = $user['id'];

					array_push($queryPiece, "('$company_id', $user_id)");
				}

				$queryPiece = implode(',', $queryPiece);

				$empresaUsuarioQueryResponse = $mysqli->query("insert into empresa_usuario (empresa, usuario) values " . $queryPiece) or die($mysqli->error);
			}

			exit();
		}

		echo json_encode(array("success" => false));

		break;

		case "newDefaultUser":

		$usuario = $_POST['usuario'];
		$senha = md5($_POST['senha']);
		$nome = $usuario;

		$queryResponse = $mysqli->query("insert into usuarios (name, username, password, hash, active, priority) values ('$nome', '$usuario', '$senha', '$senha', 1, 6)") or die($mysqli->error);

		if($mysqli->affected_rows) {
			echo json_encode(array("success" => true));
			exit();
		}

		echo json_encode(array("success" => false, "error" => $mysqli->error));

		break;

		case "editFile":

			$obs = safe($_POST["obs"]);
			$ano = safe($_POST["ano"]);
			$mes = ($_POST["mes"] <= 9) ? '0' . $_POST["mes"] :  $_POST["mes"];
			$hash = safe($_POST["hash"]);
			$nome = safe($_POST["nome"]);

			$vencimento = safe($_POST['vencimento']);

			$queryResponse = $mysqli->query("update arquivos set obs = '$obs', ano = '$ano', mes = '$mes', nome = '$nome'". ($vencimento ? ", vencimento = '$vencimento'" : "") ." where hash = '$hash'") or die($mysqli->error);

			if(!$mysqli->error) {
				echo json_encode(array("success" => true));
				exit();
			}
			
			echo json_encode(array("success" => false));

		break;

		case "newDocType":

			$nome = safe($_POST["nome"]);
			$departamento = intval($_POST["ref_departamento"]);
			$padrao = isBoolean($_POST["padrao"]);
			$empresa = $_SESSION["empresa-id"];

			$isParcelamento = false;

			if(preg_match("/^Parcelamento/", $nome)) {
				$isParcelamento = true;
			}

			$query = "insert into tipo_de_arquivos (nome, departamento". (!$padrao ? ", empresa" : "") . ($isParcelamento ? ", isParcelamento" : "") .") values ('$nome', $departamento". (!$padrao ? ", $empresa" : "") . ($isParcelamento ? ", 1" : "") .")";

			$queryResponse = $mysqli->query($query) or die($mysqli->error);

			if($mysqli->affected_rows) {
				echo json_encode(array("success" => true));
				exit();
			}

			echo json_encode(array("success" => false, "message" => $mysqli->error, "error" => true));

		break;

		case "whereAmI":

			$departamento = $_GET["departamento"];
			$tipo_de_arquivo = $_GET["tipo"];

			$breadcrumb = array("Início");

			$mysqli->query("set names utf8");

			$queryResponse = $mysqli->query("select nome from departamentos where id = '$departamento'") or die($mysqli->error);

			if($queryResponse->num_rows) {
				$dep = $queryResponse->fetch_assoc();

				array_push($breadcrumb, $dep["nome"]);
			}

			$queryResponse2 = $mysqli->query("select nome from tipo_de_arquivos where id = '$tipo_de_arquivo'") or die($mysqli->error);

			if($queryResponse2->num_rows) {
				$tipo = $queryResponse2->fetch_assoc();

				array_push($breadcrumb, $tipo["nome"]);
			}

			if($queryResponse->num_rows || $queryResponse2->num_rows) {
				echo json_encode(array("success" => true, "data" => implode("/", $breadcrumb)));
				exit();
			}

			echo json_encode(array("success" => false, "message" => $mysqli->error, "error" => true));

		break;

		case "renameDocType":

			$id = $_POST['id'];
			$nome = safe($_POST['nome']);
			$isParcelamento = false;

			$mysqli->query("set names utf8");

			if(preg_match("/^Parcelamento/", $nome)) {
				$isParcelamento = true;
			}

			$res = $mysqli->query("update tipo_de_arquivos set nome = '$nome'". (($isParcelamento) ? ", isParcelamento = $isParcelamento" : "") ." where id = '$id' ");

			if($res) {

				$json = array("success" => true);

				echo json_encode($json);
				exit();
			}

			echo json_encode(array("success" => false));

			break;

		case "removeDocType":

			$id = $_POST['id'];
			$isDefault = intval($_POST['isDefault']);

			$res = $mysqli->query("delete from tipo_de_arquivos where id = '$id'");

			if($mysqli->affected_rows) {

				$json = array("success" => true);

				echo json_encode($json);
				exit();
			}

			echo json_encode(array("success" => false));

			break;

	}