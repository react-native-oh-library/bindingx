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

import sensor from "@ohos.sensor"
import { TimingFunctions } from "./TimingFunctions"
import { BindingXParamBean } from "./BindingXParamBean"
import { IRNViewUpdater } from './IRNViewUpdater';
import { TimingFunctionsType } from './TimingFunctionsType';
import { TimingFunctionsTypeHandler } from './TimingFunctionsTypeHandler';
import { TurboModuleContext } from '@rnoh/react-native-openharmony/ts';


export class BindingXCore {
  map: Map<string, string> = new Map();
  opacity: number = 1;
  bgcolorExpress: string;
  colorExpress: string;
  ctx: TurboModuleContext;
  stopTask: boolean = false;
  interceptSensor: boolean = false;

  doPrepare(anchor: string, eventType: string) {
    let token = anchor;
    this.map.set(token, eventType);
  }

  bind(options: object, ctx: TurboModuleContext): string {
    this.ctx = ctx;
    let param = JSON.stringify(options);
    let bindingxBean = JSON.parse(param) as BindingXParamBean;
    let eventType = bindingxBean.eventType;
    let props = bindingxBean.props;
    if (eventType == "orientation") {
      this.interceptSensor = false;
      try {
        sensor.on(sensor.SensorId.ROTATION_VECTOR, (data: sensor.RotationVectorResponse) => {
          if (this.interceptSensor) return;
          this.ctx.rnInstance.postMessageToCpp("bind", { options: options, data: data });
        });
      } catch (error) {
        console.log('sensor RotationVectorResponse error: ' + error);
      }
    }

    else if (eventType == "pan") {
      this.ctx.rnInstance.postMessageToCpp("bind", { options: options });
    }
    else if (eventType == "scroll") {
      let that = this;
      props.forEach(e => {
        if (e.property == IRNViewUpdater.background_color) {
          that.bgcolorExpress = e.expression
        }
        if (e.property == IRNViewUpdater.color) {
          that.colorExpress = e.expression
        }
      })

      let bgcolorExpressAtr = this.bgcolorExpress.substring(this.bgcolorExpress.indexOf("(") + 1, this.bgcolorExpress.lastIndexOf(")")).split(",");
      let colorExpressAtr = this.colorExpress.substring(this.colorExpress.indexOf("(") + 1, this.colorExpress.lastIndexOf(")")).split(",");
      this.ctx.rnInstance.postMessageToCpp("bind", {
        options: options,
        background_color: bgcolorExpressAtr[0].substring(bgcolorExpressAtr[0].indexOf("'") + 1, bgcolorExpressAtr[0].lastIndexOf("'")).replace("#", "0xff") + "," + bgcolorExpressAtr[1].substring(bgcolorExpressAtr[1].indexOf("'") + 1, bgcolorExpressAtr[1].lastIndexOf("'")).replace("#", "0xff"),
        color: colorExpressAtr[0].substring(colorExpressAtr[0].indexOf("'") + 1, colorExpressAtr[0].lastIndexOf("'")).replace("#", "0xff") + "," + colorExpressAtr[1].substring(colorExpressAtr[1].indexOf("'") + 1, colorExpressAtr[1].lastIndexOf("'")).replace("#", "0xff"),
        background_color_eval: bgcolorExpressAtr[2] + "," + bgcolorExpressAtr[3]
      });
    }

    else if (eventType == "timing") {
      let exitExpression = (bindingxBean.exitExpression.substring(bindingxBean.exitExpression.indexOf(">") + 1,
        bindingxBean.exitExpression.length)) as unknown as number;
      this.stopTask = false;
      let timingTypeX;
      let timingTypeY;
      let timingTypeXArr;
      let timingTypeYArr;
      let evalStr;
      props.forEach(e => {
        if (e.property == IRNViewUpdater.transform_translateX) {
          timingTypeX = TimingFunctionsTypeHandler.handlerStringType(e.expression);
          timingTypeXArr = e.expression.substring(e.expression.indexOf("(") + 1, e.expression.indexOf(")")).split(",")
        }
        if (e.property == IRNViewUpdater.transform_translateY) {
          timingTypeY = TimingFunctionsTypeHandler.handlerStringType(e.expression);
          timingTypeYArr = e.expression.substring(e.expression.indexOf("(") + 1, e.expression.indexOf(")")).split(",")
        }
        if (e.property == IRNViewUpdater.opacity) {
          evalStr = e.expression;
        }
      });
      this.handleTiming(options, timingTypeX, exitExpression, timingTypeXArr, timingTypeY, timingTypeYArr, evalStr)
    }

    let anchor = bindingxBean.anchor;
    let token = props[0].element;
    if (anchor > 0) {
      token = new String(anchor).valueOf();
    }
    this.doPrepare(token, eventType)
    return token;
  }

  public unbind(options: object) {
    let eventType = options["eventType"];
    let token = options["token"];
    this.map.forEach((value, key) => {
      if ((key == token && value == eventType)) {
        if (value == "orientation") {
          this.interceptSensor = true;
          this.map.delete(key);
          try {
            sensor.off(sensor.SensorId.ROTATION_VECTOR);
          } catch (error) {
            console.log('ReactBindingXModule unbind error: ' + error);
          }
        }
        else if (value == "pan" || value == "scroll") {
          this.map.delete(key);
          this.ctx.rnInstance.postMessageToCpp("unbind", { options: options });
        }
        else if (value == "timing") {
          this.map.delete(key);
          this.stopTask = true;
        }
        return;
      }
    })
  }


  public unbindAll() {
    this.map.forEach((value, key) => {
      if (value == "orientation") {
        this.map.delete(key);
        try {
          sensor.off(sensor.SensorId.ROTATION_VECTOR);
        } catch (error) {
        }
      }
      else if (value == "pan" || value == "scroll") {
        this.map.delete(key);
        this.ctx.rnInstance.postMessageToCpp("unbind", { options: { eventType: value } });
      }
      else if (value == "timing") {
        this.map.delete(key);
        this.stopTask = true;
      }
    })
  }


  private handleTiming(options: object, timingTypeX: number, exitExpression: number, timingTypeXArr: Array<number>,
                       timingTypeY: number, timingTypeYArr: Array<number>, evalStr: string) {
    let x = 0;
    let deltaT = 16;
    let that = this;
    let taskX = setInterval(() => {
      if (deltaT > exitExpression || this.stopTask) {
        clearInterval(taskX);
        return;
      }
      let b = new Number(timingTypeXArr[1]).valueOf();
      let c = new Number(timingTypeXArr[2]).valueOf();
      let d = new Number(timingTypeXArr[3]).valueOf();
      if (timingTypeX == TimingFunctionsType.linear) {
        x = TimingFunctions.linear(deltaT, b, c, d);
      }

      if (timingTypeX == TimingFunctionsType.easeInQuad) {
        x = TimingFunctions.easeInQuad(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutQuad) {
        x = TimingFunctions.easeOutQuad(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutQuad) {
        x = TimingFunctions.easeInOutQuad(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInCubic) {
        x = TimingFunctions.easeInCubic(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutCubic) {
        x = TimingFunctions.easeOutCubic(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutCubic) {
        x = TimingFunctions.easeInOutCubic(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInQuart) {
        x = TimingFunctions.easeInQuart(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutQuart) {
        x = TimingFunctions.easeOutQuart(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutQuart) {
        x = TimingFunctions.easeInOutQuart(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInQuint) {
        x = TimingFunctions.easeInQuint(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutQuint) {
        x = TimingFunctions.easeOutQuint(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutQuint) {
        x = TimingFunctions.easeInOutQuint(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInSine) {
        x = TimingFunctions.easeInSine(deltaT, b, c, d);
      }

      if (timingTypeX == TimingFunctionsType.easeOutSine) {
        x = TimingFunctions.easeOutSine(deltaT, b, c, d);
      }

      if (timingTypeX == TimingFunctionsType.easeInQuad) {
        x = TimingFunctions.easeInQuad(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutQuad) {
        x = TimingFunctions.easeOutQuad(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutQuad) {
        x = TimingFunctions.easeInOutQuad(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInCubic) {
        x = TimingFunctions.easeInCubic(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutCubic) {
        x = TimingFunctions.easeOutCubic(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutCubic) {
        x = TimingFunctions.easeInOutCubic(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInQuart) {
        x = TimingFunctions.easeInQuart(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutQuart) {
        x = TimingFunctions.easeOutQuart(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutQuart) {
        x = TimingFunctions.easeInOutQuart(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInQuint) {
        x = TimingFunctions.easeInQuint(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutQuint) {
        x = TimingFunctions.easeOutQuint(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutQuint) {
        x = TimingFunctions.easeInOutQuint(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInSine) {
        x = TimingFunctions.easeInSine(deltaT, b, c, d);
      }

      if (timingTypeX == TimingFunctionsType.easeOutSine) {
        x = TimingFunctions.easeOutSine(deltaT, b, c, d);
      }

      if (timingTypeX == TimingFunctionsType.easeInBack) {
        x = TimingFunctions.easeInBack(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutBack) {
        x = TimingFunctions.easeOutBack(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutBack) {
        x = TimingFunctions.easeInOutBack(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInBounce) {
        x = TimingFunctions.easeInBounce(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeOutBounce) {
        x = TimingFunctions.easeOutBounce(deltaT, b, c, d);
      }
      if (timingTypeX == TimingFunctionsType.easeInOutBounce) {
        x = TimingFunctions.easeInOutBounce(deltaT, b, c, d);
      }
      deltaT = deltaT + 16;
      let evalStrTemp = evalStr.replace("t", deltaT + "");
      try {
        that.ctx.rnInstance.postMessageToCpp("eval", { data: evalStrTemp, eventType: "timing" })
      }
      catch (e) {
      }
    }, 16)

    let t = 0.0034;
    let taskY = setInterval(() => {
      if (deltaT > exitExpression || this.stopTask) {
        clearInterval(taskY);
        return;
      }
      let y = 0;
      let b = new Number(timingTypeYArr[1]).valueOf();
      let c = new Number(timingTypeYArr[2]).valueOf();
      let d = new Number(timingTypeYArr[3]).valueOf();
      if (timingTypeY == TimingFunctionsType.linear) {
        y = TimingFunctions.linear(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInQuad) {
        y = TimingFunctions.easeInQuad(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutQuad) {
        y = TimingFunctions.easeOutQuad(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInOutQuad) {
        y = TimingFunctions.easeInOutQuad(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInCubic) {
        y = TimingFunctions.easeInCubic(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutCubic) {
        y = TimingFunctions.easeOutCubic(t, b, c, d);
      }

      if (timingTypeY == TimingFunctionsType.easeInOutCubic) {
        y = TimingFunctions.easeInOutCubic(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInQuart) {
        y = TimingFunctions.easeInQuart(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutQuart) {
        y = TimingFunctions.easeOutQuart(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInOutQuart) {
        y = TimingFunctions.easeInOutQuart(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInQuint) {
        y = TimingFunctions.easeInQuint(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutQuint) {
        y = TimingFunctions.easeOutQuint(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInOutQuint) {
        y = TimingFunctions.easeInOutQuint(t, b, c, d);
      }

      if (timingTypeY == TimingFunctionsType.easeInSine) {
        y = TimingFunctions.easeInSine(t, b, c, d);
      }

      if (timingTypeY == TimingFunctionsType.easeOutSine) {
        y = TimingFunctions.easeOutSine(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInOutSine) {
        y = TimingFunctions.easeInOutSine(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInExpo) {
        y = TimingFunctions.easeInExpo(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutExpo) {
        y = TimingFunctions.easeOutExpo(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInOutExpo) {
        y = TimingFunctions.easeInOutExpo(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInCirc) {
        y = TimingFunctions.easeInCirc(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutCirc) {
        y = TimingFunctions.easeOutCirc(t, b, c, d);
      }

      if (timingTypeY == TimingFunctionsType.easeInOutCirc) {
        y = TimingFunctions.easeInOutCirc(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInElastic) {
        y = TimingFunctions.easeInElastic(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutElastic) {
        y = TimingFunctions.easeOutElastic(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInOutElastic) {
        y = TimingFunctions.easeInOutElastic(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInBack) {
        y = TimingFunctions.easeInBack(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutBack) {
        y = TimingFunctions.easeOutBack(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInOutBack) {
        y = TimingFunctions.easeInOutBack(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeInBounce) {
        y = TimingFunctions.easeInBounce(t, b, c, d);
      }
      if (timingTypeY == TimingFunctionsType.easeOutBounce) {
        y = TimingFunctions.easeOutBounce(t, b, c, d);
      }

      if (timingTypeY == TimingFunctionsType.easeInOutBounce) {
        y = TimingFunctions.easeInOutBounce(t, b, c, d);
      }
      t = t + 0.0034;
      try {
        that.ctx.rnInstance.postMessageToCpp("bind", {
          options: options,
          needOriginY: false,
          data: { x: x, y: y },
          opacity: that.opacity
        });
      } catch (e) {

      }
    }, 16)
    this.handleEvalMsgFromArkTS2Cpp()
  }


  handleEvalMsgFromArkTS2Cpp() {
    let that = this;
    this.ctx.rnInstance.cppEventEmitter.subscribe("eval", (value) => {
      that.opacity = new Number(value).valueOf();
    })
  }
}

