import {config} from '@/config';

export const playlistApiClient = {
  get: <ResponseType>(url: string): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
      fetch(`${config.PLAYLIST_NODE_URL}/${url}`)
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
  post: <ResponseType>(url: string, body: any): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
      fetch(`${config.PLAYLIST_NODE_URL}/${url}`, {
        method: 'POST',
        body: JSON.stringify(body),
      })
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
  put: <ResponseType>(url: string, body: any): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
      fetch(`${config.PLAYLIST_NODE_URL}/${url}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      })
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
