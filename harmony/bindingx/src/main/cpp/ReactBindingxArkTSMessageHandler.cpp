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
#include "ReactBindingxArkTSMessageHandler.h"
#include <string>
#include <vector>

namespace rnoh {


    double scrollEvalValue;
    ReactBindingxArkTSMessageHandler *m_reactBindingxArkTSMessageHandler;

    int hex_char_value(char c) {
        if (c >= '0' && c <= '9')
            return c - '0';
        else if (c >= 'a' && c <= 'f')
            return (c - 'a' + 10);
        else if (c >= 'A' && c <= 'F')
            return (c - 'A' + 10);
        return 0;
    }
    int hex_to_decimal(const char *szHex, int len) {
        int result = 0;
        for (int i = 0; i < len; i++) {
            result += (int)pow((float)16, (int)len - i - 1) * hex_char_value(szHex[i]);
        }
        return result;
    }
    int evaluate(float fraction, int startValue, int endValue) {
        int startInt = startValue;
        float startA = ((startInt >> 24) & 0xff) / 255.0;
        float startR = ((startInt >> 16) & 0xff) / 255.0;
        float startG = ((startInt >> 8) & 0xff) / 255.0;
        float startB = (startInt & 0xff) / 255.0;

        int endInt = endValue;
        float endA = ((endInt >> 24) & 0xff) / 255.0;
        float endR = ((endInt >> 16) & 0xff) / 255.0;
        float endG = ((endInt >> 8) & 0xff) / 255.0;
        float endB = (endInt & 0xff) / 255.0;

        startR = pow(startR, 2.2);
        startG = pow(startG, 2.2);
        startB = pow(startB, 2.2);

        endR = pow(endR, 2.2);
        endG = pow(endG, 2.2);
        endB = pow(endB, 2.2);
        float a = startA + fraction * (endA - startA);
        float r = startR + fraction * (endR - startR);
        float g = startG + fraction * (endG - startG);
        float b = startB + fraction * (endB - startB);
        a = a * 255.0;
        r = pow(r, 1.0 / 2.2) * 255.0;
        g = pow(g, 1.0 / 2.2) * 255.0;
        b = pow(b, 1.0 / 2.2) * 255.0;

        int ra = round(a);
        int rr = round(r);
        int rg = round(g);
        int rb = round(b);
        return ra << 24 | rr << 16 | rg << 8 | rb;
    }

    int minNum(int a, int b) { return a > b ? b : a; }


    std::vector<std::string> split(const std::string &src, const std::string &sep) {
        std::vector<std::string> tokens;
        int lastPos = 0,
            index, sepLen = sep.length();
        while (-1 != (index = src.find(sep, lastPos))) {
            tokens.push_back(src.substr(lastPos, index - lastPos));
            lastPos = index + sepLen;
        }

        std::string lastString = src.substr(lastPos);
        if (!lastString.empty()) {
            tokens.push_back(lastString);
        }
        return tokens;
    }

    std::vector<std::string> findProperty(std::vector<std::string> propertyWords, std::vector<std::string> propertyAtr) {
        std::vector<std::string> result;
        for (int i = 0; i < propertyAtr.size(); i++) {
            auto temp = propertyAtr[i];
            for (int j = 0; j < propertyWords.size(); j++) {
                if (temp == propertyWords[j]) {
                    result.push_back(temp);
                }
            }
        }
        return result;
    }

    void ReactBindingxArkTSMessageHandler::handleScroll() {
        auto panActionCallBack = ReactBindingxArkTSMessageHandler::getInstance()->m_panActionCallBack;
        auto scrollViewComponentInstance =
            std::dynamic_pointer_cast<rnoh::ScrollViewComponentInstance>(panActionCallBack->componentInstance);

        float scrollY = scrollViewComponentInstance->getScrollViewMetrics().contentOffset.y;
        if (this->m_scrollY != scrollY) {
            this->m_scrollY = scrollY;
        }
        if (this->m_scrollY <= 0) {
            this->m_scrollY = 1;
            panActionCallBack->angle = 1;
        }
        std::vector<std::string> roateMatchPropertys;
        roateMatchPropertys.push_back("transform.rotate");
        roateMatchPropertys.push_back("transform.rotateZ");
        roateMatchPropertys.push_back("transform.rotateX");
        roateMatchPropertys.push_back("transform.rotateY");
        std::vector<std::string> findRoateAtr = findProperty(roateMatchPropertys, panActionCallBack->propertyAtr);
        if (findRoateAtr.size() > 0) {
            ArkUI_NumberValue roateValue[] = {
                {.f32 = 0}, {.f32 = 0}, {.f32 = 1}, {.f32 = static_cast<float>(this->m_scrollY)}, {.f32 = 0}};
            ArkUI_AttributeItem roateItem = {roateValue, sizeof(roateValue) / sizeof(ArkUI_NumberValue)};
            NativeNodeApi::getInstance()->setAttribute(
                panActionCallBack->elementViewComponentInstance->getLocalRootArkUINode().getArkUINodeHandle(),
                NODE_ROTATE, &roateItem);
        }
        DLOG(INFO) << "ReactBindingXPackage::scroll getScrollViewMetrics y:" << this->m_scrollY
                  << " scrollY:" << panActionCallBack->scrollY << " angle:" << panActionCallBack->angle
                  << " width:" << scrollViewComponentInstance->getLayoutMetrics().frame.size.width;
        float translate = this->m_scrollY;
        std::array<ArkUI_NumberValue, 3> translateValue = {ArkUI_NumberValue{.f32 = translate}, {.f32 = 0}, {.f32 = 0}};
        ArkUI_AttributeItem translateItem = {translateValue.data(), translateValue.size()};
        NativeNodeApi::getInstance()->setAttribute(
            panActionCallBack->elementViewComponentInstance->getLocalRootArkUINode().getArkUINodeHandle(),
            NODE_TRANSLATE, &translateItem);

        if (panActionCallBack->scrollY != this->m_scrollY) {
            if (panActionCallBack->scrollY > this->m_scrollY) {
                panActionCallBack->angle = this->m_scrollY * 0.03;
            } else {
                panActionCallBack->angle = this->m_scrollY * 0.03;
            }
        }
        panActionCallBack->scrollY = this->m_scrollY;

        std::vector<std::string> backgroundColorMatchPropertys;
        backgroundColorMatchPropertys.push_back("background-color");
        std::vector<std::string> findbackgroundColorAtr =
            findProperty(backgroundColorMatchPropertys, panActionCallBack->propertyAtr);
        if (findbackgroundColorAtr.size() > 0 && panActionCallBack->backgroundcolor.c_str() != nullptr) {
            auto backgroundcolorAtr = split(panActionCallBack->backgroundcolor, ",");
            if (panActionCallBack->angle < 1) {
                panActionCallBack->angle = 1;
                std::string color = backgroundcolorAtr[0];
                int color1 = hex_to_decimal(color.c_str(), color.size());
                panActionCallBack->elementViewComponentInstance->getLocalRootArkUINode().setBackgroundColor(color1);
            } else {
                std::string color = backgroundcolorAtr[0];
                int color1 = hex_to_decimal(color.c_str(), color.size());
                std::string backgroundcolorEval = panActionCallBack->backgroundcolorEval;
                auto backgroundcolorEvalTemp = backgroundcolorEval.replace(backgroundcolorEval.find("y"), 1,
                                                                           std::to_string(panActionCallBack->scrollY));
                backgroundcolorEval = backgroundcolorEvalTemp.substr(backgroundcolorEvalTemp.find("(") + 1,
                                                                     backgroundcolorEvalTemp.find(")") -
                                                                         backgroundcolorEvalTemp.find("(") - 1);
                auto backgroundcolorEvalAtr = split(backgroundcolorEval, ",");
                int num = minNum(atoi(backgroundcolorEvalAtr[0].c_str()), atoi(backgroundcolorEvalAtr[1].c_str()));
                std::string oldMin = "min(" + backgroundcolorEvalAtr[0] + "," + backgroundcolorEvalAtr[1] + ")";
                auto evalStr = backgroundcolorEvalTemp.replace(backgroundcolorEvalTemp.find(oldMin), oldMin.size(),
                                                               std::to_string(num));
                ExpressHandleEval::getInstance()->init_mapping(ExpressHandleEval::getInstance()->op_mapping);
                double fraction = ExpressHandleEval::getInstance()->eval(evalStr);
                int color2 = hex_to_decimal(backgroundcolorAtr[1].c_str(), backgroundcolorAtr[1].size());
                int bgcolor = evaluate(fraction, color1, color2);
                panActionCallBack->elementViewComponentInstance->getLocalRootArkUINode().setBackgroundColor(bgcolor);
            }
        }

        std::vector<std::string> scaleMatchPropertys;
        scaleMatchPropertys.push_back("transform.scale");
        scaleMatchPropertys.push_back("transform.scaleX");
        scaleMatchPropertys.push_back("transform.scaleY");
        std::vector<std::string> findScaleAtr = findProperty(scaleMatchPropertys, panActionCallBack->propertyAtr);
        if (findScaleAtr.size() > 0) {
            ArkUI_NumberValue scaleValue[] = {{.f32 = static_cast<float>((panActionCallBack->angle))},
                                              {.f32 = static_cast<float>((panActionCallBack->angle))}};
            ArkUI_AttributeItem scaleItem = {scaleValue, sizeof(scaleValue) / sizeof(ArkUI_NumberValue)};
            NativeNodeApi::getInstance()->setAttribute(
                panActionCallBack->elementViewComponentInstance->getLocalRootArkUINode().getArkUINodeHandle(),
                NODE_SCALE, &scaleItem);
        }
    }

    void ReactBindingxArkTSMessageHandler::handleArkTSMessage(const Context &ctx) {
        auto rnInstance = ctx.rnInstance.lock();
        if (!rnInstance)
            return;
        if (ctx.messageName == "prepare") {
            auto eventType = ctx.messagePayload["eventType"];
            if (eventType == "pan") {
                auto maybeTag = ctx.messagePayload["anchor"];
                auto rnInstanceCAPI = std::dynamic_pointer_cast<RNInstanceCAPI>(rnInstance);
                auto componentInstance = rnInstanceCAPI->findComponentInstanceByTag(maybeTag.asDouble());
                auto anyGestureApi =
                    OH_ArkUI_QueryModuleInterfaceByName(ARKUI_NATIVE_GESTURE, "ArkUI_NativeGestureAPI_1");
                panGestureApi = reinterpret_cast<ArkUI_NativeGestureAPI_1 *>(anyGestureApi);
                panPanGesture =
                    panGestureApi->createPanGesture(1, GESTURE_DIRECTION_HORIZONTAL | GESTURE_DIRECTION_VERTICAL, 0);
                auto onPanActionCallBack = [](ArkUI_GestureEvent *event, void *extraParam) {
                    if(ReactBindingxArkTSMessageHandler::getInstance()->isInterceptPan) return;
                    PanActionCallBack *panActionCallBack = (PanActionCallBack *)extraParam;
                    ArkUI_GestureEventActionType actionType = OH_ArkUI_GestureEvent_GetActionType(event);
                    float x = OH_ArkUI_PanGesture_GetOffsetX(event);
                    float y = OH_ArkUI_PanGesture_GetOffsetY(event);
                   if (actionType == GESTURE_EVENT_ACTION_UPDATE) {
                        panActionCallBack->offsetX = panActionCallBack->positionX + x;
                        panActionCallBack->offsetY = panActionCallBack->positionY + y;
                        std::array<ArkUI_NumberValue, 3> translateValue = {
                            ArkUI_NumberValue{.f32 = panActionCallBack->offsetX * panActionCallBack->px2vp},
                            {.f32 = panActionCallBack->offsetY * panActionCallBack->px2vp},
                            {.f32 = 0}};
                        ArkUI_AttributeItem translateItem = {translateValue.data(), translateValue.size()};
                        NativeNodeApi::getInstance()->setAttribute(
                            panActionCallBack->componentInstance->getLocalRootArkUINode().getArkUINodeHandle(),
                            NODE_TRANSLATE, &translateItem);
                        panActionCallBack->rnInstance.lock()->postMessageToArkTS("touch",  to_string(panActionCallBack->offsetX * panActionCallBack->px2vp)+","+to_string(panActionCallBack->offsetY * panActionCallBack->px2vp));

                    } else if (actionType == GESTURE_EVENT_ACTION_END) {
                        panActionCallBack->positionX = panActionCallBack->offsetX;
                        panActionCallBack->positionY = panActionCallBack->offsetY;
                    }
                };
                PanActionCallBack *panActionCallBack =
                    new PanActionCallBack{.componentInstance = componentInstance,
                                          .px2vp = static_cast<float>(ctx.messagePayload["px2vp"].asDouble()),
                                          .rnInstance = rnInstance};
                panGestureApi->setGestureEventTarget(
                    panPanGesture, GESTURE_EVENT_ACTION_ACCEPT | GESTURE_EVENT_ACTION_UPDATE | GESTURE_EVENT_ACTION_END,
                    panActionCallBack, onPanActionCallBack);
                panGestureApi->addGestureToNode(componentInstance->getLocalRootArkUINode().getArkUINodeHandle(),
                                                panPanGesture, PARALLEL, NORMAL_GESTURE_MASK);
                ReactBindingxArkTSMessageHandler::getInstance()->isInterceptPan = true;
            }
        }
        if (ctx.messageName == "bind") {
            DLOG(INFO) << "ReactBindingXPackage::messagePayload:" << ctx.messagePayload;
            auto eventType = (ctx.messagePayload["options"])["eventType"];
            if (eventType == "orientation") {
                auto maybeTag = ((ctx.messagePayload["options"])["props"])[0]["element"];
                auto rnInstanceCAPI = std::dynamic_pointer_cast<RNInstanceCAPI>(rnInstance);
                auto componentInstance = rnInstanceCAPI->findComponentInstanceByTag(maybeTag.asDouble());
                auto x = (ctx.messagePayload["data"])["x"].asDouble();
                auto y = (ctx.messagePayload["data"])["y"].asDouble();
                std::array<ArkUI_NumberValue, 3> translateValue = {
                    ArkUI_NumberValue{.f32 = static_cast<float>(x) * 100},
                    {.f32 = static_cast<float>(y) * 100},
                    {.f32 = 0}};
                ArkUI_AttributeItem translateItem = {translateValue.data(), translateValue.size()};
                NativeNodeApi::getInstance()->setAttribute(
                    componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), NODE_TRANSLATE,
                    &translateItem);
            } else if (eventType == "pan") {
                  ReactBindingxArkTSMessageHandler::getInstance()->isInterceptPan = false;
            } else if (eventType == "scroll") {
                auto maybeTag = (ctx.messagePayload["options"])["anchor"];
                DLOG(INFO) << "ReactBindingXPackage::scroll maybeTag: " << maybeTag.asDouble();
                auto rnInstanceCAPI = std::dynamic_pointer_cast<RNInstanceCAPI>(rnInstance);
                auto componentInstance = rnInstanceCAPI->findComponentInstanceByTag(maybeTag.asDouble());
                auto anyGestureApi =
                    OH_ArkUI_QueryModuleInterfaceByName(ARKUI_NATIVE_GESTURE, "ArkUI_NativeGestureAPI_1");
                scrollGestureApi = reinterpret_cast<ArkUI_NativeGestureAPI_1 *>(anyGestureApi); 
                scrollPanGesture = scrollGestureApi->createPanGesture(1, GESTURE_DIRECTION_VERTICAL, 1);
                folly::dynamic elementViewTag;
                folly::dynamic elementTextTag;
                vector<std::string> propertyAtr;
                for (int i = 0; i < ((ctx.messagePayload["options"])["props"]).size(); i++) {
                    auto element = ((ctx.messagePayload["options"])["props"])[i]["element"];
                    auto property = ((ctx.messagePayload["options"])["props"])[i]["property"];
                    propertyAtr.push_back(property.asString());
                    if (property == "color") {
                        elementTextTag = element;
                    } else {
                        elementViewTag = element;
                    }
                }
                if (elementViewTag == nullptr)
                    return;
                auto elementComponentInstance = rnInstanceCAPI->findComponentInstanceByTag(elementViewTag.asDouble());
                ComponentInstance::Shared elementTextComponentInstance;
                if (elementTextTag != nullptr) {
                    elementTextComponentInstance =
                        rnInstanceCAPI->findComponentInstanceByTag(elementTextTag.asDouble());
                }
                PanActionCallBack *panActionCallBack = new PanActionCallBack{
                    .componentInstance = componentInstance,
                    .elementViewComponentInstance = elementComponentInstance,
                    .elementTextComponentInstance = elementTextComponentInstance,
                    .tag = maybeTag.asDouble(),
                    .propertyAtr = propertyAtr,
                    .backgroundcolor = (ctx.messagePayload["background_color"] != nullptr)
                                           ? ctx.messagePayload["background_color"].asString()
                                           : nullptr,
                    .backgroundcolorEval = (ctx.messagePayload["background_color_eval"] != nullptr)
                                               ? ctx.messagePayload["background_color_eval"].asString()
                                               : nullptr,
                    .color =
                        (ctx.messagePayload["color"] != nullptr) ? ctx.messagePayload["color"].asString() : nullptr,
                };
                auto onPanActionCallBack = [](ArkUI_GestureEvent *event, void *extraParam) {
                    PanActionCallBack *panActionCallBack = (PanActionCallBack *)extraParam;
                    ReactBindingxArkTSMessageHandler::getInstance()->m_panActionCallBack = panActionCallBack;
                    ReactBindingxArkTSMessageHandler::getInstance()->handleScroll();
                };

                scrollGestureApi->setGestureEventTarget(scrollPanGesture,
                                                        GESTURE_EVENT_ACTION_ACCEPT | GESTURE_EVENT_ACTION_UPDATE |
                                                            GESTURE_EVENT_ACTION_END,
                                                        panActionCallBack, onPanActionCallBack);
                scrollGestureApi->addGestureToNode(
                    componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), scrollPanGesture,
                    PARALLEL, NORMAL_GESTURE_MASK);
            } else if (eventType == "timing") {
                auto maybeTag = ((ctx.messagePayload["options"])["props"])[0]["element"];
                auto rnInstanceCAPI = std::dynamic_pointer_cast<RNInstanceCAPI>(rnInstance);
                auto componentInstance = rnInstanceCAPI->findComponentInstanceByTag(maybeTag.asDouble());
                auto x = (ctx.messagePayload["data"])["x"].asDouble();
                auto y = (ctx.messagePayload["data"])["y"].asDouble();
                DLOG(INFO) << "ReactBindingXPackage::timing x:" << x << " y:" << y;
                vector<std::string> propertyAtr;
                for (int i = 0; i < ((ctx.messagePayload["options"])["props"]).size(); i++) {
                    auto property = ((ctx.messagePayload["options"])["props"])[i]["property"];
                    propertyAtr.push_back(property.asString());
                }
                vector<std::string> translateMatchPropertys;
                translateMatchPropertys.push_back("transform.translate");
                translateMatchPropertys.push_back("transform.translateX");
                translateMatchPropertys.push_back("transform.translateY");
                vector<std::string> findTranslateAtr = findProperty(translateMatchPropertys, propertyAtr);
                if (findTranslateAtr.size() > 0) {
                    std::array<ArkUI_NumberValue, 3> translateValue = {
                        ArkUI_NumberValue{.f32 = static_cast<float>(x)}, {.f32 = static_cast<float>(y)}, {.f32 = 0}};
                    ArkUI_AttributeItem translateItem = {translateValue.data(), translateValue.size()};
                    NativeNodeApi::getInstance()->setAttribute(
                        componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), NODE_TRANSLATE,
                        &translateItem);
                }
                vector<std::string> opacityMatchPropertys;
                opacityMatchPropertys.push_back("opacity");
                vector<std::string> findOpacityAtr = findProperty(translateMatchPropertys, propertyAtr);
                if (findOpacityAtr.size() > 0) {
                    ArkUI_NumberValue opacityValue[] = {
                        {.f32 = static_cast<float>(ctx.messagePayload["opacity"].asDouble())}};
                    ArkUI_AttributeItem opacityItem = {opacityValue, sizeof(opacityValue) / sizeof(ArkUI_NumberValue)};
                    NativeNodeApi::getInstance()->setAttribute(
                        componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), NODE_OPACITY,
                        &opacityItem);
                }
            }
        } else if (ctx.messageName == "unbind") {

            auto eventType = (ctx.messagePayload["options"])["eventType"];
            if (eventType == "pan") {
                auto maybeTag = (ctx.messagePayload["options"])["token"];
                auto rnInstanceCAPI = std::dynamic_pointer_cast<RNInstanceCAPI>(rnInstance);
                auto componentInstance = rnInstanceCAPI->findComponentInstanceByTag(maybeTag.asDouble());
                auto viewComponentInstance = std::dynamic_pointer_cast<rnoh::ViewComponentInstance>(componentInstance);
                if (panGestureApi) {
                    panGestureApi->removeGestureFromNode(
                        viewComponentInstance->getLocalRootArkUINode().getArkUINodeHandle(), panPanGesture);
                }
                   ReactBindingxArkTSMessageHandler::getInstance()->isInterceptPan = false;
            } else if (eventType == "scroll") {
                DLOG(INFO) << "ReactBindingXPackage::scroll unbind";
                auto maybeTag = (ctx.messagePayload["options"])["token"];
                DLOG(INFO) << "ReactBindingXPackage::event scroll unbind " << maybeTag.asDouble();
                auto rnInstanceCAPI = std::dynamic_pointer_cast<RNInstanceCAPI>(rnInstance);
                auto componentInstance = rnInstanceCAPI->findComponentInstanceByTag(maybeTag.asDouble());
                auto scrollViewComponentInstance =
                    std::dynamic_pointer_cast<rnoh::ScrollViewComponentInstance>(componentInstance);
                if (scrollGestureApi) {
                    scrollGestureApi->removeGestureFromNode(
                        scrollViewComponentInstance->getLocalRootArkUINode().getArkUINodeHandle(), scrollPanGesture);
                }
            }
        } else if (ctx.messageName == "eval") {

            auto msg = ctx.messagePayload["data"];
            ExpressHandleEval::getInstance()->init_mapping(ExpressHandleEval::getInstance()->op_mapping);
            double result = ExpressHandleEval::getInstance()->eval(msg.asString());
            std::ostringstream sstream;
            sstream << result;
            std::string eventType = ctx.messagePayload["eventType"].asString();
            if (eventType == "scroll") {
                scrollEvalValue = result;
            }
            if (eventType == "timing") {
                rnInstance->postMessageToArkTS("eval", result);
            }
        }  else if (ctx.messageName == "getComputedStyle") {
            auto maybeTag = (ctx.messagePayload["element"]).asDouble();
            auto rnInstanceCAPI = std::dynamic_pointer_cast<RNInstanceCAPI>(rnInstance);
            auto componentInstance = rnInstanceCAPI->findComponentInstanceByTag(maybeTag);
            float translate = NativeNodeApi::getInstance()->getAttribute(componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), NODE_TRANSLATE)->value[0].f32;
            float scale = NativeNodeApi::getInstance()->getAttribute(componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), NODE_SCALE)->value[0].f32;
            float roate = NativeNodeApi::getInstance()->getAttribute(componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), NODE_ROTATE)->value[3].f32;
            float opacity = NativeNodeApi::getInstance()->getAttribute(componentInstance->getLocalRootArkUINode().getArkUINodeHandle(), NODE_OPACITY)->value[0].f32;
            float backgroundColor = NativeNodeApi::getInstance()->getAttribute(componentInstance->getLocalRootArkUINode().getArkUINodeHandle(),NODE_BACKGROUND_COLOR)->value[0].u32;
            std::string computedStyle = "{translate:" + to_string(translate) + ",scale:" + to_string(scale) +
                                        ",roate:" + to_string(roate) + ",opacity:" + to_string(opacity) +
                                        ",background-color:" + to_string(backgroundColor) +"}";
            DLOG(INFO) << "ReactBindingXPackage::getComputedStyle post:" << computedStyle;
            rnInstance->postMessageToArkTS("style", computedStyle);
        }
    }

    ReactBindingxArkTSMessageHandler *ReactBindingxArkTSMessageHandler::getInstance() {
        if (!m_reactBindingxArkTSMessageHandler) {
            m_reactBindingxArkTSMessageHandler = new ReactBindingxArkTSMessageHandler();
        }
        return m_reactBindingxArkTSMessageHandler;
    }
} // namespace rnoh