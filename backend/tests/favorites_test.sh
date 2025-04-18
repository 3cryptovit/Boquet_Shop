#!/bin/bash

API_URL="http://localhost:5000/api"
EMAIL="favnew@example.com"
USERNAME="favnew"
PASSWORD="secure123"

echo "📝 Регистрация нового пользователя"
curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" | jq

echo -e "\n🔐 Вход в систему"
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"loginOrEmail\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo $LOGIN_RESPONSE | jq

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

echo -e "\n📋 Получение публичных букетов"
BOUQUETS=$(curl -s -X GET $API_URL/bouquets)
echo $BOUQUETS | jq

BOUQUET_ID=$(echo $BOUQUETS | jq -r '.[0].id')

if [ "$BOUQUET_ID" == "null" ]; then
  echo "❌ Нет доступных букетов для добавления в избранное"
  exit 1
fi

echo -e "\n❤️ Добавление букета #$BOUQUET_ID в избранное"
curl -s -X POST $API_URL/favorites/$BOUQUET_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

echo -e "\n📋 Список избранных"
curl -s -X GET $API_URL/favorites \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

echo -e "\n🗑 Удаление из избранного"
curl -s -X DELETE $API_URL/favorites/$BOUQUET_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq

echo -e "\n📋 Финальный список избранных"
curl -s -X GET $API_URL/favorites \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
