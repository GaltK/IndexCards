#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network-stack';
import { getEnvironmentConfig } from '../lib/config/environment';

const app = new cdk.App();

// Get environment from context (default to 'dev' if not specified)
const environmentName = app.node.tryGetContext('environment') || 'dev';
const envConfig = getEnvironmentConfig(app, environmentName);

// Use AWS CLI credentials (account and region from current AWS profile)
// Deploy with: cdk deploy --profile your-profile-name
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: envConfig.region,
};

// Create Network Stack
const networkStack = new NetworkStack(app, `IndexCards-Network-${environmentName}`, {
  env,
  vpcCidr: envConfig.vpcCidr,
  enableNatGateway: envConfig.enableNatGateway,
  description: `Network infrastructure for IndexCards platform (${environmentName})`,
});

// Add environment tag to all resources
cdk.Tags.of(app).add('Environment', environmentName);
