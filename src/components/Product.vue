<template>
  <div>
  <v-form 
    ref='form'
    v-model="valid"
  >
   <v-container fluid>
     <v-banner
        color="cyan"
        class="text-center my-3"
        style="border-radius:4px"
      >
        <P class="display-1">Product Mangement</P>
      </v-banner>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field
            label="Name"
            outlined
            dense
            v-model="name"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field
            label="NetPrice"
            outlined
            dense
            v-model="netPrice"
            :rules="[rules.required,rules.number]"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-text-field
            label="SalePrice"
            outlined
            dense
            v-model="salePrice"
            :rules="[rules.required,rules.number]"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-textarea
            solo
            clearable
            outlined
            rows="3"
            label="Description"
            v-model="description"
            :rules="[rules.required]"
        ></v-textarea>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
          >
          <v-file-input
            label="File input"
            outlined
            dense
            :disabled="whileEdit"
            @change="CreateImage"
          ></v-file-input>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="2"
        >
        <v-btn
          color="primary"
          :disabled= "!valid"
          v-show="addBtn"
          @click="addProduct"
         >
          AddProduct
        </v-btn>
        <v-btn
          color="primary"
          v-show="editBtn"
          @click="onEdit"
         >
          Update
        </v-btn>
        </v-col>
          <v-col
          cols="12"
          sm="6"
          md="2"
        >
        <v-btn
          depressed
          color="deep-orange"
          @click="cancel"
         >
          Cancel
        </v-btn>
        </v-col>
        <v-alert
          dense
          text
          type="success"
          v-model="alert"
          transition=" "
        >
          Product has been added successfully
        </v-alert>
      </v-row>
    </v-container>
  </v-form>
  <v-data-table
    :headers="headers"
    :items="productDetails"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editProduct(item)"
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
    <v-row>
    <v-col cols="12"
      lg="3"
      v-for="item in productDetails" :key="item.code" style="list-style-type: none"
    >
      <v-card>
        <v-card-title>
          <h4>Product Name: {{ item.name }}</h4>
          <img :src="item.url" style="width:100%; height:100px" alt="Image not Availabe"> 
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p>Product Code: {{ item.id }}</p> 
        </v-card-text>
        <v-card-text>
          <p>Net Price: {{ item.netPrice }} </p>
        </v-card-text>
        <v-card-text>
          <p>Sale Price:  {{ item.salePrice }}</p>
        </v-card-text>
        <v-card-text>
          <p>Description: {{ item.description }}</p>
        </v-card-text>
      </v-card> 
    </v-col>
  </v-row>
  </div>
</template>

<script>
export default {
  data(){
    return{
      alert: false,
      addBtn: true,
      editBtn: false,
      name: '',
      valid: true,
      netPrice: '',
      salePrice: '',
      description: '',
      delDialog: false,
      editId:'',
      deleteId:'',
      whileEdit: false,
      rules: {
        required: value => !!value || 'Required.',
        number: value => !isNaN(value) || 'Invalid input'
      },
      image:'',
      headers:[
        { text: 'Product code', value: 'id' },
        { text: 'Product Name', value: 'name' },
        { text: 'Net Price', value: 'netPrice' },
        { text: 'Sale Price', value: 'salePrice' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      productDetails:[]
    }
  },
  methods: {
    addProduct(){
      this.productDetails.push({
      id: Math.floor(Math.random() * 100) + 1,
      name:this.name,
      netPrice:this.netPrice,
      salePrice:this.salePrice,
      description:this.description,
      price:this.salePrice,
      url:this.image
      })
      this.alert = true
      setTimeout(() => {
        this.alert = false
      },2000)
      localStorage.setItem('productDetails',JSON.stringify(this.productDetails))
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    onEdit(){
      this.editBtn = false
      this.addBtn = true
      this.productDetails.find(val => {
        if(val.id === this.editId){
          val.name = this.name
          val.netPrice = this.netPrice
          val.salePrice = this.salePrice
          val.description = this.description
        }
      })
      localStorage.setItem('productDetails',JSON.stringify(this.productDetails))
      this.whileEdit = false
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    cancel(){
      this.$refs.form.resetValidation();
      this.$refs.form.reset();
    },
    editProduct(item){
      this.editBtn = true
      this.addBtn = false
      this.name = item.name
      this.netPrice = item.netPrice
      this.salePrice = item.salePrice
      this.description = item.description
      this.whileEdit = true
      this.editId = item.id
    },
    confirmDel(){
      this.delDialog = false
      this.productDetails.find((val,index) => {
         val.id === this.deleteId ? this.productDetails.splice(index,1) : ''
      })
      localStorage.setItem('productDetails',JSON.stringify(this.productDetails))
    },
    getProductData(){
      if(localStorage.getItem('productDetails')){
        let productDetails = localStorage.getItem('productDetails')
        this.productDetails= JSON.parse(productDetails)
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
  created(){
    this.getProductData()
  }
}
</script>

<style>

</style>