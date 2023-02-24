/**
    * @license
    * Copyright 2021 Google LLC. All Rights Reserved.
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    * http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    * =============================================================================
    */
import{loadGraphModel as t}from"@tensorflow/tfjs-converter";import{image as n,tensor2d as e,tensor1d as r,tidy as o,slice as i,add as s,div as a,mul as u,sub as h,concat2d as d,reshape as c,getBackend as f,env as l,squeeze as p,sigmoid as m,util as v,Tensor as P,browser as g,expandDims as b,cast as k}from"@tensorflow/tfjs-core";function y(t,n,e,r){return new(e||(e=Promise))((function(o,i){function s(t){try{u(r.next(t))}catch(t){i(t)}}function a(t){try{u(r.throw(t))}catch(t){i(t)}}function u(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(s,a)}u((r=r.apply(t,n||[])).next())}))}function x(t,n){var e,r,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;s;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,r=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=n.call(t,s)}catch(t){i=[6,t],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}}function w(t){return[Math.abs(t.endPoint[0]-t.startPoint[0]),Math.abs(t.endPoint[1]-t.startPoint[1])]}function L(t){return[t.startPoint[0]+(t.endPoint[0]-t.startPoint[0])/2,t.startPoint[1]+(t.endPoint[1]-t.startPoint[1])/2]}function B(t,n){void 0===n&&(n=1.5);var e=L(t),r=w(t),o=[n*r[0]/2,n*r[1]/2];return{startPoint:[e[0]-o[0],e[1]-o[1]],endPoint:[e[0]+o[0],e[1]+o[1]],palmLandmarks:t.palmLandmarks}}function I(t){var n=L(t),e=w(t),r=Math.max.apply(Math,e)/2;return{startPoint:[n[0]-r,n[1]-r],endPoint:[n[0]+r,n[1]+r],palmLandmarks:t.palmLandmarks}}function C(t,n){var e=[t.endPoint[0]-t.startPoint[0],t.endPoint[1]-t.startPoint[1]],r=[e[0]*n[0],e[1]*n[1]];return{startPoint:[t.startPoint[0]+r[0],t.startPoint[1]+r[1]],endPoint:[t.endPoint[0]+r[0],t.endPoint[1]+r[1]],palmLandmarks:t.palmLandmarks}}var H=function(){function t(t,n,o,i,s,a){this.model=t,this.width=n,this.height=o,this.iouThreshold=s,this.scoreThreshold=a,this.anchors=i.map((function(t){return[t.x_center,t.y_center]})),this.anchorsTensor=e(this.anchors),this.inputSizeTensor=r([n,o]),this.doubleInputSizeTensor=r([2*n,2*o])}return t.prototype.normalizeBoxes=function(t){var n=this;return o((function(){var e=i(t,[0,0],[-1,2]),r=i(t,[0,2],[-1,2]),o=s(a(e,n.inputSizeTensor),n.anchorsTensor),c=a(r,n.doubleInputSizeTensor),f=u(h(o,c),n.inputSizeTensor),l=u(s(o,c),n.inputSizeTensor);return d([f,l],1)}))},t.prototype.normalizeLandmarks=function(t,n){var e=this;return o((function(){var r=s(a(c(t,[-1,7,2]),e.inputSizeTensor),e.anchors[n]);return u(r,e.inputSizeTensor)}))},t.prototype.getBoundingBoxes=function(t){return y(this,void 0,void 0,(function(){var e,r,s,a,d,v,P,g,b,k,y,w,L,B,I,C=this;return x(this,(function(x){switch(x.label){case 0:return e=o((function(){return u(h(t,.5),2)})),"webgl"===f()?(s=l().get("WEBGL_PACK_DEPTHWISECONV"),l().set("WEBGL_PACK_DEPTHWISECONV",!0),r=this.model.predict(e),l().set("WEBGL_PACK_DEPTHWISECONV",s)):r=this.model.predict(e),a=p(r),d=o((function(){return p(m(i(a,[0,0],[-1,1])))})),v=i(a,[0,1],[-1,4]),P=this.normalizeBoxes(v),g=console.warn,console.warn=function(){},b=n.nonMaxSuppression(P,d,1,this.iouThreshold,this.scoreThreshold),console.warn=g,[4,b.array()];case 1:return k=x.sent(),y=[e,r,b,a,P,v,d],0===k.length?(y.forEach((function(t){return t.dispose()})),[2,null]):(w=k[0],L=i(P,[w,0],[1,-1]),B=i(a,[w,5],[1,14]),I=o((function(){return c(C.normalizeLandmarks(B,w),[-1,2])})),y.push(B),y.forEach((function(t){return t.dispose()})),[2,{boxes:L,palmLandmarks:I}])}}))}))},t.prototype.estimateHandBounds=function(t){return y(this,void 0,void 0,(function(){var e,r,i,s,u,h,d,c,f=this;return x(this,(function(l){switch(l.label){case 0:return e=t.shape[1],r=t.shape[2],i=o((function(){return a(n.resizeBilinear(t,[f.width,f.height]),255)})),[4,this.getBoundingBoxes(i)];case 1:return null===(s=l.sent())?(i.dispose(),[2,null]):(u=s.boxes.arraySync(),h=u[0].slice(0,2),d=u[0].slice(2,4),c=s.palmLandmarks.arraySync(),i.dispose(),s.boxes.dispose(),s.palmLandmarks.dispose(),[2,(p={startPoint:h,endPoint:d,palmLandmarks:c},m=[r/this.width,e/this.height],{startPoint:[p.startPoint[0]*m[0],p.startPoint[1]*m[1]],endPoint:[p.endPoint[0]*m[0],p.endPoint[1]*m[1]],palmLandmarks:p.palmLandmarks.map((function(t){return[t[0]*m[0],t[1]*m[1]]}))})])}var p,m}))}))},t}(),M={thumb:[1,2,3,4],indexFinger:[5,6,7,8],middleFinger:[9,10,11,12],ringFinger:[13,14,15,16],pinky:[17,18,19,20],palmBase:[0]};function T(t,n){var e,r=Math.PI/2-Math.atan2(-(n[1]-t[1]),n[0]-t[0]);return(e=r)-2*Math.PI*Math.floor((e+Math.PI)/(2*Math.PI))}var E=function(t,n){return[[1,0,t],[0,1,n],[0,0,1]]};function O(t,n){for(var e=0,r=0;r<t.length;r++)e+=t[r]*n[r];return e}function S(t,n){for(var e=[],r=0;r<t.length;r++)e.push(t[r][n]);return e}function W(t,n){for(var e=[],r=t.length,o=0;o<r;o++){e.push([]);for(var i=0;i<r;i++)e[o].push(O(t[o],S(n,i)))}return e}function D(t,n){var e=Math.cos(t),r=Math.sin(t),o=[[e,-r,0],[r,e,0],[0,0,1]],i=W(E(n[0],n[1]),o);return W(i,E(-n[0],-n[1]))}function z(t,n){return[O(t,n[0]),O(t,n[1])]}var _=[0,-.4],R=[0,-.1],j=[0,5,9,13,17,1,2],V=function(){function t(t,n,e,r,o,i){this.boundingBoxDetector=t,this.meshDetector=n,this.meshWidth=e,this.meshHeight=r,this.maxContinuousChecks=o,this.detectionConfidence=i,this.regionsOfInterest=[],this.runsWithoutHandDetector=0,this.maxHandsNumber=1}return t.prototype.getBoxForPalmLandmarks=function(t,n){var e=t.map((function(t){return z(t.concat([1]),n)}));return B(I(C(this.calculateLandmarksBoundingBox(e),_)),3)},t.prototype.getBoxForHandLandmarks=function(t){for(var n=B(I(C(this.calculateLandmarksBoundingBox(t),R)),1.65),e=[],r=0;r<j.length;r++)e.push(t[j[r]].slice(0,2));return n.palmLandmarks=e,n},t.prototype.transformRawCoords=function(t,n,e,r){var o,i,s,a,u=this,h=w(n),d=[h[0]/this.meshWidth,h[1]/this.meshHeight],c=t.map((function(t){return[d[0]*(t[0]-u.meshWidth/2),d[1]*(t[1]-u.meshHeight/2),t[2]]})),f=D(e,[0,0]),l=c.map((function(t){return z(t,f).concat([t[2]])})),p=(i=[[(o=r)[0][0],o[1][0]],[o[0][1],o[1][1]]],s=[o[0][2],o[1][2]],a=[-O(i[0],s),-O(i[1],s)],[i[0].concat(a[0]),i[1].concat(a[1]),[0,0,1]]),m=L(n).concat([1]),v=[O(m,p[0]),O(m,p[1])];return l.map((function(t){return[t[0]+v[0],t[1]+v[1],t[2]]}))},t.prototype.estimateHand=function(t){return y(this,void 0,void 0,(function(){var e,r,o,i,s,u,h,d,p,m,v,P,g,b,k,y,w,B,I,C;return x(this,(function(x){switch(x.label){case 0:return!0!==(e=this.shouldUpdateRegionsOfInterest())?[3,2]:[4,this.boundingBoxDetector.estimateHandBounds(t)];case 1:return null===(r=x.sent())?(t.dispose(),this.regionsOfInterest=[],[2,null]):(this.updateRegionsOfInterest(r,!0),this.runsWithoutHandDetector=0,[3,3]);case 2:this.runsWithoutHandDetector++,x.label=3;case 3:return o=this.regionsOfInterest[0],i=T(o.palmLandmarks[0],o.palmLandmarks[2]),s=L(o),u=[s[0]/t.shape[2],s[1]/t.shape[1]],h=n.rotateWithOffset(t,i,0,u),d=D(-i,s),p=!0===e?this.getBoxForPalmLandmarks(o.palmLandmarks,d):o,m=function(t,e,r){var o=e.shape[1],i=e.shape[2],s=[[t.startPoint[1]/o,t.startPoint[0]/i,t.endPoint[1]/o,t.endPoint[0]/i]];return n.cropAndResize(e,s,[0],r)}(p,h,[this.meshWidth,this.meshHeight]),v=a(m,255),m.dispose(),h.dispose(),"webgl"===f()?(g=l().get("WEBGL_PACK_DEPTHWISECONV"),l().set("WEBGL_PACK_DEPTHWISECONV",!0),P=this.meshDetector.predict(v),l().set("WEBGL_PACK_DEPTHWISECONV",g)):P=this.meshDetector.predict(v),b=P[0],k=P[1],v.dispose(),y=b.dataSync()[0],b.dispose(),y<this.detectionConfidence?(k.dispose(),this.regionsOfInterest=[],[2,null]):(w=c(k,[-1,3]),B=w.arraySync(),k.dispose(),w.dispose(),I=this.transformRawCoords(B,p,i,d),C=this.getBoxForHandLandmarks(I),this.updateRegionsOfInterest(C,!1),[2,{landmarks:I,handInViewConfidence:y,boundingBox:{topLeft:C.startPoint,bottomRight:C.endPoint}}])}}))}))},t.prototype.calculateLandmarksBoundingBox=function(t){var n=t.map((function(t){return t[0]})),e=t.map((function(t){return t[1]}));return{startPoint:[Math.min.apply(Math,n),Math.min.apply(Math,e)],endPoint:[Math.max.apply(Math,n),Math.max.apply(Math,e)]}},t.prototype.updateRegionsOfInterest=function(t,n){if(n)this.regionsOfInterest=[t];else{var e=this.regionsOfInterest[0],r=0;if(null!=e&&null!=e.startPoint){var o=t.startPoint,i=o[0],s=o[1],a=t.endPoint,u=a[0],h=a[1],d=e.startPoint,c=d[0],f=d[1],l=e.endPoint,p=l[0],m=l[1],v=Math.max(i,c),P=Math.max(s,f),g=(Math.min(u,p)-v)*(Math.min(h,m)-P);r=g/((u-i)*(h-s)+(p-c)*(m-s)-g)}this.regionsOfInterest[0]=r>.8?e:t}},t.prototype.shouldUpdateRegionsOfInterest=function(){return this.regionsOfInterest.length!==this.maxHandsNumber||this.runsWithoutHandDetector>=this.maxContinuousChecks},t}();function F(){return y(this,void 0,void 0,(function(){return x(this,(function(n){return"https://tfhub.dev/mediapipe/tfjs-model/handdetector/1/default/1",[2,t("https://tfhub.dev/mediapipe/tfjs-model/handdetector/1/default/1",{fromTFHub:!0})]}))}))}function A(){return y(this,void 0,void 0,(function(){return x(this,(function(n){return"https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1",[2,t("https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1",{fromTFHub:!0})]}))}))}function N(){return y(this,void 0,void 0,(function(){return x(this,(function(t){return[2,v.fetch("https://tfhub.dev/mediapipe/tfjs-model/handskeleton/1/default/1/anchors.json?tfjs-format=file").then((function(t){return t.json()}))]}))}))}function G(t){var n=void 0===t?{}:t,e=n.maxContinuousChecks,r=void 0===e?1/0:e,o=n.detectionConfidence,i=void 0===o?.8:o,s=n.iouThreshold,a=void 0===s?.3:s,u=n.scoreThreshold,h=void 0===u?.5:u;return y(this,void 0,void 0,(function(){var t,n,e,o,s,u;return x(this,(function(d){switch(d.label){case 0:return[4,Promise.all([N(),F(),A()])];case 1:return t=d.sent(),n=t[0],e=t[1],o=t[2],s=new H(e,256,256,n,a,h),u=new V(s,o,256,256,r,i),[2,new K(u)]}}))}))}var K=function(){function t(t){this.pipeline=t}return t.getAnnotations=function(){return M},t.prototype.estimateHands=function(t,n){return void 0===n&&(n=!1),y(this,void 0,void 0,(function(){var e,r,i,s,a,u,h,d,c;return x(this,(function(f){switch(f.label){case 0:return e=function(t){return t instanceof P?[t.shape[0],t.shape[1]]:[t.height,t.width]}(t),r=e[1],i=o((function(){return t instanceof P||(t=g.fromPixels(t)),b(k(t,"float32"))})),[4,this.pipeline.estimateHand(i)];case 1:if(s=f.sent(),i.dispose(),null===s)return[2,[]];for(a=s,!0===n&&(a=function(t,n){var e=t.handInViewConfidence,r=t.landmarks,o=t.boundingBox;return{handInViewConfidence:e,landmarks:r.map((function(t){return[n-1-t[0],t[1],t[2]]})),boundingBox:{topLeft:[n-1-o.topLeft[0],o.topLeft[1]],bottomRight:[n-1-o.bottomRight[0],o.bottomRight[1]]}}}(s,r)),u={},h=0,d=Object.keys(M);h<d.length;h++)c=d[h],u[c]=M[c].map((function(t){return a.landmarks[t]}));return[2,[{handInViewConfidence:a.handInViewConfidence,boundingBox:a.boundingBox,landmarks:a.landmarks,annotations:u}]]}}))}))},t}();export{K as HandPose,G as load};