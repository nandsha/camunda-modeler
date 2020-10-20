/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import BaseEventHandler from './BaseEventHandler';

const RELEVANT_TAB_TYPES = ['bpmn', 'dmn'];

// Sends a deployment event to ET everytime when a user triggers a deploy to
// the Camunda Engine, ignoring cmmn deploys
export default class DeploymentEventHandler extends BaseEventHandler {

  constructor(params) {

    const { onSend, subscribe } = params;

    super('deployment', onSend);

    subscribe('deployment.done', this.handleDeploymentSuccess);
    subscribe('deployment.error', this.handleDeploymentError);

  }

  // @pinussilvestrus: empty for now, we will need this for further metrics
  // e.g. https://github.com/camunda/camunda-modeler/issues/1971
  generateMetrics = (file) => {
    return {};
  }

  // todo: unify
  handleDeploymentError = (context) => {
    const {
      error,
      tab
    } = context;

    const {
      type,
      file
    } = tab;

    if (!this.isEnabled()) {
      return;
    }

    if (!RELEVANT_TAB_TYPES.includes(type)) {
      return;
    }

    const payload = {
      'diagram-type': type,
      outcome: getErrorMessage(error),
      'diagram-metrics': this.generateMetrics(file)
    };

    this.sendToET(payload);
  }

  handleDeploymentSuccess = (context) => {
    const {
      tab
    } = context;

    const {
      type,
      file
    } = tab;

    if (!this.isEnabled()) {
      return;
    }

    if (!RELEVANT_TAB_TYPES.includes(type)) {
      return;
    }

    const payload = {
      'diagram-type': type,
      outcome: 'success',
      'diagram-metrics': this.generateMetrics(file)
    };

    this.sendToET(payload);
  }

}


// helpers //////////////////

function getErrorMessage(error) {
  return error.problems || error.details || error.message;
}