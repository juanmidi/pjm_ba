<?php
 	require_once("Rest.inc.php");
	require_once("connection.php");

	class API extends REST {
	
		public $data = "";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
			$this->mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB);
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
		}
				
		private function login(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$tmp = json_decode(file_get_contents("php://input"),true);
			$user = $tmp['user'];
			$pass = $tmp['pass'];

			if(!empty($user) and !empty($pass)){
					//$query="SELECT uid, name, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
					
					$query="SELECT * FROM fichas WHERE dni = '$user' AND pass = '$pass' AND aceptado=1 LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
					$result = array();
					if($r->num_rows > 0) {
						//$result = $r->fetch_assoc();
						$result = array_map('utf8_encode', $r->fetch_assoc());	

						// If success everythig is good send header as "OK" and user details
						$this->response($this->json($result), 200);
					}
					$this->response('', 204);	// If no records "No Content" status
			}
			
			$error = array('status' => "Failed", "msg" => "Usuarios o contraseña no válida");
			$this->response($this->json($error), 400);
		}







	private function alumnos()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		if (isset($this->_request['region'])) {

			$region = (string)$this->_request['region'];

			if ($region == '0') {
				//es Admin
				$query = "SELECT f.id, CONCAT (f.apellido, ', ', f.nombre) AS alumno, 
									f.aceptado, f.region, f.distrito, f.comision, f.colegio, f.rol 
									FROM fichas f
									order by rol desc, alumno";
			} elseif ((int)$region > 0) {
				// # mayor que 0 es regional
				$query = "SELECT f.id, CONCAT (f.apellido, ', ', f.nombre) AS alumno, 
									f.aceptado, f.region, f.distrito, f.comision, f.colegio, f.rol  
									FROM fichas f
									WHERE f.region = $region
									order by rol desc, alumno";
			} elseif ($region == '') {
				//si no si tiene región es distrital

				if (isset($this->_request['distrito'])) {

					$distrito = (string)$this->_request['distrito'];

					$query = "SELECT f.id, CONCAT (f.apellido, ', ', f.nombre) AS alumno, f.aceptado, f.region, f.distrito, f.comision  
										FROM fichas f
										WHERE f.distrito = $distrito
										order by alumno";
				} else { }
			}
		}


		// $query= "SELECT f.id, CONCAT (f.apellido, ', ', f.nombre) AS alumno, f.aceptado, f.region, f.distrito, f.comision  
		// 				 FROM fichas f 
		// 				 WHERE f.rol=0 AND f.distrito
		// 				 order by alumno";

		$this->mysqli->set_charset("utf8");
		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			$result = array();
			while ($row = $r->fetch_assoc()) {
				$result[] = $row; //array_map('utf8_encode', $row);
			}
			//echo print_r($result);
			//echo json_encode($result);
			$this->response($this->json($result), 200); // send user details
		}
		$this->response('', 204);	// If no records "No Content" status
	}


		private function alumno(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				
				$query="SELECT * FROM fichas where `id`= $id";

				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();
				  $result = $this->utf8_converter($result);
					// echo print_r($result);
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		


		private function insertAlumno(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$customer = json_decode(file_get_contents("php://input"),true);

			$column_names = array('apellido', 'nombre','dni', 'email', 'pass', 'colegio', 'telefono', 'distrito', 'region', 'escuela', 'rol', 'comision','genero');
			$keys = array_keys($customer);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){
			   if(!in_array($desired_key, $keys)) {
							$$desired_key = '';
					}else{
						$$desired_key = utf8_decode($customer[$desired_key]);
					}
				
				if($columns.$desired_key=='region'){
					$values. $tmp=0;
				}
					$columns = $columns.$desired_key.',';
					$tmp="'".$$desired_key."'";
					$values = $values. $tmp . ",";
			}

			$query = "INSERT INTO fichas (".trim($columns,',').") VALUES(".trim($values,',').")";
			
			if(!empty($customer)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				//devuelve el id del registro insertado
				$id = $this->mysqli->insert_id;
				$success = array('status' => "Success", "msg" => "alumno creado satisfactoriamente.", "id" => $id);
				$this->response($this->json($success),200);
			}else{
				$this->response('',204);	//"No Content" status
			}
				
		}

		
		private function updateAlumno(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$customer = json_decode(file_get_contents("php://input"),true);
			$id = (int)$customer['id'];
			

			$apellido =utf8_decode($customer['customer']['apellido']);
			$nombre =utf8_decode($customer['customer']['nombre']);
			$dni=$customer['customer']['dni'];
			$genero = $customer['customer']['genero'];
			$pass = utf8_decode($customer['customer'][ 'pass']);
			$email=$customer['customer']['email'];
			$colegio = utf8_decode($customer['customer']['colegio']);
			$telefono = $customer['customer']['telefono'];
			$region =(int)$customer['customer'][ 'region'];
			$distrito = (int)$customer['customer']['distrito'];
			$comision = (string)$customer['customer']['comision'];
			$cargo = (int)$customer[ 'customer'][ 'cargo'];
			$rol =(int)$customer['customer']['rol'];
				
			$query="UPDATE fichas SET 
					apellido='$apellido', 
					nombre='$nombre', 
					dni='$dni', 
					genero='$genero', 
					email='$email', 
					pass='$pass',
					colegio='$colegio',
					telefono='$telefono',
					region= $region,
					distrito=$distrito,
					comision= $comision,
					cargo= $cargo,
					rol=$rol
				WHERE id=$id";

			if(!empty($customer)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array("id" => $id);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}



	private function updateAceptado()
	{
		if($this->get_request_method() != "GET"){ 
			$this->response('',406);
		}
		$id = (int)$this->_request['id'];
		$estado = (int)$this->_request['estado'];



		$query = "UPDATE fichas SET 
				aceptado=	$estado 
				WHERE id=$id";


			$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
			$success = array("id" => $id);
			$this->response($this->json($success), 200);

	}

	private function updateComision()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$id = (int)$this->_request['id'];
		$comision = (int)$this->_request['comision'];

		$query = "UPDATE fichas SET 
				comision = $comision 
				WHERE id = $id";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		$success = array("id" => $id);
		$this->response($this->json($success), 200);
	}


		private function regiones(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * FROM regiones ORDER BY nombre";
			
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					 $result[] = array_map('utf8_encode', $row);
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}

	private function ver_comision_del_distrito()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$distrito = (int)$this->_request['distrito'];

		$query = "SELECT distinct `comision` FROM `fichas` 
		WHERE distrito = $distrito";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			$result = array();
			while ($row = $r->fetch_assoc()) {
				$result[] = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200); // send user details
		}
		$this->response('', 204);	// If no records "No Content" status
	}


		private function cargos()
		{
			if ($this->get_request_method() != "GET") {
				$this->response('', 406);
			}
			$query = "SELECT * FROM cargos ORDER BY nombre";
			$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

			if ($r->num_rows > 0) {
				$result = array();
				while ($row = $r->fetch_assoc()) {
					$result[] = array_map('utf8_encode', $row);
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('', 204);	// If no records "No Content" status
		}

		private function roles(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT id, nombre FROM roles";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					 $result[] = array_map('utf8_encode', $row);
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function deleteAlumno(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM fichas WHERE id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}

		private function darDeBajaAlumno(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="UPDATE alumnos SET baja=1 WHERE id=$id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Se actualizó el registro.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);
		}	

	private function ver_comision(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}

			$ncomision = $this->_request['ncomision'];
			$distrito = $this->_request[ 'distrito'];





			if($ncomision != 0){
						$query = "SELECT  CONCAT(apellido, ', ', nombre) as alumno,
						comision, es_postulante 
						FROM `fichas`
						WHERE	
							comision=$ncomision AND
							distrito=$distrito";
			} else {
						$query = "SELECT  CONCAT(apellido, ', ', nombre) as alumno,
						comision, es_postulante 
						FROM `fichas`";
			}

			
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					 $result[] = array_map('utf8_encode', $row);
				}
				//echo print_r($result);
				//echo json_encode($result);
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}

	private function listar_comisiones()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$distrito = $this->_request['distrito'];

		//$query = "SELECT DISTINCT comision from fichas order by comision";

		$query = "SELECT DISTINCT comision from fichas
							WHERE 
								distrito=$distrito
							ORDER BY comision";


		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			$result = array();
			while ($row = $r->fetch_assoc()) {
				$result[] = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}

	private function listar_distritos()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		if (isset($this->_request['region'])) {
			$region = (int)$this->_request['region'];
			if($region != ''){
				$query = "SELECT * from regiones WHERE region=$region order by nombre";
			} else {
				$query = "SELECT * from regiones order by nombre";
			}

		} else {	
			$query = "SELECT * from regiones order by nombre";

		}	


		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			$result = array();
			while ($row = $r->fetch_assoc()) {
				$result[] = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}

	private function contar_votos()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$ncomision = (int)$this->_request['ncomision'];
		$distrito = (int)$this->_request['distrito'];
		$vuelta = (int)$this->_request['vuelta'];
		$instancia = (int)$this->_request['instancia'];

		$query = "SELECT count(id) as cuenta from votos
							WHERE
							comision=$ncomision and
							distrito=$distrito and
							vuelta=$vuelta and
							instancia= $instancia";
		
		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}

	private function contar_postulantes()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$ncomision = (int)$this->_request['ncomision'];
		$distrito = (int)$this->_request['distrito'];
		$vuelta = (int)$this->_request['vuelta'];
		$instancia = (int)$this->_request['instancia'];

		$query = "SELECT count(id) as cuenta from postulantes
							WHERE
							comision=$ncomision and
							distrito=$distrito and
							vuelta=$vuelta and
							instancia= $instancia";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}


	private function ver_postulantes()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		// $query = "SELECT CONCAT(apellido,', ', nombre) as alumno, dni, id as id_postulante
		// 					FROM `fichas` 
		// 					WHERE es_postulante = 1 ";

		$comision = (int)$this->_request['comision'];
		$distrito = (int)$this->_request['distrito'];
		$vuelta = (int)$this->_request['vuelta'];
		$instancia = (int)$this->_request['instancia'];

		$query = "SELECT  CONCAT(f.apellido,', ', f.nombre) as alumno, f.colegio, f.id as id_postulante
			FROM fichas f
			INNER JOIN  postulantes p
			ON f.id = p.id_alumno
			WHERE 
				p.comision = $comision AND
				p.distrito = $distrito AND
				p.vuelta = $vuelta AND
				p.instancia = $instancia
			ORDER BY alumno";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		$result=array();
		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result[] = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}

	private function insertar_voto()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$idAlumno = (int)$this->_request['idalumno'];
		$idvoto = (int)$this->_request['idvoto'];
		$comision = (int)$this->_request['comision'];
		$distrito = (int)$this->_request['distrito'];
		$vuelta = (int)$this->_request['vuelta'];
		$instancia= (int)$this->_request['instancia'];

		if (!empty($idAlumno) && !empty($idvoto)) {
		$query = "INSERT INTO votos (id_alumno, voto, comision, distrito, vuelta, instancia) 
							VALUES ($idAlumno, $idvoto, $comision, $distrito, $vuelta, $instancia)";

			$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
			$success = array('status' => "Success", "msg" => "voto insertado satisfactoriamente.");
			$this->response($this->json($success), 200);
		} else {
			$this->response('', 204);	//"No Content" status
		}

	}

	private function buscar_voto()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$idalumno = (int)$this->_request['idalumno'];
		$comision = (int)$this->_request['comision'];
		$distrito = (int)$this->_request['distrito'];
		$vuelta = (int)$this->_request['vuelta'];
		$instancia = (int)$this->_request['instancia'];

		$query = "SELECT
				CONCAT(f.apellido, ', ', f.nombre) AS alumno
				FROM
						`fichas` f
				INNER JOIN votos v ON
						f.id = v.voto
				WHERE
						v.id_alumno=$idalumno AND
						v.comision= $comision AND
						v.distrito= $distrito AND
						v.vuelta= $vuelta AND
						v.instancia= $instancia
						";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}


	private function buscar_postulado()
	// buscar por id si el alumno se postuló para ser representante
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$idalumno = (int)$this->_request['idalumno'];
		$distrito = (int)$this->_request[ 'distrito'];

		$query = "SELECT
						id_alumno
				FROM
						`postulantes`
				WHERE
						id_alumno = $idalumno AND distrito = $distrito";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}

	private function buscar_dni()
	// buscar por id si el alumno se postuló para ser representante
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$dni = (string)$this->_request['dni'];

		$query = "SELECT
				dni
				FROM
						`fichas`
				WHERE
						dni = '$dni' LIMIT 1";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}

	// 	private function postular_alumno()
	// 	// buscar por id si el alumno se postuló para ser representante
	// 	{
	// 		if ($this->get_request_method() != "GET") {
	// 			$this->response('', 406);
	// 		}

	// 		$idalumno = (int)$this->_request['idalumno'];

	// 		$query = "UPDATE fichas SET es_postulante = 1 WHERE id = $idalumno";

	// 		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
	// 		$success = array('status' => "Success", "msg" => "Se actualizó el registro.");
	// 		$this->response($this->json($success), 200);
	// }



	//este está ok //desactivar el de arriba para seguir el desarrollo
	
	private function postular_alumno()
	// buscar por id si el alumno se postuló para ser representante
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$idalumno = (int)$this->_request['idalumno'];
		$comision = (int)$this->_request['comision'];
		$region = (int)$this->_request[ 'region'];
		$distrito = (int)$this->_request['distrito'];
		$vuelta = (int)$this->_request[ 'vuelta'];
		$instancia = (int)$this->_request['instancia'];

		$query = "INSERT INTO postulantes (id_alumno, comision, region, distrito, vuelta, instancia) 
													VALUES ($idalumno, $comision, $region, $distrito, $vuelta,  $instancia)";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		$success = array('status' => "Success", "msg" => "Se actualizó el registro.");
		$this->response($this->json($success), 200);
	}

	
	

	private function totales()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$ncomision = $this->_request['ncomision'];
		$distrito = $this->_request[ 'distrito'];

		// if ($ncomision != 0) {
		// 	$query = "SELECT  count(apellido) as total
		// 				FROM `fichas`
		// 				WHERE	comision=$ncomision and distrito=$distrito";
		// } else {
		// 	$query = "SELECT  count(apellido) as total
		// 				FROM `fichas`";
		// }
		
		if ($ncomision != 0) {
			$query = "SELECT  count(apellido) as total
						FROM `fichas`
						WHERE	comision=$ncomision and distrito=$distrito";
		} else {
			$query = "SELECT  count(apellido) as total
						FROM `fichas`";
		}

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			// $result = array();
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
				//echo print_r($result);
				//echo json_encode($result);
			$this->response($this->json($result), 200); // send user details
		}
		$this->response('', 204);	// If no records "No Content" status
	}


	private function get_config()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$clave = $this->_request['clave'];

		$query = "SELECT valor
						FROM config
						WHERE	clave='$clave'";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			// $result = array();
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200);
		}
		$this->response('', 204);
	}

	private function set_config()
	{
		if ($this->get_request_method() != "POST") {
			$this->response('', 406);
		}

		$tmp = json_decode(file_get_contents("php://input"), true);

		$clave = $tmp['clave'];
		$str = $tmp['valor'];
		$valor = utf8_decode($str);
		$valor = $str;
		$query = "UPDATE config SET valor = '$valor' WHERE clave = '$clave'";
		//para evitar problemas con el set de caracteres y acentos
		$acentos = $this->mysqli->query("SET NAMES 'utf8'");
		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		$success = array('status' => "Success", "msg" => "Se actualizó el registro.");
		$this->response($this->json($success), 200);
	}

	private function set_config_back()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$clave = (string)$this->_request['clave'];
		$str = (string)$this->_request['valor'];
		// $valor = utf8_decode($str);
		$valor = nl2br($str) . "mono";
		$query = "UPDATE config SET valor = '$valor' WHERE clave = '$clave'";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
		$success = array('status' => "Success", "msg" => "Se actualizó el registro.");
		$this->response($this->json($success), 200);
	}

	private function estadisticas()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$ncomision = (int)$this->_request['ncomision'];
		$distrito =(int)$this->_request['distrito'];
		$vuelta =(int)$this->_request['vuelta'];
		$instancia =(int)$this->_request['instancia'];


		$query = "SELECT 
							CONCAT(fichas.apellido,', ', fichas.nombre) as alumno, 
							(SELECT count(voto) from votos WHERE votos.voto=postulantes.id_alumno) as votos
							from
							postulantes inner join fichas on postulantes.id_alumno = fichas.id
							WHERE postulantes.comision = $ncomision AND postulantes.distrito=$distrito
		 					AND postulantes.vuelta=$vuelta AND postulantes.instancia=$instancia
							ORDER BY votos desc";


		// $query = "SELECT CONCAT(f.apellido,', ', f.nombre) as alumno, COUNT(v.voto)  as votos
		// 					FROM `fichas` f INNER JOIN votos v
		// 					ON f.id=v.voto
		// 					WHERE v.comision = $ncomision AND v.distrito=$distrito
		// 					AND v.vuelta=$vuelta AND v.instancia=$instancia
		// 					GROUP BY v.voto";

		//continuar el desarrollo -26-05-19
		// $query = "SELECT
		// 							CONCAT(apellido,', ', nombre) as alumno, 
		// 							(select count(voto) from votos where voto=fichas.id) as votos
		// 					FROM
		// 							fichas
		// 					WHERE
		// 							es_postulante = 1 and comision = $ncomision and distrito = $distrito
		// 					ORDER BY
		// 							votos DESC";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			$result = array();
			while ($row = $r->fetch_assoc()) {
				$result[] = array_map('utf8_encode', $row);
			}
				//echo print_r($result);
				//echo json_encode($result);
			$this->response($this->json($result), 200); // send user details
		}
		$this->response('', 204);	// If no records "No Content" status
	}

	private function buscar_vuelta()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$comision = (int)$this->_request['comision'];
		$distrito = (int)$this->_request['distrito'];
		$instancia = (int)$this->_request['instancia'];


		$query = "SELECT vuelta FROM vueltas 
					WHERE 
					comision =  $comision AND
					distrito = $distrito AND
					instancia =  $instancia";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result = array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200); // send user details
		}
		$this->response('', 204);	// If no records "No Content" status
	}
	

	private function tiene_voto()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}

		$idalumno = (int)$this->_request['idalumno'];
		$comision = (int)$this->_request['comision'];
		$distrito = (int)$this->_request['distrito'];
		$vuelta = (int)$this->_request['vuelta'];
		$instancia = (int)$this->_request['instancia'];

		$query="SELECT voto FROM votos 
					WHERE 
					id_alumno= $idalumno AND
					comision=$comision AND
					distrito=$distrito AND
					vuelta=$vuelta AND
					instancia=$instancia";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		if ($r->num_rows > 0) {
			while ($row = $r->fetch_assoc()) {
				$result= array_map('utf8_encode', $row);
			}
			$this->response($this->json($result), 200); // send user details
		}
		$this->response('', 204);	// If no records "No Content" status
	}


	private function set_voto()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$id = (int)$this->_request['id'];
		if ($id > 0) {
			$query = "UPDATE usuarios SET notification_show = 0 WHERE id = $id";
			$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);
			$success = array('status' => "Success", "msg" => "Se actualizó el registro.");
			$this->response($this->json($success), 200);
		} else
			$this->response('', 204);
	}




		

		private function sistema(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}

			$query="SELECT * FROM sistema";

			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					 $result[] =array_map('utf8_encode', $row);
				}	
				$this->response($this->json($result), 200);
			}
			$this->response('',204);
		}

	private function reset()
	{
		if ($this->get_request_method() != "GET") {
			$this->response('', 406);
		}
		$query = "UPDATE fichas SET `es_postulante` = NULL";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);

		$query = "TRUNCATE TABLE votos";

		$r = $this->mysqli->query($query) or die($this->mysqli->error . __LINE__);


		$this->response($this->json($result), 200);
	}


	private function version(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
				$query="SELECT version FROM sistema";
				
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

				if($r->num_rows > 0){
					while($row = $r->fetch_assoc()){
						$result= $row;
					}
				} else {
					$result="";
				}
			$this->response($this->json($result), 200);
		}

	private function notificaciones(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
				$query="SELECT notification_msg FROM sistema";
				
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

				$result = array();
				if($r->num_rows > 0){
					while($row = $r->fetch_assoc()){
						$result[] = array_map('utf8_encode', $row);
					}
				} else {
					$result="";
				}
			$this->response($this->json($result), 200);
		}

		private function update_notification(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="UPDATE usuarios SET notification_show = 0 WHERE id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Se actualizó el registro.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);
		}


		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data, JSON_UNESCAPED_UNICODE);
			}
		}

		private function utf8_converter($array)
		{
		    array_walk_recursive($array, function(&$item, $key){
		        if(!mb_detect_encoding($item, 'utf-8', true)){
		                $item = utf8_encode($item);
		        }
		    });
		 
		    return $array;
		}

	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
