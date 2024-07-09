/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { BindingXCore } from './BindingXCore'

export class ReactBindingXModule extends TurboModule {
  static NAME = "ReactBindingXModule"

  private mBindingXCore: BindingXCore;

  constructor(ctx: TurboModuleContext) {
    super(ctx)
  }

  public prepare(options: object) {
    if (!this.mBindingXCore) {
      this.mBindingXCore = new BindingXCore();
    }
    this.mBindingXCore.handleTouch(options["anchor"],options["eventType"],this.ctx);
  }


  public bind(options: object): string {
    if (!this.mBindingXCore) {
      this.mBindingXCore = new BindingXCore();
    }
    return this.mBindingXCore.bind(options, this.ctx);
  }


  public unbind(options: object) {
    if(!this.mBindingXCore) return;
    this.mBindingXCore.unbind(options);
  }

  public unbindAll() {
    if(!this.mBindingXCore) return;
    this.mBindingXCore.unbindAll()
  }

  public async getComputedStyle(options: object): Promise<string> {
    this.ctx.rnInstance.postMessageToCpp("getComputedStyle", { element: options });
    return await new Promise( (resolve, reject) => {
      this.ctx.rnInstance.cppEventEmitter.subscribe("style", (value) => {
        resolve(JSON.stringify(value));
      })
    });
  }
}