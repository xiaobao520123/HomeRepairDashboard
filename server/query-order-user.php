<?php
$oid = $_GET["oid"];
$uid = $_GET["uid"];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");
if($oid=="all") {
  $sql=sprintf("SELECT a.oid,a.time,b.name AS 'ts_name',a.type,a.state,a.payment_state FROM `order` AS a LEFT JOIN `user` AS b ON a.ts_uid=b.uid WHERE a.uid='%s'",
  mysqli_real_escape_string($con, $uid));
}
else $sql=sprintf("SELECT a.oid,a.time,b.name AS 'ts_name',a.type,a.state,a.payment_state FROM `order` AS a LEFT JOIN `user` AS b ON a.ts_uid=b.uid WHERE a.uid='%s' and a.oid='%s'",
mysqli_real_escape_string($con, $uid),
mysqli_real_escape_string($con, $oid));
$result=mysqli_query($con, $sql);
$orders=array();
if($oid == "all") {
  while($row = mysqli_fetch_array($result))
  {
    $order=array();
    $order['oid']=$row['oid'];
    $order['time']=$row['time'];
    $order['ts_name']=$row['ts_name'];
    $order['type']=$row['type'];
    $order['state']=$row['state'];
    $order['payment_state']=$row['payment_state'];
    array_push($orders,$order);
  }
} else {
  if($row = mysqli_fetch_array($result))
  {
    $orders['success'] = "1";
    $orders['oid']=$row['oid'];
    $orders['time']=$row['time'];
    $orders['ts_name']=$row['ts_name'];
    $orders['type']=$row['type'];
    $orders['state']=$row['state'];
    $orders['payment_state']=$row['payment_state']; 
  } else {
    $orders['success'] = "0";
    $orders['oid'] = $oid;
    $orders['uid'] = $uid;
    $orders['error_msg'] = 'Order Not Found!';
  }
}
echo json_encode($orders,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
mysqli_close($con);
?>
