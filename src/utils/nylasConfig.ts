export const nylasConfig = {
  apiKey: process.env.NYLAS_API_KEY!,
  apiUri: process.env.NYLAS_API_URI!,
  redirectUri: process.env.BASE_URL + "/api/oauth" + "/exchange",
  clientId: process.env.NYLAS_CLIENT_ID!,
};
