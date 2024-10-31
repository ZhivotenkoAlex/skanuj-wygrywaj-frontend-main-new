<template>
  <v-card flat tile :style="`background:#fff0;`">
    <v-toolbar flat dense :color="config.mcolor">
      <!-- <v-btn
        icon;
        class="border0px"
        @click="navigate"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn> -->
      <v-toolbar-title
        v-text="$t('PersonalData.TITLE')"
        :style="`color:#fff;`"
      ></v-toolbar-title>
      <!-- <v-spacer></v-spacer>
      <v-btn
        icon
        class="border0px"
        @click="navigatehome"
        :style="`color:${config.mfontcolor} !important`"
      >
        <v-icon>mdi-home-circle-outline</v-icon>
      </v-btn> -->
    </v-toolbar>
    <v-card
      v-if="isLoaded"
      flat
      class="monster-personal-data"
      style="
        margin: 5px 20px 40px;
        border-radius: 20px;
        width: 90%;
        background-color: #ffffffb3;
      "
    >
      <v-card-text>
        <v-row>
          <v-col class="col-12">
            <v-form v-model="address.valid" ref="addrForm" class="dataform">
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.NAME')"
                class="account-input"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                v-model="address.name"
                :rules="[
                  (value) => {
                    return purchasenamerule(value)
                  },
                ]"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.LAST_NAME')"
                class="account-input"
                name="surname"
                prepend-icon="mdi-account"
                type="text"
                v-model="address.surname"
                :rules="[
                  (value) => {
                    return purchasesurnamerule(value)
                  },
                ]"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.PHONE')"
                class="account-input"
                name="phone"
                prepend-icon="mdi-phone"
                type="text"
                v-model="address.phone"
                :rules="[
                  (value) => {
                    return purchasephonerule(value)
                  },
                ]"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="'E-mail'"
                class="account-input"
                name="contact_email"
                prepend-icon="mdi-email"
                type="text"
                v-model="address.contact_email"
                :rules="[
                  (value) => {
                    return purchaseemailrule(value)
                  },
                ]"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.COUNTRY')"
                class="account-input"
                name="contact_country"
                prepend-icon="mdi-map-marker"
                type="text"
                v-model="address.country"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.CITY')"
                class="account-input"
                name="contact_city"
                prepend-icon="mdi-city"
                type="text"
                v-model="address.city"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.ZIP_CODE')"
                class="account-input"
                name="contact_zip"
                prepend-icon="mdi-postage-stamp"
                type="text"
                v-model="address.zip_code"
              ></v-text-field>

              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.STREET')"
                class="account-input"
                name="contact_street_address"
                prepend-icon="mdi-home-city"
                type="text"
                v-model="address.street_address"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.HOUSE_NUMBER')"
                class="account-input"
                name="s"
                prepend-icon="mdi-home"
                type="text"
                v-model="address.street_number"
              ></v-text-field>
              <v-text-field
                autocomplete="off"
                filled
                dense
                :placeholder="$t('PersonalData.APARTMENT_NUMBER')"
                class="account-input"
                name="contact_apartment_number"
                prepend-icon="mdi-door"
                type="text"
                v-model="address.apartment_number"
              ></v-text-field>

              <v-alert
                v-if="showSuccess"
                color="green"
                type="success"
                dismissible
              >
                {{ $t("PersonalData.SUCCESS") }}
              </v-alert>
              <alert
                :errorType="address.errtype"
                :errorMessage="address.errors"
                :alert="address.showerror"
              ></alert>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          id="receipt-action-btn"
          block
          :loading="address.loading"
          :disabled="address.loading"
          color="primary"
          @click="saveData"
          v-text="$t('PersonalData.SAVE')"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>
<script>
import {
  NO_COMPANY_FOUND,
  SAVED_SUCCESSFULLY,
  UNABLE_TO_SAVE,
  COMPANY_URL_IS_REQUIRED,
  USER_DONT_BELONG_TO_THIS_COMPANY,
} from "@/appConstants"
import companyconfig from "@/core/companyconfig"
import api from "@/services/fetchapi"
import auth from "@/core/auth"
import alert from "@/components/shared/errorAlert"

export default {
  data() {
    return {
      tabaddr: "",
      product: {
        id: 0,
        name: "",
        description: "",
        picture: "",
        price: 0,
        is_virtual: false,
      },
      isLoaded: false,
      config: {},
      showSuccess: false,
      address: {
        full_name: "",
        street_number: "",
        apartment_number: "",
        street_address: "",
        city: "",
        country: "",
        zip_code: "",
        errtype: "error",
        errors: "",
        showerror: false,
        loading: false,
      },
    }
  },
  created() {
    this.id = this.$route.params.id
    this.setupLayout()
    this.loadAddress()
  },
  mounted() {
    this.styleTag = document.createElement("style")
    this.styleTag.appendChild(document.createTextNode(this.config.custom_css))
    document.head.appendChild(this.styleTag)
  },
  methods: {
    /**
     * Set the Intial color configuration for page
     */
    setupLayout() {
      let data = companyconfig.getCompanyScheme()
      if (data != "") {
        this.$set(this.config, "mcolor", data.main_color)
        this.$set(this.config, "mfontcolor", data.main_font_color)
        this.$set(this.config, "pcolor", data.primary_color)
        this.$set(this.config, "pfontcolor", data.primary_font_color)
        this.$set(this.config, "custom_css", data.layout_custom_css)
        this.$set(this.config, "innercolor", data.layout_background_color_inner)
        this.$set(this.config, "outercolor", data.layout_background_color_outer)
      }
    },
    /**
     * Submit the user details
     */
    saveData() {
      let isvalid = this.$refs.addrForm.validate()
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      if (isvalid) {
        let token = auth.getAccessToken()
        this.address.showerror = false
        this.address.loading = true
        let self = this

        api
          .saveUserdata(
            token,
            passedCompanyId,
            this.address.name,
            this.address.surname,
            this.address.phone,
            this.address.contact_email,
            this.address.street_number,
            this.address.apartment_number,
            this.address.street_address,
            this.address.zip_code,
            this.address.city,
            this.address.country
          )
          .then(function (response) {
            let msg = response.data.message
            if (msg === SAVED_SUCCESSFULLY) {
              self.showSuccess = true
            } else {
              self.showSuccess = false
              self.address.errors = self.$t("Errors.FAILED_TO_SAVE")
              self.address.showerror = true
              self.$refs.addrForm.name.focus()
            }
            self.address.loading = false
          })
          .catch(function (error) {
            let errmsg = error.data.message
            if (errmsg === UNABLE_TO_SAVE) {
              let errObj = error.data.error
              if (
                errObj.url_name &&
                errObj.url_name[0] === COMPANY_URL_IS_REQUIRED
              ) {
                self.address.errors = self.$t("Errors.COMPANY_URL_IS_REQUIRED")
              }
              if (errObj.url_name && errObj.url_name[0] === NO_COMPANY_FOUND) {
                self.address.errors = self.$t("Errors.NO_COMPANY_FOUND")
              } else if (
                errObj.money &&
                errObj.money[0] === USER_DONT_BELONG_TO_THIS_COMPANY
              ) {
                self.address.errors = self.$t(
                  "Errors.USER_DONT_BELONG_TO_THIS_COMPANY"
                )
              }
            } else {
              self.address.errors = self.$t("Errors.FAILED_TO_PURCHASE")
            }
            self.showSuccess = false
            self.address.showerror = true
            self.address.loading = false
          })
      }
    },
    /** Purchase Name Mandatory rule */
    purchasenamerule(value) {
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      return true
    },
    purchasesurnamerule(value) {
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      return true
    },
    purchasephonerule(value) {
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      return true
    },
    purchaseemailrule(value) {
      if (!value) {
        return this.$t("PersonalData.REQUIRED")
      }
      return true
    },
    /**
     * Load the user address details
     */
    loadAddress() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      let token = auth.getAccessToken()
      api
        .getUserAddress(token, passedCompanyId)
        .then((result) => {
          let response = result.data
          if (response.data) {
            let data = response.data
            this.address.name = data.name
            this.address.surname = data.surname
            this.address.phone = data.phone
            this.address.contact_email = data.contact_email

            this.address.country = data.country
            this.address.city = data.city
            this.address.street_number = data.street_number
            this.address.apartment_number = data.apartment_number
            this.address.street_address = data.street_address
            this.address.zip_code = data.zip_code

            this.isLoaded = true
          }
        })
        .catch((err) => {
          let errmsg = err.data.message
          if (errmsg === NO_COMPANY_FOUND) {
            console.log(err)
          }
        })
    },
    /**
     * Navigate tp previous url
     */
    navigate() {
      this.$router.go(-1)
    },
    /**
     * Navigate to home page
     */
    navigatehome() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl()
      this.$router.push({
        name: "home",
        query: { company_name: passedCompanyId },
      })
    },
  },
  components: {
    alert,
  },
}
</script>

<style>
.v-messages__message {
  font-size: 12px;
}

.v-label {
  display: none;
}

.v-text-field > .v-input__control > .v-input__slot:after,
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  display: none;
}

button.receipt-action-btn {
  display: none !important;
}

.v-text-field__details {
  display: none;
}

.error--text .v-text-field__details {
  display: flex;
}

.v-input--dense {
  margin-bottom: 5px;
  min-height: 35px !important;
}
.account-input .v-field__input {
  min-height: 20px !important;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}

.v-selection-control .v-label {
  text-align: left;
}
</style>
