import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import useFavoritesStore from "../store/useFavoritesStore";
import formatImageUrl from "../utils/imageUrl";

function Catalog() {
  const { addToCart } = useCartStore();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    setToken(storedToken);
    setUserId(storedUserId);

    fetch("http://localhost:5000/api/bouquets")
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Ошибка запроса:", response.status, response.statusText, errorText);
          throw new Error(`Ошибка загрузки букетов: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Загружено букетов с сервера:", data.length);
          setBouquets(data);
        } else {
          console.error("Получены некорректные данные с сервера:", data);
          setError("Получены некорректные данные с сервера");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки букетов:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (bouquet) => {
    const currentToken = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId");

    if (!currentToken || !currentUserId) {
      if (window.confirm("Для добавления в корзину необходимо войти. Перейти на страницу входа?")) {
        navigate('/login');
      }
      return;
    }

    try {
      // Проверяем, есть ли букет в базе
      const checkResponse = await fetch(`http://localhost:5000/api/bouquets/${bouquet.id}`);
      if (!checkResponse.ok) {
        throw new Error('Букет не найден в базе данных');
      }

      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          userId: currentUserId,
          bouquetId: bouquet.id,
          quantity: 1
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Букет не найден в базе данных');
        }
        throw new Error('Ошибка добавления в корзину');
      }

      const data = await response.json();
      addToCart(bouquet);
      alert("Букет добавлен в корзину!");
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось добавить букет в корзину: " + error.message);
    }
  };

  const handleToggleFavorite = (bouquet) => {
    if (isFavorite(bouquet.id)) {
      removeFromFavorites(bouquet.id);
    } else {
      addToFavorites(bouquet);
    }
  };

  if (loading) {
    return <div style={styles.container}><div style={styles.loader}></div></div>;
  }

  if (error) {
    return <div style={styles.container}>Ошибка: {error}</div>;
  }

  // Если букетов нет, показываем сообщение
  if (bouquets.length === 0) {
    return (
      <div style={{
        padding: '60px 0',
        textAlign: 'center',
        color: '#666'
      }}>
        <h2>Каталог пуст</h2>
        <p>В данный момент букеты не добавлены в каталог.</p>
      </div>
    );
  }

  return (
    <div className="main-content" style={{
      padding: '60px 0',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container">
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Каталог букетов
        </h2>

        <div className="bouquet-grid">
          {bouquets.map((bouquet) => (
            <div key={bouquet.id} className="card fade-in">
              <div style={{
                position: 'relative',
                paddingTop: '75%',
                overflow: 'hidden',
                borderRadius: '8px'
              }}>
                <img
                  src={formatImageUrl(bouquet.image_url)}
                  alt={bouquet.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(bouquet);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isFavorite(bouquet.id) ? '❤️' : '🤍'}
                </button>
              </div>

              <div style={{
                padding: '20px 0'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '10px'
                }}>
                  {bouquet.name}
                </h3>

                <p style={{
                  color: '#666',
                  marginBottom: '20px',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {bouquet.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ff5e7e'
                  }}>
                    {bouquet.price} ₽
                  </span>

                  <button
                    className="btn"
                    style={styles.addButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(bouquet);
                    }}
                  >
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '40px'
        }}>
          <button
            className="nav-button"
            onClick={() => navigate('/constructor')}
          >
            Перейти в конструктор
          </button>
        </div>
      </div>
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
  loader: {
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #ff4081",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "50px auto"
  },
  addButton: {
    padding: '10px 20px',
    fontSize: '14px'
  }
};

// Добавляем глобальные стили для анимаций
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .catalog-item {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .catalog-item:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 20px rgba(0,0,0,0.2);
  }
`;

if (!document.head.querySelector('#catalog-animations')) {
  styleTag.id = 'catalog-animations';
  document.head.appendChild(styleTag);
}

export default Catalog;
