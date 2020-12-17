<template>
  <div>
    <v-form
      ref="empForm"
    >
      <v-container fluid>
      <v-banner
      color="cyan"
      class="text-center my-3"
      style="border-radius:4px"
      >
        <P class="display-1">User Mangement</P>
      </v-banner>
        <v-row>
          <v-col
            cols="12"
            lg="3"
          >
            <v-text-field
              v-model="name"
              :rules="[rules.required]"
              counter="25"
              label="Name"
              dense
              outlined
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            lg="3"
          >
            <v-text-field
              v-model="email"
              :rules="[rules.required,rules.email]"
              counter="25"
              label="Email"
              dense
              outlined
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            lg="3"
          >
            <v-text-field
              v-model="phonenum"
              :rules="[rules.required,rules.number,rules.min1]"
              counter="25"
              dense
              label="Phone Number"
              outlined
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            lg="3"
          >
            <v-select
              :items="employeeRoll"
              label="Roll"
              v-model="emproll"
              dense
              outlined
            ></v-select>
          </v-col>
          <v-col
            cols="12"
            lg="3"
          >
           <v-text-field 
            v-model="password"
            outlined
            dense 
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" 
            :rules="[rules.required,rules.min]" 
            :type="show1 ? 'text' : 'password'" 
            name="input-10-1" 
            label="Password" 
            hint="At least 8 characters" 
            counter 
            @click:append="show1 = !show1">
           </v-text-field>
          </v-col>
          <v-col
            cols="12"
            lg="3"
          >
            <v-text-field 
              block 
              dense
              outlined
              v-model="verify" 
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" 
              :rules="[rules.required, passwordMatch]" 
              :type="show1 ? 'text' : 'password'" 
              name="input-10-1" 
              label="Confirm Password" 
              counter 
              @click:append="show1 = !show1">
            </v-text-field>
          </v-col>
          <v-col
          cols="12"
          sm="6"
          lg="3"
          >
          <v-file-input
            label="File input"
            outlined
            dense
            @change="CreateImage"
          ></v-file-input>
        </v-col>
          <v-col
            cols="12"
            lg="1"
          >
            <v-btn
              depressed
              v-show="saveBtn"
              @click="saveEmpDetail"
              color="primary"
            >Save</v-btn>
            <v-btn
              depressed
              v-show="updateBtn"
              @click="updateEmpDetails"
              color="primary"
            >Update</v-btn>
          </v-col>
          <v-col
            cols="12"
            lg="2"
          >
            <v-btn
              depressed
              @click="cancel"
              color="red"
            >Cancel</v-btn>
          </v-col>
        </v-row>
      </v-container>
  </v-form>
  <v-data-table
    :headers="headers"
    :items="empDetails"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:[`item.action`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editEmployee(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="delDialog = true; deleteId = item.id"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
    <span>No data here</span> 
    </template>
    </v-data-table>
    <v-dialog
      v-model="delDialog"
      max-width="320"
    >
      <v-card>
        <v-card-title>
          Are you sure want to delete ? 
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="confirmDel"
          >
            Yes
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="delDialog = false"
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
     <v-snackbar
      v-model="snackbar"
      color="red"
    >This email is already exits
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data(){
    return{
      saveBtn: true,
      updateBtn: false,
      name:'',
      email:'',
      snackbar: false,
      phonenum:'',
      show1: false,
      delDialog: false,
      editId: '',
      deleteId: '',
      emproll:'',
      verify: '',
      password: '',
      image:'',
      employeeRoll:['staff', 'admin'],
      rules: {
        required: value => !!value || 'Required.',
        number: value => !isNaN(value) || 'Invalid input',
        min1: v => (v && v.length >= 10) || "Min 10 characters",
        email: v => /.+@.+\..+/.test(v) || "E-mail must be valid",
        min: v => (v && v.length >= 8) || "Min 8 characters"
      },
      headers: [
        { text: 'Id', align: 'start', value: 'id'},
        { text: 'Name', align: 'start', value: 'name' },
        { text: 'Email', value: 'email', align: 'start', },
        { text: 'Phone Number', align: 'start', value: 'phonenum' },
        { text: 'Employee Roll', align: 'start', value: 'emproll' },
        { text: 'Password', align: 'start', value: 'password' },
        { text: 'Actions', align: 'start', value: 'action', sortable: false }
      ],
      empDetails:[]
    }
  },
  computed: {
  passwordMatch() {
    return () => this.password === this.verify || "Password must match";
  }
  },
   methods: {
    saveEmpDetail(){
      if(this.$refs.empForm.validate()){
      if(this.empDetails.length > 0){
      for (let i in this.empDetails){
        if(this.email === this.empDetails[i].email){
          this.snackbar = true
          break
        }else{
          this.empDetails.push({id:Math.floor(Math.random() * 100) + 1,url:this.image, name:this.name,email:this.email,phonenum:this.phonenum,emproll:this.emproll,password:this.password})
          break
        }
      }
      }else{
        this.empDetails.push({id:Math.floor(Math.random() * 100) + 1,url:this.image, name:this.name,email:this.email,phonenum:this.phonenum,emproll:this.emproll,password:this.password})
      }
      }
      localStorage.setItem('empDetails',JSON.stringify(this.empDetails))
      this.$refs.empForm.reset()
    },
    editEmployee(item){
      this.saveBtn = false
      this.updateBtn = true
      this.editId = item.id
      this.id = item.id
      this.name = item.name
      this.email = item.email
      this.phonenum = item.phonenum
      this.emproll = item.emproll
      this.password = item.password
    },
    updateEmpDetails(){
      this.empDetails.find((val) => {
        if(val.id === this.editId){
          val.name = this.name
          val.email = this.email
          val.phonenum = this.phonenum
          val.emproll = this.emproll
          val.password = this.password
        }
      })
      localStorage.setItem('empDetails',JSON.stringify(this.empDetails))
      this.saveBtn = true
      this.updateBtn = false
      this.$refs.empForm.reset() 
    },
    cancel(){
      this.$refs.empForm.reset()
    },
    confirmDel(){
      this.delDialog = false
      console.log(this.deleteId);
      this.empDetails.find((val,index) => { 
        val.id === this.deleteId ? this.empDetails.splice(index,1) : false
        console.log(this.empDetails);
      })
      localStorage.setItem('empDetails',JSON.stringify(this.empDetails))
    },
    getEmpData(){
      if(localStorage.getItem('empDetails')){
        let empDetails = localStorage.getItem('empDetails')
        this.empDetails = JSON.parse(empDetails)
      }
    },
    CreateImage(file){
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.image = e.target.result
        })
        reader.readAsDataURL(file)
    }
  },
  mounted(){
    this.getEmpData()
  }
}
</script>

<style>

</style>