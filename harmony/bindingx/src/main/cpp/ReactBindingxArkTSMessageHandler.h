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

#ifndef HARMONY_REACTBINDINGXARKTSMESSAGEHANDLER_H
#define HARMONY_REACTBINDINGXARKTSMESSAGEHANDLER_H
#include <arkui/native_gesture.h>
#include <map>
#include <vector>
#include "RNOH/Package.h"
#include "RNOH/arkui/NativeNodeApi.h"
#include "RNOHCorePackage/ComponentInstances/ScrollViewComponentInstance.h"
#include "RNOHCorePackage/ComponentInstances/ViewComponentInstance.h"
#include "ExpressHandleEval.h"
#include "RNOH/RNInstanceCAPI.h"

namespace rnoh {

    class ReactBindingxArkTSMessageHandler : public rnoh::ArkTSMessageHandler {
    public:
        ArkUI_NativeGestureAPI_1 *scrollGestureApi;
        ArkUI_NativeGestureAPI_1 *panGestureApi;
        ArkUI_GestureRecognizer *scrollPanGesture;
        ArkUI_GestureRecognizer *panPanGesture;
        std::thread *scrollThread;
        struct PanActionCallBack {
            rnoh::ComponentInstance::Shared componentInstance;
            rnoh::ComponentInstance::Shared elementViewComponentInstance;
            rnoh::ComponentInstance::Shared elementTextComponentInstance;
            float positionX;
            float positionY;
            float offsetX;
            float offsetY;
            float angle;
            bool scrollStatus;
            float scrollY;
            double tag;
            bool startThread;
            std::thread *scrollThread;
            std::string backgroundcolor;
            std::string color;
            std::string backgroundcolorEval;
            std::vector<std::string> propertyAtr;
            float px2vp;
        };
        PanActionCallBack *m_panActionCallBack;
        static ReactBindingxArkTSMessageHandler *getInstance();
        float m_scrollY;
        std::map<std::string, std::string> styleMap;

    public:
        void handleArkTSMessage(const Context &ctx) override;

        void handleScroll();
    };
} // namespace rnoh
#endif // HARMONY_REACTBINDINGXARKTSMESSAGEHANDLER_H
