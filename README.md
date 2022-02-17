# Task List Web Application

This is a simple app that i built to manage my personal tasks. The proyect is abandoned, so the server that was used to persist information between sessions is currently down. However, the project comes with a demo mode that can be used to test the application.

#### App Features
- Create Tasks and subtaks to be completed in a seletected period of time.
- Navigate easily through tasks and subtasks just with the keyboard.
- Assign categories to your task.

## Demo mode

First of all you need to install the dependecies of the project, in order make it work. To do that you should execute the following command on the source directory of the project (where package.json file is placed).
```
npm install
```
Next, to test the application, simply run 
```
npm run demo
```
This will start a development server on port 3000 where you can test the application. 

NOTE: App state will be lost when the page is reloaded.

Last successful execution was performed with nodejs version 4.15.4 and npm version 6.14.10.
 
## Tech stack

Some of the frameworks/libraries that have been used to build the application are:

| Library/Framework | Description | version |
| ------ | ------ | ------ |
| [Nextjs] | The React Framework used to build the app. | 9.1.3 |
| [axios] | An isomorphic (it can run in the browser and in nodejs) promise based HTTP client. | 0.19.0 |
| [reactstrap] | A react component library for Bootstrap. | 8.4.1 |
| [redux] | A predictable state container for JS Apps. | 4.0.5 |
| [auth0-js] | Client Side JavaScript toolkit for Auth0 API. | 9.13.1 |
| [jsonwebtoken] | Library used to manage JSON Web Token (used for authentication purposes) | 8.5.1 |
| [js-cookie] | JavaScript library to manage cookies.  | 2.2.1 |


[Nextjs]: <https://nextjs.org>
[axios]: <https://axios-http.com>
[reactstrap]: <https://reactstrap.github.io>
[redux]: <https://redux.js.org>
[auth0-js]: <https://auth0.github.io/auth0.js/index.html>
[jsonwebtoken]: <https://www.npmjs.com/package/jsonwebtoken>
[js-cookie]: <https://github.com/js-cookie/js-cookie>

  
