export default class Dispatcher {

  constructor() {
    this.routes = [];
  }

  add(path = '', action = function () {}) {

    if (typeof path !== 'string') {
      return this;
    }

    if (typeof action !== 'function') {
      return this;
    }

    this.routes.push({
      path: path,
      action: action
    });

    return this;
  }

  dispatch(args = []) {

    if (!Array.isArray(args)) {
      args = [args];
    }

    let path = `${location.pathname}${location.search}`;

    this.routes.forEach((route) => {
      if (path.match(`^${route.path}$`)) {
        route.action.apply(this, args);
      }
    });
  }
}