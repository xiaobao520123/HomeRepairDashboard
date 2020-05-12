// architecture
import React from "react";
import Server from "server/server.js";
import { makeStyles } from "@material-ui/core/styles";
// material-ui-core
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';
// component
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from "assets/jss/material-dashboard-react/views/loginStyle.js";

const useStyles = makeStyles(styles);

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom in={true} ref={ref} {...props} />;
});


export default function LoginView() {
  const classes = useStyles();

  const handleCloseLoginDialog = (willLogin) => {
    if (willLogin) {
      const username = document.getElementById("input_username").value;
      const password = document.getElementById("input_password").value;

      if (username.length === 0) {
        alert("请输入用户名");
        return;
      }
      if (password.length === 0) {
        alert("请输入密码");
        return;
      }

      Server.loginToServer(
        username,
        password,
        null,
        function(status) {
          if (status === "") 
            return;
          var json = JSON.parse(status);
          if (json["success"] === "1" && json["token"].length > 0) {
            setCookie("token", json["token"], 1);
            alert("登录成功！");
            document.location.reload();
          } else {
            alert("登录失败！错误信息：" + json["error_msg"]);
          }
        },
        null,
        function(status) {
          if (status === "timeout") {
            alert("登录失败！错误信息：连接超时");
          }
        }
      );
      
    } else {
      window.location.reload();
    }
  };

  return(
    <Dialog
    open={true}
    TransitionComponent={Transition}
    keepMounted
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"需要登录"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          你需要登录才能访问系统
        </DialogContentText>
        <div className={classes.item}>
          <span>
            用户名：
          </span>
          <CustomInput id="input_username"
                            inputProps={{
                              placeholder: "",
                              type: "text"
                            }}
                            formControlProps={{
                              fullWidth: true
                            }} 
          />
        </div>
        <br /> 
        <div className={classes.item}>
          <span>
            密码：
          </span>
          <CustomInput id="input_password"
                            inputProps={{
                              placeholder: "",
                              type: "password"
                            }}
                            formControlProps={{
                              fullWidth: true
                            }} 
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={e => handleCloseLoginDialog(true)} color="info" autoFocus>
          登录
        </Button>
        <Button onClick={e => handleCloseLoginDialog(false)} color="danger">
          退出
        </Button>
      </DialogActions>
    </Dialog>
  );
}
