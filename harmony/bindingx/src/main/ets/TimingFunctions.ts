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

export class TimingFunctions {
  public static linear(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * (t / d) + b;
  }


  public static easeOutElastic(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    let s = 0;
    let p = 0;
    let a = c;
    p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  }

  public static easeInQuad(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * (t /= d) * t + b;
  }

  public static easeOutQuad(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return -c * (t /= d) * (t - 2) + b;
  }

  public static easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  }

  public static easeInCubic(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * (t /= d) * t * t + b;
  }

  public static easeOutCubic(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }

  public static easeInOutCubic(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  public static easeInQuart(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * (t /= d) * t * t * t + b;
  }

  public static easeOutQuart(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }

  public static easeInOutQuart(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b;
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }

  public static easeInQuint(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * (t /= d) * t * t * t * t + b;
  }

  public static easeOutQuint(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  }

  public static easeInOutQuint(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  }

  public static easeInSine(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  }


  public static easeOutSine(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  }

  public static easeInExpo(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  }

  public static easeOutExpo(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  }

  public static easeInOutExpo(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if (t == 0) {
      return b;
    }
    if (t == d) {
      return b + c;
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    }
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }

  public static easeInCirc(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  }

  public static easeOutCirc(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  }

  public static easeInOutCirc(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if ((t /= d / 2) < 1) {
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  }

  public static easeInElastic(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    let s;
    let p;
    let a = c;
    if (t == 0) {
      return b;
    }
    if ((t /= d) == 1) {
      return b + c;
    }
    p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  }

  public static easeInOutElastic(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);

    let s;
    let p;
    let a = c;
    if (t == 0) {
      return b;
    }
    if ((t /= d / 2) == 2) {
      return b + c;
    }
    p = d * (.3 * 1.5);
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) {
      return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  }

  public static easeInBack(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    let s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  }

  public static easeOutBack(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    let s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  }

  public static easeInOutBack(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    let s = 1.70158;
    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  }

  public static easeInBounce(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return TimingFunctions.easeInBounce1(t, b, c, d);
  }

  public static easeOutBounce(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return TimingFunctions.easeOutBounce1(t, b, c, d);
  }


  public static easeInBounce1(t: number, b: number, c: number, d: number): number {
    return c - TimingFunctions.easeOutBounce1(d - t, 0, c, d) + b;
  }

  public static easeOutBounce1(t: number, b: number, c: number, d: number): number {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  }

  public static easeInOutBounce(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    if (t < d / 2) {
      return TimingFunctions.easeInBounce1(t * 2, 0, c, d) * .5 + b;
    }
    return TimingFunctions.easeOutBounce1(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  }

  public static easeInOutSine(t: number, b: number, c: number, d: number): number {
    t = Math.min(t, d);
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  }
}