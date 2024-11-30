#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {S3Stack} from "../lib/s3-stack";
import {VpcStack} from "../lib/vpc-stack";
import {DynamoStack} from "../lib/dynamo-stack";
import {LambdaStack} from "../lib/lambda-stack";

const app = new cdk.App();
const stackRegion = 'eu-west-2';

const props = {
    env: {
        region: stackRegion
    }
}

const s3Stack:S3Stack = new S3Stack(app, 'S3Stack', props);
const vpcStack:VpcStack = new VpcStack(app, 'VpcStack', props)
const dynamoStack:DynamoStack = new DynamoStack(app, 'DynamoStack', props);

const lambdaStack:LambdaStack = new LambdaStack(app, 'LambdaStack',
    {
        vpc: vpcStack.vpc,
        walletTable: dynamoStack.walletTable,
        coinOperationTable: dynamoStack.coinOperationTable,
        bucket: s3Stack.bucket
    }, props)

