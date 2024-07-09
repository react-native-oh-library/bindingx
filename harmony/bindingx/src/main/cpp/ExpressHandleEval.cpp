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

#include "ExpressHandleEval.h"

namespace rnoh {

    string ops = "+-*/()";
    bool ValueError = false;  
    bool ExpressionError = false; 
    ExpressHandleEval *m_ExpressHandleEval;


    double toDouble(string str) {
        double target;
        stringstream ss;
        ss << str;
        ss >> target;
        return target;
    }


    void ExpressHandleEval::init_mapping(map<string, int> &mapping) {
        mapping["+"] = 0;
        mapping["-"] = 0;
        mapping["*"] = 1;
        mapping["/"] = 1;
        mapping["("] = 2;
        mapping[")"] = 2;
    }


    vector<string> toPostfix(string formula) {
        vector<string> result;
        vector<string> op_stack;
        string cur_num, cur_op;

        for (int i = 0; i < formula.size(); ++i) {
            if (ops.find(formula[i]) == ops.npos) 
                cur_num += formula[i];

            else 
            {
                if (!cur_num.empty()) {
                    result.push_back(cur_num);
                    cur_num.clear();
                }

                cur_op = formula[i];

                if (op_stack.empty()) 
                    op_stack.push_back(cur_op);
                else if (cur_op == "(") 
                    op_stack.push_back(cur_op);

                else if (cur_op == ")") 
                {
                    while (op_stack.back() != "(") {
                        result.push_back(op_stack.back());
                        op_stack.pop_back();

                        if (op_stack.empty()) 
                        {
                            ExpressionError = true;
                            result.push_back("0");
                            return result;
                        }
                    }
                    op_stack.pop_back(); 
                } else if (op_stack.back() == "(") 
                    op_stack.push_back(cur_op);
                else if (
                    ExpressHandleEval::getInstance()->op_mapping[cur_op] >
                    ExpressHandleEval::getInstance()->op_mapping
                        [op_stack
                             .back()]) 
                    op_stack.push_back(cur_op);
                else 
                {
                    while ((op_stack.back() != "(") && (ExpressHandleEval::getInstance()->op_mapping[op_stack.back()] >=
                                                        ExpressHandleEval::getInstance()->op_mapping[cur_op])) {
                        result.push_back(op_stack.back());
                        op_stack.pop_back();
                        if (op_stack.empty())
                            break;
                    }
                    op_stack.push_back(cur_op); 
                }
            }
        }

        result.push_back(cur_num);
        while (!op_stack.empty()) {
            result.push_back(op_stack.back());
            op_stack.pop_back();
        }

        return result;
    }
    double calculatePostfix(vector<string> &postfix) {
        vector<double> result;
        for (int i = 0; i < postfix.size(); ++i) {
            if (ops.find(postfix[i]) == ops.npos) 
                result.push_back(toDouble(postfix[i]));
            else
            {
                if (result.size() < 2) {
                    ExpressionError = true;
                    return 0.0;
                }
                double num1 = result.back();
                result.pop_back();
                double num2 = result.back();
                result.pop_back();
                double op_res;
                if (postfix[i] == "+")
                    op_res = num2 + num1;
                else if (postfix[i] == "-")
                    op_res = num2 - num1;
                else if (postfix[i] == "*")
                    op_res = num2 * num1;
                else if (postfix[i] == "/") {
                    if (num1 == 0) {
                        ValueError = true;
                        return 0.0;
                    }

                    op_res = num2 / num1;
                }
                result.push_back(op_res);
            }
        }
        if (result.size() == 1) 
            return result.back();
        else 
        {
            ExpressionError = true;
            return 0.0;
        }
    }

    double ExpressHandleEval::eval(const string &infix) {
        vector<string> postfix = toPostfix(infix);
        return calculatePostfix(postfix);
    }

    ExpressHandleEval *ExpressHandleEval::getInstance() {
        if (!m_ExpressHandleEval) {
            m_ExpressHandleEval = new ExpressHandleEval();
        }
        return m_ExpressHandleEval;
    }


} // namespace rnoh