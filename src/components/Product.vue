
<template>
   <div>
    <form-data :references.sync="formReferences" :model="productObj" ref="form"></form-data>
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
import { mapGetters } from 'vuex'
import FormInput from '@/components/FormInput'
import DataList from '@/components/DataList.vue'
export default {
   data () {
    return {
      delDialog: false,
      productObj: {
        id: null,
      },
      displayObj:{
        headers: [{
        text: 'Product Code',
        value: 'id',
        width: '20%'
      },{
        text: 'Product Name',
        value: 'name',
        width: '20%'
      },
      {
        text: 'Net Price',
        value: 'netPrice',
        width: '20%'
      },
      {
        text: 'Sale Price',
        value: 'salePrice',
        width: '10%'
      },{
        text: 'Description',
        value: 'description',
        width: '10%'
      },{
        text: 'Image',
        value: 'image',
        width: '10%'
      },{
        text: 'Actions',
        value: 'actions',
        width: '20%'
      }],
        list: [],
        selection: [],
        showSelect: true,
        isHideAdd: true,
        loading: true,
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
      total: 0,
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
        title: 'Product Management',
        properties: [ {
          model: 'name',
          type: this.formType.TEXT,
          rules:[ v => !!v || 'reqired'],
          label: 'Name',
          hide: false,
          class: 'lg4 sm6'
        },{
          model: 'netPrice',
          type: this.formType.NUMBER,
          rules: [ v => !!v || 'reqired' ,v => !isNaN(v) || 'Invalid input'],
          hide: false,
          label: 'Net Price',
          class: 'lg4 sm6'
        },{
          model: 'salePrice',
          type: this.formType.NUMBER,
          rules: [ v => !!v || 'reqired' ,v => !isNaN(v) || 'Invalid input'],
          hide: false,
          label: 'Sale Price',
          class: 'lg4 sm6'
        }
        ,{
          model: 'description',
          type: this.formType.TEXTAREA,
          rules: [],
          rows: 3,
          label: 'Description',
          class: 'lg4 sm6'
        },{
          model: 'file',
          type: this.formType.FILES,
          rules: [],
          change: (file) => this.CreateImage(file[0]),
          label: 'Files',
          is_show: true,
          class: 'lg4 sm6'
        }
        ],
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
          click: () => this.cancel(),
          is_show: true
        }]
    }
  },
  },
  methods: {
   addProduct(){
    if(this.$refs.form.$refs.validateForm.validate()){
      this.productObj.id =  Math.floor(Math.random() * 100) + 1
      this.displayObj.list.push(this.productObj)
      localStorage.setItem('productDetails', JSON.stringify(this.displayObj.list))
      this.getProduct()
    }
    },
    getProduct(){
      this.displayObj.list = []
      let details = localStorage.getItem('productDetails')
      let product = JSON.parse(details)
      product.forEach(val => {
        this.displayObj.list.push(val)
      })
      this.displayObj.loading = false
      this.$refs.form.$refs.validateForm.reset()
    },
    edit(val){
      this.productObj = Object.assign({}, val)
      this.$refs.form._props.references.buttons[0].is_show = false
      this.$refs.form._props.references.buttons[1].is_show = true
    },
    updateProduct(){
      this.$refs.form._props.references.buttons[0].is_show = true
      this.$refs.form._props.references.buttons[1].is_show = false
      this.displayObj.list.find((val) =>{
        if(val.id === this.productObj.id){
          val.name = this.productObj.name
          val.salePrice = this.productObj.salePrice
          val.netPrice = this.productObj.netPrice
          val.description  = this.productObj.description
          val.image = this.productObj.image
        }
      })
      localStorage.setItem('productDetails', JSON.stringify(this.displayObj.list))
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
      localStorage.setItem('productDetails', JSON.stringify(this.displayObj.list))
    },
    CreateImage(file){
      if(file){
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
        this.productObj.image = e.target.result
      })
        reader.readAsDataURL(file)
      }
    },
    cancel(){
      this.productObj={
        id: null,
      }
      this.$refs.form.$refs.validateForm.resetValidation()
    },
    getDetails(){
      setTimeout(() => {
        if(localStorage.getItem('productDetails')){
        let product = localStorage.getItem('productDetails')
        this.displayObj.list= JSON.parse(product)
        this.displayObj.loading = false
      }
      },2000)
      this.$root.$on('deleteItems', (data) => {
      this.displayObj.list.find((val,index) => {
        val.id === data.ids[0] ? this.displayObj.list.splice(index,1) : false
      })
     localStorage.setItem('productDetails', JSON.stringify(this.displayObj.list))  
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