import Path from 'path-parser';

export class PortalRoute {
  public path: string;
  public classPath: string;
  public urlPattern: Path;
  public roles?: string[];
  public children?: PortalRoute[];
}
