<?php
$id = $post['uid'];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    echo '{"success": "0", "error_msg": "连接远程数据库失败！"}';
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");

$sql="DELETE FROM `order` WHERE uid='" . $id . "';";
$sql.="DELETE FROM `technique_support` WHERE uid='" . $id . "';";
$sql.="DELETE FROM `customer_service` WHERE uid='" . $id . "';";
$sql.="DELETE FROM `user` WHERE uid='" . $id . "';";

$result=mysqli_multi_query($con, $sql);
if ($result) {
  echo '{"success": "1"}';
} else echo '{"success": "0", "error_msg": "删除失败"}';
mysqli_close($con);
?>
