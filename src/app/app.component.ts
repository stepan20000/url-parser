import {Component, OnInit} from '@angular/core';
import { urlParser } from './url-parser/url-parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public routes: any;

  // private exampleRoute = 'http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main/selection/563699893';

 // private exampleRoute = 'http://org-id-phl-ci.int.thomsonreuters.com/#orgID/main/legal-entity-profile/form/enduro/125';


  private exampleRoute = 'http://org-id-phl-ci.int.thomsonreuters.com/#main';

  ngOnInit(): void {
    this.routes = urlParser(this.exampleRoute);
    console.log(this.routes);

    // setTimeout(() => {
    //   console.log(5000)
    //   this.routes = urlParser(this.exampleRoute);
    // }, 5000);
  }
}
