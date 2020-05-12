import jQuery from "jquery";
import Avatar_NULL from "assets/img/avatar_null.jpg";

var Server = {
    defaultAvatar : Avatar_NULL,

    orderStateColor: [
        "danger",
        "danger",
        "success",
        "success",
        "warning",
        "warning",
        "success",
        ""
    ],

    orderType: [
        "普通订单",
        "紧急订单"
    ],

    orderState: [
        "等待响应",
        "等待派遣维修人员",
        "等待维修",
        "维修中",
        "等待付款",
        "等待评价",
        "订单完成",
    ],

    orderProgress: [
        "等待派遣维修人员",
        "维修中",
        "维修受阻",
        "维修完毕",
    ],

    loginToServer : function (username, password, beforeSend, success, error, complete) {
      const json = {
        "cmd" : "login",
        "username": username,
        "password": password
      };
      return jQuery.ajax({
          type: "post",
          url: "http://47.112.177.70/",
          data: JSON.stringify(json),
          timeout: 5000,
          beforeSend: beforeSend,
          success: success,
          error: error,
          complete : complete
        });
    },

    verify : function (token, beforeSend, success, error, complete) {
      const json = {
        "cmd" : "verify",
        "token": token
      };
      return jQuery.ajax({
          type: "post",
          url: "http://47.112.177.70/",
          data: JSON.stringify(json),
          timeout: 5000,
          beforeSend: beforeSend,
          success: success,
          error: error,
          complete : complete
        });
    },

    getUserInfoByUID : function (uid, success, error, complete) {
        return jQuery.ajax({
            type: "GET",
            url: "http://47.112.177.70/?need=user-info&uid=" + uid,
            timeout: 5000,
            success: success,
            error: error,
            complete : complete
            });
    },

    getOrderList : function(beforeSend, success, error, complete) {
        return jQuery.ajax({
            type: "GET",
            url: "http://47.112.177.70/?need=order-info&oid=all",
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
            });       
    },

    getOrderInfoByOID : function(oid,beforeSend, success, error, complete) {
        return jQuery.ajax({
            type: "GET",
            url: "http://47.112.177.70/?need=order-info&oid=" + oid,
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
            });
    },

    tranformTextToHTML : function(text) {
        if (text == null)
            return null;
        text = text.replace(/\r\n/g,"<br />")
        text = text.replace(/\n/g,"<br />");
        return text;
    },

    responseOrder : function(order, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "reponse-order",
            "oid": order.oid
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    updateOrder : function(order, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "update-order",
            "order": order
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    deleteOrder : function(order, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "delete-order",
            "oid": order.oid
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    addUser : function(newUserInfo, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "new-user",
            "uid": newUserInfo.uid,
            "login_id": newUserInfo.login_id,
            "name": newUserInfo.name,
            "password": newUserInfo.password,
            "phone": newUserInfo.phone,
            "avatar": newUserInfo.avatar
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    updateUserInfo : function(uid, newUserInfo, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "update-user-info",
            "uid": uid,
            "newUID": newUserInfo.uid,
            "newName": newUserInfo.name,
            "newLoginID": newUserInfo.login_id,
            "newPhone": newUserInfo.phone,
            "newAvatar": newUserInfo.avatar
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    deleteUser : function(uid, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "delete-user",
            "uid": uid,
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    addEmployee : function(newEmployeeInfo, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "new-employee",
            "uid": newEmployeeInfo.uid,
            "type": newEmployeeInfo.type,
            "nickname": newEmployeeInfo.nickname
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    updateEmployeeInfo : function(uid, newEmployeeInfo, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "update-employee",
            "uid": uid,
            "type": newEmployeeInfo.type,
            "newNickname": newEmployeeInfo.nickname,
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },

    deleteEmployee : function(uid, type, beforeSend, success, error, complete) {
        const json = {
            "cmd" : "delete-employee",
            "uid": uid,
            "type": type
          };
        return jQuery.ajax({
            type: "post",
            url: "http://47.112.177.70/",
            data: JSON.stringify(json),
            timeout: 5000,
            beforeSend: beforeSend,
            success: success,
            error: error,
            complete : complete
          });
    },
}

export default Server;