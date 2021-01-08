import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFieldComponent } from './search-field/search-field.component';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [SearchFieldComponent, ModalComponent],
  imports: [CommonModule, FormsModule, NgbTooltipModule],
  exports: [SearchFieldComponent, ModalComponent],
})
export class SharedModule {}
