#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { RentalManagerServerlessStack } from '../lib/rental-manager-serverless-stack';

const app = new cdk.App();
new RentalManagerServerlessStack(app, 'RentalManagerServerlessStack', {
  env:{
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
