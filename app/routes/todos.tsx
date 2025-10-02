import { Form } from "react-router";
import type { Route } from "./+types/todos";
import { getAllTodos, addTodo, toggleTodo, deleteTodo } from "../lib/todos.server";

export async function loader() {
  return { todos: getAllTodos() };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "add": {
      const text = formData.get("text");
      if (typeof text === "string" && text.trim()) {
        addTodo(text.trim());
      }
      break;
    }
    case "toggle": {
      const id = formData.get("id");
      if (typeof id === "string") {
        toggleTodo(id);
      }
      break;
    }
    case "delete": {
      const id = formData.get("id");
      if (typeof id === "string") {
        deleteTodo(id);
      }
      break;
    }
  }

  return { success: true };
}

export function meta() {
  return [
    { title: "Todos" },
    { name: "description", content: "A simple todo app" },
  ];
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Todos</h1>
        </div>
        
        {/* Add todo form */}
        <Form method="post" className="mb-6">
          <input type="hidden" name="intent" value="add" />
          <div className="flex gap-2">
            <input
              type="text"
              name="text"
              placeholder="What needs to be done?"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </Form>

        {/* Todo list */}
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No todos yet!</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-md"
              >
                {/* Toggle form */}
                <Form method="post" style={{ display: "contents" }}>
                  <input type="hidden" name="intent" value="toggle" />
                  <input type="hidden" name="id" value={todo.id} />
                  <button
                    type="submit"
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      todo.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-500"
                    }`}
                  >
                    {todo.completed && "✓"}
                  </button>
                </Form>

                <span
                  className={`flex-1 ${
                    todo.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </span>

                {/* Delete form */}
                <Form method="post" style={{ display: "contents" }}>
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="id" value={todo.id} />
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </Form>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            {todos.filter(t => !t.completed).length} of {todos.length} remaining
          </div>
        )}
      </div>
    </div>
  );
}