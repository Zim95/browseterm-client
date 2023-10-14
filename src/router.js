class Router {
    constructor(routes) {
        this.routes = routes;
        this.root = document.getElementById("app-content");
    }

    async fetchHTML(url) {
        const response = await fetch(url);
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`Failed to fetch content from ${url}`);
        }
    }

    async loadContent(fileName) {
        try {
            const content = await this.fetchHTML(fileName);
            this.root.innerHTML = content;
        } catch (error) {
            console.log(error);
        }
    }
    route(defaultRoute="home", notFoundRoute="home") {
        const path = window.location.href.split("/").slice(3).join("/") || "/";
        const route_string = path.split("/")[0] || defaultRoute;
        if(this.routes[route_string]) {
            this.loadContent(this.routes[route_string]);
        } else {
            this.loadContent(this.routes[notFoundRoute]);
        }
    }

    initialize() {
        window.addEventListener("popstate", this.route.bind(this));
        this.route();
    }
}

export {Router};