import { login } from './pages/login.js';
import { campaigns } from './pages/campaigns.js';
import { campaign } from './pages/campaign.js';
import { user } from './pages/user.js';
import { users } from './pages/users.js';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: "/", name: "sign-in",  component: login },
        { path: "/campaigns", name: "Campaigns",  component: campaigns },
        { path: "/campaign/:id", name: "Campaign",  component: campaign },
        { path: "/users", name: "Users",  component: users },
        { path: "/user/:id", name: "User",  component: user },
    ]
});