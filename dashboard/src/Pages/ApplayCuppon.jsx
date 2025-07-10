import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Space,
  Table,
  message,
} from "antd";
import axios from "../Components/Axios"; // Ensure this is the correct import path

const ApplayCuppon = () => {
  const [couponForm] = Form.useForm();
  const [coupons, setCoupons] = useState([]);

  // Fetch all coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("/coupon");
        setCoupons(response.data.data.doc);
      } catch (error) {
        message.error("Failed to fetch coupons");
      }
    };

    fetchCoupons();
  }, []);

  // Handle form submission for creating a coupon
  const handleCouponSubmit = async (values) => {
    const { dateRange } = values;
    if (!dateRange || dateRange.length !== 2) {
      message.error("Please select a valid date range");
      return;
    }

    const [validFrom, validUntil] = dateRange;
    try {
      const newCoupon = {
        coupon: values.coupon,
        discountPercent: values.discountPercent,
        validFrom: validFrom.format("YYYY-MM-DD"),
        validUntil: validUntil.format("YYYY-MM-DD"),
      };

      console.log("Sending new coupon data to API:", newCoupon);

      const response = await axios.post("/coupon", newCoupon);

      console.log("API response:", response);

      if (response.data && response.data.data && response.data.data.doc) {
        setCoupons([...coupons, response.data.data.doc]);
        message.success("Coupon added successfully");
        couponForm.resetFields();
      } else {
        message.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(`Failed to add coupon: ${error.response.data.message}`);
      } else {
        message.error("Failed to add coupon");
      }
    }
  };

  // Handle coupon deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/coupon/${id}`);
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
      message.success("Coupon deleted successfully");
    } catch (error) {
      message.error("Failed to delete coupon");
    }
  };

  const columns = [
    {
      title: "Coupon",
      dataIndex: "coupon",
      key: "coupon",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Discount Percent",
      dataIndex: "discountPercent",
      key: "discountPercent",
      width: "15%",
    },
    {
      title: "Valid From",
      dataIndex: "validFrom",
      key: "validFrom",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      key: "validUntil",
      render: (text) => new Date(text).toLocaleDateString(),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10">
        Coupon Code
      </h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Create Coupon" bordered={false}>
            <Form
              form={couponForm}
              onFinish={handleCouponSubmit}
              layout="vertical"
            >
              <Form.Item
                label="Coupon"
                name="coupon"
                rules={[
                  {
                    required: true,
                    message: "Please input the coupon",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Discount Percent"
                name="discountPercent"
                rules={[
                  {
                    required: true,
                    message: "Please input the discount percent!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Date Range"
                name="dateRange"
                rules={[
                  {
                    required: true,
                    message: "Please select the valid date range",
                  },
                ]}
              >
                <DatePicker.RangePicker />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Add Coupon
              </Button>
            </Form>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="All Coupons" bordered={false}>
            <Table columns={columns} dataSource={coupons} rowKey="_id" />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ApplayCuppon;
