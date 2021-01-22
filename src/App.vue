<template>
  <v-app>
    <v-app-bar
      app
      color="cyan"
      dark
      v-if="this.$store.state.athendication"
    >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
       {{ $store.state.login.name }} {{ $store.state.login.role }}
      <v-spacer></v-spacer>
      <v-tooltip bottom>
      <template v-slot:activator="{ on }">
      <v-avatar
        color="grey lighten-2"
        size="56"
        v-on="on"
        @click="logout"
      > <v-icon>mdi-logout</v-icon></v-avatar>
      </template>
      <span>Log Out</span>
      </v-tooltip>
    </v-app-bar>
    <v-navigation-drawer app 
      v-if="this.$store.state.athendication"
      v-model="drawer"
    >
    <img :src="$store.state.login.image" style="width:100%; height:100px" alt="Image not Availabe"> 
      <v-list
          dense
          nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group :value="false"  prepend-icon="mdi-cog-outline" v-if="$store.state.login.role === 'Admin'">
          <template v-slot:activator>
            <v-list-item-title>Settings</v-list-item-title>
          </template>
            <v-list-item  v-for="(item) in settings" :key="item.title" :to="item.link">
              <v-list-item-icon><v-icon v-text="item.icon"></v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title v-text="item.title"></v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main app>
      <v-container fluid class="pa-0">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: () => ({
      drawer: false,
      items:[
        { title: 'DashBoard', icon: 'mdi-view-dashboard-outline', link:'/dashbord' },
        { title: 'Order', icon: 'mdi-cart-check', link:'/orderpage' }
      ],
      settings:[
        { title: 'Product', icon: 'mdi-dolly',link:'/productpage' },
        { title: 'Customer', icon: 'mdi-account-plus-outline', link:'/customerpage' },
        { title: 'User', icon: 'mdi-account-circle',link:'/employeepage' },
      ],
  }),
  methods:{
    logout(){
      this.$store.state.athendication = false
      this.$router.push('signup')
    },
    getDetails(){
      !this.$store.state.athendication ? this.$router.push('signup') : ''
    },
  },
  mounted(){
    this.getDetails()
    let parseData = JSON.parse(localStorage.getItem('employeeDetails'))
    if(!parseData || parseData.length === 0){
      let login = [{"id":6,"image":"data:image/jpeg;base64,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", file: [{}], email: "saji@gmail.com",role: "Admin",name: "SAJEETH BRITTO Y",password: "123456789",phoneNumber: "0636917793"}]
      localStorage.setItem('employeeDetails',JSON.stringify(login))
    }
  }
}
</script>
