<template>
  <v-app>
    <v-app-bar
      app
      color="cyan"
      dark
      v-if="this.$store.state.athendication"
    >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
       {{ $store.state.login.name }}
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
    <img :src="$store.state.login.url" style="width:100%; height:100px" alt="Image not Availabe"> 
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
        <v-list-group :value="false"  prepend-icon="mdi-cog-outline" v-if="$store.state.login.emproll === 'admin'">
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
        { title: 'Order', icon: 'mdi-cart-check', link:'/orderpage' },
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
    // editAccount(email){
    //   console.log(email);
    //   this.$router.push('employeepage')
    // }
  },
  mounted(){
    this.getDetails()
  }
}
</script>
