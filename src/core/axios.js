import router from "../router/index";
import axios from "axios";
import auth from "./auth";
import companyconfig from "./companyconfig";
import api from "@/services/loginapi";
import GlobalConfig from "@/variable";

let authTokenRequest;

const axiosinstance = axios.create({
  headers: {
    "Cache-Control": "no-cache",
    "Content-type": "application/json; charset=utf-8 ",
    // Authorization: getAuthAcessToken()
  }
});
/**
 * Interceptor to dynamically add the Authorization header before each request.
 */
axiosinstance.interceptors.request.use(
  config => {
    const token = getAuthAcessToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


/**
 * Interceptor to check token expired (401 unauthorized) and acquire new token.
 * Redo the error http call.
 */
axiosinstance.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    let errObj = err;
    let errConfig = errObj.config;
    let errResponse = errObj.response.data;
    if (
      errResponse.status === 401 &&
      errResponse.message === "INVALID_TOKEN" &&
      errConfig &&
      !errConfig.__isRetryRequest
    ) {
      return getAuthToken()
        .then(function (response) {
          let success = response.data;
          auth.setTokens(
            success.token,
            success.refresh_token,
            success.expiry_second
          );
          errConfig.__isRetryRequest = true;
          errObj.config.headers.Authorization = getAuthAcessToken();
          resetAuthTokenRequest();
          const config = errConfig;
          config.headers["Authorization"] = `Bearer ${success.token}`;


          let data = JSON.parse(errConfig.data);
          data.access_token = success.token;
          let d = {
            data: JSON.stringify(data)
          };
          Object.assign(config, d);
          return new Promise((resolve, reject) => {
            axiosinstance
              .request(config)
              .then(response => {
                resolve(response);
              })
              .catch(error => {
                reject(error);
              });
          });
        })
        .catch(function (error) {
          resetAuthTokenRequest();
          logout(error.config);
          //return Promise.reject(error);
        });
    } else if (errObj.response) {
      return Promise.reject(errObj.response);
    }
    return Promise.reject(errObj);
  }
);
export default axiosinstance;

/**
 * Get the Access token
 */
function getAuthToken() {
  if (!authTokenRequest) {
    let rToken = auth.getIdToken();

    authTokenRequest = api.doRefreshToken(rToken);

  }
  return authTokenRequest;
}

function resetAuthTokenRequest() {
  authTokenRequest = null;
}

/**
 * Get the access token for headers
 */
function getAuthAcessToken() {
  const idToken = auth.getAccessToken();
  if (idToken != null) {
    return `Bearer ${idToken}`;
  }
  return "";
}

/**
 * Do the logout with fetching all the details
 * @param errConfig
 */
function logout(errConfig) {
  if (errConfig.url === GlobalConfig.baseUrl + "user/getnewtoken") {
    let passedCompanyId = companyconfig.getCompanyIdfromUrl();
    router.push({
      name: "welcome",
      query: {
        company_name: passedCompanyId
      }
    });
    auth.clearTokens();
  }
}