import { Amplify } from 'aws-amplify';
import devConfig from '../amplifyconfiguration.json';
import prodConfig from '../amplifyconfiguration.prod.json';

/**
 * Get the appropriate Amplify configuration based on environment
 */
const getAmplifyConfig = () => {
  const isProduction = process.env.APP_ENV === 'production';
  return isProduction ? prodConfig : devConfig;
};

/**
 * Initialize Amplify configuration
 * Must be called before any Amplify services are used
 */
export const configureAmplify = (): void => {
  const config = getAmplifyConfig();

  // Configure with Gen1 format but add explicit Auth config for React Native OAuth
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.aws_user_pools_id,
        userPoolClientId: config.aws_user_pools_web_client_id,
        identityPoolId: config.aws_cognito_identity_pool_id,
        loginWith: {
          oauth: {
            domain: config.oauth.domain,
            scopes: config.oauth.scope as (
              | 'email'
              | 'profile'
              | 'openid'
              | 'phone'
              | 'aws.cognito.signin.user.admin'
            )[],
            redirectSignIn: [config.oauth.redirectSignIn],
            redirectSignOut: [config.oauth.redirectSignOut],
            responseType: config.oauth.responseType as 'code',
          },
        },
      },
    },
    Storage: {
      S3: {
        bucket: config.aws_user_files_s3_bucket,
        region: config.aws_user_files_s3_bucket_region,
      },
    },
  });
};

export const amplifyConfig = getAmplifyConfig();
