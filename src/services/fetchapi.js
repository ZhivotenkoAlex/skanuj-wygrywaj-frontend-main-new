import axiosinstance from "@/core/axios";
import GlobalConfig from "@/variable";

export default {
  /**
   * Get Logged user Address details
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @returns {JSON} Address with Zipcode
   */
  getUserAddress(token, companyname) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/user-details", {
      access_token: token,
      url_name: companyname
    });
  },
  /**
 * Get Logged user data
 * @param  token - User identifier
 * @param  companyname - Logged company name
 * @returns {JSON} Address with Zipcode
 */
  getUserData(token, companyname) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/user-data", {
      access_token: token,
      url_name: companyname
    });
  },
  /**
 * Get company rules form
 * @param  token - User identifier
 * @param  companyname - Logged company name
 * @returns {JSON} Address with Zipcode
 */
  getCompanyRulesFormScheme(token, companyname) {
    return axiosinstance.get(GlobalConfig.baseUrl + `company/rules-form?url_name=${companyname}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  /**
   * Get user cashback points
   * @param token
   * @param companyname
   * @returns {*}
   */
  getCashbackPoints(token, companyname) {
    return axiosinstance.post(GlobalConfig.baseUrl + "cashback/get-points", {
      access_token: token,
      url_name: companyname
    });
  },

  /**
   * Get gamification list
   * @param  url_name - Company URL name
   * @returns {JSON} List of Gamifications
   */
  getGamification(url_name, token) {
    return axiosinstance.get(GlobalConfig.baseUrl + "game/list?url_name=" + url_name, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  /**
 * Gets Company Info
 * @param {string} companyid - Query string company name
 * @param isLegacy
 * @returns Company details with color configs
 */
  getCompanyInfo(companyid) {
    let url = GlobalConfig.baseUrl + "company/fetchcompany?url_name=" + companyid;
    return axiosinstance.get(url);
  },

  /**
 * Get survey item
 * @param  surveyId - survey item id
 * @returns {string} survey name
 */
  getSurvey(surveyId) {
    return axiosinstance.get(GlobalConfig.surveyUrl + "getSurvey?surveyId=" + surveyId)

  },


  /**
* Get survey results
* @param  companyUrlName - Company url_name
* @param  token - User identifier
* @returns {JSON} history details
*/
  getUserSurveyHistory(companyUrlName, token) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/user-survey-history", {
      url_name: companyUrlName,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

  },

  /**
* Get survey results
* @param  companyUrlName - Company url_name
* @param  token - User identifier
* @returns {JSON} history details
*/
  generateInviteCode(companyUrlName, token) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/generateUserInvite", {
      url_name: companyUrlName,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

  },



  /**
* Get survey result
* @param  surveyId - survey item id
* @returns {string} survey name
*/
  getSurveyResult(surveyId, userId) {
    return axiosinstance.get(GlobalConfig.surveyUrl + "results/?postId=" + surveyId + "&userId=" + userId)
  },

  /**
   * Get the Products list based on the logged user
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected
   * @returns {JSON} - List of Products
   */
  getProducts(token, companyname, language) {
    return axiosinstance.post(GlobalConfig.baseUrl + "product", {
      access_token: token,
      url_name: companyname,
      lang: language
    });
  },
  /**
   * Get the Incentives list based on the logged user
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected
   * @returns {JSON} - List of Products
   */
  getIncentives(token, companyname, language) {
    return axiosinstance.post(GlobalConfig.baseUrl + "product/incentives", {
      access_token: token,
      url_name: companyname,
      lang: language
    });
  },
  /**
   * Get Info about the product by id
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected.
   * @param  id - Product Id
   * @returns {JSON} - About the Product
   */
  getReward(token, companyname, language, id) {
    return axiosinstance.post(GlobalConfig.baseUrl + "product?id=" + id, {
      access_token: token,
      url_name: companyname,
      lang: language,
      id: id
    });
  },
  /**
   * Do the Purchase
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  description - Product description
   * @param  name - Name of the User (Mandatory)
   * @param  street - Street No
   * @param  apartment - Apartment No
   * @param  addr - Address Line 1
   * @param  zip - Zip code (Mandatory)
   * @param  city - City
   * @param  country - country
   * @param  id - Product Id, which user going to purchase
   * @returns {string} with success or errors.
   */
  purchaseReward(
    token,
    companyname,
    description,
    name,
    street,
    apartment,
    addr,
    zip,
    city,
    country,
    id,
  ) {
    return axiosinstance.post(GlobalConfig.baseUrl + "product/add-purchase", {
      access_token: token,
      url_name: companyname,
      description: description,
      contact_name: name,
      street_number: street,
      apartment_number: apartment,
      street_address: addr,
      zip_code: zip,
      city: city,
      country: country,
      product_id: id,
    });
  },

  applyPurchase(id, token) {
    return axiosinstance.post(GlobalConfig.baseUrl + `product/apply-reservation/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getPurchase(token, id) {
    return axiosinstance.get(GlobalConfig.baseUrl + `product/purchase?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  /**
  * Save user data
  * @param  token - User identifier
  * @param  companyname - Logged company name
  * @param  name - Name of the User
  * @param  surname - Surname of the User
  * @param  phone - Phone of the User
  * @param  contact_email - Email of the User
  * @returns {string} with success or errors.
  */
  saveUserdataForRules(
    token,
    data
    // name,
    // surname,
    // phone,
    // nip
  ) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/savedata", {
      access_token: token,
      // name: name,
      // surname: surname,
      // phone: phone,
      // nip: nip
      ...data
    });
  },

  /**
   * Save user data
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  name - Name of the User
   * @param  surname - Surname of the User
   * @param  phone - Phone of the User
   * @param  contact_email - Email of the User
   * @returns {string} with success or errors.
   */
  saveUserdata(
    token,
    companyname,
    name,
    surname,
    phone,
    contact_email,
    street,
    apartment,
    addr,
    zip,
    city,
    country
  ) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/savedata", {
      access_token: token,
      url_name: companyname,
      name: name,
      surname: surname,
      phone: phone,
      contact_email: contact_email,
      street_number: street,
      apartment_number: apartment,
      street_address: addr,
      zip_code: zip,
      city: city,
      country: country
    });
  },
  /**
   *
   * @param token
   * @param companyname
   * @param full_name
   * @param bankaccount
   * @returns {*}
   */
  requestCashback(
    token,
    companyname,
    full_name,
    bankaccount
  ) {
    return axiosinstance.post(GlobalConfig.baseUrl + "cashback/request-cash-back", {
      access_token: token,
      url_name: companyname,
      full_name: full_name,
      bankaccount: bankaccount,
    });
  },
  /**
   * Get the Tasks based on the logged user
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected.
   * @returns {JSON} Get tasks list
   */
  getTasks(token, companyname, language) {
    return axiosinstance.post(GlobalConfig.baseUrl + "company/company-tasks", {
      access_token: token,
      url_name: companyname,
      lang: language
    });
  },
  /**
   * Get the Task details based on the id and its type
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  id - Task Id
   * @returns {JSON}Get the task info
   */
  getTaskById(token, companyname, id) {
    return axiosinstance.post(GlobalConfig.baseUrl + "company/company-task", {
      access_token: token,
      task_id: id
    });
  },
  /**
   * Get the rules list which user not accepted yet.
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected.
   * @returns {JSON} list of rules with info
   */
  getCompanyRules(token, companyname, language) {
    return axiosinstance.post(GlobalConfig.baseUrl + "company/company-rules", {
      access_token: token,
      url_name: companyname,
      lang: language
    });
  },
  /**
   * Check mandatory rules are need to show to user
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected.
   * @returns {boolean} - any rules not accepted yet.
   */
  hasMandatoryRules(token, companyname, language) {
    return axiosinstance
      .post(GlobalConfig.baseUrl + "company/company-rules", {
        access_token: token,
        url_name: companyname,
        lang: language
      })
      .then(result => {
        let response = result.data
        const rules = response.data.filter(item => item.is_mandatory === '1');
        if (rules.length != 0) {
          return true;
        }
        return false;
      });



  },
  /**
   * User has accepted the selected rules
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected.
   * @param  rules - Selected Rule Ids
   * @returns {string } accept or error status.
   */
  agreeCompanyRules(token, companyname, language, rules) {
    return axiosinstance.post(GlobalConfig.baseUrl + "company/company-rules", {
      access_token: token,
      url_name: companyname,
      lang: language,
      rule_id: rules
    });
  },
  /**
   * Get the List of the user history
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @returns {JSON} history details
   */
  getHistory(token, companyname) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/user-history", {
      access_token: token,
      url_name: companyname
    });
  },
  /**
   * Get the List of the user uploaded receipts
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  limit
   * @param  offset
   * @returns {JSON} history details
   */
  getReceiptsHistory(token, companyname, limit = 10, offset = 0) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/user-receipts-history", {
      access_token: token,
      url_name: companyname,
      limit: limit,
      offset: offset
    });
  },
  /**
   * Get the List of the user games played records
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  limit
   * @param  offset
   * @returns {JSON} history details
   */
  getGamesHistory(token, companyname, limit = 10, offset = 0) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/user-games-history", {
      access_token: token,
      url_name: companyname,
      limit: limit,
      offset: offset
    });
  },
  /**
   * Get the List of the user uploaded receipts
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  limit
   * @param  offset
   * @returns {JSON} history details
   */
  getPurchasesHistory(token, companyname, limit = 10, offset = 0) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/user-purchases-history", {
      access_token: token,
      url_name: companyname,
      limit: limit,
      offset: offset
    });
  },
  /**
   * Get the list of questions for the survey
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  language - Language user selected.
   * @returns {JSON} list of question with its types.
   */
  getQuestion(token, companyname, language) {
    return axiosinstance.post(
      GlobalConfig.baseUrl + "company/company-question",
      {
        access_token: token,
        url_name: companyname,
        lang: language
      }
    );
  },
  /**
   * Get the Invite code for copying
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @returns {string} either invite code or error message.
   */
  getInviteCode(token, companyname) {
    return axiosinstance.post(
      GlobalConfig.baseUrl + "user/generateUserInvite",
      {
        access_token: token,
        url_name: companyname
      }
    );
  },
  /**
   * Submit the qrcode scanned
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  gameid - Task Id
   * @param  barcode - qr code scanned
   * @returns {string } Success or error msg
   */
  sendBarCode(token, companyname, gameid, barcode) {
    return axiosinstance.post(
      GlobalConfig.baseUrl + "company/company-barcode",
      {
        access_token: token,
        game_id: gameid,
        barcode: barcode
      }
    );
  },
  /**
   * Get the history for the barcode tasks
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @returns {JSON} history info
   */
  getBarCodeHistory(token, companyname) {
    return axiosinstance.post(
      GlobalConfig.baseUrl + "user/user-barcode-history",
      {
        access_token: token,
        url_name: companyname
      }
    );
  },
  /**
   * Get the invite task history of points
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @returns {JSON} history list
   */
  getInviteHistory(token, companyname) {
    return axiosinstance.post(
      GlobalConfig.baseUrl + "user/user-invite-history",
      {
        access_token: token,
        url_name: companyname
      }
    );
  },
  /**
   * Get the history of points gathered from survey
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @returns {JSON} survey history list
   */
  getSurveyHistory(token, companyname) {
    return axiosinstance.post(
      GlobalConfig.baseUrl + "user/user-survey-history",
      {
        access_token: token,
        url_name: companyname
      }
    );
  },
  /**
   * Get the price of the less expensive product for chart
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @returns {Number} Value of the product
   */
  getLessExpensiveProduct(token, companyname) {
    return axiosinstance.post(GlobalConfig.baseUrl + "product/min-product", {
      access_token: token,
      url_name: companyname
    });
  },
  /**
   * Save the survey data submitted
   * @param  data - Survey form data
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  lang - User requested lang.
   * @returns {string} success or error msg.
   */
  saveQAForm(data, token, companyname, lang) {
    return axiosinstance.post(
      GlobalConfig.baseUrl + "user/user-survey-fillout",
      {
        data: data,
        access_token: token,
        url_name: companyname,
        lang: lang
      }
    );
  },
  /**
   * Simulate receipt scanning
   * @param  token - User identifier
   * @param  companyname - Logged company name
   * @param  id - Task Id
   * @returns {JSON}Get the task info
   */
  postReceiptData(token, companyname, id) {
    return axiosinstance.post(GlobalConfig.baseUrl + "company/simulatescan", {
      access_token: token,
      task_id: id,
      url_name: companyname
    });
  },
  requestReceiptdummyfinish(token, companyname, inc, price, rstatus) {
    return axiosinstance.post(GlobalConfig.baseUrl + "receipt/dummyfinish", {
      access_token: token,
      url_name: companyname,
      inc: inc,
      p: price,
      s: rstatus
    });
  },
  /**
   * Get scoreboard for game
   * @param  token - User identifier
   * @param  company_name - Logged company name
   * @returns {JSON}Get the created infopage id
   */
  getScoreboard(token, company_name) {
    return axiosinstance.post(GlobalConfig.baseUrl + "game/scoreboard", {
      access_token: token,
      company_name: company_name
    });
  },

  /**
   * Get user notifications
   * @param  token - User identifier
   * @param  company_name - Logged company name
   * @returns {JSON}Get the created infopage id
   */
  getNotifications(token, company_name) {
    return axiosinstance.post(GlobalConfig.baseUrl + "game/infopages", {
      access_token: token,
      company_name: company_name
    });
  },
  /**
   * Get user points balance
   * @param token
   * @param companyname
   * @returns {*}
   */
  getPoints(token, companyname) {
    return axiosinstance.post(GlobalConfig.baseUrl + "user/get-points", {
      access_token: token,
      url_name: companyname
    });
  },

  sendEmail(companyId, to, subject, body) {
    return axiosinstance.post(GlobalConfig.baseUrl + "mail/send-email", {
      companyId, to, subject, body
    });
  },

  /**
 * Get gamification coupons дшіе
 * @param token
 * @param companyname
 * @returns {*}
 */
  getCouponList(token, companyname) {
    return axiosinstance.post(GlobalConfig.baseUrl + "game/coupons", {
      access_token: token,
      company_name: companyname
    });
  },

  /**
* Get gamification coupons
* @param token
* @param companyname
* @returns {*}
*/
  getCoupon(token, couponId) {
    return axiosinstance.post(GlobalConfig.baseUrl + `game/coupons/${couponId}`, {
      access_token: token,
    });
  },
};
