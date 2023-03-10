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
var util_1 = require("./util");
var UPDATE_REGION_OF_INTEREST_IOU_THRESHOLD = 0.8;
var PALM_BOX_SHIFT_VECTOR = [0, -0.4];
var PALM_BOX_ENLARGE_FACTOR = 3;
var HAND_BOX_SHIFT_VECTOR = [0, -0.1];
var HAND_BOX_ENLARGE_FACTOR = 1.65;
var PALM_LANDMARK_IDS = [0, 5, 9, 13, 17, 1, 2];
var PALM_LANDMARKS_INDEX_OF_PALM_BASE = 0;
var PALM_LANDMARKS_INDEX_OF_MIDDLE_FINGER_BASE = 2;
// The Pipeline coordinates between the bounding box and skeleton models.
var HandPipeline = /** @class */ (function () {
    function HandPipeline(boundingBoxDetector
    /* MediaPipe model for detecting hand bounding box */ , meshDetector
    /* MediaPipe model for detecting hand mesh */ , meshWidth, meshHeight, maxContinuousChecks, detectionConfidence) {
        this.boundingBoxDetector = boundingBoxDetector;
        this.meshDetector = meshDetector;
        this.meshWidth = meshWidth;
        this.meshHeight = meshHeight;
        this.maxContinuousChecks = maxContinuousChecks;
        this.detectionConfidence = detectionConfidence;
        // An array of hand bounding boxes.
        this.regionsOfInterest = [];
        this.runsWithoutHandDetector = 0;
        this.maxHandsNumber = 1; // TODO(annxingyuan): Add multi-hand support.
    }
    // Get the bounding box surrounding the hand, given palm landmarks.
    HandPipeline.prototype.getBoxForPalmLandmarks = function (palmLandmarks, rotationMatrix) {
        var rotatedPalmLandmarks = palmLandmarks.map(function (coord) {
            var homogeneousCoordinate = coord.concat([1]);
            return util_1.rotatePoint(homogeneousCoordinate, rotationMatrix);
        });
        var boxAroundPalm = this.calculateLandmarksBoundingBox(rotatedPalmLandmarks);
        // boxAroundPalm only surrounds the palm - therefore we shift it
        // upwards so it will capture fingers once enlarged + squarified.
        return box_1.enlargeBox(box_1.squarifyBox(box_1.shiftBox(boxAroundPalm, PALM_BOX_SHIFT_VECTOR)), PALM_BOX_ENLARGE_FACTOR);
    };
    // Get the bounding box surrounding the hand, given all hand landmarks.
    HandPipeline.prototype.getBoxForHandLandmarks = function (landmarks) {
        // The MediaPipe hand mesh model is trained on hands with empty space
        // around them, so we still need to shift / enlarge boxAroundHand even
        // though it surrounds the entire hand.
        var boundingBox = this.calculateLandmarksBoundingBox(landmarks);
        var boxAroundHand = box_1.enlargeBox(box_1.squarifyBox(box_1.shiftBox(boundingBox, HAND_BOX_SHIFT_VECTOR)), HAND_BOX_ENLARGE_FACTOR);
        var palmLandmarks = [];
        for (var i = 0; i < PALM_LANDMARK_IDS.length; i++) {
            palmLandmarks.push(landmarks[PALM_LANDMARK_IDS[i]].slice(0, 2));
        }
        boxAroundHand.palmLandmarks = palmLandmarks;
        return boxAroundHand;
    };
    // Scale, rotate, and translate raw keypoints from the model so they map to
    // the input coordinates.
    HandPipeline.prototype.transformRawCoords = function (rawCoords, box, angle, rotationMatrix) {
        var _this = this;
        var boxSize = box_1.getBoxSize(box);
        var scaleFactor = [boxSize[0] / this.meshWidth, boxSize[1] / this.meshHeight];
        var coordsScaled = rawCoords.map(function (coord) {
            return [
                scaleFactor[0] * (coord[0] - _this.meshWidth / 2),
                scaleFactor[1] * (coord[1] - _this.meshHeight / 2), coord[2]
            ];
        });
        var coordsRotationMatrix = util_1.buildRotationMatrix(angle, [0, 0]);
        var coordsRotated = coordsScaled.map(function (coord) {
            var rotated = util_1.rotatePoint(coord, coordsRotationMatrix);
            return rotated.concat([coord[2]]);
        });
        var inverseRotationMatrix = util_1.invertTransformMatrix(rotationMatrix);
        var boxCenter = box_1.getBoxCenter(box).concat([1]);
        var originalBoxCenter = [
            util_1.dot(boxCenter, inverseRotationMatrix[0]),
            util_1.dot(boxCenter, inverseRotationMatrix[1])
        ];
        return coordsRotated.map(function (coord) {
            return [
                coord[0] + originalBoxCenter[0], coord[1] + originalBoxCenter[1],
                coord[2]
            ];
        });
    };
    HandPipeline.prototype.estimateHand = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var useFreshBox, boundingBoxPrediction, currentBox, angle, palmCenter, palmCenterNormalized, rotatedImage, rotationMatrix, box, croppedInput, handImage, prediction, savedWebglPackDepthwiseConvFlag, flag, keypoints, flagValue, keypointsReshaped, rawCoords, coords, nextBoundingBox, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        useFreshBox = this.shouldUpdateRegionsOfInterest();
                        if (!(useFreshBox === true)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.boundingBoxDetector.estimateHandBounds(image)];
                    case 1:
                        boundingBoxPrediction = _a.sent();
                        if (boundingBoxPrediction === null) {
                            image.dispose();
                            this.regionsOfInterest = [];
                            return [2 /*return*/, null];
                        }
                        this.updateRegionsOfInterest(boundingBoxPrediction, true /*force update*/);
                        this.runsWithoutHandDetector = 0;
                        return [3 /*break*/, 3];
                    case 2:
                        this.runsWithoutHandDetector++;
                        _a.label = 3;
                    case 3:
                        currentBox = this.regionsOfInterest[0];
                        angle = util_1.computeRotation(currentBox.palmLandmarks[PALM_LANDMARKS_INDEX_OF_PALM_BASE], currentBox.palmLandmarks[PALM_LANDMARKS_INDEX_OF_MIDDLE_FINGER_BASE]);
                        palmCenter = box_1.getBoxCenter(currentBox);
                        palmCenterNormalized = [palmCenter[0] / image.shape[2], palmCenter[1] / image.shape[1]];
                        rotatedImage = tf.image.rotateWithOffset(image, angle, 0, palmCenterNormalized);
                        rotationMatrix = util_1.buildRotationMatrix(-angle, palmCenter);
                        // The bounding box detector only detects palms, so if we're using a fresh
                        // bounding box prediction, we have to construct the hand bounding box from
                        // the palm keypoints.
                        if (useFreshBox === true) {
                            box =
                                this.getBoxForPalmLandmarks(currentBox.palmLandmarks, rotationMatrix);
                        }
                        else {
                            box = currentBox;
                        }
                        croppedInput = box_1.cutBoxFromImageAndResize(box, rotatedImage, [this.meshWidth, this.meshHeight]);
                        handImage = tf.div(croppedInput, 255);
                        croppedInput.dispose();
                        rotatedImage.dispose();
                        if (tf.getBackend() === 'webgl') {
                            savedWebglPackDepthwiseConvFlag = tf.env().get('WEBGL_PACK_DEPTHWISECONV');
                            tf.env().set('WEBGL_PACK_DEPTHWISECONV', true);
                            prediction =
                                this.meshDetector.predict(handImage);
                            tf.env().set('WEBGL_PACK_DEPTHWISECONV', savedWebglPackDepthwiseConvFlag);
                        }
                        else {
                            prediction =
                                this.meshDetector.predict(handImage);
                        }
                        flag = prediction[0], keypoints = prediction[1];
                        handImage.dispose();
                        flagValue = flag.dataSync()[0];
                        flag.dispose();
                        if (flagValue < this.detectionConfidence) {
                            keypoints.dispose();
                            this.regionsOfInterest = [];
                            return [2 /*return*/, null];
                        }
                        keypointsReshaped = tf.reshape(keypoints, [-1, 3]);
                        rawCoords = keypointsReshaped.arraySync();
                        keypoints.dispose();
                        keypointsReshaped.dispose();
                        coords = this.transformRawCoords(rawCoords, box, angle, rotationMatrix);
                        nextBoundingBox = this.getBoxForHandLandmarks(coords);
                        this.updateRegionsOfInterest(nextBoundingBox, false /* force replace */);
                        result = {
                            landmarks: coords,
                            handInViewConfidence: flagValue,
                            boundingBox: {
                                topLeft: nextBoundingBox.startPoint,
                                bottomRight: nextBoundingBox.endPoint
                            }
                        };
                        return [2 /*return*/, result];
                }
            });
        });
    };
    HandPipeline.prototype.calculateLandmarksBoundingBox = function (landmarks) {
        var xs = landmarks.map(function (d) { return d[0]; });
        var ys = landmarks.map(function (d) { return d[1]; });
        var startPoint = [Math.min.apply(Math, xs), Math.min.apply(Math, ys)];
        var endPoint = [Math.max.apply(Math, xs), Math.max.apply(Math, ys)];
        return { startPoint: startPoint, endPoint: endPoint };
    };
    // Updates regions of interest if the intersection over union between
    // the incoming and previous regions falls below a threshold.
    HandPipeline.prototype.updateRegionsOfInterest = function (box, forceUpdate) {
        if (forceUpdate) {
            this.regionsOfInterest = [box];
        }
        else {
            var previousBox = this.regionsOfInterest[0];
            var iou = 0;
            if (previousBox != null && previousBox.startPoint != null) {
                var _a = box.startPoint, boxStartX = _a[0], boxStartY = _a[1];
                var _b = box.endPoint, boxEndX = _b[0], boxEndY = _b[1];
                var _c = previousBox.startPoint, previousBoxStartX = _c[0], previousBoxStartY = _c[1];
                var _d = previousBox.endPoint, previousBoxEndX = _d[0], previousBoxEndY = _d[1];
                var xStartMax = Math.max(boxStartX, previousBoxStartX);
                var yStartMax = Math.max(boxStartY, previousBoxStartY);
                var xEndMin = Math.min(boxEndX, previousBoxEndX);
                var yEndMin = Math.min(boxEndY, previousBoxEndY);
                var intersection = (xEndMin - xStartMax) * (yEndMin - yStartMax);
                var boxArea = (boxEndX - boxStartX) * (boxEndY - boxStartY);
                var previousBoxArea = (previousBoxEndX - previousBoxStartX) *
                    (previousBoxEndY - boxStartY);
                iou = intersection / (boxArea + previousBoxArea - intersection);
            }
            this.regionsOfInterest[0] =
                iou > UPDATE_REGION_OF_INTEREST_IOU_THRESHOLD ? previousBox : box;
        }
    };
    HandPipeline.prototype.shouldUpdateRegionsOfInterest = function () {
        var roisCount = this.regionsOfInterest.length;
        return roisCount !== this.maxHandsNumber ||
            this.runsWithoutHandDetector >= this.maxContinuousChecks;
    };
    return HandPipeline;
}());
exports.HandPipeline = HandPipeline;
//# sourceMappingURL=pipeline.js.map