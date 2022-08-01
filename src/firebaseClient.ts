import {config} from '@/config';

export const firebaseClient = {
  get: <ResponseType>(url: string): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
      fetch(`${config.FIREBASE_URL}/${url}`)
        .then(response => {
          if (!response.ok) {
            reject({
              message: response.statusText,
              code: response.status,
            });
            return;
          }

          return response.json();
        })
        .then(resolve)
        .catch(reject);
    });
  },
};
