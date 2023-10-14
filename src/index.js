import { Router } from "./router";

const routes = {
    "home": "./src/pages/home/home.html",
    "create": "./src/pages/create/create.html"
}

const router = new Router(routes);
router.initialize();