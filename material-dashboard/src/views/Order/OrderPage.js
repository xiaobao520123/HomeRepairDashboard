import React from "react";
import Server from "server/server.js"
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// @material-ui/icons
import ArrowBack from "@material-ui/icons/ArrowBack";
import Notification from "@material-ui/icons/Notifications";
import Save from "@material-ui/icons/Save";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Check from "@material-ui/icons/Check";
// core components
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-dashboard-react/views/orderPageStyle.js";

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

class User {
  constructor(uid, name, avatar) {
    this.uid = uid;
    this.name = name;
    this.avatar = avatar;
  }
}

export default function OrderPage(props) {
  const {oid} = props;
  const classes = useStyles(styles);

  class ThePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loadingState: 0,
        loadingState_User: 0,
        loadingState_TS: 0,
        order: '',
        user: '',
        ts: '',
        editing: false,
        openDeleteDialog: false,
      }
    }

    handleResponse() {
      this.serverRequest = Server.responseOrder(this.state.order, null, 
        function(status) {
          if (status === "")
            return;
        },
        null,
        function(XMLHttpRequest, status) {
          if(status === 'timeout') {
            alert("操作失败，连接超时");
          } else document.location.reload();
        });
    }

    handleEdit() {
      if (this.state.editing) {
        const address = document.getElementById("input_address").value;
        if (address === "") {
          alert("维修地址不合法");
          return;
        }
        const price = parseFloat(document.getElementById("input_price").value);
        if (price < 0) {
          alert("维修价格不合法");
          return;
        }
        const detail = document.getElementById("input_detail").value;
        const remark = document.getElementById("input_remark").value;
        const newOrder = this.state.order;
        newOrder.address = address;
        newOrder.price = price;
        newOrder.detail = detail;
        newOrder.remark = remark;
        this.setState({order: newOrder});
      }
      const newEditng = !this.state.editing;
      this.setState({editing: newEditng});
    }

    handleSave() {
      this.serverRequest = Server.updateOrder(this.state.order, null, 
        function(status) {
          if (status === "")
            return;
        },
        null,
        function(XMLHttpRequest, status) {
          if(status === 'timeout') {
            alert("操作失败，连接超时");
          }
          else document.location.reload();
        });
    }

    handleDelete() {
      this.setState({openDeleteDialog: true});
    }

    handleCloseDeleteDialog(e, willDelete) {
      if (!willDelete) {

      } else {
        // 提交删除
        this.serverRequest = Server.deleteOrder(this.state.order, null, 
          function(status) {
            if (status === "")
              return;
            document.location = "order";
          },
          null,
          function(XMLHttpRequest, status) {
            if(status === 'timeout') {
              alert("操作失败，连接超时");
            }
          });

      }
      this.setState({openDeleteDialog: false});
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
              json['remark']);
            this.setState({order: order});
            this.setState({loadingState: 1});
            Server.getUserInfoByUID(
              order.uid,
              function (status) {
                var json = JSON.parse(status);
                if (json["success"] === "1") {
                  const user = new User(order.uid, json['name'], json['avatar'])
                  this.setState({user: user, loadingState_User : 1});
                }
              }.bind(this),
              null,
              null,
            );
            if (order.ts_uid !== "no_ts") {
              Server.getUserInfoByUID(
                order.ts_uid,
                function (status) {
                  var json = JSON.parse(status);
                  if (json["success"] === "1") {
                    const user = new User(order.ts_uid, json['name'], json['avatar'])
                    this.setState({ts: user, loadingState_TS : 1});
                  }
                }.bind(this),
                null,
                null,
              );
            }
          }
        }.bind(this),
        null, 
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
      if (this.state.loadingState === 0) {
        return (
          <CircularProgress />
        );
      }

      const order = this.state.order;
      const tipColor = {
        "danger": classes.tableCellColorDanger,
        "warning": classes.tableCellColorWarning,
        "success": classes.tableCellColorSuccess,
        "info": classes.tableCellColorInfo
      }
      return (
        <div>
          <a href="order">
            <Button type="button" color="success">
              <ArrowBack></ArrowBack>
              返回
            </Button>
          </a>
          <GridContainer>
            {
              this.state.order.state === "0" ? (
              <GridItem xs={12} sm={12} md={4}>
                <Card>
                  <CardBody>
                    <Table>
                      <TableBody>
                        <TableRow key={"TypicalControl"}>
                          <TableCell>
                            <div align="center">
                              可能需要的操作：
                              <Button type="button" color="primary" onClick={e => this.handleResponse(e)}>
                                <Notification />
                                响应
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                  </CardBody>
                </Card>
              </GridItem>
              ) : (<div></div>)
            }
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleNormal}>订单信息</h4>
                  查看订单的基本信息
                </CardHeader>
                <CardBody>
                  <div className={classes.tableResponsive}>
                    <div className={classes.panelbody}>
                    <Table className={classes.table}>
                    <TableBody>
                      <TableRow key={"OrderNum"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType + " " + classes.tableCellColorInfo} color="info">
                          订单编号
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                          {order.oid}
                        </TableCell>
                      </TableRow>
                      <TableRow key={"UserInfo"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType}>
                          用户
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                        {
                          (this.state.loadingState_User === 0 ? <CircularProgress /> : 
                            (
                              <div align="left">
                              <a href={"user#" + this.state.user.uid} className={classes.block}>
                                <span>
                                  {this.state.user.name}
                                </span>
                              </a>
                              </div>
                            ) 
                          )
                        }
                        </TableCell>
                      </TableRow>
                      <TableRow key={"TSInfo"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType + " " + classes.tableCellColorInfo}>
                          维修人员
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                        {
                          (this.state.order.ts_uid === "no_ts" ? "无" :
                          (this.state.loadingState_TS === 0 ? <CircularProgress /> : (
                            <div align="left">
                            <a href={"user#" + this.state.ts.uid} className={classes.block}>
                              <span>
                                {this.state.ts.name}
                              </span>
                            </a>
                            </div>
                          )))
                        }
                        </TableCell>
                      </TableRow>
                      <TableRow key={"OrderTime"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType}>
                          创建时间
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                          {order.time}
                        </TableCell>
                      </TableRow>
                      <TableRow key={"OrderType"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType + " " + classes.tableCellColorInfo}>
                          订单类型
                        </TableCell>
                        <TableCell className={classes.TableCellContent + (order.type === "1" ? " " + classes.tableCellColorDanger : "")}>
                          {Server.orderType[order.type]}
                        </TableCell>
                      </TableRow>
                      <TableRow key={"OrderAddress"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType}>
                          维修地址
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                        {
                          (this.state.editing ? (
                            <CustomInput id="input_address"
                            inputProps={{
                              placeholder: "维修地址",
                              defaultValue: order.address
                            }}
                            formControlProps={{
                              fullWidth: true
                            }} />
                          ) : (
                            order.address
                          ))
                        }
                        </TableCell>

                      </TableRow>
                      <TableRow key={"OrderState"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType + " " + classes.tableCellColorInfo}>
                          订单当前状态
                        </TableCell>
                        <TableCell className={classes.TableCellContent + " " + tipColor[Server.orderStateColor[order.state]]}>
                          {Server.orderState[order.state]}
                        </TableCell>
                      </TableRow>
                      <TableRow key={"OrderProgress"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType}>
                          维修进度
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                          {Server.orderProgress[order.progress]}
                        </TableCell>
                      </TableRow>
                      <TableRow key={"OrderPrice"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType + " " + classes.tableCellColorInfo}>
                          维修价格
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                        {
                          (this.state.editing ? (
                            <CustomInput id="input_price"
                            inputProps={{
                              placeholder: "维修价格",
                              defaultValue: order.price
                            }}
                            formControlProps={{
                              fullWidth: true
                            }} />
                          ) : (
                            "¥" + order.price
                          ))
                        }
                        </TableCell>
                      </TableRow>
                      <TableRow key={"OrderPaid"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType}>
                          用户是否已付款
                        </TableCell>
                        <TableCell className={classes.TableCellContent + " " + (order.payment_state === "0" ? classes.tableCellColorWarning : classes.tableCellColorSuccess)}>
                          {order.payment_state === "0" ? "未付款" : "已付款"}
                        </TableCell>
                      </TableRow>
                      <TableRow key={"OrderDetail"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType + " " + classes.tableCellColorInfo}>
                          详细信息
                        </TableCell>
                        {
                          this.state.editing ? (
                            <TableCell className={classes.TableCellContent}>
                              <CustomInput id="input_detail"
                              inputProps={{
                                placeholder: "订单的详细信息",
                                defaultValue: order.detail,
                                multiline: true
                              }}
                              formControlProps={{
                                fullWidth: true
                              }} />
                            </TableCell>
                          ) : (
                            <TableCell className={classes.TableCellContent} dangerouslySetInnerHTML={{ __html: Server.tranformTextToHTML(order.detail)}}>

                            </TableCell>
                          )
                        }
                      </TableRow>        
                      <TableRow key={"OrderUserPicture"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType}>
                          用户上传的照片
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>
                          
                        </TableCell>
                      </TableRow>   
                      <TableRow key={"OrderTSPricture"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType + " " + classes.tableCellColorInfo}>
                          维修人员上传的照片
                        </TableCell>
                        <TableCell className={classes.TableCellContent}>

                        </TableCell>
                      </TableRow>  
                      <TableRow key={"OrderRemark"} className={classes.TableRow}>
                        <TableCell className={classes.TableCellType}>
                          订单备注
                        </TableCell>
                        {
                          this.state.editing ? (
                            <TableCell className={classes.TableCellContent}>
                              <CustomInput id="input_remark"
                              inputProps={{
                                placeholder: "订单备注",
                                defaultValue: order.remark,
                                multiline: true
                              }}
                              formControlProps={{
                                fullWidth: true
                              }} />
                            </TableCell>
                          ) : (
                            <TableCell className={classes.TableCellContent} dangerouslySetInnerHTML={{ __html: Server.tranformTextToHTML(order.remark)}}>

                            </TableCell>
                          )
                        }
                      </TableRow>        
                    </TableBody>
                  </Table>
                    </div>
                  
                  </div>
                  
                  <br />
                  <div align="right">
                    {this.state.editing === false ?  (
                      <Button type="button" color="info" onClick={e => this.handleEdit(e)}>
                      <Edit />
                      编辑
                      </Button>
                    ) : (
                      <Button type="button" color="warning" onClick={e => this.handleEdit(e)}>
                      <Check />
                      确认编辑
                      </Button>
                    )}

                    <Button type="button" color="success" onClick={e => this.handleSave(e)}>
                      <Save />
                      应用
                    </Button>
                    <Button type="button" color="danger" onClick={e => this.handleDelete(e)}>
                      <Delete />
                      删除订单
                    </Button>
                  </div>      
                </CardBody>
              </Card>
            </GridItem>
         </GridContainer>
         <Dialog
          open={this.state.openDeleteDialog}
          onClose={e => this.handleCloseDeleteDialog(e,false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"确认删除订单：" + order.oid + "？"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                删除这个订单可能造成任何不可挽回的数据丢失后果。
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={e => this.handleCloseDeleteDialog(e, false)} color="info">
                取消
              </Button>
              <Button onClick={e => this.handleCloseDeleteDialog(e, true)} color="danger" autoFocus>
                确认删除
              </Button>
            </DialogActions>
          </Dialog>
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
