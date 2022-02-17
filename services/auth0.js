import auth0 from 'auth0-js';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { serialize } from 'cookie';

import { DEMO_FLAG_NAME } from '../demo/test-env-name';

class Auth0 {

  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: 'dev-310e2bq6.eu.auth0.com',
      clientID: 'g6NgusEp6z0XWlxnkg7yIKTyMoAOf77t',
      redirectUri: `${process.env.baseUrl}/callback`,
      responseType: 'token id_token',
      scope: 'openid profile'
    });
    this.login = this.login.bind(this);
    this.clientLogout = this.clientLogout.bind(this);
    this.serverLogout = this.serverLogout.bind(this);
    this.handleAuthetication = this.handleAuthetication.bind(this);
  }

  handleAuthetication(){
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if(authResult && authResult.accessToken && authResult.idToken){
          this.setSession(authResult);
          resolve();
        } else if (err){
          reject();
          console.log(err);
        }
      });
    });
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    Cookies.set('user', authResult.idTokenPayload);
    Cookies.set('jwt', authResult.idToken);
    Cookies.set('expiresAt', expiresAt);
    Cookies.set('access_token', authResult.accessToken);
  }

  clientLogout(){
    Cookies.remove('user');
    Cookies.remove('jwt');
    Cookies.remove('expiresAt');
    Cookies.remove('access_token');
    this.auth0.logout({
      returnTo: process.env.baseUrl,
      clientID: 'g6NgusEp6z0XWlxnkg7yIKTyMoAOf77t'
    });
  }

  serverLogout(res){
    res.setHeader('Set-Cookie', [
      serialize('user', '', { maxAge: -1, path: '/', }),
      serialize('jwt', '', { maxAge: -1, path: '/', }),
      serialize('expiresAt', '', { maxAge: -1, path: '/', }),
      serialize('access_token', '', { maxAge: -1, path: '/', }),
    ]);
    res.writeHead(301, { Location: '/', });
    res.end();
  }

  login() {
    if(process.env.APP_ENV === DEMO_FLAG_NAME) {
      window.location = 'tasks-lists';
    } else {
      this.auth0.authorize();
    }
  }

  async getJWKS() {
    const res = await axios.get('https://dev-310e2bq6.eu.auth0.com/.well-known/jwks.json');
    const jwks = res.data;
    return jwks;
  }

  async verifyToken(token){
    if(token){
      const decodedToken = jwt.decode(token, { complete: true });
      if(!decodedToken) return undefined;

      const jwks = await this.getJWKS();
      const jwk = jwks.keys[0];

      //Build certificate
      let cert = jwk.x5c[0];
      cert = cert.match(/.{1,64}/g).join('\n');
      cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;

      if(jwk.kid === decodedToken.header.kid){
        try{
          const verifiedToken = jwt.verify(token, cert);
          const expiresAt = verifiedToken.exp * 1000;
          return (verifiedToken && new Date().getTime() < expiresAt) ? verifiedToken : undefined;
        }catch(err){
          return undefined;
        }
      }
    }
    return undefined;
  }

  async clientAuth(){
    const token = Cookies.getJSON('jwt');
    const accessToken = Cookies.get('access_token');
    const verifiedToken = await this.verifyToken(token);
    return { token }
  }

  async serverAuth(req){
    if(req.headers.cookie){
      const tokenCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));
      const accessTokenCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('access_token='));
      if(!tokenCookie) return undefined;
      const token = tokenCookie.split('=')[1];
      const verifiedToken = await this.verifyToken(token)
      const accessToken = accessTokenCookie.split('=')[1];
      return { token }
    }
    return undefined;
  }

}

const auth0Client = new Auth0();

export default auth0Client;
