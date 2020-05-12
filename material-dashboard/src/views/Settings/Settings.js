import React from "react";
import jQuery from "jquery";
import Server from "server/server.js";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import ChatSentenceTable from "components/Table/ChatSentenceTable.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardCategoryBlack: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(0,0,0,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "500",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();

  class QuickAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {list: '' }
    }
   
    componentDidMount() {
      this.serverRequest = jQuery.getJSON(
        Server.defaultServerDomain + '/?need=quick-answer', 
        function (json) {
        var data = [];
        jQuery.each(json, function(i, qa){
          data[i] = [];
          data[i][0] = qa["id"];
          data[i][1] = qa["text"];
          data[i][2] = qa["enabled"];
          data[i][3] = qa["last_modify"];
        });
        this.setState({
          list: data
        });
      }.bind(this));
    }
   
    componentWillUnmount() {
      this.serverRequest.abort();
    }
   
    render() {
      return (
        <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card >
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>聊天语句模版</h4>
                <p className={classes.cardCategoryBlack}>
                  客服利用这些聊天模版快速回复用户
                </p>
              </CardHeader>
              <CardBody>
                <ChatSentenceTable
                  tableHeaderColor="warning"
                  tableData={[...this.state.list]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
      );
    }
  }

  return (
    <QuickAnswer />
  );
}
