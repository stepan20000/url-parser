import { urlParser } from './url-parser';
import * as _ from 'lodash';

describe('url parser', () => {
  let mockRoutes;

  let wrongUrl;
  let urlWithoutParams;
  let urlWithParams;
  let urlWithTabs;
  let selectionId;

  let withoutParamsResult;
  let withParamsResult;
  let withTabsResult;
  let someId;

  beforeEach(() => {
    wrongUrl = 'something#wrong';
    selectionId = 100500;
    someId = 555;
    urlWithoutParams = 'http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main';
    urlWithParams = `http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main/selection/${selectionId}`;
    urlWithTabs = `http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main/someParam/${someId}`

    mockRoutes = {
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


    withoutParamsResult = [
      {
        classPath: 'goldtier/js/controllers/AppController',
        options: null,
        path: 'orgID',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
        source: 'orgID',
        values: {}
      },
      {
        classPath: 'goldtier/js/controllers/MainController',
        options: null,
        path: 'main',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
        source: 'main',
        values: {}
      }
    ];

    withParamsResult = [
      {
        classPath: 'goldtier/js/controllers/AppController',
        options: null,
        path: 'orgID',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
        source: 'orgID',
        values: {}
      },
      {
        classPath: 'goldtier/js/controllers/MainController',
        options: null,
        path: 'main',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
        source: 'main',
        values: {}
      },
      {
        classPath: 'goldtier/js/controllers/DynamicSelectionController',
        options: null,
        path: 'selection/{selectionId}',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN'],
        source: `selection/${selectionId}`,
        values: {selectionId: `${selectionId}`}
      }
    ];

    withTabsResult = [
      {
        classPath: 'goldtier/js/controllers/AppController',
        options: null,
        path: 'orgID',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
        source: 'orgID',
        values: {}
      },
      {
        classPath: 'goldtier/js/controllers/MainController',
        options: null,
        path: 'main',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN', 'FI_DOC_EXCHANGE'],
        source: 'main',
        values: {}
      },
      {
        classPath: 'goldtier/js/controllers/DynamicSelectionController',
        options: null,
        path: 'someParam/{someId}',
        roles: ['ADMIN', 'FI_SALES', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_OPS', 'FI_ADMIN'],
        source: `someParam/${someId}`,
        values: { someId: `${someId}` }
      },
      {
        classPath: 'goldtier/js/controllers/DynamicFormController',
        options: null,
        path: '',
        roles: ['ADMIN', 'END_CLIENT', 'END_CLIENT_ADMIN', 'FI_SALES', 'FI_OPS', 'FI_ADMIN'],
        source: `someParam/${someId}`,
        values: { someId: `${someId}` }
      }
    ];
  });

  it('should return empty array when receive wrong url', () => {
    expect(urlParser(mockRoutes, wrongUrl)).toEqual([]);
  });

  it('should process route without params', () => {
    urlParser(mockRoutes, urlWithoutParams).forEach((val, index) => {
      expect(Object.assign({}, val)).toEqual(Object.assign({}, withoutParamsResult[index]));
    });
  });

  it('should process route with params', () => {
    urlParser(mockRoutes, urlWithParams).forEach((val, index) => {
      expect(Object.assign({}, val)).toEqual(Object.assign({}, withParamsResult[index]));
    });
  });

  fit('should process route when it has child with path="[tabs]"', () => {
    urlParser(mockRoutes, urlWithTabs).forEach((val, index) => {
      expect(Object.assign({}, val)).toEqual(Object.assign({}, withTabsResult[index]));
    });
  });

});
