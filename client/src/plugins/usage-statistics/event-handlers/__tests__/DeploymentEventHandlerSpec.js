/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

/* global sinon */

import DeploymentEventHandler from '../DeploymentEventHandler';

describe('<DeploymentEventHandler>', () => {

  it('should subscribe to deployment.done', () => {

    // given
    const subscribe = sinon.spy();

    // when
    new DeploymentEventHandler({ subscribe });

    // then
    expect(subscribe.getCall(0).args[0]).to.eql('deployment.done');
  });


  it('should subscribe to deployment.error', () => {

    // given
    const subscribe = sinon.spy();

    // when
    new DeploymentEventHandler({ subscribe });

    // then
    expect(subscribe.getCall(1).args[0]).to.eql('deployment.error');
  });


  it('should send for diagram-type: bpmn', async () => {

    // given
    const subscribe = sinon.spy();
    const onSend = sinon.spy();

    // when
    const diagramOpenEventHandler = new DeploymentEventHandler({ onSend, subscribe });

    diagramOpenEventHandler.enable();

    const handleDeploymentDone = subscribe.getCall(0).args[1];

    await handleDeploymentDone({ tab: { type: 'bpmn' } });

    // then
    expect(onSend).to.have.been.calledWith({
      event: 'deployment',
      'diagram-type': 'bpmn',
      'diagram-metrics': {},
      outcome: 'success'
    });
  });


  it('should send for diagram-type: dmn', async () => {

    // given
    const subscribe = sinon.spy();
    const onSend = sinon.spy();

    // when
    const diagramOpenEventHandler = new DeploymentEventHandler({ onSend, subscribe });

    diagramOpenEventHandler.enable();

    const handleDeploymentDone = subscribe.getCall(0).args[1];

    await handleDeploymentDone({ tab: { type: 'dmn' } });

    // then
    expect(onSend).to.have.been.calledWith({
      event: 'deployment',
      'diagram-type': 'dmn',
      'diagram-metrics': {},
      outcome: 'success'
    });
  });


  it('should NOT send for diagram-type: cmmn', async () => {

    // given
    const subscribe = sinon.spy();
    const onSend = sinon.spy();

    // when
    const diagramOpenEventHandler = new DeploymentEventHandler({ onSend, subscribe });

    diagramOpenEventHandler.enable();

    const handleDeploymentDone = subscribe.getCall(0).args[1];

    await handleDeploymentDone({ tab: { type: 'cmmn' } });

    // then
    expect(onSend).to.not.have.been.called;
  });


  // todo: what errors can we have?
  it('should send deployment error');

});