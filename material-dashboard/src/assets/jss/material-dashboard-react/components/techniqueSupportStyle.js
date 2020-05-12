import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont
} from "assets/jss/material-dashboard-react.js";
import tooltipStyle from "assets/jss/material-dashboard-react/tooltipStyle.js";
const tableStyle = theme => ({
  ...tooltipStyle,
  checked: {
    color: successColor[0] + "!important"
  },
  warningTableHeader: {
    color: warningColor[0]
  },
  primaryTableHeader: {
    color: primaryColor[0]
  },
  dangerTableHeader: {
    color: dangerColor[0]
  },
  successTableHeader: {
    color: successColor[0]
  },
  infoTableHeader: {
    color: infoColor[0]
  },
  roseTableHeader: {
    color: roseColor[0]
  },
  grayTableHeader: {
    color: grayColor[0]
  },
  table: {
    marginBottom: "0",
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "transparent",
    borderSpacing: "0",
    borderCollapse: "collapse"
  },
  tableHeadCell: {
    color: infoColor[0],
    ...defaultFont,
    "&, &$tableCell": {
      fontSize: "0.8125rem"
    }
  },
  tableCell: {
    ...defaultFont,
    lineHeight: "1.42857143",
    padding: "0px 0px",
    verticalAlign: "middle",
    fontSize: "0.8125rem"
  },
  tableCellAvatar: {
    ...defaultFont,
    lineHeight: "1.42857143",
    padding: "10px 2px",
    verticalAlign: "middle",
    fontSize: "0.8125rem"
  },
  tableCellControl: {
    ...defaultFont,
    lineHeight: "1.42857143",
    padding: "0px 0px",
    verticalAlign: "middle",
    fontSize: "0.8125rem"
  },
  tableResponsive: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  tableHeadRow: {
    height: "56px",
    color: "inherit",
    display: "table-row",
    outline: "none",
    verticalAlign: "middle"
  },
  tableBodyRow: {
    height: "12px",
    color: "inherit",
    display: "table-row",
    outline: "none",
    verticalAlign: "middle"
  },
  tableActionButton: {
    width: "27px",
    height: "27px",
    padding: "0"
  },
  tableActionButtonIcon: {
    width: "17px",
    height: "17px"
  },
  edit: {
    backgroundColor: "transparent",
    color: infoColor[0],
    boxShadow: "none"
  },
  save: {
    backgroundColor: "transparent",
    color: successColor[0],
    boxShadow: "none"
  },
  delete: {
    backgroundColor: "transparent",
    color: dangerColor[0],
    boxShadow: "none"
  },
  stateIdle: {
    color: successColor[0]
  },
  stateRepairing: {
    color: infoColor[0]
  },
  stateBlock: {
    color: dangerColor[0]
  },
  panelbody: {
    border: "1px #000000",
    minWidth: "1000px",
    margin: "0 auto;"
  }
});

export default tableStyle;
