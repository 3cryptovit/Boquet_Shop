#!/bin/bash

API_URL="http://localhost:5000/api"
EMAIL="cartuser@example.com"
USERNAME="cartuser"
PASSWORD="secure123"

echo "📝 Регистрация пользователя"
curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" | jq

echo -e "\n🔑 Вход пользователя"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"loginOrEmail\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo $LOGIN_RESPONSE | jq

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

# 🛍 Получение корзины
echo -e "\n🛒 Получение пустой корзины"
curl -s -X GET $API_URL/cart \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

# ➕ Добавление обычного букета
echo -e "\n➕ Добавление обычного букета в корзину"
curl -s -X POST $API_URL/cart \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bouquetId": 1, "quantity": 2}' | jq

# 🌸 Создание кастомного букета
echo -e "\n🌸 Создание кастомного букета"
CUSTOM_RESPONSE=$(curl -s -X POST $API_URL/custom-bouquets \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom 1",
    "description": "Для теста",
    "price": 900,
    "imageUrl": "/assets/custom1.jpg",
    "flowers": [
      { "position": 0, "flowerId": 1 },
      { "position": 1, "flowerId": 2 }
    ]
  }')
echo $CUSTOM_RESPONSE | jq

CUSTOM_ID=$(echo $CUSTOM_RESPONSE | jq -r '.id')

# ➕ Добавление кастомного букета в корзину
echo -e "\n➕ Добавление кастомного букета в корзину"
curl -s -X POST $API_URL/cart/custom \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"customBouquetId\": $CUSTOM_ID, \"quantity\": 1}" | jq

# 🛍 Просмотр корзины
echo -e "\n🛍 Текущее содержимое корзины"
CART=$(curl -s -X GET $API_URL/cart \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo $CART | jq

# Получаем ID обычного букета
CART_ITEM_ID=$(echo $CART | jq -r '.[] | select(.bouquetId != null) | .id')

# 🔄 Обновление количества
echo -e "\n🔄 Изменение количества букета в корзине"
curl -s -X PUT $API_URL/cart/$CART_ITEM_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}' | jq

# ❌ Удаление одного элемента из корзины
echo -e "\n❌ Удаление обычного букета из корзины"
curl -s -X DELETE $API_URL/cart/$CART_ITEM_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

# ✅ Оформление заказа
echo -e "\n✅ Оформление заказа (в корзине остался кастомный)"
curl -s -X POST $API_URL/orders \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

# 📜 История заказов
echo -e "\n📜 Получение всех заказов пользователя"
curl -s -X GET $API_URL/orders \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
