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

    extractScriptsFromContent(content) {
        const scripts_regex = /<script\s+src="[^"]*"><\/script>/g;
        const scripts = content.match(scripts_regex);
        if(!scripts) {
            return [];
        }
        const src_regex = /src="[^"]*"/g;
        let srcs = [];
        for (let script of scripts) {
            srcs.push(
                script.match(src_regex)[0].replace(
                "src=", "").replace('"', "").replace('"', "")
            );
        }
        return srcs;
    }

    loadScripts(scripts) {
        for(let script of scripts) {
            const scriptElement = document.createElement("script");
            scriptElement.src = script;
            document.body.appendChild(scriptElement);
        }
    }

    async loadContent(fileName) {
        try {
            const content = await this.fetchHTML(fileName);
            this.root.innerHTML = content;
            // load script
            const scripts = this.extractScriptsFromContent(content);
            this.loadScripts(scripts);
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
}

export {Router};