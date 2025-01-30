import { login } from './pages/login.js';
import { campaigns } from './pages/campaigns.js';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: "/", name: "sign-in",  component: login },
        { path: "/campaigns", name: "Campaigns",  component: campaigns },
    ]
});