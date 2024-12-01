import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {Dashboard, GraphWidget, MathExpression} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

export class MetricStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const positiveMetric = new MathExpression({
            label: "",
            expression: "SEARCH('{Crypto,CoinName} MetricName=PositiveSellCount', 'Sum', 3600)"
        });

        const negativeMetric = new MathExpression({
            label: "",
            expression: "SEARCH('{Crypto,CoinName} MetricName=NegativeSellCount', 'Sum', 3600)"
        });

        new Dashboard(this, "CryptoDashboard", {
            dashboardName: "CryptoDashboard",
            defaultInterval: Duration.days(7),
        }).addWidgets(
            new GraphWidget({
                title: "Positive transactions percents",
                width: 12,
                period: Duration.days(7),
                statistic: 'Sum',
                left: [positiveMetric]
            }),
            new GraphWidget({
                title: "Negative transactions percents",
                width: 12,
                period: Duration.days(7),
                statistic: 'Sum',
                left: [negativeMetric]
            }));
    }
}