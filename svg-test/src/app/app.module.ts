import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FruitsSvgModule } from 'src/generated-svg/fruits-svg.module';
import { ShapesSvgModule } from 'src/generated-svg/shapes-svg.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ShapesSvgModule,
    FruitsSvgModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
