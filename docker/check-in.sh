#!/bin/sh -e

echo "APP_APPLICATION_MANAGEMENT_SERVICE_URL:  ${APP_APPLICATION_MANAGEMENT_SERVICE_URL}"
echo "APP_APP_ID:                              ${APP_APP_ID}"
echo "APP_FRONTEND_URL:                        ${APP_FRONTEND_URL}"
echo "APP_AUTH_TOKEN_URL:                      ${APP_AUTH_TOKEN_URL}"
echo "APP_AUTH_TOKEN_CLIENT_ID:                ${APP_AUTH_TOKEN_CLIENT_ID}"
echo "APP_AUTH_TOKEN_CLIENT_SECRET:            ${APP_AUTH_TOKEN_CLIENT_SECRET}"
echo ""

echo "starting nginx..."
nginx

while [ true ];  
do
  accessToken=$(curl --silent -d "client_secret=${APP_AUTH_TOKEN_CLIENT_SECRET}&grant_type=client_credentials&client_id=${APP_AUTH_TOKEN_CLIENT_ID}" -H "Content-Type: application/x-www-form-urlencoded" -X POST ${APP_AUTH_TOKEN_URL} | jq --raw-output .access_token )

  curl --silent --request PUT \
  --url "${APP_APPLICATION_MANAGEMENT_SERVICE_URL}/api/application-management/apps/${APP_APP_ID}" \
  --header "content-type: application/json" \
  --header "authorization: ${accessToken}" \
  --data "{
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
