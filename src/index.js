import { computed, extendObservable } from 'mobx';
import { fromResource } from 'mobx-utils';

export const queryToObservable = (query, { onError, onFetch, prop, obj }) => {
  let subscription;

  return fromResource(
    sink =>
      (subscription = query.subscribe({
        next: ({ data }) => {
          const newData = Object.keys(data).length === 1 ? data[prop] : data;
          sink(newData);
          if (onFetch) onFetch(newData, obj);
        },
        error: error => {
          if (onError) onError(error, obj);
        }
      })),
    () => subscription.unsubscribe()
  );
};

export const query = (obj, prop, descriptor) => {
  const decorated = descriptor.initializer;

  const privateName = `_${prop}`;

  const { client, onError, onFetch, ...options } = decorated
    ? descriptor.initializer()
    : descriptor;

  const ref = extendObservable(obj, {
    [privateName]: queryToObservable(client.watchQuery(options), {
      onError,
      onFetch,
      prop,
      obj
    }),
    [prop]: computed(() => obj[privateName].current())
  });

  if (decorated) return ref;

  return null;
};
