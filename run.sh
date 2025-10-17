# To set up all available tools
npx -y \
  @commercetools/mcp-essentials \
  --tools=all \
  --isAdmin=true \
  --clientId=${CTP_CLIENT_ID} \
  --clientSecret=${CTP_CLIENT_SECRET} \
  --projectKey=${CTP_PROJECT_KEY} \
  --authUrl=${CTP_AUTH_URL} \
  --apiUrl=${CTP_API_URL} \
  # --dynamicToolLoadingThreshold=63 \
  --remote=true

# Let us create a new namespace called recurring-orders using the @updated-new-function.mdc rule.
# Take a look at the inventory and the tax-category namespaces and use the same pattern to create this new namespace.
# Afterwards use the @refactor-functions.mdc rule to refactor and update all the created files and functions and then use the @test.mdc rule to ensure tests are compliant. 
# Ensure that if there is not in-store or customer specific functionality then don't add the store.functions and customer.functions others add them.