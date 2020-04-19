<?php
$uid = $_GET['uid'];
if(!array_key_exists("type", $_GET)) {
  die("lack of valid argument!");
}
$type = $_GET['type'];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");
if($uid=="all") {
  if($type == 1) {
    $sql="SELECT * FROM customer_service";
  } else if($type == 2) {
    $sql="SELECT * FROM technique_support";
  } else die("unknown employee type");
}
else {
  if($type == 1) {
    $sql=sprintf("SELECT * FROM customer_service WHERE uid=%d", $uid);
  } else if($type == 2) {
    $sql=sprintf("SELECT * FROM technique_support WHERE uid=%d", $uid);
  } else die("unknown employee type");
}

$result=mysqli_query($con, $sql);
$users=array();
if($uid == "all") {
  while($row = mysqli_fetch_array($result))
  {
    $user=array();
    if($type == 1) {
      $user['uid']=$row['uid'];
      $user['nickname']=$row['nickname'];
      $user['employ_date']=$row['employ_date'];
    } else if ($type == 2) {
      $user['uid']=$row['uid'];
      $user['nickname']=$row['nickname'];
      $user['state']=$row['employ_date'];
      $user['employ_date']=$row['employ_date'];
    }
    array_push($users,$user);
  }
} else {
  if($row = mysqli_fetch_array($result))
  {
    $users['success'] = "1";
    if($type == 1) {
      $users['uid']=$row['uid'];
      $users['nickname']=$row['nickname'];
      $users['employ_date']=$row['employ_date'];
    } else if ($type == 2) {
      $users['uid']=$row['uid'];
      $users['nickname']=$row['nickname'];
      $users['state']=$row['employ_date'];
      $users['employ_date']=$row['employ_date'];
    }
  } else {
    $users['success'] = "0";
    $users['uid'] = $uid;
    $users['error_msg'] = 'User Not Found!';
  }
}
echo json_encode($users,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
mysqli_close($con);
?>
