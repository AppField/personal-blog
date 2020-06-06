---
title: How to fix ngx-translate error when running tests
date: '2019-10-19'
description: 'ngx-translate is an internationalization library for Angular. When it is integrated into an Angular app, the unit tests will fail. This post explains and shows how to fix these errors.'
---

## Introduction

If you need to translate your application to different languages there are different opportunities to achieve this. One option for Angular application is the [ngx-translate](https://github.com/ngx-translate/core) library.

## The error

When I was testing my angular application which uses the ngx-translate library I got the following error:

```
Failed: Template parse errors:
The pipe 'translate' could not be found
```

This error says cleary, that the test can't find the `translate` pipe.
So, how can this be fixed?

## Setup

To reproduce the error start a new angular application and add a minimal ngx-translate setup

### Create the application

If you haven't done it yet install the angular cli globally:

```shell
npm install @angular/cli -g
```

When the angular cli is installed a new application can be created:

```shell
ng new demo-testing --routing false --style scss --dry-run
cd ./demo-testing
```

There should be three generated tests that succeed:

```shell
npm run test
```

### Add ngx-translate

The next step is to add the ngx-translate library.

First, `@ngx-translate/core` and `@ngx-translate/http-loader` have to be installed:

```shell
npm install @ngx-translate/core @ngx-translate/http-loader --save
```

Setup the `TranslateModule` in the `app.module.ts` file:

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Add the `TranslateService` to the `app.component.ts` file and set the default language as well use it:

```javascript
constructor(
  private readonly translate: TranslateService
) {
  this.translate.setDefaultLang('en');
  this.translate.use('en');
}
```

Create this file: `./src/assets/i18n/en.json`
This file contains the actual translations. For testing purposes one translation is enough:

```json
{
  "WELCOME": "Welcome translate"
}
```

The angular cli creates an example HTML page containing a toolbar with "Welcome" in the `app.component.html` file:

```html
<span>Welcome</span>
```

The static Welcome message can be replaced with the translation:

```html
<span>{{ 'WELCOME' | translate }}</span>
```

### Run the application

To see if everything's working just start the application:

```shell
npm run start
```

When you open `localhost:4200` you should see the default angular app with a toolbar saying `Welcome translate`.

## How to fix the tests

It's time to come back to the error mentioned at the beginning.

```shell
npm run test
```

This will run the tests and print out the following error:

```
Failed: Template parse errors:
The pipe 'translate' could not be found
```

### Explanation

The error above states out clearly that it can't find the `translate` [pipe](https://angular.io/guide/pipes), which is provided in the `app.module.ts` file through the `TranslateModule`

In Angular, the unit tests in the `*.spec.ts` files are and should be isolated. Therefore, the tests won't import the modules defined in the `app.module.ts` file and don't even know there's a `TranslateModule`.

_That's why the services provided by `TranslateModule` have to be mocked!_

### Mock the `translate` pipe

To mock the `translate` pipe open the `app.component.spec.ts` file and add a new custom pipe `TranslatePipeMock` before the `describe` function:

```javascript
// ...omitted

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
  public name = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

// omitted ...
```

Next step is to add it to the declarations array and provide it:

```javascript
// ... omitted

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TranslatePipeMock // Add it to declarations
      ],
      // provide TranslatePipeMock
      providers: [
        {
          provide: TranslatePipe,
          useClass: TranslatePipeMock
        }
      ]
    }).compileComponents();
  }));

// omitted ...
```

Save the file and run the tests again:

```shell
npm run test
```

The error which says that it can't find the `translate` pipe should be gone. And another error appeared, stating there's no provider for `TranslateService`. This error can be solved just like the `translate` pipe error. Mock it and provide it.

### Recapitulate the pipe mock implementation

To fix the error the `TranslatePipe` has to be mocked and provided inside the test file `app.component.spec.ts`.
What does this mean? As soon as we create another component that uses the `TranslateModule` the `TranslatePipe` has to be mocked again inside the test file of the newly created component. First intention would be to just copy and paste the `TranslatePipeMock` from the `app.component.spec.ts` file to the new test file.
But... _Don't Repeat Yourself (DRY)_

## Create a reusable TranslateTestingModule

To prevent copying and pasting the `TranslatePipeMock` a `TranslateTestingModule` can be created which imports and exports it. And not just the `TranslatePipeMock` but also other mocked `ngx-translate` services, like the `TranslateService` mentioned above.

### Implement the module

The first step is to generate a new module called `TranslateTesting`:

```shell
ng g module TranslateTesting
```

Inside `translate-testing.module.ts` the mock classes will be implemented and provided.

```javascript
import { Injectable, NgModule, Pipe, PipeTransform } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';


const translations: any = {};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

@Pipe({
  name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
  public name = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

@Injectable()
export class TranslateServiceStub {
  public get<T>(key: T): Observable<T> {
    return of(key);
  }

  public addLangs(langs: string[]) { }

  public setDefaultLang(lang: string) { }

  public getBrowserLang(): string {
    return 'en';
  }

  public use(lang: string) { }
}

@NgModule({
  declarations: [
    TranslatePipeMock
  ],
  providers: [
    {
      provide: TranslateService,
      useClass: TranslateServiceStub
    },
    {
      provide: TranslatePipe,
      useClass: TranslatePipeMock
    },
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: FakeLoader
      },
    })
  ],
  exports: [
    TranslatePipeMock,
    TranslateModule
  ]
})
export class TranslateTestingModule { }

```

This file should cover all services provided by the TranslateModule

### Use the new `TranslateTestingModule`

Now, the `TranslatePipeMock` class can be removed from the `app.component.spec.ts` file. Instead, the `TranslateTestingModule` will be imported:

```javascript
// ... omitted
import { TranslateTestingModule } from './translate-testing/translate-testing.module';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        TranslateTestingModule
      ]
    }).compileComponents();
  }));

// omitted ...
```

Run the tests again and check if there are any `ngx-translate` errors left. The only errors you should see are angulars default tests which just check the title. These can be safely removed since translated text won't show up when running the tests.

```shell
npm run tests
```

## Conclusion

`ngx-translate` provides some services to translate text. These have to be mocked inside the test files. For that, we created a reusable module called `TranslateTestingModule` which can be imported to different test files. The Module can be located inside a `shared` folder, a `testing` folder or another shared library you use.

You can find a working example in a [Github Repository](https://github.com/AppField/demo-ngx-translate-testing)
