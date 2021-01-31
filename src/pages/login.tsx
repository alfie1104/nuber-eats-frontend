import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";

interface ILoginForm {
  email: string;
  password: string;
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
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    watch,
  } = useForm<ILoginForm>();

  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;

    if (ok) {
      console.log(token);
    }
  };

  const [
    loginMutation,
    { loading, error, data: loginMutationResult },
  ] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
    onCompleted,
  });
  /*
  //뮤테이션 선언 시 변수를 설정할 수도 있음. (watch는 react-hook-form에 있는 함수로, 변수의 변화가 발생할 때 알려줌)
  const [loginMutation, { loading, error, data }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    variables: {
      loginInput: {
        email: watch("email"),
        password: watch("password"),
      },
    },
  });
*/
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();

      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
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
            {loading ? "Loading..." : "Log in"}
          </button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
