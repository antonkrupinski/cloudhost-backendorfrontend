import React from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    onAuthStateChanged(auth, setUser);
  }, []);

  return user ? <Dashboard user={user} /> : <Login />;
}

export default App;
