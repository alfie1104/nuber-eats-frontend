import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;
interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData, refetch: refreshUser } = useMe();
  const client = useApolloClient();

  const onCompleted = async (data: editProfile) => {
    const {
      editProfile: { error, ok },
    } = data;

    if (ok && userData) {
      //await refreshUser();
      //속도를 위해 Refetch대신 Fragment 사용하였음
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();

      if (prevEmail !== newEmail) {
        //update the cache
        /*
        write data to cache directly through 'writeFragment'
        fragment는 type의 일종임
        id를 가지고 cache에 있는 fragment를 찾을 수 있음

        아래 구문은 type이 User인 fragment중 id 가 User:${userData.me.id}인 것을 찾고
        찾은 fragment의 데이터중 email을 바꾸는 내용임

        (Chrome의 개발자 도구중 Apollo탭에서 cache로 가면 fragment들을 볼 수 있음)
      */
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            verified: false,
            email: newEmail,
          },
        });
      }
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();

    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          ref={register({
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          name="email"
          type="email"
          placeholder="Email"
        />
        <input
          ref={register()}
          className="input"
          name="password"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
