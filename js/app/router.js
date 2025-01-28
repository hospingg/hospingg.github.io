import { login } from './pages/login.js';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: "/", name: "sign-in",  component: login },
    ]
});