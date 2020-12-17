<template>
  <div>
    <v-container fluid>
     <v-banner
        color="cyan"
        class="text-center my-3"
        style="border-radius:4px"
      >
        <P class="display-1">Order Mangement</P>
      </v-banner>
      <v-row>
        <v-col cols="12" lg="9">
          <v-btn 
            depressed
            @click="orderManage"
            color="primary"
            v-if="$store.state.login.emproll === 'admin'"
          >
            Make Order
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
        v-model="orderDialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="orderDialog = false ; $refs.form.reset()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Order Management</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                  color="blue darken-1"
                  @click="cancel"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  v-show="saveBtn"
                  @click="saveOrder"
                >
                  Save
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  v-show="updateBtn"
                  @click="updateOrder"
                >
                  Update
                </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-form
          ref="form"
          >
            <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-select
                  :items="customerName"
                  v-model="cusName"
                  :rules="[rules.required]"
                  label="Choose Customer"
                  dense
                  outlined
                ></v-select>
                </v-col>
                  <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-select
                    :items="inchargeName"
                    dense
                    v-model="incharge"
                    :rules="[rules.required]"
                    label="Incharge"
                    outlined
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Select date"
                      prepend-icon="mdi-calendar"
                      readonly
                      outlined
                      :rules="[rules.required]"
                      dense
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="date"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1950-01-01"
                    @change="save"
                  ></v-date-picker>
                </v-menu>
                </v-col>
                  <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-select
                    :items="productName"
                    dense
                    multiple
                    v-model="proName"
                    :rules="[rules.required]"
                    label="Product List"
                    outlined
                  ></v-select>
                </v-col>
                  <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-text-field
                    dense
                    v-model="quantity"
                    :rules="[rules.required,rules.number]"
                    label="quantity"
                    outlined
                  ></v-text-field>
                </v-col>
                  <v-col
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-select
                    :items="status"
                    dense
                    v-model="status1"
                    :rules="[rules.required]"
                    label="status"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
          </v-form>
            <v-divider></v-divider>
            <v-data-table
              :headers="headers1"
              :items="showProduct"
              :items-per-page="5"
              class="elevation-1"
            >
            </v-data-table>
        </v-card>
      </v-dialog>
    </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="orderDetails"
       :search="search"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:[`item.productManage`]="{ item }">
        <p @click="manageProduct(item)">manage Product</p>
      </template>
    <template v-slot:[`item.action`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editOrder(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="delDialog = true ; deleteId = item.id"
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
      orderDialog: false,
      delDialog: false,
      date: '',
      menu: false,
      cusName: '',
      incharge: '',
      search: '',
      proName: '',
      status1: '',
      editId:'',
      deleteId: '',
      quantity: '',
      productId:'',
      productName: [],
      status: ['ordered','shipped','arrived','delivered'],
      customerName:[],
      inchargeName:[],
      showProduct: [],
      rules: {
        required: value => !!value || 'Required.',
        number: value => !isNaN(value) || 'Invalid input',
      },
      headers:[
        { text: 'Id', align: 'start', value: 'id' },
        { text: 'Customer Name', align: 'start',  value: 'cusName'  },
        { text: 'Incharge Name', align: 'start', value: 'incharge' },
        { text: 'Date', align: 'start', value: 'date' },
        { text: 'Actions', align: 'start', value: 'action', sortable: false }
      ],
      headers1:[
        { text: 'Product List', align: 'start', value: 'proList' },
        { text: 'Quantity', align: 'start', value: 'quantity' },
        { text: 'Status', align: 'start', value: 'status' },
      ],
      orderDetails:[]
    }
  },
  methods:{
    saveOrder(){
      if(this.$refs.form.validate()){
      this.orderDetails.push({id:Math.floor(Math.random() * 100) + 1,cusName:this.cusName,incharge:this.incharge,date:this.date,proList:this.proName,quantity:this.quantity,status:this.status1})
      this.orderDialog = false
      localStorage.setItem('orderDetails', JSON.stringify(this.orderDetails))
      this.$refs.form.reset()
      }
    },
    updateOrder(){
      this.orderDetails.find((val) => {
        if(val.id === this.editId){
          val.cusName = this.cusName
          val.incharge = this.incharge
          val.date = this.date
          val.quantity = this.quantity
          val.proList = this.proName
          val.status = this.status1
        }
      })
      let orderDetails = localStorage.getItem('orderDetails')
      let details = JSON.parse(orderDetails)
      details.find(val => {
        if(val.id === this.editId){
          val.cusName = this.cusName
          val.incharge = this.incharge
          val.date = this.date
          val.quantity = this.quantity
          val.proList = this.proName
          val.status = this.status1
        }
      })
      localStorage.setItem('orderDetails',JSON.stringify(details))
      this.orderDialog = false
      this.saveBtn = true
      this.updateBtn = false
      this.$refs.form.reset()
    },
    editOrder(item){
      this.showProduct = []
      this.orderDialog = true
      this.editId = item.id
      this.saveBtn = false
      this.updateBtn = true
      this.quantity = item.quantity
      this.cusName = item.cusName
      this.incharge = item.incharge
      this.date = item.date
      this.proName = item.proList
      this.status1 = item.status
      this.showProduct.push(item)
    },
    confirmDel(){
      this.delDialog = false
      this.orderDetails.find((val,index) => { 
        val.id === this.deleteId ? this.orderDetails.splice(index,1) : ''
      })
      let orderDetails = localStorage.getItem('orderDetails')
      let details = JSON.parse(orderDetails)
      details.find((val,index) => {
        val.id === this.deleteId ? details.splice(index,1) : ''
      })
      localStorage.setItem('orderDetails',JSON.stringify(details))
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    cancel(){
      this.orderDialog = false
      this.$refs.form.resetValidation()
    },
    orderManage(){
       this.orderDialog = true
       this.showProduct = []
       this.saveBtn = true
       this.updateBtn = false
    },
    getDetails(){
      if(localStorage.getItem('cusDetails')){
        let cusDetails = localStorage.getItem('cusDetails')
        let details = JSON.parse(cusDetails)
        details.forEach(val => {
        this.customerName.push(val.name)
        })
      }
      if(localStorage.getItem('empDetails')){
        let empDetails = localStorage.getItem('empDetails')
        let details = JSON.parse(empDetails)
        details.forEach(val => {
        this.inchargeName.push(val.name)
        })
      }
     
      if(localStorage.getItem('productDetails')){
      let productDetails = localStorage.getItem('productDetails')
      let details = JSON.parse(productDetails)
      details.forEach(val => {
      this.productName.push(val.name)
      })
      }
      switch(this.$store.state.login.emproll){
        case 'admin':
          if(localStorage.getItem('orderDetails')){
          let orderDetails = localStorage.getItem('orderDetails')
          this.orderDetails = JSON.parse(orderDetails)
          }
          break
        case 'staff':
          if(localStorage.getItem('orderDetails')){
          let orderDetails = localStorage.getItem('orderDetails')
          let details = JSON.parse(orderDetails)
          details.find(val =>{ 
            val.incharge === this.$store.state.login.name ? this.orderDetails.push(val) : false })
          }
          break
      }
    }
  },
   watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'DATE'))
    },
  },
  mounted(){
    this.getDetails()
    this.date = new Date().toISOString().substr(0, 10)
  }
}
</script>

<style>

</style>