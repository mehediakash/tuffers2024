import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Upload,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import axios from "../Components/Axios";
import { UploadOutlined } from "@ant-design/icons";

const UploadBanner = () => {
  const [brandForm] = Form.useForm();
  const [banners, setBanners] = useState([]);
  const [fileList, setFileList] = useState([]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get("/banner");

      setBanners(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleBrandSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("subTitle", values.subTitle);
      formData.append("link", values.link);
      formData.append("bannerType", values.bannerType);
      if (fileList.length > 0) {
        formData.append("photo", fileList[0]);
      }

      const response = await axios.post("/banner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(response.data.message);
      fetchBanners();
      brandForm.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to add banner");
      console.error("Error adding banner:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/banner/${id}`);
      message.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      message.error("Failed to delete banner");
      console.error("Error deleting banner:", error);
    }
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (text) => (
        <img src={text} alt="banner" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Sub Title",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "Banner Type",
      dataIndex: "bannerType",
      key: "bannerType",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <a>Edit</a> */}
          <Button onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    fileList,
    onRemove: (file) => {
      setFileList((prevList) => {
        const index = prevList.indexOf(file);
        const newFileList = prevList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
  };

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10 ">
        Add Banner
      </h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Add Banner" bordered={false}>
            <Form
              form={brandForm}
              onFinish={handleBrandSubmit}
              layout="vertical"
            >
              <Form.Item
                label="Banner Title"
                name="title"
                rules={[
                  { required: true, message: "Please input the Banner name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                layout="vertical"
                label="Sub Title"
                name="subTitle"
                rules={[
                  { required: true, message: "Please input the Sub Title!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                layout="vertical"
                label="Product Link"
                name="link"
                rules={[
                  { required: true, message: "Please input the Product Link!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                layout="vertical"
                label="Banner Type"
                name="bannerType"
                rules={[
                  { required: true, message: "Please select a Banner Type!" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { label: "Main Banner", value: "Main Banner" },
                    { label: "Deals of the Week", value: "Deals of the Week" },
                    { label: "New Release", value: "New Release" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Upload Banner Image">
                <p className="text-xs text-gray-500  py-2">
                  {" "}
                  Main Banner= 690 x 360px, New Release= 468 x 752px, Deals of
                  the Week= 402 x 706px
                </p>

                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Banner Image</Button>
                </Upload>
              </Form.Item>
              <br />
              <Button type="primary" htmlType="submit">
                Add Banner
              </Button>
            </Form>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="All Banners" bordered={false}>
            <Table columns={columns} dataSource={banners} rowKey="_id" />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UploadBanner;
