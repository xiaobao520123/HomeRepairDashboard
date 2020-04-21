import jQuery from "jquery";
import Avatar_NULL from "assets/img/avatar_null.jpg";
var Server = {
    defaultAvatar : Avatar_NULL,

    getUserInfoByUID : function (uid, success, error, complete) {
        return jQuery.ajax({
            type: "GET",
            url: "http://47.112.177.70/?need=user-info&uid=" + uid,
            timeout: 5000,
            success: success,
            error: error,
            complete : complete
            });
    }
}

export default Server;