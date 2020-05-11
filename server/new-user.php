<?php
$res = array();

if ((!key_exists("uid", $post) || ($uid = $post["uid"]) === "") || 
    (!key_exists("login_id", $post) || ($login_id = $post["login_id"]) === "") ||
    (!key_exists("name", $post)) ||
    (!key_exists("phone", $post))) 
{
    $res['success'] = "0";
    $res['error_msg'] = "参数错误";
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}
$name = $post["name"];
$password = $post["password"];
$avatar = $post["avatar"];
$phone = $post["phone"];

$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    $res['success'] = "0";
    $res['error_msg'] = "连接远程数据库失败";
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");

$sql = "";

$sql = "SELECT COUNT(*) AS c from user where uid='" . $uid . "';";
$result=mysqli_query($con, $sql);
$row = mysqli_fetch_array($result);
if ($row['c'] >= 1) {
    $res['success'] = "0";
    $res['error_msg'] = "该用户编号（UID：" . $uid . "）已经存在";
    mysqli_close($con);
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}

$sql = "SELECT COUNT(*) AS c from user where login_id='" . $login_id . "';";
$result=mysqli_query($con, $sql);
$row = mysqli_fetch_array($result);
if ($row['c'] >= 1) {
    $res['success'] = "0";
    $res['error_msg'] = "该登录账号（LoginID：" . $login_id . "）已经存在";
    mysqli_close($con);
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}
$sql = "INSERT INTO `user` (uid, name, login_id, password, phone, avatar) VALUES " .
        "('" . $uid . 
        "', '" . $name . 
        "', '" . $login_id .
        "', '" . $password .
        "', '" . $phone .
        "', " . ($avatar.length === 0 ? "null" : ("'" . $avatar . "'")) .
        ");";
$result=mysqli_query($con, $sql);
if (!$result) {
    $res['success'] = "0";
    $res['error_msg'] = "参数有误";
    mysqli_close($con);
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}

$res = array();
$res['success'] = "1";
echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

mysqli_close($con);
?>
