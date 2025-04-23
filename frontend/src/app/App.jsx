import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router";
import Header from "../shared/ui/Header";
import { useAuthStore } from "../features/auth/model";

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
      }
    };

    initializeApp();
  }, [checkAuth]);

  return (
    <Router>
      <div className="layout-container">
        <div className="background-blur" />
        <Header />
        <div className="content">
          <AppRouter />
        </div>
      </div>
    </Router>
  );
};

export default App;
