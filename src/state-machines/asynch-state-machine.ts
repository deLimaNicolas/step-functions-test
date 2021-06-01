import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as sfn from '@aws-cdk/aws-stepfunctions'
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks'
import { Function } from '@aws-cdk/aws-lambda'

export class AsynchStateMachine {
    constructor(scope: cdk.Construct, id: string) {

        const errorHanderLambda = {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'handler-error.handler',
            code: lambda.Code.fromAsset('src/lambdas')
        }

        const throwErrorLambda = {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'throw-error.handler',
            code: lambda.Code.fromAsset('src/lambdas')
        }

        const function1ARN = 'arn:aws:lambda:sa-east-1:598771507540:function:StepFunctionsTestStack-FirstFunction599DF02F-WyOPWSE6AL8J'
        const function2ARN = 'arn:aws:lambda:sa-east-1:598771507540:function:StepFunctionsTestStack-SecondFunction9C207818-wGhO0rqcKVDr'
        const function3ARN = 'arn:aws:lambda:sa-east-1:598771507540:function:StepFunctionsTestStack-ThirdFunctionB6305579-3GdBGulxym0e'

        const function1 = Function.fromFunctionArn(scope, 'First Function -- ASYNCH', function1ARN)
        const function2 = Function.fromFunctionArn(scope, 'Second Function -- ASYNCH', function2ARN)
        const function3 = Function.fromFunctionArn(scope, 'Third Function -- ASYNCH', function3ARN)

        const fucntionThrowError = new lambda.Function(scope, 'Throw Error', throwErrorLambda)
        const functionError = new lambda.Function(scope, 'Error Handler', errorHanderLambda)

        const job1 = new tasks.LambdaInvoke(scope, 'First Job -- ASYNCH', {
            lambdaFunction: function1,
            outputPath: '$.Payload'
        })

        const job2 = new tasks.LambdaInvoke(scope, 'Second Job -- ASYNCH', {
            lambdaFunction: function2,
            outputPath: '$.Payload'
        })

        const job3 = new tasks.LambdaInvoke(scope, 'Third Job -- ASYNCH', {
            lambdaFunction: function3,
            outputPath: '$.Payload'
        })

        const handleErrorJob = new tasks.LambdaInvoke(scope, 'Handle Error Job', {
            lambdaFunction: functionError,
            outputPath: '$.Payload'
        })

        const jobToThrowError = new tasks.LambdaInvoke(scope, 'Job To Throw Error', {
            lambdaFunction: fucntionThrowError,
            outputPath: '$.Payload',
            payload: {
                type: sfn.InputType.OBJECT,
                value: {
                    step: 'Job To Throw Error'
                }
            }
        })

        const definition = new sfn.Parallel(scope, 'Parallel Execution')
            .branch(job1)
            .branch(jobToThrowError)
            .branch(job2)
            .addCatch(handleErrorJob, {resultPath: '$.error-info'})
            .next(job3)

        new sfn.StateMachine(scope, id, {
            definition,
            timeout: cdk.Duration.minutes(3)
        })

    }
}