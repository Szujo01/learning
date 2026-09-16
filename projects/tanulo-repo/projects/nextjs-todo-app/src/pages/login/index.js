import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import ShowNotification from "@/components/UI/ShowNotification";
import LoginForm from "@/components/login/LoginForm";

const Login = () => {
  const router = useRouter();

  const [loginErrors, setLoginErrors] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoginErrors(null);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [loginErrors]);

  const userSignIn = async (email, password) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result.error) {
      setLoginErrors(result.error);
      return;
    }

    router.replace("/");
  };

  const loginHandler = async (userDetails) => {
    const { email, password } = userDetails;
    await userSignIn(email, password);
  };

  const createUserHandler = async (userDetails) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setLoginErrors("Error: " + data.message);
    }

    await userSignIn(userDetails.email, userDetails.password);
  };

  return (
    <>
      <LoginForm createNewUser={createUserHandler} submitLogin={loginHandler} />
      {loginErrors && <ShowNotification message={loginErrors} isError={true} />}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Login;
