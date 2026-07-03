(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,3115,e=>{"use strict";let t,a,n;var r,i,o,s,l,u,d,c,p=e.i(91398),h=e.i(93106),f=e.i(65859);e.i(4411);var x=e.i(20606),m=e.i(46340),m=m,m=m,g=e.i(77990),v=e.i(49672);let C={},b={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function $(e,t){if(!(e in C)||null!=t){let a=function(e,t){if(1!==e&&2!==e)throw Error("Cannot get WebGL rendering context, WebGL is disabled.");let a=null==t?function(e){if(!(0,g.env)().getBool("IS_SAFARI")&&"u">typeof OffscreenCanvas&&2===e)return new OffscreenCanvas(300,150);if("u">typeof document)return document.createElement("canvas");throw Error("Cannot create a canvas in this context")}(e):t;return(a.addEventListener("webglcontextlost",t=>{t.preventDefault(),delete C[e]},!1),(0,g.env)().getBool("SOFTWARE_WEBGL_ENABLED")&&(b.failIfMajorPerformanceCaveat=!1),1===e)?a.getContext("webgl",b)||a.getContext("experimental-webgl",b):a.getContext("webgl2",b)}(e,t);if(null===a)return console.log("Could not get context for WebGL version",e),null;C[e]=a}let a=C[e];return null==a||a.isContextLost()?(delete C[e],$(e)):(a.disable(a.DEPTH_TEST),a.disable(a.STENCIL_TEST),a.disable(a.BLEND),a.disable(a.DITHER),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SAMPLE_COVERAGE),a.enable(a.SCISSOR_TEST),a.enable(a.CULL_FACE),a.cullFace(a.BACK),C[e])}function I(e){let t=Math.ceil(v.util.sizeFromShape(e)/4);return v.util.sizeToSquarishShape(t)}function y(e,t){return[Math.max(1,Math.ceil(t/2)),Math.max(1,Math.ceil(e/2))]}function R(e,t){let a,n,r,i,o,s,l,u,d,c;return 2===(0,g.env)().getNumber("WEBGL_VERSION")?(a=e.R32F,n=e.R16F,r=e.RGBA16F,i=e.RGBA32F,o=e.RED,l=4,u=1,d=e.HALF_FLOAT,c=e.FLOAT,s=e.RGBA8):(a=e.RGBA,n=e.RGBA,r=e.RGBA,i=e.RGBA,o=e.RGBA,l=4,u=4,d=null!=t?t.HALF_FLOAT_OES:null,c=e.FLOAT,s=e.RGBA),{internalFormatFloat:a,internalFormatHalfFloat:n,internalFormatPackedHalfFloat:r,internalFormatPackedFloat:i,textureFormatFloat:o,downloadTextureFormat:s,downloadUnpackNumChannels:l,defaultNumChannels:u,textureTypeHalfFloat:d,textureTypeFloat:c}}function T(e,t){let a=t();return(0,g.env)().getBool("DEBUG")&&function(e){let t=e.getError();if(t!==e.NO_ERROR)throw Error("WebGL Error: "+S(e,t))}(e),a}function w(e){return!!((0,g.env)().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||0===e||596e-10<Math.abs(e)&&65504>Math.abs(e))}function S(e,t){switch(t){case e.NO_ERROR:return"NO_ERROR";case e.INVALID_ENUM:return"INVALID_ENUM";case e.INVALID_VALUE:return"INVALID_VALUE";case e.INVALID_OPERATION:return"INVALID_OPERATION";case e.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case e.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case e.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return`Unknown error code ${t}`}}function N(e,t){return Y(e,()=>e.getExtension(t),'Extension "'+t+'" not supported on this browser.')}function E(e,t){let a=Y(e,()=>e.createShader(e.VERTEX_SHADER),"Unable to create vertex WebGLShader.");if(T(e,()=>e.shaderSource(a,t)),T(e,()=>e.compileShader(a)),!1===e.getShaderParameter(a,e.COMPILE_STATUS))throw console.log(e.getShaderInfoLog(a)),Error("Failed to compile vertex shader.");return a}function k(e,t){let a=Y(e,()=>e.createShader(e.FRAGMENT_SHADER),"Unable to create fragment WebGLShader.");if(T(e,()=>e.shaderSource(a,t)),T(e,()=>e.compileShader(a)),(0,g.env)().get("ENGINE_COMPILE_ONLY"))return a;if(!1===e.getShaderParameter(a,e.COMPILE_STATUS))throw A(t,e.getShaderInfoLog(a)),Error("Failed to compile fragment shader.");return a}(r=l||(l={}))[r.DENSE=0]="DENSE",r[r.SHARED_BATCH=1]="SHARED_BATCH",(i=u||(u={}))[i.RENDER=0]="RENDER",i[i.UPLOAD=1]="UPLOAD",i[i.PIXELS=2]="PIXELS",i[i.DOWNLOAD=3]="DOWNLOAD",(o=d||(d={}))[o.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",o[o.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",o[o.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",o[o.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",o[o.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16";let _=/ERROR: [0-9]+:([0-9]+):/g;function A(e,t){let a=_.exec(t);if(null==a){console.log(`Couldn't parse line number in error: ${t}`),console.log(e);return}let n=+a[1],r=e.split("\n"),i=r.length.toString().length+2,o=r.map((e,t)=>v.util.rightPad((t+1).toString(),i)+e),s=0;for(let e=0;e<o.length;e++)s=Math.max(o[e].length,s);let l=o.slice(0,n-1),u=o.slice(n-1,n),d=o.slice(n);console.log(l.join("\n")),console.log(t.split("\n")[0]),console.log(`%c ${v.util.rightPad(u[0],s)}`,"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(d.join("\n"))}function O(e){return Y(e,()=>e.createProgram(),"Unable to create WebGLProgram.")}function F(e,t){if(T(e,()=>e.linkProgram(t)),!(0,g.env)().get("ENGINE_COMPILE_ONLY")&&!1===e.getProgramParameter(t,e.LINK_STATUS))throw console.log(e.getProgramInfoLog(t)),Error("Failed to link vertex and fragment shaders.")}function D(e,t){if(T(e,()=>e.validateProgram(t)),!1===e.getProgramParameter(t,e.VALIDATE_STATUS))throw console.log(e.getProgramInfoLog(t)),Error("Shader program validation failed.")}function P(e,t){let a=Y(e,()=>e.createBuffer(),"Unable to create WebGLBuffer");return T(e,()=>e.bindBuffer(e.ARRAY_BUFFER,a)),T(e,()=>e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)),a}function L(e,t){let a=Y(e,()=>e.createBuffer(),"Unable to create WebGLBuffer");return T(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,a)),T(e,()=>e.bufferData(e.ELEMENT_ARRAY_BUFFER,t,e.STATIC_DRAW)),a}function B(e){return Y(e,()=>e.createTexture(),"Unable to create WebGLTexture.")}function V(e,t){let a=(0,g.env)().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(e<=0||t<=0)throw Error(`Requested texture size [${e}x${t}] is invalid.`);if(e>a||t>a)throw Error(`Requested texture size [${e}x${t}] greater than WebGL maximum on this browser / GPU [${a}x${a}].`)}function W(e){return Y(e,()=>e.createFramebuffer(),"Unable to create WebGLFramebuffer.")}function U(e,t,a,n,r,i,o){let s=e.getAttribLocation(t,a);return -1!==s&&(T(e,()=>e.bindBuffer(e.ARRAY_BUFFER,n)),T(e,()=>e.vertexAttribPointer(s,r,e.FLOAT,!1,i,o)),T(e,()=>e.enableVertexAttribArray(s)),!0)}function G(e,t,a){Q(e,a),T(e,()=>e.activeTexture(e.TEXTURE0+a)),T(e,()=>e.bindTexture(e.TEXTURE_2D,t))}function M(e,t,a){return Y(e,()=>e.getUniformLocation(t,a),'uniform "'+a+'" not present in program.')}function z(e,t,a){return e.getUniformLocation(t,a)}function X(e,t,a,n){T(e,()=>G(e,t,n)),T(e,()=>e.uniform1i(a,n))}function H(e,t,a){T(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,a)),T(e,()=>e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0))}function j(e,t){T(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,t)),T(e,()=>e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,null,0))}function K(e){let t=e.checkFramebufferStatus(e.FRAMEBUFFER);if(t!==e.FRAMEBUFFER_COMPLETE)throw Error("Error binding framebuffer: "+q(e,t))}function q(e,t){switch(t){case e.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case e.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case e.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case e.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return`unknown error ${t}`}}function Y(e,t,a){let n=T(e,()=>t());if(null==n)throw Error(a);return n}function Q(e,t){let a=e.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,n=t+e.TEXTURE0;if(n<e.TEXTURE0||n>a){let e=`[gl.TEXTURE0, gl.TEXTURE${a}]`;throw Error(`textureUnit must be in ${e}.`)}}function Z(e,t=2){return v.util.sizeFromShape(e.slice(0,e.length-t))}function J(e){if(0===e.length)throw Error("Cannot get rows and columns of an empty shape array.");return[e.length>1?e[e.length-2]:1,e[e.length-1]]}function ee(e){let t=[1,1,1];return 0!==e.length&&(1!==e.length||1!==e[0])&&(t=[Z(e),...J(e)]),t}function et(e,t=!1){let a=(0,g.env)().getNumber("WEBGL_MAX_TEXTURE_SIZE"),n=(0,g.env)().getNumber("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE");n===1/0&&(0,g.env)().getBool("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE")&&(n=a/2),t&&(a*=2,n*=2,1===(e=e.map((t,a)=>a>=e.length-2?v.util.nearestLargerEven(e[a]):e[a])).length&&(e=[2,e[0]])),2!==e.length&&(e=v.util.squeezeShape(e).newShape);let r=v.util.sizeFromShape(e),i=null;e.length<=1&&r<=a?i=[1,r]:2===e.length&&e[0]<=a&&e[1]<=a?i=e:3===e.length&&e[0]*e[1]<=a&&e[2]<=a?i=[e[0]*e[1],e[2]]:3===e.length&&e[0]<=a&&e[1]*e[2]<=a?i=[e[0],e[1]*e[2]]:4===e.length&&e[0]*e[1]*e[2]<=a&&e[3]<=a?i=[e[0]*e[1]*e[2],e[3]]:4===e.length&&e[0]<=a&&e[1]*e[2]*e[3]<=a&&(i=[e[0],e[1]*e[2]*e[3]]);let o=null!=i&&Math.max(...i)>n&&Math.min(...i)<=(t?2:1)&&Math.min(...i)>0;if(null==i||o)if(t){let t=Z(e),a=2,n=2;e.length&&([a,n]=J(e)),r=a/2*t*(n/2),i=v.util.sizeToSquarishShape(r).map(e=>2*e)}else i=v.util.sizeToSquarishShape(r);return i}function ea(e,t){if(e=e.slice(-2),t=t.slice(-2),v.util.arraysEqual(e,t)||!e.length||!t.length||0===e[0]||0===e[1]||0===t[0]||0===t[1])return!0;if(e.length!==t.length){let a=e[e.length-1],n=t[t.length-1];if(a===n||a%2==0&&n%2==0&&(1===e[0]||1===t[0]))return!0}return e[1]===t[1]&&e[0]%2==0&&t[0]%2==0}function en(e){if(null==t){let a=$(e);t=a.getParameter(a.MAX_TEXTURE_SIZE)}return t}function er(e){if(null==a){let t=$(e);a=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,a)}function ei(e){if(0===e)return 0;let t=$(e);return eo(t,"EXT_disjoint_timer_query_webgl2")&&2===e?2:+!!eo(t,"EXT_disjoint_timer_query")}function eo(e,t){return null!=e.getExtension(t)}function es(e){try{let t=$(e);if(null!=t)return!0}catch(e){console.log("Error when getting WebGL context: ",e)}return!1}function el(e){if(0===e)return!1;let t=$(e);if(1===e){if(!eo(t,"OES_texture_float"))return!1}else if(!eo(t,"EXT_color_buffer_float"))return!1;return ed(t)}function eu(e){if(0===e)return!1;let t=$(e);if(1===e){if(!eo(t,"OES_texture_float")||!eo(t,"WEBGL_color_buffer_float"))return!1}else{if(eo(t,"EXT_color_buffer_float"))return ed(t);let e="EXT_color_buffer_half_float";if(eo(t,e)){var a;let n,r,i,o,s=t.getExtension(e);return n=R(a=t,s),r=a.createTexture(),a.bindTexture(a.TEXTURE_2D,r),a.texImage2D(a.TEXTURE_2D,0,n.internalFormatHalfFloat,1,1,0,n.textureFormatFloat,n.textureTypeHalfFloat,null),i=a.createFramebuffer(),a.bindFramebuffer(a.FRAMEBUFFER,i),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,r,0),o=a.checkFramebufferStatus(a.FRAMEBUFFER)===a.FRAMEBUFFER_COMPLETE,a.bindTexture(a.TEXTURE_2D,null),a.bindFramebuffer(a.FRAMEBUFFER,null),a.deleteTexture(r),a.deleteFramebuffer(i),o}return!1}return ed(t)}function ed(e){let t=R(e),a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,t.internalFormatFloat,1,1,0,t.textureFormatFloat,t.textureTypeFloat,null);let n=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0);let r=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(a),e.deleteFramebuffer(n),r}function ec(e){return 2===e&&null!=$(e).fenceSync}function ep(e,t){Array.isArray(e)||(e=[e]),e.forEach(e=>{null!=e&&v.util.assert("complex64"!==e.dtype,()=>`${t} does not support complex64 tensors in the WebGL backend.`)})}e.s(["assertNotComplex",0,ep,"bindCanvasToFramebuffer",0,function(e){T(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,null)),T(e,()=>e.viewport(0,0,e.canvas.width,e.canvas.height)),T(e,()=>e.scissor(0,0,e.canvas.width,e.canvas.height))},"bindColorTextureToFramebuffer",0,H,"bindTextureToProgramUniformSampler",0,X,"bindTextureUnit",0,G,"bindVertexBufferToProgramAttribute",0,U,"callAndCheck",0,T,"canBeRepresented",0,w,"createFragmentShader",0,k,"createFramebuffer",0,W,"createProgram",0,O,"createStaticIndexBuffer",0,L,"createStaticVertexBuffer",0,P,"createTexture",0,B,"createVertexShader",0,E,"getBatchDim",0,Z,"getExtensionOrThrow",0,N,"getFramebufferErrorMessage",0,q,"getMaxTexturesInShader",0,er,"getNumChannels",0,function(){return 2===(0,g.env)().getNumber("WEBGL_VERSION")?1:4},"getProgramUniformLocation",0,z,"getProgramUniformLocationOrThrow",0,M,"getRowsCols",0,J,"getShapeAs3D",0,ee,"getTextureShapeFromLogicalShape",0,et,"getWebGLDisjointQueryTimerVersion",0,ei,"getWebGLErrorMessage",0,S,"getWebGLMaxTextureSize",0,en,"hasExtension",0,eo,"isCapableOfRenderingToFloatTexture",0,el,"isDownloadFloatTextureEnabled",0,eu,"isReshapeFree",0,ea,"isWebGLFenceEnabled",0,ec,"isWebGLVersionEnabled",0,es,"linkProgram",0,F,"logShaderSourceAndInfoLog",0,A,"resetMaxTextureSize",0,function(){t=null},"resetMaxTexturesInShader",0,function(){a=null},"unbindColorTextureFromFramebuffer",0,j,"unbindTextureUnit",0,function(e,t){Q(e,t),T(e,()=>e.activeTexture(e.TEXTURE0+t)),T(e,()=>e.bindTexture(e.TEXTURE_2D,null))},"validateFramebuffer",0,K,"validateProgram",0,D,"validateTextureSize",0,V],56479);let eh=(0,g.env)();eh.registerFlag("HAS_WEBGL",()=>eh.getNumber("WEBGL_VERSION")>0),eh.registerFlag("WEBGL_VERSION",()=>es(2)?2:+!!es(1)),eh.registerFlag("WEBGL_CHECK_NUMERICAL_PROBLEMS",()=>!1),eh.registerFlag("WEBGL_BUFFER_SUPPORTED",()=>2===eh.get("WEBGL_VERSION")),eh.registerFlag("WEBGL_CPU_FORWARD",()=>!0),eh.registerFlag("WEBGL_FORCE_F16_TEXTURES",()=>!1),eh.registerFlag("WEBGL_PACK",()=>eh.getBool("HAS_WEBGL")),eh.registerFlag("WEBGL_PACK_NORMALIZATION",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_CLIP",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_DEPTHWISECONV",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_REDUCE",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_LAZILY_UNPACK",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_CONV_IM2COL",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_PACK_CONV2DTRANSPOSE",()=>eh.getBool("WEBGL_PACK")),eh.registerFlag("WEBGL_MAX_TEXTURE_SIZE",()=>en(eh.getNumber("WEBGL_VERSION"))),eh.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",()=>er(eh.getNumber("WEBGL_VERSION"))),eh.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",()=>{let e=eh.getNumber("WEBGL_VERSION");return 0===e?0:ei(e)}),eh.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",()=>eh.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&!m.isMobile()),eh.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",()=>el(eh.getNumber("WEBGL_VERSION"))),eh.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",()=>!eh.getBool("WEBGL_FORCE_F16_TEXTURES")&&eh.getBool("WEBGL_RENDER_FLOAT32_CAPABLE")),eh.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",()=>eu(eh.getNumber("WEBGL_VERSION"))),eh.registerFlag("WEBGL_FENCE_API_ENABLED",()=>ec(eh.getNumber("WEBGL_VERSION"))),eh.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",()=>4*!!eh.getBool("WEBGL_RENDER_FLOAT32_ENABLED")),eh.registerFlag("WEBGL_DELETE_TEXTURE_THRESHOLD",()=>-1,e=>{if("number"!=typeof e)throw Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be a number but got ${e}.`);if(e<0&&-1!==e)throw Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be -1 (indicating never delete) or at least 0, but got ${e}.`)}),eh.registerFlag("WEBGL_FLUSH_THRESHOLD",()=>m.isMobile()?1:-1,e=>{if("number"!=typeof e)throw Error(`WEBGL_FLUSH_THRESHOLD must be a number but got ${e}.`);if(e<0&&-1!==e)throw Error(`WEBGL_FLUSH_THRESHOLD must be -1 (indicating never manual flush) or at least 0, but got ${e}.`)}),eh.registerFlag("CPU_HANDOFF_SIZE_THRESHOLD",()=>128),eh.registerFlag("WEBGL_USE_SHAPES_UNIFORMS",()=>!1),eh.registerFlag("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e5),eh.registerFlag("TOPK_K_CPU_HANDOFF_THRESHOLD",()=>128),eh.registerFlag("WEBGL_EXP_CONV",()=>!1),eh.registerFlag("SOFTWARE_WEBGL_ENABLED",()=>eh.getBool("IS_TEST")),eh.registerFlag("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE",()=>1/0),eh.registerFlag("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE",()=>!1),eh.registerFlag("WEBGL2_ISNAN_CUSTOM",()=>!1),eh.registerFlag("ENGINE_COMPILE_ONLY",()=>!1);var ef=e.i(63027),ex=e.i(92452),em=e.i(37005),eg=e.i(16745);let ev="u">typeof requestAnimationFrame?requestAnimationFrame:"u">typeof setImmediate?setImmediate:e=>e();var eC=e.i(13009);function eb(){let e,t,a,n,r,i,o,s,l,u;return 2===(0,g.env)().getNumber("WEBGL_VERSION")?(e="#version 300 es",t="in",a="out",n="in",r="texture",i="outputColor",o="out vec4 outputColor;",s=(0,g.env)().getBool("WEBGL2_ISNAN_CUSTOM")?`
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `:"",l="",u=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(e="",t="attribute",a="varying",n="varying",r="texture2D",i="gl_FragColor",o="",s=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,l=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,u=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:e,attribute:t,varyingVs:a,varyingFs:n,texture2D:r,output:i,defineOutput:o,defineSpecialNaN:s,defineSpecialInf:l,defineRound:u}}function e$(e,t,a="index"){let n=v.util.computeStrides(t);return n.map((t,r)=>{let i=`int ${e[r]} = ${a} / ${t}`,o=r===n.length-1?`int ${e[r+1]} = ${a} - ${e[r]} * ${t}`:`index -= ${e[r]} * ${t}`;return`${i}; ${o};`}).join("")}function eI(e,t,a="index"){let n=v.util.computeStrides(t);return n.map((t,r)=>{let i=`int ${e[r]} = ${a} / outShapeStrides[${r}]`,o=r===n.length-1?`int ${e[r+1]} = ${a} - ${e[r]} * outShapeStrides[${r}]`:`index -= ${e[r]} * outShapeStrides[${r}]`;return`${i}; ${o};`}).join("")}function ey(e){let t=v.util.computeStrides(e).map(e=>e.toString());return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${t[0]} + coords.y * ${t[1]} + coords.z;
  }
`}function eR(){return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}let eT=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`,{getBroadcastDims:ew}=ef.backend_util,eS=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,eN=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,eE=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,ek=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function e_(){return`
    int getOutputCoords() {
      return 0;
    }
  `}function eA(e){return`offset${e}`}function eO(e){let t=e.name,a=v.util.sizeFromShape(e.shapeInfo.logicalShape);return a<2?`return ${t};`:`
    for (int i = 0; i < ${a}; i++) {
      if (i == index) {
        return ${t}[i];
      }
    }
  `}function eF(e){if(e<=1)return"int";if(2===e)return"ivec2";if(3===e)return"ivec3";if(4===e)return"ivec4";if(5===e)return"ivec5";else if(6===e)return"ivec6";else throw Error(`GPU for rank ${e} is not yet supported`)}function eD(e,t,a){let{newShape:n,keptDims:r}=v.util.squeezeShape(t),i=t.length,o=e&&3===i&&1===t[0],s=o?t.slice(1):n,l=!e&&i>1&&!v.util.arraysEqual(t,a)&&n.length<i||o,u=l?s:t;return{useSqueezeShape:l,uniformShape:u,keptDims:r}}function eP(e,t){let a=JSON.parse(JSON.stringify(e));return a.shapeInfo.logicalShape=t,a}function eL(e,t){return t.map(t=>e[t]).join(", ")}function eB(e,t,a){let n,r,i,o=[],s=[],l=null,u=null;for(let n of(u=e.getUniformLocation(a,"NAN",!1),1===(0,g.env)().getNumber("WEBGL_VERSION")&&(l=e.getUniformLocation(a,"INFINITY",!1)),t.variableNames)){let r={name:n,uniform:e.getUniformLocation(a,n,!1),offset:e.getUniformLocation(a,`offset${n}`,!1)};t.enableShapeUniforms&&(r.shape=e.getUniformLocation(a,`${n}Shape`,!1),r.texShape=e.getUniformLocation(a,`${n}TexShape`,!1)),o.push(r)}if(t.enableShapeUniforms&&(n=e.getUniformLocation(a,"outShape",!1),i=e.getUniformLocation(a,"outShapeStrides",!1),r=e.getUniformLocation(a,"outTexShape",!1)),t.customUniforms)for(let n of t.customUniforms)s.push(e.getUniformLocation(a,n.name,!1));return{variablesLocations:o,customUniformLocations:s,infLoc:l,nanLoc:u,outShapeLocation:n,outShapeStridesLocation:i,outTexShapeLocation:r}}function eV(e,t){if(e.length!==t.length)throw Error(`Binary was compiled with ${e.length} inputs, but was executed with ${t.length} inputs`);e.forEach((e,a)=>{let n=e.logicalShape,r=t[a],i=r.shape;if(!v.util.arraysEqual(n,i))throw Error(`Binary was compiled with different shapes than the current args. Shapes ${n} and ${i} must match`);if(e.isUniform&&r.isUniform)return;let o=e.texShape,s=r.isUniform?null:r.texData.texShape;if(!v.util.arraysEqual(o,s))throw Error(`Binary was compiled with different texture shapes than the current args. Shape ${o} and ${s} must match`)})}function eW(e){return(0,g.env)().getBool("WEBGL_USE_SHAPES_UNIFORMS")&&e<=4}class eU{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=l.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const t=eb();this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?eI(["r","c","d"],e):e$(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${t.output} = result;
      }
    `}}class eG{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=l.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const t=eb();this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?eI(["r","c","d"],e):e$(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${t.output} = result;
      }
    `}}class eM{constructor(e){this.variableNames=["A"],this.outTexUsage=u.DOWNLOAD;const t=eb();this.outputShape=e,this.userCode=`
      ${eT}

      void main() {
        float x = getAAtOutCoords();
        ${t.output} = encode_float(x);
      }
    `}}class ez{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=u.DOWNLOAD;const t=eb();this.outputShape=e,this.userCode=`
      ${eT}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${t.output} = encode_float(x);
      }
    `}}let eX={R:0,G:1,B:2,A:3};class eH{constructor(e,t=!1,a="RGBA"){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];const n=eb();this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length);let r="result";t&&(r="floor(result * 255. + 0.5)");let i="";for(let e=0;e<a.length;e++){const t=a[e];i+=`
          if(offset == ${e}) {
            result = values[${eX[t]}];
          }`}this.userCode=`
      ${this.enableShapeUniforms?eR():ey(e)}

      void main() {
        ivec3 coords = getOutputCoords();
        int flatIndex = getFlatIndex(coords);
        float result = 0.;
        int offset = imod(flatIndex, ${a.length});

        flatIndex = idiv(flatIndex, ${a.length}, 1.);

        int r = flatIndex / texShape[1];
        if (r < texShape[0]) {
          int c = imod(flatIndex, texShape[1]);
          vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
          vec4 values = ${n.texture2D}(A, uv);
          ${i}
        }
        ${n.output} = vec4(${r}, 0., 0., 0.);
      }
    `}}class ej{constructor(e,t=!1){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.customUniforms=[{name:"texShape",type:"ivec2"}];const a=eb();this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length);let n="",r="result";t&&(r="floor(result * 255. + 0.5)");for(let t=0;t<=1;t++)for(let r=0;r<=1;r++){const i=2*t+r;n+=`
          localCoords = coords;
          if(localCoords[2] + ${r} < ${this.enableShapeUniforms?"outShape[2]":`${e[2]}`}) {
          localCoords[2] += ${r};
          if (localCoords[1] + ${t} < ${this.enableShapeUniforms?"outShape[1]":`${e[1]}`}) {
            localCoords[1] += ${t};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${a.texture2D}(A, uv);

            if (offset == 0) {
              result[${i}] = values[0];
            } else if (offset == 1) {
              result[${i}] = values[1];
            } else if (offset == 2) {
              result[${i}] = values[2];
            } else {
              result[${i}] = values[3];
            }
          }
        }
        `}this.userCode=`
        ${this.enableShapeUniforms?eR():ey(e)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${n}

          ${a.output} = ${r};
        }
    `}}function eK(e){let t=eb();return E(e,`${t.version}
    precision highp float;
    ${t.attribute} vec3 clipSpacePos;
    ${t.attribute} vec2 uv;
    ${t.varyingVs} vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`)}function eq(e){return P(e,new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]))}function eY(e){return L(e,new Uint16Array([0,1,2,2,1,3]))}function eQ(e,t,a,n,r,i){V(t,a);let o=B(e),s=e.TEXTURE_2D;return T(e,()=>e.bindTexture(s,o)),T(e,()=>e.texParameteri(s,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE)),T(e,()=>e.texParameteri(s,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)),T(e,()=>e.texParameteri(s,e.TEXTURE_MIN_FILTER,e.NEAREST)),T(e,()=>e.texParameteri(s,e.TEXTURE_MAG_FILTER,e.NEAREST)),1===(0,g.env)().getNumber("WEBGL_VERSION")?T(e,()=>e.texImage2D(s,0,n,t,a,0,r,i,null)):T(e,()=>e.texStorage2D(s,1,n,t,a)),T(e,()=>e.bindTexture(e.TEXTURE_2D,null)),{texture:o,texShape:[a,t]}}function eZ(e){return e.internalFormatFloat}function eJ(e,t,a,n){let[r,i]=[a,t];return eQ(e,r,i,eZ(n),n.textureFormatFloat,e.FLOAT)}function e0(e){return e.internalFormatHalfFloat}function e1(e,t,a,n){let[r,i]=[a,t];return eQ(e,r,i,e0(n),n.textureFormatFloat,n.textureTypeHalfFloat)}function e2(e){return e.downloadTextureFormat}function e4(e,t,a,n){let[r,i]=[a,t];return eQ(e,r,i,e2(n),e.RGBA,e.UNSIGNED_BYTE)}function e3(e){return e.internalFormatPackedFloat}function e5(e,t,a,n){let[r,i]=y(t,a);return eQ(e,r,i,e3(n),e.RGBA,e.FLOAT)}function e6(e){return e.internalFormatPackedHalfFloat}function e8(e,t,a,n){let[r,i]=y(t,a);return eQ(e,r,i,e6(n),e.RGBA,n.textureTypeHalfFloat)}function e9(e,t,a){return T(e,()=>e.bindBuffer(e.ARRAY_BUFFER,a)),U(e,t,"clipSpacePos",a,3,20,0)&&U(e,t,"uv",a,2,20,12)}function e7(e,t,a,n,r,i){let o,s,l;T(e,()=>e.bindTexture(e.TEXTURE_2D,t)),r instanceof Uint8Array?(o=new Uint8Array(a*n*4),s=e.UNSIGNED_BYTE,l=e.RGBA):(o=new Float32Array(a*n*4),s=e.FLOAT,l=i.internalFormatPackedFloat),o.set(r),2===(0,g.env)().getNumber("WEBGL_VERSION")?T(e,()=>e.texSubImage2D(e.TEXTURE_2D,0,0,0,a,n,e.RGBA,s,o)):T(e,()=>e.texImage2D(e.TEXTURE_2D,0,l,a,n,0,e.RGBA,s,o)),T(e,()=>e.bindTexture(e.TEXTURE_2D,null))}function te(e,t,a){T(e,()=>e.bindTexture(e.TEXTURE_2D,t)),a.data instanceof Uint8Array?2===(0,g.env)().getNumber("WEBGL_VERSION")?T(e,()=>e.texSubImage2D(e.TEXTURE_2D,0,0,0,a.width,a.height,e.RGBA,e.UNSIGNED_BYTE,a.data)):T(e,()=>e.texImage2D(e.TEXTURE_2D,0,e.RGBA,a.width,a.height,0,e.RGBA,e.UNSIGNED_BYTE,a.data)):2===(0,g.env)().getNumber("WEBGL_VERSION")?T(e,()=>e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,a)):T(e,()=>e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,a)),T(e,()=>e.bindTexture(e.TEXTURE_2D,null))}function tt(e,t,a,n){let r=e.createBuffer();T(e,()=>e.bindBuffer(e.PIXEL_PACK_BUFFER,r));let i=16*t*a;return T(e,()=>e.bufferData(e.PIXEL_PACK_BUFFER,i,e.STREAM_READ)),T(e,()=>e.readPixels(0,0,a,t,e.RGBA,e.FLOAT,0)),T(e,()=>e.bindBuffer(e.PIXEL_PACK_BUFFER,null)),r}function ta(e,t,a){let n=new Float32Array(a);return e.bindBuffer(e.PIXEL_PACK_BUFFER,t),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,n),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),n}function tn(e,t,a,n){let[r,i]=[a,t],o=new Uint8Array(t*a*4);return T(e,()=>e.readPixels(0,0,r,i,n.downloadTextureFormat,e.UNSIGNED_BYTE,o)),new Float32Array(o.buffer)}function tr(e,t,a,n,r,i,o,s){let l=new Float32Array(function(e,t){let[a,n]=y(e,t);return a*n*4}(i,o));return e.bindBuffer(e.PIXEL_PACK_BUFFER,t),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,l),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),l}function ti(e,t,a){let n=new Float32Array(t*a*4);return T(e,()=>e.readPixels(0,0,a,t,e.RGBA,e.FLOAT,n)),n}e.s(["bindVertexProgramAttributeStreams",0,e9,"createBufferFromOutputTexture",0,tt,"createFloat16MatrixTexture",0,e1,"createFloat16PackedMatrixTexture",0,e8,"createFloat32MatrixTexture",0,eJ,"createIndexBuffer",0,eY,"createPackedMatrixTexture",0,e5,"createUnsignedBytesMatrixTexture",0,e4,"createVertexBuffer",0,eq,"createVertexShader",0,eK,"downloadByteEncodedFloatMatrixFromOutputTexture",0,tn,"downloadFloat32MatrixFromBuffer",0,ta,"downloadMatrixFromPackedOutputTexture",0,ti,"downloadPackedMatrixFromBuffer",0,tr,"getInternalFormatForFloat16MatrixTexture",0,e0,"getInternalFormatForFloat16PackedMatrixTexture",0,e6,"getInternalFormatForFloat32MatrixTexture",0,eZ,"getInternalFormatForPackedMatrixTexture",0,e3,"getInternalFormatForUnsignedBytesMatrixTexture",0,e2,"uploadDenseMatrixToTexture",0,e7,"uploadPixelDataToTexture",0,te],98600);class to{constructor(e){this.outputTexture=null,this.program=null,this.disposed=!1,this.itemsToPoll=[];const t=(0,g.env)().getNumber("WEBGL_VERSION");if(null!=e?(this.gl=e,!function(e,t){C[e]=t}(t,e)):this.gl=$(t),e=this.gl,2===(0,g.env)().getNumber("WEBGL_VERSION")){const t=e;this.createVertexArray=()=>T(t,()=>t.createVertexArray()),this.bindVertexArray=e=>T(t,()=>t.bindVertexArray(e)),this.deleteVertexArray=e=>T(t,()=>t.deleteVertexArray(e)),this.getVertexArray=()=>T(t,()=>t.getParameter(t.VERTEX_ARRAY_BINDING))}else if(null!=e){const t=e.getExtension("OES_vertex_array_object");if(null==t)throw Error("All WebGL1 implementations are expected to offer OES_vertex_array_object.");this.createVertexArray=()=>T(e,()=>t.createVertexArrayOES()),this.bindVertexArray=a=>T(e,()=>t.bindVertexArrayOES(a)),this.deleteVertexArray=a=>T(e,()=>t.deleteVertexArrayOES(a)),this.getVertexArray=()=>T(e,()=>e.getParameter(t.VERTEX_ARRAY_BINDING_OES))}let a="WEBGL_color_buffer_float";const n="EXT_color_buffer_half_float";if(this.parallelCompilationExtension=this.gl.getExtension("KHR_parallel_shader_compile"),1===(0,g.env)().getNumber("WEBGL_VERSION")){const e="OES_texture_half_float";if(this.textureFloatExtension=N(this.gl,"OES_texture_float"),eo(this.gl,e))this.textureHalfFloatExtension=N(this.gl,e);else if((0,g.env)().get("WEBGL_FORCE_F16_TEXTURES"))throw Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(a),eo(this.gl,n))this.colorBufferHalfFloatExtension=N(this.gl,n);else if((0,g.env)().get("WEBGL_FORCE_F16_TEXTURES"))throw Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(a="EXT_color_buffer_float",eo(this.gl,a))this.colorBufferFloatExtension=this.gl.getExtension(a);else if(eo(this.gl,n))this.colorBufferHalfFloatExtension=this.gl.getExtension(n);else throw Error("GL context does not support color renderable floats");this.vertexBuffer=eq(this.gl),this.indexBuffer=eY(this.gl),this.framebuffer=W(this.gl),this.textureConfig=R(this.gl,this.textureHalfFloatExtension)}get debug(){return(0,g.env)().getBool("DEBUG")}dispose(){if(this.disposed)return;null!=this.program&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),null!=this.outputTexture&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");let e=this.gl;T(e,()=>e.finish()),T(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,null)),T(e,()=>e.deleteFramebuffer(this.framebuffer)),T(e,()=>e.bindBuffer(e.ARRAY_BUFFER,null)),T(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)),T(e,()=>e.deleteBuffer(this.indexBuffer)),this.disposed=!0}createFloat32MatrixTexture(e,t){return this.throwIfDisposed(),eJ(this.gl,e,t,this.textureConfig)}createFloat16MatrixTexture(e,t){return this.throwIfDisposed(),e1(this.gl,e,t,this.textureConfig)}createUnsignedBytesMatrixTexture(e,t){return this.throwIfDisposed(),e4(this.gl,e,t,this.textureConfig)}uploadPixelDataToTexture(e,t){this.throwIfDisposed(),te(this.gl,e,t)}uploadDenseMatrixToTexture(e,t,a,n){this.throwIfDisposed(),e7(this.gl,e,t,a,n,this.textureConfig)}createFloat16PackedMatrixTexture(e,t){return this.throwIfDisposed(),e8(this.gl,e,t,this.textureConfig)}createPackedMatrixTexture(e,t){return this.throwIfDisposed(),e5(this.gl,e,t,this.textureConfig)}deleteMatrixTexture(e){this.throwIfDisposed(),this.outputTexture===e&&(j(this.gl,this.framebuffer),this.outputTexture=null),T(this.gl,()=>this.gl.deleteTexture(e))}downloadByteEncodedFloatMatrixFromOutputTexture(e,t,a){return this.downloadMatrixDriver(e,()=>tn(this.gl,t,a,this.textureConfig))}downloadPackedMatrixFromBuffer(e,t,a,n,r,i){return tr(this.gl,e,t,a,n,r,i,this.textureConfig)}downloadFloat32MatrixFromBuffer(e,t){return ta(this.gl,e,t)}createBufferFromTexture(e,t,a){this.bindTextureToFrameBuffer(e);let n=tt(this.gl,t,a,this.textureConfig);return this.unbindTextureToFrameBuffer(),n}createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,a;if((0,g.env)().getBool("WEBGL_FENCE_API_ENABLED")){let n=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);e.flush(),a=()=>{let t=e.clientWaitSync(n,0,0);return t===e.ALREADY_SIGNALED||t===e.CONDITION_SATISFIED},t=n}else(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(t=this.beginQuery(),this.endQuery(),a=()=>this.isQueryAvailable(t,(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))):a=()=>!0;return{query:t,isFencePassed:a}}downloadMatrixFromPackedTexture(e,t,a){return this.downloadMatrixDriver(e,()=>ti(this.gl,t,a))}createProgram(e){this.throwIfDisposed();let t=this.gl;null==this.vertexShader&&(this.vertexShader=eK(t));let a=O(t);T(t,()=>t.attachShader(a,this.vertexShader)),T(t,()=>t.attachShader(a,e)),F(t,a);let n=Object.assign(a,{vao:this.createVertexArray()});return this.debug&&D(t,n),n}buildVao(e){this.setProgram(e),this.bindVertexArray(e.vao);let t=this.gl;T(t,()=>t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)),e9(t,e,this.vertexBuffer)}deleteProgram(e){this.throwIfDisposed(),e===this.program&&(this.program=null),null!=e&&(T(this.gl,()=>this.gl.deleteProgram(e)),this.deleteVertexArray(e.vao))}setProgram(e){this.throwIfDisposed(),this.program=e,null!=this.program&&this.debug&&D(this.gl,this.program),T(this.gl,()=>this.gl.useProgram(e))}getUniformLocation(e,t,a=!0){return(this.throwIfDisposed(),a)?M(this.gl,e,t):z(this.gl,e,t)}getAttributeLocation(e,t){return this.throwIfDisposed(),T(this.gl,()=>this.gl.getAttribLocation(e,t))}getUniformLocationNoThrow(e,t){return this.throwIfDisposed(),this.gl.getUniformLocation(e,t)}setInputMatrixTexture(e,t,a){this.throwIfDisposed(),this.throwIfNoProgram(),X(this.gl,e,t,a)}setOutputMatrixTexture(e,t,a){this.setOutputMatrixTextureDriver(e,a,t)}setOutputPackedMatrixTexture(e,t,a){this.throwIfDisposed();let[n,r]=y(t,a);this.setOutputMatrixTextureDriver(e,n,r)}setOutputMatrixWriteRegion(e,t,a,n){this.setOutputMatrixWriteRegionDriver(a,e,n,t)}setOutputPackedMatrixWriteRegion(e,t,a,n){throw Error("setOutputPackedMatrixWriteRegion not implemented.")}debugValidate(){null!=this.program&&D(this.gl,this.program),K(this.gl)}executeProgram(){this.throwIfDisposed(),this.throwIfNoProgram();let e=this.gl;this.debug&&(console.assert(this.getVertexArray()===this.program.vao,"VAO changed between setProgram and executeProgram!"),this.debugValidate()),T(e,()=>e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0))}blockUntilAllProgramsCompleted(){this.throwIfDisposed(),T(this.gl,()=>this.gl.finish())}getQueryTimerExtension(){return null==this.disjointQueryTimerExtension&&(this.disjointQueryTimerExtension=N(this.gl,2===(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension}getQueryTimerExtensionWebGL2(){return this.getQueryTimerExtension()}getQueryTimerExtensionWebGL1(){return this.getQueryTimerExtension()}beginQuery(){if(2===(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")){let e=this.gl,t=this.getQueryTimerExtensionWebGL2(),a=e.createQuery();return e.beginQuery(t.TIME_ELAPSED_EXT,a),a}let e=this.getQueryTimerExtensionWebGL1(),t=e.createQueryEXT();return e.beginQueryEXT(e.TIME_ELAPSED_EXT,t),t}endQuery(){if(2===(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")){let e=this.gl,t=this.getQueryTimerExtensionWebGL2();e.endQuery(t.TIME_ELAPSED_EXT);return}let e=this.getQueryTimerExtensionWebGL1();e.endQueryEXT(e.TIME_ELAPSED_EXT)}async waitForQueryAndGetTime(e){return await v.util.repeatedTry(()=>this.disposed||this.isQueryAvailable(e,(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))),this.getQueryTime(e,(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}getQueryTime(e,t){if(0===t)return null;if(2===t){let t=this.gl;return t.getQueryParameter(e,t.QUERY_RESULT)/1e6}{let t=this.getQueryTimerExtensionWebGL1();return t.getQueryObjectEXT(e,t.QUERY_RESULT_EXT)/1e6}}isQueryAvailable(e,t){if(0===t)return!0;if(2===t){let t=this.gl,a=this.getQueryTimerExtensionWebGL2(),n=t.getQueryParameter(e,t.QUERY_RESULT_AVAILABLE);return null==this.disjoint&&(this.disjoint=this.gl.getParameter(a.GPU_DISJOINT_EXT)),n&&!this.disjoint}{let t=this.getQueryTimerExtensionWebGL1(),a=t.getQueryObjectEXT(e,t.QUERY_RESULT_AVAILABLE_EXT);return null==this.disjoint&&(this.disjoint=this.gl.getParameter(t.GPU_DISJOINT_EXT)),a&&!this.disjoint}}pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){let e=function(e){let t=0;for(;t<e.length&&e[t]();++t);return t-1}(this.itemsToPoll.map(e=>e.isDoneFn));for(let t=0;t<=e;++t){let{resolveFn:e}=this.itemsToPoll[t];e()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}addItemToPoll(e,t){let a;this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),this.itemsToPoll.length>1||("setTimeoutCustom"in(0,g.env)().platform&&(a=(0,g.env)().platform.setTimeoutCustom.bind((0,g.env)().platform)),v.util.repeatedTry(()=>(this.pollItems(),0===this.itemsToPoll.length),()=>0,null,a))}bindTextureToFrameBuffer(e){this.throwIfDisposed(),H(this.gl,e,this.framebuffer),this.debug&&K(this.gl)}unbindTextureToFrameBuffer(){null!=this.outputTexture?(H(this.gl,this.outputTexture,this.framebuffer),this.debug&&K(this.gl)):j(this.gl,this.framebuffer)}downloadMatrixDriver(e,t){this.bindTextureToFrameBuffer(e);let a=t();return this.unbindTextureToFrameBuffer(),a}setOutputMatrixTextureDriver(e,t,a){this.throwIfDisposed();let n=this.gl;H(n,e,this.framebuffer),this.debug&&K(n),this.outputTexture=e,T(n,()=>n.viewport(0,0,t,a)),T(n,()=>n.scissor(0,0,t,a))}setOutputMatrixWriteRegionDriver(e,t,a,n){this.throwIfDisposed(),T(this.gl,()=>this.gl.scissor(e,t,a,n))}throwIfDisposed(){if(this.disposed)throw Error("Attempted to use disposed GPGPUContext.")}throwIfNoProgram(){if(null==this.program)throw Error("No GPU program is currently set.")}}let{addImpl:ts,bincountImpl:tl,bincountReduceImpl:tu,bitwiseAndImpl:td,castImpl:tc,ceilImpl:tp,concatImpl:th,equalImpl:tf,expImpl:tx,expm1Impl:tm,floorImpl:tg,gatherNdImpl:tv,gatherV2Impl:tC,greaterImpl:tb,greaterEqualImpl:t$,lessImpl:tI,lessEqualImpl:ty,linSpaceImpl:tR,logImpl:tT,maxImpl:tw,maximumImpl:tS,minimumImpl:tN,multiplyImpl:tE,negImpl:tk,notEqualImpl:t_,prodImpl:tA,raggedGatherImpl:tO,raggedRangeImpl:tF,raggedTensorToTensorImpl:tD,rangeImpl:tP,rsqrtImpl:tL,scatterImpl:tB,sigmoidImpl:tV,simpleAbsImpl:tW,sliceImpl:tU,sparseFillEmptyRowsImpl:tG,sparseReshapeImpl:tM,sparseSegmentReductionImpl:tz,sqrtImpl:tX,staticRegexReplaceImpl:tH,stridedSliceImpl:tj,stringNGramsImpl:tK,stringSplitImpl:tq,stringToHashBucketFastImpl:tY,subImpl:tQ,tileImpl:tZ,topKImpl:tJ,transposeImpl:t0,uniqueImpl:t1}=e.i(47816);function t2(e,t){return["x","y","z","w","u","v"].slice(0,t).map(t=>`${e}.${t}`)}function t4(e,t){return 1===t?[e]:t2(e,t)}class t3{constructor(e){if(this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.enableShapeUniforms=eW(this.outputShape.length),0===this.rank)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{const e=t4("rc",this.rank),t=eF(this.rank),a=this.getOutOfBoundsCondition(e),n=this.getSetup(e),r=this.getOutput(e);this.userCode=`
        void main() {
          ${t} rc = getOutputCoords();

          if(${a}) {
            setOutput(vec4(0));
          } else {
            ${n}

            setOutput(vec4(${r}));
          }
        }
      `}}getSourceCoordsArr(e){let t=[];for(let a=0;a<=1;a++)for(let n=0;n<=1;n++){let r=`${0===a?"r":"rp1"}, ${0===n?"c":"cp1"}`;for(let t=2;t<this.rank;t++)r=`${e[e.length-1-t]},`+r;t.push(r)}return t}getOutOfBoundsCondition(e){if(1===this.rank)return`rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let t="";for(let a=this.rank-2;a<this.rank;a++)t+=`${e[a]} >= ${this.enableShapeUniforms?`outShape[${a}]`:this.outputShape[a]}`,a<this.rank-1&&(t+="||");return t}getSetup(e){if(1===this.rank)return"";let t=e.slice(-2),a=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],n=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return`
      int r = ${t[0]};
      int c = ${t[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${a};
      bool rEdge = rp1 >= ${n};
    `}getOutput(e){let t=this.getSourceCoordsArr(e);if(1===this.rank){let e=this.enableShapeUniforms?"outShape":this.outputShape[0];return`getA(rc), (rc + 1 >= ${e} ? 0. : getA(rc + 1)), 0, 0`}return`getA(${t[0]}),
            cEdge ? 0. : getA(${t[1]}),
            rEdge ? 0. : getA(${t[2]}),
            rEdge || cEdge ? 0. : getA(${t[3]})`}}class t5{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length);let a="";for(let e=0;e<4;e++){let t="thisRC = rc;";e%2==1&&(t+="thisRC.z += 1;"),e>1&&(t+="thisRC.y += 1;"),a+=`
        ${t}
        ${e>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${e}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${e>0?"}":""}
      `}this.userCode=`
      ${function(e,t){let a=t?function(e,t,a="index"){let n=function(e,t){let a=e.length,n=e.map(e=>`${t}[${e}]`),r=Array(a-1);r[a-2]=n[a-1];for(let e=a-3;e>=0;--e)r[e]=`(${r[e+1]} * ${n[e+1]})`;return r}(e.map((e,t)=>t),t);return n.map((t,r)=>{let i=`int ${e[r]} = ${a} / ${n[r]}`,o=r===n.length-1?`int ${e[r+1]} = ${a} - ${e[r]} * ${n[r]}`:`index -= ${e[r]} * ${n[r]}`;return`${i}; ${o};`}).join("")}(["r","c","d"],"inputShape"):e$(["r","c","d"],e);return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${a}
      return ivec3(r, c, d);
    }
  `}(t,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?eR():ey(e)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":e[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":e[2]};

        ${a}

        setOutput(result);
      }
    `}}class t6{constructor(e){this.gpgpu=e,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0,this.freeTextures={},this.usedTextures={},this.logEnabled=!1}acquireTexture(e,t,a){let n,r=t9(t,a),i=t7(e,r,a);i in this.freeTextures||(this.freeTextures[i]=[]),i in this.usedTextures||(this.usedTextures[i]=[]);let o=t8(e,r,this.gpgpu.gl,this.gpgpu.textureConfig,a);if(this.freeTextures[i].length>0){this.numFreeTextures--,this.numUsedTextures++,this._numBytesFree-=o,this.log();let e=this.freeTextures[i].pop();return this.usedTextures[i].push(e),e}return r===d.PACKED_2X2_FLOAT32?n=this.gpgpu.createPackedMatrixTexture(e[0],e[1]):r===d.PACKED_2X2_FLOAT16?n=this.gpgpu.createFloat16PackedMatrixTexture(e[0],e[1]):r===d.UNPACKED_FLOAT32?n=this.gpgpu.createFloat32MatrixTexture(e[0],e[1]):r===d.UNPACKED_FLOAT16?n=this.gpgpu.createFloat16MatrixTexture(e[0],e[1]):r===d.PACKED_4X1_UNSIGNED_BYTE&&(n=this.gpgpu.createUnsignedBytesMatrixTexture(e[0],e[1])),this.usedTextures[i].push(n),this.numUsedTextures++,this._numBytesAllocated+=o,this.log(),n}releaseTexture(e,t,a,n){if(null==this.freeTextures)return;let r=t9(a,n),i=t7(t,r,n);i in this.freeTextures||(this.freeTextures[i]=[]);let o=t8(t,r,this.gpgpu.gl,this.gpgpu.textureConfig,n),s=(0,g.env)().getNumber("WEBGL_DELETE_TEXTURE_THRESHOLD");-1!==s&&this._numBytesAllocated>s?(this.gpgpu.deleteMatrixTexture(e.texture),this._numBytesAllocated-=o):(this.freeTextures[i].push(e),this.numFreeTextures++,this._numBytesFree+=o),this.numUsedTextures--;let l=this.usedTextures[i],u=l&&l.indexOf(e);if(null==u||u<0)throw Error("Cannot release a texture that was never provided by this texture manager");l[u]=l[l.length-1],l.pop(),this.log()}log(){if(!this.logEnabled)return;let e=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",`${this.numFreeTextures} / ${this.numUsedTextures}`,`(${e})`);let t=this._numBytesFree/this._numBytesAllocated;console.log(`Bytes allocated: ${this._numBytesAllocated}`),console.log(`Bytes unused: ${this._numBytesFree} (${Math.round(100*t)}%)`)}get numBytesAllocated(){return this._numBytesAllocated}get numBytesFree(){return this._numBytesFree}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){if(null!=this.freeTextures){for(let e in this.freeTextures)this.freeTextures[e].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture)});for(let e in this.usedTextures)this.usedTextures[e].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture)});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0}}}function t8(e,t,a,n,r){let i,o=function(e,t){switch(e){case d.PACKED_2X2_FLOAT32:return e3(t);case d.PACKED_2X2_FLOAT16:return e6(t);case d.UNPACKED_FLOAT32:return eZ(t);case d.UNPACKED_FLOAT16:return e0(t);case d.PACKED_4X1_UNSIGNED_BYTE:return e2(t);default:throw Error(`Unknown physical texture type ${e}`)}}(t,n);if(r){let[t,a]=y(e[0],e[1]);i=t*a}else{var s;let[t,a]=(s=e[0],[e[1],s]);i=t*a}return i*function(e,t){if(t===e.R32F)return 4;if(t===e.R16F)return 2;if(t===e.RGBA32F)return 16;if(t===e.RGBA)return 16;if(t===e.RGBA16F)return 8;else if(t===e.RGBA8)return 4;throw Error(`Unknown internal format ${t}`)}(a,o)}function t9(e,t){if(e===u.UPLOAD)return d.PACKED_2X2_FLOAT32;if(e===u.RENDER||null==e)return(0,g.env)().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?t?d.PACKED_2X2_FLOAT32:d.UNPACKED_FLOAT32:t?d.PACKED_2X2_FLOAT16:d.UNPACKED_FLOAT16;if(e===u.DOWNLOAD||e===u.PIXELS)return d.PACKED_4X1_UNSIGNED_BYTE;throw Error(`Unknown logical texture type ${e}`)}function t7(e,t,a){return`${e[0]}_${e[1]}_${t}_${a}`}class ae{constructor(e,t){this.variableNames=["A"],this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${t}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `}}let at="if (isnan(x)) return x;",aa="return abs(x);",an=at+`
  return (x < 0.0) ? 0.0 : x;
`,ar=at+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,ai="return x;",ao=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,as=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,al=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;class au{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length),this.userCode=`
      vec4 unaryOperation(vec4 x) {
        ${t}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `}}class ad{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length);const t=e.length,a=t4("rc",t),n=eF(t),r=function(e,t){if(1===e)return"rc";let a="";for(let n=0;n<e;n++)a+=t[n],n<e-1&&(a+=",");return a}(t,a),i=a.slice(-2),o=t<=1?"rc":`vec2(${i.join(",")})`;this.userCode=`
      void main() {
        ${n} rc = getOutputCoords();
        vec4 packedInput = getA(${r});

        setOutput(getChannel(packedInput, ${o}));
      }
    `}}let ac=eg.kernel_impls.whereImpl,ap={},ah=(0,g.env)().getNumber("CPU_HANDOFF_SIZE_THRESHOLD");class af extends em.KernelBackend{nextDataId(){return af.nextDataId++}constructor(e){let t;if(super(),this.pendingRead=new WeakMap,this.pendingDisposal=new WeakSet,this.dataRefCount=new WeakMap,this.numBytesInGPU=0,this.uploadWaitMs=0,this.downloadWaitMs=0,this.lastGlFlushTime=0,this.warnedAboutMemory=!1,this.pendingDeletes=0,this.disposed=!1,!(0,g.env)().getBool("HAS_WEBGL"))throw Error("WebGL is not supported on this device");null!=e?(t=e instanceof to?e:new to($((0,g.env)().getNumber("WEBGL_VERSION"),e)),this.binaryCache={},this.gpgpuCreatedLocally=!1):(t=new to($((0,g.env)().getNumber("WEBGL_VERSION"))),this.binaryCache=function(e){return e in ap||(ap[e]={}),ap[e]}((0,g.env)().getNumber("WEBGL_VERSION")),this.gpgpuCreatedLocally=!0),this.gpgpu=t,this.canvas=this.gpgpu.gl.canvas,this.textureManager=new t6(this.gpgpu),this.numMBBeforeWarning=null==(0,g.env)().global.screen?1024:(0,g.env)().global.screen.height*(0,g.env)().global.screen.width*window.devicePixelRatio*600/1024/1024,this.texData=new em.DataStorage(this,(0,x.engine)())}numDataIds(){return this.texData.numDataIds()-this.pendingDeletes}writeTexture(e,t,a,n,r,i){let o=this.makeTensorInfo(t,a),s=this.texData.get(o.dataId);s.isPacked=!1,s.texture={texture:e,texShape:[n,r]},s.texShape=[n,r];let l=new eH(ee(t),!1,i),u=this.runWebGLProgram(l,[o],a,[[n,r]]);return u.shape=t,s.texture=null,this.disposeIntermediateTensorInfo(o),u.dataId}write(e,t,a){if(((0,g.env)().getBool("WEBGL_CHECK_NUMERICAL_PROBLEMS")||(0,g.env)().getBool("DEBUG"))&&this.checkNumericalProblems(e),"complex64"===a&&null!=e)throw Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");let n={id:this.nextDataId()};return this.texData.set(n,{shape:t,dtype:a,values:e,usage:u.UPLOAD,refCount:1}),n}refCount(e){return this.texData.has(e)?this.texData.get(e).refCount:0}incRef(e){let t=this.texData.get(e);t.refCount++}decRef(e){if(this.texData.has(e)){let t=this.texData.get(e);t.refCount--}}move(e,t,a,n,r){if((0,g.env)().getBool("DEBUG")&&this.checkNumericalProblems(t),"complex64"===n)throw Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:a,dtype:n,values:t,usage:u.UPLOAD,refCount:r})}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId)}readSync(e){let t,a,{values:n,dtype:r,complexTensorInfos:i,slice:o,shape:s,isPacked:l}=this.texData.get(e);if(null!=o){let t;t=l?new au(s,ai):new ae(s,ai);let a=this.runWebGLProgram(t,[{dataId:e,shape:s,dtype:r}],r),n=this.readSync(a.dataId);return this.disposeIntermediateTensorInfo(a),n}if(null!=n)return this.convertAndCacheOnCPU(e);if("string"===r)return n;let u=null!=this.activeTimers;if(u&&(t=v.util.now()),"complex64"===r){let e=this.readSync(i.real.dataId),t=this.readSync(i.imag.dataId);a=ef.backend_util.mergeRealAndImagArrays(e,t)}else a=this.getValuesFromTexture(e);return u&&(this.downloadWaitMs+=v.util.now()-t),this.convertAndCacheOnCPU(e,a)}async read(e){let t,a;if(this.pendingRead.has(e)){let t=this.pendingRead.get(e);return new Promise(e=>t.push(e))}let{values:n,shape:r,slice:i,dtype:o,complexTensorInfos:s,isPacked:l}=this.texData.get(e);if(null!=i){let t;t=l?new au(r,ai):new ae(r,ai);let a=this.runWebGLProgram(t,[{dataId:e,shape:r,dtype:o}],o),n=this.read(a.dataId);return this.disposeIntermediateTensorInfo(a),n}if(null!=n)return this.convertAndCacheOnCPU(e);if((0,g.env)().getBool("DEBUG")&&!(0,g.env)().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&2===(0,g.env)().getNumber("WEBGL_VERSION"))throw Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");let u=null;if("complex64"!==o&&(0,g.env)().get("WEBGL_BUFFER_SUPPORTED")){t=this.decode(e);let a=this.texData.get(t.dataId);u=this.gpgpu.createBufferFromTexture(a.texture.texture,...I(r))}if(this.pendingRead.set(e,[]),"complex64"!==o&&await this.gpgpu.createAndWaitForFence(),"complex64"===o){let e=await Promise.all([this.read(s.real.dataId),this.read(s.imag.dataId)]),t=e[0],n=e[1];a=ef.backend_util.mergeRealAndImagArrays(t,n)}else if(null==u)a=this.getValuesFromTexture(e);else{let e=v.util.sizeFromShape(r);a=this.gpgpu.downloadFloat32MatrixFromBuffer(u,e)}if(null!=t&&this.disposeIntermediateTensorInfo(t),null!=u){let e=this.gpgpu.gl;T(e,()=>e.deleteBuffer(u))}let d=this.convertAndCacheOnCPU(e,a),c=this.pendingRead.get(e);return this.pendingRead.delete(e),c.forEach(e=>e(d)),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e)&&(0,x.engine)().removeDataId(e,this),this.pendingDeletes--),d}readToGPU(e,t={}){let{values:a,shape:n,slice:r,dtype:i,isPacked:o,texture:s}=this.texData.get(e);if("complex64"===i)throw Error("Does not support reading texture for complex64 dtype.");if(null!=r){let a;a=o?new au(n,ai):new ae(n,ai);let r=this.runWebGLProgram(a,[{dataId:e,shape:n,dtype:i}],i),s=this.readToGPU(r,t);return this.disposeIntermediateTensorInfo(r),s}if(null==s)if(null!=a)throw Error("Data is not on GPU but on CPU.");else throw Error("There is no data on GPU or CPU.");let l=this.decode(e,t.customTexShape);return Object.assign({tensorRef:(0,x.engine)().makeTensorFromTensorInfo(l)},this.texData.get(l.dataId).texture)}bufferSync(e){let t=this.readSync(e.dataId);if("string"===e.dtype)try{let a=t.map(e=>v.util.decodeString(e));return(0,ex.buffer)(e.shape,e.dtype,a)}catch(e){throw Error("Failed to decode encoded string bytes into utf-8")}return(0,ex.buffer)(e.shape,e.dtype,t)}checkNumericalProblems(e){if(null!=e)for(let t=0;t<e.length;t++){let a=e[t];if(!w(a)){if((0,g.env)().getBool("WEBGL_RENDER_FLOAT32_CAPABLE"))throw Error(`The value ${a} cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'`);throw Error(`The value ${a} cannot be represented on this device.`)}}}getValuesFromTexture(e){let{shape:t,dtype:a,isPacked:n}=this.texData.get(e),r=v.util.sizeFromShape(t);if((0,g.env)().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){let a=this.decode(e),n=this.texData.get(a.dataId),i=this.gpgpu.downloadMatrixFromPackedTexture(n.texture.texture,...I(t)).subarray(0,r);return this.disposeIntermediateTensorInfo(a),i}let i=(0,g.env)().getBool("WEBGL_PACK")&&!0===n,o=i?ee(t):t,s=i?new ez(o):new eM(o),l=this.runWebGLProgram(s,[{shape:o,dtype:a,dataId:e}],"float32"),u=this.texData.get(l.dataId),d=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(u.texture.texture,u.texShape[0],u.texShape[1]).subarray(0,r);return this.disposeIntermediateTensorInfo(l),d}timerAvailable(){return(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0}time(e){let t=this.activeTimers,a=[],n=!1;null==this.programTimersStack?(this.programTimersStack=a,n=!0):this.activeTimers.push(a),this.activeTimers=a,e();let r=v.util.flatten(this.activeTimers.map(e=>e.query)).filter(e=>null!=e),i=v.util.flatten(this.activeTimers.map(e=>e.name)).filter(e=>null!=e);this.activeTimers=t,n&&(this.programTimersStack=null);let o={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null};return(async()=>{if((0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0){let e=await Promise.all(r);o.kernelMs=v.util.sum(e),o.getExtraProfileInfo=()=>e.map((e,t)=>({name:i[t],ms:e})).map(e=>`${e.name}: ${e.ms}`).join(", ")}else o.kernelMs={error:"WebGL query timers are not supported in this environment."};return this.uploadWaitMs=0,this.downloadWaitMs=0,o})()}memory(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU,numBytesInGPUAllocated:this.textureManager.numBytesAllocated,numBytesInGPUFree:this.textureManager.numBytesFree}}startTimer(){return(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:v.util.now(),endMs:null}}endTimer(e){return(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.endQuery():e.endMs=v.util.now(),e}async getQueryTime(e){return(0,g.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.waitForQueryAndGetTime(e):e.endMs-e.startMs}disposeData(e,t=!1){if(this.pendingDisposal.has(e))return!1;if(!this.texData.has(e))return!0;if(t?this.texData.get(e).refCount=0:this.texData.get(e).refCount--,!t&&this.texData.get(e).refCount>0)return!1;if(this.pendingRead.has(e))return this.pendingDisposal.add(e),this.pendingDeletes++,!1;this.releaseGPUData(e);let{complexTensorInfos:a}=this.texData.get(e);return null!=a&&(this.disposeData(a.real.dataId,t),this.disposeData(a.imag.dataId,t)),this.texData.delete(e),!0}releaseGPUData(e){let{texture:t,dtype:a,texShape:n,usage:r,isPacked:i,slice:o}=this.texData.get(e),s=o&&o.origDataId||e,l=this.dataRefCount.get(s);l>1?this.dataRefCount.set(s,l-1):(this.dataRefCount.delete(s),null!=t&&(this.numBytesInGPU-=this.computeBytes(n,a),this.textureManager.releaseTexture(t,n,r,i)));let u=this.texData.get(e);u.texture=null,u.texShape=null,u.isPacked=!1,u.slice=null}getTexture(e){return this.uploadToGPU(e),this.texData.get(e).texture.texture}getDataInfo(e){return this.texData.get(e)}shouldExecuteOnCPU(e,t=ah){return(0,g.env)().getBool("WEBGL_CPU_FORWARD")&&e.every(e=>null==this.texData.get(e.dataId).texture&&v.util.sizeFromShape(e.shape)<t)}getGPGPUContext(){return this.gpgpu}where(e){ef.backend_util.warn("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");let t=e.dataSync();return ac(e.shape,t)}packedUnaryOp(e,t,a){let n=new au(e.shape,t),r=this.compileAndRun(n,[e],a);return(0,x.engine)().makeTensorFromTensorInfo(r)}abs(e){if(this.shouldExecuteOnCPU([e])&&"complex64"!==e.dtype){let t=tW(this.texData.get(e.dataId).values);return this.makeOutput(e.shape,e.dtype,t)}if((0,g.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,aa,e.dtype);let t=new ae(e.shape,aa),a=this.compileAndRun(t,[e]);return(0,x.engine)().makeTensorFromTensorInfo(a)}makeTensorInfo(e,t,a){let n;if("string"===t&&null!=a&&a.length>0&&v.util.isString(a[0])){let r=a.map(e=>v.util.encodeString(e));n=this.write(r,e,t)}else n=this.write(a,e,t);return this.texData.get(n).usage=null,{dataId:n,shape:e,dtype:t}}makeOutput(e,t,a){return(0,x.engine)().makeTensorFromTensorInfo(this.makeTensorInfo(e,t,a),this)}unpackTensor(e){let t=new ad(e.shape);return this.runWebGLProgram(t,[e],e.dtype)}packTensor(e){let t=new t3(e.shape);return this.runWebGLProgram(t,[e],e.dtype,null,!0)}packedReshape(e,t){let a=[Z(e.shape),...J(e.shape)],n={dtype:e.dtype,shape:a,dataId:e.dataId},r=new t5([Z(t),...J(t)],a),i=this.runWebGLProgram(r,[n],e.dtype,[a],!0);return{dataId:i.dataId,shape:t,dtype:i.dtype}}decode(e,t){let a,{isPacked:n,shape:r,dtype:i}=this.texData.get(e);if(null!=t){let e=v.util.sizeFromShape(r),a=t[0]*t[1]*4;v.util.assert(e<=a,()=>"customTexShape is too small. Row * Column * 4 should be equal or larger than the size of the tensor data.")}let o=ee(r);a=n?new eG(o):new eU(o);let s=[null!=t?t:I(o)],l=this.runWebGLProgram(a,[{shape:o,dtype:i,dataId:e}],i,s,!0,t);return{dtype:i,shape:r,dataId:l.dataId}}runWebGLProgram(e,t,a,n,r=!1,i){let o,s,u,d=this.makeTensorInfo(e.outputShape,a),c=this.texData.get(d.dataId);if(e.packedOutput&&(c.isPacked=!0),e.outPackingScheme===l.DENSE&&(c.texShape=(null!=i?i:I(e.outputShape)).map(e=>2*e)),null!=e.outTexUsage&&(c.usage=e.outTexUsage),0===v.util.sizeFromShape(d.shape))return c.values=v.util.getTypedArrayFromDType(d.dtype,0),d;let p=[],h=t.map(t=>{if("complex64"===t.dtype)throw Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");let a=this.texData.get(t.dataId);if(null==a.texture){if(!e.packedInputs&&v.util.sizeFromShape(t.shape)<=(0,g.env)().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:t.shape,texData:null,isUniform:!0,uniformValues:a.values};e.packedInputs&&(a.isPacked=!0,a.shape=t.shape)}if(this.uploadToGPU(t.dataId),!!a.isPacked!=!!e.packedInputs)t=a.isPacked?this.unpackTensor(t):this.packTensor(t),p.push(t),a=this.texData.get(t.dataId);else if(a.isPacked&&!ea(a.shape,t.shape)){let e=t,n=t.shape;t.shape=a.shape,t=this.packedReshape(t,n),p.push(t),a=this.texData.get(t.dataId),e.shape=n}return{shape:t.shape,texData:a,isUniform:!1}});this.uploadToGPU(d.dataId);let f={shape:d.shape,texData:c,isUniform:!1},x=(s="",h.concat(f).forEach(t=>{let a=null!=t.texData&&null!=t.texData.slice&&t.texData.slice.flatOffset>0;if(e.enableShapeUniforms&&!t.isUniform){let n=t.texData.texShape,{useSqueezeShape:r,uniformShape:i,keptDims:o}=eD(e.packedInputs,t.shape,n),l="",u="",d="";if(1===i.length&&e.packedInputs){let e=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)];l=`${e[0]>1}_${e[1]>1}`}else if(2!==i.length||e.packedInputs){if(i.length>2&&!e.packedInputs){let e=v.util.computeStrides(i);d=`${e[0]===n[1]}_${e[e.length-1]===n[1]}`}}else u=`${i[0]>1}_${i[1]>1}`;let c=t.shape.length,p=2===i.length&&v.util.arraysEqual(t.shape,n),h=1===v.util.sizeFromShape(t.shape),x=ef.backend_util.getBroadcastDims(t.shape,f.shape),m=!e.packedInputs&&c===f.shape.length&&v.util.arraysEqual(n,f.texData.texShape),g=e.packedInputs||i.length>2?"":`${n[0]>1}_${n[1]>1}`;s+=`${c}_${m}_${r?o:""}_${i.length}_${h}_${x}_${p}_${l}_${u}_${d}_${g}_${a}`}else{let e=t.isUniform?"uniform":t.texData.texShape;s+=`${t.shape}_${e}_${a}`}}),u=e.userCode,e.constructor.name+("_"+s+"_"+u)+`${(0,g.env)().getNumber("WEBGL_VERSION")}`),m=this.getAndSaveBinary(x,()=>{var t;let a,n,r,i,o,s;return t=this.gpgpu,n=(a=h.map((t,a)=>{let n={logicalShape:t.shape,texShape:t.isUniform?null:t.texData.texShape,isUniform:t.isUniform,isPacked:!t.isUniform&&t.texData.isPacked,flatOffset:null};return null!=t.texData&&null!=t.texData.slice&&t.texData.slice.flatOffset>0&&(n.flatOffset=t.texData.slice.flatOffset),{name:e.variableNames[a],shapeInfo:n}})).map(e=>e.shapeInfo),i=function(e,t,a){var n,r,i,o;let s,l,u=[];if(e.forEach(e=>{let t=v.util.sizeFromShape(e.shapeInfo.logicalShape);if(e.shapeInfo.isUniform?u.push(`uniform float ${e.name}${t>1?`[${t}]`:""};`):(u.push(`uniform sampler2D ${e.name};`),u.push(`uniform int offset${e.name};`)),a.enableShapeUniforms){let{uniformShape:t}=eD(a.packedInputs,e.shapeInfo.logicalShape,e.shapeInfo.texShape);switch(t.length){case 1:u.push(`uniform int ${e.name}Shape;`);break;case 2:u.push(`uniform ivec2 ${e.name}Shape;`);break;case 3:u.push(`uniform ivec3 ${e.name}Shape;`);break;case 4:u.push(`uniform ivec4 ${e.name}Shape;`)}u.push(`uniform ivec2 ${e.name}TexShape;`)}}),a.enableShapeUniforms){switch(t.logicalShape.length){case 1:u.push("uniform int outShape;");break;case 2:u.push("uniform ivec2 outShape;"),u.push("uniform int outShapeStrides;");break;case 3:u.push("uniform ivec3 outShape;"),u.push("uniform ivec2 outShapeStrides;");break;case 4:u.push("uniform ivec4 outShape;"),u.push("uniform ivec3 outShapeStrides;")}u.push("uniform ivec2 outTexShape;")}a.customUniforms&&a.customUniforms.forEach(e=>{u.push(`uniform ${e.type} ${e.name}${e.arrayIndex?`[${e.arrayIndex}]`:""};`)});let d=u.join("\n"),c=e.map(e=>(function(e,t,a=!1,n){let r="";a?r+=function e(t,a){switch(t.shapeInfo.logicalShape.length){case 0:let n,r,i;return r="get"+(n=t.name).charAt(0).toUpperCase()+n.slice(1),i=eb(),`
    vec4 ${r}() {
      return ${i.texture2D}(${n}, halfCR);
    }
  `;case 1:return function(e,t){let a=e.name,n="get"+a.charAt(0).toUpperCase()+a.slice(1),r=e.shapeInfo.texShape,i=eb();if(t)return`
    vec4 ${n}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${a}TexShape[0]) / 2.0), ceil(float(${a}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${i.texture2D}(${a}, uv);
    }
  `;let o=[Math.ceil(r[0]/2),Math.ceil(r[1]/2)];return`
    vec4 ${n}(int index) {
      vec2 uv = packedUVfrom1D(
        ${o[0]}, ${o[1]}, index);
      return ${i.texture2D}(${a}, uv);
    }
  `}(t,a);case 2:return function(e,t){let a=e.shapeInfo.logicalShape,n=e.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1),i=e.shapeInfo.texShape,o=i[0],s=i[1],l=eb();if(null!=i&&v.util.arraysEqual(a,i))return t?`
      vec4 ${r}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${n}TexShape[1], ${n}TexShape[0]);

        return ${l.texture2D}(${n}, uv);
      }
    `:`
      vec4 ${r}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${s}.0, ${o}.0);

        return ${l.texture2D}(${n}, uv);
      }
    `;if(t)return`
    vec4 ${r}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${n}TexShape[0]) / 2.0), ceil(float(${n}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${n}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${l.texture2D}(${n}, uv);
    }
  `;let u=[Math.ceil(i[0]/2),Math.ceil(i[1]/2)],d=Math.ceil(a[1]/2);return`
    vec4 ${r}(int row, int col) {
      vec2 uv = packedUVfrom2D(${d}, ${u[0]}, ${u[1]}, row, col);
      return ${l.texture2D}(${n}, uv);
    }
  `}(t,a);case 3:return function(t,a){let n=t.shapeInfo.logicalShape,r=t.name,i="get"+r.charAt(0).toUpperCase()+r.slice(1),o=t.shapeInfo.texShape,s=[Math.ceil(o[0]/2),Math.ceil(o[1]/2)];if(1===n[0]){let r=eP(t,n.slice(1));return`
        ${e(r,a)}
        vec4 ${i}(int b, int row, int col) {
          return ${i}(${eL(["b","row","col"],[1,2])});
        }
      `}let l=eb();if(a)return`
    vec4 ${i}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${r}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${r}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${l.texture2D}(${r}, uv);
    }
  `;let u=s[0],d=s[1],c=Math.ceil(n[2]/2),p=c*Math.ceil(n[1]/2);return`
    vec4 ${i}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${u}, ${d}, ${p}, ${c}, b, row, col);
      return ${l.texture2D}(${r}, uv);
    }
  `}(t,a);default:return function(e,t){let a=e.name,n="get"+a.charAt(0).toUpperCase()+a.slice(1),r=eb();if(t)return`
    vec4 ${n}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${a}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${a}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${a}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${a}TexShape[0]) / 2.0), ceil(float(${a}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${r.texture2D}(${a}, uv);
    }
  `;let i=e.shapeInfo.logicalShape,o=i.length,s=e.shapeInfo.texShape,l=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)],u=l[0],d=l[1],c=Math.ceil(i[o-1]/2),p=c*Math.ceil(i[o-2]/2),h="int b, int row, int col",f=`b * ${p} + (row / 2) * ${c} + (col / 2)`;for(let e=2;e<o-1;e++)h=`int b${e}, `+h,p*=i[o-e-1],f=`b${e} * ${p} + `+f;return`
    vec4 ${n}(${h}) {
      int index = ${f};
      int texR = index / ${d};
      int texC = index - texR * ${d};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${d}, ${u});
      return ${r.texture2D}(${a}, uv);
    }
  `}(t,a)}}(e,n):r+=function e(t,a=!1){let n=t.shapeInfo.logicalShape;switch(n.length){case 0:return function(e,t){let a=e.name,n="get"+a.charAt(0).toUpperCase()+a.slice(1);if(e.shapeInfo.isUniform)return`float ${n}() {return ${a};}`;let[r,i]=e.shapeInfo.texShape;if(1===r&&1===i)return`
      float ${n}() {
        return sampleTexture(${a}, halfCR);
      }
    `;let o=eA(a);if(t)return`
    float ${n}() {
      vec2 uv = uvFromFlat(${a}TexShape[0], ${a}TexShape[1], ${o});
      return sampleTexture(${a}, uv);
    }
  `;let[s,l]=e.shapeInfo.texShape;return`
    float ${n}() {
      vec2 uv = uvFromFlat(${s}, ${l}, ${o});
      return sampleTexture(${a}, uv);
    }
  `}(t,a);case 1:return function(e,t){let a=e.name,n="get"+a.charAt(0).toUpperCase()+a.slice(1);if(e.shapeInfo.isUniform)return`
      float ${n}(int index) {
        ${eO(e)}
      }
    `;let r=e.shapeInfo.texShape,i=r[0],o=r[1];if(1===o&&1===i)return`
      float ${n}(int index) {
        return sampleTexture(${a}, halfCR);
      }
    `;let s=eA(a);return 1===o?t?`
      float ${n}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${s}) + 0.5) / float(${a}TexShape[0]));
        return sampleTexture(${a}, uv);
      }
    `:`
      float ${n}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${s}) + 0.5) / ${i}.0);
        return sampleTexture(${a}, uv);
      }
    `:1===i?t?`
      float ${n}(int index) {
        vec2 uv = vec2((float(index + ${s}) + 0.5) / float(${a}TexShape[1]), 0.5);
        return sampleTexture(${a}, uv);
      }
    `:`
      float ${n}(int index) {
        vec2 uv = vec2((float(index + ${s}) + 0.5) / ${o}.0, 0.5);
        return sampleTexture(${a}, uv);
      }
    `:t?`
    float ${n}(int index) {
      vec2 uv = uvFromFlat(${a}TexShape[0], ${a}TexShape[1], index + ${s});
      return sampleTexture(${a}, uv);
    }
  `:`
    float ${n}(int index) {
      vec2 uv = uvFromFlat(${i}, ${o}, index + ${s});
      return sampleTexture(${a}, uv);
    }
  `}(t,a);case 2:return function(t,a){let n=t.shapeInfo.logicalShape,r=t.name,i="get"+r.charAt(0).toUpperCase()+r.slice(1),o=t.shapeInfo.texShape;if(null!=o&&v.util.arraysEqual(n,o)){if(a)return`
      float ${i}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `;let e=o[0],t=o[1];return`
    float ${i}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${t}.0, ${e}.0);
      return sampleTexture(${r}, uv);
    }
  `}let{newShape:s,keptDims:l}=v.util.squeezeShape(n);if(s.length<n.length){let n=eP(t,s);return`
      ${e(n,a)}
      float ${i}(int row, int col) {
        return ${i}(${eL(["row","col"],l)});
      }
    `}if(t.shapeInfo.isUniform)return`
      float ${i}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${n[1]}, 1)));
        ${eO(t)}
      }
    `;let u=o[0],d=o[1],c=eA(r);return 1===d?a?`
      float ${i}(int row, int col) {
        float index = dot(vec3(row, col, ${c}), vec3(${r}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${r}TexShape[0]));
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${i}(int row, int col) {
      float index = dot(vec3(row, col, ${c}), vec3(${n[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${u}.0);
      return sampleTexture(${r}, uv);
    }
  `:1===u?a?`
      float ${i}(int row, int col) {
        float index = dot(vec3(row, col, ${c}), vec3(${r}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${r}TexShape[1]), 0.5);
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${i}(int row, int col) {
      float index = dot(vec3(row, col, ${c}), vec3(${n[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${d}.0, 0.5);
      return sampleTexture(${r}, uv);
    }
  `:a?`
      float ${i}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${r}Shape[1] + col + ${c};
        vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index);
        return sampleTexture(${r}, uv);
      }
    `:`
  float ${i}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${n[1]} + col + ${c};
    vec2 uv = uvFromFlat(${u}, ${d}, index);
    return sampleTexture(${r}, uv);
  }
`}(t,a);case 3:return function(t,a){let n=t.shapeInfo.logicalShape,r=t.name,i="get"+r.charAt(0).toUpperCase()+r.slice(1),o=n[1]*n[2],s=n[2],{newShape:l,keptDims:u}=v.util.squeezeShape(n);if(l.length<n.length){let n=eP(t,l);return`
        ${e(n,a)}
        float ${i}(int row, int col, int depth) {
          return ${i}(${eL(["row","col","depth"],u)});
        }
      `}if(t.shapeInfo.isUniform)return`
      float ${i}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${o}, ${s}, 1)));
        ${eO(t)}
      }
    `;let d=t.shapeInfo.texShape,c=d[0],p=d[1],h=t.shapeInfo.flatOffset;if(p===o&&null==h)return a?`
      float ${i}(int row, int col, int depth) {
        int stride1 = ${r}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
        float ${i}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${s}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${p}.0, ${c}.0);
          return sampleTexture(${r}, uv);
        }
      `;if(p===s&&null==h)return a?`
      float ${i}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${r}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${i}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${n[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${p}.0, ${c}.0);
      return sampleTexture(${r}, uv);
    }
  `;let f=eA(r);return a?`
    float ${i}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${r}Shape[1] * ${r}Shape[2];
      int stride1 = ${r}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${f};
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index);
      return sampleTexture(${r}, uv);
    }
    `:`
      float ${i}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${o} + col * ${s} + depth + ${f};
        vec2 uv = uvFromFlat(${c}, ${p}, index);
        return sampleTexture(${r}, uv);
      }
  `}(t,a);case 4:return function(t,a){let n=t.shapeInfo.logicalShape,r=t.name,i="get"+r.charAt(0).toUpperCase()+r.slice(1),o=n[3],s=n[2]*o,l=n[1]*s,{newShape:u,keptDims:d}=v.util.squeezeShape(n);if(u.length<n.length){let n=eP(t,u);return`
      ${e(n,a)}
      float ${i}(int row, int col, int depth, int depth2) {
        return ${i}(${eL(["row","col","depth","depth2"],d)});
      }
    `}if(t.shapeInfo.isUniform)return`
      float ${i}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${l}, ${s}, ${o}, 1)));
        ${eO(t)}
      }
    `;let c=t.shapeInfo.flatOffset,p=t.shapeInfo.texShape,h=p[0],f=p[1],x=`int stride2 = ${r}Shape[3];`,m=`int stride1 = ${r}Shape[2] * stride2;`,g=`int stride0 = ${r}Shape[1] * stride1;`;if(f===l&&null==c)return a?`
      float ${i}(int row, int col, int depth, int depth2) {
        ${x}
        ${m}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${i}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${s}, ${o}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${h}.0);
        return sampleTexture(${r}, uv);
      }
    `;if(f===o&&null==c)return a?`
      float ${i}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${r}Shape[1] * ${r}Shape[2], ${r}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${i}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${n[1]*n[2]}, ${n[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${h}.0);
        return sampleTexture(${r}, uv);
      }
    `;let C=eA(r);return a?`
    float ${i}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${x}
      ${m}
      ${g}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index + ${C});
      return sampleTexture(${r}, uv);
    }
  `:`
    float ${i}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${l} + col * ${s} +
          depth * ${o} + depth2;
      vec2 uv = uvFromFlat(${h}, ${f}, index + ${C});
      return sampleTexture(${r}, uv);
    }
  `}(t,a);case 5:return function(t){let a=t.shapeInfo.logicalShape,n=t.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1),i=a[4],o=a[3]*i,s=a[2]*o,l=a[1]*s,{newShape:u,keptDims:d}=v.util.squeezeShape(a);if(u.length<a.length){let a=eP(t,u);return`
      ${e(a)}
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        return ${r}(${eL(["row","col","depth","depth2","depth3"],d)});
      }
    `}if(t.shapeInfo.isUniform)return`
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${l}, ${s}, ${o}, ${i})) +
          depth3;
        ${eO(t)}
      }
    `;let c=t.shapeInfo.flatOffset,p=t.shapeInfo.texShape,h=p[0],f=p[1];if(f===l&&null==c)return`
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${s}, ${o}, ${i}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${h}.0);
        return sampleTexture(${n}, uv);
      }
    `;if(f===i&&null==c)return`
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${a[1]*a[2]*a[3]},
               ${a[2]*a[3]}, ${a[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${h}.0);
        return sampleTexture(${n}, uv);
      }
    `;let x=eA(n);return`
    float ${r}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${l} + col * ${s} + depth * ${o} +
          depth2 * ${i} + depth3 + ${x};
      vec2 uv = uvFromFlat(${h}, ${f}, index);
      return sampleTexture(${n}, uv);
    }
  `}(t);case 6:return function(t){let a=t.shapeInfo.logicalShape,n=t.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1),{newShape:i,keptDims:o}=v.util.squeezeShape(a);if(i.length<a.length){let a=eP(t,i);return`
      ${e(a)}
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${r}(${eL(["row","col","depth","depth2","depth3","depth4"],o)});
      }
    `}let s=a[5],l=a[4]*s,u=a[3]*l,d=a[2]*u,c=a[1]*d;if(t.shapeInfo.isUniform)return`
      float ${r}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${c}, ${d}, ${u}, ${l})) +
          dot(
            vec2(depth3, depth4),
            vec2(${s}, 1)));
        ${eO(t)}
      }
    `;let p=t.shapeInfo.flatOffset,h=t.shapeInfo.texShape,f=h[0],x=h[1];if(x===c&&null==p)return`
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${d}, ${u}, ${l}, ${s})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${x}.0, ${f}.0);
        return sampleTexture(${n}, uv);
      }
    `;if(x===s&&null==p)return`
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${a[1]*a[2]*a[3]*a[4]},
               ${a[2]*a[3]*a[4]},
               ${a[3]*a[4]},
               ${a[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${x}.0, ${f}.0);
        return sampleTexture(${n}, uv);
      }
    `;let m=eA(n);return`
    float ${r}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${c} + col * ${d} + depth * ${u} +
          depth2 * ${l} + depth3 * ${s} + depth4 + ${m};
      vec2 uv = uvFromFlat(${f}, ${x}, index);
      return sampleTexture(${n}, uv);
    }
  `}(t);default:throw Error(`${n.length}-D input sampling is not yet supported`)}}(e,n);let i=e.shapeInfo.logicalShape,o=t.logicalShape;return i.length<=o.length&&(a?r+=function(e,t){let a,n=e.name,r=n.charAt(0).toUpperCase()+n.slice(1),i=e.shapeInfo.logicalShape.length,o=t.logicalShape.length,s=ew(e.shapeInfo.logicalShape,t.logicalShape),l=eF(o),u=o-i,d=["x","y","z","w","u","v"];a=0===i?"":o<2&&s.length>=1?"coords = 0;":s.map(e=>`coords.${d[e+u]} = 0;`).join("\n");let c="";c=o<2&&i>0?"coords":e.shapeInfo.logicalShape.map((e,t)=>`coords.${d[t+u]}`).join(", ");let p="return outputValue;",h=1===v.util.sizeFromShape(e.shapeInfo.logicalShape),f=1===v.util.sizeFromShape(t.logicalShape);if(1!==i||h||f){if(h&&!f)p=1===o?`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:`
        return vec4(outputValue.x);
      `;else if(s.length){let e=i-2,t=i-1;s.indexOf(e)>-1&&s.indexOf(t)>-1?p="return vec4(outputValue.x);":s.indexOf(e)>-1?p="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":s.indexOf(t)>-1&&(p="return vec4(outputValue.xx, outputValue.zz);")}}else p=`
      return vec4(outputValue.xy, outputValue.xy);
    `;return`
    vec4 ${"get"+r+"AtOutCoords"}() {
      ${l} coords = getOutputCoords();
      ${a}
      vec4 outputValue = get${r}(${c});
      ${p}
    }
  `}(e,t):r+=function(e,t){let a,n=e.name,r=n.charAt(0).toUpperCase()+n.slice(1),i="get"+r+"AtOutCoords",o=t.texShape,s=e.shapeInfo.texShape,l=e.shapeInfo.logicalShape.length,u=t.logicalShape.length;if(!e.shapeInfo.isUniform&&l===u&&null==e.shapeInfo.flatOffset&&v.util.arraysEqual(s,o))return`
      float ${i}() {
        return sampleTexture(${n}, resultUV);
      }
    `;let d=eF(u),c=ew(e.shapeInfo.logicalShape,t.logicalShape),p=u-l,h=["x","y","z","w","u","v"];a=0===l?"":u<2&&c.length>=1?"coords = 0;":c.map(e=>`coords.${h[e+p]} = 0;`).join("\n");let f="";return f=u<2&&l>0?"coords":e.shapeInfo.logicalShape.map((e,t)=>`coords.${h[t+p]}`).join(", "),`
    float ${i}() {
      ${d} coords = getOutputCoords();
      ${a}
      return get${r}(${f});
    }
  `}(e,t)),r})(e,t,a.packedInputs,a.enableShapeUniforms)).join("\n"),p=t.texShape,h=eb(),f=(n=h,`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${n.texture2D}(textureSampler, uv).r;
    }
  `),x=(r=h,`${r.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${r.varyingFs} vec2 resultUV;
    ${r.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${r.defineSpecialNaN}
    ${r.defineSpecialInf}
    ${r.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${eS}
    ${eN}
    ${eE}
  `);return t.isPacked?(s=function(e,t,a){switch(e.length){case 0:return e_();case 1:var n,r;let i;return n=t,r=a,1===(i=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)])[0]?r?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${i[1]}.0);
      }
    `:1===i[1]?r?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${i[0]}.0);
      }
    `:r?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${i[0]}, ${i[1]}));
      return 2 * (resTexRC.x * ${i[1]} + resTexRC.y);
    }
  `;case 2:var o=e,s=t,l=a;let u=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)];if(v.util.arraysEqual(o,s))return l?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${u[0]}, ${u[1]}));
      }
    `;let d=Math.ceil(o[1]/2);return l?`
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${u[0]}, ${u[1]}));

      int index = resTexRC.x * ${u[1]} + resTexRC.y;
      int r = 2 * (index / ${d});
      int c = imod(index, ${d}) * 2;

      return ivec2(r, c);
    }
  `;case 3:var c=e,p=t,h=a;if(h)return`
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;let f=[Math.ceil(p[0]/2),Math.ceil(p[1]/2)],x=Math.ceil(c[2]/2),m=x*Math.ceil(c[1]/2);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${f[0]}, ${f[1]}));
      int index = resTexRC.x * ${f[1]} + resTexRC.y;

      int b = index / ${m};
      index -= b * ${m};

      int r = 2 * (index / ${x});
      int c = imod(index, ${x}) * 2;

      return ivec3(b, r, c);
    }
  `;default:return function(e,t,a){if(a)return`
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;let n=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)],r=Math.ceil(e[e.length-1]/2),i=r*Math.ceil(e[e.length-2]/2),o=i,s="",l="b, r, c";for(let t=2;t<e.length-1;t++)o*=e[e.length-t-1],s=`
      int b${t} = index / ${o};
      index -= b${t} * ${o};
    `+s,l=`b${t}, `+l;return`
    ivec${e.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${n[0]}, ${n[1]}));
      int index = resTexRC.x * ${n[1]} + resTexRC.y;

      ${s}

      int b = index / ${i};
      index -= b * ${i};

      int r = 2 * (index / ${r});
      int c = imod(index, ${r}) * 2;

      return ivec${e.length}(${l});
    }
  `}(e,t,a)}}(t.logicalShape,p,a.enableShapeUniforms),i=h,l=`
    void setOutput(vec4 val) {
      ${i.output} = val;
    }
  `):(s=function(e,t,a){switch(e.length){case 0:return e_();case 1:return n=t,r=a,1===n[0]?r?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${n[1]}.0);
      }
    `:1===n[1]?r?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${n[0]}.0);
      }
    `:r?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${n[0]}, ${n[1]}));
      return resTexRC.x * ${n[1]} + resTexRC.y;
    }
  `;case 2:return i=e,o=t,s=a,v.util.arraysEqual(i,o)?s?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${o[0]}, ${o[1]}));
      }
    `:1===i[1]?s?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${o[0]}, ${o[1]}));
        int index = resTexRC.x * ${o[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:1===i[0]?s?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${o[0]}, ${o[1]}));
        int index = resTexRC.x * ${o[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:s?`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${o[0]}, ${o[1]}));
      int index = resTexRC.x * ${o[1]} + resTexRC.y;
      int r = index / ${i[1]};
      int c = index - r * ${i[1]};
      return ivec2(r, c);
    }
  `;case 3:var n,r,i,o,s,l,u,d,c,p=e,h=t,f=a;if(f){let e=eI(["r","c","d"],p);return`
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${e}
    return ivec3(r, c, d);
  }
`}let x=e$(["r","c","d"],p);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${h[0]}, ${h[1]}));
      int index = resTexRC.x * ${h[1]} + resTexRC.y;
      ${x}
      return ivec3(r, c, d);
    }
  `;case 4:var m=e,g=t,C=a;if(C){let e=eI(["r","c","d","d2"],m);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${e}
      return ivec4(r, c, d, d2);
    }
  `}let b=e$(["r","c","d","d2"],m);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${g[0]}, ${g[1]}));
      int index = resTexRC.x * ${g[1]} + resTexRC.y;
      ${b}
      return ivec4(r, c, d, d2);
    }
  `;case 5:let $;return l=e,u=t,$=e$(["r","c","d","d2","d3"],l),`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${u[0]},
                             ${u[1]}));

      int index = resTexRC.x * ${u[1]} + resTexRC.y;

      ${$}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `;case 6:let I;return d=e,c=t,I=e$(["r","c","d","d2","d3","d4"],d),`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${c[0]}, ${c[1]}));
      int index = resTexRC.x * ${c[1]} + resTexRC.y;

      ${I}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `;default:throw Error(`${e.length}-D output sampling is not yet supported`)}}(t.logicalShape,p,a.enableShapeUniforms),o=h,l=`
    void setOutput(float val) {
      ${o.output} = vec4(val, 0, 0, 0);
    }
  `),a.packedInputs&&(x+=ek),[x,f,l,d,s,c,a.userCode].join("\n")}(a,r={logicalShape:f.shape,texShape:f.texData.texShape,isUniform:!1,isPacked:f.texData.isPacked,flatOffset:null},e),o=k(t.gl,i),s=t.createProgram(o),(0,g.env)().get("ENGINE_COMPILE_ONLY")?{program:e,fragmentShader:o,source:i,webGLProgram:s,inShapeInfos:n,outShapeInfo:r,variablesLocations:null,customUniformLocations:null,infLoc:null,nanLoc:null,outShapeLocation:null,outShapeStridesLocation:null,outTexShapeLocation:null}:(t.buildVao(s),Object.assign({program:e,fragmentShader:o,source:i,webGLProgram:s,inShapeInfos:n,outShapeInfo:r},eB(t,e,s)))}),C=null!=this.activeTimers;C&&(o=this.startTimer()),(0,g.env)().get("ENGINE_COMPILE_ONLY")||function(e,t,a,n,r){t.program.enableShapeUniforms||(eV(t.inShapeInfos,a),eV([t.outShapeInfo],[n]));let i=n.texData.texture,o=n.texData.texShape;n.texData.isPacked?e.setOutputPackedMatrixTexture(i.texture,o[0],o[1]):e.setOutputMatrixTexture(i.texture,o[0],o[1]),e.setProgram(t.webGLProgram),e.bindVertexArray(t.webGLProgram.vao),1===(0,g.env)().getNumber("WEBGL_VERSION")&&null!==t.infLoc&&e.gl.uniform1f(t.infLoc,1/0),null!==t.nanLoc&&e.gl.uniform1f(t.nanLoc,NaN);for(let n=0;n<a.length;++n){let r=a[n],{uniform:i,offset:o,shape:s,texShape:l}=t.variablesLocations[n];if(s){let{uniformShape:a}=eD(t.program.packedInputs,r.shape,r.texData.texShape);switch(a.length){case 1:e.gl.uniform1iv(s,new Int32Array(a));break;case 2:e.gl.uniform2iv(s,new Int32Array(a));break;case 3:e.gl.uniform3iv(s,new Int32Array(a));break;case 4:e.gl.uniform4iv(s,new Int32Array(a))}}if(l&&e.gl.uniform2i(l,r.texData.texShape[0],r.texData.texShape[1]),null!=i){if(r.isUniform){if(2>v.util.sizeFromShape(r.shape))e.gl.uniform1f(i,r.uniformValues[0]);else{let t=r.uniformValues;t instanceof Float32Array||(t=new Float32Array(t)),e.gl.uniform1fv(i,t)}continue}null!=r.texData.slice&&null!=o&&e.gl.uniform1i(o,r.texData.slice.flatOffset),e.setInputMatrixTexture(r.texData.texture.texture,i,n)}}let s=t.outShapeLocation;if(s)switch(n.shape.length){case 1:e.gl.uniform1iv(s,new Int32Array(n.shape));break;case 2:e.gl.uniform2iv(s,new Int32Array(n.shape));break;case 3:e.gl.uniform3iv(s,new Int32Array(n.shape));break;case 4:e.gl.uniform4iv(s,new Int32Array(n.shape))}if(t.outShapeStridesLocation){let a=v.util.computeStrides(n.shape);switch(n.shape.length){case 2:e.gl.uniform1iv(t.outShapeStridesLocation,new Int32Array(a));break;case 3:e.gl.uniform2iv(t.outShapeStridesLocation,new Int32Array(a));break;case 4:e.gl.uniform3iv(t.outShapeStridesLocation,new Int32Array(a))}}if(t.outTexShapeLocation&&e.gl.uniform2i(t.outTexShapeLocation,n.texData.texShape[0],n.texData.texShape[1]),t.program.customUniforms&&r)for(let a=0;a<t.program.customUniforms.length;++a){let n=t.program.customUniforms[a],i=t.customUniformLocations[a],o=r[a];if("float"===n.type)e.gl.uniform1fv(i,o);else if("vec2"===n.type)e.gl.uniform2fv(i,o);else if("vec3"===n.type)e.gl.uniform3fv(i,o);else if("vec4"===n.type)e.gl.uniform4fv(i,o);else if("int"===n.type)e.gl.uniform1iv(i,o);else if("ivec2"===n.type)e.gl.uniform2iv(i,o);else if("ivec3"===n.type)e.gl.uniform3iv(i,o);else if("ivec4"===n.type)e.gl.uniform4iv(i,o);else throw Error(`uniform type ${n.type} is not supported yet.`)}e.executeProgram()}(this.gpgpu,m,h,f,n),p.forEach(e=>this.disposeIntermediateTensorInfo(e)),C&&(o=this.endTimer(o),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(o)}));let b=(0,g.env)().getNumber("WEBGL_FLUSH_THRESHOLD");if(b>0){let e=v.util.now();e-this.lastGlFlushTime>b&&(this.gpgpu.gl.flush(),this.lastGlFlushTime=e)}if(!(0,g.env)().getBool("WEBGL_LAZILY_UNPACK")&&c.isPacked&&!1===r){let e=this.unpackTensor(d);return this.disposeIntermediateTensorInfo(d),e}return d}compileAndRun(e,t,a,n,r=!1){return a=a||t[0].dtype,this.runWebGLProgram(e,t,a,n,r)}getAndSaveBinary(e,t){return e in this.binaryCache||(this.binaryCache[e]=t()),this.binaryCache[e]}getTextureManager(){return this.textureManager}dispose(){this.disposed||((0,g.env)().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(e=>{this.gpgpu.deleteProgram(this.binaryCache[e].webGLProgram),delete this.binaryCache[e]}),this.textureManager.dispose(),null!=this.canvas&&"u">typeof HTMLCanvasElement&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)}floatPrecision(){return null==this.floatPrecisionValue&&(this.floatPrecisionValue=(0,x.tidy)(()=>{if(!(0,g.env)().get("WEBGL_RENDER_FLOAT32_ENABLED")){let e=(0,g.env)().getBool("DEBUG");(0,g.env)().set("DEBUG",!1);let t=this.abs((0,eC.scalar)(1e-8)).dataSync()[0];if((0,g.env)().set("DEBUG",e),t>0)return 32}return 16})),this.floatPrecisionValue}epsilon(){return 32===this.floatPrecision()?1e-7:1e-4}uploadToGPU(e){let t,a=this.texData.get(e),{shape:n,dtype:r,values:i,texture:o,usage:s,isPacked:l}=a;if(null!=o)return;let d=null!=this.activeTimers;d&&(t=v.util.now());let c=a.texShape;if(null==c&&(a.texShape=c=et(n,l)),null!=i){let e,o=ee(n),s=c[1],p=c[0],h=i instanceof Uint8Array||i instanceof Uint8ClampedArray;(l||!h)&&([s,p]=y(c[0],c[1])),e=l?new ej(o,h):new eH(o,h);let f=h?[p,s]:c,x=this.makeTensorInfo(f,r),m=this.texData.get(x.dataId);h?m.usage=u.PIXELS:m.usage=u.UPLOAD,m.texShape=f,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(x.dataId),s,p,i);let C=[[p,s]],b=this.runWebGLProgram(e,[x],r,C,!0),$=this.texData.get(b.dataId);a.texShape=$.texShape,a.isPacked=$.isPacked,a.usage=$.usage,(0,g.env)().get("ENGINE_COMPILE_ONLY")?this.disposeData(b.dataId):(a.texture=$.texture,a.values=null,this.texData.delete(b.dataId)),this.disposeIntermediateTensorInfo(x),d&&(this.uploadWaitMs+=v.util.now()-t)}else a.texture=this.acquireTexture(c,s,r,l)}convertAndCacheOnCPU(e,t){let a=this.texData.get(e),{dtype:n}=a;return null!=t&&(a.values=function(e,t){if("float32"===t||"complex64"===t)return e;if("int32"===t||"bool"===t){let a="int32"===t?new Int32Array(e.length):new Uint8Array(e.length);for(let t=0;t<a.length;++t)a[t]=Math.round(e[t]);return a}throw Error(`Unknown dtype ${t}`)}(t,n)),a.values}acquireTexture(e,t,a,n){if(this.numBytesInGPU+=this.computeBytes(e,a),!this.warnedAboutMemory&&this.numBytesInGPU>1024*this.numMBBeforeWarning*1024){let e=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn(`High memory usage in GPU: ${e} MB, most likely due to a memory leak`)}return this.textureManager.acquireTexture(e,t,n)}computeBytes(e,t){return e[0]*e[1]*v.util.bytesPerElement(t)}checkCompileCompletion(){for(let[,e]of Object.entries(this.binaryCache))this.checkCompletion_(e)}async checkCompileCompletionAsync(){let e=[];if(this.gpgpu.parallelCompilationExtension){for(let[,t]of Object.entries(this.binaryCache))e.push(this.checkCompletionAsync_(t));return Promise.all(e)}for(let[,t]of Object.entries(this.binaryCache)){let a=new Promise(e=>{try{this.checkCompletion_(t),e(!0)}catch(e){throw e}});e.push(a)}return Promise.all(e)}async checkCompletionAsync_(e){return this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.parallelCompilationExtension.COMPLETION_STATUS_KHR)?this.checkCompletion_(e):(await new Promise(e=>ev(()=>e())),this.checkCompletionAsync_(e))}checkCompletion_(e){if(!1===this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.gl.LINK_STATUS)){if(console.log(this.gpgpu.gl.getProgramInfoLog(e.webGLProgram)),!1===this.gpgpu.gl.getShaderParameter(e.fragmentShader,this.gpgpu.gl.COMPILE_STATUS))throw A(e.source,this.gpgpu.gl.getShaderInfoLog(e.fragmentShader)),Error("Failed to compile fragment shader.");throw Error("Failed to link vertex and fragment shaders.")}return!0}getUniformLocations(){for(let e of Object.values(this.binaryCache)){this.gpgpu.buildVao(e.webGLProgram);let{variablesLocations:t,customUniformLocations:a,infLoc:n,nanLoc:r,outShapeLocation:i,outShapeStridesLocation:o,outTexShapeLocation:s}=eB(this.gpgpu,e.program,e.webGLProgram);e.variablesLocations=t,e.customUniformLocations=a,e.infLoc=n,e.nanLoc=r,e.outShapeLocation=i,e.outShapeStridesLocation=o,e.outTexShapeLocation=s}}createTensorFromGPUData(e,t,a){e.channels=e.channels||"RGBA";let{texture:n,height:r,width:i,channels:o}=e,s=(0,x.engine)().backend;if(!s.gpgpu.gl.isTexture(n))throw Error("The texture is invalid. Also, please make sure the texture and the TFJS WebGL backend are using the same canvas. If you want to use your own custom canvas, you have to create and use the custom TFJS WebGL backend created from the canvas through 'new tf.MathBackendWebGL(customCanvas)'.");let l=s.writeTexture(n,t,a,r,i,o);return(0,x.engine)().makeTensorFromDataId(l,t,a,s)}}af.nextDataId=0,e.i(98600),e.i(56479),m.isBrowser()&&(0,x.registerBackend)("webgl",()=>new af,2);var ax=e.i(48534),am=e.i(92061),ag=e.i(72992),av=e.i(20281);let aC=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;class ab{constructor(e,t,a){this.variableNames=["A","B"],this.outputShape=ef.backend_util.assertAndGetBroadcastShape(t,a),this.enableShapeUniforms=eW(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${e}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `}}let a$=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;class aI{constructor(e,t,a,n=!1){this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=ef.backend_util.assertAndGetBroadcastShape(t,a);const r=this.outputShape.length;this.enableShapeUniforms=eW(r);let i="";if(n)if(0===r||1===v.util.sizeFromShape(this.outputShape))i=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else{const e=eF(r);if(i=`
          ${e} coords = getOutputCoords();
        `,1===r)this.enableShapeUniforms?i+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:i+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{const e=t4("coords",r);this.enableShapeUniforms?i+=`
            bool nextRowOutOfBounds =
              (${e[r-2]} + 1) >= outShape[${r} - 2];
            bool nextColOutOfBounds =
              (${e[r-1]} + 1) >= outShape[${r} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:i+=`
            bool nextRowOutOfBounds =
              (${e[r-2]} + 1) >= ${this.outputShape[r-2]};
            bool nextColOutOfBounds =
              (${e[r-1]} + 1) >= ${this.outputShape[r-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${e}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${i}

        setOutput(result);
      }
    `}}function ay(e){let{inputs:t,backend:a}=e,{x:n}=t;return a.incRef(n.dataId),{dataId:n.dataId,shape:n.shape,dtype:n.dtype}}let aR={kernelName:am.Identity,backendName:"webgl",kernelFunc:ay};function aT(e){let{inputs:t,backend:a}=e,{real:n,imag:r}=t,i=a.makeTensorInfo(n.shape,"complex64");return a.texData.get(i.dataId).complexTensorInfos={real:ay({inputs:{x:n},backend:a}),imag:ay({inputs:{x:r},backend:a})},i}let aw={kernelName:am.Complex,backendName:"webgl",kernelFunc:aT},aS="return (a < 0.) ? b * a : a;",aN=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`,aE={kernelName:am.LeakyRelu,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{alpha:i}=n,o=a.makeTensorInfo([],"float32",v.util.createScalarValue(i,"float32")),s=(0,g.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new aI(aN,r.shape,o.shape):new ab(aS,r.shape,o.shape),l=a.runWebGLProgram(s,[r,o],"float32");return a.disposeIntermediateTensorInfo(o),l}},ak="return (a < 0.) ? b * a : a;",a_=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`,aA={kernelName:am.Prelu,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{x:n,alpha:r}=t,i=(0,g.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new aI(a_,n.shape,r.shape):new ab(ak,n.shape,r.shape);return a.runWebGLProgram(i,[n,r],"float32")}},aO="if (isnan(x)) return x;";function aF({opSnippet:e,packedOpSnippet:t,cpuKernelImpl:a,dtype:n}){return({inputs:r,backend:i})=>{let o,{x:s}=r,l=n||s.dtype;if(i.shouldExecuteOnCPU([s])&&null!=a){let e=a(i.texData.get(s.dataId).values,l);return i.makeTensorInfo(s.shape,l,e)}return o=(0,g.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&null!=t?new au(s.shape,t):new ae(s.shape,e),i.runWebGLProgram(o,[s],l)}}function aD({opSnippet:e,packedOpSnippet:t,checkOutOfBounds:a=!1,supportsComplex:n=!1,cpuKernelImpl:r,dtype:i}){return({inputs:o,backend:s})=>{let l,{a:u,b:d}=o;if(n&&"complex64"===u.dtype){let t=s.texData.get(u.dataId),a=s.texData.get(d.dataId),[n,r]=[[t.complexTensorInfos.real,a.complexTensorInfos.real],[t.complexTensorInfos.imag,a.complexTensorInfos.imag]].map(t=>{let[a,n]=t,r={dataId:a.dataId,dtype:a.dtype,shape:u.shape},i={dataId:n.dataId,dtype:n.dtype,shape:d.shape},o=new ab(e,u.shape,d.shape);return s.runWebGLProgram(o,[r,i],(0,av.upcastType)(a.dtype,n.dtype))}),i=aT({inputs:{real:n,imag:r},backend:s});return s.disposeIntermediateTensorInfo(n),s.disposeIntermediateTensorInfo(r),i}let c=i||(0,av.upcastType)(u.dtype,d.dtype);if(("string"===u.dtype||"string"===d.dtype||s.shouldExecuteOnCPU([u,d]))&&null!=r){let e=s.texData.get(u.dataId).values,t=s.texData.get(d.dataId).values,a="string"===u.dtype?ef.backend_util.fromUint8ToStringArray(e):e,n="string"===u.dtype?ef.backend_util.fromUint8ToStringArray(t):t,[i,o]=r(u.shape,d.shape,a,n,c),l=s.makeTensorInfo(o,c);return s.texData.get(l.dataId).values=i,l}return l=(0,g.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&null!=t?new aI(t,u.shape,d.shape,a):new ab(e,u.shape,d.shape),s.runWebGLProgram(l,[u,d],c)}}function aP(e,t=!1){if("linear"===e)return"return x;";if("relu"===e)return t?as:an;if("elu"===e)return t?ao:"return (x >= 0.0) ? x : (exp(x) - 1.0);";if("relu6"===e)return t?al:ar;if("prelu"===e)return t?a_:ak;else if("leakyrelu"===e)return t?aN:aS;else if("sigmoid"===e)return"return 1.0 / (1.0 + exp(-1.0 * x));";throw Error(`Activation ${e} has not been implemented for the WebGL backend.`)}class aL{constructor(e,t,a,n=!1,r=!1,i=!1,o=null,s=!1,l=!1){this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=a,this.enableShapeUniforms=eW(this.outputShape.length);const u=Math.ceil((n?e[1]:e[2])/2),d=n?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],c=r?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"];let p="",h="";o&&(p=s?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${o}
        }`:l?`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${o}
        }`:`vec4 activation(vec4 x) {
          ${o}
        }`,h="result = activation(result);"),i&&this.variableNames.push("bias"),s&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let f="rc.x",x="rc.x";e[0]<t[0]?f=`imod(rc.x, ${e[0]})`:t[0]<e[0]&&(x=`imod(rc.x, ${t[0]})`),this.userCode=`
      ${p}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${u}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        int batchA = ${f};
        int batchB = ${x};
        for (int i = 0; i < ${u}; i++) {
          vec4 a = getMatrixA(batchA, ${n?"i * 2, rc.y":"rc.y, i * 2"});
          vec4 b = getMatrixB(batchB, ${r?"rc.z, i * 2":"i * 2, rc.z"});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${d[0]} * ${c[0]});
          result += (${d[1]} * ${c[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${i?"result += getBiasAtOutCoords();":""}

        ${h}

        setOutput(result);
      }
    `}}class aB{constructor(e,t,a){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=ef.backend_util.assertAndGetBroadcastShape(t,a),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${e}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `}}let aV="return a * b;";function aW(e){let t,{inputs:a,backend:n}=e,{a:r,b:i}=a,o=ef.backend_util.upcastType(r.dtype,i.dtype);if("complex64"===r.dtype){let e=n.texData.get(r.dataId),t=n.texData.get(i.dataId),a=new aB("return areal * breal - aimag * bimag;",r.shape,i.shape),o=new aB("return areal * bimag + aimag * breal;",r.shape,i.shape),s=[{dataId:e.complexTensorInfos.real.dataId,dtype:e.complexTensorInfos.real.dtype,shape:r.shape},{dataId:e.complexTensorInfos.imag.dataId,dtype:e.complexTensorInfos.imag.dtype,shape:r.shape},{dataId:t.complexTensorInfos.real.dataId,dtype:t.complexTensorInfos.real.dtype,shape:i.shape},{dataId:t.complexTensorInfos.imag.dataId,dtype:t.complexTensorInfos.imag.dtype,shape:i.shape}],l=n.runWebGLProgram(a,s,"float32"),u=n.runWebGLProgram(o,s,"float32"),d=aT({inputs:{real:l,imag:u},backend:n});return n.disposeIntermediateTensorInfo(l),n.disposeIntermediateTensorInfo(u),d}if(n.shouldExecuteOnCPU([r,i])){let e=n.texData.get(r.dataId),t=n.texData.get(i.dataId),[a,s]=tE(r.shape,i.shape,e.values,t.values,o),l=n.makeTensorInfo(s,o);return n.texData.get(l.dataId).values=a,l}return t=(0,g.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new aI(aV,r.shape,i.shape):new ab(aV,r.shape,i.shape),n.runWebGLProgram(t,[r,i],o)}let aU={kernelName:am.Multiply,backendName:"webgl",kernelFunc:aW};function aG(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{shape:i}=n,o=v.util.sizeFromShape(r.shape),s=v.util.inferFromImplicitShape(i,o),l=v.util.sizeFromShape(s);v.util.assert(o===l,()=>`The new shape (${s}) has ${l} elements and the old shape (${r.shape}) has ${o} elements. The new shape and old shape must have the same number of elements.`);let u=a.texData.get(r.dataId);if(u.isPacked&&!ea(r.shape,s)&&!(null!==u.texture&&ea(u.shape,s))){let e,t,n,i,o;return e=[Z(r.shape),...J(r.shape)],t={dtype:r.dtype,shape:e,dataId:r.dataId},n=new t5([Z(s),...J(s)],e),i=[e],{dataId:(o=a.runWebGLProgram(n,[t],r.dtype,i,!0)).dataId,shape:s,dtype:o.dtype}}return a.incRef(r.dataId),{dataId:r.dataId,shape:s,dtype:r.dtype}}let aM={kernelName:am.Reshape,backendName:"webgl",kernelFunc:aG};class az{constructor(e,t){this.variableNames=["x"];const{windowSize:a,batchSize:n,inSize:r,outSize:i}=e;this.outputShape=[n,i];const o=4*Math.floor(a/4),s=a%4;let l="sumValue += dot(values, ones);";if(null!=t){const e=1/t;l=`sumValue += dot(values * ${v.util.isInt(e)?e.toPrecision(2):e}, ones);`}let u="";r%a>0&&(u=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${u}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${a};

        float sumValue = 0.0;

        for (int i = 0; i < ${o}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${l}
        }

        int inIdx = inOffset + ${o};
        if (${1===s}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${l}
        } else if (${2===s}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${l}
        } else if (${3===s}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${l}
        }
        setOutput(sumValue);
      }
    `}}class aX{constructor(e,t){this.variableNames=["x"];const{windowSize:a,batchSize:n,inSize:r,outSize:i}=e;this.outputShape=[n,i];let o="0.0",s="";"prod"===t?o="1.0":"min"===t?(o="1.0 / 1e-20",s="min"):"max"===t&&(o="-1.0 / 1e-20",s="max");let l=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;"sum"===t?l="sumValue":"prod"===t?l="prodValue":"all"===t?l="allValue":"any"===t&&(l="anyValue");const u=4*Math.floor(a/4),d=a%4;let c=`
      if (${"sum"===t}) {
        sumValue += dot(values, ones);
      } else if (${"prod"===t}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${s}(values, minMaxValue);
        if (${"min"===t} || ${"max"===t}) {
          minMaxValue = ${s}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,p="vec4";"all"===t?(o="1.0",c=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,p="bvec4"):"any"===t&&(o="0.0",c=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,p="bvec4");let h="";r%a>0&&(h=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${o};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${h}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${a};

        vec4 minMaxValue = vec4(${o});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          ${p} values = ${p}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${c}
        }

        int inIdx = inOffset + ${u};
        if (${1===d}) {
          ${p} values = ${p}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${c}
        } else if (${2===d}) {
          ${p} values = ${p}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${c}
        } else if (${3===d}) {
          ${p} values = ${p}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${c}
        }
        setOutput(${l});
      }
    `}}function aH(e,t,a,n){let r=function(e){let t=[];for(;0===t.length||1!==t[t.length-1].outSize;){let a=t.length?t[t.length-1].outSize:e[1],n=ef.backend_util.computeOptimalWindowSize(a);t.push({inSize:a,windowSize:n,outSize:Math.ceil(a/n)})}return t}(e.shape),i=e;for(let o=0;o<r.length;o++){let s,l,{inSize:u,windowSize:d,outSize:c}=r[o];s="mean"===a?0===o?new az({windowSize:d,inSize:u,batchSize:e.shape[0],outSize:c},u):new az({windowSize:d,inSize:u,batchSize:e.shape[0],outSize:c}):new aX({windowSize:d,inSize:u,batchSize:e.shape[0],outSize:c},a),l=i,i=n.runWebGLProgram(s,[i],t),l.dataId!==e.dataId&&n.disposeIntermediateTensorInfo(l)}return i}class aj{constructor(e,t){this.variableNames=["A"];const a=Array(e.length);for(let n=0;n<a.length;n++)a[n]=e[t[n]];this.outputShape=a,this.rank=a.length;const n=eF(this.rank),r=function(e){let t=e.length;if(t>6)throw Error(`Transpose for rank ${t} is not yet supported`);let a=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],n=Array(t);for(let t=0;t<e.length;t++)n[e[t]]=a[t];return n.join()}(t);this.userCode=`
    void main() {
      ${n} resRC = getOutputCoords();
      setOutput(getA(${r}));
    }
    `}}class aK{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;const a=Array(e.length);for(let n=0;n<a.length;n++)a[n]=e[t[n]];if(this.outputShape=a,this.rank=a.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);const n=eF(this.rank),r=t2("rc",this.rank),i=Array(this.rank);for(let e=0;e<t.length;e++)i[t[e]]=r[e];const o=`vec2(${i.slice(-2).join()})`,s=`++${r[this.rank-1]} < ${a[this.rank-1]}`,l=`getChannel(getA(${i.join()}), ${o})`;this.userCode=`
    void main() {
      ${n} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${l};
      if(${s}) {
        result[1] = ${l};
      }
      --${r[this.rank-1]};
      if(++${r[this.rank-2]} < ${a[this.rank-2]}) {
        result[2] = ${l};
        if(${s}) {
          result[3] = ${l};
        }
      }
      setOutput(result);
    }
    `}}function aq(e,t,a){let n=(0,g.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new aK(e.shape,t):new aj(e.shape,t);return a.runWebGLProgram(n,[e],e.dtype)}function aY(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{axis:i,keepDims:o}=n;return function(e,t,a,n){let r=e.shape.length,i=v.util.parseAxisParam(t,e.shape),o=i,s=ef.backend_util.getAxesPermutation(o,r),l=null!=s,u=e;l&&(u=aq(e,s,n),o=ef.backend_util.getInnerMostAxes(o.length,r)),ef.backend_util.assertAxesAreInnerMostDims("sum",o,r);let[d,c]=ef.backend_util.computeOutAndReduceShapes(u.shape,o),p=d;a&&(p=ef.backend_util.expandShapeToKeepDim(d,i));let h=v.util.sizeFromShape(c),f=aG({inputs:{x:u},attrs:{shape:[v.util.sizeFromShape(e.shape)/h,h]},backend:n}),x=aH(f,(0,av.sumOutType)(e.dtype),"sum",n),m=aG({inputs:{x:x},attrs:{shape:p},backend:n});return n.disposeIntermediateTensorInfo(f),n.disposeIntermediateTensorInfo(x),l&&n.disposeIntermediateTensorInfo(u),m}(r,i,o,a)}let aQ={kernelName:am.Sum,backendName:"webgl",kernelFunc:aY};function aZ(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{perm:o}=r,s=Array(i.shape.length);for(let e=0;e<s.length;e++)s[e]=i.shape[o[e]];if(n.shouldExecuteOnCPU([i])){let e=t0(n.texData.get(i.dataId).values,i.shape,i.dtype,o,s);t=n.makeTensorInfo(s,i.dtype),n.texData.get(t.dataId).values=e}else t=aq(i,o,n);return t}let aJ={kernelName:am.Transpose,backendName:"webgl",kernelFunc:aZ};function a0({a:e,b:t,transposeA:a,transposeB:n,backend:r,bias:i=null,preluActivationWeights:o=null,leakyreluAlpha:s=0,activation:l=null}){let u,d=e.shape.length,c=t.shape.length,p=a?e.shape[d-2]:e.shape[d-1],h=n?t.shape[c-1]:t.shape[c-2],f=a?e.shape[d-1]:e.shape[d-2],x=n?t.shape[c-2]:t.shape[c-1],m=e.shape.slice(0,-2),g=t.shape.slice(0,-2),C=v.util.sizeFromShape(m),b=v.util.sizeFromShape(g),$=ag.broadcast_util.assertAndGetBroadcastShape(e.shape.slice(0,-2),t.shape.slice(0,-2)).concat([f,x]);v.util.assert(p===h,()=>`Error in matMul: inner shapes (${p}) and (${h}) of Tensors with shapes ${e.shape} and ${t.shape} and transposeA=${a} and transposeB=${n} must match.`);let I=a?[C,p,f]:[C,f,p],y=n?[b,x,h]:[b,h,x],R=aG({inputs:{x:e},backend:r,attrs:{shape:I}}),T=aG({inputs:{x:t},backend:r,attrs:{shape:y}}),w=[R,T],S=Math.max(C,b),N=a?R.shape[1]:R.shape[2],E=null!=i,k=null!=o,_="leakyrelu"===l,A=null!=l?aP(l,!0):null,O=E||k||_||null!=A;if((1===f||1===x)&&N>1e3&&!1===O){let e=R,t=T;a&&(e=aZ({inputs:{x:R},backend:r,attrs:{perm:[0,2,1]}}),w.push(e)),n&&(t=aZ({inputs:{x:T},backend:r,attrs:{perm:[0,2,1]}}),w.push(t));let i=1!==x,o=1===x,s=e;i&&(s=aG({inputs:{x:e},backend:r,attrs:{shape:[S,N,1]}}),w.push(s));let l=t;o&&(l=aG({inputs:{x:t},backend:r,attrs:{shape:[S,1,N]}}),w.push(l));let d=aW({inputs:{a:s,b:l},backend:r});u=aY({inputs:{x:d},backend:r,attrs:{axis:1===x?2:1,keepDims:!0}}),w.push(d)}else{let l=(0,av.upcastType)(e.dtype,t.dtype),d=new aL(I,y,[S,f,x],a,n,E,A,k,_),c=[R,T];if(null!=i&&c.push(i),k&&c.push(o),_){let e=r.makeTensorInfo([],"float32",v.util.createScalarValue(s,"float32"));c.push(e),w.push(e)}u=r.runWebGLProgram(d,c,l)}let F=aG({inputs:{x:u},backend:r,attrs:{shape:$}});for(let e of(w.push(u),w))r.disposeIntermediateTensorInfo(e);return F}let a1={kernelName:am._FusedMatMul,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{a:r,b:i,bias:o,preluActivationWeights:s}=t,{transposeA:l,transposeB:u,activation:d,leakyreluAlpha:c}=n;return a0({a:r,b:i,transposeA:l,transposeB:u,backend:a,bias:o,preluActivationWeights:s,leakyreluAlpha:c,activation:d})}},a2="return abs(x);",a4={kernelName:am.Abs,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n}=e,{x:r}=a;if(n.shouldExecuteOnCPU([r])&&"complex64"!==r.dtype){let e=tW(n.texData.get(r.dataId).values);return n.makeTensorInfo(r.shape,r.dtype,e)}return t=(0,g.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS")?new au(r.shape,a2):new ae(r.shape,a2),n.runWebGLProgram(t,[r],r.dtype)}},a3=aF({opSnippet:at+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`}),a5={kernelName:am.Acos,backendName:"webgl",kernelFunc:a3},a6=aF({opSnippet:at+`
  if (x < 1.0) return NAN;
return log(x + sqrt(x * x - 1.0));`}),a8={kernelName:am.Acosh,backendName:"webgl",kernelFunc:a6},a9="return a + b;",a7=aD({opSnippet:a9,packedOpSnippet:a9,supportsComplex:!0,cpuKernelImpl:ts}),ne={kernelName:am.Add,backendName:"webgl",kernelFunc:a7};class nt{constructor(e,t){this.outputShape=[],this.outputShape=e,this.variableNames=t.map((e,t)=>`T${t}`);const a=[];this.variableNames.forEach(e=>{a.push(`float v${e} = get${e}AtOutCoords();`)});const n=this.variableNames.map(e=>`v${e}`).join(" + ");this.userCode=`
      void main() {
        ${a.join("\n        ")}

        float result = ${n};
        setOutput(result);
      }
    `}}class na{constructor(e,t){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.variableNames=t.map((e,t)=>`T${t}`);const a=[];this.variableNames.forEach(e=>{a.push(`vec4 v${e} = get${e}AtOutCoords();`)});const n=this.variableNames.map(e=>`v${e}`).join(" + ");this.userCode=`
      void main() {
        ${a.join("\n        ")}

        vec4 result = ${n};
        setOutput(result);
      }
    `}}let nn={kernelName:am.AddN,backendName:"webgl",kernelFunc:function e(t){let{inputs:a,backend:n}=t;if(1===a.length)return ay({inputs:{x:a[0]},backend:n});if(a.length>(0,g.env)().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){let t=Math.floor(a.length/2),r=e({inputs:a.slice(0,t),backend:n}),i=e({inputs:a.slice(t),backend:n});return e({inputs:[r,i],backend:n})}let r=a.map(e=>e.dtype).reduce((e,t)=>(0,av.upcastType)(e,t)),i=a.map(e=>e.shape),o=(0,g.env)().getBool("WEBGL_PACK")?new na(a[0].shape,i):new nt(a[0].shape,i);return n.runWebGLProgram(o,a,r)}},nr={kernelName:am.All,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{axis:o,keepDims:s}=r,l=i.shape.length,u=v.util.parseAxisParam(o,i.shape),d=u,c=ef.backend_util.getAxesPermutation(d,l),p=i;null!=c&&(p=aZ({inputs:{x:i},backend:n,attrs:{perm:c}}),d=ef.backend_util.getInnerMostAxes(d.length,l)),ef.backend_util.assertAxesAreInnerMostDims("all",d,l);let[h,f]=ef.backend_util.computeOutAndReduceShapes(p.shape,d),x=aG({inputs:{x:p},backend:n,attrs:{shape:[-1,v.util.sizeFromShape(f)]}}),m=aH(x,x.dtype,"all",n);return t=s?aG({inputs:{x:m},backend:n,attrs:{shape:ef.backend_util.expandShapeToKeepDim(h,u)}}):aG({inputs:{x:m},backend:n,attrs:{shape:h}}),n.disposeIntermediateTensorInfo(x),n.disposeIntermediateTensorInfo(m),null!=c&&n.disposeIntermediateTensorInfo(p),t}},ni={kernelName:am.Any,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{axis:o,keepDims:s}=r,l=i.shape.length,u=v.util.parseAxisParam(o,i.shape),d=u,c=ef.backend_util.getAxesPermutation(d,l),p=i;null!=c&&(p=aZ({inputs:{x:i},backend:n,attrs:{perm:c}}),d=ef.backend_util.getInnerMostAxes(d.length,l)),ef.backend_util.assertAxesAreInnerMostDims("any",d,l);let[h,f]=ef.backend_util.computeOutAndReduceShapes(p.shape,d),x=aG({inputs:{x:p},backend:n,attrs:{shape:[-1,v.util.sizeFromShape(f)]}}),m=aH(x,x.dtype,"any",n);return t=s?aG({inputs:{x:m},backend:n,attrs:{shape:ef.backend_util.expandShapeToKeepDim(h,u)}}):aG({inputs:{x:m},backend:n,attrs:{shape:h}}),n.disposeIntermediateTensorInfo(x),n.disposeIntermediateTensorInfo(m),null!=c&&n.disposeIntermediateTensorInfo(p),t}};class no{constructor(e,t,a){this.variableNames=["A"];const{windowSize:n,batchSize:r,outSize:i}=e;a||this.variableNames.push("bestIndicesA"),this.outputShape=[r,i],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${n};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${n}; i++) {
          int inIdx = ${a?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));"};
          float candidate = getA(batch, inIdx);
          if (candidate ${"max"===t?">":"<"} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `}}class ns{constructor(e,t,a,n){let r,i;this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,v.util.assert(e.length>2,()=>`Packed arg${a.charAt(0).toUpperCase()+a.slice(1)} supports only inputs with rank above 2.`);const o=Math.ceil(e[e.length-1]/t);this.outputShape=e.slice(0,-1),o>1&&this.outputShape.push(o),n||this.variableNames.push("bestIndicesA");const s=this.outputShape,l=s.length,u=eF(l),d=t4("coords",l);if(1===o){const e=eF(i=l+1);r=`
        ${e} sourceLocR = ${e}(${d.join()}, 0);
        ++${d[l-1]};
        ${e} sourceLocG = ${e}(${d.join()}, 0);
        ++${d[l-2]};
        ${e} sourceLocA = ${e}(${d.join()}, 0);
        --${d[l-1]};
        ${e} sourceLocB = ${e}(${d.join()}, 0);
        --${d[l-2]};`}else i=l,r=`
        ${u} sourceLocR = coords;
        ++${d[l-1]};
        ${u} sourceLocG = coords;
        ++${d[l-2]};
        ${u} sourceLocA = coords;
        --${d[l-1]};
        ${u} sourceLocB = coords;
        --${d[l-2]};`;const c=["x","y","z","w","u","v"].slice(0,i),p="."+c[i-1],h=c.map(e=>"int "+e),f=t4("sourceLocR",i-1).concat("inIdx.r"),x=t4("sourceLocG",i-1).concat("inIdx.g"),m=t4("sourceLocB",i-1).concat("inIdx.b"),g=t4("sourceLocA",i-1).concat("inIdx.a"),C="max"===a?"greaterThan":"lessThan",b=n?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${f.join()}),
                             getBestIndicesAChannel(${x.join()}),
                             getBestIndicesAChannel(${m.join()}),
                             getBestIndicesAChannel(${g.join()})));`,$=`vec4(
            getAChannel(${f.join()}),
            hasNextCol ? getAChannel(${x.join()}) : 0.,
            hasNextRow ? getAChannel(${m.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${g.join()}) : 0.)`,I=n?"":`
      float getBestIndicesAChannel(${h.join()}) {
        return getChannel(getBestIndicesA(${c.join()}),
                                          vec2(${c.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${h.join()}) {
        return getChannel(getA(${c.join()}),
                               vec2(${c.slice(-2).join()}));
      }
      ${I}
      void main() {
        ${u} coords = getOutputCoords();
        bool hasNextCol = ${d[l-1]} < ${s[l-1]-1};
        bool hasNextRow = ${d[l-2]} < ${s[l-2]-1};
        ${r}
        ivec4 srcIdx = ivec4(sourceLocR${p}, sourceLocG${p},
          sourceLocB${p}, sourceLocA${p}) * ${t};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${$};

        for (int i = 0; i < ${t}; i++) {
          inIdx = srcIdx;
          ${b}
          vec4 candidate = ${$};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${C}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `}}function nl(e,t,a,n){let r=[a];if(ef.backend_util.assertAxesAreInnerMostDims("arg"+n.charAt(0).toUpperCase()+n.slice(1),r,t.shape.length),!(0,g.env)().getBool("WEBGL_PACK_REDUCE")||t.shape.length<=2){let a=[],i=e.texData.get(t.dataId),o=null!==i&&i.isPacked,s=t;o&&a.push(s=e.unpackTensor(t));let[l,u]=ef.backend_util.computeOutAndReduceShapes(s.shape,r),d=aG({inputs:{x:s},backend:e,attrs:{shape:[-1,v.util.sizeFromShape(u)]}});a.push(d);let c=function e(t,a,n,r=null){let i=a.shape[0],o=a.shape[1];null!=r&&(i=r.shape[0],o=r.shape[1]);let s=ef.backend_util.computeOptimalWindowSize(o),l=new no({windowSize:s,inSize:o,batchSize:i,outSize:Math.ceil(o/s)},n,null==r),u=[a];null!=r&&u.push(r);let d=t.runWebGLProgram(l,u,"int32");if(1===d.shape[1])return d;let c=e(t,a,n,d);return t.disposeIntermediateTensorInfo(d),c}(e,d,n);a.push(c);let p=aG({inputs:{x:c},backend:e,attrs:{shape:l}});return a.forEach(t=>e.disposeIntermediateTensorInfo(t)),p}return function e(t,a,n,r=null){let i=null!=r?r.shape:a.shape,o=i[i.length-1],s=new ns(i,ef.backend_util.computeOptimalWindowSize(o),n,null==r),l=null==r?[a]:[a,r],u=t.runWebGLProgram(s,l,"int32");if(u.shape.length===a.shape.length){let r=e(t,a,n,u);return t.disposeIntermediateTensorInfo(u),r}return u}(e,t,n)}let nu={kernelName:am.ArgMax,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{axis:i}=n,o=v.util.parseAxisParam(i,r.shape),s=ef.backend_util.getAxesPermutation(o,r.shape.length),l=r,u=[];null!=s&&(u.push(l=aZ({inputs:{x:r},backend:a,attrs:{perm:s}})),o=ef.backend_util.getInnerMostAxes(o.length,l.shape.length)),ef.backend_util.assertAxesAreInnerMostDims("argMax",[o[0]],l.shape.length);let d=nl(a,l,o[0],"max");return u.forEach(e=>a.disposeIntermediateTensorInfo(e)),d}},nd={kernelName:am.ArgMin,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{axis:i}=n,o=v.util.parseAxisParam(i,r.shape),s=ef.backend_util.getAxesPermutation(o,r.shape.length),l=r,u=[];null!=s&&(u.push(l=aZ({inputs:{x:r},backend:a,attrs:{perm:s}})),o=ef.backend_util.getInnerMostAxes(o.length,l.shape.length)),ef.backend_util.assertAxesAreInnerMostDims("argMin",[o[0]],l.shape.length);let d=nl(a,l,o[0],"min");return u.forEach(e=>a.disposeIntermediateTensorInfo(e)),d}},nc=aF({opSnippet:at+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`}),np={kernelName:am.Asin,backendName:"webgl",kernelFunc:nc},nh=aF({opSnippet:at+"return log(x + sqrt(x * x + 1.0));"}),nf={kernelName:am.Asinh,backendName:"webgl",kernelFunc:nh},nx=aF({opSnippet:at+`
  return atan(x);
`}),nm={kernelName:am.Atan,backendName:"webgl",kernelFunc:nx},ng=aD({opSnippet:aC+`
  return atan(a, b);
`,packedOpSnippet:`
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+a$+`
  return result;
`}),nv={kernelName:am.Atan2,backendName:"webgl",kernelFunc:ng},nC=aF({opSnippet:at+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
return (log(1.0 + x) - log(1.0 - x)) / 2.0;`}),nb={kernelName:am.Atanh,backendName:"webgl",kernelFunc:nC};class n${constructor(e,t,a,n=!1,r=!1){if(this.variableNames=["x"],"avg"===t&&a)throw Error("Cannot compute positions for average pool.");const i=e.filterWidth,o=e.strideHeight,s=e.strideWidth,l=e.dilationHeight,u=e.dilationWidth,d=e.effectiveFilterHeight,c=e.effectiveFilterWidth,p=e.padInfo.top,h=e.padInfo.left;this.outputShape=e.outShape;const f="avg"===t,x=`((batch  * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + d`,m=`(xR * ${e.inWidth} + xC) * ${e.inChannels} + d`;let g="0.0";if(f||(g="-1.0 / 1e-20"),a){this.userCode=`
        const ivec2 strides = ivec2(${o}, ${s});
        const ivec2 pads = ivec2(${p}, ${h});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${d};
              wR += ${l}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${c};
                wC += ${u}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value >= currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${n?r?x:m:`wR * ${c} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let v=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;"avg"===t&&(v="avgValue / max(count, 1.0)");const C=4*Math.floor(i/4),b=i%4,$=`
      if (${f}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${o}, ${s});
      const ivec2 pads = ivec2(${p}, ${h});
      const float initializationValue = ${g};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${g});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${d};
            wR += ${l}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${C}; wC += 4) {
            int xC = xCCorner + wC * ${u};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              getValue(batch, xR, xC + 3 * ${u}, d)
            );

            ${$}
          }

          int xC = xCCorner + ${C};
          if (${1===b}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${$}
          } else if (${2===b}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              initializationValue,
              initializationValue
            );

            ${$}
          } else if (${3===b}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              initializationValue
            );

            ${$}
          }
        }
        setOutput(${v});
      }
    `}}class nI{constructor(e,t,a,n=!1,r=!1){if(this.variableNames=["x"],"avg"===t&&a)throw Error("Cannot compute positions for average pool.");const i=e.filterWidth,o=e.strideDepth,s=e.strideHeight,l=e.strideWidth,u=e.dilationDepth,d=e.dilationHeight,c=e.dilationWidth,p=e.effectiveFilterDepth,h=e.effectiveFilterHeight,f=e.effectiveFilterWidth,x=e.padInfo.front,m=e.padInfo.top,g=e.padInfo.left;this.outputShape=e.outShape;const v="avg"===t;let C="0.0";if(v||(C="-1.0 / 1e-20"),a){this.userCode=`
        const ivec3 strides =
            ivec3(${o}, ${s}, ${l});
        const ivec3 pads = ivec3(${x}, ${m}, ${g});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${p};
              wD += ${u}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${e.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${h};
                wR += ${d}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${f};
                  wC += ${c}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value >= currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${n?r?`(((batch * ${e.inDepth} + xD) * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`((xD * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`wD * ${h} * ${f} +
                      wR * ${f} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let b=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;"avg"===t&&(b="avgValue / max(count, 1.0)");const $=4*Math.floor(i/4),I=i%4,y=`
      if (${v}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${o}, ${s}, ${l});
      const ivec3 pads = ivec3(${x}, ${m}, ${g});
      const float initializationValue = ${C};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${C});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${p};
            wD += ${u}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${h};
            wR += ${d}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${$}; wC += 4) {
              int xC = xCCorner + wC * ${c};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${c}, ch),
                getValue(batch, xD, xR, xC + 2 * ${c}, ch),
                getValue(batch, xD, xR, xC + 3 * ${c}, ch)
              );

              ${y}
            }

            int xC = xCCorner + ${$};
            if (${1===I}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${y}
            } else if (${2===I}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${c}, ch),
                initializationValue,
                initializationValue
              );

              ${y}
            } else if (${3===I}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${c}, ch),
                getValue(batch, xD, xR, xC + 2 * ${c}, ch),
                initializationValue
              );

              ${y}
            }
          }
        }
        setOutput(${b});
      }
    `}}let ny={kernelName:am.AvgPool,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t;ep(r,"avgPool");let{filterSize:i,strides:o,pad:s,dimRoundingMode:l}=n;v.util.assert(ef.backend_util.eitherStridesOrDilationsAreOne(o,1),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`);let u=ef.backend_util.computePool2DInfo(r.shape,i,o,1,s,l);if(1===u.filterWidth&&1===u.filterHeight&&v.util.arraysEqual(u.inShape,u.outShape))return ay({inputs:{x:r},backend:a});let d=new n$(u,"avg",!1);return a.runWebGLProgram(d,[r],"float32")}},nR={kernelName:am.AvgPool3D,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{filterSize:i,strides:o,pad:s,dimRoundingMode:l,dataFormat:u}=n,d=new nI(ef.backend_util.computePool3DInfo(r.shape,i,o,[1,1,1],s,l,u),"avg",!1);return a.runWebGLProgram(d,[r],"float32")}};class nT{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;const t=e.filterHeight,a=e.filterWidth,n=e.strideHeight,r=e.strideWidth,i=e.dilationHeight,o=e.dilationWidth,s=e.effectiveFilterHeight,l=e.effectiveFilterWidth,u=s-1-e.padInfo.top,d=l-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${u}, ${d});
      const float avgMultiplier = float(${1/(t*a)});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${s};
            wR += ${i}) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${l};
            wC+= ${o}) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `}}class nw{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;const t=e.filterDepth,a=e.filterHeight,n=e.filterWidth,r=e.strideDepth,i=e.strideHeight,o=e.strideWidth,s=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,d=e.effectiveFilterDepth,c=e.effectiveFilterHeight,p=e.effectiveFilterWidth,h=d-1-e.padInfo.front,f=c-1-e.padInfo.top,x=p-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${h}, ${f}, ${x});
      const float avgMultiplier = float(${1/(t*a*n)});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${d};
            wD += ${s}) {
          float dyD = float(dyDCorner + wD) / ${r}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${c};
              wR += ${l}) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${p};
                wC += ${u}) {
              float dyC = float(dyCCorner + wC) / ${o}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let nS={kernelName:am.AvgPool3DGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{dy:r,input:i}=t,{filterSize:o,strides:s,pad:l,dimRoundingMode:u}=n,d=new nw(ef.backend_util.computePool3DInfo(i.shape,o,s,[1,1,1],l,u));return a.runWebGLProgram(d,[r],i.dtype)}},nN={kernelName:am.AvgPoolGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{dy:r,input:i}=t;ep([r,i],"avgPoolGrad");let{filterSize:o,strides:s,pad:l}=n,u=new nT(ef.backend_util.computePool2DInfo(i.shape,o,s,1,l));return a.runWebGLProgram(u,[r],i.dtype)}},nE={kernelName:am.BatchMatMul,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{a:r,b:i}=t,{transposeA:o,transposeB:s}=n;return a0({a:r,b:i,transposeA:o,transposeB:s,backend:a})}};class nk{constructor(e,t,a,n,r,i){this.outputShape=[],this.variableNames=["x","mean","variance"],ef.backend_util.assertAndGetBroadcastShape(e,t),ef.backend_util.assertAndGetBroadcastShape(e,a);let o="0.0";null!=n&&(ef.backend_util.assertAndGetBroadcastShape(e,n),this.variableNames.push("offset"),o="getOffsetAtOutCoords()");let s="1.0";null!=r&&(ef.backend_util.assertAndGetBroadcastShape(e,r),this.variableNames.push("scale"),s="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${o};
        float scale = ${s};
        float inv = scale * inversesqrt(variance + float(${i}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `}}class n_{constructor(e,t,a,n,r,i){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],ef.backend_util.assertAndGetBroadcastShape(e,t),ef.backend_util.assertAndGetBroadcastShape(e,a);let o="vec4(0.0)";null!=n&&(ef.backend_util.assertAndGetBroadcastShape(e,n),this.variableNames.push("offset"),o="getOffsetAtOutCoords()");let s="vec4(1.0)";null!=r&&(ef.backend_util.assertAndGetBroadcastShape(e,r),this.variableNames.push("scale"),s="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        vec4 offset = ${o};
        vec4 scale = ${s};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${i}));

        setOutput((x - mean) * inv + offset);
      }
    `}}let nA={kernelName:am.FusedBatchNorm,backendName:"webgl",kernelFunc:({inputs:e,backend:t,attrs:a})=>{let{x:n,mean:r,variance:i,offset:o,scale:s}=e;v.util.assert(r.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),v.util.assert(null==o||r.shape.length===o.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),v.util.assert(null==s||r.shape.length===s.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:l}=a;null==l&&(l=.001);let u=[n,r,i],d=null;null!=o&&(d=o.shape,u.push(o));let c=null;null!=s&&(c=s.shape,u.push(s));let p=(0,g.env)().getBool("WEBGL_PACK_NORMALIZATION")?new n_(n.shape,r.shape,i.shape,d,c,l):new nk(n.shape,r.shape,i.shape,d,c,l);return t.runWebGLProgram(p,u,u[0].dtype)}};var nO=e.i(7948);class nF{constructor(e){let t;this.variableNames=["source"],this.outputShape=e,this.rank=e.length;const a=eF(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const n=function(e){if(1===e)return"sourceLoc";if(e<=6)return nD.slice(0,e).map(e=>"sourceLoc."+e).join(",");throw Error(`Slicing for rank ${e} is not yet supported`)}(this.rank),r=e.map((e,t)=>`sourceLoc.${nD[t]} = start[${t}] + coords.${nD[t]};`);t=`
        ${a} sourceLoc;
        ${a} coords = getOutputCoords();
        ${r.join("\n")}
      `,this.userCode=`
      void main() {
        ${t}
        setOutput(getSource(${n}));
      }
    `}}let nD=["x","y","z","w","u","v"];class nP{constructor(e){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const t=eF(this.rank),a=t4("coords",this.rank),n=t4("sourceLoc",this.rank),r=1===this.rank?"sourceLoc":`vec2(${n.slice(-2).join()})`,i=`getChannel(getSource(${n.join()}), ${r})`,o=`
      result.x = ${i};
      if (++${a[this.rank-1]} < ${e[this.rank-1]}) {
        ++${n[this.rank-1]};
        result.y = ${i};
        --${n[this.rank-1]};
      }
    `,s=1===this.rank?"":`
      --${a[this.rank-1]};
      if (++${a[this.rank-2]} < ${e[this.rank-2]}) {
        ++${n[this.rank-2]};
        result.z = ${i};
        if (++${a[this.rank-1]} < ${e[this.rank-1]}) {
          ++${n[this.rank-1]};
          result.w = ${i};
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            ${t}(${e.map((e,t)=>`start[${t}]`).join()});`:e.map((e,t)=>`${n[t]} = ${a[t]} + start[${t}];`).join("\n");this.userCode=`
      void main() {
        ${t} coords = getOutputCoords();
        ${t} sourceLoc;
        ${l}
        vec4 result = vec4(0.);
        ${o}
        ${s}
        setOutput(result);
      }
    `}}function nL(e){let t,a,n,r,i,{inputs:o,backend:s,attrs:l}=e,{x:u}=o,{begin:d,size:c}=l,[p,h]=nO.slice_util.parseSliceParams(u,d,c);if(nO.slice_util.assertParamsValid(u,p,h),0===v.util.sizeFromShape(h))return s.makeTensorInfo(h,u.dtype,[]);if(s.shouldExecuteOnCPU([u])||"string"===u.dtype){let e=tU(s.texData.get(u.dataId).values,p,h,u.shape,u.dtype);return s.makeTensorInfo(h,u.dtype,e)}let{isPacked:f}=s.texData.get(u.dataId),x=nO.slice_util.isSliceContinous(u.shape,p,h);if(f||!x){let e=(0,g.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new nP(h):new nF(h),t=[p];return s.runWebGLProgram(e,[u],u.dtype,t)}return s.uploadToGPU(u.dataId),t=s.texData.get(u.dataId),a=s.makeTensorInfo(h,u.dtype),Object.assign(n=s.texData.get(a.dataId),t),n.refCount=1,n.shape=h,n.dtype=u.dtype,r=nO.slice_util.computeFlatOffset(p,v.util.computeStrides(u.shape)),t.slice&&(r+=t.slice.flatOffset),n.slice={flatOffset:r,origDataId:t.slice&&t.slice.origDataId||u.dataId},i=s.dataRefCount.get(n.slice.origDataId)||1,s.dataRefCount.set(n.slice.origDataId,i+1),a}let nB={kernelName:am.Slice,backendName:"webgl",kernelFunc:nL},nV={kernelName:am.BatchToSpaceND,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{blockShape:i,crops:o}=n;v.util.assert(r.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");let s=i.reduce((e,t)=>e*t),l=ef.backend_util.getReshaped(r.shape,i,s),u=ef.backend_util.getPermuted(l.length,i.length),d=ef.backend_util.getReshapedPermuted(r.shape,i,s),c=ef.backend_util.getSliceBeginCoords(o,i.length),p=ef.backend_util.getSliceSize(d,o,i.length),h=[],f=aG({inputs:{x:r},backend:a,attrs:{shape:l}}),x=aZ({inputs:{x:f},backend:a,attrs:{perm:u}}),m=aG({inputs:{x:x},backend:a,attrs:{shape:d}}),g=nL({inputs:{x:m},backend:a,attrs:{begin:c,size:p}});return h.push(f),h.push(x),h.push(m),h.forEach(e=>a.disposeIntermediateTensorInfo(e)),g}},nW={kernelName:am.Bincount,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,weights:i}=t,{size:o}=n,s=tl(a.readSync(r.dataId),a.readSync(i.dataId),i.dtype,i.shape,o);return a.makeTensorInfo([o],i.dtype,s)}},nU=`
  int r = int(a.r) & int(b.r);
  int g = int(a.g) & int(b.g);
  int rb = int(a.b) & int(b.b);
  int ra = int(a.a) & int(b.a);
  return vec4(r, g, rb, ra);
`,nG=`
  return float(int(a.r) & int(b.r));
`,nM={kernelName:am.BitwiseAnd,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n}=e,{a:r,b:i}=a,o=(0,g.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS"),s=(0,g.env)().getNumber("WEBGL_VERSION");if(n.shouldExecuteOnCPU([r,i])||1===s){let e=n.texData.get(r.dataId).values,t=n.texData.get(i.dataId).values,[a,o]=td(r.shape,i.shape,e,t,r.dtype),s=n.makeTensorInfo(o,r.dtype);return n.texData.get(s.dataId).values=a,s}return t=o?new aI(nU,r.shape,i.shape,!1):new ab(nG,r.shape,i.shape),n.runWebGLProgram(t,[r,i],r.dtype)}},nz={kernelName:am.BroadcastArgs,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{s0:n,s1:r}=t,i=a.readSync(n.dataId),o=a.readSync(r.dataId),s=ef.backend_util.assertAndGetBroadcastShape(Array.from(i),Array.from(o));return a.makeTensorInfo([s.length],"int32",Int32Array.from(s))}};var nX=e.i(94596);let nH=aD({opSnippet:"return float(a != b);",cpuKernelImpl:t_,dtype:"bool"}),nj={kernelName:am.NotEqual,backendName:"webgl",kernelFunc:nH};function nK(e){let{inputs:t,backend:a}=e,{input:n}=t;return ay({inputs:{x:a.texData.get(n.dataId).complexTensorInfos.real},backend:a})}let nq={kernelName:am.Real,backendName:"webgl",kernelFunc:nK},nY={kernelName:am.Cast,backendName:"webgl",kernelFunc:function e(t){let{inputs:a,backend:n,attrs:r}=t,{x:i}=a,{dtype:o}=r;if("complex64"===o){if("complex64"===i.dtype)return ay({inputs:{x:i},backend:n});let t=nX.zeros(i.shape),a=e({inputs:{x:i},backend:n,attrs:{dtype:"float32"}}),r=aT({inputs:{real:a,imag:t},backend:n});return t.dispose(),n.disposeIntermediateTensorInfo(a),r}if("complex64"===i.dtype){let t=nK({inputs:{input:i},backend:n}),a=e({inputs:{x:t},backend:n,attrs:{dtype:o}});return n.disposeIntermediateTensorInfo(t),a}if(!v.util.hasEncodingLoss(i.dtype,o)){let e=ay({inputs:{x:i},backend:n});return{dataId:e.dataId,shape:e.shape,dtype:o}}if(n.shouldExecuteOnCPU([i])){let[e,t,a]=tc(n.texData.get(i.dataId).values,i.shape,i.dtype,o);return n.makeTensorInfo(e,t,a)}if("int32"===o){let e,t;return e=new ae(i.shape,"return float(int(x));"),{dataId:(t=n.runWebGLProgram(e,[i],"int32")).dataId,shape:t.shape,dtype:t.dtype}}if("bool"===o){let e=n.makeTensorInfo([],"bool",v.util.getTypedArrayFromDType("bool",1)),t=nH({inputs:{a:i,b:e},backend:n});return n.disposeIntermediateTensorInfo(e),t}throw Error(`Error in Cast: failed to cast ${i.dtype} to ${o}`)}},nQ="return ceil(x);",nZ=aF({opSnippet:nQ,packedOpSnippet:nQ,cpuKernelImpl:tp}),nJ={kernelName:am.Ceil,backendName:"webgl",kernelFunc:nZ};class n0{constructor(e){this.variableNames=["A"],this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}}class n1{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}}let n2={kernelName:am.ClipByValue,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{clipValueMin:o,clipValueMax:s}=r;return t=(0,g.env)().getBool("WEBGL_PACK_CLIP")?new n1(i.shape):new n0(i.shape),n.runWebGLProgram(t,[i],i.dtype,[[o],[s]])}};class n4{constructor(e){this.variableNames=["real","imag"],this.outputShape=e,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `}}function n3(e,t){return{dataId:t.dataId,dtype:t.dtype,shape:e.shape}}let n5={kernelName:am.ComplexAbs,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{x:n}=t,r=a.texData.get(n.dataId),i=new n4(n.shape),o=[n3(n,r.complexTensorInfos.real),n3(n,r.complexTensorInfos.imag)];return a.runWebGLProgram(i,o,o[0].dtype)}};class n6{constructor(e){this.outputShape=[],this.outputShape=ef.backend_util.computeOutShape(e,1),this.variableNames=e.map((e,t)=>`T${t}`);const t=Array(e.length-1);t[0]=e[0][1];for(let a=1;a<t.length;a++)t[a]=t[a-1]+e[a][1];const a=[`if (yC < ${t[0]}) setOutput(getT0(yR, yC));`];for(let e=1;e<t.length;e++){const n=t[e-1];a.push(`else if (yC < ${t[e]}) setOutput(getT${e}(yR, yC-${n}));`)}const n=t.length,r=t[t.length-1];a.push(`else setOutput(getT${n}(yR, yC-${r}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${a.join("\n        ")}
      }
    `}}class n8{constructor(e,t){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=ef.backend_util.computeOutShape(e,t);const a=this.outputShape,n=a.length,r=eF(n),i=t4("coords",n),o=["x","y","z","w","u","v"].slice(0,n);this.variableNames=e.map((e,t)=>`T${t}`);const s=Array(e.length-1);s[0]=e[0][t];for(let a=1;a<s.length;a++)s[a]=s[a-1]+e[a][t];const l=o[t],u=o.slice(-2),d=o.join();let c=`if (${l} < ${s[0]}) {
        return getChannel(
            getT0(${d}), vec2(${u.join()}));
        }`;for(let e=1;e<s.length;e++){const t=s[e-1];c+=`
        if (${l} < ${s[e]}  && ${l} >= ${s[e-1]}) {
          return getChannel(
            getT${e}(${n9(o,l,t)}),
            vec2(${n9(u,l,t)}));
        }`}const p=s.length,h=s[s.length-1];c+=`
        return getChannel(
          getT${p}(${n9(o,l,h)}),
          vec2(${n9(u,l,h)}));`,this.userCode=`
      float getValue(${o.map(e=>"int "+e)}) {
        ${c}
      }

      void main() {
        ${r} coords = getOutputCoords();
        vec4 result = vec4(getValue(${i}), 0., 0., 0.);

        ${i[n-1]} = ${i[n-1]} + 1;
        if (${i[n-1]} < ${a[n-1]}) {
          result.g = getValue(${i});
        }

        ${i[n-2]} = ${i[n-2]} + 1;
        if (${i[n-2]} < ${a[n-2]}) {
          result.a = getValue(${i});
        }

        ${i[n-1]} = ${i[n-1]} - 1;
        if (${i[n-2]} < ${a[n-2]} &&
            ${i[n-1]} < ${a[n-1]}) {
          result.b = getValue(${i});
        }
        setOutput(result);
      }
    `}}function n9(e,t,a){let n=e.indexOf(t);return e.map((e,t)=>t===n?`${e} - ${a}`:e).join()}function n7(e){let{inputs:t,backend:a}=e,{input:n}=t;return ay({inputs:{x:a.texData.get(n.dataId).complexTensorInfos.imag},backend:a})}let re={kernelName:am.Imag,backendName:"webgl",kernelFunc:n7};function rt(e){let{inputs:t,backend:a,attrs:n}=e,{axis:r}=n,i=v.util.parseAxisParam(r,t[0].shape)[0],o=t.map(e=>e.shape);ef.backend_util.assertParamsConsistent(o,i);let s=ef.backend_util.computeOutShape(t.map(e=>e.shape),i);if(0===v.util.sizeFromShape(s))return a.makeTensorInfo(s,t[0].dtype,[]);let l=t.filter(e=>v.util.sizeFromShape(e.shape)>0);return 1===l.length?ay({inputs:{x:l[0]},backend:a}):function e(t,a,n){var r,i,o;let s,l=t[0].dtype;if("complex64"===l){let r=t.map(e=>nK({inputs:{input:e},backend:n})),i=t.map(e=>n7({inputs:{input:e},backend:n})),o=e(r,a,n),s=e(i,a,n),l=aT({inputs:{real:o,imag:s},backend:n});return r.forEach(e=>n.disposeIntermediateTensorInfo(e)),i.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(s),l}let u=n.shouldExecuteOnCPU(t);if("string"===l&&(u=!0),u){let e=t.map(e=>{let t=v.util.sizeFromShape(e.shape.slice(a));return aG({inputs:{x:e},backend:n,attrs:{shape:[-1,t]}})}),r=th(e.map(e=>({vals:n.readSync(e.dataId),shape:e.shape})),ef.backend_util.computeOutShape(e.map(e=>e.shape),1),l,1===e[0].shape[0]),i=ef.backend_util.computeOutShape(t.map(e=>e.shape),a),o=n.makeTensorInfo(i,l,r);return e.forEach(e=>n.disposeIntermediateTensorInfo(e)),o}let d=t.filter(e=>v.util.sizeFromShape(e.shape)>0),c=(0,g.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&d[0].shape.length>1;if(1===d.length){let e=c?new ae(t[0].shape,ai):new au(t[0].shape,ai);return n.runWebGLProgram(e,t,l)}let p=(0,g.env)().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(d.length>p){let t=[];for(let r=0;r<d.length;r+=p){let i=d.slice(r,r+p);t.push(e(i,a,n))}let r=e(t,a,n);for(let e of t)n.disposeIntermediateTensorInfo(e);return r}if(c){let e=new n8(d.map(e=>e.shape),a);return n.runWebGLProgram(e,d,l)}let{tensors2D:h,outShape:f}=(r=d,i=a,o=n,s=ef.backend_util.computeOutShape(r.map(e=>e.shape),i),{tensors2D:r.map(e=>aG({inputs:{x:e},attrs:{shape:[-1,v.util.sizeFromShape(e.shape.slice(i))]},backend:o})),outShape:s}),x=new n6(h.map(e=>e.shape)),m=n.runWebGLProgram(x,h,l);h.forEach(e=>n.disposeIntermediateTensorInfo(e));let C=aG({inputs:{x:m},attrs:{shape:f},backend:n});return n.disposeIntermediateTensorInfo(m),C}(l,i,a)}let ra={kernelName:am.Concat,backendName:"webgl",kernelFunc:rt};class rn{constructor(e,t=!1,a=null,n=!1,r=!1){this.variableNames=["x","W"],this.outputShape=e.outShape;const i=e.padInfo.top,o=e.padInfo.left,s=e.strideHeight,l=e.strideWidth,u=e.dilationHeight,d=e.dilationWidth,c=e.filterHeight,p=e.filterWidth,h=4*Math.floor(e.inChannels/4),f=e.inChannels%4,x="channelsLast"===e.dataFormat;let m="",g="";a&&(m=n?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${a}
        }`:r?`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${a}
        }`:`
          float activation(float x) {
            ${a}
          }
        `,g="result = activation(result);"),t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${m}

      const ivec2 strides = ivec2(${s}, ${l});
      const ivec2 pads = ivec2(${i}, ${o});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${x?3:1}];

        ivec2 xRCCorner =
            ivec2(coords[${x?1:2}], coords[${x?2:3}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${c}; wR++) {
          int xR = xRCorner + wR * ${u};

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${p}; wC++) {
            int xC = xCCorner + wC * ${d};

            if (xC < 0 || xC >= ${e.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${h}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${x}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${1===f}) {

              if (${x}) {
                dotProd +=
                    getX(batch, xR, xC, ${h}) *
                    getW(wR, wC, ${h}, d2);
              } else {
                dotProd +=
                    getX(batch, ${h}, xR, xC) *
                    getW(wR, wC, ${h}, d2);
              }

            } else if (${2===f}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${h}, d2),
                getW(wR, wC, ${h} + 1, d2)
              );

              if (${x}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${h}),
                  getX(batch, xR, xC, ${h} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${h}, xR, xC),
                  getX(batch, ${h} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${3===f}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${h}, d2),
                getW(wR, wC, ${h} + 1, d2),
                getW(wR, wC, ${h} + 2, d2)
              );

              if (${x}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${h}),
                  getX(batch, xR, xC, ${h} + 1),
                  getX(batch, xR, xC, ${h} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${h}, xR, xC),
                  getX(batch, ${h} + 1, xR, xC),
                  getX(batch, ${h} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${t?"result += getBiasAtOutCoords();":""}
        ${g}
        setOutput(result);
      }
    `}}class rr{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;const t=e.padInfo.front,a=e.padInfo.top,n=e.padInfo.left,r=e.strideDepth,i=e.strideHeight,o=e.strideWidth,s=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,d=e.filterDepth,c=e.filterHeight,p=e.filterWidth,h=4*Math.floor(e.inChannels/4),f=e.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${r}, ${i}, ${o});
      const ivec3 pads = ivec3(${t}, ${a}, ${n});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${d}; wF++) {
          int xF = xFCorner + wF * ${s};

          if (xF < 0 || xF >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${c}; wR++) {
            int xR = xRCorner + wR * ${l};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${p}; wC++) {
              int xC = xCCorner + wC * ${u};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${h}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${1===f}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${h}) *
                  getW(wF, wR, wC, ${h}, d2);
              } else if (${2===f}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${h}),
                  getX(batch, xF, xR, xC, ${h} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${h}, d2),
                  getW(wF, wR, wC, ${h} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${3===f}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${h}),
                  getX(batch, xF, xR, xC, ${h} + 1),
                  getX(batch, xF, xR, xC, ${h} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${h}, d2),
                  getW(wF, wR, wC, ${h} + 1, d2),
                  getW(wF, wR, wC, ${h} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class ri{constructor(e,t=!1,a=null,n=!1,r=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=eW(this.outputShape.length);const i=e.padInfo.left,o=e.strideWidth,s=e.dilationWidth,l=e.filterHeight,u=e.filterWidth;let d=`
       int xR; int xC; int xCOffset;
       vec4 wTexel; vec4 previous; vec4 final;`;for(let e=0;e<u;e++)d+=`
           vec4 xTexelC${2*e};
           int xTexelC${2*e}Ready;
           vec4 xTexelC${2*e+1};
           int xTexelC${2*e+1}Ready;
           vec4 xC${e};`;d+=`
     for (int r = 0; r < ${l}; r++) {
      for (int d1 = 0; d1 < ${e.inChannels}; d1 += 2) {
       `;for(let e=0;e<u;e++)d+=`
           xTexelC${2*e} = vec4(0.0);
           xTexelC${2*e}Ready = 0;
           xTexelC${2*e+1} = vec4(0.0);
           xTexelC${2*e+1}Ready = 0;
           xC${e} = vec4(0.0);`;d+=`
         xR = xRCorner + r * dilations[0];
         if (xR >=0 && xR < inDims[0]) {
       `;for(let t=0;t<(u+1)/2;t++){const a=2*t;if(d+=`
           xC = xCCorner + ${a*s};
           `,1===o){if(a<u&&(i%2==1?(d+=`
                 xCOffset = xC + 1;
                 if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${a}Ready == 0) {
                   xTexelC${a} = getX(batch, xR, xCOffset, d1);

                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${a}.zw = vec2(0.0);
                   }
                   xTexelC${a}Ready = 1;
                 }
               `,1===s&&a>0?d+=`
                 xC${a} = vec4(xTexelC${a-2}.zw, xTexelC${a}.xy);
                 `:d+=`
                   xCOffset = xC + 1 - 2;

                   if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       previous.zw = vec2(0.0);
                     }

                     xC${a} = vec4(previous.zw, xTexelC${a}.xy);
                   } else {
                     xC${a} = vec4(0.0, 0.0, xTexelC${a}.xy);
                   }
                   `):d+=`
                 if (xC >= 0 && xC < inDims[1] && xTexelC${a}Ready == 0) {
                   xTexelC${a} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${a}.zw = vec2(0.0);
                   }
                   xTexelC${a}Ready = 1;
                 }

                 xC${a} = xTexelC${a};
                 `,a+1<u)){const e=i%2==0?v.util.nearestLargerEven(s):s;s%2==0&&i%2==1||s%2!=0&&i%2!=1?(d+=`
                   xCOffset = xC + imod(pads[1], 2) + ${e};

                   if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${a+1}Ready == 0) {
                     xTexelC${a+1} = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       xTexelC${a+1}.zw = vec2(0.0);
                     }
                     xTexelC${a+1}Ready = 1;
                   }
                   `,s>1?d+=`
                     xCOffset -= 2;
                     if (xCOffset >= 0 && xCOffset < inDims[1]) {
                      previous = getX(batch, xR, xCOffset, d1);
                      xC${a+1} = vec4(previous.zw, xTexelC${a+1}.xy);
                     } else {
                      xC${a+1} = vec4(0.0, 0.0, xTexelC${a+1}.xy);
                     }
                     `:d+=`
                     xC${a+1} = vec4(xTexelC${a}.zw, xTexelC${a+1}.xy);
                     `):1===e?d+=`
                     xC${a+1} = xTexelC${a};
                     `:d+=`
                     xCOffset = xC + ${e};

                     if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${a+1}Ready == 0) {
                       xTexelC${a+1} = getX(batch, xR, xCOffset, d1);
                       if (xCOffset + 1 >= inDims[1]) {
                         xTexelC${a+1}.zw = vec2(0.0);
                       }
                       xTexelC${a+1}Ready = 1;
                     }

                     xC${a+1} = xTexelC${a+1};
                     `}}else a<u&&(i%2==1?(d+=`
                 xCOffset = xC + 1 - strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${a}Ready == 0) {
                   xTexelC${a} = getX(batch, xR, xCOffset, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${a}.zw = vec2(0.0);
                   }
                   xTexelC${a}Ready = 1;
                 }

                 if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${a+1}Ready == 0) {
                   xTexelC${a+1} = getX(batch, xR, xC + 1, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xC + 2 >= inDims[1]) {
                     xTexelC${a+1}.zw = vec2(0.0);
                   }
                   xTexelC${a+1}Ready = 1;
                 }

                 xC${a} = vec4(xTexelC${a}.zw, xTexelC${a+1}.zw);
               `,a+1<u&&(d+=`
                   final = vec4(0.0);
                   xCOffset = xC + 1 + strides[1];
                   if(xCOffset >= 0 && xCOffset < inDims[1]) {
                     final = getX(batch, xR, xCOffset, d1);
                   }
                   xC${a+1} = vec4(xTexelC${a+1}.xy, final.xy);
                 `)):(d+=`
                 if(xC >= 0 && xC < inDims[1] && xTexelC${a}Ready == 0) {
                   xTexelC${a} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${a}.zw = vec2(0.0);
                   }
                   xTexelC${a}Ready = 1;
                 }

                 xCOffset = xC + strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${a+1}Ready == 0) {
                   xTexelC${a+1} = getX(batch, xR, xCOffset, d1);
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${a+1}.zw = vec2(0.);
                   }
                   xTexelC${a+1}Ready = 1;
                 }

                 xC${a} = vec4(
                   xTexelC${a}.xy, xTexelC${a+1}.xy);
               `,a+1<u&&(d+=`
                   xC${a+1} = vec4(xTexelC${a}.zw, xTexelC${a+1}.zw);
                 `)));a<u&&(d+=`
             wTexel = getW(r, ${a}, d1, d2);
             dotProd += xC${a}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${e.inChannels}) {
               dotProd += xC${a}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `,a+1<u&&(d+=`
               wTexel = getW(r, ${a+1}, d1, d2);
               dotProd += xC${a+1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${e.inChannels}) {
                 dotProd += xC${a+1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
             `))}d+=`
     }
   
     }
   
     }
   `;let c="",p="";a&&(c=n?`vec4 activation(vec4 a) {
           vec4 b = getPreluActivationWeightsAtOutCoords();
           ${a}
         }`:r?`vec4 activation(vec4 a) {
           vec4 b = getLeakyreluAlphaAtOutCoords();
           ${a}
         }`:`vec4 activation(vec4 x) {
           ${a}
         }`,p="result = activation(result);"),t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
       ${c}

       void main() {
         ivec4 coords = getOutputCoords();
         int batch = coords.x;
         ivec2 xRCCorner = coords.yz * strides - pads;
         int d2 = coords.w;
         int xRCorner = xRCCorner.x;
         int xCCorner = xRCCorner.y;

         //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
         vec4 dotProd = vec4(0.000000000000001);

         ${d}

         vec4 result = dotProd - vec4(0.000000000000001);
         ${t?"result += getBiasAtOutCoords();":""}
         ${p}
         setOutput(result);
       }
     `}}class ro{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec4"},{name:"pad",type:"ivec2"},{name:"stride",type:"ivec2"},{name:"dilation",type:"ivec2"},{name:"inChannels",type:"int"},{name:"itemsPerBlockRow",type:"int"},{name:"outWidth",type:"int"}],this.outputShape=e,this.enableShapeUniforms=eW(this.outputShape.length);const{dataFormat:a}=t,n=eb(),r="channelsLast"===a,i=r?1:2,o=r?2:3,s=this.enableShapeUniforms?"if(blockIndex < outShape[2] && pos < outShape[1]) {":`if(blockIndex < ${e[2]} && pos < ${e[1]}) {`;let l="";for(let e=0;e<=1;e++)for(let t=0;t<=1;t++)l+=`
          blockIndex = rc.z + ${t};
          pos = rc.y + ${e};

          ${s}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${i}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${o}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${r}) {
                  innerDims = vec2(d1, ch);
                  result[${2*e+t}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${2*e+t}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${l}

        ${n.output} = result;
      }
    `}}function rs(e,t){let a=e.length;return a>=3?t?[...e.slice(0,-3),e[a-3]*e[a-2],e[a-1]]:[...e.slice(0,-3),e[a-3],e[a-2]*e[a-1]]:!t&&1===a&&e[0]>1?[e[0],1]:null}function rl({x:e,filter:t,convInfo:a,backend:n,bias:r=null,preluActivationWeights:i=null,leakyreluAlpha:o=0,activation:s=null}){let l,u=e.shape,d=n.texData.get(e.dataId),c=a.inChannels,p=u[0]*u[1]*u[2],h=a.outChannels,f="channelsLast"===a.dataFormat,x=[];if(null!=i){let e=rs(i.shape,f);null!=e&&(i=aG({inputs:{x:i},backend:n,attrs:{shape:e}}),x.push(i))}if(null!=r){let e=rs(r.shape,f);null!=e&&(r=aG({inputs:{x:r},backend:n,attrs:{shape:e}}),x.push(r))}if(!((1===p||1===h)&&c>1e3)&&d.isPacked&&f&&null!=d.texture&&u[2]%2!=0&&v.util.arraysEqual(d.shape.slice(-3),u.slice(-3))){let c=u[0]*u[1]*(u[2]+1),p={dataId:e.dataId,shape:[1,c,a.inChannels],dtype:e.dtype},h=d.shape;d.shape=d.shape.slice(),d.shape[d.shape.length-2]++,v.util.assert(ea(d.shape,p.shape),()=>`packed reshape ${d.shape} to ${p.shape} isn't free`);let f=aG({inputs:{x:t},backend:n,attrs:{shape:[1,a.inChannels,a.outChannels]}});x.push(f);let m=a0({a:p,b:f,backend:n,transposeA:!1,transposeB:!1,bias:r,activation:s,preluActivationWeights:i,leakyreluAlpha:o}),g=n.texData.get(m.dataId);v.util.assert(g.isPacked,()=>"batchMatMul result is expected to be packed"),d.shape=h,g.shape=a.outShape,(l=ay({inputs:{x:m},backend:n})).shape=a.outShape,x.push(m)}else{let u=a.outHeight*a.outWidth,d=aG({inputs:{x:e},backend:n,attrs:{shape:f?[a.batchSize,u,a.inChannels]:[a.batchSize,a.inChannels,u]}}),c=aG({inputs:{x:t},backend:n,attrs:{shape:[1,a.inChannels,a.outChannels]}}),p=a0({a:f?d:c,b:f?c:d,transposeA:!f,transposeB:!1,backend:n,bias:r,activation:s,preluActivationWeights:i,leakyreluAlpha:o});l=aG({inputs:{x:p},backend:n,attrs:{shape:a.outShape}}),x.push(d),x.push(c),x.push(p)}for(let e of x)n.disposeIntermediateTensorInfo(e);return l}function ru({x:e,filter:t,convInfo:a,backend:n,bias:r=null,preluActivationWeights:i=null,leakyreluAlpha:o=0,activation:s=null}){let{filterWidth:l,filterHeight:u,inChannels:d,outWidth:c,outHeight:p,dataFormat:h}=a,f="channelsLast"===h,x=l*u*d,m=p*c,g=[a.batchSize,x,m],C=[];if(null!=i){let e=rs(i.shape,f);null!=e&&(i=aG({inputs:{x:i},backend:n,attrs:{shape:e}}),C.push(i))}if(null!=r){let e=rs(r.shape,f);null!=e&&(r=aG({inputs:{x:r},backend:n,attrs:{shape:e}}),C.push(r))}let b=aG({inputs:{x:t},backend:n,attrs:{shape:[1,x,v.util.sizeFromShape(t.shape)/x]}});C.push(b);let $=new ro(g,a),I=[e.shape,[a.padInfo.top,a.padInfo.left],[a.strideHeight,a.strideWidth],[a.dilationHeight,a.dilationWidth],[a.inChannels],[a.filterWidth*a.inChannels],[a.outWidth]],y=n.runWebGLProgram($,[e],"float32",I),R=aG({inputs:{x:y},backend:n,attrs:{shape:g}});C.push(y),C.push(R);let T=null!=r,w=null!=i,S="leakyrelu"===s,N=s?aP(s,!0):null,E=new aL(f?R.shape:b.shape,f?b.shape:R.shape,f?[a.batchSize,m,a.outChannels]:[a.batchSize,a.outChannels,m],!0,!1,T,N,w,S),k=f?[R,b]:[b,R];if(r&&k.push(r),w&&k.push(i),S){let e=n.makeTensorInfo([],"float32",v.util.createScalarValue(o,"float32"));k.push(e),C.push(e)}let _=n.runWebGLProgram(E,k,"float32"),A=aG({inputs:{x:_},backend:n,attrs:{shape:a.outShape}});for(let e of(C.push(_),C))n.disposeIntermediateTensorInfo(e);return A}let rd={kernelName:am.Conv2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i,filter:o}=a,{strides:s,pad:l,dataFormat:u,dilations:d,dimRoundingMode:c}=r,p=ef.backend_util.convertConv2DDataFormat(u),h=ef.backend_util.computeConv2DInfo(i.shape,o.shape,s,d,l,c,!1,p);if(1===h.filterHeight&&1===h.filterWidth&&1===h.dilationHeight&&1===h.dilationWidth&&1===h.strideHeight&&1===h.strideWidth&&("SAME"===h.padInfo.type||"VALID"===h.padInfo.type))t=rl({x:i,filter:o,convInfo:h,backend:n});else if(h.strideWidth<=2&&"channelsLast"===p&&(0,g.env)().getBool("WEBGL_EXP_CONV")){let e=new ri(h),a=[[h.padInfo.top,h.padInfo.left],[h.strideHeight,h.strideWidth],[h.dilationHeight,h.dilationWidth],[h.inHeight,h.inWidth]];t=n.runWebGLProgram(e,[i,o],"float32",a)}else if((0,g.env)().getBool("WEBGL_CONV_IM2COL"))t=ru({x:i,filter:o,convInfo:h,backend:n});else{let e=new rn(h);t=n.runWebGLProgram(e,[i,o],"float32")}let f=aG({inputs:{x:t},backend:n,attrs:{shape:h.outShape}});return n.disposeIntermediateTensorInfo(t),f}};class rc{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideHeight,a=e.strideWidth,n=e.padInfo.top,r=e.padInfo.left,i="channelsLast"===e.dataFormat;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${n};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${a} - ${r};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              ${i?`float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);`:`float dyValue = getDy(b, d2, yR, yC);
              float xValue = getX(b, d1, xR, xC);
              dotProd += (xValue * dyValue);`}
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class rp{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterHeight,a=e.filterWidth,n=e.strideHeight,r=e.strideWidth,i="channelsLast"===e.dataFormat,o=t-1-e.padInfo.top,s=a-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${o}, ${s});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${i?3:1}];

        ivec2 dyCorner = ivec2(coords[${i?1:2}], coords[${i?2:3}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${a}; wC++) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${a} - 1 - wC;

            for (int d2 = 0; d2 < ${e.outChannels}; d2++) {

              if (${i}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `}}class rh{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideDepth,a=e.strideHeight,n=e.strideWidth,r=e.padInfo.front,i=e.padInfo.top,o=e.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yF = 0; yF < ${e.outDepth}; yF++) {
            int xF = wF + yF * ${t} - ${r};

            if (xF < 0 || xF >= ${e.inDepth}) {
              continue;
            }

            for (int yR = 0; yR < ${e.outHeight}; yR++) {
              int xR = wR + yR * ${a} - ${i};

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int yC = 0; yC < ${e.outWidth}; yC++) {
                int xC = wC + yC * ${n} - ${o};

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class rf{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterDepth,a=e.filterHeight,n=e.filterWidth,r=e.strideDepth,i=e.strideHeight,o=e.strideWidth,s=t-1-e.padInfo.front,l=a-1-e.padInfo.top,u=n-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${s}, ${l}, ${u});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${t}; wF++) {
          float dyF = float(dyFCorner + wF) / ${r}.0;

          if (dyF < 0.0 || dyF >= ${e.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${t} - 1 - wF;

          for (int wR = 0; wR < ${a}; wR++) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = ${a} - 1 - wR;

            for (int wC = 0; wC < ${n}; wC++) {
              float dyC = float(dyCCorner + wC) / ${o}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = ${n} - 1 - wC;

              for (int d2 = 0; d2 < ${e.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let rx={kernelName:am.Conv2DBackpropFilter,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,dy:i}=t,{strides:o,pad:s,dataFormat:l,dimRoundingMode:u,filterShape:d}=n,c=ef.backend_util.convertConv2DDataFormat(l),p=new rc(ef.backend_util.computeConv2DInfo(r.shape,d,o,1,s,u,!1,c));return a.runWebGLProgram(p,[r,i],"float32")}};class rm{constructor(e){this.variableNames=["dy","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"strides",type:"vec2"}],this.outputShape=e.inShape,this.enableShapeUniforms=eW(this.outputShape.length);const t=e.filterHeight,a=e.filterWidth,n=t-1-e.padInfo.top,r=a-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${n}, ${r});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];

        ivec2 dyCorner = ivec2(coords[1], coords[2]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        vec4 result = vec4(0.);
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / strides[0];
          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);
          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${a}; wC++) {
            int wCPerm = ${a} - 1 - wC;

            float dyC = float(dyCCorner + wC) / strides[1];
            bool idyCVal = (dyC >= 0.0) && (dyC < ${e.outWidth}.0)
              && (fract(dyC) == 0.0);
            int idyC = int(dyC);

            float dyC2 = float(dyCCorner + wC + 1) / strides[1];
            bool idyCVal2 = (dyC2 >= 0.0) && (dyC2 < ${e.outWidth}.0)
              && (fract(dyC2) == 0.0);
            int idyC2 = int(dyC2);

            if (idyCVal && idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec4 dySample2 = (idyC / 2 == idyC2 / 2) ?
                  dySample : getDy(batch, idyR, idyC2, d2);

                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));

                dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample2.xy : dySample2.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC2, d2);
                vec2 dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            }
          }
        }
        setOutput(result);
      }
    `}}let rg={kernelName:am.Conv2DBackpropInput,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{dy:r,filter:i}=t,{inputShape:o,strides:s,pad:l,dataFormat:u,dimRoundingMode:d}=n,c=ef.backend_util.convertConv2DDataFormat(u),p=ef.backend_util.computeConv2DInfo(o,i.shape,s,1,l,d,!1,c);if((0,g.env)().getBool("WEBGL_PACK_CONV2DTRANSPOSE")&&"channelsLast"===c){let e=[[p.strideHeight,p.strideWidth]],t=new rm(p);return a.runWebGLProgram(t,[r,i],"float32",e)}{let e=new rp(p);return a.runWebGLProgram(e,[r,i],"float32")}}},rv={kernelName:am.Conv3D,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,filter:i}=t,{strides:o,pad:s,dilations:l}=n,u=new rr(ef.backend_util.computeConv3DInfo(r.shape,i.shape,o,l,s));return a.runWebGLProgram(u,[r,i],"float32")}},rC={kernelName:am.Conv3DBackpropFilterV2,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,dy:i}=t,{strides:o,pad:s,filterShape:l}=n,u=new rh(ef.backend_util.computeConv3DInfo(r.shape,l,o,1,s));return a.runWebGLProgram(u,[r,i],"float32")}},rb={kernelName:am.Conv3DBackpropInputV2,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{dy:r,filter:i}=t,{pad:o,strides:s,inputShape:l}=n,u=new rf(ef.backend_util.computeConv3DInfo(l,i.shape,s,1,o));return a.runWebGLProgram(u,[r,i],"float32")}},r$=aF({opSnippet:aO+`
  return cos(x);
`,packedOpSnippet:`
  vec4 result = cos(x);
  bvec4 isNaN = isnan(x);
  ${a$}
  return result;
`}),rI={kernelName:am.Cos,backendName:"webgl",kernelFunc:r$},ry=aF({opSnippet:`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`}),rR={kernelName:am.Cosh,backendName:"webgl",kernelFunc:ry};class rT{constructor(e,t,a,n,r){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];const[i,o,s,l]=e,[u]=t,[d,c]=a;this.outputShape=[u,d,c,l];const[p,h]=[`${o-1}.0`,`${s-1}.0`],[f,x,m]=d>1?[`${(o-1)/(d-1)}`,"(y2-y1) * height_ratio",`y1*${p} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${p}`],[g,v,C]=c>1?[`${(s-1)/(c-1)}`,"(x2-x1) * width_ratio",`x1*${h} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${h}`];this.userCode=`
      const float height_ratio = float(${f});
      const float width_ratio = float(${g});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${i}) {
          return;
        }

        float height_scale = ${x};
        float width_scale = ${v};

        float in_y = ${m};
        if( in_y < 0.0 || in_y > ${p} ) {
          setOutput(float(${r}));
          return;
        }
        float in_x = ${C};
        if( in_x < 0.0 || in_x > ${h} ) {
          setOutput(float(${r}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${+("bilinear"===n)} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `}}let rw={kernelName:am.CropAndResize,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:a,attrs:n}=e,{image:r,boxes:i,boxInd:o}=t,{cropSize:s,method:l,extrapolationValue:u}=n,d=new rT(r.shape,i.shape,s,l,u);return a.runWebGLProgram(d,[r,i,o],"float32")}};(s=c||(c={})).Prod="*",s.Sum="+";class rS{constructor(e,t,a,n){this.op=e,this.outputShape=t,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];const r=this.outputShape.length,i=this.op===c.Prod?"1.0":"0.0",o=a?i:`getX(${rN(r,"coords",this.op)})`,s=this.outputShape[this.outputShape.length-1];let l="",u="";a?(l=n?`end != ${s-1}`:"end != 0",u=n?"end + 1":"end - 1"):(l=n?`end + pow2 < ${s}`:"end >= pow2",u=n?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${eF(r)} coords = getOutputCoords();
        int end = ${rE(r,"coords",this.op)};
        float val = ${o};
        int pow2 = int(pow(2.0, index));
        if (${l}) {
          int idx = ${u};
          ${rE(r,"coords",this.op)} = idx;
          val ${this.op}= getX(${rN(r,"coords",this.op)});
        }
        setOutput(val);
      }
    `}}function rN(e,t,a){if(1===e)return`${t}`;if(2===e)return`${t}.x, ${t}.y`;if(3===e)return`${t}.x, ${t}.y, ${t}.z`;if(4===e)return`${t}.x, ${t}.y, ${t}.z, ${t}.w`;throw Error(`Cumulative ${a} for rank ${e} is not yet supported`)}function rE(e,t,a){if(1===e)return`${t}`;if(2===e)return`${t}.y`;if(3===e)return`${t}.z`;if(4===e)return`${t}.w`;throw Error(`Cumulative ${a} for rank ${e} is not yet supported`)}function rk(e,t,a,n,r,i){let o=t.shape.length,s=ef.backend_util.getAxesPermutation([n],o),l=t;null!=s&&(l=aZ({inputs:{x:t},backend:a,attrs:{perm:s}}));let u=ef.backend_util.getInnerMostAxes(1,o)[0];if(u!==o-1)throw Error(`WebGL cumprod shader expects an inner-most axis=${t.shape.length-1} but got axis=${n}`);let d=l.shape[u],c=ay({inputs:{x:l},backend:a});for(let t=0;t<=Math.ceil(Math.log2(d))-1;t++){let n=new rS(e,l.shape,!1,i),r=[[t]],o=c;c=a.runWebGLProgram(n,[c],c.dtype,r),a.disposeIntermediateTensorInfo(o)}if(r){let t=new rS(e,l.shape,r,i),n=c;c=a.runWebGLProgram(t,[c],c.dtype),a.disposeIntermediateTensorInfo(n)}if(null!=s){let e=aZ({inputs:{x:c},backend:a,attrs:{perm:ef.backend_util.getUndoAxesPermutation(s)}});return a.disposeIntermediateTensorInfo(c),a.disposeIntermediateTensorInfo(l),e}return c}let r_={kernelName:am.Cumprod,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{axis:i,exclusive:o,reverse:s}=n;return rk(c.Prod,r,a,i,o,s)}},rA={kernelName:am.Cumsum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{axis:i,exclusive:o,reverse:s}=n;return rk(c.Sum,r,a,i,o,s)}},rO={kernelName:am.DenseBincount,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,weights:i}=t,{size:o,binaryOutput:s}=n;if(1===r.shape.length){let e=tl(a.readSync(r.dataId),a.readSync(i.dataId),i.dtype,i.shape,o);return a.makeTensorInfo([o],i.dtype,e)}if(2===r.shape.length){let e=tu(a.bufferSync(r),a.bufferSync(i),o,s);return a.makeTensorInfo(e.shape,i.dtype,e.values)}throw Error(`Error in denseBincount: input must be at most rank 2, but got rank${r.shape.length}.`)}};class rF{constructor(e,t,a){this.variableNames=["x"],this.outputShape=[],this.outputShape=e,this.blockSize=t,this.dataFormat=a,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${t};
      int offset_h = imod(h, ${t});
      int in_w = w / ${t};
      int offset_w = imod(w, ${t});
      int offset_d = (offset_h * ${t} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `}getHeightCoordString(){return"NHWC"===this.dataFormat?"coords[1]":"coords[2]"}getWidthCoordString(){return"NHWC"===this.dataFormat?"coords[2]":"coords[3]"}getDepthCoordString(){return"NHWC"===this.dataFormat?"coords[3]":"coords[1]"}getOutputDepthSize(){return"NHWC"===this.dataFormat?this.outputShape[3]:this.outputShape[1]}getInputSamplingString(){return"NHWC"===this.dataFormat?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}}let rD={kernelName:am.DepthToSpace,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{blockSize:i,dataFormat:o}=n,s=r.shape[0],l="NHWC"===o?r.shape[1]:r.shape[2],u="NHWC"===o?r.shape[2]:r.shape[3],d="NHWC"===o?r.shape[3]:r.shape[1],c=l*i,p=u*i,h=d/(i*i),f=new rF("NHWC"===o?[s,c,p,h]:[s,h,c,p],i,o);return a.runWebGLProgram(f,[r],r.dtype)}};class rP{constructor(e,t=!1,a=null,n=!1,r=!1){this.variableNames=["x","W"],this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=eW(this.outputShape.length);const i=e.filterHeight,o=e.filterWidth,s=e.outChannels/e.inChannels;let l="",u="";a&&(l=n?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${a}
        }`:r?`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${a}
        }`:`
          float activation(float x) {
            ${a}
          }
        `,u="result = activation(result);"),t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${l}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${s};
        int q = d2 - d1 * ${s};

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${i}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${o}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        ${t?"result += getBiasAtOutCoords();":""}
        ${u}
        setOutput(result);
      }
    `}}class rL{constructor(e,t=!1,a=null,n=!1,r=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=eW(this.outputShape.length);const i=e.outChannels/e.inChannels,o=e.padInfo.left,s=e.strideWidth,l=e.dilationWidth,u=e.filterHeight,d=e.filterWidth;let c=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let e=0;e<d;e++)c+=`
          vec4 xTexelC${2*e};
          int xTexelC${2*e}Ready;
          vec4 xTexelC${2*e+1};
          int xTexelC${2*e+1}Ready;
          vec4 xC${e};`;c+=`
    for (int r = 0; r < ${u}; r++) {
      `;for(let e=0;e<d;e++)c+=`
          xTexelC${2*e} = vec4(0.0);
          xTexelC${2*e}Ready = 0;
          xTexelC${2*e+1} = vec4(0.0);
          xTexelC${2*e+1}Ready = 0;
          xC${e} = vec4(0.0);`;c+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let e=0;e<(d+1)/2;e++){const t=2*e;if(c+=`
          xC = xCCorner + ${t*l};
          `,1===s){if(t<d&&(o%2==1?(c+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }
              `,1===l&&t>0?c+=`
                xC${t} = vec4(xTexelC${t-2}.zw, xTexelC${t}.xy);
                `:c+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${t} = vec4(previous.zw, xTexelC${t}.xy);
                  } else {
                    xC${t} = vec4(0.0, 0.0, xTexelC${t}.xy);
                  }
                  `):c+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }

                xC${t} = xTexelC${t};
                `,t+1<d)){const e=o%2==0?v.util.nearestLargerEven(l):l;l%2==0&&o%2==1||l%2!=0&&o%2!=1?(c+=`
                  xCOffset = xC + imod(pads[1], 2) + ${e};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t+1}Ready == 0) {
                    xTexelC${t+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${t+1}.zw = vec2(0.0);
                    }
                    xTexelC${t+1}Ready = 1;
                  }
                  `,l>1?c+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${t+1} = vec4(previous.zw, xTexelC${t+1}.xy);
                    } else {
                     xC${t+1} = vec4(0.0, 0.0, xTexelC${t+1}.xy);
                    }
                    `:c+=`
                    xC${t+1} = vec4(xTexelC${t}.zw, xTexelC${t+1}.xy);
                    `):1===e?c+=`
                    xC${t+1} = xTexelC${t};
                    `:c+=`
                    xCOffset = xC + ${e};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t+1}Ready == 0) {
                      xTexelC${t+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${t+1}.zw = vec2(0.0);
                      }
                      xTexelC${t+1}Ready = 1;
                    }

                    xC${t+1} = xTexelC${t+1};
                    `}}else t<d&&(o%2==1?(c+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${t+1}Ready == 0) {
                  xTexelC${t+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${t+1}.zw = vec2(0.0);
                  }
                  xTexelC${t+1}Ready = 1;
                }

                xC${t} = vec4(xTexelC${t}.zw, xTexelC${t+1}.zw);
              `,t+1<d&&(c+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${t+1} = vec4(xTexelC${t+1}.xy, final.xy);
                `)):(c+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t+1}Ready == 0) {
                  xTexelC${t+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${t+1}.zw = vec2(0.);
                  }
                  xTexelC${t+1}Ready = 1;
                }

                xC${t} = vec4(
                  xTexelC${t}.xy, xTexelC${t+1}.xy);
              `,t+1<d&&(c+=`
                  xC${t+1} = vec4(xTexelC${t}.zw, xTexelC${t+1}.zw);
                `)));t<d&&(c+=`
            wTexel = getW(r, ${t}, d1, q);
            dotProd += xC${t} * vec4(wTexel.xz, wTexel.xz);
          `,t+1<d&&(c+=`
              wTexel = getW(r, ${t+1}, d1, q);
              dotProd += xC${t+1} * vec4(wTexel.xz, wTexel.xz);
            `))}c+=`
    }
  
      }
    `;let p="",h="";a&&(p=n?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${a}
        }`:r?`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${a}
        }`:`vec4 activation(vec4 x) {
          ${a}
        }`,h="result = activation(result);"),t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),r&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${p}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${i};
        int q = d2 - d1 * ${i};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${c}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${t?"result += getBiasAtOutCoords();":""}
        ${h}
        setOutput(result);
      }
    `}}let rB={kernelName:am.DepthwiseConv2dNative,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i,filter:o}=a,{strides:s,pad:l,dilations:u,dimRoundingMode:d}=r,c=u;null==c&&(c=[1,1]),v.util.assert(ef.backend_util.eitherStridesOrDilationsAreOne(s,c),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${s} and dilations '${c}'`);let p=ef.backend_util.computeConv2DInfo(i.shape,o.shape,s,c,l,d,!0);t=(0,g.env)().getBool("WEBGL_PACK_DEPTHWISECONV")&&p.strideWidth<=2&&p.outChannels/p.inChannels==1?new rL(p):new rP(p);let h=[[p.padInfo.top,p.padInfo.left],[p.strideHeight,p.strideWidth],[p.dilationHeight,p.dilationWidth],[p.inHeight,p.inWidth]];return n.runWebGLProgram(t,[i,o],"float32",h)}};class rV{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideHeight,a=e.strideWidth,n=e.padInfo.top,r=e.padInfo.left,i=e.outChannels/e.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${i} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${n};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${a} - ${r};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class rW{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterHeight,a=e.filterWidth,n=e.strideHeight,r=e.strideWidth,i=t-1-e.padInfo.top,o=a-1-e.padInfo.left,s=e.outChannels/e.inChannels;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${o});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${a}; wC++) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${a} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${s}; dm++) {
              int d2 = d1 * ${s} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let rU={kernelName:am.DepthwiseConv2dNativeBackpropFilter,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,dy:i}=t,{strides:o,dilations:s,pad:l,dimRoundingMode:u,filterShape:d}=n,c=new rV(ef.backend_util.computeConv2DInfo(r.shape,d,o,s,l,u,!0));return a.runWebGLProgram(c,[r,i],"float32")}},rG={kernelName:am.DepthwiseConv2dNativeBackpropInput,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{dy:r,filter:i}=t,{strides:o,dilations:s,pad:l,dimRoundingMode:u,inputShape:d}=n,c=new rW(ef.backend_util.computeConv2DInfo(d,i.shape,o,s,l,u,!0));return a.runWebGLProgram(c,[r,i],"float32")}};class rM{constructor(e){this.variableNames=["X"],this.outputShape=[e,e],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `}}let rz={kernelName:am.Diag,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{x:n}=t,r=[...n.shape,...n.shape],i=v.util.sizeFromShape(n.shape),o=aG({inputs:{x:n},backend:a,attrs:{shape:[i]}}),s=new rM(i),l=a.runWebGLProgram(s,[o],o.dtype),u=aG({inputs:{x:l},backend:a,attrs:{shape:r}});return a.disposeIntermediateTensorInfo(o),a.disposeIntermediateTensorInfo(l),u}};class rX{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;const{inHeight:t,inWidth:a,padInfo:n,strideHeight:r,strideWidth:i,filterHeight:o,filterWidth:s,dilationHeight:l,dilationWidth:u}=e,{top:d,left:c}=n;this.userCode=`
      const ivec2 strides = ivec2(${r}, ${i});
      const ivec2 pads = ivec2(${d}, ${c});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${o}; h++) {
          int hIn = hBeg + h * ${l};

          if (hIn >= 0 && hIn < ${t}) {
            for (int w = 0; w < ${s}; w++) {
              int wIn = wBeg + w * ${u};

              if (wIn >= 0 && wIn < ${a}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `}}let rH={kernelName:am.Dilation2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i,filter:o}=a,{strides:s,pad:l,dilations:u}=r,d=ef.backend_util.computeDilation2DInfo(i.shape,o.shape,s,l,"NHWC",u),c=new rX(d),p=aG({inputs:{x:t=n.runWebGLProgram(c,[i,o],"float32")},backend:n,attrs:{shape:d.outShape}});return n.disposeIntermediateTensorInfo(t),p}},rj={kernelName:am.Einsum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{equation:r}=n,{allDims:i,summedDims:o,idDims:s}=ef.backend_util.decodeEinsumEquation(r,t.length);ef.backend_util.checkEinsumDimSizes(i.length,s,t);let{path:l,steps:u}=ef.backend_util.getEinsumComputePath(o,s),d=u.length,c=null,p=i.length,h=[];for(let e=0;e<d;++e){for(let n of u[e]){let e,{permutationIndices:r,expandDims:i}=ef.backend_util.getEinsumPermutation(p,s[n]);ef.backend_util.isIdentityPermutation(r)?e=t[n]:(e=aZ({inputs:{x:t[n]},backend:a,attrs:{perm:r}}),h.push(e));let o=e.shape.slice();for(let e=0;e<i.length;++e)o.splice(i[e],0,1);v.util.arraysEqual(e.shape,o)||(e=aG({inputs:{x:e},backend:a,attrs:{shape:o}}),h.push(e)),null===c?c=e:(c=aW({inputs:{a:e,b:c},backend:a}),h.push(c))}e<d-1&&(l[e]>=0&&(c=aY({inputs:{x:c},backend:a,attrs:{axis:l[e]-(i.length-p),keepDims:!1}}),h.push(c)),p--)}for(let e of h)e!==c&&a.disposeIntermediateTensorInfo(e);return c}},rK=aF({opSnippet:"return (x >= 0.0) ? x : (exp(x) - 1.0);",packedOpSnippet:`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`}),rq={kernelName:am.Elu,backendName:"webgl",kernelFunc:rK},rY=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,rQ={kernelName:am.EluGrad,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:a}=e,{dy:n,y:r}=t,i=(0,g.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new aI(rY,n.shape,r.shape):new ab("return (b >= 0.0) ? a : a * (b + 1.0);",n.shape,r.shape);return a.runWebGLProgram(i,[n,r],n.dtype)}},rZ=aD({opSnippet:"return float(a == b);",packedOpSnippet:`
  return vec4(equal(a, b));
`,dtype:"bool",cpuKernelImpl:tf}),rJ={kernelName:am.Equal,backendName:"webgl",kernelFunc:rZ},r0=aF({opSnippet:`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${ef.backend_util.ERF_P};
  float a1 = ${ef.backend_util.ERF_A1};
  float a2 = ${ef.backend_util.ERF_A2};
  float a3 = ${ef.backend_util.ERF_A3};
  float a4 = ${ef.backend_util.ERF_A4};
  float a5 = ${ef.backend_util.ERF_A5};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`}),r1={kernelName:am.Erf,backendName:"webgl",kernelFunc:r0},r2=aF({opSnippet:aO+`
  return exp(x);
`,packedOpSnippet:`
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,cpuKernelImpl:tx,dtype:"float32"}),r4={kernelName:am.Exp,backendName:"webgl",kernelFunc:r2};function r3(e){let{inputs:t,attrs:a,backend:n}=e,{dim:r}=a,{input:i}=t,o=i.shape.length,s=i.shape.slice(),l=r;return r<0&&(v.util.assert(-(o+1)<=r,()=>`Axis must be in the interval [${-(o+1)}, ${o}]`),l=o+r+1),s.splice(l,0,1),aG({inputs:{x:i},backend:n,attrs:{shape:s}})}let r5={kernelName:am.ExpandDims,backendName:"webgl",kernelFunc:r3},r6="return exp(x) - 1.0;",r8=aF({opSnippet:r6,packedOpSnippet:r6,cpuKernelImpl:tm}),r9={kernelName:am.Expm1,backendName:"webgl",kernelFunc:r8};class r7{constructor(e,t,a){let n;this.variableNames=["real","imag"];const r=t[1];this.outputShape=t;const i=a?`2.0 * ${Math.PI}`:`-2.0 * ${Math.PI}`,o=a?`${r}.0`:"1.0";if("real"===e)n="return real * expR - imag * expI;";else if("imag"===e)n="return real * expI + imag * expR;";else throw Error(`FFT component must be either "real" or "imag", got ${e}.`);this.userCode=`
      const float exponentMultiplier = ${i};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${n}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${r});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${r}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${o};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `}}function ie(e,t,a){let n=a.texData.get(e.dataId),r=v.util.sizeFromShape(e.shape),i=e.shape[e.shape.length-1],o=aG({inputs:{x:e},backend:a,attrs:{shape:[r/i,i]}}),s=o.shape,l=new r7("real",s,t),u=new r7("imag",s,t),d=[{dataId:n.complexTensorInfos.real.dataId,dtype:n.complexTensorInfos.real.dtype,shape:s},{dataId:n.complexTensorInfos.imag.dataId,dtype:n.complexTensorInfos.imag.dtype,shape:s}],c=a.runWebGLProgram(l,d,"float32"),p=a.runWebGLProgram(u,d,"float32"),h=aT({inputs:{real:c,imag:p},backend:a});a.disposeIntermediateTensorInfo(c),a.disposeIntermediateTensorInfo(p);let f=aG({inputs:{x:h},backend:a,attrs:{shape:e.shape}});return a.disposeIntermediateTensorInfo(o),a.disposeIntermediateTensorInfo(h),f}let it={kernelName:am.FFT,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{input:n}=t;return ie(n,!1,a)}};class ia{constructor(e,t){this.outputShape=[],this.customUniforms=[{name:"value",type:"float"}],this.variableNames=["x"],this.outputShape=e,this.userCode=`
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}}function ir(e){let{backend:t,attrs:a}=e,{shape:n,value:r}=a,{dtype:i}=a;if("string"===(i=i||v.util.inferDtype(r))){let e=v.util.getArrayFromDType(i,v.util.sizeFromShape(n));return e.fill(r),t.makeTensorInfo(n,i,e)}{let e=new ia(n,r),a=[[r]];return t.runWebGLProgram(e,[],i,a)}}let ii={kernelName:am.Fill,backendName:"webgl",kernelFunc:ir};class io{constructor(e){this.variableNames=["Image"],this.outputShape=[];const t=e[2];this.outputShape=e,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${t} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${t}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `}}let is={kernelName:am.FlipLeftRight,backendName:"webgl",kernelFunc:({inputs:e,backend:t})=>{let{image:a}=e,n=new io(a.shape);return t.runWebGLProgram(n,[a],a.dtype)}},il="return floor(x);",iu=aF({opSnippet:il,packedOpSnippet:il,cpuKernelImpl:tg}),id={kernelName:am.Floor,backendName:"webgl",kernelFunc:iu},ic=aD({opSnippet:`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,packedOpSnippet:`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,dtype:"int32"}),ip={kernelName:am.FloorDiv,backendName:"webgl",kernelFunc:ic};class ih{constructor(e){this.variableNames=["A"];const t=eb(),[a,n]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${n}.0, ${a}.0);

        vec4 values = ${t.texture2D}(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `}}class ix{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;const t=eb(),[a,n]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${n}.0, ${a}.0);
            vec4 values = ${t.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${t.output} = result;
      }
    `}}let im={kernelName:am.FromPixels,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:r}=e,{pixels:i}=t,{numChannels:o}=r,s="u">typeof HTMLVideoElement&&i instanceof HTMLVideoElement,l="u">typeof HTMLImageElement&&i instanceof HTMLImageElement,[d,c]=s?[i.videoWidth,i.videoHeight]:[i.width,i.height],p=[c,d],h=[c,d,o];if(l||s){let e=(0,g.env)().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(null==n||e!==ig)&&(ig=e,n=document.createElement("canvas").getContext("2d",{willReadFrequently:ig})),n.canvas.width=d,n.canvas.height=c,n.drawImage(i,0,0,d,c),i=n.canvas}let f=a.makeTensorInfo(p,"int32");a.texData.get(f.dataId).usage=u.PIXELS,a.gpgpu.uploadPixelDataToTexture(a.getTexture(f.dataId),i);let x=(0,g.env)().getBool("WEBGL_PACK")?new ix(h):new ih(h),m=a.runWebGLProgram(x,[f],"int32");return a.disposeData(f.dataId),m}},ig=(0,g.env)().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU"),iv={kernelName:am.FusedConv2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i,filter:o,bias:s,preluActivationWeights:l}=a,{strides:u,pad:d,dataFormat:c,dilations:p,dimRoundingMode:h,activation:f,leakyreluAlpha:x}=r,m=ef.backend_util.convertConv2DDataFormat(c),C=ef.backend_util.computeConv2DInfo(i.shape,o.shape,u,p,d,h,!1,m),b=[],$=null!=s,I=null!=l,y="leakyrelu"===f,R=()=>{let e=[i,o],t=(e,t)=>{if("NCHW"===t&&1===e.shape.length&&1!==e.shape[0]){let t=aG({inputs:{x:e},backend:n,attrs:{shape:[e.shape[0],1,1]}});return b.push(t),t}return e};if($&&e.push(t(s,c)),I&&e.push(t(l,c)),y){let t=n.makeTensorInfo([],"float32",v.util.createScalarValue(x,"float32"));e.push(t),b.push(t)}return e};if(1===C.filterHeight&&1===C.filterWidth&&1===C.dilationHeight&&1===C.dilationWidth&&1===C.strideHeight&&1===C.strideWidth&&("SAME"===C.padInfo.type||"VALID"===C.padInfo.type))t=rl({x:i,filter:o,convInfo:C,backend:n,bias:s,activation:f,preluActivationWeights:l,leakyreluAlpha:x});else if(C.strideWidth<=2&&"channelsLast"===m&&(0,g.env)().getBool("WEBGL_EXP_CONV")){let e=new ri(C,$,f?aP(f,!0):null,I,y),a=[[C.padInfo.top,C.padInfo.left],[C.strideHeight,C.strideWidth],[C.dilationHeight,C.dilationWidth],[C.inHeight,C.inWidth]],r=R();t=n.runWebGLProgram(e,r,"float32",a)}else if((0,g.env)().getBool("WEBGL_CONV_IM2COL"))t=ru({x:i,filter:o,convInfo:C,backend:n,bias:s,activation:f,preluActivationWeights:l,leakyreluAlpha:x});else{let e=new rn(C,$,f?aP(f,!1):null,I,y),a=R();t=n.runWebGLProgram(e,a,"float32")}let T=aG({inputs:{x:t},backend:n,attrs:{shape:C.outShape}});return b.push(t),b.forEach(e=>n.disposeIntermediateTensorInfo(e)),T}},iC={kernelName:am.FusedDepthwiseConv2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i,filter:o,bias:s,preluActivationWeights:l}=a,{strides:u,pad:d,dilations:c,dimRoundingMode:p,activation:h,leakyreluAlpha:f}=r,x=[],m=c;null==m&&(m=[1,1]),v.util.assert(ef.backend_util.eitherStridesOrDilationsAreOne(u,m),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${u} and dilations '${m}'`);let C=ef.backend_util.computeConv2DInfo(i.shape,o.shape,u,m,d,p,!0),b=(0,g.env)().getBool("WEBGL_PACK_DEPTHWISECONV")&&C.strideWidth<=2&&C.outChannels/C.inChannels==1,$=h?aP(h,b):null,I=[i,o],y=null!=s,R=null!=l,T="leakyrelu"===h;if(y&&I.push(s),R&&I.push(l),T){let e=n.makeTensorInfo([],"float32",v.util.createScalarValue(f,"float32"));I.push(e),x.push(e)}t=b?new rL(C,y,$,R,T):new rP(C,y,$,R,T);let w=[[C.padInfo.top,C.padInfo.left],[C.strideHeight,C.strideWidth],[C.dilationHeight,C.dilationWidth],[C.inHeight,C.inWidth]],S=n.runWebGLProgram(t,I,"float32",w);return x.forEach(e=>n.disposeIntermediateTensorInfo(e)),S}};class ib{constructor(e,t,a,n){this.sliceDim=e,this.strides=t,this.paramsShape=n,this.variableNames=["x","indices"],this.outputShape=a;const r=eF(a.length);let i=`
    int index;`;for(let e=0;e<this.sliceDim;e++)i+=`
          index = round(getIndices(coords[0], ${e}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[e]};
          flattenIndex += index * ${this.strides[e]};`;this.userCode=`
         void main() {
          ${r} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${i}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `}}let i$={kernelName:am.GatherNd,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{params:n,indices:r}=t,i=r.shape,o=i[i.length-1],s=v.util.sizeFromShape(n.shape),[l,u,d,c]=ef.backend_util.prepareAndValidate(n,r),p=aG({inputs:{x:r},backend:a,attrs:{shape:[u,o]}}),h=aG({inputs:{x:n},backend:a,attrs:{shape:[v.util.sizeFromShape(n.shape)/d,d]}});if(a.shouldExecuteOnCPU([n,r])||"string"===n.dtype){let e=tv(a.readSync(r.dataId),a.bufferSync(n),n.dtype,u,o,d,c,n.shape,s);return a.makeTensorInfo(l,n.dtype,e.values)}let f=new ib(o,c,[u,d],n.shape),x=a.runWebGLProgram(f,[h,p],h.dtype),m=aG({inputs:{x:x},backend:a,attrs:{shape:l}});return a.disposeIntermediateTensorInfo(p),a.disposeIntermediateTensorInfo(h),a.disposeIntermediateTensorInfo(x),m}};class iI{constructor(e,t){this.variableNames=["A","indices"],this.outputShape=t,this.rank=t.length;const a=eF(this.rank),n=function(e){let t=["resRC.x","resRC.y","resRC.z","resRC.w"],a=[];for(let n=0;n<e.length;n++)2===n?a.push("index"):a.push(`${t[n]}`);return a.join()}(e);this.userCode=`
      void main() {
        ${a} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${e[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${n}));
      }
    `}}function iy(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,indices:i}=t,{axis:o,batchDims:s}=n,l=v.util.parseAxisParam(o,r.shape)[0];if((0,g.env)().get("DEBUG")){let e=a.readSync(i.dataId),t=r.shape[l];for(let a=0;a<e.length;++a){let n=e[a];v.util.assert(n<=t-1&&n>=0,()=>`GatherV2: the index value ${n} is not in [0, ${t-1}]`)}}let u=ef.backend_util.segment_util.collectGatherOpShapeInfo(r,i,l,s),d=v.util.sizeFromShape(i.shape),c=[],p=aG({inputs:{x:r},backend:a,attrs:{shape:[u.batchSize,u.outerSize,u.dimSize,u.sliceSize]}}),h=aG({inputs:{x:i},backend:a,attrs:{shape:[u.batchSize,d/u.batchSize]}});c.push(p),c.push(h);let f=[u.batchSize,u.outerSize,d/u.batchSize,u.sliceSize];if(a.shouldExecuteOnCPU([r,i])||"string"===r.dtype){let e=a.bufferSync(h),t=tC(a.bufferSync(p),e,f);return c.forEach(e=>a.disposeIntermediateTensorInfo(e)),a.makeTensorInfo(u.outputShape,t.dtype,t.values)}let x=new iI(p.shape,f),m=a.runWebGLProgram(x,[p,h],p.dtype);c.push(m);let C=aG({inputs:{x:m},backend:a,attrs:{shape:u.outputShape}});return c.forEach(e=>a.disposeIntermediateTensorInfo(e)),C}let iR={kernelName:am.GatherV2,backendName:"webgl",kernelFunc:iy},iT=aD({opSnippet:"return float(a > b);",packedOpSnippet:`
  return vec4(greaterThan(a, b));
`,cpuKernelImpl:tb,dtype:"bool"}),iw={kernelName:am.Greater,backendName:"webgl",kernelFunc:iT},iS=aD({opSnippet:"return float(a >= b);",packedOpSnippet:`
  return vec4(greaterThanEqual(a, b));
`,dtype:"bool",cpuKernelImpl:t$}),iN={kernelName:am.GreaterEqual,backendName:"webgl",kernelFunc:iS},iE={kernelName:am.IFFT,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{input:n}=t;return ie(n,!0,a)}},ik=aF({opSnippet:"return float(!isnan(x) && !isinf(x));",dtype:"bool"}),i_={kernelName:am.IsFinite,backendName:"webgl",kernelFunc:ik},iA=aF({opSnippet:"return float(isinf(x));",dtype:"bool"}),iO={kernelName:am.IsInf,backendName:"webgl",kernelFunc:iA},iF=aF({opSnippet:"return float(isnan(x));",dtype:"bool"}),iD={kernelName:am.IsNan,backendName:"webgl",kernelFunc:iF},iP=aD({opSnippet:"return float(a < b);",packedOpSnippet:`
  return vec4(lessThan(a, b));
`,cpuKernelImpl:tI,dtype:"bool"}),iL={kernelName:am.Less,backendName:"webgl",kernelFunc:iP},iB=aD({opSnippet:"return float(a <= b);",packedOpSnippet:`
  return vec4(lessThanEqual(a, b));
`,cpuKernelImpl:ty,dtype:"bool"}),iV={kernelName:am.LessEqual,backendName:"webgl",kernelFunc:iB},iW={kernelName:am.LinSpace,backendName:"webgl",kernelFunc:function(e){let{backend:t,attrs:a}=e,{start:n,stop:r,num:i}=a,o=tR(n,r,i);return t.makeTensorInfo([o.length],"float32",o)}},iU=aF({opSnippet:aO+`
  return x < 0.0 ? 0./0. : log(x);
`,packedOpSnippet:`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,cpuKernelImpl:tT}),iG={kernelName:am.Log,backendName:"webgl",kernelFunc:iU},iM=aF({opSnippet:aO+`
  return log(1.0 + x);
`}),iz={kernelName:am.Log1p,backendName:"webgl",kernelFunc:iM},iX=aD({opSnippet:"return float(a >= 1.0 && b >= 1.0);",packedOpSnippet:`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,dtype:"bool"}),iH={kernelName:am.LogicalAnd,backendName:"webgl",kernelFunc:iX},ij=aF({opSnippet:"return float(!(x >= 1.0));"}),iK={kernelName:am.LogicalNot,backendName:"webgl",kernelFunc:ij},iq=aD({opSnippet:"return float(a >= 1.0 || b >= 1.0);",packedOpSnippet:`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,dtype:"bool"}),iY={kernelName:am.LogicalOr,backendName:"webgl",kernelFunc:iq};class iQ{constructor(e,t,a,n,r){let i;this.variableNames=["x"],this.outputShape=[];const o=e[3]-1;this.outputShape=e;const s=`float(${a}) + float(${n}) * sum`;i=.5===r?`inversesqrt(${s})`:1===r?`1.0/(${s})`:`exp(log(${s}) * float(-${r}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${t}; j <= ${t}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${o}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${i};
        setOutput(val);
      }
    `}}class iZ{constructor(e,t,a,n,r){let i;this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;const o=e[3]-1;this.outputShape=e;const s=`float(${a}) + float(${n}) * sum`;i=.5===r?`inversesqrt(${s})`:1===r?`1.0/(${s})`:`exp(log(${s}) * float(-${r}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${t};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${t}; j <= ${t}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${o}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${i};
        setOutput(result);
      }
    `}}let iJ={kernelName:am.LRN,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{depthRadius:i,bias:o,alpha:s,beta:l}=n,u=(0,g.env)().getBool("WEBGL_PACK_NORMALIZATION")?new iZ(r.shape,i,o,s,l):new iQ(r.shape,i,o,s,l);return a.runWebGLProgram(u,[r],r.dtype)}};class i0{constructor(e,t,a,n,r){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=e,this.depth=e[3],this.depthRadius=t,this.bias=a,this.alpha=n,this.beta=r,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${t})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${t} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${n}) * norm + float(${a});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${n})
                * float(${r})
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${r});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `}}let i1={kernelName:am.LRNGrad,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:a,attrs:n}=e,{x:r,y:i,dy:o}=t,{depthRadius:s,bias:l,alpha:u,beta:d}=n,c=new i0(r.shape,s,l,u,d);return a.runWebGLProgram(c,[r,i,o],r.dtype)}};function i2(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{reductionIndices:o,keepDims:s}=r,l=i.shape.length,u=v.util.parseAxisParam(o,i.shape),d=u,c=ef.backend_util.getAxesPermutation(d,l),p=null!=c,h=n.shouldExecuteOnCPU([i]),f=i;if(p){if(h){let e=n.texData.get(f.dataId).values,t=Array(l);for(let e=0;e<t.length;e++)t[e]=i.shape[c[e]];let a=t0(e,i.shape,i.dtype,c,t);f=n.makeTensorInfo(t,i.dtype),n.texData.get(f.dataId).values=a}else f=aq(i,c,n);d=ef.backend_util.getInnerMostAxes(d.length,l)}ef.backend_util.assertAxesAreInnerMostDims("max",d,l);let[x,m]=ef.backend_util.computeOutAndReduceShapes(f.shape,d),g=x;if(s&&(g=ef.backend_util.expandShapeToKeepDim(x,u)),h){let e=tw(n.texData.get(f.dataId).values,v.util.sizeFromShape(m),g,i.dtype);t=n.makeTensorInfo(g,i.dtype),n.texData.get(t.dataId).values=e}else{var C,b;let e,a,r,i,o;C=f,b=g,e=v.util.sizeFromShape(m),a=v.util.sizeFromShape(C.shape),i=aH(r=aG({inputs:{x:C},attrs:{shape:[a/e,e]},backend:n}),C.dtype,"max",n),o=aG({inputs:{x:i},attrs:{shape:b},backend:n}),n.disposeIntermediateTensorInfo(r),n.disposeIntermediateTensorInfo(i),t=o}return p&&n.disposeIntermediateTensorInfo(f),t}let i4={kernelName:am.Max,backendName:"webgl",kernelFunc:i2},i3=aD({opSnippet:aC+`
  return max(a, b);
`,packedOpSnippet:`
  vec4 result = vec4(max(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+a$+`
  return result;
`,cpuKernelImpl:tS}),i5={kernelName:am.Maximum,backendName:"webgl",kernelFunc:i3},i6={kernelName:am.MaxPool,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t;ep(r,"maxPool");let{filterSize:i,strides:o,pad:s,dimRoundingMode:l}=n;v.util.assert(ef.backend_util.eitherStridesOrDilationsAreOne(o,1),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`);let u=ef.backend_util.computePool2DInfo(r.shape,i,o,1,s,l);if(1===u.filterWidth&&1===u.filterHeight&&v.util.arraysEqual(u.inShape,u.outShape))return ay({inputs:{x:r},backend:a});let d=new n$(u,"max",!1);return a.runWebGLProgram(d,[r],r.dtype)}},i8={kernelName:am.MaxPool3D,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{filterSize:i,strides:o,pad:s,dataFormat:l,dimRoundingMode:u}=n,d=new nI(ef.backend_util.computePool3DInfo(r.shape,i,o,[1,1,1],s,u,l),"max",!1);return a.runWebGLProgram(d,[r],r.dtype)}};class i9{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;const t=e.strideHeight,a=e.strideWidth,n=e.dilationHeight,r=e.effectiveFilterHeight,i=e.effectiveFilterWidth,o=r-1-e.padInfo.top,s=i-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${o}, ${s});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${r};
          wR += ${n}) {
          float dyR = float(dyRCorner + wR) / ${t}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${i}; wC++) {
            float dyC = float(dyCCorner + wC) / ${a}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${r*i-1} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${i} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `}}class i7{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;const t=e.strideDepth,a=e.strideHeight,n=e.strideWidth,r=e.dilationDepth,i=e.dilationHeight,o=e.dilationWidth,s=e.effectiveFilterDepth,l=e.effectiveFilterHeight,u=e.effectiveFilterWidth,d=s-1-e.padInfo.front,c=l-1-e.padInfo.top,p=u-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${d}, ${c}, ${p});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${s};
           wD += ${r}) {
          float dyD = float(dyDCorner + wD) / ${t}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${l};
              wR += ${i}) {
            float dyR = float(dyRCorner + wR) / ${a}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${u};
                wC += ${o}) {
              float dyC = float(dyCCorner + wC) / ${n}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${s*l*u-1} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${l} * ${u} +
                  wR * ${u} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let oe={kernelName:am.MaxPool3DGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{dy:r,input:i}=t,{filterSize:o,strides:s,pad:l,dimRoundingMode:u}=n,d=ef.backend_util.computePool3DInfo(i.shape,o,s,[1,1,1],l,u),c=new nI(d,"max",!0),p=a.runWebGLProgram(c,[i],i.dtype),h=new i7(d),f=a.runWebGLProgram(h,[r,p],i.dtype);return a.disposeIntermediateTensorInfo(p),f}},ot={kernelName:am.MaxPoolGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{dy:r,input:i,output:o}=t;ep([i,o],"maxPoolGrad");let{filterSize:s,strides:l,pad:u,dimRoundingMode:d}=n,c=ef.backend_util.computePool2DInfo(i.shape,s,l,1,u,d),p=new n$(c,"max",!0),h=a.runWebGLProgram(p,[i],i.dtype),f=new i9(c),x=a.runWebGLProgram(f,[r,h],i.dtype);return a.disposeIntermediateTensorInfo(h),x}},oa={kernelName:am.MaxPoolWithArgmax,backendName:"webgl",kernelFunc:({inputs:e,attrs:t,backend:a})=>{let n,r,{x:i}=e,{filterSize:o,strides:s,pad:l,includeBatchInIndex:u}=t;v.util.assert(4===i.shape.length,()=>`Error in maxPool: input must be rank 4 but got rank ${i.shape.length}.`);let d=[1,1];v.util.assert(ef.backend_util.eitherStridesOrDilationsAreOne(s,d),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${s} and dilations '${d}'`);let c=ef.backend_util.computePool2DInfo(i.shape,o,s,d,l),[p,h]=(n=new n$(c,"max",!1),r=a.runWebGLProgram(n,[i],"float32"),n=new n$(c,"max",!0,!0,u),[r,a.runWebGLProgram(n,[i],"float32")]);return[p,h]}},on={kernelName:am.Mean,backendName:"webgl",kernelFunc:({inputs:e,attrs:t,backend:a})=>{var n,r;let i,o,s,l,u,{x:d}=e,{keepDims:c,axis:p}=t,h=d.shape.length,f=v.util.parseAxisParam(p,d.shape),x=f,m=ef.backend_util.getAxesPermutation(x,h),g=null!=m,C=a.shouldExecuteOnCPU([d]),b=[],$=d;if(g){if(C){let e=a.texData.get($.dataId).values,t=Array(h);for(let e=0;e<t.length;e++)t[e]=d.shape[m[e]];let n=t0(e,d.shape,d.dtype,m,t);$=a.makeTensorInfo(t,d.dtype),a.texData.get($.dataId).values=n}else $=aq(d,m,a);b.push($),x=ef.backend_util.getInnerMostAxes(x.length,h)}ef.backend_util.assertAxesAreInnerMostDims("sum",x,h);let[I,y]=ef.backend_util.computeOutAndReduceShapes($.shape,x),R=I;c&&(R=ef.backend_util.expandShapeToKeepDim(I,f));let T=(n=$,r=R,i=v.util.sizeFromShape(y),o=v.util.sizeFromShape(n.shape),l=aH(s=aG({inputs:{x:n},attrs:{shape:[o/i,i]},backend:a}),"float32","mean",a),u=aG({inputs:{x:l},attrs:{shape:r},backend:a}),a.disposeIntermediateTensorInfo(s),a.disposeIntermediateTensorInfo(l),u);for(let e of b)a.disposeIntermediateTensorInfo(e);return T}},or={kernelName:am.Min,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{axis:o,keepDims:s}=r,l=i.shape.length,u=v.util.parseAxisParam(o,i.shape),d=u,c=ef.backend_util.getAxesPermutation(d,l),p=i;null!=c&&(p=aZ({inputs:{x:i},backend:n,attrs:{perm:c}}),d=ef.backend_util.getInnerMostAxes(d.length,i.shape.length)),ef.backend_util.assertAxesAreInnerMostDims("min",d,l);let[h,f]=ef.backend_util.computeOutAndReduceShapes(p.shape,d),x=aG({inputs:{x:p},backend:n,attrs:{shape:[-1,v.util.sizeFromShape(f)]}}),m=aH(x,x.dtype,"min",n);return t=s?aG({inputs:{x:m},backend:n,attrs:{shape:ef.backend_util.expandShapeToKeepDim(h,u)}}):aG({inputs:{x:m},backend:n,attrs:{shape:h}}),n.disposeIntermediateTensorInfo(x),n.disposeIntermediateTensorInfo(m),null!=c&&n.disposeIntermediateTensorInfo(p),t}},oi=aD({opSnippet:aC+`
  return min(a, b);
`,packedOpSnippet:`
  vec4 result = vec4(min(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+a$+`
  return result;
`,cpuKernelImpl:tN}),oo={kernelName:am.Minimum,backendName:"webgl",kernelFunc:oi};class os{constructor(e,t,a){this.variableNames=["x"],this.outputShape=t.map((t,a)=>t[0]+e[a]+t[1]);const n=e.length,r=eF(n),i=t.map(e=>e[0]).join(","),o=t.map((t,a)=>t[0]+e[a]).join(","),s=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n),l=+("reflect"!==a);if(1===n){this.userCode=`
        int start = ${i};
        int end = ${o};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${l};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${l};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${r} start = ${r}(${i});
      ${r} end = ${r}(${o});

      void main() {
        ${r} outC = getOutputCoords();
        for (int i = 0; i < ${n}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${l};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${l};
          }
        }
        ${r} coords = outC - start;
        setOutput(getX(${s}));
      }
    `}}class ol{constructor(e,t,a){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t.map((t,a)=>t[0]+e[a]+t[1]);const n=e.length,r=eF(n),i=t.map(e=>e[0]).join(","),o=t.map((t,a)=>t[0]+e[a]).join(","),s=t4("rc",n),l=t4("source",n),u=`${s[n-1]} < ${this.outputShape[n-1]}`,d=1===n?"source":`vec2(${l.slice(-2).join()})`,c=+("reflect"!==a);let p="";if(1===n){const e=`
        ${r} source = rc;
        if (source < start) {
          source = start * 2 - source - ${c};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${c};
        }
        source -= start;
      `;p=`
        ${r} rc = outputLoc;
        ${e}
        result[0] = getChannel(getX(${l.join()}), ${d});
        ${s[n-1]} += 1;
        if(${u}) {
          ${e}
          result[1] = getChannel(getX(${l.join()}), ${d});
        }
      `}else{const e=`
        ${r} source = rc;
        ${r} lt = ${r}(lessThan(source, start));
        ${r} gte = ${r}(greaterThanEqual(source, end));
        ${r} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${c}) +
                gte * ((end - 1) * 2 - source + ${c});
        source -= start;
      `;p=`
        ${r} rc = outputLoc;
        ${e}
        result[0] = getChannel(getX(${l.join()}), ${d});
        ${s[n-1]} += 1;
        if(${u}) {
          ${e}
          result[1] = getChannel(getX(${l.join()}), ${d});
        }
        rc = outputLoc;
        ${s[n-2]} += 1;
        if(${s[n-2]} < ${this.outputShape[n-2]}) {
          ${e}
          result[2] = getChannel(getX(${l.join()}), ${d});
          ${s[n-1]} += 1;
          if(${u}) {
            ${e}
            result[3] = getChannel(getX(${l.join()}), ${d});
          }
        }
      `}this.userCode=`
      const ${r} start = ${r}(${i});
      const ${r} end = ${r}(${o});

      void main() {
        ${r} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${p}
        setOutput(result);
      }
    `}}let ou={kernelName:am.MirrorPad,backendName:"webgl",kernelFunc:({inputs:e,backend:t,attrs:a})=>{let{x:n}=e,{paddings:r,mode:i}=a,o=(0,g.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new ol(n.shape,r,i):new os(n.shape,r,i);return t.runWebGLProgram(o,[n],n.dtype)}},od=aD({opSnippet:`if (b == 0.0) return NAN;
  return mod(a, b);`,packedOpSnippet:`
  vec4 result = mod(a, b);
  bvec4 isNaN = equal(b, vec4(0.0));
  `+a$+`
  return result;
`}),oc={kernelName:am.Mod,backendName:"webgl",kernelFunc:od};class op{constructor(e,t,a){this.variableNames=["probs"],this.customUniforms=[{name:"seed",type:"float"}],this.outputShape=[e,a],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${t-1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${t-1}));
      }
    `}}let oh=aD({opSnippet:`
if (a == b) {
  return 1.0;
};
return a / b;`,packedOpSnippet:`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,checkOutOfBounds:!0}),of={kernelName:am.RealDiv,backendName:"webgl",kernelFunc:oh},ox="return a - b;",om=aD({opSnippet:ox,packedOpSnippet:ox,supportsComplex:!0,cpuKernelImpl:tQ}),og={kernelName:am.Sub,backendName:"webgl",kernelFunc:om};function ov(e){let{inputs:t,backend:a,attrs:n}=e,{logits:r}=t,{dim:i}=n,o=v.util.parseAxisParam([i],r.shape),s=i2({inputs:{x:r},backend:a,attrs:{reductionIndices:o,keepDims:!1}}),l=ef.backend_util.expandShapeToKeepDim(s.shape,o),u=aG({inputs:{x:s},backend:a,attrs:{shape:l}}),d=om({inputs:{a:r,b:u},backend:a}),c=r2({inputs:{x:d},backend:a}),p=aY({inputs:{x:c},backend:a,attrs:{axis:o,keepDims:!1}}),h=aG({inputs:{x:p},backend:a,attrs:{shape:l}}),f=oh({inputs:{a:c,b:h},backend:a});return a.disposeIntermediateTensorInfo(s),a.disposeIntermediateTensorInfo(u),a.disposeIntermediateTensorInfo(d),a.disposeIntermediateTensorInfo(c),a.disposeIntermediateTensorInfo(p),a.disposeIntermediateTensorInfo(h),f}let oC={kernelName:am.Softmax,backendName:"webgl",kernelFunc:ov},ob={kernelName:am.Multinomial,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{logits:r}=t,{numSamples:i,seed:o,normalized:s}=n,l=s?r:ov({inputs:{logits:r},backend:a,attrs:{dim:r.shape.length-1}}),u=new op(l.shape[0],l.shape[1],i),d=a.runWebGLProgram(u,[l],"int32",[[o]]);return s||a.disposeIntermediateTensorInfo(l),d}},o$=at+`
  return -x;
`,oI=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,oy={kernelName:am.Neg,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n}=e,{x:r}=a;if(n.shouldExecuteOnCPU([r])){let[e,t]=tk(n.texData.get(r.dataId).values,r.shape,r.dtype);return n.makeTensorInfo(t,r.dtype,e)}return t=(0,g.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS")?new au(r.shape,oI):new ae(r.shape,o$),n.runWebGLProgram(t,[r],r.dtype)}},oR=eg.kernel_impls.nonMaxSuppressionV3Impl,oT={kernelName:am.NonMaxSuppressionV3,backendName:"webgl",kernelFunc:function(e){ef.backend_util.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:a,attrs:n}=e,{boxes:r,scores:i}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:l}=n,{selectedIndices:u}=oR(a.readSync(r.dataId),a.readSync(i.dataId),o,s,l);return a.makeTensorInfo([u.length],"int32",new Int32Array(u))}},ow=eg.kernel_impls.nonMaxSuppressionV4Impl,oS={kernelName:am.NonMaxSuppressionV4,backendName:"webgl",kernelFunc:function(e){ef.backend_util.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:a,attrs:n}=e,{boxes:r,scores:i}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:l,padToMaxOutputSize:u}=n,{selectedIndices:d,validOutputs:c}=ow(a.readSync(r.dataId),a.readSync(i.dataId),o,s,l,u);return[a.makeTensorInfo([d.length],"int32",new Int32Array(d)),a.makeTensorInfo([],"int32",new Int32Array([c]))]}},oN=eg.kernel_impls.nonMaxSuppressionV5Impl,oE={kernelName:am.NonMaxSuppressionV5,backendName:"webgl",kernelFunc:function(e){ef.backend_util.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:a,attrs:n}=e,{boxes:r,scores:i}=t,{maxOutputSize:o,iouThreshold:s,scoreThreshold:l,softNmsSigma:u}=n,{selectedIndices:d,selectedScores:c}=oN(a.readSync(r.dataId),a.readSync(i.dataId),o,s,l,u);return[a.makeTensorInfo([d.length],"int32",new Int32Array(d)),a.makeTensorInfo([c.length],"float32",new Float32Array(c))]}};class ok{constructor(e,t,a,n){this.variableNames=["indices"],this.outputShape=[e,t],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${n}), float(${a}),
                      float(index == coords.y)));
      }
    `}}let o_={kernelName:am.OneHot,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:a,attrs:n}=e,{indices:r}=t,{dtype:i,depth:o,onValue:s,offValue:l}=n,u=v.util.sizeFromShape(r.shape),d=new ok(u,o,s,l),c=aG({inputs:{x:r},backend:a,attrs:{shape:[u]}}),p=a.runWebGLProgram(d,[c],i);a.disposeIntermediateTensorInfo(c);let h=aG({inputs:{x:p},backend:a,attrs:{shape:[...r.shape,o]}});return a.disposeIntermediateTensorInfo(p),h}};function oA(e){let{inputs:t,backend:a}=e,{x:n}=t;if("complex64"!==n.dtype)return ir({attrs:{shape:n.shape,dtype:n.dtype,value:"string"===n.dtype?"":0},backend:a});{let e=nK({inputs:{input:n},backend:a}),t=oA({inputs:{x:e},backend:a}),r=n7({inputs:{input:n},backend:a}),i=oA({inputs:{x:r},backend:a}),o=aT({inputs:{real:t,imag:i},backend:a});return a.disposeIntermediateTensorInfo(e),a.disposeIntermediateTensorInfo(t),a.disposeIntermediateTensorInfo(r),a.disposeIntermediateTensorInfo(i),o}}let oO={kernelName:am.ZerosLike,backendName:"webgl",kernelFunc:oA},oF={kernelName:am.OnesLike,backendName:"webgl",kernelFunc:function e(t){let{inputs:a,backend:n}=t,{x:r}=a;if("string"===r.dtype)throw Error("onesLike is not supported under string dtype");if("complex64"!==r.dtype)return ir({attrs:{shape:r.shape,dtype:r.dtype,value:1},backend:n});{let t=nK({inputs:{input:r},backend:n}),a=e({inputs:{x:t},backend:n}),i=n7({inputs:{input:r},backend:n}),o=oA({inputs:{x:i},backend:n}),s=aT({inputs:{real:a,imag:o},backend:n});return n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(a),n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(o),s}}},oD={kernelName:am.Pack,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{axis:r}=n;if(1===t.length)return r3({inputs:{input:t[0]},backend:a,attrs:{dim:r}});let i=t[0].shape,o=t[0].dtype;t.forEach(e=>{v.util.assertShapesMatch(i,e.shape,"All tensors passed to stack must have matching shapes"),v.util.assert(o===e.dtype,()=>"All tensors passed to stack must have matching dtypes")});let s=[],l=rt({inputs:t.map(e=>{let t=r3({inputs:{input:e},backend:a,attrs:{dim:r}});return s.push(t),t}),backend:a,attrs:{axis:r}});return s.forEach(e=>a.disposeIntermediateTensorInfo(e)),l}};class oP{constructor(e,t,a){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((t,a)=>t[0]+e[a]+t[1]);const n=e.length,r=eF(n),i=t.map(e=>e[0]).join(","),o=t.map((t,a)=>t[0]+e[a]).join(","),s=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n);if(1===n){this.userCode=`
        int start = ${i};
        int end = ${o};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${r} start = ${r}(${i});
      ${r} end = ${r}(${o});

      void main() {
        ${r} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${r} coords = outC - start;
          setOutput(getX(${s}));
        }
      }
    `}}class oL{constructor(e,t,a){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((t,a)=>t[0]+e[a]+t[1]);const n=e.length,r=eF(n),i=t.map(e=>e[0]).join(","),o=t.map((t,a)=>t[0]+e[a]).join(","),s=t4("rc",n),l=t4("source",n),u=`${s[n-1]} < ${this.outputShape[n-1]}`,d=1===n?"source":`vec2(${l.slice(-2).join()})`,c=[`${r} rc = outputLoc;`,`${s[n-1]} += 1;
       if(${u}) {
      `,1===n?"":`}
       rc = outputLoc;
       ${s[n-2]} += 1;
       if(${s[n-2]} < ${this.outputShape[n-2]}) {`,1===n?"":`  ${s[n-1]} += 1;
         if(${u}) {`],p=1===n?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))";let h="";for(let e=0,t=1===n?2:4;e<t;e++)h+=`
        ${c[e]}
        if (${p}) {
          result[${e}] = float(value);
        } else {
          ${r} source = rc - start;
          result[${e}] = getChannel(getX(${l.join()}), ${d});
        }
      `;h+=1===n?"} ":"}}",this.userCode=`
      const ${r} start = ${r}(${i});
      const ${r} end = ${r}(${o});

      void main() {
        ${r} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${h}
        setOutput(result);
      }
    `}}let oB=e=>{let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{paddings:i,constantValue:o}=n;if(0===v.util.sizeFromShape(r.shape))return ir({backend:a,attrs:{shape:i.map((e,t)=>e[0]+r.shape[t]+e[1]),value:o,dtype:r.dtype}});let s=(0,g.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new oL(r.shape,i,o):new oP(r.shape,i,o),l=[[o]];return a.runWebGLProgram(s,[r],r.dtype,l)},oV={kernelName:am.PadV2,backendName:"webgl",kernelFunc:oB},oW=aD({opSnippet:`
  if(a < 0.0 && floor(b) < b){
    return NAN;
  }
  if (b == 0.0) {
    return 1.0;
  }
  return (round(mod(b, 2.0)) != 1) ?
      pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,packedOpSnippet:`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  bvec4 isNaN1 = lessThan(a, vec4(0.0));
  bvec4 isNaN2 = lessThan(floor(b), b);
  bvec4 isNaN = bvec4(isNaN1.x && isNaN2.x, isNaN1.y && isNaN2.y, isNaN1.z && isNaN2.z, isNaN1.w && isNaN2.w);
  `+a$+`
  return result;
`}),oU={kernelName:am.Pow,backendName:"webgl",kernelFunc:oW},oG={kernelName:am.Prod,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{axis:o,keepDims:s}=r,l=i.shape.length,u=[],d=v.util.parseAxisParam(o,i.shape),c=d,p=ef.backend_util.getAxesPermutation(c,l),h=i;if(null!=p&&(h=aZ({inputs:{x:i},backend:n,attrs:{perm:p}}),c=ef.backend_util.getInnerMostAxes(c.length,l),u.push(h)),ef.backend_util.assertAxesAreInnerMostDims("prod",c,l),n.shouldExecuteOnCPU([h])){let e=n.texData.get(h.dataId).values,{outVals:a,outShape:r,outDtype:i}=tA(h.shape,h.dtype,e,c);t=n.makeTensorInfo(r,i,a)}else{let[e,a]=ef.backend_util.computeOutAndReduceShapes(h.shape,c),r=aG({inputs:{x:h},backend:n,attrs:{shape:[-1,v.util.sizeFromShape(a)]}}),o=aH(r,(0,av.sumOutType)(i.dtype),"prod",n);t=aG({inputs:{x:o},backend:n,attrs:{shape:e}}),u.push(r),u.push(o)}if(s){u.push(t);let e=ef.backend_util.expandShapeToKeepDim(t.shape,d);t=aG({inputs:{x:t},backend:n,attrs:{shape:e}})}return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),t}},oM={kernelName:am.RaggedGather,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{paramsNestedSplits:r,paramsDenseValues:i,indices:o}=t,{outputRaggedRank:s}=n,l=r.map(e=>a.readSync(e.dataId)),u=r.map(e=>e.shape),d=a.readSync(i.dataId),c=a.readSync(o.dataId),[p,h,f]=tO(l,u,d,i.shape,i.dtype,c,o.shape,s),x=p.map(e=>a.makeTensorInfo([e.length],"int32",e)),m=a.makeTensorInfo(f,i.dtype,h);return x.concat([m])}},oz={kernelName:am.RaggedRange,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{starts:n,limits:r,deltas:i}=t,o=a.readSync(n.dataId),s=a.readSync(r.dataId),l=a.readSync(i.dataId),[u,d]=tF(o,n.shape,n.dtype,s,r.shape,l,i.shape);return[a.makeTensorInfo([u.length],"int32",u),a.makeTensorInfo([d.length],n.dtype,d)]}},oX={kernelName:am.RaggedTensorToTensor,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{shape:r,values:i,defaultValue:o,rowPartitionTensors:s}=t,{rowPartitionTypes:l}=n,u=a.readSync(r.dataId),d=a.readSync(i.dataId),c=a.readSync(o.dataId),p=s.map(e=>a.readSync(e.dataId)),h=s.map(e=>e.shape),[f,x]=tD(u,r.shape,d,i.shape,i.dtype,c,o.shape,p,h,l);return a.makeTensorInfo(f,i.dtype,x)}},oH=e=>{let{backend:t,attrs:a}=e,{start:n,stop:r,step:i,dtype:o}=a,s=tP(n,r,i,o);return t.makeTensorInfo([s.length],o,s)},oj={kernelName:am.Range,backendName:"webgl",kernelFunc:oH},oK=aF({opSnippet:"return 1.0 / x;"}),oq={kernelName:am.Reciprocal,backendName:"webgl",kernelFunc:oK},oY=aF({opSnippet:at+`
  return (x < 0.0) ? 0.0 : x;
`,packedOpSnippet:`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`}),oQ={kernelName:am.Relu,backendName:"webgl",kernelFunc:oY},oZ=aF({opSnippet:at+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,packedOpSnippet:`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`}),oJ={kernelName:am.Relu6,backendName:"webgl",kernelFunc:oZ};class o0{constructor(e,t,a,n,r){this.variableNames=["A"],this.outputShape=[];const[i,o,s,l]=e;this.outputShape=[i,t,a,l];const u=[n&&t>1?o-1:o,n&&a>1?s-1:s],d=[n&&t>1?t-1:t,n&&a>1?a-1:a];this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/d[0]},
          ${u[1]/d[1]});
      const vec2 inputShapeRC = vec2(${o}.0, ${s}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${r?"(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC - vec2(0.5)":"vec2(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `}}class o1{constructor(e,t,a,n,r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[i,o,s,l]=e;this.outputShape=[i,t,a,l];const u=[n&&t>1?o-1:o,n&&a>1?s-1:s],d=[n&&t>1?t-1:t,n&&a>1?a-1:a];this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/d[0]},
          ${u[1]/d[1]},
          ${u[1]/d[1]});
      const vec3 inputShapeRC = vec3(${o}.0, ${s}.0,
                                     ${s}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${r?"(vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC - vec3(0.5)":"vec3(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${a-1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `}}let o2={kernelName:am.ResizeBilinear,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{images:r}=t,{alignCorners:i,halfPixelCenters:o,size:s}=n,[l,u]=s,d=(0,g.env)().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new o1(r.shape,l,u,i,o):new o0(r.shape,l,u,i,o);return a.runWebGLProgram(d,[r],"float32")}};class o4{constructor(e,t,a){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;const[,n,r]=t,[,i,o]=e,s=[a&&i>1?n-1:n,a&&o>1?r-1:r],l=[a&&i>1?i-1:i,a&&o>1?o-1:o],u=s[0]/l[0],d=s[1]/l[1],c=1/u,p=1/d,h=2*Math.ceil(c)+2,f=2*Math.ceil(p)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${d});

        const float invHeightScale = float(${c});
        const float invWidthScale = float(${p});

        const int winHeight = int(${h});
        const int winWidth = int(${f});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${o}) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${n-1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${r-1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}let o3={kernelName:am.ResizeBilinearGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{images:r,dy:i}=t,{alignCorners:o}=n,s=new o4(i.shape,r.shape,o);return a.runWebGLProgram(s,[i],i.dtype)}};class o5{constructor(e,t,a,n,r){this.variableNames=["A"],this.outputShape=[];const[i,o,s,l]=e;this.outputShape=[i,t,a,l];const u=[n&&t>1?o-1:o,n&&a>1?s-1:s],d=[n&&t>1?t-1:t,n&&a>1?a-1:a];this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/d[0]},
          ${u[1]/d[1]});
      const vec2 inputShapeRC = vec2(${o}.0, ${s}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${r?"max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":"vec2(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${n?"0.5":"0.0"})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `}}class o6{constructor(e,t,a,n,r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[i,o,s,l]=e;this.outputShape=[i,t,a,l];const u=[n&&t>1?o-1:o,n&&a>1?s-1:s],d=[n&&t>1?t-1:t,n&&a>1?a-1:a];this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/d[0]},
          ${u[1]/d[1]},
          ${u[1]/d[1]});
      const vec3 inputShapeRC = vec3(${o}.0, ${s}.0,
                                     ${s}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${r?"max((vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC, vec3(0.0))":"vec3(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${n?"0.5":"0.0"})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${a-1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `}}let o8={kernelName:am.ResizeNearestNeighbor,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{images:r}=t,{alignCorners:i,halfPixelCenters:o,size:s}=n,[l,u]=s,d=(0,g.env)().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new o6(r.shape,l,u,i,o):new o5(r.shape,l,u,i,o);return a.runWebGLProgram(d,[r],r.dtype)}};class o9{constructor(e,t,a){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;const[,n,r]=t,[,i,o]=e,s=[a&&i>1?n-1:n,a&&o>1?r-1:r],l=[a&&i>1?i-1:i,a&&o>1?o-1:o],u=s[0]/l[0],d=s[1]/l[1],c=1/u,p=1/d,h=2*Math.ceil(c)+2,f=2*Math.ceil(p)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${d});

        const float invHeightScale = float(${c});
        const float invWidthScale = float(${p});

        const int winHeight = int(${h});
        const int winWidth = int(${f});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${o}) {
              continue;
            }

            float sourceFracRow =
              float(${s[0]}) *
                (float(dyR) / float(${l[0]}));

            float sourceFracCol =
                float(${s[1]}) *
                  (float(dyC) / float(${l[1]}));

            int sourceNearestRow = int(min(
                float(int(${n}) - 1),
                ${a} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${r}) - 1),
                ${a} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}let o7={kernelName:am.ResizeNearestNeighborGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{images:r,dy:i}=t,{alignCorners:o}=n,s=new o9(i.shape,r.shape,o);return a.runWebGLProgram(s,[i],i.dtype)}};class se{constructor(e,t){this.variableNames=["x"];const a=e.length;if(a>4)throw Error(`WebGL backend: Reverse of rank-${a} tensor is not yet supported`);if(this.outputShape=e,1===a){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${e[0]} - coord - 1));
        }
      `;return}const n=e.map((a,n)=>-1!==t.indexOf(n)&&1!==e[n]?`${e[n]} - coords[${n}] - 1`:`coords[${n}]`).join(","),r=eF(a);this.userCode=`
      void main() {
        ${r} coords = getOutputCoords();
        setOutput(getX(${n}));
      }
    `}}class st{constructor(e,t){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;const a=e.length;if(a>4)throw Error(`WebGL backend: Reverse of rank-${a} tensor is not yet supported`);this.outputShape=e;const n=t4("rc",a),r=`${n[a-1]} + 1 < ${this.outputShape[a-1]}`,i=`${n[a-2]} + 1 < ${this.outputShape[a-2]}`,o=eF(a);function s(a){let n=e.map((n,r)=>{var i,o;return i=r,o=a,-1!==t.indexOf(i)&&1!==e[i]?`${e[i]} - ${o[i]} - 1`:`${o[i]}`}),r=n.join(","),i=n.slice(-2).join(",");return`getChannel(getX(${r}), vec2(${i}))`}1===a?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${e[0]} - rc - 1),
            ${e[0]} - rc - 1);
          if(${r}){
              result.g = getChannel(getX(${e[0]} - (rc  + 1) - 1),
                ${e[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${o} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${function(e){return s(e)}(n.slice())};
          if(${r}){
            result.g = ${function(e){return e[a-1]="("+e[a-1]+" + 1)",s(e)}(n.slice())};
          }
          if(${i}) {
            result.b = ${function(e){return e[a-2]="("+e[a-2]+" + 1)",s(e)}(n.slice())};
            if(${r}) {
              result.a = ${function(e){return e[a-1]="("+e[a-1]+" + 1)",e[a-2]="("+e[a-2]+" + 1)",s(e)}(n.slice())};
            }
          }
          setOutput(result);
        }
    `}}let sa={kernelName:am.Reverse,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{dims:i}=n,o=r.shape.length,s=v.util.parseAxisParam(i,r.shape);if(0===o)return ay({inputs:{x:r},backend:a});let l=(0,g.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new st(r.shape,s):new se(r.shape,s);return a.runWebGLProgram(l,[r],r.dtype)}};class sn{constructor(e,t){this.variableNames=["Image"],this.outputShape=[],this.customUniforms=[{name:"params",type:"vec4"}];const a=e[1],n=e[2];this.outputShape=e;let r="";r="number"==typeof t?`float outputValue = ${t.toFixed(2)};`:`
        vec3 fill = vec3(${t.join(",")});
        float outputValue = fill[coords[3]];`,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${r}
          if(coordX >= 0 && coordX < ${n} && coordY >= 0 && coordY < ${a}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `}}let sr={kernelName:am.RotateWithOffset,backendName:"webgl",kernelFunc:({inputs:e,attrs:t,backend:a})=>{let{image:n}=e,{radians:r,fillValue:i,center:o}=t,s=new sn(n.shape,i),[l,u]=ef.backend_util.getImageCenter(o,n.shape[1],n.shape[2]),d=[[l,u,Math.sin(r),Math.cos(r)]];return a.runWebGLProgram(s,[n],n.dtype,d)}},si=aF({opSnippet:`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`}),so={kernelName:am.Round,backendName:"webgl",kernelFunc:si},ss=aF({opSnippet:"return inversesqrt(x);",cpuKernelImpl:tL}),sl={kernelName:am.Rsqrt,backendName:"webgl",kernelFunc:ss};class su{constructor(e,t,a,n,r,i,o=!0,s=!1){this.variableNames=["updates","indices","defaultValue"],this.outputShape=i;const l=eF(r.length),u=eF(i.length);let d="";1===a?d="i":2===a&&(d="i, j");const c=`getIndices(${d})`;let p="";1===n?p="i":2===n&&(p="i, coords[1]");const h=`getUpdates(${p})`;let f="";s&&(f="coords[0], coords[1]");const x=`getDefaultValue(${f})`;this.userCode=`
        ${l} strides = ${l}(${r});

        void main() {
          ${u} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${e}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${t}; j++) {
              int index = round(${c});
              flattenedIndex += index * ${t>1?"strides[j]":"strides"};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${h};
              found = true;
            }
          }
          setOutput(mix(${x}, sum, float(found)));
        }
      `}}class sd{constructor(e,t,a,n,r,i,o=!0,s=!1){this.variableNames=["updates","indices","defaultValue"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=i;const l=eF(r.length),u=eF(i.length);let d="";1===a?d="i":2===a&&(d="i, j");const c=`getIndices(${d})`;let p="";1===n?p="i":2===n&&(p="i, coords[1]");const h=`getUpdates(${p})`;let f="";s&&(f="coords[0], coords[1]");const x=`getDefaultValue(${f})`;this.userCode=`
        ${l} strides = ${l}(${r});

        void main() {
          ${u} coords = getOutputCoords();
          vec4 sum = vec4(0.);
          vec4 found = vec4(0.);
          for (int i = 0; i < ${e}; i+=2) {
            ivec2 flattenedIndex = ivec2(0);
            for (int j = 0; j < ${t}; j+=2) {
              ivec4 index = round(${c});
              flattenedIndex += index.xz * ${t>1?"strides[j]":"strides"};
              if (j + 1 < ${t}) {
                flattenedIndex += index.yw * ${t>1?"strides[j + 1]":"strides"};
              }
            }
            if (flattenedIndex[0] == coords[0] || flattenedIndex[1] == coords[0] ||
                flattenedIndex[0] == coords[0] + 1 || flattenedIndex[1] == coords[0] + 1) {
              vec4 updVals = ${h};
              if (flattenedIndex[0] == coords[0]) {
                sum.xy += updVals.xy;
                found.xy = vec2(1.);
              } else if (flattenedIndex[0] == coords[0] + 1) {
                sum.zw += updVals.xy;
                found.zw = vec2(1.);
              }
              if (flattenedIndex[1] == coords[0]) {
                sum.xy += updVals.zw;
                found.xy = vec2(1.);
              } else if (flattenedIndex[1] == coords[0] + 1) {
                sum.zw += updVals.zw;
                found.zw = vec2(1.);
              }
            }
          }
          setOutput(mix(${x}, sum, found));
        }
      `}}let sc={kernelName:am.ScatterNd,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{indices:i,updates:o}=a,{shape:s}=r,{sliceRank:l,numUpdates:u,sliceSize:d,strides:c,outputSize:p}=ef.backend_util.calculateShapes(o,i,s),h=[p/d,d];if(0===p)return n.makeTensorInfo(s,i.dtype);let f=aG({inputs:{x:i},backend:n,attrs:{shape:[u,l]}}),x=aG({inputs:{x:o},backend:n,attrs:{shape:[u,d]}}),m=n.makeTensorInfo([],"float32",new Float32Array([0]));t=(0,g.env)().getBool("WEBGL_PACK")?new sd(u,l,f.shape.length,x.shape.length,c,h):new su(u,l,f.shape.length,x.shape.length,c,h);let v=n.runWebGLProgram(t,[x,f,m],x.dtype),C=aG({inputs:{x:v},backend:n,attrs:{shape:s}});return n.disposeIntermediateTensorInfo(f),n.disposeIntermediateTensorInfo(x),n.disposeIntermediateTensorInfo(v),n.disposeIntermediateTensorInfo(m),C}};class sp{constructor(e,t,a,n){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[e,a];const r=`for (int i = 0; i < ${Math.ceil(Math.log2(t+1))}; ++i) { if (left >= right) break;`,i=2===(0,g.env)().getNumber("WEBGL_VERSION")?"while (left < right) {":r;this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${i}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${"left"===n?"<":"<="} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `}}let sh={kernelName:am.SearchSorted,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{sortedSequence:r,values:i}=t,{side:o}=n,s=new sp(r.shape[0],r.shape[1],i.shape[1],o),l=[[r.shape[1]]];return a.runWebGLProgram(s,[r,i],"int32",l)}};class sf{constructor(e,t,a){let n,r;if(this.variableNames=["c","a","b"],this.outputShape=t,a>4)throw Error(`Where for rank ${a} is not yet supported`);if(1===a)r="resRC",n="resRC";else{const a=["resRC.x","resRC.y","resRC.z","resRC.w"],i=[],o=[];for(let n=0;n<t.length;n++)o.push(`${a[n]}`),n<e&&i.push(`${a[n]}`);n=i.join(),r=o.join()}const i=eF(a);this.userCode=`
      void main() {
        ${i} resRC = getOutputCoords();
        float cVal = getC(${n});
        if (cVal >= 1.0) {
          setOutput(getA(${r}));
        } else {
          setOutput(getB(${r}));
        }
      }
    `}}let sx={kernelName:am.Select,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{condition:n,t:r,e:i}=t,o=new sf(n.shape.length,r.shape,r.shape.length);return a.runWebGLProgram(o,[n,r,i],(0,av.upcastType)(r.dtype,i.dtype))}},sm=aF({opSnippet:`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${ef.backend_util.SELU_SCALEALPHA};
  float scale = ${ef.backend_util.SELU_SCALE};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`}),sg={kernelName:am.Selu,backendName:"webgl",kernelFunc:sm},sv=aF({opSnippet:aO+`
  return 1.0 / (1.0 + exp(-1.0 * x));
`,packedOpSnippet:`
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,cpuKernelImpl:tV}),sC={kernelName:am.Sigmoid,backendName:"webgl",kernelFunc:sv},sb=aF({opSnippet:`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`}),s$={kernelName:am.Sign,backendName:"webgl",kernelFunc:sb},sI=aF({opSnippet:aO+`
  return sin(x);
`,packedOpSnippet:`
  vec4 result = sin(x);
  bvec4 isNaN = isnan(x);
  ${a$}
  return result;
`}),sy={kernelName:am.Sin,backendName:"webgl",kernelFunc:sI},sR=aF({opSnippet:`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`}),sT={kernelName:am.Sinh,backendName:"webgl",kernelFunc:sR},sw=aF({opSnippet:`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`}),sS={kernelName:am.Softplus,backendName:"webgl",kernelFunc:sw},sN={kernelName:am.SpaceToBatchND,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{blockShape:i,paddings:o}=n;v.util.assert(r.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");let s=i.reduce((e,t)=>e*t),l=[[0,0]];l.push(...o);for(let e=1+i.length;e<r.shape.length;++e)l.push([0,0]);let u=[],d=oB({inputs:{x:r},backend:a,attrs:{paddings:l,constantValue:0}}),c=ef.backend_util.getReshaped(d.shape,i,s,!1),p=ef.backend_util.getPermuted(c.length,i.length,!1),h=ef.backend_util.getReshapedPermuted(d.shape,i,s,!1),f=aG({inputs:{x:d},backend:a,attrs:{shape:c}}),x=aZ({inputs:{x:f},backend:a,attrs:{perm:p}}),m=aG({inputs:{x:x},backend:a,attrs:{shape:h}});return u.push(d),u.push(f),u.push(x),u.forEach(e=>a.disposeIntermediateTensorInfo(e)),m}},sE={kernelName:am.SparseFillEmptyRows,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{indices:n,values:r,denseShape:i,defaultValue:o}=t;if(1!==i.shape.length)throw Error(`Dense shape must be a vector, saw:
         ${i.shape}`);if(2!==n.shape.length)throw Error(`Indices must be a matrix, saw:
         ${n.shape}`);if(1!==r.shape.length)throw Error(`Values must be a vector, saw:
         ${r.shape}`);if(0!==o.shape.length)throw Error(`Default value must be a scalar, saw:
        ${o.shape}`);let s=a.readSync(n.dataId),l=a.readSync(r.dataId),u=a.readSync(i.dataId),d=a.readSync(o.dataId)[0],[c,p,h,f,x]=tG(s,n.shape,n.dtype,l,r.dtype,u,d);return[a.makeTensorInfo(p,n.dtype,c),a.makeTensorInfo([p[0]],r.dtype,h),a.makeTensorInfo([f.length],"bool",new Uint8Array(f.map(e=>Number(e)))),a.makeTensorInfo([x.length],n.dtype,new Int32Array(x))]}},sk={kernelName:am.SparseReshape,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{inputIndices:n,inputShape:r,newShape:i}=t;if(2!==n.shape.length)throw Error(`Input indices should be a matrix but received shape ${n.shape}`);if(1!==r.shape.length)throw Error(`Input shape should be a vector but received shape ${r.shape}`);if(1!==i.shape.length)throw Error(`Target shape should be a vector but received shape ${i.shape}`);let o=Array.from(a.readSync(r.dataId)),s=a.readSync(n.dataId),l=Array.from(a.readSync(i.dataId)),[u,d,c]=tM(s,n.shape,n.dtype,o,l);return[a.makeTensorInfo(d,n.dtype,u),a.makeTensorInfo([c.length],i.dtype,new Int32Array(c))]}},s_={kernelName:am.SparseSegmentMean,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{data:n,indices:r,segmentIds:i}=t;if(n.shape.length<1)throw Error("Data should be at least 1 dimensional but received scalar");if(1!==r.shape.length)throw Error(`Indices should be a vector but received shape
              ${r.shape}`);if(1!==i.shape.length)throw Error(`Segment ids should be a vector but received shape
              ${i.shape}`);let o=a.readSync(n.dataId),s=a.readSync(r.dataId),l=a.readSync(i.dataId),[u,d]=tz(o,n.shape,n.dtype,s,l,!0);return a.makeTensorInfo(d,n.dtype,u)}},sA={kernelName:am.SparseSegmentSum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a}=e,{data:n,indices:r,segmentIds:i}=t;if(n.shape.length<1)throw Error("Data should be at least 1 dimensional but received scalar");if(1!==r.shape.length)throw Error(`Indices should be a vector but received shape
             ${r.shape}`);if(1!==i.shape.length)throw Error(`Segment ids should be a vector but received shape
             ${i.shape}`);let o=a.readSync(n.dataId),s=a.readSync(r.dataId),l=a.readSync(i.dataId),[u,d]=tz(o,n.shape,n.dtype,s,l);return a.makeTensorInfo(d,n.dtype,u)}},sO={kernelName:am.SparseToDense,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{sparseIndices:r,sparseValues:i,defaultValue:o}=t,{outputShape:s}=n,{sliceRank:l,numUpdates:u,sliceSize:d,strides:c,outputSize:p}=ef.backend_util.calculateShapes(i,r,s);if("string"===i.dtype){let e=tB(a.bufferSync(r),a.bufferSync(i),s,p,d,u,l,c,v.util.decodeString(a.readSync(o.dataId)[0]),!1);return a.makeTensorInfo(s,e.dtype,e.values)}let h=new su(u,l,r.shape.length,i.shape.length,c,[p,1],!1),f=a.runWebGLProgram(h,[i,r,o],i.dtype),x=aG({inputs:{x:f},backend:a,attrs:{shape:s}});return a.disposeIntermediateTensorInfo(f),x}},sF={kernelName:am.SplitV,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{numOrSizeSplits:i,axis:o}=n,s=v.util.parseAxisParam(o,r.shape)[0],l=ef.backend_util.prepareSplitSize(r,i,s),u=Array(r.shape.length).fill(0),d=r.shape.slice();return l.map(e=>{let t=[...d];t[s]=e;let n=nL({inputs:{x:r},backend:a,attrs:{begin:u,size:t}});return u[s]+=e,n})}},sD="return sqrt(x);",sP=aF({opSnippet:sD,packedOpSnippet:sD,cpuKernelImpl:tX}),sL={kernelName:am.Sqrt,backendName:"webgl",kernelFunc:sP},sB=aF({opSnippet:"return x * x;"}),sV={kernelName:am.Square,backendName:"webgl",kernelFunc:sB},sW="return (a - b) * (a - b);",sU=aD({opSnippet:sW,packedOpSnippet:sW}),sG={kernelName:am.SquaredDifference,backendName:"webgl",kernelFunc:sU},sM={kernelName:am.StaticRegexReplace,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t;if("string"!==r.dtype)throw Error("Input must be of datatype string");let i=a.readSync(r.dataId),o=tH(ef.backend_util.fromUint8ToStringArray(i),"string",n);return a.makeTensorInfo(r.shape,"string",o)}},sz={kernelName:am.Step,backendName:"webgl",kernelFunc:function({inputs:e,attrs:t,backend:a}){let{x:n}=e,r=at+`
    return x > 0.0 ? 1.0 : float(${t.alpha});
  `,i=new ae(n.shape,r);return a.runWebGLProgram(i,[n],n.dtype)}};class sX{constructor(e,t,a){this.variableNames=["x"],this.outputShape=a;const n=a.length,r=eF(a.length),i=eF(a.length);let o="";if(1===n)o="coords * strides + begin";else{let e=0;o=a.map((t,n)=>(e++,1===a.length?`coords * strides[${n}] + begin[${n}]`:`coords[${e-1}] * strides[${n}] + begin[${n}]`)).join(",")}this.userCode=`
      ${r} begin = ${r}(${e});
      ${r} strides = ${r}(${t});

      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${o}));
      }
    `}}let sH={kernelName:am.StridedSlice,backendName:"webgl",kernelFunc:function(e){let t,{inputs:a,backend:n,attrs:r}=e,{x:i}=a,{begin:o,end:s,strides:l,beginMask:u,endMask:d,ellipsisMask:c,newAxisMask:p,shrinkAxisMask:h}=r,{finalShapeSparse:f,finalShape:x,isIdentity:m,sliceDim0:g,isSimpleSlice:C,begin:b,end:$,strides:I}=nO.slice_util.sliceInfo(i.shape,o,s,l,u,d,c,p,h);if(m)t=aG({inputs:{x:i},backend:n,attrs:{shape:x}});else if(g||C){v.util.assert(i.shape.length>=1,()=>`Input must have rank at least 1, got: ${i.shape.length}`);let e=nO.slice_util.computeOutShape(b,$,I),a=nL({inputs:{x:i},backend:n,attrs:{begin:b,size:e}});t=aG({inputs:{x:a},backend:n,attrs:{shape:x}}),n.disposeIntermediateTensorInfo(a)}else if(n.shouldExecuteOnCPU([i])){let e=n.readSync(i.dataId),a=tj(f,(0,ex.buffer)(i.shape,i.dtype,e),I,b);t=n.makeTensorInfo(x,i.dtype,a.values)}else{let e=new sX(b,I,f);t=n.runWebGLProgram(e,[i],i.dtype)}let y=aG({inputs:{x:t},backend:n,attrs:{shape:x}});return n.disposeIntermediateTensorInfo(t),y}},sj={kernelName:am.StringNGrams,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{separator:r,nGramWidths:i,leftPad:o,rightPad:s,padWidth:l,preserveShortSequences:u}=n,{data:d,dataSplits:c}=t,[p,h]=tK(a.readSync(d.dataId),a.readSync(c.dataId),r,i,o,s,l,u);return[a.makeTensorInfo([p.length],"string",p),a.makeTensorInfo(c.shape,"int32",h)]}},sK={kernelName:am.StringSplit,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{skipEmpty:r}=n,{input:i,delimiter:o}=t;if("string"!==i.dtype)throw Error("Input must be of datatype string");if(1!==i.shape.length)throw Error(`Input must be a vector, got shape: ${i.shape}`);if(0!==o.shape.length)throw Error(`Delimiter must be a scalar, got shape: ${o.shape}`);let[s,l,u]=tq(a.readSync(i.dataId),a.readSync(o.dataId)[0],r),d=l.length;return[a.makeTensorInfo([d,2],"int32",s),a.makeTensorInfo([d],"string",l),a.makeTensorInfo([2],"int32",new Int32Array(u))]}},sq={kernelName:am.StringToHashBucketFast,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{numBuckets:r}=n,{input:i}=t;if("string"!==i.dtype)throw Error("Input must be of datatype string");if(r<=0)throw Error("Number of buckets must be at least 1");let o=tY(a.readSync(i.dataId),r);return a.makeTensorInfo(i.shape,"int32",o)}},sY=aF({opSnippet:"return tan(x);"}),sQ={kernelName:am.Tan,backendName:"webgl",kernelFunc:sY},sZ=aF({opSnippet:`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`}),sJ={kernelName:am.Tanh,backendName:"webgl",kernelFunc:sZ},s0={kernelName:am.TensorScatterUpdate,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{tensor:r,indices:i,updates:o}=t,{}=n,{sliceRank:s,numUpdates:l,sliceSize:u,strides:d,outputSize:c}=ef.backend_util.calculateShapes(o,i,r.shape),p=[c/u,u];if(0===c)return a.makeTensorInfo(r.shape,i.dtype);let h=aG({inputs:{x:i},backend:a,attrs:{shape:[l,s]}}),f=aG({inputs:{x:o},backend:a,attrs:{shape:[l,u]}}),x=aG({inputs:{x:r},backend:a,attrs:{shape:p}}),m=new su(l,s,h.shape.length,f.shape.length,d,p,!1,!0),g=a.runWebGLProgram(m,[f,h,x],x.dtype),v=aG({inputs:{x:g},backend:a,attrs:{shape:r.shape}});return a.disposeIntermediateTensorInfo(h),a.disposeIntermediateTensorInfo(f),a.disposeIntermediateTensorInfo(x),a.disposeIntermediateTensorInfo(g),v}};class s1{constructor(e,t){this.variableNames=["A"];const a=Array(e.length);for(let n=0;n<a.length;n++)a[n]=e[n]*t[n];this.outputShape=a,this.rank=a.length;const n=eF(this.rank),r=function(e){let t=e.length;if(t>5)throw Error(`Tile for rank ${t} is not yet supported`);if(1===t)return`imod(resRC, ${e[0]})`;let a=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],n=[];for(let t=0;t<e.length;t++)n.push(`imod(${a[t]}, ${e[t]})`);return n.join()}(e);this.userCode=`
      void main() {
        ${n} resRC = getOutputCoords();
        setOutput(getA(${r}));
      }
    `}}function s2(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{reps:i}=n;if("string"===r.dtype||r.shape.length>5){let e=a.readSync(r.dataId),t="string"===r.dtype?e.map(e=>v.util.decodeString(e)):e,n=tZ((0,ex.buffer)(r.shape,r.dtype,t),i);return a.makeTensorInfo(n.shape,n.dtype,n.values)}let o=new s1(r.shape,i);return a.runWebGLProgram(o,[r],r.dtype)}let s4={kernelName:am.Tile,backendName:"webgl",kernelFunc:s2};class s3{constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"negativeInf",type:"float"},{name:"dir",type:"int"},{name:"inc",type:"int"}],this.outputShape=e,this.userCode=`
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `}}class s5{constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"k",type:"int"}],this.outputShape=e,this.userCode=`
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `}}function s6(e,t){null!==t&&e.disposeIntermediateTensorInfo(t)}function s8(e){let t=1;for(;t<e;)t*=2;return t}let s9={kernelName:am.TopK,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r}=t,{k:i,sorted:o}=n,s=(0,g.env)().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),l=(0,g.env)().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),u=r.shape,d=u[u.length-1];if(a.shouldExecuteOnCPU([r])||d<s||i>l){let[e,t]=tJ(a.readSync(r.dataId),u,r.dtype,i,o);return[a.makeTensorInfo(e.shape,e.dtype,e.values),a.makeTensorInfo(t.shape,t.dtype,t.values)]}if(0===i)return u[u.length-1]=0,[a.makeTensorInfo(u,r.dtype,[]),a.makeTensorInfo(u,"int32",[])];if(1===d)return[r,ir({attrs:{shape:u,dtype:"int32",value:0},backend:a})];let c=a.texData.get(r.dataId),p=null!==c&&c.isPacked,h=p?a.unpackTensor(r):r,f=v.util.sizeFromShape(u)/d,x=aG({inputs:{x:h},attrs:{shape:[f,d]},backend:a});p&&s6(a,h);let m=s8(i),C=s8(d),b=null,$=()=>null===b?[x,x]:[x,b],I=(e,t,n)=>{let r=$(),i=new s3(n),o=[[d],[+(null===b)],[-1/0],[e],[t]],s=b;b=a.runWebGLProgram(i,r,"int32",o),s6(a,s)};for(let e=1;e<m;e*=2){let t=2*e;for(let a=e;a>=1;a/=2)I(t,a,[f,C])}for(let e=C;e>m;e/=2){let t=$(),n=new s5([f,e/2]),r=[[d],[+(null===b)],[m]],i=b;b=a.runWebGLProgram(n,t,"int32",r),s6(a,i);let o=m/2,s=2*o;for(let e=o;e>=1;e/=2)I(s,e,b.shape)}let y=b;b=nL({inputs:{x:b},backend:a,attrs:{begin:0,size:[f,i]}}),s6(a,y);let R=iy({inputs:{x:x,indices:b},backend:a,attrs:{axis:1,batchDims:1}});s6(a,x);let T=u.slice(0,-1);T.push(i),y=b,b=aG({inputs:{x:b},attrs:{shape:T},backend:a}),s6(a,y);let w=R;return R=aG({inputs:{x:R},attrs:{shape:T},backend:a}),s6(a,w),[R,b]}};class s7{constructor(e,t,a,n,r,i){let o;switch(this.variableNames=["Image","Transforms"],this.outputShape=i,n){case"constant":default:o=1;break;case"reflect":o=2;break;case"wrap":o=3;break;case"nearest":o=4}this.userCode=`
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${o} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${o} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${o} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${e} && 0 <= coordX && coordX < ${t}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${r});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${r});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${t}));
                float mapY = mapCoord(inY, float(${e}));

                if (${"nearest"===a?1:2} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `}}let le={kernelName:am.Transform,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{image:r,transforms:i}=t,{interpolation:o,fillMode:s,fillValue:l,outputShape:u}=n,[d,c,p,h]=r.shape,[f,x]=null!=u?u:[c,p],m=new s7(c,p,o,s,l,[d,f,x,h]);return a.runWebGLProgram(m,[r,i],"float32")}},lt={kernelName:am.Unique,backendName:"webgl",kernelFunc:function(e){let{inputs:t,attrs:a,backend:n}=e,{axis:r}=a,{x:i}=t;ep(i,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");let{outputValues:o,outputShape:s,indices:l}=t1(n.readSync(i.dataId),r,i.shape,i.dtype);return[n.makeTensorInfo(s,i.dtype,o),n.makeTensorInfo([l.length],"int32",l)]}},la={kernelName:am.Unpack,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{value:r}=t,{axis:i}=n;i<0&&(i+=r.shape.length);let o=r.shape.length,s=r.shape[i],l=Array(o-1),u=0;for(let e=0;e<o;e++)e!==i&&(l[u++]=r.shape[e]);let d=[],c=Array(o).fill(0),p=r.shape.slice();p[i]=1;let h=Array(s);for(let e=0;e<h.length;e++){c[i]=e;let t=nL({inputs:{x:r},backend:a,attrs:{begin:c,size:p}}),n=aG({inputs:{x:t},backend:a,attrs:{shape:l}});h[e]=n,d.push(t)}return d.forEach(e=>a.disposeIntermediateTensorInfo(e)),h}};class ln{constructor(e,t){this.variableNames=["x","segmentIds"];const a=e.windowSize,n=e.batchSize,r=e.inSize,i=e.numSegments,o=i*Math.ceil(r/a);this.outputShape=[n,o];const s=4*Math.floor(a/4),l=a%4,u=`
        sumValue += dot(values, segFilter);
    `;let d="";r%a>0&&(d=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return initializationValue;
        }
      `);let c="";r%a>0&&(c=`
        if (inIdx < 0 || inIdx >= ${r}) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = 0.0;

      float getValue(int batch, int inIdx) {
        ${d}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${c}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${i})) * float(${a}));
        int currentSeg = int(mod(float(outIdx), float(${i})));

        float sumValue = 0.0;

        for (int i = 0; i < ${s}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${u}
        }

        int inIdx = inOffset + ${s};
        if (${1===l}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${u}
        } else if (${2===l}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${u}
        } else if (${3===l}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${u}
        }
        setOutput(sumValue);
      }
    `}}for(let e of[a1,a4,a5,a8,ne,nn,nr,ni,nu,nd,np,nf,nm,nv,nb,ny,nR,nS,nN,nE,nA,nV,nW,nM,nz,nY,nJ,n2,aw,n5,ra,rd,rx,rg,rv,rC,rb,rI,rR,rw,r_,rA,rO,rD,rB,rU,rG,rz,rH,rj,rq,rQ,rJ,r1,r4,r5,r9,it,ii,is,id,ip,im,iv,iC,i$,iR,iw,iN,aR,iE,re,i_,iO,iD,aE,iL,iV,iW,iG,iz,iH,iK,iY,iJ,i1,i4,i5,i6,i8,oe,ot,oa,on,or,oo,ou,oc,ob,aU,oy,oT,oS,oE,nj,o_,oF,oD,oV,oU,aA,oG,oM,oz,oX,oj,nq,of,oq,oQ,oJ,aM,o2,o3,o8,o7,sa,sr,so,sl,sc,sh,sx,sg,sC,s$,sy,sT,nB,oC,sS,sN,sE,sk,s_,sA,sO,sF,sL,sV,sG,sM,sz,sH,sj,sK,sq,og,aQ,sQ,sJ,s0,s4,s9,le,aJ,lt,la,{kernelName:am.UnsortedSegmentSum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:a,attrs:n}=e,{x:r,segmentIds:i}=t,{numSegments:o}=n,s=r.shape.length,l=[],u=0,d=ef.backend_util.getAxesPermutation([u],s),c=r;null!=d&&(c=aZ({inputs:{x:r},backend:a,attrs:{perm:d}}),l.push(c),u=ef.backend_util.getInnerMostAxes(1,s)[0]);let p=ef.backend_util.segment_util.computeOutShape(c.shape,u,o),h=v.util.sizeFromShape([c.shape[u]]),f=aG({inputs:{x:c},backend:a,attrs:{shape:[-1,h]}});l.push(f);let x=(0,av.sumOutType)(r.dtype),m=(e,t,n,r,i)=>{let o=e.shape[0],s=e.shape[1],u=ef.backend_util.segment_util.segOpComputeOptimalWindowSize(s,i),d=new ln({windowSize:u,inSize:s,batchSize:o,numSegments:i},t),c=a.compileAndRun(d,[e,n],r);if(l.push(c),c.shape[1]===i)return c;let p=oH({backend:a,attrs:{start:0,stop:i,step:1,dtype:"float32"}}),h=s2({inputs:{x:p},backend:a,attrs:{reps:[s/u]}});return l.push(p),l.push(h),m(c,t,h,r,i)},g=aG({inputs:{x:m(f,"unsortedSegmentSum",i,x,o)},backend:a,attrs:{shape:p}}),C=g;return null!=d&&(l.push(g),C=aZ({inputs:{x:C},backend:a,attrs:{perm:ef.backend_util.getUndoAxesPermutation(d)}})),l.forEach(e=>a.disposeIntermediateTensorInfo(e)),C}},oO])(0,ax.registerKernel)(e);let lr=(0,f.createContext)(null),li=({children:e})=>{let[t,a]=(0,f.useState)(!1);return(0,f.useEffect)(()=>{(async()=>{try{await x.setBackend("webgl"),await x.ready(),a(!0)}catch(e){console.error("Error initializing TensorFlow:",e)}})()},[]),(0,p.jsx)(lr.Provider,{value:t,children:e})};var lo=e.i(6801);let ls=({children:e})=>{let t=(()=>{let e=(0,f.useContext)(lr);if(null===e)throw Error("useTensorFlow must be used within a TensorFlowProvider");return e})();return(0,p.jsx)(lo.PoseDetectorProvider,{isTfReady:t,children:e})};e.s(["default",0,function({Component:e,pageProps:t}){return(0,p.jsx)(h.SettingsProvider,{children:(0,p.jsx)(li,{children:(0,p.jsx)(ls,{children:(0,p.jsx)(e,{...t})})})})}],3115)},68146,(e,t,a)=>{let n="/_app";(window.__NEXT_P=window.__NEXT_P||[]).push([n,()=>e.r(3115)]),t.hot&&t.hot.dispose(function(){window.__NEXT_P.push([n])})}]);