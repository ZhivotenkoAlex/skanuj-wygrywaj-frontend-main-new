<template>
  <v-card class="pb-6" style="background: #ffffffb3">
    <v-toolbar class="mb-3" flat dense :color="config.mcolor">
      <v-toolbar-title class="my-3 ml-2" :style="`color:#fff;`">{{
        $t("RulesScreen.TITLE")
      }}</v-toolbar-title>
    </v-toolbar>
    <v-card flat class="image px-3" style="background: #fff0">
      <v-img :src="config.shortlogo" max-height="50px" contain></v-img>
    </v-card>
    <v-container>
      <v-card flat style="background-color: #fff0; padding-top: 10px">
        <Vueform ref="vueForm" :schema="schema" />
      </v-card>
    </v-container>

    <v-card-text class="page_title">
      {{ $t("RulesScreen.PERSONAL_DATA_PROTECTION") }}</v-card-text
    >
    <alert
      :errorType="address.errtype"
      :errorMessage="address.errors"
      :alert="address.showerror"
      :callback="removeErrors"
    ></alert>
    <v-card-text>I. {{ $t("RulesScreen.MANDATORY_CONSENTS") }}*</v-card-text>
    <v-list class="list" style="background-color: #fff0">
      <div v-for="rule in mandatoryrules" :key="rule.id">
        <v-list-item
          :key="rule.id"
          @click="toggleSelection(rule)"
          class="py-3 list_item"
        >
          <v-list-item-action class="item_action">
            <v-checkbox
              :color="config.mcolor"
              v-model="rule.selected"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-subtitle lines="all"
            >{{ rule.description }} *</v-list-item-subtitle
          >
        </v-list-item>
      </div>
    </v-list>
    <v-card-text>II. {{ $t("RulesScreen.VOLUNTARY_CONSENTS") }}</v-card-text>
    <v-list class="list" style="background-color: #fff0">
      <div v-for="rule in voluntaryrules" :key="rule.id">
        <v-list-item
          :key="rule.id"
          @click="toggleSelection(rule)"
          class="py-3 list_item"
        >
          <v-list-item-action class="item_action">
            <v-checkbox
              :color="config.mcolor"
              v-model="rule.selected"
              @click="rule.selected = !rule.selected"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-subtitle lines="all">{{
            rule.description
          }}</v-list-item-subtitle>
        </v-list-item>
      </div>
    </v-list>
    <v-card class="justify-center mx-3">
      <v-alert v-if="showSuccess" color="green" type="success" dismissible>
        {{ $t("PersonalData.SUCCESS") }}
      </v-alert>

      <v-btn
        block
        :color="config.mcolor"
        :style="`color:#fff !important`"
        @click="handleSubmit"
        v-text="$t('LoginScreen.ACCEPT_BTN')"
      ></v-btn>
    </v-card>
  </v-card>
</template>

<script>
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import alert from "@/components/shared/errorAlert.vue"
import auth from "@/core/auth"
import api from "@/services/fetchapi"
import { useI18n } from "vue-i18n"
export default {
  components: {
    alert,
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const address = reactive({
      name: "",
      valid: false,
      errtype: "error",
      errors: "",
      showerror: false,
    })
    const showSuccess = ref(false)
    const comprules = ref([])
    const mandatoryrules = ref([])
    const voluntaryrules = ref([])
    const config = reactive({})
    const model = reactive({})
    const schema = ref({})
    const formData = ref()
    const vueForm = ref()

    onMounted(() => {
      getFormScheme()
      setupLayout()
      loadRules()
      fetchAddress()
    })

    const toggleSelection = (rule) => {
      rule.selected = !rule.selected
    }

    const setupLayout = () => {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        config.mcolor = data.main_color
        config.pfontcolor = data.main_font_color
        config.shortlogo = data.logo_image
      }
    }

    const handleSubmit = async () => {
      await vueForm.value.validate()
      const isValid = !vueForm.value.invalid
      if (isValid) {
        onSubmit(vueForm.value.data)
      } else {
        console.log("Form validation failed")
      }
    }

    const onSubmit = async (data) => {
      await vueForm.value.validate()
      const isValid = !vueForm.value.invalid

      comprules.value = [...mandatoryrules.value, ...voluntaryrules.value]
      let items = comprules.value.filter((a) => a.selected == true)
      const isMandatoryTermsSelected = mandatoryrules.value.every(
        (rule) => rule.selected
      )

      if (!isMandatoryTermsSelected) {
        address.errors = t("Errors.NEED_REQUIRED_TERMS_ACCEPTANCE")
        address.showerror = true
        return
      }

      if (items.length !== 0 && isValid) {
        let ids = items.map((e) => e.id).join(",")
        let passedCompanyId = companyconfig.getCompanyIdfromUrl()
        let token = auth.getAccessToken()
        let lang = auth.getAppLanguage()
        api.saveUserdataForRules(token, data)
        api
          .agreeCompanyRules(token, passedCompanyId, lang, ids)
          .then(() => {
            movetoIndex()
          })
          .catch(() => {
            movetoIndex()
          })
      }
    }

    const movetoIndex = () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    }

    const fetchAddress = async () => {
      let token = auth.getAccessToken()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      const result = await api.getUserAddress(token, passedCompanyId)
      let response = result.data
      if (response.data) {
        let data = response.data
        address.name = data.name
        address.surname = data.surname
        address.phone = data.phone
        address.nip = data.nip
        address.isLoaded = true
      }
    }

    const loadRules = async () => {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = auth.getAppLanguage()
      try {
        const result = await api.getCompanyRules(token, passedCompanyId, lang)
        let response = result.data
        if (response.data.length != 0) {
          let rules = response.data
          rules.forEach((element) => {
            element.selected = false
            if (element.is_mandatory === "1") {
              mandatoryrules.value.push(element)
            } else {
              voluntaryrules.value.push(element)
            }
          })
        } else {
          movetoIndex()
        }
      } catch (err) {
        let errormsg = err.data.message
        if (errormsg === NO_COMPANY_FOUND) {
          console.log(err)
        }
        movetoIndex()
      }
    }

    const namerule = (value) => {
      if (!value) {
        return t("PersonalData.REQUIRED")
      }
      return true
    }

    const surnamerule = (value) => {
      if (!value) {
        return t("PersonalData.REQUIRED")
      }
      return true
    }

    const phonerule = (value) => {
      const phoneNumberRegex =
        /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s.-]{7,10}$/
      if (!value) {
        return t("PersonalData.REQUIRED")
      }
      if (!phoneNumberRegex.test(value)) {
        return t("Errors.INVALID_PHONE")
      }
      return true
    }

    const niprule = (value) => {
      const nipRegex = /^\d{10}$/
      if (!value) {
        return t("PersonalData.REQUIRED")
      }
      if (!nipRegex.test(value)) {
        return t("Errors.INVALID_NIP")
      }
      return true
    }

    const removeErrors = () => {
      address.errors = ""
      address.showerror = false
    }

    const formatDate = (timestamp) => {
      const date = new Date(timestamp)
      return date.toISOString().split("T")[0]
    }

    const getFormScheme = async () => {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      const token = auth.getAccessToken()
      const schemaResult = await api.getCompanyRulesFormScheme(
        token,
        passedCompanyId
      )
      const userResponse = await api.getUserData(token, passedCompanyId)
      const userData = userResponse.data.data
      let schemaData = schemaResult?.data?.data?.fields
      if (schemaData) {
        Object.keys(schemaData).forEach((key) => {
          if (schemaData[key].type === "date") {
            schemaData[key]["default"] = formatDate(userData[key])
          } else schemaData[key]["default"] = userData[key] ?? ""
        })

        schema.value = schemaData
      }
    }

    return {
      address,
      showSuccess,
      comprules,
      mandatoryrules,
      voluntaryrules,
      config,
      model,
      schema,
      formData,
      vueForm,
      onSubmit,
      removeErrors,
      namerule,
      surnamerule,
      phonerule,
      niprule,
      handleSubmit,
      toggleSelection,
    }
  },
}
</script>

<style>
fieldset {
  border: none;
}
.image {
  width: 100%;
  margin: 0 auto 10px auto;
  background: transparent;
}
.v-list-item__subtitle {
  white-space: wrap;
}

.item_action {
  margin-right: 15px !important;
  align-self: flex-start;
  margin: unset;
  margin-top: -2px;
}

.list_item {
  align-items: flex-start;
}

.list {
  background: transparent;
}

.page_title {
  text-align: center;
  font-size: 18px;
  text-transform: uppercase;
}

.field-checkbox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.form-group.error .errors {
  color: #222222;
}

.new_error {
  background-color: #ecc2c2 !important;
  border-color: #ecc2c2 !important;
  border: 1px solid #ecc2c2;
  background-color: #ecc2c2;
}
.v-list-item__content {
  display: flex;
}
.v-list-item--one-line .v-list-item-subtitle {
  -webkit-line-clamp: unset !important;
  line-clamp: unset !important;
}

.v-selection-control {
  align-items: baseline !important;
}

.vf-errors {
  display: none;
}
</style>
