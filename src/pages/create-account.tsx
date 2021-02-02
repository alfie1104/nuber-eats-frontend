import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { UserRole } from "../__generated__/globalTypes";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    watch,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });

  console.log(watch());

  const onCompleted = () => {};

  const [
    createAccoutMutation,
    { loading, error, data: createAccoutMutationResult },
  ] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {};

  return (
    <div className="h-screen flex items-center flex-col  mt-10 lg:mt-28">
      <Helmet>
        <title>Creact Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-5" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">
          Let's get started
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
          <select
            name="role"
            ref={register({ required: true })}
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Create Account"
          />
          {createAccoutMutationResult?.login.error && (
            <FormError errorMessage={createAccoutMutationResult.login.error} />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/login" className="text-lime-600 hover:underline">
            Login now
          </Link>
        </div>
      </div>
    </div>
  );
};
