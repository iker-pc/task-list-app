import React from 'react';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import 'bootstrap/dist/css/bootstrap.min.css';
import rootReducer from '../redux/reducers/root-reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { DEMO_FLAG_NAME } from '../demo/test-env-name';

/** import auth service **/
import auth0 from '../services/auth0';

/** import server actions **/
import { getCategoriesList } from '../actions/categories';
import { getTaskList } from '../actions/task-list';
import { getUserInfo } from '../actions/users';

/** import redux actions **/
import { setCategories } from '../redux/actions/categories-actions';
import { setSelectedTaskListByDate, setTasksLists } from '../redux/actions/tasks-lists-actions';

import Cookies from 'js-cookie';
import { configAxios } from '../actions/axios-config';

const makeStore = (initialState, options) => {
  return createStore(rootReducer, initialState);
}

class TasksListsApplication extends App {

  static async getInitialProps({ Component, router, ctx }) {
    
      let pageProps = {};
      let authInfo = null;
      /*
        If applicaction is set in test mode, we don't have to get authorization info. We also don't have
        to configure axios, as we are not going to make server request. In test mode, all data is stored locally
      */
      if(process.env.APP_ENV !== DEMO_FLAG_NAME){
        authInfo = process.browser
          ? await auth0.clientAuth()
          : await auth0.serverAuth(ctx.req);
        if(authInfo) configAxios(`Bearer ${authInfo.token}`);
      }

      if(process.env.APP_ENV === DEMO_FLAG_NAME || (authInfo && authInfo.token)){
        /*
          When we ask for user info data (getUserInfo), if response is "false" that means that the cookie used to
          authenticate user (jwt) is not valid (due to age or corruption). In that case, we must remove all cookies from
          browser by setting an invalid date in their expiration dates, and then, we should redirect the user to the login page.
          If jwt cookie is still valid we have to ask for the rest of the user data. In test mode the user info will always be
          correct.
        */
        const userInfo = await getUserInfo();
        if(!process.browser && !userInfo) auth0.serverLogout(ctx.res);

        const now = new Date();
        const tasksListsInfo = await getTaskList(now.getMonth() + 1, now.getFullYear());
        const categoriesInfo = await getCategoriesList();

        ctx.store.dispatch(setCategories(categoriesInfo));
        ctx.store.dispatch(setTasksLists(tasksListsInfo));
        ctx.store.dispatch(setSelectedTaskListByDate(now));

        if(Component.getInitialProps) {
          /* We pass userInfo as argument in order to have the user information available
            in the "getInitialProps" lifecycle of the child components
          */
          pageProps = await Component.getInitialProps(ctx, userInfo)
        }

      }

      return { pageProps }
  }

  componentDidMount(){
    const token = Cookies.get("jwt");
    configAxios(`Bearer ${token}`);
  }

  render(){
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
    	   <Component {...pageProps} />
     </Provider>
  )}
}

//withRedux wrapper that passes the store to the App Component
export default withRedux(makeStore)(TasksListsApplication);
