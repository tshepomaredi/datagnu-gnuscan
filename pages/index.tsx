import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }
  
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">My todos</h2>
      <button 
        onClick={createTodo}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
      >
        + New Todo
      </button>
      
      {todos.length === 0 ? (
        <p className="text-gray-500">No todos yet. Create one to get started.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
          {todos.map((todo) => (
            <li 
              key={todo.id}
              onClick={() => deleteTodo(todo.id)}
              className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
            >
              <span className="flex-grow text-black">{todo.content}</span>
              <span className="text-xs text-gray-400">(click to delete)</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🥳 App successfully styled with Tailwind CSS.</p>
        <p className="mt-2">
          <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/" className="text-blue-600 hover:underline">
            Review next steps of this tutorial.
          </a>
        </p>
      </div>
    </div>
  );
}
