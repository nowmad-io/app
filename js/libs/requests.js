class Api {
  baseConfig = {
    bodyEncoder: JSON.stringify,
    credentials: 'same-origin',
    format: 'json',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    methods: ['get', 'post', 'put', 'delete'],
    basePath: '',
  };

  constructor() {
    const { methods } = this.baseConfig;

    methods.forEach((method) => {
      this[method] = (path = '', {
        params = {}, data = {}, options = {},
      } = {}) => {
        const config = {
          ...this.baseConfig,
          ...options,
          headers: {
            ...this.baseConfig.headers,
            ...(options ? options.headers : {}),
          },
        };

        const {
          methods: _methods, basePath, headers, format, bodyEncoder,
          ...otherConfig
        } = config;

        const requestPath = ((path.indexOf('http') === -1) ? basePath : '') + path + Api.queryString(data);

        const body = params ? bodyEncoder(params) : undefined;

        const fetchOptions = {
          ...otherConfig,
          method,
          headers,
        };

        if (method !== 'get') {
          fetchOptions.body = body;
        }

        return fetch(requestPath, fetchOptions)
          .then(response => ({ response, format }))
          .then(Api.handleErrors)
          .then(response => response[format]());
      };
    });
  }

  initialize(basePath) {
    this.baseConfig = {
      ...this.baseConfig,
      basePath,
    };

    return this;
  }

  setAuthorisation(token) {
    const { Authorization, ...headers } = this.baseConfig.headers;
    this.baseConfig = {
      ...this.baseConfig,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
    };
  }

  static queryString(params) {
    const s = Object.keys(params).map(key => (
      [key, params[key]].map(encodeURIComponent).join('=')
    )).join('&');
    return s ? `?${s}` : '';
  }

  static handleErrors({ response, format }) {
    if (!response.ok) {
      return response[format]()
        // if response parsing failed send back the entire response object
        .catch(() => { throw response; })
        // else send back the parsed error
        .then((parsedErr) => { throw parsedErr; });
    }
    return response;
  }
}

export default new Api();
