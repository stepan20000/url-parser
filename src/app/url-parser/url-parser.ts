import { PortalRoute } from './portal-route.model';
import { PortalParsedRoute } from './portal-parsed-route.model';
import Path from 'path-parser';
import _ from 'lodash';

declare function require(url: string);
const rawRoutes: PortalRoute  = require('./routes.json');

// process routes object was obtained from json file so that we can use path-parser
const processRoutes = (globalRoute: PortalRoute, baseUrl?: string) => {
  baseUrl = baseUrl ? baseUrl + '/' : '';
  let paramPath: string;

  if (globalRoute.path === '[tabs]') {
    globalRoute.path = '';
    // remove '/' from the end of url so that it pass Path.partialTest
    // and this route will be include to the results array
    paramPath = baseUrl.slice(0, baseUrl.length - 1);
  } else {
    paramPath = baseUrl + globalRoute.path.replace(/\/{/g, '/:')
    .replace(/\/{/g, '/')
    .replace(/}/g, '');
  }

  globalRoute.urlPattern = new Path(paramPath);

  if (globalRoute.children && globalRoute.children.length) {
    globalRoute.children.forEach((childRoute) => processRoutes(childRoute, paramPath));
  }

  return globalRoute;
};

const rootRoute = processRoutes(rawRoutes);

const getParsedRoute = (route: PortalRoute, url: string): PortalParsedRoute => {
  const urlMatchRoute = route.urlPattern.partialTest(url);

  if (!urlMatchRoute) {
    return null;
  }

  const parsedRoute = new PortalParsedRoute();
  parsedRoute.path = route.path;
  parsedRoute.classPath = route.classPath;
  // TODO: set correct options here
  parsedRoute.options = null;

  parsedRoute.values = urlMatchRoute;
  parsedRoute.roles = route.roles ? route.roles : null;

  if (_.isEmpty(urlMatchRoute)) {
    parsedRoute.source = parsedRoute.path;
  } else {
    parsedRoute.source = Object.keys(urlMatchRoute).reduce((acc, key) => {
      return acc + String(key) + '/' + String(urlMatchRoute[key]);
    }, '');
  }

  return parsedRoute;
};

const getParsedRoutes = (globalRoute: PortalRoute, url: string ): PortalParsedRoute[] => {
  let parsedRoutes: PortalParsedRoute[] = [];

  const tempParsedRoute = getParsedRoute(globalRoute, url);

  if (!tempParsedRoute) {
    return parsedRoutes;
  }

  parsedRoutes.push(tempParsedRoute);

  if (globalRoute.children && globalRoute.children.length) {
    parsedRoutes = parsedRoutes.concat(globalRoute.children.reduce((acc, childRoute) => {
        const parsedRoute = getParsedRoutes(childRoute, url);
        if (parsedRoute && parsedRoute.length) {
          acc = acc.concat(parsedRoute);
        }
        return acc;
      }, []));
  }

  return parsedRoutes;
};


export const urlParser = (url: string): PortalParsedRoute[] => {
  const spaUrl = url.split('#')[1];

  return getParsedRoutes(rootRoute, spaUrl);
};


