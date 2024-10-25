import axiosinstance from "@/core/axios";
import GlobalConfig from "@/variable";

export default {
  /**
   * Check Company is valid
   * @param  {string} companyid - Query string company name
   * @returns bool - Is company name exists
   */
  async isValidCompany(companyid, isLegacy) {
    let url = GlobalConfig.baseUrl + "company/fetchcompany?url_name=" + companyid;
    if (isLegacy) {
        url += '&legacy=true';
    }


    return axiosinstance
      .get(url)
      .then(result => {
        if (result && result.status === 200) {
          return true;
        }
        return false;
      });
  },
  /**
   * Gets Company Info
   * @param {string} companyid - Query string company name
   * @param isLegacy
   * @returns Company details with color configs
   */
  getCompanyInfo(companyid, isLegacy) {
    let url = GlobalConfig.baseUrl + "company/fetchcompany?url_name=" + companyid;
    if (isLegacy) {
        url += '&legacy=true'
    }

    return axiosinstance.get(url);
  }
};
