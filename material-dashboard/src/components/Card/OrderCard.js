import React from "react";
import Server from "server/server.js"
// nodejs library that concatenates classes
import Avatar from "@material-ui/core/Avatar";
import Warning from "@material-ui/icons/Warning";
import Check from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress"
// nodejs library to set properties for components

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
// @material-ui/icons

// core components
import Danger from "components/Typography/Danger.js";
import Success from "components/Typography/Success.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-react/components/orderCardStyle.js";


const useStyles = makeStyles(styles);

class User {
  constructor(uid, name, avatar) {
    this.uid = uid;
    this.name = name;
    this.avatar = avatar;    
  }
}

class Order {
  constructor(oid, uid, ts_uid, state) {
    this.oid = oid;
    this.uid = uid;
    this.ts_uid = ts_uid;
    this.state = state;
  }
};

const colors = [
  "warning",
  "success",
  "danger",
  "info"
];

function OrderCardFooter(props) {
  const classes = useStyles();
  const {state} = props;

  var content = "";
  switch(parseInt(state)) {
    case 0:{
      content = (
        <div className={classes.stats}>
          <Danger>
            <Warning />
          </Danger>
            需要响应 
        </div>
      );
      break;
    }
    case 1:{
      content = (
        <div className={classes.stats}>
          <Danger>
            <Warning />
          </Danger>
            需要派遣
        </div>
      );
      break;
    }
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:{
      content = (
        <div className={classes.stats}>
          <Success>
            <Check />
          </Success>
            订单正常
        </div>
      );
      break;
    }  
    default:
      break;
  }

  return (
    <CardFooter stats>
      {content}
    </CardFooter>
  );
}

export default function OrderCard(props) {
  const classes = useStyles();
  const { oid,color} = props;

  class TheCard extends React.Component {
     constructor(props) {
       super(props);
       this.state = {
         loadingState: 0,
         success: 0,
         order : '',
         user : ''
       }
     }

     handleEnter() {

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
              json['state'],);
              
            this.setState({success: 1, order: order});
            this.serverRequest = Server.getUserInfoByUID(
              order.uid,
              function(status) {
                var json = JSON.parse(status);
                const user = new User(order.uid, json["name"], json["avatar"]);
                this.setState({user: user});
              }.bind(this),
              function(status) {
                
              },
              function(complete) {
                this.setState({loadingState: 1});
              }.bind(this));
          }
        }.bind(this),
        function(status) {

        }, 
        function(XMLHttpRequest, status) {

        }
      );
     }

     componentWillUnmount() {
        this.serverRequest.abort();
     }

     render() {
       if (this.state.loadingState === 0) {
        return (<div><CircularProgress /></div>);
       }

      const order = this.state.order;
      const user = this.state.user;
      const tipColor = {
        "danger": classes.cardTitleDanger,
        "warning": classes.cardTitleWarning,
        "success": classes.cardTitleSuccess,
        "info": classes.cardTitleInfo,
        "" : classes.cardTitle
      }
       return (
        <CardActionArea>
         <a href={"?oid=" + oid} >
            <Card>
              <CardHeader stats icon >
                <CardIcon color={colors[color]}>
                <Avatar alt={"avatar_uid_" + user.uid} src={user.avatar === null ? Server.defaultAvatar : user.avatar} />
                </CardIcon>
                <p className={classes.cardCategory}>{user.name}</p>
                  <h4 className={tipColor[Server.orderStateColor[order.state]]} >
                    {Server.orderState[order.state]}
                  </h4>
              </CardHeader>
              <OrderCardFooter state={order.state}/>
            </Card>
         </a>
         </CardActionArea>
       );
     }
  }
  return (
    <div >
      <TheCard />
    </div>
  );
}
