// This runs a node server, so that the repl can be always on

const { createServer } = require('http');

const server = createServer((req, res) => {
	res.writeHead(200);
	res.end('Server is on!')
})
	.listen(3000, () => {
		console.log('Server is up.')
	})