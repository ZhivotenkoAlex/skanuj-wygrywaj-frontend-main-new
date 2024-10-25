import axiosinstance from "@/core/axios";
import GlobalConfig from "@/variable";

export default {
    /**
     * Get company user by company id
     * @param  {string} companyId - Query string company name
     * @returns object - company user instance
     */
    async getGameConfig(configId) {
        let url = GlobalConfig.baseUrl + "game/gameconfig/" + configId;
        return axiosinstance
            .get(url)
            .then(result => {
                return result.data;
            });

    }
};