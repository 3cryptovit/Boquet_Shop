#!/bin/bash

mkdir -p ./logs

SCRIPTS=(
  "admin_test.sh"
  "auth_blacklist_test.sh"
  "auth_test.sh"
  "bouquet_test.sh"
  "cart_test.sh"
  "favorites_test.sh"
)

SUMMARY_FILE="./logs/all_tests_summary.txt"
echo "📋 Результаты всех тестов — $(date)" > $SUMMARY_FILE
echo "------------------------------------" >> $SUMMARY_FILE

for script in "${SCRIPTS[@]}"; do
  name=$(basename "$script" .sh)
  log_file="./logs/${name}.log"

  echo "🚀 Запуск $script..."
  bash "./$script" > "$log_file" 2>&1

  if grep -q "❌" "$log_file"; then
    echo "❌ $script завершён с ошибками" | tee -a $SUMMARY_FILE
  else
    echo "✅ $script прошёл успешно" | tee -a $SUMMARY_FILE
  fi

  echo "---" >> $SUMMARY_FILE
done

echo "✅ Логи сохранены в папке ./logs"
