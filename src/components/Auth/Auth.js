import { createContext, useEffect, useState } from "react";
import { authSubscribe } from "@junobuild/core";
import { Login } from "../Login/Login";
import { Logout } from "../Logout/Logout";

export const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const sub = authSubscribe((user) => setUser(user));

    return () => sub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {user !== undefined && user !== null ? (
        <div>
          {children}
          <Logout />
        </div>
      ) : (
        <Login />
      )}
    </AuthContext.Provider>
  );
};

export { Auth }