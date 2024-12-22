const http = require('http');
const events = require('events');

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}
);

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.on('request', (req, res) => {
    console.log('Request received');

    //to do: handle request
    
    res.end('Request received');
});

