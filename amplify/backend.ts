import { defineBackend } from '@aws-amplify/backend';
import { Passwordless } from 'amazon-cognito-passwordless-auth/cdk';
import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';

const FRONTEND_URL = process.env.NEXT_FRONTEND_URL ?? "http://localhost:3000";
const FRONTEND_HOST = process.env.NEXT_FRONTEND_HOST ?? "localhost";

const backend = defineBackend({
  auth,
  data,
});

const userPool = backend.auth.resources.userPool as cdk.aws_cognito.UserPool;
const userPoolClient = backend.auth.resources.userPoolClient as cdk.aws_cognito.UserPoolClient;
const authStack = Stack.of(userPool);

const passwordless = new Passwordless(authStack, "ZenigamePasskeyAuth", {
  userPool,
  userPoolClients: [userPoolClient],
  allowedOrigins: [
    FRONTEND_URL!
  ],
  fido2: {
    allowedRelyingPartyIds: [
      FRONTEND_HOST!
    ],
  },
});

backend.addOutput({
  custom: {
    fido2ApiUrl: passwordless.fido2Api?.url ?? "",
  },
});