<template>
<div>
  <v-row>
    <v-col cols="12" lg="9">
      <v-btn 
        depressed
        @click="orderManage"
        color="primary"
      >
        Make Order
      </v-btn>
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
          @click="orderDialog = false ; shownProduct = true; $refs.form.$refs.validateForm.reset()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Order Management</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
        </v-toolbar-items>
      </v-toolbar>
      <form-data :references.sync="formReferences" :model="orderObj" ref="form"> 
      </form-data>
      <v-divider></v-divider>
      <v-btn 
        depressed
        @click="productFunction"
        color="primary"
        v-if="!shownProduct"
      >
        Add Product
      </v-btn>
      <v-row justify="center">
        <v-dialog
          v-model="productdia"
          persistent
          max-width="600px"
        >
        <v-card>
          <form-data :references.sync="formReferences1" :model="productObj" ref="form1"></form-data>
        </v-card>
        </v-dialog>
      </v-row>
      <v-simple-table v-if="!shownProduct">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Product</th>
              <th class="text-left">Quantity</th>
              <th class="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in productShownArr" :key="index">
              <td>{{ item.product }}</td> 
              <td>{{ item.quantity }}</td>
              <td>{{ item.status }}</td>
              <td><v-icon small @click="EditProducts(index)"> mdi-pencil </v-icon>
              <v-icon small @click="del1(index)" class="mx-3"> mdi-delete </v-icon>
              </td>
             </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-dialog>
  </v-row>
  <data-table :payload="displayObj" ></data-table>
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
import FormInput from '@/components/FormInput'
import DataList from '@/components/DataList.vue'
import { mapGetters } from 'vuex'
export default {
  data(){
    return{
      shownProduct: true,
      productShownArr: [],
      orderDialog: false,
      product: [],
      orginProductArr: [],
      delDialog: false,
      productdia: false,
      delItem: null,
      ordereditindex: null,
      productObj:{
        id:null
      },
      orderObj: {
        id: null,
      },
      displayObj:{
        headers: [{
        text: 'Id',
        value: 'id',
      },{
        text: 'Customer Name',
        value: 'cusName',
      },
      {
        text: 'Incharge Price',
        value: 'incharge',
      },
      {
        text: 'Date',
        value: 'date',
      },{
        text: 'Actions',
        value: 'actions',
      }],
        list: [],
        selection: [],
        showSelect: true,
        isHideAdd: true,
        actionsList:[{
          is_show: () => {return true},
          color: () => {return 'success'},
          click: (item) => this.edit(item),
          icon:'mdi-pencil'
        },{
          is_show: () => {return true},
          color: () => {return 'success'},
          click: (item) => this.del(item),
          icon:'mdi-delete'
        }]
      },
      displayObj1:{
        headers: [{
        text: 'Product List',
        value: 'product',
      },{
        text: 'Quantity',
        value: 'quantity',
      },
      {
        text: 'Status',
        value: 'status',
      }],
      list: [],
      selection: [],
      isHideAdd: true,
      loading: true,
      }
    }
  },
  components: {
    'form-data': FormInput,
    'data-table': DataList
  },
  computed: {
    ...mapGetters(['formType']),
    formReferences () {
       return {
        title: 'Order Management',
        properties: [{
          model: 'cusName',
          type: this.formType.SELECT,
          rules: [ v => !!v || 'reqired'],
          items:[],
          label: 'Customer',
          class: 'lg4 sm6'
        },{
          model: 'incharge',
          type: this.formType.SELECT,
          rules: [ v => !!v || 'reqired'],
          items:[],
          label: 'Incharge',
          class: 'lg4 sm6'
        },{
          model: 'date',
          type: this.formType.DATEPICKER,
          rules: [ v => !!v || 'reqired'],
          hide: false,
          picker:'date',
          menu: true,
          label: 'Date',
          class: 'lg4 sm6'
        }
        ],
         buttons: [{
          name: 'action_handler',
          color: 'success',
          label: 'Save',
          click: () => this.addOrder(),
          is_show: true
        },
        {
          name: 'action_handler_update',
          color: 'primary',
          label: 'Update',
          click: () => this.updateOrder(),
          is_show: false
        },
         {
          name: 'action_handler_cancel',
          color: 'orange',
          label: 'Cancel',
          click: () => this.cancel(),
          is_show: true
        }]
    }
  },
   formReferences1 () {
       return {
         properties:[{
          model: 'product',
          type: this.formType.SELECT,
          rules: [ v => !!v || 'reqired'],
          multiple:false,
          items:[],
          label: 'Product list',
          class: 'lg4 sm6'
        },{
          model: 'quantity',
          type: this.formType.NUMBER,
          rules: [ v => !!v || 'reqired' ,v => !isNaN(v) || 'Invalid input'],
          hide: false,
          label: 'Quantity',
          class: 'lg4 sm6'
        },{
          model: 'status',
          type: this.formType.SELECT,
          rules: [ v => !!v || 'reqired'],
          items:['ordered','shipped','arrived','delivered'],
          label: 'Status',
          class: 'lg4 sm6'
        }],
         buttons: [{
          name: 'action_handler',
          color: 'success',
          label: 'Save',
          click: () => this.addProduct(),
          is_show: true
        },
        {
          name: 'action_handler_update',
          color: 'primary',
          label: 'Update',
          click: () => this.updateProduct(),
          is_show: false
        },
         {
          name: 'action_handler_cancel',
          color: 'orange',
          label: 'Cancel',
          click: () => this.cancel1(),
          is_show: true
        }]
       }
   }
  },
  methods: {
    orderManage(){
      this.orderDialog = true
    },
    EditProducts(editindex){
      this.productdia = true
      this.formReferences1.buttons[0].is_show = false
      this.formReferences1.buttons[1].is_show = true
      this.ordereditindex = editindex
      this.productObj = { }
      this.productShownArr.forEach((val, index) => {
         if(editindex === index){
           this.productObj.product = val.product
           this.productObj.quantity = val.quantity
           this.productObj.status = val.status
        }
      })
    },
    updateProduct(){
       this.productShownArr.forEach((val, index) => {
         if(this.ordereditindex === index){
          val.product = this.productObj.product
          val.quantity = this.productObj.quantity
          val.status = this.productObj.status
        }
      })
      this.formReferences1.buttons[0].is_show = true
      this.formReferences1.buttons[1].is_show = false
      this.orderDialog = false
      this.shownProduct = true
    },
    del1(index){
      this.productShownArr.find((val,index1) => {
        index1 === index ? this.productShownArr.splice(index,1) : false
      })
    },
    productFunction(){
      this.productdia = true
       this.productObj={
        id: null,
      }
      if(this.$refs.form1) this.$refs.form1.$refs.validateForm.resetValidation()
      this.formReferences1.buttons[0].is_show = true
      this.formReferences1.buttons[1].is_show = false
    },
    addProduct(){
      this.productObj.id = Math.floor(Math.random() * 100) + 1
      this.orginProductArr.push({
        id:this.orderObj.id,product:this.productObj,
      })
      this.productdia = false
      this.orderDialog = false
      this.shownProduct = true
      this.$refs.form1.$refs.validateForm.resetValidation()
    },
    addOrder(){
     if(this.$refs.form.$refs.validateForm.validate()){
      this.orderObj.id =  Math.floor(Math.random() * 100) + 1
      this.displayObj.list.push(this.orderObj)
      localStorage.setItem('orderDetails', JSON.stringify(this.displayObj.list))
      this.getProduct()
    }
    },
    getProduct(){
      this.displayObj.list = []
      let details = localStorage.getItem('orderDetails')
      let product = JSON.parse(details)
      product.forEach(val => {
        this.displayObj.list.push(val)
      })
       this.orderDialog = false
      this.displayObj.loading = false
      this.$refs.form.$refs.validateForm.reset()
    },
    edit(item){
      this.shownProduct = false
      this.productShownArr = []
      this.orginProductArr.forEach(val =>{
        val.id === item.id ? this.productShownArr.push(val.product) : false
      })
      this.displayObj1.list = []
      this.orderObj = Object.assign({}, item)
      this.orderDialog = true
      localStorage.setItem('orginProductArr', JSON.stringify(this.orginProductArr))
      this.formReferences.buttons[0].is_show = false
      this.formReferences.buttons[1].is_show = true
    },
    updateOrder(){
      this.$refs.form._props.references.buttons[0].is_show = true
      this.$refs.form._props.references.buttons[1].is_show = false
      this.displayObj.list.find((val) =>{
      if(val.id === this.orderObj.id){
        val.cusName = this.orderObj.cusName
        val.incharge = this.orderObj.incharge
        val.date  = this.orderObj.date
      }
    })
    this.orderDialog = false
    localStorage.setItem('orderDetails', JSON.stringify(this.displayObj.list))
    this.$refs.form.$refs.validateForm.reset()
    },
    del(item){
      this.delDialog = true
      this.delItem = item
    },
    confirmDel(){
      this.delDialog = false
      this.displayObj.list.find((val,index) => {
        val === this.delItem ? this.displayObj.list.splice(index,1) : false
      })
      localStorage.setItem('orderDetails', JSON.stringify(this.displayObj.list))
    },
    cancel(){
      this.orderObj={
        id: null,
      }
      this.shownProduct = true
      this.$refs.form.$refs.validateForm.resetValidation()
    },
    cancel1(){
      this.productdia = false
      this.orderDialog = false
      this.shownProduct = true
    },
    getDetails(){
       if(localStorage.getItem('productDetails')){
        let product = localStorage.getItem('productDetails')
        let details= JSON.parse(product)
        details.forEach(val => {
          this.formReferences1.properties[0].items.push(val.name)
        })
      }
       if(localStorage.getItem('orginProductArr')){
        let orginProductArr = localStorage.getItem('orginProductArr')
        this.orginProductArr = JSON.parse(orginProductArr)
      }
       if(localStorage.getItem('orderDetails')){
        let product = localStorage.getItem('orderDetails')
        let details= JSON.parse(product)
        details.forEach(val => {
          this.displayObj.list.push(val)
        })
      }
       if(localStorage.getItem('employeeDetails')){
        let product = localStorage.getItem('employeeDetails')
        let details= JSON.parse(product)
        details.forEach(val => {
          this.formReferences.properties[1].items.push(val.name)
        })
      }
      if(localStorage.getItem('customerDetails')){
        let cus = localStorage.getItem('customerDetails')
        let details= JSON.parse(cus)
        details.forEach(val => {
          this.formReferences.properties[0].items.push(val.name)
        })
      }
      this.$root.$on('deleteItems', (data) => {
      this.displayObj.list.find((val,index) => {
        val.id === data.ids[0] ? this.displayObj.list.splice(index,1) : false
      })
     localStorage.setItem('orderDetails', JSON.stringify(this.displayObj.list))  
     })
    }
  },
  mounted(){
    this.getDetails()
  },
  beforeDestroy () {
    this.$root.$off('deleteItems')
  }
}
</script>

<style>

</style>