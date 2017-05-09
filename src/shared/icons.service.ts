import { Injectable } from '@angular/core';

@Injectable()
export class IconsService {
  private classes: IconClasses = {};

  get check(): string {
    return this.classes.check as string;
  }

  set check(className: string) {
    this.classes.check = className;
  }
}

export interface IconClasses {
  check?: string;
}
