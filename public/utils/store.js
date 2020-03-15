class GlobalStore {
	constructor() {
    this.router = {
      home: {
        requireLogin: true,
      },
      login: {
        requireLogin: false,
      },
    };
	}
};

export const globalStore = new GlobalStore();