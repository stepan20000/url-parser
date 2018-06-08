import {Component, OnInit} from '@angular/core';
import {PortalRoute} from './url-parser/portal-route.model';
import {urlParser} from './url-parser/url-parser';

declare function require(url: string);
const rawRoutes: PortalRoute  = require('./url-parser/routes-example.json');

const mockRoutes = {
  path: 'orgID',
  classPath: 'goldtier/js/controllers/AppController',
  outlet: 'app',
  roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
  children: [{
    path: 'onepass',
    outlet: 'orgIDmain',
    classPath: 'goldtier/js/controllers/OnepassController'
  },

    {
      path: 'goldtierLogin',
      outlet: 'orgIDmain',
      classPath: 'goldtier/js/controllers/LoginController'
    },
    {
      path: 'main',
      outlet: 'orgIDmain',
      classPath: 'goldtier/js/controllers/MainController',
      roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
      children: [
        {
          path: 'status',
          outlet: 'orgIDcontent',
          classPath: 'goldtier/js/controllers/StatusController',
          roles: ['ADMIN']
        },
        {
          path: 'selection/{selectionId}',
          outlet: 'orgIDcontent',
          classPath: 'goldtier/js/controllers/DynamicSelectionController',
          roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN']
        },

        {
          path: 'someParam/{someId}',
          outlet: 'orgIDcontent',
          classPath: 'goldtier/js/controllers/DynamicSelectionController',
          roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN'],
          children: [{
            path: '[tabs]',
            outlet: 'orgIDdetail',
            classPath: 'goldtier/js/controllers/DynamicFormController',
            roles: ['ADMIN', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_SALES', 'FI_OPS', 'FI_ADMIN']
          }]
        },
      ]
    }]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public routes: any;

  // private exampleRoute = 'http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main/selection/563699893';

 private exampleRoute = 'http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main/someParam/100500/supertaba';


  // private exampleRoute = 'http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main/selection/100500';

  ngOnInit(): void {
    this.routes = urlParser(mockRoutes, this.exampleRoute);
    console.log(this.routes);

    // setTimeout(() => {
    //   console.log(5000)
    //   this.routes = urlParser(this.exampleRoute);
    // }, 5000);
  }
}
