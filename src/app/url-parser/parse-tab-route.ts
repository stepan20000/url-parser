import {PortalParsedRoute} from './portal-parsed-route.model';
import {PortalRoute} from './portal-route.model';

export const parseTabRoute = (route: PortalRoute, url: string, tab: string): PortalParsedRoute => {
  const parsedRoute = new PortalParsedRoute();

  parsedRoute.path = route.path;
  parsedRoute.source = tab;
  parsedRoute.classPath = route.classPath;
  parsedRoute.options = null;
  parsedRoute.values = {};
  parsedRoute.roles = route.roles ? route.roles : null;
  parsedRoute.tab = tab;

  return parsedRoute;
};
