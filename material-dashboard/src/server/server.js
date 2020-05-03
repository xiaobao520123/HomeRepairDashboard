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
    }
}

export default Server;