#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BASE_URL="http://localhost:5000"
ADMIN_EMAIL="admin13@boquetshop.com"
ADMIN_PASS="admin123"
FRONT_IMAGE="../frontend/public/assets/boquet_1.webp"
BACK_IMAGE="./public/boquet_1_temp.webp"

echo -e "${YELLOW}📁 Копирование изображения из фронта в backend${NC}"
cp "$FRONT_IMAGE" "$BACK_IMAGE"

if [ ! -f "$BACK_IMAGE" ]; then
  echo -e "${RED}❌ Файл не скопирован. Прерывание.${NC}"
  exit 1
fi

echo -e "${YELLOW}👑 Регистрация админа${NC}"
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"admin13\", \"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASS\", \"confirmPassword\": \"$ADMIN_PASS\"}" | jq

echo -e "${YELLOW}🔐 Авторизация админа${NC}"
TOKEN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"loginOrEmail\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASS\"}" | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Не удалось получить токен. Прерывание скрипта.${NC}"
  exit 1
fi

echo -e "${GREEN}🔐 Токен получен:${NC} $TOKEN"

echo -e "${YELLOW}📋 Получение всех пользователей${NC}"
curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/api/admin/users | jq

echo -e "${YELLOW}🛠 Изменение роли пользователя #2 на admin${NC}"
curl -s -X PATCH $BASE_URL/api/admin/users/2/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' | jq

echo -e "${YELLOW}📦 Загрузка изображения букета${NC}"
IMAGE_RESPONSE=$(curl -s -X POST $BASE_URL/api/admin/uploads \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@$BACK_IMAGE")

# Проверка JSON
if ! echo "$IMAGE_RESPONSE" | jq . > /dev/null 2>&1; then
  echo -e "${RED}❌ Ошибка от сервера: $IMAGE_RESPONSE${NC}"
  exit 1
fi

echo "$IMAGE_RESPONSE" | jq
IMAGE_URL=$(echo "$IMAGE_RESPONSE" | jq -r '.imageUrl')

if [ -z "$IMAGE_URL" ] || [ "$IMAGE_URL" == "null" ]; then
  echo -e "${RED}❌ Ошибка загрузки изображения. Прерывание.${NC}"
  exit 1
fi

echo -e "${GREEN}🖼 Полученный imageUrl:${NC} $IMAGE_URL"

echo -e "${YELLOW}💐 Создание нового букета${NC}"
BOUQUET_RESPONSE=$(curl -s -X POST $BASE_URL/api/admin/bouquets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Админский\", \"description\": \"Для теста\", \"price\": 777, \"imageUrl\": \"$IMAGE_URL\", \"userId\": 1}")

echo "$BOUQUET_RESPONSE" | jq
BOUQUET_ID=$(echo "$BOUQUET_RESPONSE" | jq -r '.id')

if [ "$BOUQUET_ID" == "null" ] || [ -z "$BOUQUET_ID" ]; then
  echo -e "${RED}❌ Не удалось создать букет. Прерывание скрипта.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Букет создан. ID: $BOUQUET_ID${NC}"

# Очистка временного файла
rm "$BACK_IMAGE"

echo -e "${YELLOW}📋 Все букеты (включая скрытые)${NC}"
curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/api/admin/bouquets | jq

echo -e "${YELLOW}✏️ Обновление букета #$BOUQUET_ID${NC}"
curl -s -X PATCH $BASE_URL/api/admin/bouquets/$BOUQUET_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Обновлённый", "description": "Обновлённый", "price": 888, "isPublic": true}' | jq

echo -e "${YELLOW}❌ Удаление букета #$BOUQUET_ID${NC}"
curl -s -X DELETE $BASE_URL/api/admin/bouquets/$BOUQUET_ID \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "${YELLOW}📦 Получение всех заказов${NC}"
curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/api/admin/orders | jq

echo -e "${YELLOW}🔄 Обновление статуса заказа #1 на 'approved'${NC}"
curl -s -X PATCH $BASE_URL/api/admin/orders/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}' | jq

echo -e "${YELLOW}🔍 Получение заказа #1${NC}"
curl -s -H "Authorization: Bearer $TOKEN" $BASE_URL/api/admin/orders/1 | jq
