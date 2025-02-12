export const payments = {
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

            data.append('id', this.parent.user.id);

            self.loader = 1;

            axios.post(this.parent.url + "/site/getPayments?auth=" + this.parent.user.auth, data).then(function(response) {
                self.loader = 0;
                self.data = response.data;
            }).catch(function(error) {
                self.parent.logout();
            });
        },
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
                        <h1>Payment</h1>
                    </div>
                    <div class="w70"></div>
                    <div class="w20 al ptb20"></div>
                </div>
                <div class="table payments-table" v-if="data.items != ''">
                    <table>
                        <thead>
                            <tr>
                                <th class="id">#</th>
                                <th class="id">Value</th>
                                <th class="td-2">Date</th>
                                <th class="td-2">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in data.items">
                                <td class="id">{{item.id}}</td>
                                <td class="id">
                                    <a  href="#" @click.prevent="parent.formData = item; $refs.payment.active = 1;">
                                        {{item.value}}
                                    </a>
                                </td>
                                <td>
                                    <a class="td-2" href="#" @click.prevent="parent.formData = item; $refs.payment.active = 1;">
                                        {{item.date_title}}
                                    </a>
                                </td>
                                <td >
                                    <p class="td-2">{{item.description}}</p>
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