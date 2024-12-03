import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {Dashboard, GraphWidget, MathExpression, Metric} from "aws-cdk-lib/aws-cloudwatch";
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

        const negativeTotalMetric = new Metric({
            namespace: 'Crypto',
            metricName: 'NegativeTotalSellCount',
            period: Duration.hours(1),
            statistic: 'Sum',
        });

        const positiveTotalMetric = new Metric({
            namespace: 'Crypto',
            metricName: 'PositiveTotalSellCount',
            period: Duration.hours(1),
            statistic: 'Sum',
        });

        const positiveRunningSum = new MathExpression({
            expression: 'SUM([positive])',
            usingMetrics: { positive: positiveTotalMetric },
            label: 'Running Sum of positive transactions',
            period: Duration.hours(1),
            color: '#6fec6f',
        });

        const negativeRunningSum = new MathExpression({
            expression: 'SUM([negative])',
            usingMetrics: { negative: negativeTotalMetric },
            label: 'Running Sum of negative transactions',
            period: Duration.hours(1),
            color: '#e82e2e',
        });

        const resultRunningSum = new MathExpression({
            expression: 'p - n',
            usingMetrics: { n: negativeTotalMetric, p:  positiveTotalMetric},
            label: 'Running Sum of all transactions',
            period: Duration.hours(1),
            color: '#f4bd33',
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
            }),
            new GraphWidget({
                title: 'Running Sum Example',
                width: 24,
                left: [positiveRunningSum, negativeRunningSum, resultRunningSum],
            }));
    }
}