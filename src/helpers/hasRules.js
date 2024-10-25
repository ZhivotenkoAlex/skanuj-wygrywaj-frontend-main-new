import companyconfig from '@/core/companyconfig'
import auth from '@/core/auth'
import api from '@/services/fetchapi'

export async function hasRules() {
    let passedCompanyId = companyconfig.getCompanyIdfromUrl()
    let token = auth.getAccessToken()
    let lang = auth.getAppLanguage()
    return await api
        .hasMandatoryRules(token, passedCompanyId, lang)
}