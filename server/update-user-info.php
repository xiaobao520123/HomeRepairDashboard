<?php
$id = $post['uid'];
$res = array();

$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");

$sql = "SELECT COUNT(*) AS c from user where uid='" . $id . "';";
$result=mysqli_query($con, $sql);
$row = mysqli_fetch_array($result);
if ($row['c'] === 0) {
    $res['success'] = "0";
    $res['error_msg'] = "指定用户不存在";
    mysqli_close($con);
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}

if (key_exists("newUID", $post)) {
    $newUID = $post[newUID];
    $sql = "SELECT COUNT(*) AS c from user where uid='" . $newUID . "';";
    $result=mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result);
    if ($row['c'] >= 1) {
        $res = array();
        $res['success'] = "0";
        $res['error_msg'] = "新UID已经存在";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }
}

if (key_exists("newLoginID", $post)) {
    $newLoginID = $post["newLoginID"];
    $sql = "SELECT COUNT(*) AS c from user where login_id='" . $newLoginID . "';";
    $result=mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result);
    if ($row['c'] >= 1) {
        $res = array();
        $res['success'] = "0";
        $res['error_msg'] = "新登录账户已经存在";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }
}

$sql = "";

if (key_exists("newUID",$post)) {
    $newUID = $post["newUID"];
    $sql = $sql . "UPDATE `user` SET " .
    "uid='" . $newUID .
    "' WHERE uid='" . $id . "';";

    $sql = $sql . "UPDATE `order` SET " .
    "uid='" . $newUID .
    "' WHERE uid='" . $id . "';";

    $sql = $sql . "UPDATE `technique_support` SET " .
    "uid='" . $newUID .
    "' WHERE uid='" . $id . "';";

    $sql = $sql . "UPDATE `customer_service` SET " .
    "uid='" . $newUID .
    "' WHERE uid='" . $id . "';";

    $id = $newUID;
}

if (key_exists("newLoginID",$post)) {
    $newLoginID = $post["newLoginID"];
    $sql = $sql . "UPDATE `user` SET " .
    "login_id='" . $newLoginID .
    "' WHERE uid='" . $id . "';";
}

if (key_exists("newName",$post)) {
    $newName = $post["newName"];
    $sql = $sql . "UPDATE `user` SET " .
    "name='" . $newName .
    "' WHERE uid='" . $id . "';";
}

if (key_exists("newAvatar",$post)) {
    $newAvatar = $post["newAvatar"];
    $sql = $sql . "UPDATE `user` SET " .
    "avatar='" . $newAvatar .
    "' WHERE uid='" . $id . "';";
}

if (key_exists("newPhone",$post)) {
    $newPhone = $post["newPhone"];
    $sql = $sql . "UPDATE `user` SET " .
    "phone='" . $newPhone .
    "' WHERE uid='" . $id . "';";
}

if ($sql !== "") {
    $result=mysqli_multi_query($con, $sql);
    if ($result === false) {
        $res = array();
        $res['success'] = "0";
        $res['error_msg'] = mysqli_error($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        mysqli_close($con);
        die();
    }
}

$res = array();
$res['success'] = "1";
echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

mysqli_close($con);
?>
