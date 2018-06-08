import {PortalParsedRoute} from './portal-parsed-route.model';
import {PortalRoute} from './portal-route.model';

export const parseParamsRoute = (route: PortalRoute, values: any): PortalParsedRoute => {
  const parsedRoute = new PortalParsedRoute();

  parsedRoute.path = route.path;

  parsedRoute.source = parsedRoute.path.split('/{')[0] + Object.keys(values).reduce((acc, key) => {
    return acc + '/' + String(values[key]);
  }, '');

  parsedRoute.classPath = route.classPath;
  parsedRoute.options = null;
  parsedRoute.values = values;
  parsedRoute.roles = route.roles ? route.roles : null;

  return parsedRoute;
};
