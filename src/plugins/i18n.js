import { createI18n } from 'vue-i18n';
import axiosinstance from "@/core/axios";
import GlobalConfig from "@/variable";

export const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
});

export const loadedLanguages = [];

function setI18nLanguage(lang) {
  i18n.global.locale = lang;
  axiosinstance.defaults.headers.common["Accept-Language"] = lang;
  document.querySelector("html").setAttribute("lang", lang);
  return lang;
}

export function loadLanguageAsync(lang, url_name) {
  if (loadedLanguages.includes(lang)) {
    if (i18n.global.locale !== lang) {
      setI18nLanguage(lang);
    }
    return Promise.resolve();
  }

  if (!url_name) {
    let url_string = window.location.href;
    let url = new URL(url_string);
    url_name = url.searchParams.get("company_name");
  }

  return axiosinstance
    .get(GlobalConfig.baseUrl + "user/language", {
      params: {
        lang: lang,
        url_name: url_name
      }
    })
    .then(response => {
      console.log("🚀 ~ loadLanguageAsync ~ response:", response)
      let msgs = response.data;
      loadedLanguages.push(lang);
      i18n.global.setLocaleMessage(lang, msgs);
      setI18nLanguage(lang);
    })
  // .catch(function (error) {
  //   console.info("Refresh i18n error: ", error);
  //   return Promise.reject(error);
  // });
}
