import React from "react";
import Server from "server/server.js"
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components

import styles from "assets/jss/material-dashboard-react/views/orderStyle.js";
const useStyles = makeStyles(styles);

class Order {
  constructor(oid, uid, ts_uid,time, type, address, state, progress, price, payment_state, detail, user_picture, ts_picture, remark) {
    this.oid = oid;
    this.uid = uid;
    this.ts_uid = ts_uid;
    this.time = time;
    this.type = type;
    this.address = address;
    this.state = state;
    this.progress = progress;
    this.price = price;
    this.payment_state = payment_state;
    this.detail = detail;
    this.user_picture = user_picture;
    this.ts_picture = ts_picture;
    this.remark = remark;
  }
};

export default function OrderPage(props) {
  const {oid} = props;

  class ThePage extends React.Component {
    constructor(props) {
      super(oid);
      this.state = {
        loadingState: 0,
        order: ''
      }
    }

    componentDidMount() {
      this.serverRequest = Server.getOrderInfoByOID(
        oid,
        function(XMLHttpRequest) {
          this.setState({loadingState: 0});
        }.bind(this),
        function(status) {
          var json = JSON.parse(status);
          if (json["success"] === "1") {
            const order = new Order(
              oid, 
              json['uid'],
              json['ts_uid'],
              json['time'],
              json['type'],
              json['address'],
              json['state'],
              json['progress'],
              json['price'],
              json['payment_state'],
              json['detail'],
              json['user_picture'],
              json['ts_picture'],
              json['remark'],);
            this.setState({order: order});
          }
        }.bind(this),
        function(status) {
          alert("连接服务器失败，请检查网络设置!");
        }, 
        function(XMLHttpRequest, status) {
          if(status === "timeout") {
            alert("连接超时!");
          }
        }
      );
     }

     componentWillUnmount() {
        this.serverRequest.abort();
     }

    render() {
      const order = this.state.order;
      return (
        <div>
          订单编号：{order.oid}<br />
          客户用户编号：{order.uid}<br />
          技术人员用户编号：{order.ts_uid}<br />
          创建时间：{order.time}<br />
          类型：{order.type}<br />
          地址：{order.address}<br />
          状态：{Server.orderState[order.state]}<br />
          维修进度：{Server.orderProgress[order.progress]}<br />
          价格：{order.price}<br />
          付款状态：{order.payment_state}<br />
          详细信息：{order.detail}<br />    
          用户上传的照片：{order.user_picture}<br />  
          技术人员上传的照片：{order.ts_picture}<br />  
          订单备注：{order.remark}<br />  
        </div>
      );
    }
  }

  return (
    <div>
      <ThePage />
    </div>
  )
}
