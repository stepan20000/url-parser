import {PortalParsedRoute} from './portal-parsed-route.model';
import {PortalRoute} from './portal-route.model';

export const parseRoute = (route: PortalRoute): PortalParsedRoute => {
  const parsedRoute = new PortalParsedRoute();

  parsedRoute.path = route.path;
  parsedRoute.source = route.path;
  parsedRoute.classPath = route.classPath;
  parsedRoute.options = null;
  parsedRoute.values = {};
  parsedRoute.roles = route.roles ? route.roles : null;

  return parsedRoute;
};
