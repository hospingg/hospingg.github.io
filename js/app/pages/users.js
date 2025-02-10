export const users = {
    data:function() {
        return {
            parent: "",
            data: {},
            loader: 1,
            type: 0,
            uid: -1
        }
    },
    mounted:function() {
        this.parent = this.$parent.$parent;

        if (!this.parent.user) {
            this.parent.logout();
        }
        this.get();
    },
    methods: {
        get:function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
    
            if (this.type != "") data.append('type', this.type);
            
            self.loader = 1;
            axios.post(this.parent.url + "/site/getUsers?auth=" + this.parent.user.auth, data).then(function(response) {
                self.loader = 0;
                self.data = response.data;
                
                if (response.data.types && response.data.types[0] && !self.type) self.type = response.data.types[0].id;
                if (self.uid > -1) self.parent.formData.copy = self.data.items[self.uid].multi;
            }).catch(function(error) {
                self.parent.logout();
            });
        },
        action:function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionUser?auth=" + this.parent.user.auth, data).then(function(response) {
                if (response.data.error) {
                    self.$refs.header.$refs.msg.alertFun(response.data.error);
                    return false;
                } else {
                    self.$refs.new.active = 0;
                }

                if (self.parent.formData.id) {
                    self.$refs.header.$refs.msg.successFun("Successfully updated user!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new user!");
                }

                self.get();
            }).catch(function(error) {
                console.log('errors: ', error);
            });
        },
        del:async function() {
            if (await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this user?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url + "/site/deleteUser?auth=" + this.parent.user.auth, data).then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully deleted user!");
                        self.get();    
                    }
                }).catch(function(error) {
                    console.log('errors: ', error);
                });
            }
        },
        copy:async function(text) {
            if (navigator && navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                this.$refs.header.$refs.msg.successFun("Successfully copied!");
                this.$refs.copy.active = 0;
                this.parent.formData = {};
            } else {
                this.$refs.header.$refs.msg.alertFun("Use https!");
            }
        }
    },
    template: `
        <link rel="stylesheet" href="./css/campaings.css">
        <link rel="stylesheet" href="/css/toogle.css">
        <div class="inside-content">
            <Header ref="header" />
            <div id="spinner" v-if="loader"></div>
            <div class="wrapper page">
                <div class="campaings-header"> 
                    <div class="ptb20 panel">
                        <h1>Users</h1>
                    </div>
                    <!-- <div class="w70"><search /></div> -->
                    <button class="new-btn" href="#" @click.prevent="parent.formData={}; $refs.new.active=1">
                        New <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit user' : 'New user'">
                    <div class="form new-camp-form">
                        <form @submit.prevent="action()" v-if="parent.formData">
                            <div class="row">
                                <label>
                                    Name
                                    <input type="text" v-model="parent.formData.user" required />
                                </label>
                            </div>
                            <div class="row">
                                <label>
                                    Phone
                                    <input type="text" v-model="parent.formData.phone" required />
                                </label>
                            </div>
                            <div class="row">
                                <label>
                                    Email
                                    <input type="text" v-model="parent.formData.email" required />
                                </label>
                            </div>
                            <div class="row">
                                <label>
                                    Password
                                    <input type="text" v-model="parent.formData.password" required />
                                </label>
                            </div>

                            <div class="btns col">
                                <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                                <button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
                            </div>
                        </form>
                    </div>
                </popup>

                <popup ref="copy" :title="'Copy banner'">
                    <div class="form new-camp-form">
                        <form v-if="parent.formData">
                            <div class="row">
                                <label>
                                    Code
                                    <textarea v-model="parent.formData.copy"></textarea>
                                </label>
                            </div>

                            <div class="row">
                                <label>
                                    Type
                                    <select v-model="type" @change="get()" required>
                                        <option value="0">---</option>
                                        <option v-if="data.types" v-for="c in data.types" :value="c.id">{{c.title}}</option>
                                    </select>
                                </label>
                            </div>
                                    <label>
                                <button class="btn" @click.prevent="copy(parent.formData.copy)">Copy code</button>
                                    </label>
                        </form>
                    </div>
                </popup>

                <div class="table" id="users-table" v-if="data.items != ''">
                    <table>
                        <thead>
                            <tr>
                                <th class="id">#</th>
                                <th class="id"></th>
                                <th class="td-3">Name</th>
                                <th class="td-5">Phone</th>
                                <th class="td-3">Email</th>
                                <th class="actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in data.items">
                                <td class="id"><p>{{item.id}}</p></td>
                                <td class="id toogle">
                                    <toogle :modelValue="item.published" @update:modelValue="item.published = $event; parent.formData = item; action()" />
                                </td>
                                <td class="td-3"><router-link class="title" :to="'/user/' + item.id">{{item.user}}</router-link></td>
                                <td class="td-5"><p class="title">{{item.phone}}</p></td>
                                <td class="td-3"><p class="title">{{item.email}}</p></td>
                                <td class="actions">
                                    <router-link :to="'/user/' + item.id">
                                        <i class="fas fa-edit ico"></i>
                                    </router-link>
                                    <a href="#" @click.prevent="parent.formData.copy = item.multi; uid=i; $refs.copy.active=1;">
                                        <i class="fas fa-images ico"></i>
                                    </a>
                                    <a href="#" @click.prevent="parent.formData = item; del();">
                                        <i class="fas fa-trash-alt ico"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="empty" v-if="data.items == ''">
                    No items
                </div>
            </div>
        </div>
    `
};