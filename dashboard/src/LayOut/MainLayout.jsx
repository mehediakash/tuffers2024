import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  FileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { BiSolidCategory } from "react-icons/bi";
import { GiKnightBanner } from "react-icons/gi";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Home from "../Pages/DashBoardHome";
import Order from "../Pages/Order";
import { AudioOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import UploadBanner from "../Pages/UploadBanner";
import AddCategory from "../Pages/Category";
import AllBanner from "../Pages/AllBanner";
import SubCategory from "../Pages/SubCategory";
import UploadProduct from "../Pages/UploadProduct";
import AllProduct from "../Pages/AllProduct";
import { IoMdLogOut } from "react-icons/io";
import logo from "../assets/icon.png";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../Slices/userSlices";
import AddDiscount from "../Pages/AddDiscount";
import AddReview from "../Pages/AddReview";
import ApplayCuppon from "../Pages/ApplayCuppon";
import AddBrand from "../Pages/AddBrand";
const { Search } = Input;
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const selectore = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (selectore?.users?.userValue?.data?.user?.role !== "aklogicAdmin") {
      navigate("/");
    }
  }, []);
  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
    console.log("key", key);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  let content = null;
  switch (selectedMenuItem) {
    case "1":
      content = <Home />;
      break;
    case "2":
      content = <Order />;
      break;
    case "3":
      content = <UploadBanner />;
      break;
    case "4":
      content = <AllBanner />;
      break;

    case "5":
      content = <AddCategory />;
      break;

    case "7":
      content = <UploadProduct />;
      break;
    case "8":
      content = <AllProduct />;
      break;
    case "9":
      content = <AddDiscount />;
      break;
    case "10":
      content = <AddReview />;
      break;
    case "11":
      content = <ApplayCuppon />;
      break;
    case "12":
      content = <AddBrand />;
      break;
    default:
      content = (
        <div className="text-center text-xl font-bold py-10">
          omvato Default Content
        </div>
      );
  }

  let items = [
    getItem("Dashboard", "1", <UserOutlined />),

    getItem("Order", "2", <FileOutlined />),
    getItem("ADD Category", "5", <FileOutlined />),

    getItem("Product", "sub4", <UploadOutlined />, [
      getItem("Upload Product", "7"),
      getItem("All Product", "8"),
      getItem("Brand", "12"),
    ]),
    getItem("upload Banner", "3", <GiKnightBanner />),
    getItem("Add Discount", "9", <FileOutlined />),
    getItem("Coupon", "11", <FileOutlined />),
    // getItem("Add Review", "10", <FileOutlined />),
  ];

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  let handelLogout = () => {
    localStorage.removeItem("user");
    dispatch(activeUser(null));
    navigate("/");
  };

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        className="!bg-[#001529]"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="text-white px-5  mx-auto  font-bold text-2xl leading-[80px] text-center  my-5 flex justify-center ">
          <img src={logo}></img>
        </div>
        <Menu
          theme="light"
          className="!text-white  !font-bold"
          onClick={({ key }) => handleMenuItemClick(key)}
          defaultSelectedKeys={["sub1"]}
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          items={items}
        />
        <div
          onClick={handelLogout}
          className="text-center bg-red- w-full py-5 text-white flex justify-center items-center gap-x-1 absolute bottom-10 left-[50%] translate-x-[-50%] cursor-pointer font-bold uppercase"
        >
          {/* <IoMdLogOut size={25} /> */}
          <p>Log Out</p>
        </div>
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 70 : 200, // Adjust marginLeft dynamically
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="flex items-center ">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            {/* <Search
              className="w-[50%] mx-auto py-2"
              placeholder="search here"
              onSearch={onSearch}
              enterButton
            /> */}
          </div>
        </Header>
        <Content
          className="bg-[#F6F8FA] px-5 "
          style={{
            overflow: "initial",
          }}
        >
          {content}
          <h1 className="my-5 " style={{ textAlign: "center" }}>
            Developed by{" "}
            <Link className="font-bold text-black" to={"https://tuffersbd.com"}>
              tuffers
            </Link>
          </h1>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
