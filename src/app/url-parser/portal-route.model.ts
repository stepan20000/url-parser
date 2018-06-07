import UrlPattern = require('url-pattern');

export class PortalRoute {
  public path: string;
  public paramPath: string;
  public classPath: string;
  public urlPattern: UrlPattern;
  public roles?: string[];
  public children?: PortalRoute[];
}
