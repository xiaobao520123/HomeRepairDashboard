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
    $sql = "SELECT COUNT(*) AS c from `customer_service` where uid='" . $id . "';";
    $result=mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result);
    if ($row['c'] === 0) {
        $res['success'] = "0";
        $res['error_msg'] = "指定客服人员不存在";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }
    $sql = "";

    if (key_exists("newNickname",$post)) {
        $newNickname = $post["newNickname"];
        $sql = $sql . "UPDATE `customer_service` SET " .
        "nickname='" . $newNickname .
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
} else if ($type == 1) {
    $sql = "SELECT COUNT(*) AS c from `technique_support` where uid='" . $id . "';";
    $result=mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result);
    if ($row['c'] === 0) {
        $res['success'] = "0";
        $res['error_msg'] = "指定技术人员不存在";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }
    $sql = "";

    if (key_exists("newNickname",$post)) {
        $newNickname = $post["newNickname"];
        $sql = $sql . "UPDATE `technique_support` SET " .
        "nickname='" . $newNickname .
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
}

$res = array();
$res['success'] = "1";
echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

mysqli_close($con);
?>
