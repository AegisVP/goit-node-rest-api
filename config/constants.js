export const constants = {
  jwt: {
    validFor: 60 * 60 * 24 * 7, // 7 days
    salt: 3,
  },
  user: {
    subscription: ['starter', 'pro', 'business'], // must be array
  },
  contacts: {
    defaultLimit: 10,
  },
};
