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
    const {pathname, query} = url.parse(request.url);
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
    else if(pathname === '/details') {
        const {package} = querystring.parse(query);
        renderHTML(`./data/packages/${package}.html`, request, response)
    }
    else if(pathname === '/save_booking') {
        let data = "";
        request.on("data", chunk => {
            data += chunk;
        });
        request.on("end", () => {
            const {name, email, package} = querystring.parse(data);
            fs.appendFile(`./data/booking/data.html`, `<tr><td>${name}</td><td>${package}</td><td>${email}</td></tr>`, err => {
                if(err) throw err;
                response.end(`<h3>Your booking is successfully recorded.</h3>`);
            });
        });
    }
    else if (pathname === '/booking_view') {
        fs.readFile('./data/booking/data.html', (err, data) => {
            if(err) throw err;
            const bookingData = `<h1>Booking List</h1><br /><table><tr><th>Name</th><th>Package</th><th>eMail</th></tr>${data}</table>`;
            response.end(bookingData); 
        });
    }
    else response.end();
});

server.listen(1234);
console.log(`The server is listening at http://localhost:1234`);
