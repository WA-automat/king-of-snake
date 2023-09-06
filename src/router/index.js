import {createRouter, createWebHistory} from 'vue-router'
import PkIndexView from "../views/pk/PkIndexView";
import NotFound from "../views/error/NotFound";

// 下面的每一个映射为一个对象
// 对象中包含一个路径和一个vue文件
// 使用路径映射到对应的vue文件上
// 并使用一个名称来命名这个映射
const routes = [
    {
        path: "/",
        name: "home",
        redirect: "/pk/"
    },
    {
        path: "/pk/",
        name: "pk_index",
        component: PkIndexView
    },
    {
        path: "/404/",
        name: "not_found_index",
        component: NotFound
    },
    {
        path:"/:catchAll(.*)",
        redirect: "/404/"
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
