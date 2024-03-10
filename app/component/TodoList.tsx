// components/TodoList.tsx
"use client";

import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";

// generate your data client using the Schema from your backend
const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"][]>([]);
  const [samples, setSamples] = useState<Schema["Gen2Sample"][]>([]);

  async function listTodos() {
    // fetch all todos
    const { data } = await client.models.Todo.list();
    console.log(`fetched Todo data: ${data}`);
    setTodos(data ?? []);
  }

  async function listSamples() {   
    // fetch all samples
    const { data } = await client.models.Gen2Sample.list();
    console.log(`fetched Gen2Sample data: ${data}`);
    setSamples(data ?? []);
  }

  useEffect(() => {
    listTodos();
    listSamples();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <button onClick={async () => {
        const { errors, data: newTodo } = await client.models.Todo.create({
          content: window.prompt("title is ..."),
          done: false,
          priority: 'medium'
        })
        console.log(errors, newTodo);
      }}>Create Todo</button>   
    <ul>
        {
        todos.map((todo) => (
            <li key={todo.id}>content: {todo.content}, done: {todo.done}, priority: {todo.priority}</li>
        ))}
    </ul>
    <h1>Samples</h1>
      <button onClick={async () => {
        const { errors, data: newSample } = await client.models.Gen2Sample.create({
          value: window.prompt("value is ..."),
        })
        console.log(errors, newSample);
      }}>Create Sample</button>   
    <ul>
        {
        samples.map((sample) => (
            <li key={sample.id}>value: {sample.value}</li>
        ))}
    </ul>
    </div>
  );
}