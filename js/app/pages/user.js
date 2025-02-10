export const user = { 
    data:function() { 
        return { 
            parent:"", 
            data:{}, 
            user: [], 
            tab:0, 
            tabs: ["Statistic", "Sites", "Payments"], 
            date:"", 
            date2:"", 
            iChart:-1, 
            loader:1 
        } 
    },
    mounted: function(){ 
        this.parent = this. $parent.$parent;

        if(!this.parent.user) { 
        this.parent.logout(); 
        } 

        if(!this.parent.$route.params.id) this.parent.page('/users'); 
        this.get(); 
        this.GetFirstAndLastDate(); 
    },
    methods: {
        GetFirstAndLastDate:function() {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var firstDayOfMonth = new Date(year, month, 2);
            var lastDayOfMonth = new Date(year, month+1, 1);

            this.date = firstDayOfMonth.toISOString().substring(0, 10);
            this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
        },
        get:function() {
            var self = this; 
            var data = self.parent.toFormData(self.parent.formData);

            data.append('id',this.parent.$route.params.id); 
            data.append('uid',this.parent.$route.params.id); 

            if(this.date != "") data.append('date', this.date); 
            if(this.date2 != "") data.append('date2',this.date2);

            self.loader = 1; 
            axios.post(this.parent.url + "/site/getUser?auth=" + this.parent.user.auth, data).then(function(response) { 
                self.loader=0; 
                self.data = response.data; 
                if (self.data.info) self.user = self.data.info; 
                document.title = self.data.info.user
            }).catch(function(error) {
                self.parent.logout(); 
            });
        },
        action:function(){ 
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
                console.log('errors: ',error);
            });
        },
        del:async function () { 
            if(await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this user?")) { 
                var self = this; 
                var data = self.parent.toFormData(self.parent.formData); 

                axios.post(this.parent.url + "/site/deleteUser?auth=" + this.parent.user.auth, data).then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        self.$refs.header.$refs.msg.successFun ("Successfully deleted add!"); 
                        self.get(); 
                    }
                }).catch(function(error) { 
                    console.log('errors: ', error); 
                });
            }
        },
        actionStatistic:function(){ 
            var self = this; 
            var data = self.parent.toFormData(self.parent.formData);

            data.append('uid',this.parent.$route.params.id);

            axios.post(this.parent.url + "/site/actionStatistic?auth=" + this.parent.user.auth, data).then(function(response){ 
                if (response.data.error) { 
                    self.$refs.header.$refs.msg.alertFun(response.data.error); 
                    return false; 
                } else { 
                    //self.$refs.payment.active=0; 
                } 
                if (self.parent.formData.id) { 
                    self.$refs.header.$refs.msg.successFun("Successfully updated banner!"); 
                } else { 
                    self.$refs.header.$refs.msg.successFun("Successfully added new banner!"); 
                } 
                self.get(); 
            }).catch(function(error) { 
                console.log('errors', error); 
            });
        },
        actionPayment:function(){ 
            var self = this; 
            var data = self.parent.toFormData(self.parent.formData);

            data.append('uid', this.parent.$route.params.id);

            axios.post(this.parent.url + "/site/actionPayment?auth=" + this.parent.user.auth, data).then(function(response) {
                if (response.data.error) {
                    self.$refs.header.$refs.msg.alertFun(response.data.error);
                    return false;
                } else {
                    self.$refs.payment.active = 0; 
                }

                if (self.parent.formData.id) { 
                    self.$refs.header.$refs.msg.successFun("Successfully updated payment!"); 
                } else { 
                    self.$refs.header.$refs.msg.successFun("Successfully added new payment!"); 
                }

                self.get(); 
            }).catch(function(error) { 
                console.log('errors: ', error); 
            });
        },
        delPayment:async function() { 
            if (await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this payment?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url + "/site/deletePayment?auth=" + this.parent.user.auth, data).then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully deleted add!"); 
                        self.get(); 
                    }
                }).catch(function(error) {
                    console.log('errors: ', error);
                });
            }
        },
        actionSite:function(){ 
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionSite?auth="+this.parent.user.auth, data).then(function(response) { 
                //self.$refs.new.active = 0; 
                if (self.parent.formData.id) { 
                    self.$refs.header.$refs.msg.successFun("Successfully updated site!"); 
                } else { 
                    self.$refs.header.$refs.msg.successFun("Successfully added new site!"); 
                } 

                self.get(); 
            }).catch(function(error) { 
                console.log('errors', error); 
            });
        },
        line:function(item) {
            setTimeout(function() {
                let dates = [];
                let clicks = [];
                let views = [];
                let leads = [];

                if (item && item['line']) {
                    for(let i in item['line']) {
                        dates.push(i);
                        clicks.push(item['line'][i].clicks);
                        views.push(item['line'][i].views);
                        leads.push(item['line'][i].leads);
                    }
                }
                document.querySelector('#chartOuter').innerHTML = '<div id="chartHints" class="chart-hints"><div class="chartHintsViews"><p>Views</p></div><div class="chartHintsClicks"><p>Clicks</p></div></div><canvas id="myChart"></canvas>';
                
                const ctx = document.getElementById('myChart');
                const xScaleImage = {
                    id: "xScaleImage",
                    afterDatasetsDraw(chart, args, plugins) {
                        const { ctx, data, chartArea:{bottom}, scales:{x} } = chart;
                        ctx.save();
                        data.images.forEach((image, index) => {
                            const label = new Image();
                            label.src = image;

                            const width = 120;
                            ctx.drawImage(label, x.getPixelForValue(index) - (width / 2), x.top, width, width);
                        })
                    }
                }
                new Chart(ctx, {
                    type: 'line',

                    data: {
                        labels: dates,

                        datasets: [
                            {
                                label: "Clicks",
                                backgroundColor: "#00599D",
                                borderColor: "#00599D",
                                data: clicks
                            },
                            {
                                label: "Views",
                                backgroundColor: "#5000B8",
                                borderColor: "#5000B8",
                                data: views,
                                yAxisID: 'y2'
                            },
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                bodyFontSize: 20,
                                usePointStyle: true,
                                callbacks: {
                                    title: (ctx) => {
                                        return ctx[0]['dataset'].label
                                    },
                                }
                            },
                            legend: {
                                display: false
                            }
                        },

                        categoryPercentage: 0.2,
                        barPercentage: 0.8,
                        scales: {
                            y: {
                                id: 'y2',
                                position: 'right'
                            },
                            x: {
                                afterFit: (scale) => {
                                    scale.height = 120;
                                }
                            }
                        }
                    },
                });
            }, 100);
        },
    },
    template: `
        <link rel="stylesheet" href="./css/campaings.css">
        <link rel="stylesheet" href="/css/toogle.css">
        <div class="inside-content">
            <Header ref="header" />
            <div id="spinner" v-if="loader"></div>
            <div id="panelTop" class="campaing-header">
                <div class="wrapper page">
                    <div class="flex userPanel">
                        <div class="pampaign-edit">
                            <h1 v-if="data && data.info">{{data.info.user}}</h1>
                            <button class="new-btn" @click.prevent="parent.formData=user; $refs.new.active=1">
                                Edit user <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                    <div class="user-info" v-if="data && data.info">
                        <div class="">
                            <p><b>Phone:</b> {{data.info.phone}}</p>
                        </div>
                        <div class="">
                            <p><b>Email:</b> {{data.info.email}}</p>
                        </div>
                    </div>

                    <div class="tabs ar">
                        <ul class="user-menu">
                            <li v-if="tabs" v-for="(t, i) in tabs" :class="{active:tab == i}" @click="tab = i"><p>{{t}}</p></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="wrapper">
                <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit user' : 'New user'">
                    <div class="form new-camp-form">
                        <form @submit.prevent="action()" v-if="parent.formData">
                            <div class="row">
                                <label>
                                    Name
                                    <input type="text" v-model="parent.formData.user" required>
                                </label>
                            </div>
                            <div class="row">
                                <label>
                                    Phone
                                    <input type="text" v-model="parent.formData.phone" required>
                                </label>
                            </div>
                            <div class="row">
                                <label>
                                    Email
                                    <input type="text" v-model="parent.formData.email" required>
                                </label>
                            </div>
                            <div class="row">
                                <label>
                                    Password
                                    <input type="text" v-model="parent.formData.password" required>
                                </label>
                            </div>

                            <label>
                                <button class="btn" v-if="parent.formData && parent.formData.id">EDIT</button>
                                <button class="btn" v-if="parent.formData && !parent.formData.id">ADD</button>
                            
                            </label>
                        </form>
                    </div>
                </popup>

                <div v-if="tab == 1">
                    <div class="camp-panel tac">
                        <div class="w20 ptb10">
                            <h2>{{tabs[tab]}}</h2>
                        </div>
                        <div class="w60 ptb20 ac">
                            <input type="date" v-model="date" @change="get()" /> - <input type="date" v-model="date2" @change="get()" />
                        </div>
                        <div class="w20 ptb15 al"></div>
                    </div>

                    <popup ref="chart" fullscreen="true" title="Chart">
                    <div class="analytics-flex">
                        <div class="chart-dates" id="chart-dates"><input type="date" v-model="date" @change="get();" /> - <input type="date" v-model="date2" @change="get();" /></div>
                        
                        <div class="blocks">
                            <div class="data-container clicks">
                                <div> <p>Clicks</p></div>
                                <p class="chart-content">{{data.sites[iChart].clicks}}</p>
                            </div>
                            <div class="data-container views">
                                <div><p>Views</p></div>
                                <p class="chart-content">{{data.sites[iChart].views}}</p>
                            </div>
                            <div class="data-container leads">
                                <div><p>Leads</p></div>
                                <p class="chart-content">{{data.sites[iChart].leads}}</p>
                            </div>
                            <div class="data-container ctr">
                                <div><p>CTR</p></div>
                                <p class="chart-content">{{(data.sites[iChart].clicks * 100 / data.sites[iChart].views).toFixed(2)}}%</p>
                            </div>
                        </div>
                    </div>
                    <div class="charts-content">
                        
                        <div class="chart-outer" id="chartOuter">
                            <div id="chartHints" class="chart-hints">
                                <div class="chartHintsViews"><p>Views</p></div>
                                <div class="chartHintsClicks"><p>Clicks</p></div>
                            </div>
                            <canvas id="myChart"></canvas>
                        </div>
                    </div>
                </popup>

                    <div class="table user-sites-table" v-if="data.sites != ''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="id"></th>
                                    <th class="image">Site</th>
                                    <th class="id">Views</th>
                                    <th class="id">Clicks</th>
                                    <th class="id">Leads</th>
                                    <th class="id">Fraud clicks</th>
                                    <th class="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in data.sites">
                                    <td class="id">
                                        <toogle v-model="item.published" @update:modelValue="item.published = $event; parent.formData = item; actionSite();" />
                                    </td>
                                    <td class="image">
                                        <p>{{item.site}}</p>
                                    </td>
                                    <td class="id">
                                        <p>{{item.views}}</p>
                                    </td>
                                    <td class="id">
                                        <template v-if="item.clicks">{{item.clicks}}</template>
                                        <template v-if="!item.clicks">0</template>
                                    </td>
                                    <td class="id">
                                        <template v-if="item.leads">{{item.leads}}</template>
                                        <template v-if="!item.leads">0</template>
                                    </td>
                                    <td class="id">
                                        <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                                            <template v-if="item.fclicks">{{item.fclicks}}</template>
                                            <template v-if="!item.fclicks">0</template>
                                        </a>
                                    </td>
                                    <td class="actions">
                                        <a href="#" @click.prevent="parent.formData = item; iChart = i; $refs.chart.active = 1; line(item)">
                                            <i class="fas fa-chart-bar"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="empty" v-if="data.sites == ''">
                        No items
                    </div>
                </div>

                <div v-if="tab == 2">
                    <div class="camp-panel tac">
                        <div class="w30 ptb10">
                            <h2>{{tabs[tab]}}</h2>
                        </div>
                        <div class="w50"></div>
                        <button class="new-btn" href="#" @click.prevent="parent.formData = {}; $refs.payment.active=1"><i class="fas fa-plus"></i> Add payment</a>
                        </button>
                    </div>

                    <popup ref="payment" :title="(parent.formData && parent.formData.id) ? 'Edit payment' : 'New payment'">
                        <div class="form new-camp-form">
                            <form @submit.prevent="actionPayment()" v-if="parent.formData">
                                <div class="row">
                                    <label>
                                        Value
                                        <input type="number" v-model="parent.formData.value" required>
                                    </label>
                                </div>
                                <div class="row">
                                    <label>
                                        Date
                                        <input type="date" v-model="parent.formData.date" required>
                                    </label>
                                </div>
                                <div class="row">
                                    <label>
                                        Description
                                        <input type="text" v-model="parent.formData.description" required>
                                    </label>
                                </div>

                                <label>
                                    <button class="btn" v-if="parent.formData && parent.formData.id">EDIT</button>
                                    <button class="btn" v-if="parent.formData && !parent.formData.id">ADD</button>
                                </label>
                            </form>
                        </div>
                    </popup>

                    <div class="table user-payments-table" v-if="data.payments != ''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="id">#</th>
                                    <th class="id">Value</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th class="actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in data.payments">
                                    <td class="id">
                                        <p>{{item.id}}</p></td>
                                    <td class="id">
                                        <a href="#" @click.prevent="parent.formData = item; $refs.payment.active = 1;">
                                            {{item.value}}
                                        </a>
                                    </td>
                                    <td class=" title td-2">
                                        <a href="#" @click.prevent="parent.formData = item; $refs.payment.active = 1;">
                                            {{item.date_title}}
                                        </a>
                                    </td>
                                    <td class="title td-2">
                                        <p>
                                            {{item.description}}
                                        </p>
                                    </td>
                                    <td class="actions">
                                        <a href="#" @click.prevent="parent.formData = item; $refs.payment.active = 1;">
                                            <i class="fas fa-edit ico"></i>
                                        </a>
                                        <a href="#" @click.prevent="parent.formData = item; delPayment();">
                                            <i class="fas fa-trash-alt ico"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="empty" v-if="data.payments == ''">
                        No items
                    </div>
                </div>

                <div v-if="tab == 0">
                    <div class="camp-panel tac">
                        <div class="w20 ptb10">
                            <h2>{{tabs[tab]}}</h2>
                        </div>
                        <div class="w60 ptb20 ac">
                            <input type="date" v-model="date" @change="get()" /> - <input type="date" v-model="date2" @change="get()" />
                        </div>
                        <div class="w20 ptb15 al"></div>
                    </div>
                    <popup ref="img" title="Banner">
                        <div class="ac">
                            <img class="image" :src="parent.url + '/' + parent.formData.img" v-if="parent.formData.img" />
                        </div>
                    </popup>
                    <div class="table user-statistics-table" v-if="data.statistics != ''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="id"></th>
                                    <th class="image"></th>
                                    <th class="image">Campaign</th>
                                    <th>Size</th>
                                    <th>Link</th>
                                    <th class="id">Views</th>
                                    <th class="id">Clicks</th>
                                    <th class="id">Leads</th>
                                    <th class="id">Fraud clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in data.statistics">
                                    <td class="id toggle">
                                        <toogle v-model="item.published" @update:modelValue="item.published = $event; parent.formData = item; actionStatistic();" />
                                    </td>
                                    <td class="image">
                                        <a href="#" @click.prevent="parent.formData = item; $refs.img.active = 1;">
                                            <img :src="parent.url + '/' + item.img" />
                                        </a>
                                    </td>
                                    <td>{{item.campaign_title}}</td>
                                    <td>{{item.size}}</td>
                                    <td>{{item.link}}</td>
                                    <td class="id">{{item.views}}</td>
                                    <td class="id">
                                        <template v-if="item.clicks">{{item.clicks}}</template>
                                        <template v-if="!item.clicks">0</template>
                                    </td>
                                    <td class="id">
                                        <template v-if="item.leads">{{item.leads}}</template>
                                        <template v-if="!item.leads">0</template>
                                    </td>
                                    <td class="id">
                                        <a href="#" @click.prevent="$refs.details.active = 1; getDetails(item.id, 4)">
                                            <template v-if="item.fclicks">{{item.fclicks}}</template>
                                            <template v-if="!item.fclicks">0</template>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="empty" v-if="data.statistics == ''">
                        No items
                    </div>
                </div>
            </div>
        </div>
    `
}