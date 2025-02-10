export const header = {
    data:function() {
        return {
            user: {},
            parent: "",
            active: 0,
            menu: 0
        }
    },
    watch: {

    },
    mounted() {
        this.parent = this.$parent.$parent.$parent;
    },
    methods: {
        toogleActive() {
            if (this.active == 1) {
                this.active = 0;
            } else {
                this.active = 1;
            }
        }
    },
    template: `
    <link rel="stylesheet" href="/css/header.css">
    <header class="header">
        <div class="wrapper">
            <div class="content">
                <div class="logo">
                    <img :src="parent.url+'/app/views/images/logo.svg'" />
                </div>
                <div id="menu">
                    <div class="menu-option">
                        <router-link 
                            :class="{'router-link-active': $route.path.startsWith('/campaign')}" 
                            to="/campaigns">
                            <p>Campaigns</p><i class="fas fa-bullhorn"></i>
                        </router-link>
                        <router-link 
                            :class="{'router-link-active': $route.path.startsWith('/user')}" 
                            to="/users">
                            <p>Users</p><i class="fas fa-users"></i>
                        </router-link>
                    </div>


                    <ul :class="{active:menu == 1}" v-if="parent.user && parent.user.type && parent.user.type!='admin'">
                        <li v-if="menu==1" class="al"><i class="fas fa-times" @click="menu=0"></i></li>
                        <li><router-link to="/statistics"><i class="fas fa-chart-area"></i> Statistics</router-link></li>
                        <li><router-link to="/ads"><i class="fas fa-image"></i> Ads</router-link></li>
                        <li><router-link to="/sites"><i class="fas fa-chrome"></i> Sites</router-link></li>
                        <li><router-link to="/payments"><i class="fas fa-credit-card"></i> Payments</router-link></li>
                    </ul>
                </div>
                <div class="user-profile" id="user-top" v-if="parent.user && parent.user.user">
                    <div id="user-circle" @click="toogleActive()"><p>{{parent.user.user[0]}}</p></div>
                    <i @click="toogleActive()" class="fas fa-caret-down"></i>

                    <div id="user-info" :class="{active:active == 1}">
                        <a href="#" @click.prevent="parent.logout();"><p>{{parent.user.user}}</p> <p><i class="fas fa-sign-out-alt"></i> Log out</p></a>
                    </div>
                </div>
            </div>
        </div>
        <msg ref="msg" />
    </header>
`
}