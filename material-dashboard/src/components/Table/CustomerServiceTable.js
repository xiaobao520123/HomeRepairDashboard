import React from "react";
import PropTypes from "prop-types";
import jQuery from "jquery";
import Server from "server/server";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Exit from "@material-ui/icons/ExitToApp";
// core components
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from "assets/jss/material-dashboard-react/components/customerServiceStyle.js";

const useStyles = makeStyles(styles);

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

class CustomerService {
    constructor(uid, name, nickname, employ_date, avatar) {
      this.uid = uid;
      this.name = name;
      this.nickname = nickname;
      this.employ_date = employ_date;
      this.avatar = avatar;
    }
};

export default function CustomTable(props) {
  const classes = useStyles();

  class TheTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          list : [],
          loadingState: 0,
          openEditDialog: false,
          openDeleteDialog: false,
          openAddDialog: false,
          userEditing: null,
        }
    }

    handleClickAdd() {
      this.setState({openAddDialog: true });
    }

    handleDelete(index) {
      this.setState({openDeleteDialog: true, userEditing: index});
    }

    handleEdit(index) {
      this.setState({openEditDialog: true, userEditing: index});
    }

    handleApplyEditDialog() {
      const userEditing = this.state.userEditing;
      if (userEditing === null)
        return;
      const user = this.state.list[userEditing];
      this.setState({openEditDialog: false, userEditing: null});
    }

    handleCloseEditDialog() {
      this.setState({openEditDialog: false, userEditing: null});
    }

    handleCloseDeleteDialog(willDelete) {
      if (willDelete){
        // 删除用户

      }
      this.setState({openDeleteDialog: false, userEditing: null});
    }

    handleCloseAddDialog(willAdd) {
      if (willAdd) {

      }
      this.setState({openAddDialog: false});
    }

    componentDidMount() {
      this.setState({loadingState: 0});
        this.serverRequest = jQuery.ajax({
          type: "GET",
          url: "http://47.112.177.70/?need=employee-info&type=1&uid=all",
          timeout: 5000,
          success: function(status) {
            var json = JSON.parse(status);
            const newList = this.state.list;
            json.forEach(element => {
              const cs = new CustomerService(
                element["uid"], 
                null, 
                element["nickname"],
                element["employ_date"],
                null);
              const index = newList.push(cs) - 1;

              this.setState({loadingState: 0});
              Server.getUserInfoByUID(element["uid"], 
                function(status) {
                  var json = JSON.parse(status);
                  if (json["success"] === "1") {
                    newList[index].name = json["name"];
                    newList[index].avatar = json["avatar"];
                  }
                },
                function(status) {
                  alert("连接服务器失败，请检查网络设置!");
                },
                function(XMLHttpRequest, status) {
                  if(status === "timeout") {
                    alert("连接超时!");
                  }
                  this.setState({loadingState: 1});
                }.bind(this));
            });
            this.setState({
              list : newList
            });
          }.bind(this),
          error: function(status) {
            alert("连接服务器失败，请检查网络设置");
          },
          complete : function(XMLHttpRequest, status) {
            if(status === 'timeout') {
              alert("操作失败，连接超时");
            }
            this.setState({loadingState: 1});
          }.bind(this)
        });
    }

    componentWillUnmount() {
      this.serverRequest.abort();
    }

    render() {
      return (
           <div className={classes.tableResponsive}>
            <Button type="button" color="success" onClick={() => this.handleClickAdd()}>添加</Button>
          {this.state.loadingState === 0 ? <CircularProgress / > : null}
          <Table className={classes.table}>
              <TableHead className={classes.successTableHeader}>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      头像
                  </TableCell>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      UID
                  </TableCell>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      姓名
                  </TableCell>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      昵称
                  </TableCell>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      应聘日期
                  </TableCell>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      操作
                  </TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {
                this.state.list.map((cs, index) => {
                  return (
                    <TableRow key={index} className={classes.tableBodyRow}>
                      <TableCell className={classes.tableCellAvatar}>
                        <Avatar alt={"avatar_uid_" + cs.uid} src={
                          cs.avatar === null ? Server.defaultAvatar : cs.avatar
                        }>
                        </Avatar>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {cs.uid}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {cs.name}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {cs.nickname}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {cs.employ_date}
                      </TableCell>
                      <TableCell className={classes.tableCellControl}>
                        <Tooltip
                          id="tooltip-top"
                          title="编辑"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            aria-label="Edit"
                            onClick={() => this.handleEdit(index)}
                            className={classes.tableActionButton}
                          >
                          <Edit
                            className={
                              classes.tableActionButtonIcon + " " + classes.edit
                            }
                          />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top"
                          title="删除"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <IconButton
                            aria-label="Delete"
                            className={classes.tableActionButton}
                            onClick={() => this.handleDelete(index)}
                          >
                          <Delete
                            className={
                              classes.tableActionButtonIcon + " " + classes.delete
                            }
                          />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
          {
            this.state.openEditDialog ? (
              <Dialog
              open={this.state.openEditDialog}
              fullWidth={true}
              maxWidth={"md"}
              onClose={e => this.handleCloseEditDialog()}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
              >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                编辑客服人员（UID：{this.state.list[this.state.userEditing].uid})
              </DialogTitle>
              <DialogContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        用户信息
                      </TableCell>
                      <TableCell>
                        <a href="user">
                          <Button type="button" color="success">
                          <Exit />
                          点击转到用户管理界面设置
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        昵称
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_nickname"
                          inputProps={{
                            placeholder: "昵称",
                            defaultValue: this.state.list[this.state.userEditing].nickname
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={e => this.handleApplyEditDialog()} color="info">
                  应用
                </Button>
                <Button onClick={e => this.handleCloseEditDialog()} color="danger">
                  取消
                </Button>
              </DialogActions>
              </Dialog>
            ): ""
          }
          {
            this.state.openDeleteDialog ? (
              <Dialog
                open={this.state.openDeleteDialog}
                onClose={e => this.handleCloseDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"确认删除客服人员：" + this.state.list[this.state.userEditing].uid + "？"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      你确定要删除这个客服人员吗？该操作只会撤销用户的客服人员身份。
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={e => this.handleCloseDeleteDialog(false)} color="info">
                      取消
                    </Button>
                    <Button onClick={e => this.handleCloseDeleteDialog(true)} color="danger" autoFocus>
                      确认删除
                    </Button>
                  </DialogActions>
                </Dialog>
            ): ""
          }
          {
            this.state.openAddDialog ? (
              <Dialog
              open={this.state.openAddDialog}
              fullWidth={true}
              maxWidth={"md"}
              onClose={e => this.handleCloseAddDialog(false)}
              PaperComponent={PaperComponent}
              aria-labelledby="draggable-dialog-title"
              >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                新增客服人员
              </DialogTitle>
              <DialogContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        用户编号（UID）
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_uid"
                          inputProps={{
                            placeholder: "如果客服人员还没有注册，先到用户管理页面添加用户",
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        昵称
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_name"
                          inputProps={{
                            placeholder: "昵称",
                            defaultValue: "新客服人员"
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={e => this.handleCloseAddDialog(true)} color="success">
                  添加
                </Button>
                <Button onClick={e => this.handleCloseAddDialog(false)} color="danger">
                  取消
                </Button>
              </DialogActions>
              </Dialog>
            ): ""
          }  
        </div>
      );
    }
  }
  return (
    <TheTable />
  );
}  

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};
