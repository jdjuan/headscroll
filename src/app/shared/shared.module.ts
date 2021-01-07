import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFieldComponent } from './search-field/search-field.component';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [CommonModule, FormsModule, NgbTooltipModule],
  exports: [SearchFieldComponent],
})
export class SharedModule {}
