import React from "react";
import Server from "server/server.js"
// @material-ui/icons
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import OrderCard from "components/Card/OrderCard.js";

export default function CardOrderContainer() {
    class TheContainer extends React.Component{
        constructor(props) {
            super(props);

            this.state = {
                loadingState : 0,
                list: []
            };
        }

        componentDidMount() {
            this.serverRequest = Server.getOrderList(
                function (XMLHttpRequest) {
                    this.setState({loadingState: 0});
                }.bind(this),
                function(status) {
                    var json = JSON.parse(status);
                    const newList = this.state.list;
                    json.forEach(element => {
                        newList.push(element['oid']);
                    });
                    this.setState(newList);
                }.bind(this),
                null,
                function(XMLHttpRequest, status) {
                    if(status === "timeout") {
                      alert("连接超时!");
                    }
                    this.setState({loadingState: 1});
                }.bind(this)
            );
        }

        componentWillUnmount(){
            this.serverRequest.abort();
        }

        render() {
            if (this.state.loadingState === 0) {
                return (
                    <div>
                    </div>
                )
            }
            return (
                <div>
                    <GridContainer>
                        {
                            this.state.list.map((oid, index) => {
                                return (
                                    <GridItem xs={12} sm={6} md={3} key={index}>
                                        <OrderCard oid={oid} color={index % 4}/>
                                    </GridItem>
                                );
                            })
                        }
                    </GridContainer>
                </div>
            );
        }
    }

    return(
        <TheContainer />
    );
}