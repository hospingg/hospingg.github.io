export const login = {
  data:function() {
      return {
          img: 1,
          parent: ''
      }
  },
  mounted:function() {
      this.img = this.randomIntFromInterval(1, 7);
      this.parent = this.$parent.$parent;
  },
  methods: {
      randomIntFromInterval:function(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min)
      },
      login:function() {
          var self = this;
          var data = self.parent.toFormData(self.parent.formData);

          console.log(self.parent.toFormData(self.parent.formData));

          axios.post(this.parent.url + "/site/login", data).then(function(response) {
              if (response.data.error) {
                  self.$refs.msg.alertFun(response.data.error);
              }
              if (response.data.user) {
                  self.parent.user = response.data.user;
                  self.parent.page('/campaigns');
                  window.localStorage.setItem('user', JSON.stringify(self.parent.user));
              }
          }).catch(function(error) {
              console.log('errors: ', error);
          });
      },

  },

  template: `
    <div class= "login-page">
        <msg ref="msg"/>
        <div class="image-side">
            <img :src="parent.url+'/app/views/images/Cover_'+img+'.jpg'" />
        </div>
        <div class="login-form-side">
            <div class="header">
                <div class="title">
                    <h1>Affiliate Sign in</h1>
                </div>
                <div class="logo">
                    <img :src="parent.url+'/app/views/images/logo.svg'" />
                </div>
                
            </div>

            <div class="form">
                <form @submit.prevent="login()" v-if="parent.formData">
                      <label>
                          Email
                          <input type="email" name="email" v-model="parent.formData.email" required>
                      </label>
                      <label>
                          Password
                          <input type="password" name="password" v-model="parent.formData.password" required autocomplete="on">
                      </label>
                      <button class="btn">sign in</button>
                </form>
            </div>
        </div>
        
    </div>`
  };
  