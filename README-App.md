1. Material Design framework - Veutify (https://vuetifyjs.com)
2. Packages
   Axios(https://www.npmjs.com/package/axios)
   vue-localstorage 
   Facebook login (https://github.com/phanan/vue-facebook-signin-button)
   Gmail login  (https://github.com/phanan/vue-google-signin-button)
   Vue router

3. App structure

App/
  Public     
    index.html - Index file that declares the root div where the App component is been bound to  	
  src/
    - assets - All assets reside here
    - components - All our Vue base components resides here. eg: Auth, shared  
    - router - Our router is defined here
    - service - API access will be defined here. with local storage access too.
    - views - Actual view components which act as main pages
    - App.vue - The Parent component
    - main.js - Starting point for our app where the router, template and App component are bound to the root app div.
    - variable.js - base urls and configs  
  static/ - contains static files
  package.json - File that contains the names of all the packages residing in node_modules folder
  vue.config.js - vuetify settings
