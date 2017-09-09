import { action, extendObservable, observable } from 'mobx';

const queryToObservable = (query, { onError, onFetch, prop }) => {
  const observableQuery = observable(query.currentResult());

  query.subscribe({
    next: action(result => {
      const newData = Object.keys(result.data).length === 1 ? result.data[prop] : result.data;
      observableQuery.loading = result.loading;
      observableQuery.data = newData;
      if (onFetch) onFetch(newData);
    }),
    error: action(error => {
      observableQuery.loading = false;
      observableQuery.error = error;
      if (onError) onError(error);
    })
  });

  return observableQuery;
};

export const query = (obj, prop, descriptor) => {
  const decorated = descriptor.initializer;

  const { client, onError, onFetch, ...options } = decorated
    ? descriptor.initializer()
    : descriptor;

  const ref = extendObservable(obj, {
    [prop]: queryToObservable(client.watchQuery(options), { onError, onFetch, prop })
  });

  if (decorated) return ref;

  return null;
};
