<?php
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

$sql="INSERT INTO quick_answer(text, enabled, last_modify) VALUES " .
     '("' . $text . '", ' . $enabled . ', "' . $last_modify . '");';

$result=mysqli_query($con,$sql);
if($result) {
  $sql="SELECT LAST_INSERT_ID();";
  $result=mysqli_query($con, $sql);
  while($row = mysqli_fetch_array($result)){
   $code = array();
   $code['success'] = 1;
   $code['id'] = $row[0];
   echo json_encode($code);
  }
} else echo '{"success": 0}';

mysqli_close($con);
?>
