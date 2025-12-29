import { Amplify } from 'aws-amplify';
import devConfig from '../amplifyconfiguration.json';
// Uncomment for production:
// import prodConfig from '../amplifyconfiguration.prod.json';

/**
 * Get the appropriate Amplify configuration based on environment
 */
const getAmplifyConfig = () => {
  // TODO: When ready for production, uncomment the following:
  // const isProduction = process.env.APP_ENV === 'production';
  // return isProduction ? prodConfig : devConfig;

  return devConfig;
};

/**
 * Initialize Amplify configuration
 * Must be called before any Amplify services are used
 */
export const configureAmplify = (): void => {
  const config = getAmplifyConfig();
  Amplify.configure(config);
};

export const amplifyConfig = getAmplifyConfig();
