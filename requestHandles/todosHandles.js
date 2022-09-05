import {
  getTodosFromDB,
  deleteUser,
  postMethod,
  putMethod,
} from "../helpers.js";

export async function todosHandles(request, response) {
  if (request.url === "" || request.url === "/") {
    if (request.method === "GET") {
      const todos = await getTodosFromDB();
      response.end(JSON.stringify(todos));
    } else if (request.method === "POST") {
      try {
        const createPost = await postMethod(request);
        response.end(JSON.stringify(createPost));
      } catch (err) {
        throw err;
      }
    }
  } else if (request.url.startsWith("/")) {
    const todos = await getTodosFromDB();
    const userId = request.url.slice(1);
    if (request.method === "DELETE") {
      const user = todos.filter((item) => item.id !== Number(userId));
      deleteUser(user).then((data) => response.end(data));
    } else if (request.method === "GET") {
      const user = todos.find((item) => item.id === Number(userId));
      response.end(JSON.stringify(user));
    } else if (request.method === "PUT") {
      const myPutMethod = await putMethod(request, userId);
      response.end(JSON.stringify(myPutMethod));
    }
  }
}
