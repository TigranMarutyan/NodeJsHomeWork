import fs from "fs/promises";

export async function readFile() {
  try {
    const res = await fs.readFile("./db.json", "utf-8");
    return JSON.parse(res);
  } catch (err) {
    console.error("Directory is empty");
  }
}

export async function getTodosFromDB() {
  const getFile = await readFile();
  return getFile.todos;
}

export async function addTodoToDB(user) {
  try {
    const data = await readFile();
    let currentId = data.nextId;
    const newData = { ...user, id: currentId };
    data.todos.push(newData);
    return fs.writeFile(
      "db.json",
      JSON.stringify({ ...data, nextId: (currentId += 1) }, undefined, 2)
    );
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(users) {
  try {
    const data = await readFile();
    const newData = [...users];
    if (!data) {
      console.log("User Not Found");
      return "User Not Found";
    } else {
      return fs.writeFile(
        "db.json",
        JSON.stringify({ ...data, todos: newData }, undefined, 2)
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateTodoList(user) {
  let data = await readFile();
  const newData = { ...user };
  const newTodos = data.todos.filter((item) => item.id !== Number(user.id));
  newTodos.push(newData);
  data.todos = [...newTodos];
  return fs.writeFile(
    "db.json",
    JSON.stringify({ ...data, nextId: data.nextId }, undefined, 2)
  );
}

export async function postMethod(request) {
  const result = await readFile();
  return new Promise((resolve) => {
    let data = "";
    request.on("data", (chunk) => (data += chunk));
    request.on("end", () => {
      const parsed = JSON.parse(data);
      parsed.id = result.nextId;
      resolve(parsed);
      addTodoToDB(parsed).then((data) => request.end(data));
    });
  });
}

export async function putMethod(request, userId) {
  return new Promise((resolve, reject) => {
    try {
      let data = "";
      request.on("data", (chunk) => (data += chunk));
      request.on("end", () => {
        const parsed = JSON.parse(data);
        parsed.id = +userId;
        resolve(parsed);
        updateTodoList(parsed).then((data) => request.end(data));
      });
    } catch (error) {
      reject(error);
    }
  });
}
