import React from 'react';

export default function(Component) {

  return class withUserInfo extends React.Component {

    static async getInitialProps(args, authInfo) {
      /* We pass userInfo as argument in order to have the user information available
        in the "getInitialProps" lifecycle of the child components
      */
      const pageProps = await Component.getInitialProps && await Component.getInitialProps(args, authInfo);
      return { ...pageProps, authInfo };
    }

    render(){
      const { authInfo } = this.props;
      if(!authInfo) return null;
      return <Component {...this.props} />
    }

  }

}
