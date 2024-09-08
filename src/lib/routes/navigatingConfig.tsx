import { routes } from "./routes";

const publicPages = [routes.articles];

const adminPages = [
    // routes.dashboard,
    routes.articles,
    // routes.blog,
    // routes.posts,
    // routes.users
];

const adminNavItems = [
    // routes.dashboard,
    routes.profile,
    routes.createPost,
    routes.logOut
];

const userPages = [
    // routes.dashboard,
    routes.articles,

    // They provide the same resources, just different from the retrieving method
    // routes.blog,
    // routes.posts
];

const userMenuItems = [
    // routes.dashboard,
    routes.profile,
    routes.createPost,
    routes.logOut
];

const navItems = { publicPages, adminPages, userPages };
const settingItems = { adminNavItems, userMenuItems };

export { navItems };
export { settingItems };