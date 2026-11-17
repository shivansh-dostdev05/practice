import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from "shared";

const API = "http://localhost:3001";

export default function App() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  
  const { data, isLoading, error } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => fetch(`${API}/todos`).then((r) => r.json()),
  });


  const addTodo = useMutation({
    mutationFn: (title: string) =>
      fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
    },
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error occured</p>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>Todos</h1>
      <ul>
        {data?.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button disabled={!title || addTodo.isPending} onClick={() => addTodo.mutate(title)}>
        Add
      </button>
    </div>
  );
}