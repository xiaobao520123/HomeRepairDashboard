import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";
import LoginView from "login.js";
import Server from "server/server";

const hist = createBrowserHistory();

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
       }
       if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
       }
   }
  return "";
} 

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var token = getCookie("token");
if (token == "") {
  ReactDOM.render(
    <LoginView />,
    document.getElementById("root")
  );
} else {
  Server.verify(
    token,
    null,
    function(status) {
      if (status.length === 0) 
        return;
      var json = JSON.parse(status);
      if (json["success"] === "1") {
        ReactDOM.render(
          <Router history={hist}>
          <Switch>
            <Route path="/admin" component={Admin} />
            <Route path="/rtl" component={RTL} />
            <Redirect from="/" to="/admin/order" />
          </Switch>
          </Router>,
          document.getElementById("root")
        );
      } else {
        alert("验证失败，请尝试重新登录！\n错误信息：" + json["error_msg"]);
        setCookie("token", "", 0);
        document.location.reload();
      }
    }
  );
}



