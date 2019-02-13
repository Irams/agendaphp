<?php

//credeciales de la base de datos

define('DB_USUARIO', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE); //Opcionalmente en el quinto parámetro se especifica el puerto de conexión a la BD

//echo $conn->ping(); si nos regresa un 1 la conexión está ok


