<?php
$res = array();

if ((!key_exists("uid", $post) || ($uid = $post["uid"]) === "") || 
    (!key_exists("type", $post) || ($type = $post['type']) != 0 && ($type = $post['type']) != 1) ||
    (!key_exists("nickname", $post) || ($nickname = $post["nickname"]) === "")) 
{
    $res['success'] = "0";
    $res['error_msg'] = "参数错误";
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}

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

if ($type == 0) {
    $sql = "";

    $sql = "SELECT COUNT(*) AS c from `customer_service` where uid='" . $uid . "';";
    $result=mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result);
    if ($row['c'] >= 1) {
        $res['success'] = "0";
        $res['error_msg'] = "该客服人员（UID：" . $uid . "）已经存在";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }

    $sql = "INSERT INTO `customer_service` (uid, nickname, employ_date) VALUES " .
            "('" . $uid . 
            "', '" . $nickname . 
            "', NOW()" .
            ");";
    $result=mysqli_query($con, $sql);
    if (!$result) {
        $res['success'] = "0";
        $res['error_msg'] = "添加失败";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }
    
    $res = array();
    $res['success'] = "1";
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();

} else if ($type == 1) {

    $sql = "SELECT COUNT(*) AS c from `technique_support` where uid='" . $uid . "';";
    $result=mysqli_query($con, $sql);
    $row = mysqli_fetch_array($result);
    if ($row['c'] >= 1) {
        $res['success'] = "0";
        $res['error_msg'] = "该技术人员（UID：" . $uid . "）已经存在";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }

    $sql = "INSERT INTO `technique_support` (uid, nickname, state, employ_date) VALUES " .
            "('" . $uid . 
            "', '" . $nickname . 
            "', 0, NOW()" .
            ");";
    $result=mysqli_query($con, $sql);
    if (!$result) {
        $res['success'] = "0";
        $res['error_msg'] = "添加失败";
        mysqli_close($con);
        echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        die();
    }
    
    $res = array();
    $res['success'] = "1";
    echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    die();
}

$res = array();
$res['success'] = "0";
$res['error_msg'] = "参数有误";
echo json_encode($res,JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

mysqli_close($con);
?>
