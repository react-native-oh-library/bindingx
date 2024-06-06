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

import { TimingFunctionsType } from './TimingFunctionsType';

export class TimingFunctionsTypeHandler {
  public static handlerStringType(str: string): TimingFunctionsType {
    let type = str.substring(0, str.indexOf("("))
    if (type == "liner") {
      return TimingFunctionsType.linear
    }
    else if (type == "easeInQuad") {
      return TimingFunctionsType.easeInQuad
    }
    else if (type == "easeOutQuad") {
      return TimingFunctionsType.easeOutQuad
    }
    else if (type == "easeInOutQuad") {
      return TimingFunctionsType.easeInOutQuad
    }
    else if (type == "easeInCubic") {
      return TimingFunctionsType.easeInCubic
    }
    else if (type == "easeOutCubic") {
      return TimingFunctionsType.easeOutCubic
    }
    else if (type == "easeOutElastic") {
      return TimingFunctionsType.easeOutElastic
    }
    else if (type == "easeInOutCubic") {
      return TimingFunctionsType.easeInOutCubic
    }
    else if (type == "easeInQuart") {
      return TimingFunctionsType.easeInQuart
    }
    else if (type == "easeOutQuart") {
      return TimingFunctionsType.easeOutQuart
    }
    else if (type == "easeInQuint") {
      return TimingFunctionsType.easeInQuint
    }
    else if (type == "easeOutQuint") {
      return TimingFunctionsType.easeOutQuint
    }
    else if (type == "easeInOutQuint") {
      return TimingFunctionsType.easeInOutQuint
    }
    else if (type == "easeInSine") {
      return TimingFunctionsType.easeInSine
    }
    else if (type == "easeOutSine") {
      return TimingFunctionsType.easeOutSine
    }
    else if (type == "easeInOutSine") {
      return TimingFunctionsType.easeInOutSine
    }
    else if (type == "easeInExpo") {
      return TimingFunctionsType.easeInExpo
    }
    else if (type == "easeOutExpo") {
      return TimingFunctionsType.easeOutExpo
    }
    else if (type == "easeInOutExpo") {
      return TimingFunctionsType.easeInOutExpo
    }
    else if (type == "easeInCirc") {
      return TimingFunctionsType.easeInCirc
    }
    else if (type == "easeOutCirc") {
      return TimingFunctionsType.easeOutCirc
    }
    else if (type == "easeInOutCirc") {
      return TimingFunctionsType.easeInOutCirc
    }
    else if (type == "easeInElastic") {
      return TimingFunctionsType.easeInElastic
    }
    else if (type == "easeOutElastic") {
      return TimingFunctionsType.easeOutElastic
    }
    else if (type == "easeInOutElastic") {
      return TimingFunctionsType.easeInOutElastic
    }
    else if (type == "easeInBack") {
      return TimingFunctionsType.easeInBack
    }
    else if (type == "easeOutBack") {
      return TimingFunctionsType.easeOutBack
    }
    else if (type == "easeInOutBack") {
      return TimingFunctionsType.easeInOutBack
    }
    else if (type == "easeInBounce") {
      return TimingFunctionsType.easeInBounce
    }
    else if (type == "easeOutBounce") {
      return TimingFunctionsType.easeOutBounce
    }
    else if (type == "easeInOutBounce") {
      return TimingFunctionsType.easeInOutBounce
    }
    else if (type == "cubicBezier") {
      return TimingFunctionsType.cubicBezier
    }
    return TimingFunctionsType.linear
  }
}