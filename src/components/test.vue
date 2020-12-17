 <!-- <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              x-large
              v-on="on"
            >
              <v-avatar
                color="grey lighten-2"
                size="56"
              ><v-icon >mdi-logout</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <h3>{{ $store.state.login.name }}</h3>
                <p class="caption mt-1">
                  {{ $store.state.login.email }}
                </p>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  depressed
                  rounded
                  text
                  @click="editAccount($store.state.login.email)"
                >
                  Edit Account
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  depressed
                  rounded
                  text
                  @click="logout"
                >
                  logout
                </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu> -->