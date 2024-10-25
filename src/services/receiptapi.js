import axiosinstance from "@/core/axios";
import GlobalConfig from "@/variable";

export default {

    storage(token, companyname, receipt_id, extension) {
        var url;
        if (typeof (receipt_id) === 'undefined' || receipt_id === null || receipt_id == 0) {
            url = GlobalConfig.baseUrl + "receipt/storage?extension=" + extension;
        } else {
            url = GlobalConfig.baseUrl + "receipt/storage?rid=" + receipt_id + "&extension=" + extension;
        }
        return axiosinstance.post(url, {
            access_token: token,
            url_name: companyname
        });
    },
    process(token, companyname, receipt_id) {
        let url = GlobalConfig.baseUrl + "receipt/process?rid=" + receipt_id;
        return axiosinstance.post(url, {
            access_token: token,
            url_name: companyname
        });
    },
    poll(token, companyname, receipt_id) {
        let url = GlobalConfig.baseUrl + "receipt/poll?rid=" + receipt_id;
        return axiosinstance.post(url, {
            access_token: token,
            url_name: companyname,
            id: receipt_id
        });
    },
    mark(token, companyname, receipt_id) {
        let url = GlobalConfig.baseUrl + "receipt/mark-for-manual-verification?rid=" + receipt_id;
        return axiosinstance.post(url, {
            access_token: token,
            url_name: companyname
        });
    },
    finish(token, companyname, receipt_id) {
        let url = GlobalConfig.baseUrl + "receipt/finish?rid=" + receipt_id;
        return axiosinstance.post(url, {
            access_token: token,
            url_name: companyname
        });
    },
}