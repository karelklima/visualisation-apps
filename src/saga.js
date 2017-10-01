import { take, call, select, takeEvery, put } from 'redux-saga/effects';
import { PUSH } from 'redux-little-router';

import { fetchRDF, buildAction } from './utils';
import { getService } from './selectors';

function* loadConfig() {
  console.log('LOADING');
  const service = yield select(getService);

  if (!service) {
    console.log('Service spec not found');
    return;
  }

  const contextSpec = {
    sd: 'http://www.w3.org/ns/sparql-service-description#',
    endpoint: { '@id': 'http://www.w3.org/ns/sparql-service-description#endpoint', '@type': '@id' },
    resultFormat: { '@id': 'http://www.w3.org/ns/sparql-service-description#resultFormat', '@type': '@id' },
    supportedLanguage: { '@id': 'http://www.w3.org/ns/sparql-service-description#supportedLanguage', '@type': '@id' },
    defaultDataset: { '@id': 'http://www.w3.org/ns/sparql-service-description#defaultDataset', '@type': '@id' },
    name: { '@id': 'http://www.w3.org/ns/sparql-service-description#name', '@type': '@id' },
    namedGraph: { '@id': 'http://www.w3.org/ns/sparql-service-description#namedGraph', '@type': '@id' }
  };

  const frame = {
    '@context': contextSpec,
    '@type': 'http://www.w3.org/ns/sparql-service-description#Service'
  };

  const context = {
    '@context': contextSpec
  };

  const serviceConfig = yield call(fetchRDF, service, context, frame);

  yield put(buildAction('SET_CONFIG', serviceConfig));
}

export default function* saga() {
  yield call(loadConfig);

  yield takeEvery(PUSH, loadConfig);
}
