export const header = {
    data:function() {
        return {
            user: {},
            parent: "",
            active: 0,
            menu: 0,
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
        },
        toogleMenu() {
            if (this.menu == 1) {
                this.menu = 0;
            } else {
                this.menu = 1;
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
                    <div class="menu-option" v-if="parent.user && parent.user.type && parent.user.type === 'admin'" :class="{active:menu == 1}">
                        <router-link>
                            <i class="fa-solid fa-xmark fa-lg" @click="menu=0"></i>
                        </router-link>
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


                    
                    <div class="menu-option" :class="{active:menu == 1}" v-if="parent.user && parent.user.type && parent.user.type != 'admin'">
                        <router-link >
                            <i class="fa-solid fa-xmark fa-lg" @click="menu=0"></i>
                        </router-link>
                        <router-link to="/statistics">
                            <p>Statistics</p>
                            <i class="fas fa-chart-area"></i>
                        </router-link>
                        <router-link to="/ads">
                            <p>Ads</p>
                            <i class="fas fa-image"></i>
                        </router-link>
                        <router-link to="/sites">
                            <p>Sites</p>
                            <i class="fab fa-chrome"></i>
                        </router-link>
                        <router-link to="/payments">
                            <p>Payments</p>
                            <i class="fas fa-credit-card"></i>
                        </router-link>
                    </div>
                </div>
                <div class="user-profile" id="user-top" v-if="parent.user && parent.user.user">
                    <i class="fas fa-bars fa-lg" @click="toogleMenu()"></i>
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