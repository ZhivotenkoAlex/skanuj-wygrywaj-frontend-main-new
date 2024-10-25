import axiosinstance from "@/core/axios";
import GlobalConfig from "@/variable";

export default {
    /**
     * Get company user by company id
     * @param  {string} companyId - Query string company name
     * @returns object - company user instance
     */
    async getCompanyUserId(companyId) {
        let url = GlobalConfig.surveyUrl + "companyUsers/" + companyId;
        return axiosinstance
            .get(url)
            .then(result => {
                const companyUser = result.data?.[0]
                return companyUser;
            });
    }
};