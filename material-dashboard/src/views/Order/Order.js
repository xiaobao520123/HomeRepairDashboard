import React from "react";
// @material-ui/core
// @material-ui/icons

// core components

import CardOrderContainer from "views/Order/CardOrderContainer.js"
import OrderPage  from "views/Order/OrderPage.js";

function GetQueryValue(queryName) {
  var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if ( r != null ){
     return decodeURI(r[2]);
  }else{
     return null;
  }
}

export default function Order(props) {
  const oid = GetQueryValue("oid");
  if (oid === null) {
    return (
      <CardOrderContainer>
  
      </CardOrderContainer>
    );
  } else {
    return (
      <OrderPage oid={oid}>

      </OrderPage>
    );
  }
}
