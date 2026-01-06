/**
 * Environment configuration interface for CDK stacks
 */
export interface EnvironmentConfig {
  region: string;
  vpcCidr: string;
  enableNatGateway: boolean;
  dbInstanceType: string;
  dbAllocatedStorage: number;
  dbMultiAz: boolean;
  dbBackupRetention: number;
  dbDeletionProtection: boolean;
  lambdaMemory: number;
  lambdaTimeout: number;
  requireApproval: boolean;
  enableDetailedMonitoring: boolean;
  logRetentionDays: number;
}

/**
 * Load environment configuration from CDK context
 */
export function getEnvironmentConfig(app: any, environmentName: string): EnvironmentConfig {
  const envConfig = app.node.tryGetContext('environments')?.[environmentName];
  
  if (!envConfig) {
    throw new Error(`Environment configuration not found for: ${environmentName}`);
  }
  
  return envConfig as EnvironmentConfig;
}
