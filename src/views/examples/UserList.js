import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  CardBody,
  FormGroup,
  Form,
  Input,
  Modal,
  Col,
} from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Header from "components/Headers/Header.js";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [dataView, setDataView] = useState();

  const addFormik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required field"),

      email: Yup.string()
        .email("Invalid email format")
        .required("Required field"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required field"),
    }),
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      handleAddUser(values)
        .then((res) => {
          setIsOpenAddModal(!isOpenAddModal);
          getAllUser();
          resetForm();
        })
        .catch((error) => {
          setSubmitting(false);
          setStatus(error.response.data.message);
        });
    },
  });

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = () => {
    axios
      .get(`https://localhost:44366/Users`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const persons = res.data;
        setUsers(persons);
      })
      .catch((error) => console.log(error));
  };

  const showConfirmOnDelete = (e, id) => {
    e.preventDefault();
    confirmAlert({
      title: "Xác nhận!",
      message: "Bạn có chắc chắn muốn xóa?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteUser(id),
        },
        {
          label: "No",
          onClick: () => e.preventDefault(),
        },
      ],
    });
  };

  const handleGetUserById = (e, id) => {
    setIsOpenViewModal(!isOpenViewModal);
    e.preventDefault();
    axios
      .get(`https://localhost:44366/Users/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const data = res.data;
        setDataView({ ...dataView, data });
      })
      .catch((error) => console.log(error));
  };

  const handleAddUser = (payload) => {
    return axios.post(
      `https://localhost:44366/Users/registerAdmin
    `,
      payload,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  };

  const handleDeleteUser = (id) => {
    return axios
      .delete(`https://localhost:44366/Users/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        getAllUser();
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="display-flex border-0">
                <h3 className="mb-0">Quản lý nhân viên</h3>
                <button
                  onClick={() => setIsOpenAddModal(!isOpenAddModal)}
                  className="btn btn-primary"
                  type="button"
                >
                  <div>
                    <i className="ni ni-fat-add" />
                    <span>Thêm</span>
                  </div>
                </button>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Tên đăng nhập</th>
                    <th scope="col">Email</th>
                    <th scope="col">Địa chỉ</th>
                    <th scope="col">Quyền truy cập</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    return (
                      <tr>
                        <th scope="row">
                          <Media className="align-items-center">
                            {user.id}
                          </Media>
                        </th>
                        <th scope="row">
                          <Media className="avatar rounded-circle mr-3 align-items-center">
                            <img
                              alt="..."
                              width={"50%"}
                              src={
                                require("../../assets/img/theme/bootstrap.jpg")
                                  .default
                              }
                            />
                          </Media>
                        </th>
                        <th scope="row">
                          <Media>
                            <span className="mb-0 text-sm">
                              {user.username}
                            </span>
                          </Media>
                        </th>
                        <td>{user.email}</td>
                        <td>{user.address}</td>
                        <td>{user.role}</td>

                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => handleGetUserById(e, user.id)}
                              >
                                Xem Chi Tiết
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={(e) => showConfirmOnDelete(e, user.id)}
                              >
                                Xóa
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
          {isOpenAddModal && (
            <Modal
              className="modal-dialog-centered"
              size="md"
              backdrop="static"
              isOpen={isOpenAddModal}
              toggle={() => setIsOpenAddModal(!isOpenAddModal)}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-transparent pb-5">
                    <div className="text-muted text-center mt-2 mb-3">
                      <big>Thêm nhân viên</big>
                    </div>
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <Form onSubmit={addFormik.handleSubmit} role="form">
                      <FormGroup className="mb-3">
                        <Input
                          name="username"
                          value={addFormik.values.username}
                          onChange={addFormik.handleChange}
                          placeholder="Tên đăng nhập"
                          type="text"
                        />
                        {addFormik.errors.username &&
                          addFormik.touched.username && (
                            <p style={{ color: "red" }}>
                              {addFormik.errors.username}
                            </p>
                          )}
                      </FormGroup>
                      <FormGroup>
                        <Input
                          name="email"
                          value={addFormik.values.email}
                          onChange={addFormik.handleChange}
                          placeholder="Email"
                          type="text"
                        />
                        {addFormik.errors.email && addFormik.touched.email && (
                          <p style={{ color: "red" }}>
                            {addFormik.errors.email}
                          </p>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Input
                          name="password"
                          value={addFormik.values.password}
                          onChange={addFormik.handleChange}
                          placeholder="Mật khẩu"
                          type="password"
                        />
                        {addFormik.errors.password &&
                          addFormik.touched.password && (
                            <p style={{ color: "red" }}>
                              {addFormik.errors.password}
                            </p>
                          )}
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          disabled={isOpenAddModal && addFormik.isSubmitting}
                          className="my-4"
                          color="primary"
                          type="submit"
                        >
                          Đồng ý
                        </Button>
                        <Button
                          onClick={() => setIsOpenAddModal(!isOpenAddModal)}
                          className="my-4"
                          color="primary"
                          type="button"
                        >
                          Hủy bỏ
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
          )}

          {/* Modal View*/}
          <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={isOpenViewModal}
            toggle={() => setIsOpenViewModal(!isOpenViewModal)}
          >
            <Container>
              <Row>
                <Col lg="4">
                  <Card
                    style={{
                      marginTop: "90px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Row className="justify-content-center">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a href="#pablo">
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={
                                require("../../assets/img/theme/team-4-800x800.jpg")
                                  .default
                              }
                            />
                          </a>
                        </div>
                      </Col>
                    </Row>
                    <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                      <div className="d-flex justify-content-between"></div>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <Row className="justify-content">
                        <div
                          style={{
                            marginTop: "90px",
                          }}
                          className="text-center"
                        >
                          <h3>{dataView ? dataView.data.username : ""}</h3>
                          <div className="h3 font-weight-500">
                            {dataView ? dataView.data.role : ""}
                          </div>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="8">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent pb-5">
                      <div className="text-muted text-center mt-2 mb-3">
                        <big>Thông tin nhân viên</big>
                      </div>
                    </CardHeader>
                  </Card>
                  <div className="modal-body p-0">
                    <Card className="bg-secondary shadow border-0">
                      <CardBody className="px-lg-5 py-lg-5">
                        <Form role="form">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email:
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              value={dataView ? dataView.data.email : ""}
                              readOnly
                              type="text"
                            />
                          </FormGroup>
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address:
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-address"
                              value={dataView ? dataView.data.address : ""}
                              readOnly
                              type="text"
                            />
                          </FormGroup>
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-birthday"
                            >
                              Birthday:
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-birthday"
                              value={dataView ? dataView.data.birthdate : ""}
                              readOnly
                              type="text"
                            />
                          </FormGroup>
                          <div className="text-center">
                            <Button
                              onClick={() =>
                                setIsOpenViewModal(!isOpenViewModal)
                              }
                              className="my-4"
                              color="primary"
                              type="button"
                            >
                              Thoát
                            </Button>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Container>
          </Modal>
        </Row>
      </Container>
    </>
  );
};

export default UserList;
