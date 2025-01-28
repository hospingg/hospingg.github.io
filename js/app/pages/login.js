export const login = {
    data: function () {
      return {
        img: 1,
        hs: 0,
        parent: '',
        formData: {
          username: '',
          email: '',
          password: '',
        },
      };
    },
    mounted: function () {
      this.img = this.randomIntFromInterval(1, 7);
      this.parent = this.$parent.$parent;
    },
    methods: {
      randomIntFromInterval: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },
      handleRegister: function () {
        alert(`User registered: ${JSON.stringify(this.formData)}`);
      },
    },
    template: `
      <div class="register-page">
        <div class="image-section">
          <img :src="'/public/images/background.jpg'" alt="Welcome image" />
        </div>
        <div class="form-section">
          <h1>Register</h1>
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="username">Username</label>
              <input id="username" type="text" v-model="formData.username" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" type="email" v-model="formData.email" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input id="password" type="password" v-model="formData.password" required />
            </div>
            <button type="submit" class="register-button">Register</button>
          </form>
        </div>
      </div>
    `,
  };
  