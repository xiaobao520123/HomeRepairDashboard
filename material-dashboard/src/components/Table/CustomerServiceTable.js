import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components

import styles from "assets/jss/material-dashboard-react/components/customerServiceStyle.js";


const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();

  class TheTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = "";
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {

    }
    render() {
      return (
        <div> hello </div>
      );
    }
  }

  
  return (
    <TheTable className={classes.table}/>
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
