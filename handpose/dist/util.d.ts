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
export declare type TransformationMatrix = [[number, number, number], [number, number, number], [number, number, number]];
export declare function normalizeRadians(angle: number): number;
export declare function computeRotation(point1: [number, number], point2: [number, number]): number;
export declare function dot(v1: number[], v2: number[]): number;
export declare function getColumnFrom2DArr(arr: number[][], columnIndex: number): number[];
export declare function buildRotationMatrix(rotation: number, center: [number, number]): TransformationMatrix;
export declare function invertTransformMatrix(matrix: TransformationMatrix): TransformationMatrix;
export declare function rotatePoint(homogeneousCoordinate: [number, number, number], rotationMatrix: TransformationMatrix): [number, number];
