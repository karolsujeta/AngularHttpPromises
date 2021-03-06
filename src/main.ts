import { NgModule, Component, Injectable } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { HttpClientModule, HttpClient } from "@angular/common/http";

class SearchItem {
  constructor(
    public name: string,
    public artist: string,
    public link: string,
    public thumbnail: string,
    public artistId: string) {

  }
}

@Injectable()
class SearchService {
  apiRoot: string = 'https://itunes.apple.com/search';
  results: SearchItem[];
  loading: boolean;

  constructor(private http: HttpClient) {
    this.results = [];
    this.loading = false;
  }

  search(term: string) {
    let promise = new Promise((resolve, reject) => {
      let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      this.http.get(apiURL)
        .toPromise()
        .then(
          res => {
            //console.log(res);
            this.results = (res as any).results.map(item => {                                            //tutaj mi wywala błąd
              return new SearchItem(
                item.trackName,
                item.artistName,
                item.trackViewUtl,
                item.artworkUrl30,
                item.artistId 
              );
            })
          },
          msg => {
            reject();
          }
        )
    });
    return promise;
  }

}

@Component({
  selector: 'app-root',
  template: `
  <form class="form-inline">
    <div class="form-group">
      <input type="search"
          class="form-control"
          placeholder="Enter search string"
          #search>
    </div>
    <button type="button"
      class="btn btn-primary"
      (click)="doSearch(search.value)">Search
    </button>
  </form>

  <hr/>
<div class="text-center">
  <p class="lead" *ngIf="loading">Loading...</p>
</div>
<ul class="list-group">
	<li class="list-group-item"
	    *ngFor="let track of itunes.results">
		<img src="{{track.thumbnail}}">
		<a target="_blank"
		   href="{{track.link}}">{{ track.track }}
		</a>
	</li>
</ul>
  `
})

class AppComponent {

  private loading: boolean = false;
  constructor(private itunes: SearchService) {

  }

  doSearch(term: string) {
    this.loading = true;
    this.itunes.search(term).then(() => this.loading = false);
  }
}


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [SearchService]
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);