import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolCustomizeData = {
  UserPoolId: "us-east-1_sAHHyV6iF",
  ClientId: "1njm148s0sgs095boc7u5rvgt6",
};

const cognitoUserPool = new CognitoUserPool(poolCustomizeData);

export default cognitoUserPool;
