// app/page.tsx
"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import TodoList from "./component/TodoList";


function App() {
  return (
    <Authenticator>
      <h1>Hello, Amplify 👋</h1>
      <TodoList />
    </Authenticator> 
  );
}

export default App;