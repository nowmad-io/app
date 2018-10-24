import Mixpanel, { MixpanelInstance } from 'react-native-mixpanel';

class MixpanelService {
  initialized = false;

  instance = null;

  initializing = null;

  constructor() {
    Object.getOwnPropertyNames(Mixpanel)
      .forEach((property) => {
        this[property] = async (...args) => {
          this.mixpanel(() => this.instance[property](...args));
        };
      });
  }

  initialize(mixpanelApiKey) {
    this.instance = new MixpanelInstance(mixpanelApiKey);
    this.initializing = this.instance.initialize()
      .then(() => {
        this.initialized = true;
      });

    this.mixpanel = callback => (
      (!this.initialized
        ? this.initializing
        : Promise.resolve(true)
      )
        .then(callback)
        // eslint-disable-next-line no-console
        .catch(error => console.log('Failed to initialize Mixpanel: ', error)));
  }
}

export default new MixpanelService();
