import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import formatImageUrl from "../utils/imageUrl";
import useCartStore from "../store/useCartStore";

function MyBouquets() {
  const [bouquets, setBouquets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchMyBouquets();
  }, [navigate]);

  const fetchMyBouquets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/my-bouquets", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Не удалось загрузить ваши букеты");
      }

      const data = await response.json();
      setBouquets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBouquet = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот букет?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/admin/bouquets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить букет");
      }

      // Обновляем список после удаления
      fetchMyBouquets();
    } catch (err) {
      setError(err.message);
      alert("Ошибка: " + err.message);
    }
  };

  const handleAddToCart = (bouquet) => {
    addToCart(bouquet);
    alert("Букет добавлен в корзину!");
  };

  if (isLoading) {
    return <div style={styles.loading}>Загрузка ваших букетов...</div>;
  }

  if (error) {
    return <div style={styles.error}>Ошибка: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Мои букеты</h1>

      {bouquets.length === 0 ? (
        <div style={styles.emptyState}>
          <p>У вас пока нет созданных букетов</p>
          <button
            style={styles.createButton}
            onClick={() => navigate('/constructor')}
          >
            Создать букет
          </button>
        </div>
      ) : (
        <>
          <p style={styles.subtitle}>Букеты, которые вы создали</p>

          <div style={styles.grid}>
            {bouquets.map((bouquet) => (
              <div key={bouquet.id} style={styles.card}>
                <div
                  style={{
                    ...styles.cardImage,
                    backgroundImage: `url('${formatImageUrl(bouquet.image_url, "https://via.placeholder.com/300x300?text=Custom+Bouquet")}')`
                  }}
                >
                  <div style={styles.price}>{bouquet.price} ₽</div>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteBouquet(bouquet.id)}
                  >
                    ×
                  </button>
                </div>
                <div style={styles.cardContent}>
                  <h2 style={styles.cardTitle}>{bouquet.name}</h2>
                  <p style={styles.cardDescription}>{bouquet.description || "Ваш уникальный букет"}</p>
                  <div style={styles.flowerInfo}>
                    <span>Цветов: {bouquet.flower_count}</span>
                    <span>Слоев: {bouquet.circle_count}</span>
                  </div>
                  <div style={styles.cardActions}>
                    <button
                      style={styles.addButton}
                      onClick={() => handleAddToCart(bouquet)}
                    >
                      В корзину
                    </button>
                    <button
                      style={styles.viewButton}
                      onClick={() => navigate(`/bouquet/${bouquet.id}`)}
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.createButtonContainer}>
            <button
              style={styles.createButton}
              onClick={() => navigate('/constructor')}
            >
              Создать новый букет
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "10px",
    color: "#333"
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "40px"
  },
  loading: {
    padding: "40px",
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666"
  },
  error: {
    padding: "40px",
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#f44336"
  },
  emptyState: {
    marginTop: "50px",
    padding: "40px",
    background: "#f8f8f8",
    borderRadius: "10px"
  },
  createButton: {
    background: "#ff4081",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginTop: "20px"
  },
  createButtonContainer: {
    marginTop: "40px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
    justifyItems: "center"
  },
  card: {
    width: "100%",
    maxWidth: "300px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.4s ease, box-shadow 0.4s ease"
  },
  cardImage: {
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative"
  },
  price: {
    position: "absolute",
    right: "10px",
    top: "10px",
    background: "#ff4081",
    color: "white",
    padding: "5px 10px",
    borderRadius: "20px",
    fontWeight: "bold"
  },
  deleteButton: {
    position: "absolute",
    left: "10px",
    top: "10px",
    background: "rgba(255, 255, 255, 0.7)",
    color: "#ff4081",
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0
  },
  cardContent: {
    padding: "20px"
  },
  cardTitle: {
    fontSize: "1.4rem",
    margin: "0 0 10px 0",
    color: "#333"
  },
  cardDescription: {
    color: "#666",
    fontSize: "0.95rem",
    margin: "0 0 10px 0",
    height: "40px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical"
  },
  flowerInfo: {
    display: "flex",
    justifyContent: "space-between",
    margin: "0 0 15px 0",
    fontSize: "0.9rem",
    color: "#666"
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between"
  },
  addButton: {
    background: "#ff4081",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    fontWeight: "bold",
    flex: "1",
    marginRight: "10px"
  },
  viewButton: {
    background: "transparent",
    color: "#ff4081",
    border: "1px solid #ff4081",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    flex: "1"
  }
};

export default MyBouquets; 