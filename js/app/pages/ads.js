export const ads = {
    data:function() {
        return {
            parent: "",
            data: {},
            loader: 1
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

            data.append('uid', this.parent.user.id);
            data.append('type', 'user');

            self.loader = 1;

            axios.post(this.parent.url + "/site/getBanners?auth=" + this.parent.user.auth, data).then(function(response) {
                self.loader = 0;
                self.data = response.data;
            }).catch(function(error) {
                self.parent.logout();
            });
        },
        copy:async function(text) {
            if (navigator?.clipboard) {
                await navigator.clipboard.writeText(text);
                this.$refs.header.$refs.msg.successFun("Successfully copied!");
                this.$refs.copy.active = 0;
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
            <div class="wrapper">
                <div class="campaings-header">
                    <div class="w10 ptb30 ar">
                        <h1>Ads</h1>
                    </div>
                    <div class="w20 al ptb20"></div>
                </div>
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
                                <button class="btn" @click.prevent="copy(parent.formData.copy)">Copy code</button>
                            </div>
                        </form>
                    </div>
                </popup>
                <div class="table ads-table" v-if="data.items != ''">
                    <table>
                        <thead>
                            <tr>
                                <th class="id">#</th>
                                <th class="image"></th>
                                <th class="image">Campaign</th>
                                <th class="title">Link</th>
                                <th >Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data.items">
                                <td class="id">{{item.id}}</td>
                                <td class="image">
                                    <a href="#" @click.prevent="parent.formData = item; $refs.new.active = 1;">
                                        <img :src="parent.url + '/' + item.img" />
                                    </a>
                                </td>
                                <td class="image"><a href="#" @click.prevent="parent.formData = item; $refs.new.active = 1;">{{item.campaign_title}}</a></td>
                                <td><a class="title" href="#" @click.prevent="parent.formData = item; $refs.new.active = 1;">{{item.link}}</a></td>
                                <td>
                                <div class="actions">
                                    <a href="#" @click.prevent="parent.formData = item; $refs.copy.active = 1;">
                                        <i class="fas fa-copy"></i>
                                    </a>
                                </div>
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
}