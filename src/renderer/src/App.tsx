import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Типизация window для electronAPI
declare global {
  interface Window {
    api: {
      loadTodos: () => Promise<Todo[]>;
      saveTodos: (todos: Todo[]) => Promise<{ success: boolean }>;
    };
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.api.loadTodos().then(setTodos);
  }, []);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = { id: Date.now(), text: input.trim(), done: false };
    setTodos((prev) => [...prev, newTodo]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const saveTodos = async () => {
    await window.api.saveTodos(todos);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container">
      <h1>📝 Мои задачи</h1>

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Новая задача..."
        />
        <button onClick={addTodo}>Добавить</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button className="del" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button className="save-btn" onClick={saveTodos}>
          {saved ? "✅ Сохранено!" : "💾 Сохранить в файл"}
        </button>
      )}

      <p className="hint">Файл: %APPDATA%\electron-todo\todos.json</p>
    </div>
  );
}
