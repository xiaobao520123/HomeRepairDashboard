<?php
$oid = $_GET["oid"];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");
if($oid=="all") {
  $sql="SELECT * FROM `order`";
}
else $sql=sprintf("SELECT * FROM `order` WHERE oid='%s'",mysqli_real_escape_string($con, $oid));
$result=mysqli_query($con, $sql);
$orders=array();
if($oid == "all") {
  while($row = mysqli_fetch_array($result))
  {
    $order=array();
    $order['oid']=$row['oid'];
    $order['uid']=$row['uid'];
    $order['ts_uid']=$row['ts_uid'];
    $order['time']=$row['time'];
    $order['type']=$row['type'];
    $order['address']=$row['address'];
    $order['state']=$row['state'];
    $order['progress']=$row['progress'];    
    $order['price']=$row['price']; 
    $order['payment_state']=$row['payment_state'];     
    $order['detail']=$row['detail']; 
    $order['user_picture']=$row['user_picture'];     
    $order['ts_picture']=$row['ts_picture'];      
    $order['remark']=$row['remark'];     
    array_push($orders,$order);
  }
} else {
  if($row = mysqli_fetch_array($result))
  {
    $orders['success'] = "1";
    $orders['oid']=$row['oid'];
    $orders['uid']=$row['uid'];
    $orders['ts_uid']=$row['ts_uid'];
    $orders['time']=$row['time'];
    $orders['type']=$row['type'];
    $orders['address']=$row['address'];
    $orders['state']=$row['state'];
    $orders['progress']=$row['progress'];    
    $orders['price']=$row['price']; 
    $orders['payment_state']=$row['payment_state'];     
    $orders['detail']=$row['detail']; 
    $orders['user_picture']=$row['user_picture'];     
    $orders['ts_picture']=$row['ts_picture'];      
    $orders['remark']=$row['remark'];   
  } else {
    $orders['success'] = "0";
    $orders['oid'] = $oid;
    $orders['error_msg'] = 'Order Not Found!';
  }
}
echo json_encode($orders,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
mysqli_close($con);
?>
