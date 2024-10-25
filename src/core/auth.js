import config from "./companyconfig";
//import jwt from 'vue-jwt-decode';
import {
  REFRESH_TOKEN,
  ACCESS_TOKEN_KEY,
  ACCESS_EXPIRATION
} from "../appConstants";
export default new (class appauth {
  /**
   * Logout the user by clearing both the tokens
   */
  logout() {
    this.clearIdToken();
    this.clearAccessToken();
  }
  /**
   * Get the Access token which is send in params and headers
   */
  getAccessToken() {
    let company_name = config.getCompanyIdfromUrl();
    return localStorage.getItem(ACCESS_TOKEN_KEY + "_" + company_name);
  }
  /**
   * Save the access token, id token with expiration in local storage
   * @param  accessToken
   * @param  refreshToken
   * @param  expiration
   */
  setTokens(accessToken, refreshToken, expiration) {
    let company_name = config.getCompanyIdfromUrl();
    localStorage.setItem(ACCESS_TOKEN_KEY + "_" + company_name, accessToken);
    localStorage.setItem(REFRESH_TOKEN + "_" + company_name, refreshToken);
    //if (token.exp) {

    // let expdate = new Date(0);
    // expdate.ad(expiration);

    // let nbfdate = new Date(0);
    // nbfdate.setUTCSeconds(token.nbf);

    // let timediff = Number(expdate) - Number(nbfdate);

    let nw = new Date();
    nw.setSeconds(nw.getSeconds() + expiration);
    let timeUntilRefresh = Number(nw);
    timeUntilRefresh = timeUntilRefresh - 1000 * 18; //rounded and before 18 sec
    let date = new Date(timeUntilRefresh);
    localStorage.setItem(ACCESS_EXPIRATION + "_" + company_name, date);
    //}
  }
  /**
   * ! Check whether logged in
   */

  isLoggedIn() {
    const idToken = this.getAccessToken();
    return !!idToken; // && !this.isTokenExpired();
  }
  /**
   * Get the refresh token which acquire access token.
   */
  getIdToken() {
    let company_name = config.getCompanyIdfromUrl();
    return localStorage.getItem(REFRESH_TOKEN + "_" + company_name);
  }
  /**
   * Check the expiration date
   */
  getTokenExpirationDate() {
    let company_name = config.getCompanyIdfromUrl();
    let date = new Date(new Date().getTime() + 10);
    let expAt = localStorage.getItem(ACCESS_EXPIRATION + "_" + company_name);
    if (expAt != null) {
      date = new Date(Date.parse(expAt));
    }
    return date;
  }
  /**
   * Verify is the token expired which will check in timer in App.vue
   */
  isTokenExpired() {
    const expirationDate = this.getTokenExpirationDate();
    return expirationDate < new Date();
  }
  /**
   * clear the token when company url changes.
   */
  clearTokens() {
    let company_name = config.getCompanyIdfromUrl();
    localStorage.removeItem(REFRESH_TOKEN + "_" + company_name);
    localStorage.removeItem(ACCESS_TOKEN_KEY + "_" + company_name);
    localStorage.removeItem(ACCESS_EXPIRATION + "_" + company_name);
  }
  /**
   * Set or get the user language.
   */
  getAppLanguage() {
    let lang = localStorage.getItem("appLang");
    if (lang == null) {
      let locale = navigator.language || navigator.userLanguage;
      if (locale.indexOf("-") > 0) {
        return locale.split("-")[0];
      }
      lang = locale;
      localStorage.setItem("appLang", lang);
    }
    return lang;
  }
})();
