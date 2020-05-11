<?php
$oid = $_GET["oid"];
$uid = $_GET["ts_uid"];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");
if($oid=="all") {
  $sql=sprintf("SELECT oid,progress FROM `order` WHERE ts_uid='%s'",
  mysqli_real_escape_string($con, $uid));
}
else $sql=sprintf("SELECT oid,progress FROM `order` WHERE ts_uid='%s' and oid='%s'",
mysqli_real_escape_string($con, $uid),
mysqli_real_escape_string($con, $oid));
$result=mysqli_query($con, $sql);
$orders=array();
if($oid == "all") {
  while($row = mysqli_fetch_array($result))
  {
    $order=array();
    $order['oid']=$row['oid'];
    $order['progress']=$row['progress'];
    array_push($orders,$order);
  }
} else {
  if($row = mysqli_fetch_array($result))
  {
    $orders['success'] = "1";
    $orders['oid']=$row['oid'];
    $orders['progress']=$row['progress'];
  } else {
    $orders['success'] = "0";
    $orders['oid'] = $oid;
    $orders['ts_uid'] = $uid;    
    $orders['error_msg'] = 'Order Not Found!';
  }
}
echo json_encode($orders,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
mysqli_close($con);
?>
