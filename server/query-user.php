<?php
$uid = $_GET["uid"];
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");
if($uid=="all") {
  $sql="SELECT * FROM user";
}
else $sql=sprintf("SELECT * FROM user WHERE uid=%d",$uid);

$result=mysqli_query($con, $sql);
$users=array();
if($uid == "all") {
  while($row = mysqli_fetch_array($result))
  {
    $user=array();
    $user['uid']=$row['uid'];
    $user['name']=$row['name'];
    $user['login_id']=$row['login_id'];
    $user['avatar']=$row['avatar'];
    $user['phone']=$row['phone'];
    array_push($users,$user);
  }
} else {
  if($row = mysqli_fetch_array($result))
  {
    $users['success'] = "1";
    $users['uid']=$row['uid'];
    $users['name']=$row['name'];
    $users['login_id']=$row['login_id'];
    $users['avatar']=$row['avatar'];
    $users['phone']=$row['phone'];
  } else {
    $users['success'] = "0";
    $users['uid'] = $uid;
    $users['error_msg'] = 'User Not Found!';
  }
}
echo json_encode($users,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
mysqli_close($con);
?>
