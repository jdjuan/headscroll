import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFieldComponent } from './search-field/search-field.component';
import { FormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbDropdownModule, NgbModalModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { ConfigComponent } from 'src/app/shared/config/config.component';

@NgModule({
  declarations: [SearchFieldComponent, ModalComponent, ConfigComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbRatingModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NgbTooltipModule,
    FormsModule,
  ],
  exports: [SearchFieldComponent, ModalComponent, ConfigComponent],
})
export class SharedModule {}
