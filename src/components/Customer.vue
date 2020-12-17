<template>
  <div>
    <v-container fluid>
      <v-banner
        color="cyan"
        class="text-center my-3"
        style="border-radius:4px"
      >
        <P class="display-1">Customer Mangement</P>
      </v-banner>
      <v-row>
        <v-col cols="12" lg="9">
          <v-btn 
            depressed
            fab
            @click="customerDialog = true"
            color="primary"
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" lg="3">
          <v-text-field
            v-model="search"
            outlined
            dense
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-dialog
          v-model="customerDialog"
          persistent
          max-width="600px"
        >
        <v-form
          ref="cusForm"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Customer Details</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      label="Name"
                      v-model="name"
                      outlined
                      dense
                      :rules="[rules.required]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      label="Email"
                      v-model="email"
                      dense
                      outlined
                      :rules="[rules.required,rules.email]"
                      required
                    ></v-text-field>
                  </v-col>
                   <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      label="Phone Number"
                      v-model="phonenumber"
                      dense
                      outlined
                      :rules="[rules.required,rules.number,rules.min]"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="cancel"
              >
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                v-show="saveBtn"
                @click="saveCustomerDetails"
              >
                Save
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                v-show="updateBtn"
                @click="updateCustomerDetails"
              >
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
          </v-form>
        </v-dialog>
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="customerDetails"
      :search="search"
      :items-per-page="5"
      class="elevation-1"
    >
    <template v-slot:[`item.action`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editCustomer(item)"
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
  </div>
</template>

<script>
export default {
  data(){
    return{
      saveBtn: true,
      updateBtn: false,
      delDialog: false,
      name: '',
      email: '',
      search:'',
      phonenumber: '',
      deleteId: '',
      editId: '',
      customerDialog: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => (v.length >= 10) || "Min 10 characters",
        number: value => !isNaN(value) || 'Invalid input',
        email: v => /.+@.+\..+/.test(v) || "E-mail must be valid",
      },
      headers: [
        { text: 'Name', align: 'start', value: 'name'},
        { text: 'Email', align: 'start', value: 'email' },
        { text: 'Phone Number', align: 'start', value: 'phonenum' },
        { text: 'Actions', align: 'start', value: 'action', sortable: false }
      ],
      customerDetails:[]
    }
  },
  methods: {
    saveCustomerDetails(){
      if(this.$refs.cusForm.validate()){
      this.customerDialog = false
      this.customerDetails.push({id:Math.floor(Math.random() * 100) + 1, name:this.name,email:this.email,phonenum:this.phonenumber})
      localStorage.setItem('cusDetails',JSON.stringify(this.customerDetails))
      this.$refs.cusForm.reset()
      }
    },
    editCustomer(item){
      this.saveBtn = false
      this.updateBtn = true
      this.customerDialog = true
      this.editId = item.id
      this.name = item.name
      this.email = item.email
      this.phonenumber = item.phonenum
    },
    updateCustomerDetails(){
      this.customerDetails.find((val) => {
        if(val.id === this.editId){
          val.name = this.name
          val.email = this.email
          val.phonenum = this.phonenumber
        }
      })
      localStorage.setItem('cusDetails',JSON.stringify(this.customerDetails))
      this.customerDialog = false
      this.saveBtn = true
      this.updateBtn = false
      this.$refs.cusForm.reset()
    },
    confirmDel(){
      this.delDialog = false
      this.customerDetails.find((val,index) => { 
        val.id === this.deleteId ? this.customerDetails.splice(index,1) : ''
      })
      localStorage.setItem('cusDetails',JSON.stringify(this.customerDetails))
    },
    cancel(){
      this.customerDialog = false
      this.$refs.cusForm.resetValidation()
    },
    getCusData(){
      if(localStorage.getItem('cusDetails')){
        let cusDetails = localStorage.getItem('cusDetails')
        let details = JSON.parse(cusDetails)
        details.forEach(val => {
        this.customerDetails.push(val)
        })
      }
    }
  },
  created(){
    this.getCusData()
  }
}
</script>

<style>

</style>