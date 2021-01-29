import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";

interface ILoginForm {
  email?: string;
  password?: string;
}

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);

  const onSubmit = () => {
    const { email, password } = getValues();

    loginMutation({
      variables: {
        email,
        password,
      },
    });
  };
  /*
      handleSubmit은 form 입력값들이 유효할 경우 첫번째 인자로 전달받은 함수를
      유효하지 않을 경우 두번째 인자로 전달받은 함수를 호출함
    */

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 mt-5 px-5"
        >
          <input
            ref={register({ required: "Email is required" })}
            placeholder="Email"
            required
            type="email"
            name="email"
            className=" bg-gray-100 shadow-inner   border-2 focus:border-opacity-60 focus:border-green-600 focus:outline-none mb-3 py-3 px-5 rounded-lg"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email.message} />
          )}
          <input
            ref={register({ required: "Password is required", minLength: 10 })}
            placeholder="Password"
            required
            type="password"
            name="password"
            className=" bg-gray-100 shadow-inner focus:outline-none border-2 focus:border-opacity-60 focus:border-green-600  py-3 px-5 rounded-lg"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage={"Password must be more than 10 chars."} />
          )}
          <button className="py-3 px-5 bg-gray-800 text-white mt-3 text-lg rounded-lg focus:outline-none hover:opacity-90">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};
