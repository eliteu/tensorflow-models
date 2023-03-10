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
var tfconv = require("@tensorflow/tfjs-converter");
var tf = require("@tensorflow/tfjs-core");
var hand_1 = require("./hand");
var keypoints_1 = require("./keypoints");
var pipeline_1 = require("./pipeline");
// Load the bounding box detector model.
function loadHandDetectorModel() {
    return __awaiter(this, void 0, void 0, function () {
        var HANDDETECT_MODEL_PATH;
        return __generator(this, function (_a) {
            HANDDETECT_MODEL_PATH = 'https://hub.tensorflow.google.cn/mediapipe/tfjs-model/handdetector/1/default/1';
            return [2 /*return*/, tfconv.loadGraphModel(HANDDETECT_MODEL_PATH, { fromTFHub: true })];
        });
    });
}
var MESH_MODEL_INPUT_WIDTH = 256;
var MESH_MODEL_INPUT_HEIGHT = 256;
// Load the mesh detector model.
function loadHandPoseModel() {
    return __awaiter(this, void 0, void 0, function () {
        var HANDPOSE_MODEL_PATH;
        return __generator(this, function (_a) {
            HANDPOSE_MODEL_PATH = 'https://hub.tensorflow.google.cn/mediapipe/tfjs-model/handskeleton/1/default/1';
            return [2 /*return*/, tfconv.loadGraphModel(HANDPOSE_MODEL_PATH, { fromTFHub: true })];
        });
    });
}
// In single shot detector pipelines, the output space is discretized into a set
// of bounding boxes, each of which is assigned a score during prediction. The
// anchors define the coordinates of these boxes.
function loadAnchors() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, tf.util
                    .fetch('https://cdn.aimaker.space/tfhub-tfjs-modules/mediapipe/tfjs-model/handskeleton/1/default/1/anchors.json')
                    .then(function (d) { return d.json(); })];
        });
    });
}
/**
 * Load handpose.
 *
 * @param config A configuration object with the following properties:
 * - `maxContinuousChecks` How many frames to go without running the bounding
 * box detector. Defaults to infinity. Set to a lower value if you want a safety
 * net in case the mesh detector produces consistently flawed predictions.
 * - `detectionConfidence` Threshold for discarding a prediction. Defaults to
 * 0.8.
 * - `iouThreshold` A float representing the threshold for deciding whether
 * boxes overlap too much in non-maximum suppression. Must be between [0, 1].
 * Defaults to 0.3.
 * - `scoreThreshold` A threshold for deciding when to remove boxes based
 * on score in non-maximum suppression. Defaults to 0.75.
 */
function load(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.maxContinuousChecks, maxContinuousChecks = _c === void 0 ? Infinity : _c, _d = _b.detectionConfidence, detectionConfidence = _d === void 0 ? 0.8 : _d, _e = _b.iouThreshold, iouThreshold = _e === void 0 ? 0.3 : _e, _f = _b.scoreThreshold, scoreThreshold = _f === void 0 ? 0.5 : _f;
    return __awaiter(this, void 0, void 0, function () {
        var _g, ANCHORS, handDetectorModel, handPoseModel, detector, pipeline, handpose;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, Promise.all([loadAnchors(), loadHandDetectorModel(), loadHandPoseModel()])];
                case 1:
                    _g = _h.sent(), ANCHORS = _g[0], handDetectorModel = _g[1], handPoseModel = _g[2];
                    detector = new hand_1.HandDetector(handDetectorModel, MESH_MODEL_INPUT_WIDTH, MESH_MODEL_INPUT_HEIGHT, ANCHORS, iouThreshold, scoreThreshold);
                    pipeline = new pipeline_1.HandPipeline(detector, handPoseModel, MESH_MODEL_INPUT_WIDTH, MESH_MODEL_INPUT_HEIGHT, maxContinuousChecks, detectionConfidence);
                    handpose = new HandPose(pipeline);
                    return [2 /*return*/, handpose];
            }
        });
    });
}
exports.load = load;
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
function flipHandHorizontal(prediction, width) {
    var handInViewConfidence = prediction.handInViewConfidence, landmarks = prediction.landmarks, boundingBox = prediction.boundingBox;
    return {
        handInViewConfidence: handInViewConfidence,
        landmarks: landmarks.map(function (coord) {
            return [width - 1 - coord[0], coord[1], coord[2]];
        }),
        boundingBox: {
            topLeft: [width - 1 - boundingBox.topLeft[0], boundingBox.topLeft[1]],
            bottomRight: [
                width - 1 - boundingBox.bottomRight[0], boundingBox.bottomRight[1]
            ]
        }
    };
}
var HandPose = /** @class */ (function () {
    function HandPose(pipeline) {
        this.pipeline = pipeline;
    }
    HandPose.getAnnotations = function () {
        return keypoints_1.MESH_ANNOTATIONS;
    };
    /**
     * Finds hands in the input image.
     *
     * @param input The image to classify. Can be a tensor, DOM element image,
     * video, or canvas.
     * @param flipHorizontal Whether to flip the hand keypoints horizontally.
     * Should be true for videos that are flipped by default (e.g. webcams).
     */
    HandPose.prototype.estimateHands = function (input, flipHorizontal) {
        if (flipHorizontal === void 0) { flipHorizontal = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, width, image, result, prediction, annotations, _i, _b, key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = getInputTensorDimensions(input), width = _a[1];
                        image = tf.tidy(function () {
                            if (!(input instanceof tf.Tensor)) {
                                input = tf.browser.fromPixels(input);
                            }
                            return tf.expandDims(tf.cast(input, 'float32'));
                        });
                        return [4 /*yield*/, this.pipeline.estimateHand(image)];
                    case 1:
                        result = _c.sent();
                        image.dispose();
                        if (result === null) {
                            return [2 /*return*/, []];
                        }
                        prediction = result;
                        if (flipHorizontal === true) {
                            prediction = flipHandHorizontal(result, width);
                        }
                        annotations = {};
                        for (_i = 0, _b = Object.keys(keypoints_1.MESH_ANNOTATIONS); _i < _b.length; _i++) {
                            key = _b[_i];
                            annotations[key] =
                                keypoints_1.MESH_ANNOTATIONS[key].map(function (index) { return prediction.landmarks[index]; });
                        }
                        return [2 /*return*/, [{
                                    handInViewConfidence: prediction.handInViewConfidence,
                                    boundingBox: prediction.boundingBox,
                                    landmarks: prediction.landmarks,
                                    annotations: annotations
                                }]];
                }
            });
        });
    };
    return HandPose;
}());
exports.HandPose = HandPose;
//# sourceMappingURL=index.js.map
