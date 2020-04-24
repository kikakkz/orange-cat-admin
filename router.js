const main = httpVueLoader('main/main.vue')
const bookmgr = httpVueLoader('bookmgr/bookmgr.vue')
const usermgr = httpVueLoader('usermgr/usermgr.vue')
const routes = [
    {path: '/', redirect: '/main'},
    {path: '/main', component: main, name: 'main'},
    {path: '/bookmgr', component: bookmgr, name: 'bookmgr'},
    {path: '/usermgr', component: usermgr, name: 'usermgr'}
]
const router = new VueRouter({
    routes: routes
})
export {router}