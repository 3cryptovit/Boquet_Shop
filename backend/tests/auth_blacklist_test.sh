#!/bin/bash

API_URL="http://localhost:5000/api/auth"

# 🎯 Тестовые данные
EMAIL="blacklistuser@example.com"
USERNAME="blacklistuser"
PASSWORD="securepassword"

# ✅ 1. Регистрация
echo -e "\n📝 Регистрация пользователя"
curl -s -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" | jq .

# ✅ 2. Вход
echo -e "\n🔑 Вход пользователя"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"loginOrEmail\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_RESPONSE" | jq .

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')

# ✅ 3. Доступ к /me (до logout)
echo -e "\n🙋‍♂️ Доступ к /me ДО logout"
curl -s -X GET "$API_URL/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# ✅ 4. Logout
echo -e "\n🚪 Logout"
curl -s -X POST "$API_URL/logout" \
  -b cookies.txt \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# ❌ 5. Доступ к /me после logout (токен уже в чёрном списке)
echo -e "\n❌ Доступ к /me ПОСЛЕ logout (ожидаем 401)"
curl -s -X GET "$API_URL/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
