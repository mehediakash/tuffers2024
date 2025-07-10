import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Table,
  Modal,
  Select,
  Switch,
  message,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "../Components/Axios";

const { Option } = Select;

const AddBrand = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/brand");
      setBrands(response.data.data.doc);
    } catch (error) {
      message.error("Failed to fetch brands.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category");
      setCategories(response.data.data.doc);
    } catch (error) {
      message.error("Failed to fetch categories.");
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(`/subCategory`);
      setSubCategories(response.data.data.doc);
    } catch (error) {
      message.error("Failed to fetch sub-categories.");
    }
  };

  const handleCategoryChange = (value) => {
    form.setFieldsValue({ subCategory: null });
    fetchSubCategories(value);
  };

  const openAddModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setIsEditMode(true);
    form.setFieldsValue({
      title: brand.title,
      category: brand.category,
      subCategory: brand.subCategory,
      isActive: brand.isActive,
    });
    fetchSubCategories(brand.category);
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("isActive", values.isActive);
    // formData.append("category", values.category);
    // formData.append("subCategory", values.subCategory);

    if (values.photo) {
      formData.append("photo", values.photo[0].originFileObj);
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await axios.patch(`/brand/${editingBrand._id}`, formData);
        message.success("Brand updated successfully!");
      } else {
        await axios.post("/brand", formData);
        message.success("Brand added successfully!");
      }
      fetchBrands();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(
        isEditMode ? "Failed to update brand." : "Failed to add brand."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    try {
      await axios.delete(`/brand/${id}`);
      message.success("Brand deleted successfully!");
      fetchBrands();
    } catch (error) {
      message.error("Failed to delete brand.");
    }
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <img src={photo} alt="Brand" style={{ width: 60, height: 60 }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => <Switch checked={isActive} disabled />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBrand(record._id)}
            danger
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mt-5">
        <h2 className="text-2xl font-medium">Manage Brands</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          style={{ marginBottom: 16 }}
        >
          Add Brand
        </Button>
      </div>
      <Table dataSource={brands} columns={columns} rowKey="_id" />

      <Modal
        title={isEditMode ? "Edit Brand" : "Add Brand"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.validateFields().then(handleFormSubmit)}
        okText={isEditMode ? "Save" : "Add"}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="title"
            label="Brand Title"
            rules={[
              { required: true, message: "Please enter the brand title" },
            ]}
          >
            <Input placeholder="Enter brand title" />
          </Form.Item>

          {/* <Form.Item
            className=""
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select Category"
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.title}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          {/* <Form.Item
            className=""
            name="subCategory"
            label="Sub Category"
            rules={[
              { required: true, message: "Please select a sub-category" },
            ]}
          >
            <Select placeholder="Select Sub-Category">
              {subCategories.map((sub) => (
                <Option key={sub._id} value={sub._id}>
                  {sub.title}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item
            name="photo"
            label="Photo"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddBrand;
