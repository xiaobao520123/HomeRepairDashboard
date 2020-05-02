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
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
// core components

import Button from "components/CustomButtons/Button.js"
import styles from "assets/jss/material-dashboard-react/components/userAccountStyle.js";

const useStyles = makeStyles(styles);

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

  const stateColor = [
    classes.stateIdle,
    classes.stateRepairing,
    classes.stateBlock
  ];

  class TheTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          list : [],
          loadingState: 0
        }
    }

    handleClickAdd() {
      
    }

    handleDelete(index) {

    }

    handleEdit(index) {

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
