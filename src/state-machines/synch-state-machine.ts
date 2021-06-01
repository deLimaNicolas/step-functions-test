import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as sfn from '@aws-cdk/aws-stepfunctions'
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks'

export class SynchStateMachine {
    constructor(scope: cdk.Construct, id: string) {

        const baseLambda = {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('src/lambdas')
        }

        const function1 = new lambda.Function(scope, 'First Function', baseLambda)
        const function2 = new lambda.Function(scope, 'Second Function', baseLambda)
        const function3 = new lambda.Function(scope, 'Third Function', baseLambda)

        const job1 = new tasks.LambdaInvoke(scope, 'First Job', {
            lambdaFunction: function1,
            outputPath: '$.Payload'
        })

        const job2 = new tasks.LambdaInvoke(scope, 'Second Job', {
            lambdaFunction: function2,
            outputPath: '$.Payload'
        })

        const job3 = new tasks.LambdaInvoke(scope, 'Third Job', {
            lambdaFunction: function3,
            outputPath: '$.Payload'
        })

        const definition = job1
            .next(job2)
            .next(job3)

        new sfn.StateMachine(scope, id, {
            definition,
            timeout: cdk.Duration.minutes(3)
        })

    }
}