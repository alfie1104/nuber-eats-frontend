import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData, refetch } = useMe();

  const client = useApolloClient();
  const history = useHistory();

  const onCompleted = async (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if (ok && userData?.me.id) {
      //await refetch();
      /*
        [Fragment]
        Fragment를 사용하지 않고 Refetch를 사용하면 Backend에서 데이터를 새로 가져와서 Cache를 업데이트함
        따라서 Fragment를 사용하는게 더 속도가 빠름

        write data to cache directly through 'writeFragment'
        fragment는 type의 일종임
        id를 가지고 cache에 있는 fragment를 찾을 수 있음

        아래 구문은 type이 User인 fragment중 id 가 User:${userData.me.id}인 것을 찾고
        찾은 fragment의 데이터중 verified를 true로 바꾸는 내용임

        (Chrome의 개발자 도구중 Apollo탭에서 cache로 가면 fragment들을 볼 수 있음)
      */
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push("/");
    }
  };

  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);

  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
