import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { Button } from "react-daisyui";
import { NextPage } from "next";
import axios from "axios";
import { SERVER_URL } from "@/constant";
import { useRouter } from "next/router";
import { useAuth } from "@/hook/useAuth";

interface FormValues {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
}

const SignUp: NextPage = () => {
  const { signUp } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const initialValues: FormValues = {
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Required")
      .min(2, "Username must be at least 2 characters")
      .max(30, "Your Username is to long"),
    firstname: Yup.string().required("Required").min(2),
    lastname: Yup.string().required("Required").min(2),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Your password is to long")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);

    const { username, firstname, lastname, password } = values;

    try {
      const response = await signUp(username, firstname, lastname, password);

      if (response) {
        router.push("/signin");
      } else {
        console.error("Error on sign up");
      }
    } catch (error) {
      console.error(error);
    }

    // Here you can make a request to your backend API to create a new user
    // Once the user is created, you can redirect them to another page

    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="w-full max-w-md">
            <h1 className="mb-6 text-3xl">Sign Up</h1>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2">
                Username
              </label>
              <Field
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                className={`input w-full max-w-lg ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="username"
                component="div"
                className="mt-2 text-red-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="firstname" className="block mb-2">
                Firstname
              </label>
              <Field
                id="firstname"
                name="firstname"
                type="firstname"
                placeholder="Enter your firstname"
                className={`input w-full max-w-lg ${
                  formik.touched.firstname && formik.errors.firstname
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="firstname"
                component="div"
                className="mt-2 text-red-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastname" className="block mb-2">
                Lastname
              </label>
              <Field
                id="lastname"
                name="lastname"
                type="lastname"
                placeholder="Enter your lastname"
                className={`input w-full max-w-lg ${
                  formik.touched.lastname && formik.errors.lastname
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="lastname"
                component="div"
                className="mt-2 text-red-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className={`input w-full max-w-lg ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              <ErrorMessage
                name="password"
                component="div"
                className="mt-2 text-red-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2">
                Confirm Password
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className={`input w-full max-w-lg ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="mt-2 text-red-500"
              />
            </div>
            <div className="mb-4">
              <Button
                type="submit"
                color="primary"
                size="md"
                animation
                loading={submitting}
                className="w-full max-w-lg"
              >
                {submitting ? "Submitting" : "Sign Up"}
              </Button>
            </div>
            <p>
              Already have an account?{" "}
              <Link href="/signin" legacyBehavior>
                <a className="text-blue-500">Sign In</a>
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
