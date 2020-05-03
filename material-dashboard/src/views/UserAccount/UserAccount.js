import React from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import UserAccountTable from "components/Table/UserAccountTable.js";

export default function TableList() {
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card >
          <CardBody>
            <UserAccountTable />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
