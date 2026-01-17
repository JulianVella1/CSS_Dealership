const http = require('http');

const id = '69404610770fe92f986c79ee';
const url = `http://localhost:5000/api/cars/${id}`;

console.log(`Fetching ${url}...`);

const req = http.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body:', data);
    });
});

req.on('error', (err) => {
    console.log('Error:', err.message);
});

// Timeout check
setTimeout(() => {
    console.log('Timeout reached (3s). Aborting.');
    req.destroy();
}, 3000);
