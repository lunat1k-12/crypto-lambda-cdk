import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {RemovalPolicy} from "aws-cdk-lib";

export class DynamoStack extends cdk.Stack {
    readonly walletTable:dynamodb.Table;
    readonly coinOperationTable:dynamodb.Table;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create a DynamoDB table
        this.walletTable = new dynamodb.Table(this, 'WalletCoin', {
            tableName: 'WalletCoin',
            partitionKey: { name: 'CoinName', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // On-demand pricing
            removalPolicy: RemovalPolicy.DESTROY, // Auto-delete table on stack removal
        });

        this.coinOperationTable = new dynamodb.Table(this, 'CoinOperation', {
            tableName: 'CoinOperation',
            partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // On-demand pricing
            removalPolicy: RemovalPolicy.DESTROY, // Auto-delete table on stack removal
        });
    }
}