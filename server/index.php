<?php
    header('Content-Type: text/html;charset=utf-8');
    header('Access-Control-Allow-Origin:*'); // *代表允许任何网址请求
    header('Access-Control-Allow-Methods:POST,GET'); // 允许请求的类型
    header('Access-Control-Allow-Credentials: true'); // 设置是否允许发送 cookies
    header('Access-Control-Allow-Headers: Content-Type,Content-Length,Accept-Encoding,X-Requested-with, Origin'); // 设置允许自定义请求头的字段

$need = $_GET["need"];

if ($need == "quick-answer") {
  require_once("quick-answer.php");
  die();
} else if ($need == "user-info") {
  require_once("query-user.php");
  die();
} else if ($need == "employee-info") {
  require_once("query-employee.php");
  die();
}
$content = file_get_contents("php://input");
$post = (array)json_decode($content);
if ($post['cmd'] == "modify-answer") {
  require_once("modify-answer.php");
} else if($post['cmd'] == "delete-answer") {
  require_once("delete-answer.php");
} else if($post['cmd'] == "new-answer") {
  require_once("new-answer.php");
}
?>
