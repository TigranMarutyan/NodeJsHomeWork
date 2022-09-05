import http from "http";
import { todosHandles } from "./requestHandles/todosHandles.js";

const hostname = "127.0.0.1";
const PORT = 3000;

const server = http.createServer(async function (request, response) {
  response.setHeader("Content-Type", "application/json");
  if (request.url.startsWith("/api/v1/todos")) {
    let path = request.url.slice(13);
    request.url = path;
    todosHandles(request, response);
  } else {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Route Not Found" }));
  }
});

server.listen(PORT, hostname, () => {
  console.log(`Server running on http://${hostname}:${PORT}/`);
});
