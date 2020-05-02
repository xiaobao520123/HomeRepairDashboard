/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Language from "@material-ui/icons/Language";
import Notes from "@material-ui/icons/Notes";
import People from "@material-ui/icons/People";
import SettingsIcon from "@material-ui/icons/Settings";
// core components/views for Admin layout
import Order from "views/Order/Order.js";
import UserAccount from "views/UserAccount/UserAccount.js";
import HumanResource from "views/HumanResource/HumanResource.js";
import Settings from "views/Settings/Settings.js";
import DashboardPage from "views/Dashboard/Dashboard.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "仪表盘",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/order",
    name: "订单管理",
    rtlName: "*保留*",
    icon: Notes,
    component: Order,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "用户管理",
    rtlName: "*保留*",
    icon: Person,
    component: UserAccount,
    layout: "/admin"
  },
  {
    path: "/hr",
    name: "人事部",
    rtlName: "*保留*",
    icon: People,
    component: HumanResource,
    layout: "/admin"
  },
  {
    path: "/settings",
    name: "设置",
    rtlName: "*保留*",
    icon: SettingsIcon,
    component: Settings,
    layout: "/admin"
  }
];

export default dashboardRoutes;
