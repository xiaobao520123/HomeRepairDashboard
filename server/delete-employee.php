<?php
$res = array();
if ((!key_exists("type", $post) || ($type = $post['type']) != 0 && ($type = $post['type']) != 1) ||
    (!key_exists("uid", $post))) {
    $res['success'] = "0";
    $res['error_msg'] = "参数错误";
    mysqli_close($con);
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}
$id = $post['uid'];

$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");

if ($type == 0) {
  $sql="DELETE FROM `customer_service` WHERE uid='" . $id . "';";
  
  $result=mysqli_query($con, $sql);
  if ($result) {
    echo '{"success": "1"}';
  } else echo '{"success": "0", "error_msg": "删除失败"}';

} else if ($type == 1) {
  $sql="ALTER TABLE `order` SET state=1 WHERE (state=2 or state=3) and ts_uid='" . $id . "';";
  $sql.="ALTER TABLE `order` SET progress=0 WHERE (progress=1 or progress=2) and ts_uid='" . $id . "';";
  $sql.="ALTER TABLE `order` SET state=1 WHERE ts_uid='" . $id . "';";
  $sql.="ALTER TABLE `order` SET ts_uid='no_ts' WHERE ts_uid='" . $id . "';";
  $sql.="DELETE FROM `technique_support` WHERE uid='" . $id . "';";
  
  $result=mysqli_multi_query($con, $sql);
  if ($result) {
    echo '{"success": "1"}';
  } else echo '{"success": "0", "error_msg": "删除失败"}';
}

mysqli_close($con);
?>
