const {createApiRoot} = require('@commercetools/platform-sdk');
require('dotenv').config();

async function countProducts() {
  try {
    // Check if required environment variables are set
    const requiredEnvVars = [
      'CLIENT_ID',
      'CLIENT_SECRET',
      'AUTH_URL',
      'PROJECT_KEY',
      'API_URL',
    ];
    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach((varName) => console.error(`   - ${varName}`));
      console.error(
        '\nPlease set these variables in your .env file or environment.'
      );
      console.error(
        'You can copy from template.env and fill in your commercetools credentials.'
      );
      return;
    }

    console.log('🔍 Connecting to commercetools...');

    const apiRoot = createApiRoot({
      projectKey: process.env.PROJECT_KEY,
      credentials: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
      scopes: [`manage_project:${process.env.PROJECT_KEY}`],
    });

    console.log('📊 Counting products...');

    // Get total count of products
    const response = await apiRoot
      .products()
      .get({
        queryArgs: {
          limit: 1, // We only need the total count, not the actual products
        },
      })
      .execute();

    const totalProducts = response.body.total;

    console.log(`\n✅ Product Count Results:`);
    console.log(`   Total Products: ${totalProducts}`);

    // Get some additional stats
    const publishedResponse = await apiRoot
      .products()
      .get({
        queryArgs: {
          where: 'published=true',
          limit: 1,
        },
      })
      .execute();

    const publishedProducts = publishedResponse.body.total;
    const unpublishedProducts = totalProducts - publishedProducts;

    console.log(`   Published Products: ${publishedProducts}`);
    console.log(`   Unpublished Products: ${unpublishedProducts}`);

    // Get products by state
    const stagedResponse = await apiRoot
      .products()
      .get({
        queryArgs: {
          where: 'hasStagedChanges=true',
          limit: 1,
        },
      })
      .execute();

    const stagedProducts = stagedResponse.body.total;
    console.log(`   Products with Staged Changes: ${stagedProducts}`);
  } catch (error) {
    console.error('❌ Error counting products:', error.message);
    if (error.body) {
      console.error('Error details:', JSON.stringify(error.body, null, 2));
    }
  }
}

countProducts();
