<template>
  <div>

  </div>
</template>
<script>
import companyconfig from "@/core/companyconfig";
import auth from "@/core/auth";

export default {
  data() {
    return {
      config: {},
    };
  },
  mounted() {
    this.setupConfig();
  },
  methods: {
    setupConfig() {
      let passedCompanyId = companyconfig.getCompanyIdfromUrl();
      console.log('auth.isLoggedIn() ' + auth.isLoggedIn());
      if(auth.isLoggedIn()) {
        window.location = "?company_name=" + passedCompanyId;
      } else {
        window.location = "https://demo.2take.it/uvp/?cn=" + passedCompanyId;
      }
    },
  }
};
</script>
