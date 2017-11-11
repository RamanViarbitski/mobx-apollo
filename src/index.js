import { action, extendObservable, observable } from 'mobx';

const queryToObservable = (query, { onError, onFetch }) => {
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

export const query = (obj, prop, descriptor) => {
  const { client, onError, onFetch, ...options } = descriptor.initializer
    ? descriptor.initializer()
    : descriptor;

  return extendObservable(obj, {
    get [prop]() {
      return queryToObservable(client.watchQuery(options), {
        onError,
        onFetch
      });
    }
  });
};
