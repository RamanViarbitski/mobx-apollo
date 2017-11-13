import { action, observable } from 'mobx';

const graphql = config => {
  const { client, onError, onFetch, ...opts } = config;

  const query = client.watchQuery(opts);

  const observableQuery = observable(query.currentResult());

  query.subscribe({
    next: action(value => {
      observableQuery.error = undefined;
      observableQuery.loading = value.loading;
      observableQuery.data = value.data;

      if (onFetch) onFetch(value.data);
    }),
    error: action(error => {
      observableQuery.error = error;
      observableQuery.loading = false;
      observableQuery.data = undefined;

      if (onError) onError(error);
    })
  });

  observableQuery.ref = query;

  return observableQuery;
};

export default graphql;
