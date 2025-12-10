#!/bin/bash

# Admin Panel Database Integration Test Script
# Usage: bash test-admin-integration.sh

echo "================================"
echo "Admin Panel Integration Test"
echo "================================"
echo ""

# Configuration
API_URL="http://localhost:3000/api/admin/users"
ADMIN_COOKIE='user-data={"id":1,"role":"admin"}'

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function for tests
run_test() {
  local test_name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_status=$5
  
  TESTS_RUN=$((TESTS_RUN + 1))
  
  echo -e "${YELLOW}Test ${TESTS_RUN}: ${test_name}${NC}"
  
  if [ "$method" == "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint" \
      -H "Cookie: $ADMIN_COOKIE")
  elif [ "$method" == "POST" ]; then
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -H "Cookie: $ADMIN_COOKIE" \
      -d "$data")
  elif [ "$method" == "PUT" ]; then
    response=$(curl -s -w "\n%{http_code}" -X PUT "$API_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "Cookie: $ADMIN_COOKIE" \
      -d "$data")
  elif [ "$method" == "DELETE" ]; then
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL$endpoint" \
      -H "Cookie: $ADMIN_COOKIE")
  fi
  
  # Extract status code (last line)
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  echo "Status: $http_code (Expected: $expected_status)"
  echo "Response: $body" | head -c 100
  echo ""
  
  if [ "$http_code" == "$expected_status" ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}✗ FAILED${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
  
  echo ""
}

# Pre-flight checks
echo "Checking server availability..."
if ! curl -s http://localhost:3000 > /dev/null; then
  echo -e "${RED}✗ Server not running on http://localhost:3000${NC}"
  echo "Start the server with: npm run dev"
  exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test 1: Get all users
run_test "Fetch all users" "GET" "" "" "200"

# Test 2: Get patients only
run_test "Fetch patients only" "GET" "?role=patient" "" "200"

# Test 3: Get psychiatrists
run_test "Fetch psychiatrists" "GET" "?role=psychiatrist" "" "200"

# Test 4: Get researchers
run_test "Fetch researchers" "GET" "?role=researcher" "" "200"

# Test 5: Get data scientists
run_test "Fetch data scientists" "GET" "?role=data-scientist" "" "200"

# Test 6: Create new patient
echo -e "${YELLOW}Creating test patient...${NC}"
TEST_EMAIL="test_patient_$(date +%s)@example.com"
CREATE_DATA="{
  \"firstName\": \"Test\",
  \"lastName\": \"Patient\",
  \"email\": \"$TEST_EMAIL\",
  \"password\": \"TestPassword123\",
  \"role\": \"patient\",
  \"phone\": \"+1 (555) 999-9999\",
  \"bio\": \"Test patient created by automated test\"
}"
run_test "Create new patient" "POST" "" "$CREATE_DATA" "201"

# Extract user ID from response (this is simplified)
# In a real scenario, parse the JSON response properly
echo "Note: For update/delete tests, manually update the user ID in the script"
echo ""

# Test 7: Unauthorized access (no admin role)
echo -e "${YELLOW}Testing unauthorized access...${NC}"
NO_ADMIN_COOKIE='user-data={"id":2,"role":"patient"}'
response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL" \
  -H "Cookie: $NO_ADMIN_COOKIE")
http_code=$(echo "$response" | tail -n1)
echo "Status: $http_code (Expected: 403)"

if [ "$http_code" == "403" ]; then
  echo -e "${GREEN}✓ PASSED - Correctly rejected non-admin access${NC}"
  TESTS_PASSED=$((TESTS_PASSED + 1))
else
  echo -e "${RED}✗ FAILED - Should reject non-admin access${NC}"
  TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_RUN=$((TESTS_RUN + 1))
echo ""

# Summary
echo "================================"
echo "Test Summary"
echo "================================"
echo "Total Tests: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed! ✓${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Check logs above.${NC}"
  exit 1
fi
