import * as cdk from '@aws-cdk/core'
import { SynchStateMachine } from '../src/state-machines/synch-state-machine'
import { AsynchStateMachine } from '../src/state-machines/asynch-state-machine'
import {PassAsynchStateMachine} from '../src/state-machines/pass-asynch-state-machine'

export class StepFunctionsTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new SynchStateMachine(this, 'Synch')
    new AsynchStateMachine(this, 'Asynch')
    new PassAsynchStateMachine(this, 'Pass')
  }
}
