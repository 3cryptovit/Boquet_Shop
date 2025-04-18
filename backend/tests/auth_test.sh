#!/bin/bash

API_URL="http://localhost:5000/api/auth"
COOKIES="cookies.txt"

# ✅ Удаляем старые cookies
rm -f $COOKIES

echo -e "\n📝 Регистрация пользователя"
curl -s -c $COOKIES -X POST "$API_URL/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","username":"testuser","password":"password123","confirmPassword":"password123"}' \
  | jq .

echo -e "\n🔑 Вход пользователя"
LOGIN_RESPONSE=$(curl -s -c $COOKIES -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"loginOrEmail":"testuser","password":"password123"}')
echo "$LOGIN_RESPONSE" | jq .

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r .accessToken)

echo -e "\n🙋‍♂️ Запрос текущего пользователя (me)"
curl -s -b $COOKIES -H "Authorization: Bearer $ACCESS_TOKEN" "$API_URL/me" | jq .

echo -e "\n♻️ Обновление токена"
REFRESH_RESPONSE=$(curl -s -b $COOKIES -X POST "$API_URL/refresh")
echo "$REFRESH_RESPONSE" | jq .

NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | jq -r .accessToken)

echo -e "\n🚪 Выход"
curl -s -b $COOKIES -X POST "$API_URL/logout" | jq .

echo -e "\n❌ Повторный доступ к /me после logout (должен быть 401)"
curl -s -b $COOKIES -H "Authorization: Bearer $NEW_ACCESS_TOKEN" "$API_URL/me" | jq .
