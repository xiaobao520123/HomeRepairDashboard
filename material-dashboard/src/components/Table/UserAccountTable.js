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
    constructor(uid, name, login_id, avatar) {
      this.uid = uid;
      this.name = name;
      this.login_id = login_id;
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
      this.setState({openEditDialog: false, userEditing: null, inputAvatar: null});
    }

    handleCloseEditDialog() {
      this.setState({openEditDialog: false, userEditing: null, inputAvatar: null});
    }

    handleCloseDeleteDialog(e, willDelete) {
      if (willDelete){
        // 删除用户

      }
      this.setState({openDeleteDialog: false, userEditing: null});
    }

    handleCloseAddDialog(willAdd) {
      if (willAdd) {

      }
      this.setState({openAddDialog: false ,inputAvatar: null});
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
          url: "http://47.112.177.70/?need=user-info&uid=all",
          timeout: 5000,
          success: function(status) {
            var json = JSON.parse(status);
            const newList = this.state.list;
            json.forEach(element => {
              const user = new UserAccount(
                element["uid"], 
                element["name"], 
                element["login_id"],
                element["avatar"]);
              const index = newList.push(user) - 1;

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
            <Button type="button" color="info" onClick={() => this.handleClickAdd()}>添加</Button>
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
                      登陆账户
                  </TableCell>                  
                  <TableCell 
                    className={classes.tableCell + " " + classes.tableHeadCell}>
                      姓名/昵称
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
                编辑用户（UID：{this.state.list[this.state.userEditing].uid})
              </DialogTitle>
              <DialogContent>
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
