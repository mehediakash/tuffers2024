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
      colorName: record.products?.[0]?.option?.variant?.colorName || "",
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
              colorName: values.colorName,
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`/order/${orderId}`, { orderStatus: newStatus });
      message.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  const handleCourierChange = async (order, courier) => {
    if (courier === "Steadfast") {
      try {
        const { name, phone, streetAddress, totalCost } =
          order;
        const invoice = `${order._id}`;

        const payload = {
          invoice,
          recipient_name: name,
          recipient_phone: phone,
          recipient_address: `${streetAddress} `,
          cod_amount: totalCost,
        };

        const response = await axios.post(
          "https://portal.packzy.com/api/v1/create_order",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Api-Key": "wm5bry4qgrcsuhxmotdnp9mpzvpqq6gj",
              "Secret-Key": "ve6fhiuocpgboomrhgftxnjw",
            },
          }
        );

        if (response?.data?.status === 200) {
          return message.success("Order placed with Steadfast successfully");
        }
        if (response?.data?.status === 400) {
          return message.error(response?.data?.errors.invoice);
        }
      } catch (error) {
        message.error("Error placing order with Steadfast");
        console.error("Error placing Steadfast order:", error);
      }
    }
 
  };

  const handlePrintInvoice = async (order) => {
    try {
      const response = await axios.get(`/order/${order._id}`);
      const anOrder = response?.data?.data?.doc;

      const invoiceWindow = window.open("", "_blank");

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
                
                <p>Address:${anOrder.streetAddress},
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

      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();

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
      title: "Price",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "Quantity",
      dataIndex: ["products", 0, "quantity"],
      key: "quantity",
    },

    {
      title: "Color Name",
      dataIndex: ["products", 0, "option", "variant", "colorName"],
      key: "colorName",
    },
    {
      title: "Size",
      dataIndex: ["products", 0, "option", "size"],
      key: "size",
    },
    {
      title: "sku",
      dataIndex: ["products", 0, "option", "sku"],
      key: "sku",
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
         
          <p>
            Address:{" "}
            {`${record.streetAddress}`}
          </p>
        </div>
      ),
    },
    {
      width: "10%",
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record) => (
        <Select
          className="w-[100%]"
          value={record.orderStatus} // Show current status
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Delivered", value: "delivered" },
            { label: "Shipped", value: "shipped" },
            { label: "Canceled", value: "canceled" },
          ]}
        />
      ),
    },
    {
      width: "15%",
      title: "Courier Service",
      dataIndex: "courier",
      key: "courier",
      render: (text, record) => (
        <Select
          className="w-[100%]"
          value={record.courier || "Select Courier"} // Show selected courier
          onChange={(value) => handleCourierChange(record, value)}
          options={[
            { label: "Steadfast", value: "Steadfast" },
            
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
          <Button type="primary" onClick={() => handlePrintInvoice(record)}>
            Print Invoice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={currentOrder}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city">
            <Input />
          </Form.Item>
          <Form.Item label="District" name="district">
            <Input />
          </Form.Item>
          <Form.Item label="Color Name" name="colorName">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Order;
