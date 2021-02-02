import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
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
    formState,
  } = useForm<ILoginForm>({
    mode: "onChange",
  });

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
    <div className="h-screen flex items-center flex-col  mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-5" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 mt-5 w-full mb-5"
        >
          <input
            ref={register({ required: "Email is required" })}
            placeholder="Email"
            required
            type="email"
            name="email"
            className="input"
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
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage={"Password must be more than 10 chars."} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Log in"
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Nuber?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
