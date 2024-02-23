const handleWebsocket = {
  open(ws) {
    console.log('client connected');
    ws.send('[init]: Hello from server!');
  },
  message(ws, message) {
    console.log('client sent message', message);
    ws.send(`[pong]: ${message}`);
  },
  close() {
    console.log('client disconnected');
  },
  upgrade(request, upgrade) {
    const url = new URL(request.url);
    // console.log('waiting to upgrade', url);
    console.log('client upgrade', url.pathname);

    if (url.pathname.startsWith('/ws')) {
      return upgrade(request);
    }
    return false;
  },
};

// and start this server
const server = Bun.serve({
	port: 9998,
	fetch(req, server) {
		// upgrade the request to a WebSocket
        const ok =  handleWebsocket.upgrade(req, server.upgrade.bind(server))
        
        if (ok)
            return;
 
		return new Response('Upgrade failed :(', { status: 500 });
	},
    websocket: handleWebsocket as any
});

console.log(`Helper Bun server listening on ${server.hostname + ":" + server.port}`);