<?php header("Content-Type: text/plain; charset=iso-8859-1");

include "connection.php";

function generarCodigo($longitud) {
	$key = '';
	$pattern = '1234567890abcdefghijklmnopqrstuvwxyz';
	$max = strlen($pattern)-1;
	for($i=0;$i < $longitud;$i++) $key .= $pattern{mt_rand(0,$max)};
	return $key;
}

function updateDb($dni, $pass){
	global $servername, $username, $password, $dbname;
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
	    die("Fallo en la conexión: " . $conn->connect_error);
	} 
	$sql = "UPDATE `alumnos` SET pass='". $pass ."' WHERE dni='" . $dni . "'";
	if ($conn->query($sql) === TRUE) {
	    $result="ok";
	} else {
	    $result="Error : " . $sql . "<br>" . $conn->error;
	}
	$conn->close();
	return $result;
}

$dni=$_POST["dni"];
$email=$_POST["email"];
$pass=generarCodigo(4); 
$result=updateDb($dni, $pass);
if ($result=="ok"){
	$cuerpo="Este email ha sido enviado porque ingresaste a la app de Parlamento Juvenil del Mercosur. <br>\r\n La contraseña para el ingreso es: " . $pass;
	$para  = $email;
	$titulo = utf8_decode('Parlamento Juvenil del Mercosur 2019');
	$mensaje = "<html><body>" . utf8_decode($cuerpo) . "</body></html>";
	$cabeceras  = 'MIME-Version: 1.0' . "\r\n";
	$cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	$cabeceras .= 'From: webmaster@rvm-web.com' . "\r\n" .
    'Reply-To: webmaster@rvm-web.com' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();
	mail($para, $titulo, $mensaje, $cabeceras);
	echo "ok";
}else{
	echo "error";
}
?>
