<?php
$id = $post['id'];
$text = $post['text'];
$enabled = $post['enabled'];
$last_modify = $post['last_modify'];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");

$sql="UPDATE quick_answer SET text='" . $text . 
    "', enabled=" . $enabled . 
    ", last_modify='" . $last_modify .
    "' WHERE id=" . $id;
$result=mysqli_query($con, $sql);

mysqli_close($con);
?>
