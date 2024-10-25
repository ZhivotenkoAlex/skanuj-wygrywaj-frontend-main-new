import Vue from "vue";
import { COMPANY_CONFIG_KEY, COMPANY_LANGUAGE_KEY, USER_CONFIG_KEY } from "@/appConstants";

export default new (class companyconfig {
  /**
   * Remove the local storage for company
   * @param {string} company_name
   */
  resetCompanyLocals(company_name) {
    Vue.localStorage.remove(COMPANY_CONFIG_KEY + "_" + company_name);
    Vue.localStorage.remove(COMPANY_LANGUAGE_KEY + "_" + company_name);
    Vue.localStorage.remove(USER_CONFIG_KEY + "_" + company_name);
    Vue.localStorage.remove('system_user_id'); //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
    Vue.localStorage.remove('company_id'); //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
    Vue.localStorage.remove('vuels__user'); //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
    Vue.localStorage.remove('vuels__2tiCompanyId'); //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
    Vue.localStorage.remove('vuels__2tiCompanyName'); //NEEDED FOR "SUPPORTBOARD" CHAT SYNCHRONIZATION
  }

  /**
   * Check whether email login is allowed to redirect from routing.
   */
  allowEmailLoginOnly() {
    let json = this.getCompanyScheme();
    if (json !== "") {
      return json.only_email_login;
    }
    return false;
  }
  allowAppleLogin() {
    let json = this.getCompanyScheme();
    if (json !== "") {
      return json.is_apple_login;
    }
    return false;
  }
  /**
   * Get the company color configuration which is used in entire app.
   */
  getCompanyScheme() {
    let result = "";
    let params = this.getCompanyIdfromUrl();
    if (params != "") {
      let json = localStorage.getItem(COMPANY_CONFIG_KEY + "_" + params);
      if (json) {
        result = JSON.parse(json);
      }
    }
    return result;
  }

  /**
   * Get user config
   * @param companyName
   * @returns {string}
   */
  getUserScheme(companyName) {
    let result = "";
    let json = Vue.localStorage.get(USER_CONFIG_KEY + "_" + companyName);
    if (json) {
      result = JSON.parse(json);
    }
    return result;
  }

  /**
   *  Save the company scheme in local storage
   * @param {JSON} obj
   * @param {string} company_name
   */
  setCompanyScheme(obj, company_name) {
    this.resetCompanyLocals(company_name);
    let jsonstr = JSON.stringify(obj.data);
    Vue.localStorage.set(COMPANY_CONFIG_KEY + "_" + company_name, jsonstr);
    Vue.localStorage.set('company_name', company_name)
    if (obj.data) {
      Vue.localStorage.set(COMPANY_LANGUAGE_KEY + "_" + company_name, obj.data.default_lang);
    }
  }

  /**
   * Save user data to localStorage.
   * @param userObj
   * @param company_name
   */
  setUser(userObj, company_name) {
    Vue.localStorage.remove(USER_CONFIG_KEY + "_" + company_name);
    let jsonstr = JSON.stringify(userObj);
    Vue.localStorage.set(USER_CONFIG_KEY + "_" + company_name, jsonstr);
  }

  /**
   * Check whether data is loaded for company (scheme in local storage)
   */
  isCompanySchemeSet() {
    let params = this.getCompanyIdfromUrl();
    if (params != "") {
      let data = localStorage.getItem(COMPANY_CONFIG_KEY + "_" + params);
      if (data != null) {
        return true;
      }
    }
    return false;
  }
  /**
   * Get the company name parameter from localstorage
   */
  getCompanyId() {
    let result = "";
    let values = Object.keys(window.localStorage).filter(key =>
      key.startsWith(COMPANY_CONFIG_KEY)
    );

    if (values.length !== 0) {
      let obj1 = values[0].split("_");
      if (obj1.length > 1) {
        result = obj1[1];
      }
    }
    return result;
  }

  /**
   * Get the company name parameter from url
   */
  getCompanyIdfromUrl() {
    let params = this.getUrllets();
    let result = "";
    if (Object.keys(params).length !== 0 && params.constructor == Object) {
      result = params.company_name;
    }
    return result.replace("#", "");
  }

  getFieldValueFromUrl(field) {
    let params = this.getUrllets();
    let result = "";
    if (Object.keys(params).length !== 0 && params.constructor == Object) {
      result = params[field];
    }
    return result.replace("#", "");

  }

  /*
    getIsFirst () {
      let params = this.getUrllets();
      let result = "";
      if (Object.keys(params).length !== 0 && params.constructor == Object && typeof params.first !== 'undefined') {
        result = params.first;
      }
      return result == '1'
    }
  */

  /**
   * Temporary method for outside login
   */
  goToOldLogin() {
    window.location = "https://2take.it/loyalty/index.php/site/sg/c/pg-cz/d/1/e/1/gid/1751/ih/1/fm/1/";
  }

  /**
   * Get customer id from URL.
   */
  getCustomerIdFromUrl() {
    let params = this.getUrllets();
    let result = "";
    if (Object.keys(params).length !== 0 && params.constructor == Object) {
      result = params.customer_id;
    }
    return result.replace("#", "");
  }
  /**
   * Configure the color scheme for vuetify theme based on company
   * @param {JSON} obj
   */
  configVuetify(obj) {
    let colors = this.getCompanyScheme();
    if (colors != "") {
      //accent: colors.third,
      obj.theme.themes.light = {
        primary: colors.main_color, // monster HARDCODE
        secondary: colors.primary_color,
        error: colors.error_color,
        info: colors.info_color,
        success: colors.success_color,
        warning: colors.warning_color
      };

      //accent: colors.third,
      obj.theme.themes.dark = {
        primary: colors.main_color,
        secondary: colors.primary_color,
        error: colors.error_color,
        info: colors.info_color,
        success: colors.success_color,
        warning: colors.warning_color
      };
      obj.theme.isDark =
        colors.dark_scheme == null || colors.dark_scheme == false ?
          false :
          true;
    }
  }
  /**
   * Get the company name parameter
   */
  getUrllets() {
    let lets = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
      m,
      key,
      value
    ) {
      lets[key] = value;
    });
    return lets;
  }

  setLoginLegacyMode(company_name) {
    let jsonstr = JSON.stringify(
      { legacy: true }
    );
    Vue.localStorage.set('LEGACY_MODE' + "_" + company_name, jsonstr);
  }

  isLegacyMode(company_name) {
    let json = Vue.localStorage.get('LEGACY_MODE' + "_" + company_name);
    if (json) {
      let legacyObj = JSON.parse(json);
      if (legacyObj.legacy) {
        return true;
      }
    }
    return false;
  }


  setUrlParamToLocalStorage(company_name, key, value) {
    let jsonstr = JSON.stringify(
      { param: value }
    );
    Vue.localStorage.set(key + "_" + company_name, jsonstr);
  }

  getUrlParamFromLocalStorage(company_name, key) {
    let json = Vue.localStorage.get(key + "_" + company_name);
    if (json) {
      let legacyObj = JSON.parse(json);
      if (legacyObj.param) {
        return legacyObj.param;
      }
    }
    return false;
  }

  removeUrlParamFromLocalStorage(company_name, key) {
    Vue.localStorage.remove(key + "_" + company_name);
  }

  goToFbBotLogin(company, url) {
    console.log('>>>FB LOGIN 3');
    if (url.contains('?')) {
      url += '&bot_fbhash=' + this.getUrlParamFromLocalStorage(company, 'bot_fbhash');
    } else {
      url += '?bot_fbhash=' + this.getUrlParamFromLocalStorage(company, 'bot_fbhash');
    }

    url += '&bot_fbid=' + this.getUrlParamFromLocalStorage(company, 'bot_fbid');

    this.removeUrlParamFromLocalStorage(company, 'bot_fbhash');
    this.removeUrlParamFromLocalStorage(company, 'bot_fbid');

    console.log('>>>FB LOGIN 4');
    console.log('FB LOGIN url', url);
    location.href = url;
  }


})();
