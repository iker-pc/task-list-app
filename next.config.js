// Necessary to work with bootstrap
const withCSS = require('@zeit/next-css')

//Environmental variables
const prod = process.env.NODE_ENV === 'production';
const baseLocalPath = 'http://localhost';
const localFrontEndAppPort = 3000;
const localMsPorts = {
  taskMs: 8082,
  authMs: 8083,
}

/* To use some ms in locally and others in productcion, just modify this file.
It is posible to create a custom "env" object with the desired configuration
*/

module.exports = withCSS({
  env: {
    APP_ENV: process.env.APP_ENV,
    baseUrl: (prod) ? 'https://tasks-lists-app.herokuapp.com' : `${baseLocalPath}:${localFrontEndAppPort}`,
    ms: {
      tasks: {
        path: (prod) ? 'https://tasks-lists-app-tasks-ms.herokuapp.com/' : `${baseLocalPath}:${localMsPorts.taskMs}`,
      },
      auth: {
        path: (prod) ? 'https://tasks-lists-app-auth-ms.herokuapp.com' : `${baseLocalPath}:${localMsPorts.authMs}`,
      }
    }
  }
})
