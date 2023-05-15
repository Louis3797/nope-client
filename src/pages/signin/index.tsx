import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { NextPage } from "next";
import { Button } from "react-daisyui";
import { SERVER_URL } from "@/constant";
import { data } from "autoprefixer";
import axios from "axios";
import router from "next/router";
import { useAuth } from "@/hook/useAuth";

interface FormValues {
  username: string;
  password: string;
}

const SignIn: NextPage = () => {
  const { signIn } = useAuth();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const initialValues: FormValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required").min(2),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Your password is to long")
      .required("Required"),
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);

    const { username, password } = values;

    try {
      const response = await signIn(username, password);
      console.log(response);
      if (response?.token) {
        sessionStorage.setItem("access_token", response.token);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }

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
            <h1 className="mb-6 text-3xl">Sign In</h1>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2">
                Username
              </label>
              <Field
                id="username"
                name="username"
                type="username"
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
              <Button
                type="submit"
                color="primary"
                size="md"
                animation
                loading={submitting}
                className="w-full max-w-lg"
              >
                {submitting ? "Submitting" : "Sign In"}
              </Button>
            </div>
            <div className="text-center">
              <span className="mr-1">Dont have an account?</span>
              <Link href="/signup" legacyBehavior>
                <a className="text-blue-500 hover:text-blue-800">Sign up</a>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
