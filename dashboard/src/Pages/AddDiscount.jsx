import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Space,
  Button,
  message,
  Select,
  Col,
  InputNumber,
} from "antd";
import axios from "../Components/Axios"; // Adjust the import path as needed

const { Option } = Select;

const AddDiscount = () => {
  const [brandData, setBrandData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [optionData, setOptionData] = useState([]);
  const [selectedType, setSelectedType] = useState("brand"); // Default to "brand"
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Fetch all data on initial load
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
    fetchProducts();
    fetchVariants();
    fetchOptions();
  }, []);

  useEffect(() => {
    // Update table data based on the selected type
    fetchTableData();
  }, [
    selectedType,
    brandData,
    categoryData,
    subCategoryData,
    productData,
    variantData,
    optionData,
  ]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/brand");
      setBrandData(response.data.data.doc);
      if (selectedType === "brand") {
        setTableData(
          response.data.data.doc.map((item) => ({
            ...item,
            name: item.name || item.title,
            Type: "brand",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category");
      setCategoryData(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("/subCategory");
      setSubCategoryData(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/product");
      setProductData(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await axios.get("/varient");
      setVariantData(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.get("/option");
      setOptionData(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchTableData = () => {
    switch (selectedType) {
      case "brand":
        setTableData(
          brandData.map((item) => ({
            ...item,
            name: item.name || item.title,
            Type: "brand",
          }))
        );
        break;
      case "category":
        setTableData(
          categoryData.map((item) => ({
            ...item,
            name: item.title,
            Type: "category",
          }))
        );
        break;
      case "subCategory":
        setTableData(
          subCategoryData.map((item) => ({
            ...item,
            name: item.title,
            Type: "subCategory",
          }))
        );
        break;
      case "product":
        setTableData(
          productData.map((item) => ({
            ...item,
            name: item.name,
            Type: "product",
          }))
        );
        break;
      case "variant":
        setTableData(
          variantData.map((item) => ({
            ...item,
            name: item.colorName,
            Type: "variant",
          }))
        );
        break;
      case "option":
        setTableData(
          optionData.map((item) => ({
            ...item,
            name: item.sku,
            Type: "option",
          }))
        );
        break;
      default:
        break;
    }
  };

  const handleUpdateDiscount = async (record) => {
    try {
      await axios.put("/discount/apply", {
        type: selectedType,
        id: record._id,
        discountType: record.discountType,
        discountValue: record.discountValue,
      });

      message.success("Discount updated successfully");
    } catch (error) {
      message.error("Failed to update discount");
      console.error("Error updating discount:", error);
    }
  };

  const handleSelectChange = (value, record, key) => {
    const newData = tableData.map((item) => {
      if (item._id === record._id) {
        return { ...item, [key]: value };
      }
      return item;
    });
    setTableData(newData);
  };

  const columns = [
    {
      title: "Name/Title",
      key: "nameOrTitle",
      render: (text, record) => <span>{record.name}</span>,
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
      render: (value, record) => (
        <Select
          style={{ width: "100%" }}
          value={value}
          onChange={(val) => handleSelectChange(val, record, "discountType")}
          options={[
            { label: "Amount", value: "amount" },
            { label: "Percent", value: "percent" },
            { label: "None", value: "none" },
          ]}
        />
      ),
    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (value, record) => (
        <InputNumber
          style={{ width: "100%" }}
          onChange={(val) => handleSelectChange(val, record, "discountValue")}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdateDiscount(record)}>
            Update Discount
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10">
        ADD Discount
      </h2>
      <div className="flex justify-center flex-col items-center">
        <Col span={16}>
          <Card
            title={`Apply Discount in`}
            bordered={false}
            extra={
              <Select
                style={{ width: "200px" }}
                value={selectedType}
                onChange={(value) => setSelectedType(value)}
              >
                <Option value="brand">Brand</Option>
                <Option value="category">Category</Option>
                <Option value="subCategory">Sub-Category</Option>
                <Option value="product">Product</Option>
                <Option value="variant">Variant</Option>
                <Option value="option">Option</Option>
              </Select>
            }
          >
            <Table
              dataSource={tableData}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </div>
    </>
  );
};

export default AddDiscount;
