import {NgModule, Type} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CuteCard} from "./card.component";
import {CuteCardTitle} from "./card-title.directive";
import {CuteCardSubtitle} from "./card-subtitle.directive";
import {CuteCardFooter} from "./card-footer.directive";
import {CuteCardHeader} from "./card-header.directive";
import {CuteCardActions} from "./card-actions.directive";
import {CuteCardBody} from "./card-body.component";
import {CuteCardImage} from "./card-image.directive";
import {CuteCardAvatar} from "./card-avatar.directive";
import {CuteCardGroup} from "./card-group.component";
import {CuteCardOverlay} from "./card-overlay.directive";

const TYPES: (any | Type<any>)[] = [
  CuteCard,
  CuteCardTitle,
  CuteCardSubtitle,
  CuteCardFooter,
  CuteCardHeader,
  CuteCardActions,
  CuteCardBody,
  CuteCardOverlay,
  CuteCardImage,
  CuteCardAvatar,
  CuteCardGroup,
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: [TYPES],
  declarations: [],
})
export class CuteCardModule { }
