import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuthData } from "../utils/authService";
import useCartStore from "../store/useCartStore";
import useFavoritesStore from "../store/useFavoritesStore";

function Login() {
  const [loginOrEmail, setLoginOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchCart } = useCartStore();
  const { fetchFavorites } = useFavoritesStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginOrEmail || !password) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginOrEmail)) {
      setError("Пожалуйста, введите корректный email адрес");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginOrEmail,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await saveAuthData(data);

        // Загружаем данные пользователя
        const token = localStorage.getItem("token");
        const userResponse = await fetch("http://localhost:5000/api/user/me", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error("Не удалось загрузить данные пользователя");
        }

        const userData = await userResponse.json();
        localStorage.setItem("userRole", userData.role);

        // Загружаем корзину и избранное
        await Promise.all([
          fetchCart(),
          fetchFavorites()
        ]);

        navigate("/");
      } else {
        throw new Error(data.message || "Ошибка входа");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Вход в аккаунт</h1>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="loginOrEmail" style={styles.label}>
            Имя пользователя или Email
          </label>
          <input
            type="text"
            id="loginOrEmail"
            value={loginOrEmail}
            onChange={(e) => setLoginOrEmail(e.target.value)}
            style={styles.input}
            placeholder="Введите имя пользователя или email"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Введите пароль"
            required
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>

      <div style={styles.links}>
        <p>
          Еще нет аккаунта?{" "}
          <a href="/register" style={styles.link}>
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    color: "#555",
    fontWeight: "500",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#ff4081",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  links: {
    marginTop: "20px",
    textAlign: "center",
    color: "#666",
  },
  link: {
    color: "#ff4081",
    textDecoration: "none",
    fontWeight: "500",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    textAlign: "center",
  },
};

export default Login;
