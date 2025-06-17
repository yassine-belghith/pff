#!/bin/bash

# Exit on error
set -e

echo "🚀 Testing PFE Backend API..."

# Default values
API_URL="http://localhost:5001/api"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq is not installed. Please install jq to run these tests."
    echo "🔗 https://stedolan.github.io/jq/download/"
    exit 1
fi

# Function to make API requests
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$API_URL$endpoint" -H "Content-Type: application/json")
    else
        response=$(curl -s -X $method "$API_URL$endpoint" -H "Content-Type: application/json" -d "$data")
    fi
    
    echo $response | jq .
    return $?
}

# Test health check endpoint
echo -e "\n🔍 Testing health check..."
api_request GET "/users/health"

# Test registration
echo -e "\n📝 Testing user registration..."
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="Test@1234"
TEST_NAME="Test User"

REGISTER_DATA=$(cat <<EOF
{
  "name": "$TEST_NAME",
  "email": "$TEST_EMAIL",
  "password": "$TEST_PASSWORD",
  "confirmPassword": "$TEST_PASSWORD"
}
EOF
)

REGISTER_RESPONSE=$(api_request POST "/users/register" "$REGISTER_DATA")
echo "Registration response:"
echo $REGISTER_RESPONSE | jq .

# Extract JWT token from registration response
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token' 2>/dev/null || echo "")

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
    echo "❌ Registration failed or token not received"
    exit 1
fi

echo -e "\n🔑 Testing protected route with JWT token..."

# Test getting current user with JWT token
GET_USER_RESPONSE=$(curl -s -X GET "$API_URL/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Current user response:"
echo $GET_USER_RESPONSE | jq .

# Test login
echo -e "\n🔑 Testing login..."
LOGIN_DATA=$(cat <<EOF
{
  "email": "$TEST_EMAIL",
  "password": "$TEST_PASSWORD"
}
EOF
)

LOGIN_RESPONSE=$(api_request POST "/users/login" "$LOGIN_DATA")
echo "Login response:"
echo $LOGIN_RESPONSE | jq .

echo -e "\n✨ API tests completed successfully!"
