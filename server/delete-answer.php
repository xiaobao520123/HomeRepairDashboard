<?php
$id = $post['id'];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    echo '{success: 0}';
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");

$sql="DELETE FROM quick_answer WHERE id='" . $id . "';";

$result=mysqli_query($con, $sql);
if ($result) {
  echo '{"success": 1}';
} else echo '{"success": 0}';
mysqli_close($con);
?>
