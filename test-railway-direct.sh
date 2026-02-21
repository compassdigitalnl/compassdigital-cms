#!/bin/bash

# Direct Railway API test
TOKEN="3071c738-c7e4-463f-8a8a-7fb865a98bb0"

echo "Testing Railway API with token: ${TOKEN:0:8}...${TOKEN: -4}"
echo ""

curl -s https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"query":"query { me { id email name } }"}' | python3 -m json.tool

echo ""
echo "If you see 'Not Authorized', the token might need specific permissions."
