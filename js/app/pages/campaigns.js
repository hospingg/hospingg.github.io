export const campaigns = {
    data:function() {
        return {
            parent: "",
            data: {},
            details: {},
            date: "",
            date2: "",
            q: "",
            sort: "",
            loader: 1,
            iChart: -1,
            id: 0,
            type: 0,
            all: true
        }
    },
    mounted:function() {
        this.parent = this.$parent.$parent;

        if(!this.parent.user) {
            this.parent.logout();
        }
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
            
            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);

            self.loader = 1;
            axios.post(this.parent.url + "/site/getCampaigns?auth=" + this.parent.user.auth, data).then(function(response) {
                self.data = response.data;
                self.loader = 0;
                if (self.iChart != -1) self.line(self.data.items[self.iChart]);
            }).catch(function(error) {
                self.parent.logout();
            });
        },
        getDetails:function(bid = false, type = false) {
            this.details = {};
            if (bid) this.id = bid;
            if (type) this.type = type;
            if (this.id) bid = this.id;
            if (this.type) type = this.type;

            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);
            if (this.q != "") data.append('q', this.q);
            if (this.sort != "") data.append('sort', this.sort);
            if (bid != "") data.append('bid', this.bid);
            if (type != "") data.append('type', this.type);

            self.loader = 1;

            axios.post(this.parent.url + "/site/getStatisticsDetails?auth=" + this.parent.user.auth, data).then(function(response) {
                self.details = response.data;
                self.loader = 0;
            }).catch(function(error) {
                self.parent.logout();
            })
        },

        action:function() {
            var self = this;
            self.parent.formData.copy = "";
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth, data).then(function(response) {
                self.$refs.new.active = 0;
                if (self.parent.formData.id) {
                    self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new campaign!");
                }
                
                self.get();
            }).catch(function(error) {
                console.log("errors: ", error);
            });
        },

        del:async function() {
            if(await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this campaign?")) {
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url + "/site/deleteCampaign?auth=" + this.parent.user.auth, data).then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully deleted campaign!");
                        self.get();
                    }
                }).catch(function(error) {
                    console.log("errors: ", error);
                });
            }
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

                document.getElementById('chartOuter').innerHTML = '<div id="chartHints" class="chart-hints"><p class="chartHintsViews">Views</p><p class="chartHintsClicks">Clicks</p></div><canvas id="myChart"></canvas>';
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
        checkAll:function(prop) {
            if (this.data.items[this.iChart].sites) {
                for(let i in this.data.items[this.iChart].sites) {
                    this.data.items[this.iChart].sites[i].include = prop;
                }
            }
            this.parent.formData = this.data.items[this.iChart];
            this.get();
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
                        <h1>Campaigns</h1>                    
                    </div>
                    <div class="date-container"><input type="date" v-model="date" @change="get()" /> - <input type="date" v-model="date2" @change="get()" /></div>
                    <button class="new-btn" href="#" @click.prevent="parent.formData={}; $refs.new.active=1">
                        <p>New</p> <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <popup ref="chart" fullscreen="true" title="Chart">
                    <div class="analytics-flex">
                        <div class="chart-dates" id="chart-dates"><input type="date" v-model="date" @change="get();" /> - <input type="date" v-model="date2" @change="get();" /></div>
                        
                        <div class="blocks">
                            <div class="data-container clicks">
                                <div> <p>Clicks</p></div>
                                <p class="chart-content">{{data.items[iChart].clicks}}</p>
                            </div>
                            <div class="data-container views">
                                <div><p>Views</p></div>
                                <p class="chart-content">{{data.items[iChart].views}}</p>
                            </div>
                            <div class="data-container leads">
                                <div><p>Leads</p></div>
                                <p class="chart-content">{{data.items[iChart].leads}}</p>
                            </div>
                            <div class="data-container ctr">
                                <div><p>CTR</p></div>
                                <p class="chart-content">{{(data.items[iChart].clicks * 100 / data.items[iChart].views).toFixed(2)}}%</p>
                            </div>
                        </div>
                    </div>
                    <div class="charts-content">
                        <div class="chart-list">
                            <div class="itemchart" v-if="all">
                                <toogle v-model="all" @update:modelValue="all = $event; checkAll($event)" />
                                <p>All</p>
                            </div>
                            <div class="itemchart" v-if="data.items[iChart].sites" v-for="s in data.items[iChart].sites">
                                <toogle v-model="s.include" @update:modelValue="s.include = $event; parent.formData = data.items[iChart]; get()" />    
                                <p>{{s.site}}</p>    
                            </div>
                        </div>
                        <div class="chart-outer" id="chartOuter">
                            <div id="chartHints" class="chart-hints">
                                <div class="chartHintsViews">Views</div>
                                <div class="chartHintsClicks">Clicks</div>
                            </div>
                            <canvas id="myChart"></canvas>
                        </div>
                    </div>
                </popup>

                <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit campaign' : 'New campaign'">
                    <div class="form">
                        <form @submit.prevent="action()" v-if="parent.formData">
                                <label>
                                    Name
                                    <input type="text" v-model="parent.formData.title" required>
                                </label>

                            <div class="btns col">
                                <button class="btn" v-if="parent.formData && parent.formData.id">EDIT</button>
                                <button class="btn" v-if="parent.formData && !parent.formData.id">ADD</button>
                            </div>
                        </form>
                    </div>
                </popup>

                <div class="table" v-if="data.items != ''">
                    <table>
                        <thead>
                            <tr>
                                <th class="id">#</th>
                                <th class="id"></th>
                                <th class="title">Title</th>
                                <th class="id">Views</th>
                                <th class="id">Clicks</th>
                                <th class="id">Leads</th>
                                <th class="id">Fraud clicks</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in data.items">
                                <td class="id"><p>{{item.id}}</p> </td>
                                <td class="id toogle ">
                                    <toogle v-model="item.published" @update:modelValue="parent.formData = item; action();" />
                                </td>
                                <td ><router-link class="title" :to="'/campaign/'+item.id">{{item.title}}</router-link></td>
                                <td class="id">
                                    <a  href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 1)">
                                        {{item.views}}
                                    </a>
                                </td>
                                <td class="id">
                                    <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 2)">
                                        <template v-if="item.clicks">{{item.clicks}}</template>
                                        <template v-if="!item.clicks">0</template>
                                    </a>
                                </td>
                                <td class="id">
                                    <a  href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 3)">
                                        <template v-if="item.leads">{{item.leads}}</template>
                                        <template v-if="!item.leads">0</template>
                                    </a>
                                </td>
                                <td class="id">
                                    <a  href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                                        <template v-if="item.fclicks">{{item.fclicks}}</template>
                                        <template v-if="!item.fclicks">0</template>
                                    </a>
                                </td>
                                <td class="actions">
                                    <router-link :to="'/campaign/' + item.id">
                                        <i class="fas fa-edit ico"></i>
                                    </router-link>
                                    <a href="#" @click.prevent="parent.formData = item; iChart = i; $refs.chart.active=1; line(item)">
                                        <i class="fas fa-chart-bar ico"></i>
                                    </a>
                                    <a href="#" @click.prevent="parent.formData = item; del();">
                                        <i class="fas fa-trash-alt ico"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="empty" v-if="data.items==''">
                    No items
                </div>
            </div>
        </div>
    `
};