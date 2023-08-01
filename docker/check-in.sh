#!/bin/sh -e

echo "APP_PLATFORM_URL: ${APP_PLATFORM_URL}"
echo "APP_ID:           ${APP_ID}"
echo "APP_TOKEN:        ${APP_TOKEN}"
echo "APP_FRONTEND_URL: ${APP_FRONTEND_URL}"
echo ""

echo "starting nginx..."
nginx

while [ true ];  
do
  curl --silent --request PUT \
  --url "${APP_PLATFORM_URL}/api/applicationmanagement/apps/${APP_ID}" \
  --header 'Content-Type: application/json' \
  --data "{
            \"token\": \"${APP_TOKEN}\",
            \"backendUrl\": \"\",
            \"frontendUrl\": \"${APP_FRONTEND_URL}\",
            \"entryPoint\": \"#!/\",
            \"options\": [{\"id\":\"USAGE\",\"alias\":\"Usage of Customer Management app\"}]
          }"

  if [[ "$?" -eq 0 ]]; then
    echo "Check-in was successful"
  else 
    echo "Check-in failed"
  fi

  sleep 60;
  
done
