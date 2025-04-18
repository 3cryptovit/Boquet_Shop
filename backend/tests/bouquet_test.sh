#!/bin/bash

API_URL="http://localhost:5000/api"
EMAIL="floweradmin@example.com"
USERNAME="floweradmin"
PASSWORD="secure123"

echo "📝 Регистрация администратора"
curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" \
  | jq

echo -e "\n🔑 Вход администратора"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"loginOrEmail\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo $LOGIN_RESPONSE | jq

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

echo -e "\n🌼 Получение всех цветов"
curl -s -X GET $API_URL/flowers | jq

echo -e "\n💐 Создание нового публичного букета (админ)"
curl -s -X POST $API_URL/bouquets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "Spring Blossom",
    "description": "Весенний букет",
    "price": 1200,
    "isPublic": true,
    "flowers": [
      {
        "flowerId": 1,
        "layer": 1,
        "positionX": 0,
        "positionY": 0,
        "angle": 0,
        "zIndex": 1,
        "position": 0
      }
    ]
  }' | jq

echo -e "\n📋 Получение публичных букетов"
curl -s -X GET $API_URL/bouquets | jq

echo -e "\n🧩 Создание кастомного букета"
curl -s -X POST $API_URL/custom-bouquets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "Custom 1",
    "description": "Для теста",
    "price": 900,
    "imageUrl": "/assets/custom1.jpg",
    "flowers": [{"position": 0, "flowerId": 1}]
  }' | jq

echo -e "\n🧩 Получение кастомного букета по ID"
curl -s -X GET $API_URL/custom-bouquets/1 \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  | jq
