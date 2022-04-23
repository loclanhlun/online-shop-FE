/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email:
        JSON.parse(localStorage.getItem("payload")) === null
          ? ""
          : JSON.parse(localStorage.getItem("payload")).email,
      password:
        JSON.parse(localStorage.getItem("payload")) === null
          ? ""
          : JSON.parse(localStorage.getItem("payload")).password,
      checked: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
    }),
    onSubmit: (values, { setStatus, setSubmitting }) => {
      const payload = {
        email: values.email,
        password: values.password,
      };
      handleLogin(payload)
        .then((response) => {
          if (formik.values.checked === true) {
            const payloads = {
              email: formik.values.email,
              password: formik.values.password,
            };
            localStorage.setItem("payload", JSON.stringify(payloads));
          }
          const person = response.data;
          localStorage.setItem("token", person.token);
          history.push("/admin/dashboard");
        })
        .catch((error) => {
          setSubmitting(false);
          setStatus(error.response.data.message);
        });
    },
  });
  const history = useHistory();
  const handleLogin = (payload) => {
    return axios.post("https://localhost:44366/Users/Authenticate", payload);
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <big>Đăng nhập</big>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form onSubmit={formik.handleSubmit} role="form">
              {formik.status && (
                <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                  <div className="alert-text font-weight-bold">
                    {formik.status}
                  </div>
                </div>
              )}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    type="email"
                  />
                </InputGroup>
                {formik.errors.email && formik.touched.email && (
                  <p style={{ color: "red" }}>{formik.errors.email}</p>
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Mật khẩu"
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
                {formik.errors.password && formik.touched.password && (
                  <p style={{ color: "red" }}>{formik.errors.password}</p>
                )}
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  checked={formik.values.checked}
                  onChange={(e) =>
                    formik.setFieldValue("checked", e.target.checked)
                  }
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button
                  disabled={formik.isSubmitting}
                  className="my-4"
                  color="primary"
                  type="submit"
                >
                  Đăng nhập
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row> */}
      </Col>
    </>
  );
};

export default Login;
