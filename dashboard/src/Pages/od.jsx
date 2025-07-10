import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import axios from "../Components/Axios";

const Order = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/order");
      setData(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (record) => {
    setCurrentOrder(record);
    form.setFieldsValue({
      ...record,
      colorName: record.products?.[0]?.option?.variant?.colorName || "", // Corrected here
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/order/${id}`);
      message.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to delete order");
      console.error("Error deleting order:", error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const updatedProducts = currentOrder.products.map((product) => {
        return {
          ...product,
          option: {
            ...product.option,
            variant: {
              ...product.option.variant,
              colorName: values.colorName, // Correctly updating the color name
            },
          },
        };
      });

      await axios.patch(`/order/${currentOrder?._id}`, {
        ...values,
        products: updatedProducts,
      });

      message.success("Order updated successfully");
      setIsModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order");
      console.error("Error updating order:", error);
    }
  };

  const handlePrintInvoice = async (order) => {
    try {
      const response = await axios.get(`/order/${order._id}`);
      const anOrder = response?.data?.data?.doc;

      // Open a new window
      const invoiceWindow = window.open("", "_blank");

      // Build the HTML content for the invoice
      const invoiceHTML = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
              .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-header h1 { margin: 0; }
              .invoice-details { margin-bottom: 20px; }
              .invoice-details p { margin: 0; }
              .invoice-products { width: 100%; border-collapse: collapse; }
              .invoice-products th, .invoice-products td { border: 1px solid #eee; padding: 10px; }
              .invoice-total { margin-top: 20px; text-align: right; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="invoice-box">
              <div class="invoice-header">
                <h1>Invoice</h1>
                <div>
                  <p>Order ID: ${anOrder._id}</p>
                  <p>Date: ${new Date(
                    anOrder.createdAt
                  ).toLocaleDateString()}</p>
                </div>
              </div>
              <div class="invoice-details">
                <p>Name: ${anOrder.name}</p>
                <p>Phone: ${anOrder.phone}</p>
                <p>Email: ${anOrder.email}</p>
                <p>Address: ${anOrder.streetAddress}, ${anOrder.city}, ${
        anOrder.district
      }</p>
              </div>
              <table class="invoice-products">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${anOrder.products
                    .map(
                      (product) => `
                      <tr>
                        <td>${product?.option?.product?.name || "N/A"}</td>
                        <td>${product?.option?.variant?.colorName || "N/A"}</td>
                        <td>${product?.option?.size || "N/A"}</td>
                        <td>${product?.quantity || "N/A"}</td>
                        <td>${anOrder.totalCost || "N/A"}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
              <div class="invoice-total">
                <p>Total Cost: ${anOrder.totalCost}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Write the invoice HTML content to the new window
      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();

      // Wait until the content is fully loaded before triggering print
      invoiceWindow.onload = () => {
        invoiceWindow.print();
        invoiceWindow.close();
      };
    } catch (error) {
      console.error("Error printing invoice:", error);
    }
  };

  const columns = [
    {
      title: "SR",
      dataIndex: "index",
      key: "sr",
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Product Name",
      dataIndex: ["products", 0, "option", "product", "name"],
      key: "productName",
      render: (text) => <a>{text || "N/A"}</a>,
    },
    {
      title: "Quantity",
      dataIndex: ["products", 0, "quantity"],
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "Color Name",
      dataIndex: ["products", 0, "option", "variant", "colorName"],
      key: "colorName",
    },
    {
      title: "Information",
      dataIndex: "information",
      key: "information",
      render: (text, record) => (
        <div>
          <p>Name: {record.name}</p>
          <p>Phone: {record.phone}</p>
          <p>Email: {record.email}</p>
          <p>City: {record.city}</p>
          <p>District: {record.district}</p>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)}>Delete</Button>
          <Button onClick={() => handlePrintInvoice(record)}>
            Print Invoice
          </Button>
        </Space>
      ),
    },
    {
      title: "courier services",
      key: "action",
      render: (_, record) => (
        <Select
          className="w-[100%]"
          options={[
            { label: "pathaow", value: "pathaow" },
            { label: "Steadfast", value: "Steadfast" },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10">
        Orders Information
      </h2>
      <Table columns={columns} dataSource={data} rowKey="_id" />
      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            label="Order Status"
            name="orderStatus"
            rules={[
              { required: true, message: "Please select the order status!" },
            ]}
          >
            <Select
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Delivered", value: "delivered" },
                { label: "Shipped", value: "shipped" },
                { label: "Canceled", value: "canceled" },
              ]}
            />
          </Form.Item>
          {/* <Form.Item
            label="Color"
            name="colorName"
            rules={[{ required: true, message: "Please input the color!" }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input the phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please input the city!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "Please input the district!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Order;
