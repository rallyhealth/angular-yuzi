import { forwardRef, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export abstract class AbstractValueAccessor implements ControlValueAccessor {
  disabled: boolean;

  private innerValue: any = '';
  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  get value(): any {
    return this.innerValue;
  }
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}

export function MakeProvider(type: any): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}

const noop = () => {};
