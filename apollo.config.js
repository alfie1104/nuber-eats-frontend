module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};

/*
  apollo는 includes에 있는 파일들 중,
  tagName에 지정된 구문(예: gql``)을 참고하여 graphQL을 위한 type을 생성해줌 (apollo client:codegen명령어)
*/
