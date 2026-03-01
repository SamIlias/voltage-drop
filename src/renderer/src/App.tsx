interface Todo {
  id: number;
  text: string;
  done: boolean;
}

declare global {
  interface Window {
    api: {
      loadTodos: () => Promise<Todo[]>;
      saveTodos: (todos: Todo[]) => Promise<{ success: boolean }>;
    };
  }
}

export default function App() {
  // const saveTodos = async () => {
  //   await window.api.saveTodos(todos);
  //   setSaved(true);
  //   setTimeout(() => setSaved(false), 2000);
  // };

  return (
    <div className="h-full w-full border border-solid border-amber-50 mx-auto mt-10 p-8 bg-red-300 rounded-2xl">
      <h1 className="bg-red-500 mb-6 text-[1.8rem] font-semibold">📝 Мои задачи</h1>

    </div>
  )
}
