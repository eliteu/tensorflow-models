"use strict";
/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var box_1 = require("./box");
var HandDetector = /** @class */ (function () {
    function HandDetector(model, width, height, anchorsAnnotated, iouThreshold, scoreThreshold) {
        this.model = model;
        this.width = width;
        this.height = height;
        this.iouThreshold = iouThreshold;
        this.scoreThreshold = scoreThreshold;
        this.anchors = anchorsAnnotated.map(function (anchor) { return [anchor.x_center, anchor.y_center]; });
        this.anchorsTensor = tf.tensor2d(this.anchors);
        this.inputSizeTensor = tf.tensor1d([width, height]);
        this.doubleInputSizeTensor = tf.tensor1d([width * 2, height * 2]);
    }
    HandDetector.prototype.normalizeBoxes = function (boxes) {
        var _this = this;
        return tf.tidy(function () {
            var boxOffsets = tf.slice(boxes, [0, 0], [-1, 2]);
            var boxSizes = tf.slice(boxes, [0, 2], [-1, 2]);
            var boxCenterPoints = tf.add(tf.div(boxOffsets, _this.inputSizeTensor), _this.anchorsTensor);
            var halfBoxSizes = tf.div(boxSizes, _this.doubleInputSizeTensor);
            var startPoints = tf.mul(tf.sub(boxCenterPoints, halfBoxSizes), _this.inputSizeTensor);
            var endPoints = tf.mul(tf.add(boxCenterPoints, halfBoxSizes), _this.inputSizeTensor);
            return tf.concat2d([startPoints, endPoints], 1);
        });
    };
    HandDetector.prototype.normalizeLandmarks = function (rawPalmLandmarks, index) {
        var _this = this;
        return tf.tidy(function () {
            var landmarks = tf.add(tf.div(tf.reshape(rawPalmLandmarks, [-1, 7, 2]), _this.inputSizeTensor), _this.anchors[index]);
            return tf.mul(landmarks, _this.inputSizeTensor);
        });
    };
    HandDetector.prototype.getBoundingBoxes = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedInput, batchedPrediction, savedWebglPackDepthwiseConvFlag, prediction, scores, rawBoxes, boxes, savedConsoleWarnFn, boxesWithHandsTensor, boxesWithHands, toDispose, boxIndex, matchingBox, rawPalmLandmarks, palmLandmarks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedInput = tf.tidy(function () { return tf.mul(tf.sub(input, 0.5), 2); });
                        if (tf.getBackend() === 'webgl') {
                            savedWebglPackDepthwiseConvFlag = tf.env().get('WEBGL_PACK_DEPTHWISECONV');
                            tf.env().set('WEBGL_PACK_DEPTHWISECONV', true);
                            // The model returns a tensor with the following shape:
                            //  [1 (batch), 2944 (anchor points), 19 (data for each anchor)]
                            batchedPrediction = this.model.predict(normalizedInput);
                            tf.env().set('WEBGL_PACK_DEPTHWISECONV', savedWebglPackDepthwiseConvFlag);
                        }
                        else {
                            batchedPrediction = this.model.predict(normalizedInput);
                        }
                        prediction = tf.squeeze(batchedPrediction);
                        scores = tf.tidy(function () { return tf.squeeze(tf.sigmoid(tf.slice(prediction, [0, 0], [-1, 1]))); });
                        rawBoxes = tf.slice(prediction, [0, 1], [-1, 4]);
                        boxes = this.normalizeBoxes(rawBoxes);
                        savedConsoleWarnFn = console.warn;
                        console.warn = function () { };
                        boxesWithHandsTensor = tf.image.nonMaxSuppression(boxes, scores, 1, this.iouThreshold, this.scoreThreshold);
                        console.warn = savedConsoleWarnFn;
                        return [4 /*yield*/, boxesWithHandsTensor.array()];
                    case 1:
                        boxesWithHands = _a.sent();
                        toDispose = [
                            normalizedInput, batchedPrediction, boxesWithHandsTensor, prediction,
                            boxes, rawBoxes, scores
                        ];
                        if (boxesWithHands.length === 0) {
                            toDispose.forEach(function (tensor) { return tensor.dispose(); });
                            return [2 /*return*/, null];
                        }
                        boxIndex = boxesWithHands[0];
                        matchingBox = tf.slice(boxes, [boxIndex, 0], [1, -1]);
                        rawPalmLandmarks = tf.slice(prediction, [boxIndex, 5], [1, 14]);
                        palmLandmarks = tf.tidy(function () { return tf.reshape(_this.normalizeLandmarks(rawPalmLandmarks, boxIndex), [
                            -1, 2
                        ]); });
                        toDispose.push(rawPalmLandmarks);
                        toDispose.forEach(function (tensor) { return tensor.dispose(); });
                        return [2 /*return*/, { boxes: matchingBox, palmLandmarks: palmLandmarks }];
                }
            });
        });
    };
    /**
     * Returns a Box identifying the bounding box of a hand within the image.
     * Returns null if there is no hand in the image.
     *
     * @param input The image to classify.
     */
    HandDetector.prototype.estimateHandBounds = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var inputHeight, inputWidth, image, prediction, boundingBoxes, startPoint, endPoint, palmLandmarks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputHeight = input.shape[1];
                        inputWidth = input.shape[2];
                        image = tf.tidy(function () { return tf.div(tf.image.resizeBilinear(input, [_this.width, _this.height]), 255); });
                        return [4 /*yield*/, this.getBoundingBoxes(image)];
                    case 1:
                        prediction = _a.sent();
                        if (prediction === null) {
                            image.dispose();
                            return [2 /*return*/, null];
                        }
                        boundingBoxes = prediction.boxes.arraySync();
                        startPoint = boundingBoxes[0].slice(0, 2);
                        endPoint = boundingBoxes[0].slice(2, 4);
                        palmLandmarks = prediction.palmLandmarks.arraySync();
                        image.dispose();
                        prediction.boxes.dispose();
                        prediction.palmLandmarks.dispose();
                        return [2 /*return*/, box_1.scaleBoxCoordinates({ startPoint: startPoint, endPoint: endPoint, palmLandmarks: palmLandmarks }, [inputWidth / this.width, inputHeight / this.height])];
                }
            });
        });
    };
    return HandDetector;
}());
exports.HandDetector = HandDetector;
//# sourceMappingURL=hand.js.map