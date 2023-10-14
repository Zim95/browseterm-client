# BrowseTerm Client
Client for BrowseTerm

# Building the JS Files
- The `index.html` file has only one js file linked which is `bundle.js`.
- We need to build `bundle.js` using `webpack`.
- There are two ways to build `bundle.js`.
    - Dev mode: The `bundle.js` file will not be minified.
    - Prod mode: The `bundle.js` file will be miniffied.
- To build in dev mode:
    ```
    npm run build-dev
    ```
- To build in prod mode:
    ```
    npm run build-prod
    ```
- This should generate `./dist/bundle.js`.

# Running the code locally
- We can use `http-server` to serve the code.
- To install `http-server`:
    ```
    npm install -g http-server
    ```
- We are installing it globally because it's a good tool to have.
- Then hit
    ```
    http-server
    ```
- The logs will show that the service is available on: `http://localhost:8080`.
- Feel free to modify the host and port configurations for `http-server`.
- Read more here about `http-server`: https://www.npmjs.com/package/http-server.
