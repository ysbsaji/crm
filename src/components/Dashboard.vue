<template>
  <div>
  <v-row>
    <v-col
      cols="12"
      lg="3"
    >
    <v-card
      class="mx-auto "
      max-width="344"
      height="150px"
      color="saji"
      @click="customerDetail"
    >
      <v-card-text>
        <h1 class="display-3 text--primary">
          {{ customer.length }} 
          <v-avatar
            size="90"
            style="margin-left:100px"
          >
            <v-icon dark x-large>mdi-account-plus-outline</v-icon>
          </v-avatar>
        </h1>
        <p class="display-1 text--primary"> Customers</p>
      </v-card-text>
    </v-card>
    </v-col>
    <v-col
      cols="12"
      lg="3"
    >
    <v-card
      class="mx-auto"
      max-width="344"
      height="150px"
      color="orange"
      @click="employeeDetails"
    >
      <v-card-text>
        <h1 class="display-3 text--primary">
          {{ employee.length }}
          <v-avatar
            size="90"
            style="margin-left:100px"
          >
            <v-icon dark x-large>mdi-account-circle</v-icon>
          </v-avatar>  
        </h1>
        <p class="display-1 text--primary"> Employees</p>
      </v-card-text>
    </v-card>
    </v-col>
    <v-col
      cols="12"
      lg="3"
    >
    <v-card
      class="mx-auto"
      max-width="344"
      height="150px"
      color="red"
      @click="orderDetails"
    >
      <v-card-text>
        <h1 class="display-3 text--primary">
          {{ order.length }}
          <v-avatar
            size="90"
            style="margin-left:100px"
          >
            <v-icon dark x-large > mdi-cart-check</v-icon>
          </v-avatar>
        </h1>
        <p class="display-1 text--primary"> Orders</p>
      </v-card-text>
    </v-card>
    </v-col>
    <v-col
      cols="12"
      lg="3"
    >
    <v-card
      class="mx-auto"
      max-width="344"
      height="150px"
      color="cyan"
      @click="productDetails"
    >
      <v-card-text>
        <h1 class="display-3 text--primary">
          {{ product.length }}
          <v-avatar
            size="90"
            style="margin-left:100px"
          >
            <v-icon dark x-large>mdi-dolly</v-icon>
          </v-avatar>
        </h1>
        <p class="display-1 text--primary"> products</p>
      </v-card-text>
    </v-card>
    </v-col>
  </v-row>
  
   <v-expand-transition>
      <v-card
        v-if="reveal"
        class="transition-fast-in-fast-out v-card--reveal"
        width="100%"
        style="height: 100%;"
      >
        <v-card-text class="pb-0">
          <p class="display-1 text--primary">
            {{ head }}
          </p>
          <v-data-table
            :headers="headers"
            :items="details"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <v-divider></v-divider>
    <div  style="border:2px solid red; border-radius:10px" class="my-3"  v-if="$store.state.login.emproll === 'admin'">
      <h1 class="text-center">Orders Details in chart</h1>
      <v-row justify="center">
        <chart :options="chartOptionsBar" ></chart>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      reveal: false,
      head: '',
      customer:[],
      orginProductArr: [],
      employee:[],
      order:[],
      product:[],
      headers: [],
      details: [],
      chartOptionsBar: {
        tooltip: {},
        xAxis: {
          data: ['Ordered', 'Shipped', 'Arrived', 'Delivered','Total Order']
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
            data: [],
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            }
          }
        ]
      }
    }
  },
  methods:{
    customerDetail(){
      this.changeData()
      this.head = 'Customer Details'
      this.headers.push({text:'Id', align: 'start', value:'id'},{text:'Name', align: 'start',value:'name'},{text:'Email', align: 'start',value:'email'},{text:'Phone Number', align: 'start',value:'phoneNumber'})
      this.customer.forEach(val => { this.details.push(val) })
    },
    changeData(){
      this.reveal = true
      this.headers = []
      this.details = []
    },
    employeeDetails(){
      this.changeData()
      this.head = 'Employee Details'
      this.headers.push({text:'Name', align: 'start',value:'name'},{text:'Email', align: 'start',value:'email'},{text:'Id', align: 'start',value:'id'})
      this.employee.forEach(val => { this.details.push(val) })
    },
    productDetails(){
      this.changeData()
      this.head = 'Product Details'
      this.headers.push({text:'Code', align: 'start',value:'id'},{text:'Product Name', align: 'start',value:'name'},{text:'Net Price', align: 'start',value:'netPrice'},{text:'Sale Price', align: 'start',value:'salePrice'},{text:'Description', align: 'start',value:'description'})
      this.product.forEach(val => { this.details.push(val) })
    },
    orderDetails(){
      this.changeData()
      this.head = 'Order Details'
      this.headers.push({text:'Id', align: 'start',value:'id'},{text:'Date', align: 'start',value:'date'},{text:'Customer Name', align: 'start',value:'cusName'},{text:'Incharge', align: 'start',value:'incharge'})
      this.order.forEach(val => { this.details.push(val) })
    },
    getDetails(){
      switch(this.$store.state.login.role){
        case 'Admin':
          if(localStorage.getItem('orderDetails')){
          let orderDetails = localStorage.getItem('orderDetails')
          this.order = JSON.parse(orderDetails)
          }
          break
        case 'Staff':
          if(localStorage.getItem('orderDetails')){
          let orderDetails = localStorage.getItem('orderDetails')
          let details = JSON.parse(orderDetails)
          details.find(val =>{
            val.incharge === this.$store.state.login.name ? this.order.push(val) : false
          })
        }
        break
      }
      if(localStorage.getItem('employeeDetails')){
        let empDetails = localStorage.getItem('employeeDetails')
        this.employee = JSON.parse(empDetails)
      }
      if(localStorage.getItem('customerDetails')){
        let cusDetails = localStorage.getItem('customerDetails')
        this.customer = JSON.parse(cusDetails)
      }
      if(localStorage.getItem('productDetails')){
        let productDetails = localStorage.getItem('productDetails')
        this.product = JSON.parse(productDetails)
      }
      if(localStorage.getItem('orginProductArr')){
        let productDetails = localStorage.getItem('orginProductArr')
        let seprate = JSON.parse(productDetails)
        seprate.forEach(val => { this.orginProductArr.push(val.product) })
      }
      let ordered = 0
      let shipped = 0
      let arrived = 0 
      let delivered = 0
      this.orginProductArr.forEach(val => {
      switch(val.status){
        case 'ordered':
          ++ordered
          break
        case 'shipped':
          ++shipped
          break
        case 'arrived':
          ++arrived
          break
        case 'delivered':
          ++delivered
          break
      }
      })
      this.chartOptionsBar.series[0].data.push(ordered,shipped,arrived,delivered,this.orginProductArr.length)
    }
  },
  mounted(){
    this.getDetails()
  }
}
</script>

<style scoped>
  chart {
    width: 1000px
  }
</style>