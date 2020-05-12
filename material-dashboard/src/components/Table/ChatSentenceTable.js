import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import jQuery from "jquery";
import Server from "server/server";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Edit from "@material-ui/icons/Edit";
import Save from "@material-ui/icons/Save";
import Delete from "@material-ui/icons/Delete";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js"
import styles from "assets/jss/material-dashboard-react/components/chatSentenceStyle.js";


const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableData, tableHeaderColor } = props;
  
  class TheTable extends React.Component {
      constructor(props) {
        super(props);
        const check = [];
        const edit = [];
        const newList = tableData;

        tableData.forEach((prop, index) => {
          check[index] = prop[2] === "1";
          edit[index] = false;
        });

        this.state = {
          list: newList,
          checkBoxState: check,
          editState : edit
        }
      }

      sendToServer(json) {
        jQuery.ajax({
          type: "post",
          url: Server.defaultServerDomain,
          data: JSON.stringify(json),
          timeout: 5000,
          success: function(status) {
          },
          error: null,
          complete : function(XMLHttpRequest, status) {
            if(status === 'timeout') {
              alert("操作失败，连接超时");
            }
          }
        });
      }

      updateChatSentence(id, text, enabled, last_modify) {
        const json = {
          "cmd" : "modify-answer",
          "id" : id,
          "text" : text,
          "enabled": enabled ? "1" : "0",
          "last_modify" : last_modify
        };

        this.sendToServer(json);
      }

      deleteChatSentence(index) {
        const newList = this.state.list;
        const newCheck = this.state.checkBoxState;
        const newEdit = this.state.editState;
        const json = {
          "cmd" : "delete-answer",
          "id" : newList[index][0],
        };

        jQuery.ajax({
          type: "post",
          url: Server.defaultServerDomain,
          data: JSON.stringify(json),
          timeout: 5000,
          success: function(status) {
            if(JSON.parse(status)["success"] === 1) {
              newList.splice(index, 1);
              newCheck.splice(index, 1);
              newEdit.splice(index, 1);
              this.setState({
                list : newList,
                checkBoxState : newCheck,
                editState: newEdit
              });
            }
          }.bind(this),
          error: null,
          complete : function(XMLHttpRequest, status) {
            if(status === 'timeout') {
              alert("操作失败，连接超时");
            }
          }
        });
      }

      handleToggle(index) {
        // 当按下启用按钮时
        const newCheck = this.state.checkBoxState;
        const newList = this.state.list;
        newCheck[index] = !newCheck[index];
        newList[index][2] = (newCheck[index] ? "1" : "0");
        this.setState({list: newList, checkBoxState: newCheck});
        const data = newList[index];
        this.updateChatSentence(data[0], data[1], newCheck[index], data[3]);
      }

      handleEdit(index) {
        const newEdit = this.state.editState;
        const newList = this.state.list;
        if(newEdit[index]) {
          const newText = document.getElementById("editor" + index).value;
          if(newText !== newList[index][1]) {
            const date = moment().format('YYYY-MM-DD HH:mm:ss');
            newList[index][1] = newText;
            newList[index][3] = date;
            this.updateChatSentence(newList[index][0], newText, this.state.checkBoxState[index], date);
          }
        }
        newEdit[index] = !newEdit[index];
        this.setState({list: newList, editState: newEdit});
      }

      handleDelete(index) {
        this.deleteChatSentence(index);
      }

      handleClickAdd() {
        const newList = this.state.list;
        const newCheck = this.state.checkBoxState;
        const newEdit = this.state.editState;
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        const item = [0, "在这里输入你想添加的文本", 1, date];
        const index = newList.push(item) - 1;
        newCheck[index] = false;
        newEdit[index] = true;

        const json = {
          "cmd" : "new-answer",
          "text" : "在这里输入你想添加的文本",
          "enabled": "0",
          "last_modify" : date,
        };

        jQuery.ajax({
          type: "post",
          url: Server.defaultServerDomain,
          data: JSON.stringify(json),
          timeout: 5000,
          success: function(status) {
            var json = JSON.parse(status);
            if (json["success"] === 1) {
              const newList = this.state.list;
              newList[index][0] = json["id"];
              this.setState({
                list : newList,
                checkBoxState : newCheck,
                editState: newEdit
              });
            }
          }.bind(this),
          error: null,
          complete : function(XMLHttpRequest, status) {
            if(status === 'timeout') {
              alert("操作失败，连接超时");
            }
          }
        });
      }

      componentDidMount(){

      }

      componentWillUnmount(){

      }

      render(){
        return (
          <div>
          <Button type="button" color="success" onClick={() => this.handleClickAdd()}>添加</Button>
          <div className={classes.tableResponsive}>
          <div className={classes.panelbody}>

            <Table className={classes.table}>
                <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
                  <TableRow className={classes.tableHeadRow}>
                    <TableCell 
                      className={classes.tableCell + " " + classes.tableHeadCell}>
                        启用
                    </TableCell>
                    <TableCell 
                      className={classes.tableCell + " " + classes.tableHeadCell}>
                        文本
                    </TableCell>
                    <TableCell 
                      className={classes.tableCell + " " + classes.tableHeadCell}>
                        上次修改
                    </TableCell>
                    <TableCell 
                      className={classes.tableCell + " " + classes.tableHeadCell}>
                        操作
                    </TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {this.state.list.map((prop, index) => {
                  var text = prop[1];
                  if (text.length > 20) {
                    text = text.slice(0, 20);
                    text = text + "..."
                  }
                  return (
                    <TableRow key={index} className={classes.tableBodyRow}>
                      <TableCell className={classes.tableCell}>
                      <Checkbox
                        onChange={() => this.handleToggle(index)}
                        checked={this.state.checkBoxState[index]}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked
                        }}
                      />
                      </TableCell>
                      {
                      this.state.editState[index] ? (
                      <TableCell className={classes.tableCell}>
                      <CustomInput
                          id={"editor" + index}
                          inputProps={{
                            placeholder: "在这里输入你想添加的文本",
                            defaultValue: prop[1],
                            multiline: true,
                          }}
                          formControlProps={{
                            fullWidth: true
                          }}
                        />
                      </TableCell>
                      ) : 
                      <TableCell className={classes.tableCell}>  
                      {text}
                      </TableCell>
                    }
                      <TableCell className={classes.tableCell}>                      
                        {prop[3]}
                      </TableCell>
                      <TableCell className={classes.tableCell} >
                    {!this.state.editState[index] ? 
                    (<Tooltip
                      id="tooltip-top"
                      title="编辑文本"
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
                    </Tooltip>) :
                    (<Tooltip
                      id="tooltip-top"
                      title="保存文本"
                      placement="top"
                      classes={{ tooltip: classes.tooltip }}
                    >

                      <IconButton
                        aria-label="Save"
                        onClick={() => this.handleEdit(index)}
                        className={classes.tableActionButton}
                      >
                        <Save
                          className={
                            classes.tableActionButtonIcon + " " + classes.save
                          }
                        />
                      </IconButton>
                    </Tooltip>)
                        }

                    <Tooltip
                      id="tooltip-top"
                      title="删除语句"
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
                })}
              </TableBody>
            </Table>
          </div>
        </div>
          </div>
         
        );
      }
  };
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
