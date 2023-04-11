import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolCustomizeData = {
  UserPoolId: process.env.REACT_APP_USERPOOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID,
};

const cognitoUserPool = new CognitoUserPool(poolCustomizeData);

export default cognitoUserPool;
