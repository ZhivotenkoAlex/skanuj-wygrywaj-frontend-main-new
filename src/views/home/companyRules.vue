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
      <v-card flat style="background-color: #fff0">
        <div class="panel-body">
          <form @submit.prevent="doAccept">
            <vue-form-generator
              :schema="schema"
              :model="model"
              :options="formOptions"
              style="margin: 10px"
              @submit="doAccept"
              @validated="onValidated"
              ref="form"
            >
            </vue-form-generator>
          </form>
        </div>
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
          @click="rule.selected = !rule.selected"
          class="py-3 list_item"
        >
          <v-list-item-action class="item_action">
            <v-checkbox
              :color="config.mcolor"
              :value="rule.selected"
              v-model="rule.selected"
              @click="rule.selected = !rule.selected"
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
          @click="rule.selected = !rule.selected"
          class="py-3 list_item"
        >
          <v-list-item-action class="item_action">
            <v-checkbox
              :color="config.mcolor"
              :value="rule.selected"
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
    <v-flex class="justify-center mx-3">
      <v-alert v-if="showSuccess" color="green" type="success" dismissible>
        {{ $t("PersonalData.SUCCESS") }}
      </v-alert>

      <v-btn
        block
        :color="config.mcolor"
        :style="`color:#fff !important`"
        @click="doAccept"
        v-text="$t('LoginScreen.ACCEPT_BTN')"
      ></v-btn>
    </v-flex>
  </v-card>
</template>
<script>
import { NO_COMPANY_FOUND } from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import alert from "@/components/shared/errorAlert.vue"
import auth from "@/core/auth"
import api from "@/services/fetchapi"
// import Vue from "vue"
import VueFormGenerator from "vue-form-generator"
// import "vue-form-generator/dist/vfg-core.css"

// Vue.use(VueFormGenerator)
export default {
  data() {
    return {
      address: {
        name: "",
        valid: false,
        errtype: "error",
        errors: "",
        showerror: false,
      },
      showSuccess: false,
      comprules: [],
      mandatoryrules: [],
      voluntaryrules: [],
      config: {},
      model: {},
      schema: {},
      formOptions: {
        validateAfterChanged: true,
        validateBeforeSubmit: true,
        submitHandler: this.handleSubmit,
        validationErrorClass: "new_error",
      },
    }
  },
  async mounted() {
    this.getFormScheme()
    this.setupLayout()
    this.loadRules()
    this.fetchAddress()
  },

  methods: {
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "pfontcolor", data.main_font_color)
        this.$set(this.config, "shortlogo", data.logo_image)
      }
    },
    // onValidated(isValid, errors) {},
    onSubmit(form) {
      return form
    },
    async getModel() {
      const token = auth.getAccessToken()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      const modelOrderObject = {}

      api.getUserData(token, passedCompanyId).then((result) => {
        let response = result.data
        if (response.data) {
          let data = response.data
          this.schema.fields.forEach((field) => {
            const value =
              !data[field.model] && field.type == "checkbox"
                ? false
                : data[field.model]
            this.$set(this.model, field.model, value)
          })
        }
      })

      return modelOrderObject
    },

    /** Accept the rules */
    doAccept() {
      const isValid = this.$refs.form.validate()
      // if (!isValid) {
      //   return
      // }
      const formData = this.model
      this.comprules = [...this.mandatoryrules, ...this.voluntaryrules]
      let items = this.comprules.filter((a) => a.selected == true)
      const isMandatoryTermsSelected = this.mandatoryrules.every(
        (rule) => rule.selected
      )

      if (!isMandatoryTermsSelected) {
        this.address.errors = this.$t("Errors.NEED_REQUIRED_TERMS_ACCEPTANCE")
        this.address.showerror = true
        return
      }

      if (items.length !== 0 && isValid) {
        let ids = items.map((e) => e.id).join(",")
        let passedCompanyId = companyconfig.getCompanyIdfromUrl()
        let token = auth.getAccessToken()
        let lang = auth.getAppLanguage()
        api.saveUserdataForRules(token, formData)
        api
          .agreeCompanyRules(token, passedCompanyId, lang, ids)
          .then(() => {
            this.movetoIndex()
          })
          .catch(() => {
            this.movetoIndex()
          })
      }
    },
    /** Navigate to home page */
    movetoIndex() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    },
    fetchAddress() {
      let token = auth.getAccessToken()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      api.getUserAddress(token, passedCompanyId).then((result) => {
        let response = result.data
        if (response.data) {
          let data = response.data
          this.address.name = data.name
          this.address.surname = data.surname
          this.address.phone = data.phone
          this.address.nip = data.nip
          this.isLoaded = true
        }
      })
    },
    /** Load the rules */
    loadRules() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      let lang = auth.getAppLanguage()
      api
        .getCompanyRules(token, passedCompanyId, lang)
        .then((result) => {
          let response = result.data
          if (response.data.length != 0) {
            let rules = response.data
            rules.forEach((element) => {
              element.selected = false
              if (element.is_mandatory === "1") {
                this.mandatoryrules.push(element)
              } else {
                this.voluntaryrules.push(element)
              }
            })
          } else {
            this.movetoIndex()
          }
        })
        .catch((err) => {
          let errormsg = err.data.message
          if (errormsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
          this.movetoIndex()
        })
    },
    namerule(value) {
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      return true
    },
    surnamerule(value) {
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      return true
    },
    phonerule(value) {
      const phoneNumberRegex =
        /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\s.-]{7,10}$/
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      if (!phoneNumberRegex.test(value)) {
        return this.$t("Errors.INVALID_PHONE")
      }
      return true
    },
    niprule(value) {
      const nipRegex = /^\d{10}$/
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      if (!nipRegex.test(value)) {
        return this.$t("Errors.INVALID_NIP")
      }
      return true
    },
    removeErrors() {
      this.address.errors = ""
      this.address.showerror = false
    },
    getFormScheme() {
      const passedCompanyId = companyconfig.getCompanyIdfromUrl()
      const token = auth.getAccessToken()
      api.getCompanyRulesFormScheme(token, passedCompanyId).then((result) => {
        let response = result.data
        if (response.data) {
          let data = response.data
          this.schema = data
          this.getModel()
        }
      })
    },
  },
  components: {
    alert,
    VueFormGenerator,
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
</style>
