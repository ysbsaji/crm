<template>
<v-app style="background-image:url('https://thumbs.dreamstime.com/b/crm-customer-relationship-management-tablet-office-desk-150255008.jpg">
  <div>
    <div style="width:600px; margin-top:15%; border:1px solid cyan" class="mx-auto">
      <v-card class="px-4">
        <v-card-title>
          <v-icon large>mdi-account</v-icon>
          <div class="display-1 py-1 ml-3">Login</div>
        </v-card-title>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="loginEmail" :rules="loginEmailRules" label="E-mail" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="loginPassword" :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6" xsm="12">
                </v-col>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                  <v-btn x-large block :disabled="!valid" color="success" @click="loginFunction"> Login </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
      </v-card>
    </div>
    <v-snackbar
      v-model="snackbar"
      text
      color="red" 
    >Invalid email or password...Please do register 
    </v-snackbar>
     <v-dialog
      v-model="loadingDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please wait while loading
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  </v-app>
</template>

<script>
export default {
  data(){
    return{
      loadingDialog: false,
      snackbar: false,
      dialog: true,
      valid: true,
      loginPassword: "",
      loginEmail: "",
      userDetails:[],
      loginEmailRules: [
        v => !!v || "Required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      emailRules: [
        v => !!v || "Required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      show1: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => (v && v.length >= 8) || "Min 8 characters"
      }
    }
  },
  methods: {
    loginFunction(){
      this.userDetails.find(val => {
        if(val.email === this.loginEmail & val.password === this.loginPassword){
          this.loginEmail = 0 
          this.callTheUser(val)
        }
      })
      if(this.loginEmail !== 0){
        this.callTheUser()
      }
      this.$refs.loginForm.reset();
      this.$refs.loginForm.resetValidation();
    },
    callTheUser(user){
      this.loginEmail === 0 ?  (this.$store.commit('login', user),this.loadingDialog = true) : this.snackbar = true
    },
    getUserDetail(){
      if(localStorage.getItem('empDetails')){
        let empDetails = localStorage.getItem('empDetails')
        let details = JSON.parse(empDetails)
        details.forEach(val => {
        this.userDetails.push(val)
        })
      }
    },
  },
  watch: {
    loadingDialog (val) {
      if (!val) return
      setTimeout(() => (this.loadingDialog = false,this.$store.commit('athendication', true), this.$router.push('dashbord')), 2000)
    }
  },
  mounted(){
    this.getUserDetail()
  }
}
</script>

<style>

</style>
