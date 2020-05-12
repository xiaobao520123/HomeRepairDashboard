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
import Upload from "@material-ui/icons/CloudUpload";
// core components
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from "assets/jss/material-dashboard-react/components/userAccountStyle.js";


const useStyles = makeStyles(styles);

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

class UserAccount {
    constructor(uid, name, login_id, phone, avatar) {
      this.uid = uid;
      this.name = name;
      this.login_id = login_id;
      this.phone = phone;
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
      const inputAvatar = Server.defaultAvatar;
      this.setState({openAddDialog: true ,inputAvatar: inputAvatar});
    }

    handleDelete(index) {
        this.setState({openDeleteDialog: true, userEditing: index});
    }

    handleEdit(index) {
      const inputAvatar = this.state.list[index].avatar === null ? Server.defaultAvatar : this.state.list[index].avatar;
      this.setState({openEditDialog: true, userEditing: index,inputAvatar: inputAvatar});
    }

    handleApplyEditDialog() {
      const userEditing = this.state.userEditing;
      if (userEditing === null)
        return;
      const user = this.state.list[userEditing];
      const newUserInfo = {
        "uid" : document.getElementById("input_uid").value,
        "name": document.getElementById("input_name").value,
        "login_id": document.getElementById("input_loginid").value,
        "phone" : document.getElementById("input_phone").value,
        "avatar": this.state.inputAvatar === Server.defaultAvatar ? 
                  null : this.state.inputAvatar
      }
      if (newUserInfo.uid === "" || newUserInfo.uid.length > 10) {
        alert("无效的UID");
        return;
      } else if (newUserInfo.name === "") {
        alert("请输入姓名/昵称");
        return;
      } else if (newUserInfo.login_id === "") {
        alert("请输入登录账户");
        return;
      }

      if (newUserInfo.uid === user.uid) {
        newUserInfo.uid = undefined;
      } 

      if (newUserInfo.name === user.name) {
        newUserInfo.name = undefined;
      } 

      if (newUserInfo.login_id === user.login_id) {
        newUserInfo.login_id = undefined;
      } 

      if (newUserInfo.avatar === user.avatar) {
        newUserInfo.avatar = undefined;
      } 

      if (newUserInfo.phone === user.phone) {
        newUserInfo.phone = undefined;
      } 

      this.serverRequest = Server.updateUserInfo(
        user.uid, 
        newUserInfo,
        null,
        function(status) {
          if (status === "")
            return;
          var json = JSON.parse(status);
          if (json['success'] === "1") {
            alert("应用成功");
            this.setState({openEditDialog: false, userEditing: null, inputAvatar: null});
            document.location.reload();
          } else {
            alert("应用失败，错误信息：" + json['error_msg']);
          }
          
        }.bind(this),
        null,
        function(status) {
          if (status === "timeout") {
            alert("连接超时");
          }
        });
    }

    handleCloseEditDialog() {
      this.setState({openEditDialog: false, userEditing: null, inputAvatar: null});
    }

    handleCloseDeleteDialog(e, willDelete) {
      if (willDelete){
        // 删除用户
        const userEditing = this.state.userEditing;
        if (userEditing === null)
          return;
        const user = this.state.list[userEditing];
  
        this.serverRequest = Server.deleteUser(
          user.uid, 
          null,
          function(status) {
            if (status === "")
              return;
            var json = JSON.parse(status);
            if (json['success'] === "1") {
              const list = this.state.list;
              list.splice(userEditing, 1);
              this.setState({list: list, openDeleteDialog: false, userEditing: null});
            } else {
              alert("删除失败，错误信息：" + json['error_msg']);
            }
            
          }.bind(this),
          null,
          function(status) {
            if (status === "timeout") {
              alert("连接超时");
            }
          });
      } else this.setState({openDeleteDialog: false, userEditing: null});
    }

    handleCloseAddDialog(willAdd) {
      if (willAdd) {
        const newUserInfo = {
          "uid" : document.getElementById("input_uid").value,
          "name": document.getElementById("input_name").value,
          "login_id": document.getElementById("input_loginid").value,
          "password": document.getElementById("input_password").value,
          "phone": document.getElementById("input_phone").value,
          "avatar": this.state.inputAvatar === Server.defaultAvatar ? 
                    null : this.state.inputAvatar
        }
        if (newUserInfo.uid === "" || newUserInfo.uid.length > 10) {
          alert("无效的UID");
          return;
        } else if (newUserInfo.name === "") {
          alert("请输入姓名/昵称");
          return;
        } else if (newUserInfo.login_id === "") {
          alert("请输入登录账户");
          return;
        }

        this.serverRequest = Server.addUser(
          newUserInfo,
          null,
          function(status) {
            if (status === "")
              return;
            var json = JSON.parse(status);
            if (json['success'] === "1") {
              const list = this.state.list;
              const user = new UserAccount(
                newUserInfo.uid, 
                newUserInfo.name, 
                newUserInfo.login_id, 
                newUserInfo.phone,
                newUserInfo.avatar);
              list.push(user);
              this.setState({openAddDialog: false, list: list, inputAvatar: null});
            } else {
              alert("添加失败，错误信息：" + json['error_msg']);
            }
            
          }.bind(this),
          null,
          function(status) {
            if (status === "timeout") {
              alert("连接超时");
            }
          });

      } else this.setState({openAddDialog: false ,inputAvatar: null});
    }

    handleUploadAvatar() {
      const input_file = document.getElementById("input_file");
      input_file.onchange = function () {
        if (input_file.files.length !== 0) {
          const file = input_file.files[0];
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(e) {
            this.setState({inputAvatar: e.target.result});
          }.bind(this)
        }
      }.bind(this)
      input_file.click();
    }

    componentDidMount() {
      this.setState({loadingState: 0});
        this.serverRequest = jQuery.ajax({
          type: "GET",
          url: Server.defaultServerDomain + "/?need=user-info&uid=all",
          timeout: 15000,
          success: function(status) {
            var json = JSON.parse(status);
            const newList = this.state.list;
            json.forEach(element => {
              const user = new UserAccount(
                element["uid"], 
                element["name"], 
                element["login_id"],
                element["phone"],
                element["avatar"] === "" ? Server.defaultAvatar : element["avatar"]);
              newList.push(user);
            });
            this.setState({
              list : newList
            });
          }.bind(this),
          error: null,
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
          <div>
          <Button type="button" color="info" onClick={() => this.handleClickAdd()}>添加</Button>
          {this.state.loadingState === 0 ? <CircularProgress / > : null}
          <div className={classes.tableResponsive}>
          <div className={classes.panelbody}>
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
                      登陆账户
                  </TableCell>                  
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      姓名/昵称
                  </TableCell>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      联系电话
                  </TableCell>
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      操作
                  </TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {
                this.state.list.map((user, index) => {
                  return (
                    <TableRow key={index} className={classes.tableBodyRow}>
                      <TableCell className={classes.tableCellAvatar}>
                        <Avatar alt={"avatar_uid_" + user.uid} src={
                          user.avatar === null ? Server.defaultAvatar : user.avatar
                        }>
                        </Avatar>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.uid}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.login_id}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.name}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.phone}
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
          </div>
          
          
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
                编辑用户（UID：{this.state.list[this.state.userEditing].uid})
              </DialogTitle>
              <DialogContent>
              <div className={classes.tableResponsive}>
                  <div className={classes.panelbody}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        头像
                      </TableCell>
                      <TableCell>
                        <div className={classes.avatar}>
                        <Avatar id="input_avatar" src={this.state.inputAvatar} />
                        <Button type="button" color="success" onClick={e => this.handleUploadAvatar()}>
                        <Upload />
                        选择上传
                        </Button>
                        <input id="input_file" type="file" accept="image/*" hidden/>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        用户编号（UID）
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_uid"
                          inputProps={{
                            placeholder: "用户编号",
                            defaultValue: this.state.list[this.state.userEditing].uid
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        登陆账户
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_loginid"
                          inputProps={{
                            placeholder: "登陆账户",
                            defaultValue: this.state.list[this.state.userEditing].login_id
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        姓名/昵称
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_name"
                          inputProps={{
                            placeholder: "姓名/昵称",
                            defaultValue: this.state.list[this.state.userEditing].name
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        联系电话
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_phone"
                          inputProps={{
                            placeholder: "联系电话",
                            defaultValue: this.state.list[this.state.userEditing].phone
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
                </div>
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
                onClose={e => this.handleCloseDeleteDialog(e,false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"确认删除用户：" + this.state.list[this.state.userEditing].uid + "？"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      删除这个用户可能造成任何不可挽回的数据丢失后果。
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
                新增用户
              </DialogTitle>
              <DialogContent>
              <div className={classes.tableResponsive}>
                  <div className={classes.panelbody}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        头像
                      </TableCell>
                      <TableCell>
                        <div className={classes.avatar}>
                        <Avatar id="input_avatar" src={this.state.inputAvatar} />
                        <Button type="button" color="success" onClick={e => this.handleUploadAvatar()}>
                        <Upload />
                        选择上传
                        </Button>
                        <input id="input_file" type="file" accept="image/*" hidden/>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        用户编号（UID）
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_uid"
                          inputProps={{
                            placeholder: "用户编号",
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        登陆账户
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_loginid"
                          inputProps={{
                            placeholder: "登陆账户",
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        密码
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_password"
                          inputProps={{
                            placeholder: "密码",
                            type: "password"
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        姓名/昵称
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_name"
                          inputProps={{
                            placeholder: "姓名/昵称",
                            defaultValue: "新用户"
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        联系电话
                      </TableCell>
                      <TableCell>
                        <CustomInput id="input_phone"
                          inputProps={{
                            placeholder: "联系电话",
                            defaultValue: ""
                          }}
                          formControlProps={{
                            fullWidth: true
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
                </div>
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
