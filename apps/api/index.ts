import type { Todo } from "../../packages/shared";

const todos: Todo[]=[{
    id:1, title: "Learn full stack development"
}];

const cors={
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

Bun.serve({
    port:3001,
    async fetch(req){
        const {pathname} = new URL(req.url);

            if (req.method === "OPTIONS"){
                return new Response(null, { headers: cors });
            }

    if (pathname === "/todos" && req.method === "GET") {
      return Response.json(todos, { 
        headers: cors 
    });
    }

    if (pathname === "/todos" && req.method === "POST") {

      const { title } = (await req.json()) as { title: string };
      const todo: Todo = { id: Date.now(), title };
      todos.push(todo);
      return Response.json(todo, { status: 201, headers: cors });
    }

    return new Response("Not found", { status: 404, headers: cors });
  },
});

console.log("API is on http://localhost:3001");
