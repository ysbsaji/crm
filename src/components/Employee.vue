
<template>
   <div>
    <form-data :references.sync="formReferences" :model="employeeObj" ref="form">
    </form-data>
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
      employeeObj: {
        id: null,
      },
      displayObj:{
        headers: [{
        text: 'Name',
        value: 'name',
      },{
        text: 'Email',
        value: 'email',
      },
      {
        text: 'Phone Number',
        value: 'phoneNumber',
      },
      {
        text: 'Role',
        value: 'role',
      },{
        text: 'Password',
        value: 'password',
      },{
        text: 'Image',
        value: 'image',
      },{
        text: 'Actions',
        value: 'actions',
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
    passwordMatch() {
    return () => this.password === this.verify || "Password must match";
  },
    formReferences () {
       return {
        title: 'User Management',
        properties: [ {
          model: 'name',
          type: this.formType.TEXT,
          rules:[ v => !!v || 'reqired'],
          label: 'Name',
          hide: false,
          class: 'lg4 sm6'
        },{
          model: 'email',
          type: this.formType.TEXT,
          rules: [ v => !!v || 'reqired',v => /.+@.+\..+/.test(v) || "E-mail must be valid"],
          hide: false,
          label: 'Email',
          class: 'lg4 sm6'
        },{
          model: 'phoneNumber',
          type: this.formType.NUMBER,
          rules: [ v => !!v || 'reqired' ,v => !isNaN(v) || 'Invalid input'],
          hide: false,
          label: 'Phone Number',
          class: 'lg4 sm6'
        }
        ,{
          model: 'role',
          type: this.formType.SELECT,
          rules: [],
          items:['Admin','Staff'],
          label: 'Role',
          class: 'lg4 sm6'
        },
        {
          model: 'password',
          type: this.formType.TEXT,
          rules: [ v => !!v || 'reqired',v => (v && v.length >= 8) || "Min 8 characters"],
          hide: false,
          label: 'Password',
          class: 'lg4 sm6'
        },
        {
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
          click: () => this.addEmployee(),
          is_show: true
        },
        {
          name: 'action_handler_update',
          color: 'primary',
          label: 'Update',
          click: () => this.updateEmployee(),
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
   addEmployee(){
    if(this.$refs.form.$refs.validateForm.validate()){
      this.employeeObj.id =  Math.floor(Math.random() * 100) + 1
      this.displayObj.list.push(this.employeeObj)
      localStorage.setItem('employeeDetails', JSON.stringify(this.displayObj.list))
      this.getEmployee()
    }
    },
    getEmployee(){
      this.displayObj.list = []
      let details = localStorage.getItem('employeeDetails')
      let product = JSON.parse(details)
      product.forEach(val => {
        this.displayObj.list.push(val)
      })
      this.displayObj.loading = false
      this.$refs.form.$refs.validateForm.reset()
    },
    edit(val){
      this.employeeObj = Object.assign({}, val)
      this.$refs.form._props.references.buttons[0].is_show = false
      this.$refs.form._props.references.buttons[1].is_show = true
    },
    updateEmployee(){
      this.$refs.form._props.references.buttons[0].is_show = true
      this.$refs.form._props.references.buttons[1].is_show = false
      this.displayObj.list.find((val) =>{
        if(val.id === this.employeeObj.id){
          val.name = this.employeeObj.name
          val.email = this.employeeObj.email
          val.phoneNumber = this.employeeObj.phoneNumber
          val.role  = this.employeeObj.role
          val.password  = this.employeeObj.password
          val.image = this.employeeObj.image
        }
      })
      localStorage.setItem('employeeDetails', JSON.stringify(this.displayObj.list))
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
      localStorage.setItem('employeeDetails', JSON.stringify(this.displayObj.list))
    },
    CreateImage(file){
      if(file){
        var reader = new FileReader();
        reader.addEventListener('load', (e) => {
          this.employeeObj.image = e.target.result
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
        if(localStorage.getItem('employeeDetails')){
        let product = localStorage.getItem('employeeDetails')
        this.displayObj.list= JSON.parse(product)
        this.displayObj.loading = false
      }
      },2000)
      this.$root.$on('deleteItems', (data) => {
      data.ids.forEach(value => {
        this.displayObj.list.forEach((val,index) => {
          val.id === value ? this.displayObj.list.splice(index,1) : false
        })
      })  
      this.displayObj.selection= []
      localStorage.setItem('employeeDetails', JSON.stringify(this.displayObj.list))  
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