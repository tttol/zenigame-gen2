import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Detail: a
    .model({
      id: a.id(),
      name: a.string(),
      price: a.integer(),
      label: a.string(),
      paidByUserA: a.boolean(),
      paidByUserB: a.boolean(),
      paidAt: a.string(),
    })
    .authorization(allow => [allow.group('family')]),

  Label: a
    .model({
      id: a.id(),
      name: a.string().required(),
    })
    .authorization(allow => [allow.group('family')]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
