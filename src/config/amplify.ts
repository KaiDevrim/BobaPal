import { Amplify } from 'aws-amplify';
import amplifyConfig from '../amplifyconfiguration.json';

/**
 * Initialize Amplify configuration
 * Must be called before any Amplify services are used
 */
export const configureAmplify = (): void => {
  Amplify.configure(amplifyConfig);
};

export { amplifyConfig };
