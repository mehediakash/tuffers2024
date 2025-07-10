import React, { useState, useEffect } from "react";
import {
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Upload,
} from "antd";
import axios from "../Components/Axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const AllProduct = () => {
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productProduct, setProductProduct] = useState({});
  const [productVariant, setProductVariant] = useState({});
  const [productOptions, setProductOptions] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [initialVideoUrl, setInitialVideoUrl] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("/varient");
      const formattedData = response.data.data.doc.map((variant, index) => ({
        ...variant,
        key: variant._id,
        index: index + 1,
        title: variant.title,
        category: variant?.category?.title || "N/A",
        subCategory: variant?.subCategory?.title || "N/A",
        photo: variant.photo,
      }));
      setData(formattedData.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category");
      setCategories(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("/subCategory");
      setSubCategories(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/varient/${key}`);
      message.success("Variant deleted successfully");
      setData((prevData) => prevData.filter((item) => item.key !== key));
    } catch (error) {
      message.error("Failed to delete variant");
    }
  };

  const handleEdit = async (record) => {
    try {
      const productResponse = await axios.get(`/product/${record.product._id}`);
      const product = productResponse.data.data.doc;

      const variantResponse = await axios.get(`/varient/${record._id}`);
      const variant = variantResponse.data.data.doc;

      setEditingRecord(record);
      editForm.setFieldsValue({
        title: product.name,
        category: product.category._id,
        subCategory: product.subCategory?._id || null,
        description: product.description,
        videoUrl:
          product.photos.find((photo) => photo.includes("youtube.com")) || "", // Check for existing video URL
        colorName: variant.colorName,
        colorCode: variant.colorCode,
        details: variant.details,
      });

      setProductProduct(product);
      setProductVariant(variant);

      // Separate images from video links
      const imagePreviews = product.photos.filter(
        (photo) => !photo.includes("youtube.com")
      );
      setImagePreviews(imagePreviews);
      setInitialVideoUrl(
        product.photos.find((photo) => photo.includes("youtube.com")) || ""
      ); // Set video URL if available
      setProductOptions(variant.options || []); // Ensure it's an array
      setIsModalVisible(true);
      setFileList([]); // Reset file list for new uploads
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch variant data.");
    }
  };
  const handleDeletePreviewImage = (imageIndex) => {
    setImagePreviews((prevImages) =>
      prevImages.filter((_, index) => index !== imageIndex)
    );
  };

  const handleModalOk = async () => {
    try {
      const values = await editForm.validateFields();
      const formData = new FormData();

      formData.append("name", values.title);
      formData.append("category", values.category);
      formData.append("subCategory", values.subCategory);
      formData.append("description", values.description);

      // Append existing images first
      imagePreviews.forEach((image) => {
        formData.append("photos", image);
      });

      // Append new images
      fileList.forEach((file) => {
        formData.append("photos", file.originFileObj);
      });

      if (values.videoUrl) {
        formData.append("photos", values.videoUrl);
      }
      await axios.patch(`/varient/${productVariant._id}`, {
        colorName: values.colorName,
        colorCode: values.colorCode,
        details: values.details,
      });

      // Ensure values for price, quantity, sku, and size are arrays and have the same length as productOptions
      const updatedOptions = productOptions.map((option, index) => ({
        price: values.price?.[index] || option.price, // Default to existing value
        stock: values.quantity?.[index] || option.stock,
        sku: values.sku?.[index] || option.sku,
        size: values.size?.[index] || option.size,
      }));

      // Update each option
      await Promise.all(
        updatedOptions.map((option, index) => {
          return axios.patch(`/option/${productOptions[index]._id}`, option);
        })
      );

      const productResponse = await axios.patch(
        `/product/${productProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProduct = productResponse.data.data.doc;

      setData((prevData) =>
        prevData.map((item) =>
          item.key === editingRecord._id
            ? {
                ...item,
                ...values,
                category:
                  categories.find((cat) => cat._id === values.category)
                    ?.title || "N/A",
                subCategory:
                  subCategories.find(
                    (subCat) => subCat._id === values.subCategory
                  )?.title || "N/A",
                photo: updatedProduct?.photos,
                videoUrl:
                  updatedProduct?.photos.find((photo) =>
                    photo.includes("youtube.com")
                  ) || "", // Update video URL in table data
              }
            : item
        )
      );

      message.success("Variant updated successfully");
      setEditingRecord(null);
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Failed to update variant", error);
      message.error("Failed to update variant");
    }
  };

  const handleModalCancel = () => {
    setEditingRecord(null);
    setIsModalVisible(false);
  };

  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const columns = [
    {
      title: "#SL",
      dataIndex: "index",
      key: "index",
      fixed: "left",
      width: "5%",
    },
    {
      width: "8%",
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      width: "8%",
      title: "Sub Category",
      dataIndex: "subCategory",
      key: "subCategory",
    },
    {
      width: "10%",
      title: "Title",
      dataIndex: ["product", "name"],
      key: "title",
    },
    {
      width: "15%",
      title: "Stock",
      dataIndex: "options",
      key: "quantity",
      render: (options) => (
        <>
          {options?.map((option, index) => (
            <div key={index}>
              <span>{`Stock: ${option.stock} = Size: (${option.size})`}</span>
            </div>
          ))}
        </>
      ),
    },
    {
      width: "10%",
      title: "Images/Video",
      dataIndex: ["product", "photos"],
      key: "photos",
      render: (photos) => (
        <>
          {photos?.map((url, index) => {
            if (url.includes("youtube.com") || url.includes("youtu.be")) {
              return (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <iframe
                    width="50"
                    height="50"
                    src={url}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`video-${index}`}
                  ></iframe>
                </div>
              );
            } else {
              return (
                <img
                  key={index}
                  src={url}
                  alt={`Image ${index + 1}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    marginBottom: "8px",
                  }}
                />
              );
            }
          })}
        </>
      ),
    },
    {
      width: "5%",
      title: "Size",
      dataIndex: "options",
      key: "size",
      render: (options) => (
        <>
          {options?.map((option, index) => (
            <div key={index}>
              <span>{option.size}</span>
            </div>
          ))}
        </>
      ),
    },
    {
      width: "5%",
      title: "Size",
      dataIndex: "options",
      key: "sku",
      render: (options) => (
        <>
          {options?.map((option, index) => (
            <div key={index}>
              <span>{option.sku}</span>
            </div>
          ))}
        </>
      ),
    },
    {
      width: "5%",
      title: "Color Name", // New column for color name
      dataIndex: "colorName",
      key: "colorName",
      render: (colorName) => <span>{colorName}</span>,
    },
    {
      title: "Price",
      dataIndex: "options",
      key: "price",
      render: (options) => (
        <>
          {Array.isArray(options) &&
            options.map((option, index) => (
              <div key={index}>
                Price:{`${option.price} TK size: (${option.size})`}
              </div>
            ))}
        </>
      ),
    },
    {
      title: "Discount",
      dataIndex: "options",
      key: "discount",
      render: (options) => (
        <>
          {options?.map((option, index) => (
            <div key={index}>
              <span> {option.discountValue}</span>
            </div>
          ))}
        </>
      ),
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "10%",
      render: (_, record) => (
        <div className="flex gap-x-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this variant?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleOptionChange = (index, field, value) => {
    setProductOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = {
        ...updatedOptions[index],
        [field]: value,
      };
      return updatedOptions;
    });
  };

  return (
    <div>
      <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />
      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Submit
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="YouTube Video URL" name="videoUrl">
            <Input />
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Sub Category" name="subCategory">
            <Select>
              {subCategories.map((sub) => (
                <Select.Option key={sub._id} value={sub._id}>
                  {sub.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Details" name="details">
            <ReactQuill />
          </Form.Item>
          <Form.Item label="Color Name" name="colorName">
            <Input />
          </Form.Item>
          <Form.Item label="Color Code" name="colorCode">
            <Input />
          </Form.Item>
          <div>
            <h1 className="text-xl font-bold">Options</h1>
            {productOptions.map((option, index) => (
              <div key={index} className="border-b border-black mb-5 list-item">
                <Form.Item label={`Price for Option ${index + 1}`}>
                  <Input
                    value={option.price}
                    onChange={(e) =>
                      handleOptionChange(index, "price", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label={`Quantity for Option ${index + 1}`}>
                  <Input
                    value={option.stock}
                    onChange={(e) =>
                      handleOptionChange(index, "stock", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label={`SKU for Option ${index + 1}`}>
                  <Input
                    value={option.sku}
                    onChange={(e) =>
                      handleOptionChange(index, "sku", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label={`Size for Option ${index + 1}`}>
                  <Input
                    value={option.size}
                    onChange={(e) =>
                      handleOptionChange(index, "size", e.target.value)
                    }
                  />
                </Form.Item>
              </div>
            ))}
          </div>
          <div>
            <h3>Current Images</h3>
            {imagePreviews.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginRight: 8,
                }}
              >
                <img
                  src={image}
                  alt={`Image ${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeletePreviewImage(index)}
                  style={{ position: "absolute", top: 0, right: 0 }}
                />
              </div>
            ))}
          </div>

          <Form.Item label="Upload New Images">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleImageUpload}
              beforeUpload={() => false} // Prevent automatic upload
              multiple
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllProduct;
