import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Select,
  Form,
  Button,
  message,
  Upload,
  Checkbox,
} from "antd";
import { CiCirclePlus } from "react-icons/ci";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "../Components/Axios";
import { ImCancelCircle } from "react-icons/im";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const UploadProduct = () => {
  const [brandForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [variantFileList, setVariantFileList] = useState([]);
  const [brandFileList, setBrandFileList] = useState([]);
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
  }, []);

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

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/brand");
      console.log(response);
      setBrands(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleImagePreview = (file) => {
    if (file && file.originFileObj) {
      // Check if the file is valid
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file.originFileObj); // Use originFileObj for the correct file object
    }
  };

  const brandUploadProps = {
    fileList: brandFileList,
    onRemove: (file) => {
      setBrandFileList((prevList) => {
        const index = prevList.indexOf(file);
        const newFileList = prevList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      setBrandFileList([file]);
      return false;
    },
  };

  // Handle adding a new variant
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { colorName: "", colorCode: "", details: "", options: [] },
    ]);
  };

  // Handle adding a new option to a specific variant
  const handleAddOption = (variantIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push({
      sku: "",
      size: "",
      price: "",
      stock: "",
    });
    setVariants(newVariants);
  };

  const handleVariantSubmit = async (values) => {
    if (variantFileList.length === 0) {
      message.error("Please upload at least one variant image!");
      return;
    }

    if(values.videoUrl){
      formData.append("videoUrl", values.videoUrl);
    }

    const formData = new FormData();
    formData.append("name", values.name);
    

    formData.append("category", values.category);
    formData.append("subCategory", values.subCategory);
    formData.append("brand", values.brand);
    formData.append("description", values.description);
    variantFileList.forEach((file) => {
      formData.append("photos", file);
    });

    setLoading(true);
    try {
      const response = await axios.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const productId = response.data.data.product._id;

      // Create variants
      for (const variant of variants) {
        const variantResponse = await axios.post("/varient", {
          colorName: variant.colorName,
          colorCode: variant.colorCode,
          details: variant.details,
          product: productId,
          category: values.category,
          subCategory: values.subCategory,
          brand: values.brand,
        });

        // Create options linked to the correct variant ID
        for (const option of variant.options) {
          await axios.post("/option", {
            ...option,
            product: productId,
            variant: variantResponse.data.data.variant._id,
            category: values.category,
            subCategory: values.subCategory,
            brand: values.brand,
            freeShipping: values.freeShipping,
          });
        }
      }

      message.success("Product created successfully");
      productForm.resetFields();
      setVariantFileList([]);
      setVariants([]);
      setDescription("");
      setImagePreviews([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Error creating product:", error.response || error.message);
      message.error("Something went wrong, Try again!");
    } finally {
      setLoading(false);
    }
  };

  const variantUploadProps = {
    fileList: variantFileList,
    multiple: true,
    onRemove: (file) => {
      const index = variantFileList.indexOf(file); // Get the index of the file
      if (index !== -1) {
        // Remove the file from the file list
        setVariantFileList((prevList) => {
          const newFileList = [...prevList];
          newFileList.splice(index, 1);
          return newFileList;
        });

        // Remove the corresponding preview from imagePreviewUrls
        setImagePreviewUrls((prevPreviews) => {
          const newPreviews = [...prevPreviews];
          newPreviews.splice(index, 1); // Remove the preview at the same index
          return newPreviews;
        });
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file!`);
        return Upload.LIST_IGNORE;
      }
      // Add the file to the file list
      setVariantFileList((prevList) => [...prevList, file]);
      handleImagePreview({ originFileObj: file }); // Call preview handler for image preview
      return false;
    },
  };

  const handleBrandSubmit = async (values) => {
    if (brandFileList.length === 0) {
      message.error("Please upload a brand image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("subCategory", values.subCategory);
    formData.append("photo", brandFileList[0]);

    try {
      await axios.post("/brand", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Brand created successfully");
      brandForm.resetFields();
      setBrandFileList([]);
      fetchBrands(); // Refresh the brand list
    } catch (error) {
      message.error("Failed to create brand");
    }
  };

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10 uppercase underline">
        Upload Products
      </h2>

      <Card title="Add Product" bordered={false} className="max-w-6xl mx-auto">
        <Form form={productForm} onFinish={handleVariantSubmit}>
          {/* Product form fields here */}
          <Form.Item
            label="Title"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the product title!",
              },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item label="Product Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="video Url" name="videoUrl" className="mt-10">
            <Input />
          </Form.Item>

          <Form.Item
  className="mt-14"
  label="Select Category"
  name="category"
  rules={[{ required: true, message: "Please select a category!" }]}
>
  <Select
    style={{ width: "100%" }}
    options={categories.map((category) => ({
      label: category.title,
      value: category._id,
    }))}
    onChange={(value) => {
      setSelectedCategoryId(value);
      productForm.setFieldsValue({ subCategory: undefined }); // reset subCategory when category changes
    }}
  />
</Form.Item>

<Form.Item
  label="Sub Category"
  name="subCategory"
  rules={[
    { required: true, message: "Please select a sub-category!" },
  ]}
>
  <Select
    style={{ width: "100%" }}
    options={subCategories?.filter((subCategory) => subCategory?.category === selectedCategoryId)
      .map((subCategory) => ({
        label: subCategory?.title,
        value: subCategory?._id,
      }))}
  />
</Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Please select a brand!" }]}
          >
            <Select
              style={{ width: "100%" }}
              options={brands.map((brand) => ({
                label: brand.title,
                value: brand._id,
              }))}
            />
          </Form.Item>
          <Form.Item name="freeShipping" valuePropName="checked">
            <Checkbox>Free Shipping</Checkbox>
          </Form.Item>

          {/* Add Variant */}
          <div className="border p-3 rounded-md">
            <h2 className="mb-3 font-medium ">Variants</h2>
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="border-b border-[black] mb-5">
                <ImCancelCircle
                  size={20}
                  className="text-red-600 ml-auto my-2 cursor-pointer"
                  onClick={() => {
                    setVariants(variants.filter((_, i) => i !== variantIndex));
                  }}
                />
                <Form.Item label="Color Name">
                  <Input
                    value={variant.colorName}
                    onChange={(e) => {
                      const newVariants = [...variants];
                      newVariants[variantIndex].colorName = e.target.value;
                      setVariants(newVariants);
                    }}
                  />
                </Form.Item>
                <Form.Item label="Color Code">
                  <Input
                    value={variant.colorCode}
                    onChange={(e) => {
                      const newVariants = [...variants];
                      newVariants[variantIndex].colorCode = e.target.value;
                      setVariants(newVariants);
                    }}
                  />
                </Form.Item>
                <Form.Item label="Details">
                  <ReactQuill
                    value={variant.details}
                    onChange={(newContent) => {
                      const newVariants = [...variants];
                      newVariants[variantIndex].details = newContent;
                      setVariants(newVariants);
                    }}
                  />
                </Form.Item>
                {/* Add Options */}
                <div className="mt-3 ml-10">
                  <h3 className="font-medium">Options</h3>
                  {variant.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="border-b border-[black] mb-5 optionse"
                    >
                      <ImCancelCircle
                        size={20}
                        className="text-red-600 ml-auto my-2 cursor-pointer"
                        onClick={() => {
                          const newVariants = [...variants];
                          newVariants[variantIndex].options = newVariants[
                            variantIndex
                          ].options.filter((_, i) => i !== optionIndex);
                          setVariants(newVariants);
                        }}
                      />
                      <Form.Item label="SKU">
                        <Input
                          value={option.sku}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].options[optionIndex].sku =
                              e.target.value;
                            setVariants(newVariants);
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Size">
                        <Input
                          value={option.size}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].options[
                              optionIndex
                            ].size = e.target.value;
                            setVariants(newVariants);
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Price">
                        <Input
                          value={option.price}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].options[
                              optionIndex
                            ].price = e.target.value;
                            setVariants(newVariants);
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Stock">
                        <Input
                          value={option.stock}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].options[
                              optionIndex
                            ].stock = e.target.value;
                            setVariants(newVariants);
                          }}
                        />
                      </Form.Item>
                    </div>
                  ))}
                  <div
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded-md p-1 mb-2"
                    onClick={() => handleAddOption(variantIndex)}
                  >
                    <CiCirclePlus size={20} className="text-green-500" />
                    <span>Add Option</span>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-200 rounded-md p-1 mb-10"
              onClick={handleAddVariant}
            >
              <CiCirclePlus size={20} className="text-green-500" />
              <span>Add Variant</span>
            </div>
          </div>

          <Dragger {...variantUploadProps} onChange={handleImagePreview}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Dragger>

          <div className="flex gap-x-5 justify-center">
            {/* i want to show here preview image  */}

            {imagePreviewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Preview"
                className="w-[150px] h-[150px] object-cover rounded-md shadow-lg"
              />
            ))}
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              className="mt-10"
            >
              {loading ? <LoadingOutlined /> : "Upload Product"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default UploadProduct;
