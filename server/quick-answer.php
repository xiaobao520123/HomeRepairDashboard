<?php
$con = mysqli_connect('localhost','xiaobao','xb12345678');
if (!$con)
{
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, "homerepair");
mysqli_set_charset($con,"utf8mb4");
$sql="SELECT * FROM quick_answer";

$result=mysqli_query($con, $sql);
$answer=array();
$count=0;
while($row = mysqli_fetch_array($result))
{
 $answer[$count]['id'] = $row['id'];
 $answer[$count]['text']= $row['text'];
 $answer[$count]['enabled']=$row['enabled']; 
 $answer[$count]['last_modify']=$row['last_modify'];
$count++;    
} 
echo json_encode($answer,JSON_UNESCAPED_UNICODE);
mysqli_close($con);
?>
