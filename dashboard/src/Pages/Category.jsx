import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Form,
  Popconfirm,
  Table,
  Modal,
  message,
} from "antd";
import axios from "../Components/Axios"; // Ensure this import points to your Axios instance
import { format } from "date-fns";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingInlineEnd: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const AddCategory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [newSubCategoryTitle, setNewSubCategoryTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const categoryRes = await axios.get("/category");
      const subCategoryRes = await axios.get("/subCategory");

      const mergedData = categoryRes?.data.data.doc?.map((category, index) => {
        const subCategories = subCategoryRes?.data?.data?.doc.filter(
          (sub) => sub.category === category._id
        );

        return {
          key: category._id,
          index: index + 1,
          category: category.title,
          subCategories: subCategories.map((sub) => ({
            key: sub._id,
            title: sub.title,
          })),
          totalProducts: subCategories.reduce(
            (total, sub) => total + sub?.products?.length,
            0
          ),

          subCategoryCount: subCategories?.length,

          date: format(category.updatedAt, "dd-MM-yyyy"),
        };
      });

      setDataSource(mergedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/category/${key}`);
      setDataSource(dataSource.filter((item) => item.key !== key));
    } catch (error) {
      fetchData();
      console.error("Failed to delete category:", error);
    }
  };

  const handleSubCategoryDelete = async (subKey) => {
    try {
      await axios.delete(`/subCategory/${subKey}`);
      fetchData();
      message.success("SubCategory deleted successfully.");
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
      message.error("Failed to delete subcategory.");
    }
  };

  const handleSubCategoryEdit = (subCategory) => {
    setCurrentSubCategory(subCategory);
    setNewSubCategoryTitle(subCategory.title);
    setIsModalVisible(true);
  };

  const handleSubCategorySave = async () => {
    if (currentSubCategory) {
      try {
        await axios.patch(`/subCategory/${currentSubCategory.key}`, {
          title: newSubCategoryTitle,
        });
        setIsModalVisible(false);
        setCurrentSubCategory(null);
        fetchData(); // Refresh data
        message.success("Subcategory updated successfully");
      } catch (error) {
        console.error("Failed to save subcategory changes:", error);
        message.error("Failed to update subcategory");
      }
    }
  };

  const handleSave = async (row) => {
    try {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);

        const updatedCategory = {
          title: row.category,
        };

        await axios.patch(`/category/${row.key}`, updatedCategory);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const defaultColumns = [
    {
      title: "SL",
      dataIndex: "index",
      width: "5%",
    },
    {
      title: "Category Name",
      dataIndex: "category",
      width: "20%",
      editable: true,
    },
    {
      title: "SubCategory Names",
      dataIndex: "subCategories",
      width: "30%",
      render: (subCategories) => (
        <>
          {subCategories.length > 0
            ? subCategories.map((sub) => (
                <div
                  key={sub.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSubCategoryEdit(sub)}
                  >
                    {sub.title}
                  </span>
                  <Popconfirm
                    title="Are you sure to delete this subcategory?"
                    onConfirm={() => handleSubCategoryDelete(sub.key)}
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              ))
            : "No SubCategory"}
        </>
      ),
    },
    {
      title: "SubCategory Count",
      dataIndex: "subCategoryCount",
      width: "10%",
    },
    {
      title: "Date",

      dataIndex: "date",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      width: "10%",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const onFinish = async (value) => {
    const CategoryTitle = value.user.Category.title;
    const SubCategoryTitle = value.user.Category.subtitle;
    console.log(value);

    try {
      const existingCategoryRes = await axios.get("/category", {
        params: { title: CategoryTitle },
      });

      let categoryId;
      if (
        existingCategoryRes.data.data.doc &&
        existingCategoryRes.data.data.doc.length > 0
      ) {
        categoryId = existingCategoryRes.data.data.doc[0]._id;
      } else {
        const newCategoryRes = await axios.post("/category", {
          title: CategoryTitle,
        });
        categoryId = newCategoryRes.data.data.doc._id;
      }

      await axios.post("/subCategory", {
        title: SubCategoryTitle,
        category: categoryId,
      });

      fetchData();
    } catch (error) {
      console.error("Failed to add category and subcategory:", error);
    }
  };

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-lg mb-4 mt-10">
        Add Category
      </h2>
      <Form name="basic" layout="vertical" onFinish={onFinish}>
        <Row gutter={[12, 0]}>
          <Col md={8} xs={24}>
            <Form.Item
              label="Category Name"
              name={["user", "Category", "title"]}
              rules={[
                {
                  required: true,
                  message: "Category name is required",
                },
              ]}
            >
              <Input placeholder="Enter category" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              label="SubCategory Name"
              name={["user", "Category", "subtitle"]}
              rules={[
                {
                  required: true,
                  message: "SubCategory name is required",
                },
              ]}
            >
              <Input placeholder="Enter SubCategory" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 text-white mt-8 w-full"
            >
              Add Category
            </Button>
          </Col>
        </Row>
      </Form>

      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{
          defaultPageSize: 6,
        }}
      />

      <Modal
        title="Edit SubCategory"
        visible={isModalVisible}
        onOk={handleSubCategorySave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={newSubCategoryTitle}
          onChange={(e) => setNewSubCategoryTitle(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default AddCategory;
