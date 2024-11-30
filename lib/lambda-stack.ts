import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {Vpc} from "aws-cdk-lib/aws-ec2";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';


interface LambdaProps {
    vpc: Vpc,
    walletTable:dynamodb.Table,
    coinOperationTable:dynamodb.Table,
    bucket:s3.Bucket
}

export class LambdaStack extends cdk.Stack {

    constructor(scope: Construct, id: string, lambdaProps:LambdaProps, props?: cdk.StackProps) {
        super(scope, id, props);

        const secret = secretsmanager.Secret.fromSecretCompleteArn(this, 'CryptoLambdaSecret', 'arn:aws:secretsmanager:us-east-1:918068445959:secret:CryptoLambda-a22a0b')

        const cryptoLambda = new lambda.Function(this, 'CryptoLambda', {
            runtime: lambda.Runtime.JAVA_21, // Adjust Java version as needed
            handler: 'com.ech.template.handler.LambdaTradeHandler::handleRequest', // Replace with your handler class
            code: lambda.Code.fromBucket(lambdaProps.bucket, 'BinanceLambda-1.0-SNAPSHOT.jar'),
            memorySize: 512, // Optional: Adjust memory size
            timeout: cdk.Duration.seconds(30), // Optional: Adjust timeout
            vpc: lambdaProps.vpc,
            environment: {
                BINANCE_LOCAL_DYNAMO: 'false'
            }
        });

        lambdaProps.walletTable.grantFullAccess(cryptoLambda)
        lambdaProps.coinOperationTable.grantFullAccess(cryptoLambda)
        secret.grantRead(cryptoLambda);

        // EventBridge Rule to trigger Lambda every 5 minutes
        const rule = new events.Rule(this, 'ScheduleCryptoLambdaRule', {
            schedule: events.Schedule.rate(cdk.Duration.minutes(5)), // 5-minute schedule
        });
        rule.addTarget(new targets.LambdaFunction(cryptoLambda));
    }
}