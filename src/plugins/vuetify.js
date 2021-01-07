import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

 
export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#1565C0',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        saji:'#4CAF50'
      },
      dark:{
        primary: '#388E3C',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    },
  },
}); 
