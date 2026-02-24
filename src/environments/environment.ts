export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'CineQ',
  version: '1.0.0',
  api: {
    baseUrl: 'http://localhost:3000/api'
  },
  auth: {
    // Token is now stored in HttpOnly cookie - only user data cached locally
    userKey: 'cineq_user'
  },
  googleClientId : '819220598893-hsj45m1ffsv3q9onjuaq1g031k489m2s.apps.googleusercontent.com'
};
