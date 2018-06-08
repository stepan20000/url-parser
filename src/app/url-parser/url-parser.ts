import { PortalRoute } from './portal-route.model';
import { PortalParsedRoute } from './portal-parsed-route.model';
import Path from 'path-parser';
import * as _ from 'lodash';
import {parseTabRoute} from "./parse-tab-route";

// process routes object was obtained from json file so that we can use path-parser
const processRoutes = (globalRoute: PortalRoute, baseUrl?: string) => {

  baseUrl = baseUrl ? baseUrl + '/' : '';
  let paramPath: string;

  if (globalRoute.path === '[tabs]') {
    globalRoute.path = '';
    // remove '/' from the end of url so that it pass Path.partialTest
    // and this route will be include to the results array
    console.log('baseUrl in ===[tab]', baseUrl);

    paramPath = baseUrl + ':tab';
  } else {
    paramPath = baseUrl + globalRoute.path.replace(/\/{/g, '/:')
    .replace(/\/{/g, '/')
    .replace(/}/g, '')
    .replace(/\/\[tabs\]/g, '/:tab');
  }

  globalRoute.urlPattern = new Path(paramPath);

  if (globalRoute.children && globalRoute.children.length) {
    globalRoute.children.forEach((childRoute) => processRoutes(childRoute, paramPath));
  }

  return globalRoute;
};

const getParsedRoute = (route: PortalRoute, url: string): PortalParsedRoute => {
  const urlMatchRoute: any = route.urlPattern.partialTest(url);

  if (!urlMatchRoute) {
    return null;
  }
  const isTabRoute = !!urlMatchRoute.tab;

  if (isTabRoute) {
    return parseTabRoute(route, url, urlMatchRoute.tab);
  }

  const isParamRoute = !_.isEmpty(urlMatchRoute);

  if (isParamRoute) {
    return parseTabRoute(route, url, urlMatchRoute);
  }

  return

  const parsedRoute = new PortalParsedRoute();
  parsedRoute.path = route.path;
  parsedRoute.classPath = route.classPath;
  // TODO: set correct options here
  parsedRoute.options = null;

  parsedRoute.values = urlMatchRoute;
  if (parsedRoute.values.tab) {
    parsedRoute.tab = parsedRoute.values.tab;
    parsedRoute.values = {};
  }
  parsedRoute.roles = route.roles ? route.roles : null;

  if (_.isEmpty(urlMatchRoute)) {
    parsedRoute.source = parsedRoute.path;
  } else {
    parsedRoute.source = parsedRoute.path.split('/{')[0] + Object.keys(urlMatchRoute).reduce((acc, key) => {
      return acc + '/' + String(urlMatchRoute[key]);
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


export const urlParser = (routes, url: string): PortalParsedRoute[] => {
//  try {
    const spaUrl = url.split('#')[1];
    const rootRoute = processRoutes(routes);

    console.log('rootRoute', rootRoute);
    return spaUrl ? getParsedRoutes(rootRoute, spaUrl) : [];
  // } catch {
  //   console.log('in catch');
  //   return [];
 // }
};


