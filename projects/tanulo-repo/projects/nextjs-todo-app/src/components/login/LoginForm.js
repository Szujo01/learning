import React, { useState } from "react";

const LoginForm = ({ submitLogin, createNewUser }) => {
  const [isLogin, setIsLogin] = useState(true);

  const changeSignuphandler = () => {
    setIsLogin(false);
  };

  const changeLoginHandler = () => {
    setIsLogin(true);
  };

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const nameChangeHandler = (event) => {
    setNameInput(event.target.value);
  };
  const emailChangeHandler = (event) => {
    setEmailInput(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setPasswordInput(event.target.value);
  };

  const loginHandler = (event) => {
    event.preventDefault();

    let user = {
      email: emailInput,
      password: passwordInput,
    };

    if (!isLogin) {
      user = { ...user, name: nameInput };
      createNewUser(user);
      return;
    }

    submitLogin(user);
  };

  return (
    <>
      <form
        onSubmit={loginHandler}
        className="container sm:w-1/2 mt-40 mx-auto"
      >
        <h1 className="text-center font-semibold text-2xl">
          {isLogin ? "Login" : "Create an Account"}
        </h1>
        <div className=" flex flex-col text-center gap-5  m-5 border border-green-500 rounded-lg shadow p-3 pt-5">
          {!isLogin && (
            <div>
              <label className="mr-3">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={nameInput}
                onChange={nameChangeHandler}
                className="border-2 p-2"
                placeholder="e.g. John Doe"
                required
              />
            </div>
          )}
          <div>
            <label className="mr-3">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={emailInput}
              onChange={emailChangeHandler}
              className="border-2 p-2"
              placeholder="e.g. john@email.com"
              required
            />
          </div>
          <div>
            <label className="mr-3">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={7}
              value={passwordInput}
              onChange={passwordChangeHandler}
              className="border-2 p-2"
              required
            />
          </div>
          <button className="mx-auto w-1/3 rounded border-2 bg-lime-500 text-white hover:text-slate-700 hover:font-semibold hover:scale-110 transition ease-out duration-300">
            {isLogin ? "Login" : "Register"}
          </button>
          {isLogin && (
            <p
              onClick={changeSignuphandler}
              className="cursor-pointer hover:underline"
            >
              Click here to register a new account
            </p>
          )}
          {!isLogin && (
            <p
              onClick={changeLoginHandler}
              className="cursor-pointer hover:underline"
            >
              Click here if you have an existing account
            </p>
          )}
        </div>
      </form>
    </>
  );
};

export default LoginForm;
