<template>
  <v-footer
    class="mt-4"
    absolute
    :style="`color:${config.mfontcolor} !important;background:${config.mcolor};`"
  >
    <div style="width: 100%">
      <p style="text-align: center; font-size: 12px; margin: 0">
        powered by
        <a id="powered" class="black--text" :href="info.link" target="_blank">{{
          info.title
        }}</a>
      </p>
    </div>
  </v-footer>
</template>

<script>
import { ref, reactive, onMounted } from "vue"
import companyconfig from "@/core/companyconfig"

export default {
  setup() {
    const config = reactive({})
    const partners = {
      default: {
        link: "https://blovly.com?utm_source=footer",
        title: "Blovly.com",
      },
      c_gence: {
        link: "https://www.c-gence.com/?utm_source=footer",
        title: "C-gence",
      },
    }
    const info = ref({})

    const getPartnerData = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let partner_company = ""

      if (passedCompanyId === "skanuj-wygrywaj") {
        partner_company = "c_gence"
      }

      if (partner_company in partners) {
        info.value = partners[partner_company]
        return
      }
      info.value = partners.default
    }

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.mfontcolor = data.main_font_color
        config.mcolor = data.main_color
      }
    }

    onMounted(() => {
      getPartnerData()
      setupLayout()
    })

    return {
      config,
      info,
    }
  },
}
</script>

<style>
footer {
  z-index: 0;
}
</style>
