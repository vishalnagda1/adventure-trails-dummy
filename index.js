const http = require("http");
const url = require("url");
const fs = require("fs");
const querystring = require("querystring");
const admin = require("./models/adminAuth");

const renderHTML = (path, request, response) => {
    fs.readFile(path, (error, data)=>{
        if(error) {
            response.writeHead(404);
            response.write("<h1>404 - Page not found</h1>");
        } else {
            response.write(data)
        }
        response.end();
    });
}

const server = http.createServer((request, response) => {
    const {pathname} = url.parse(request.url);
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    if(pathname === '/') renderHTML('./views/home.html', request, response);
    else if(pathname === '/packages') renderHTML('./views/package.html', request, response);
    else if(pathname === '/online_booking') renderHTML('./views/booking.html', request, response);
    else if(pathname === '/media') renderHTML('./views/media.html', request, response);
    else if(pathname === '/contact_us') renderHTML('./views/contact.html', request, response);
    else if(pathname === '/login') renderHTML('./views/admin/login.html', request, response);
    else if(pathname === '/admin') {
        let data = "";
        request.on("data", chunk => {
            data += chunk;
        });
        request.on("end", () => {
            const {username, password} = querystring.parse(data);
            if(admin.authLogin(username, password)) {
                renderHTML('./views/admin/index.html', request, response);
            }
            else {
                response.writeHead(307, {"Location": "/login"});
                response.end();
            }
        })
    }
    else response.end();
});

server.listen(1234);
console.log(`The server is listening at http://localhost:1234`);
