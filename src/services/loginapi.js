import axiosinstance from "@/core/axios";
import GlobalConfig from "@/variable";

var guest_hash = false,
  ga_notified = false,
  ga_notification_key = 'GUEST_HASH_GA_NOTIFIED',
  gtag = undefined,
  company_url = '';

export default {
  /**
   * Do the login using one-time token
   * @param  token - token
   * @param  companyname - company name from querystring
   * @returns {string} success or error msg
   */
  doTokenLogin(token, companyname) {
    return axiosinstance.post(this.prepareUrl("user/tokenlogin"), {
      token: token,
      company_url: companyname
    });
  },

  /**
   * Do the login using registered username and password
   * @param  username - email
   * @param  password - password
   * @param  companyname - company name from querystring
   * @param  invitecode - invite code from other user
   * @returns {string} success or error msg
   */
  doEmailLogin(username, password, companyname, invitecode, legacy) {
    return axiosinstance.post(this.prepareUrl("user/login"), {
      email: username,
      password: password,
      company_url: companyname,
      invite_code: invitecode,
      legacy: legacy
    });
  },
  /**
   * Do SMS login with Phone number and Password
   * @param phone
   * @param password
   * @param companyname
   * @param legacy
   * @returns {*}
   */
  doSMSLogin(phone, password, companyname, legacy) {
    return axiosinstance.post(this.prepareUrl("user/sms-login"), {
      phone: phone,
      password: password,
      company_url: companyname,
      legacy: legacy
    });
  },
  /**
   * Register to app by company
   * @param  username - email
   * @param  fullname - full name of the user
   * @param companyname - company name from querystring
   * @param invitecode - invite code from other user
   * @param password
   * @param legacy
   * @returns {string} success or error msg
   */
  doRegister(username, fullname, companyname, invitecode, password = null, legacy) {
    return axiosinstance.post(this.prepareUrl("user/signup"), {
      email: username,
      name: fullname,
      company_url: companyname,
      invite_code: invitecode,
      password: password,
      legacy: legacy
    });
  },
  /**
   * Register via SMS
   * @param username
   * @param fullname
   * @param companyname
   * @param invitecode
   * @param password
   * @param legacy
   * @param confirmationcode
   * @returns {*}
   */
  doSMSRegister(username, fullname, companyname, invitecode, password, legacy, confirmationcode) {
    if (confirmationcode && confirmationcode.length > 0) {
      return axiosinstance.post(this.prepareUrl("user/sms-signup2"), {
        phone: username,
        company_url: companyname,
        confirmationcode: confirmationcode,
        legacy: legacy
      });
    } else {
      return axiosinstance.post(this.prepareUrl("user/sms-signup1"), {
        phone: username,
        name: fullname,
        company_url: companyname,
        invite_code: invitecode,
        password: password,
        legacy: legacy
      });
    }
  },
  /**
   * Do Fb login
   * @param  accesstoken - FB access token
   * @param companyname - company name from querystring
   * @param invitecode - invite code from other user
   * @param legacy
   * @returns { string } success or error msg
   */
  dofbApiLogin(accesstoken, companyname, invitecode, legacy) {
    return axiosinstance.post(this.prepareUrl("user/fblogin"), {
      access_token: accesstoken,
      company_url: companyname,
      invite_code: invitecode,
      legacy: legacy
    });
  },
  /**
   * Do google login
   * @param  accesstoken - Google Acess token
   * @param companyname - company name from querystring
   * @param invitecode - invite code from other user *
   * @param legacy
   * @returns {string } success or error msg
   */
  doGoogleApiLogin(accesstoken, companyname, invitecode, legacy) {
    return axiosinstance.post(this.prepareUrl("user/google-login"), {
      access_token: accesstoken,
      company_url: companyname,
      invite_code: invitecode,
      legacy: legacy
    });
  },
  /**
   * Do face login
   * @param accesstoken
   * @param companyname
   * @param invitecode
   * @param legacy
   * @param phoneNumber
   * @returns {Promise<AxiosResponse<any>>}
   */
  doFaceLogin(accesstoken, companyname, invitecode, legacy, phoneNumber) {
    // var tokenData = this.parseFaceToken(accesstoken);

    return axiosinstance.post(this.prepareUrl("user/face-login"), {
      access_token: accesstoken,
      company_url: companyname,
      invite_code: invitecode,
      legacy: legacy,
      phone: phoneNumber
    });
  },
  parseFaceToken(token) {
    return JSON.parse(
      this.b64DecodeUnicode(
        token.split('.')[1].replace('-', '+').replace('_', '/')
      )
    );
  },
  b64DecodeUnicode(str) {
    return decodeURIComponent(
      Array.prototype.map.call(atob(str), c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
  },
  /**
   * Refresh the access token when it expired
   * @param  refreshToken - Refresh token
   * @returns {JSON} access token with refresh token
   */
  doRefreshToken(refreshToken) {
    return axiosinstance.post(this.prepareUrl("user/getnewtoken"), {
      refresh_token: refreshToken
    });
  },

  /**
   * Do the password change
   * @param  username - email
   * @param companyname - company name from querystring
   * @param legacy
   * @returns {string} Success or error msg
   */
  doPasswordChange(username, companyname, legacy) {
    return axiosinstance.post(this.prepareUrl("user/forgot-password"), {
      email: username,
      company_url: companyname,
      legacy: legacy
    });
  },
  /**
   * Do the Phone password change
   * @param phone
   * @param companyname - company name from querystring
   * @param password
   * @param confirmation_code
   * @param legacy
   * @returns {string} Success or error msg
   */
  doPhonePasswordChange(phone, companyname, password, confirmation_code, legacy) {
    return axiosinstance.post(this.prepareUrl("user/forgot-phone-password"), {
      phone: phone,
      company_url: companyname,
      password: password,
      confirmation_code: confirmation_code,
      legacy: legacy
    });
  },

  getUser(token, companyname) {
    return axiosinstance.post(this.prepareUrl("user/get-user"), {
      access_token: token,
      company_url: companyname
    });
  },

  getGuestAwaitingPoints() {
    if (!guest_hash) {
      return false;
    }
    return axiosinstance.post(this.prepareUrl("user/get-guest-awaiting-points"), {
      company_url: company_url,
      guest_hash: guest_hash,
    });
  },

  setGuestHash(hash, companyname, googletag = undefined) {
    guest_hash = hash;
    gtag = googletag;
    company_url = companyname;
  },

  prepareUrl(path) {
    let url = GlobalConfig.baseUrl + path;
    if (guest_hash) {
      url += '?guest_hash=' + guest_hash;

      this.sendGuestPointsNotification();
    }
    return url;
  },

  sendGuestPointsNotification() {
    if (!ga_notified) {
      ga_notified = true;
      this.getGuestAwaitingPoints()
        .then(result => {
          var awaitingPoints = result.data.data.points;

          var ga_notification_guest_hash = localStorage.getItem(ga_notification_key);

          if (awaitingPoints && ga_notification_guest_hash != null && guest_hash !== ga_notification_guest_hash) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'BLM_LOGIN', {
                'event_category': 'company_name',
              });
            }
            localStorage.setItem(ga_notification_key, guest_hash);
          }
        })
    }
  },

  doFaceLoginPhoneCheck(username,
    companyname,
    legacy,
    invitecode,
    confirmationcode) {
    if (confirmationcode && confirmationcode.length > 0) {
      return axiosinstance.post(this.prepareUrl("user/face-login-code-check"), {
        phone: username,
        company_url: companyname,
        confirmationcode: confirmationcode,
        legacy: legacy
      });
    } else {
      return axiosinstance.post(this.prepareUrl("user/face-login-phone-check"), {
        phone: username,
        company_url: companyname,
        invite_code: invitecode,
        legacy: legacy
      });
    }
  },
};
