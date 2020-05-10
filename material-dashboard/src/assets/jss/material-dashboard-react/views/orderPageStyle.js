import {
  defaultFont,
  successColor,
  whiteColor,
  infoColor,
  grayColor,
  dangerColor,
  warningColor,
} from "assets/jss/material-dashboard-react.js";

const orderPageStyle = {
  table: {
    marginBottom: "0",
    overflow: "visible"
  },
  tableRow: {
    position: "relative",
    borderBottom: "1px solid " + grayColor[5]
  },
  tableActions: {
    display: "flex",
    border: "none",
    padding: "12px 8px !important",
    verticalAlign: "middle"
  },
  tableCell: {
    ...defaultFont,
    padding: "8px",
    verticalAlign: "middle",
    border: "none",
    lineHeight: "1.42857143",
    fontSize: "14px"
  },
  tableCellType: {
    ...defaultFont,
    padding: "8px",
    verticalAlign: "middle",
    border: "none",
    lineHeight: "1.42857143",
    fontSize: "14px",
  },
  tableCellContent: {
    ...defaultFont,
    padding: "8px",
    verticalAlign: "middle",
    border: "none",
    lineHeight: "1.42857143",
    fontSize: "100px",
  },
  cardTitleNormal: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "500",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  tableCellColorInfo: {
    color: infoColor[0]
  },
  tableCellColorSuccess: {
    color: successColor[0]
  },
  tableCellColorDanger: {
    color: dangerColor[0]
  },
  tableCellColorWarning: {
    color: warningColor[0]
  },
  block: {
    ...defaultFont,
    color: "black",
    borderRadius: "3px",
    position: "relative",
    display: "block",
  },
};

export default orderPageStyle;
