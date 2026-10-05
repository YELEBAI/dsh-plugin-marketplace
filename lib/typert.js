var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/zod/v4/core/core.cjs
var require_core = __commonJS({
  "node_modules/zod/v4/core/core.cjs"(exports) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.globalConfig = exports.$ZodEncodeError = exports.$ZodAsyncError = exports.$brand = exports.NEVER = void 0;
    exports.$constructor = $constructor;
    exports.config = config;
    exports.NEVER = Object.freeze({
      status: "aborted"
    });
    function $constructor(name, initializer, params) {
      function init(inst, def) {
        if (!inst._zod) {
          Object.defineProperty(inst, "_zod", {
            value: {
              def,
              constr: _,
              traits: /* @__PURE__ */ new Set()
            },
            enumerable: false
          });
        }
        if (inst._zod.traits.has(name)) {
          return;
        }
        inst._zod.traits.add(name);
        initializer(inst, def);
        const proto = _.prototype;
        const keys = Object.keys(proto);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (!(k in inst)) {
            inst[k] = proto[k].bind(inst);
          }
        }
      }
      const Parent = params?.Parent ?? Object;
      class Definition extends Parent {
      }
      Object.defineProperty(Definition, "name", { value: name });
      function _(def) {
        var _a2;
        const inst = params?.Parent ? new Definition() : this;
        init(inst, def);
        (_a2 = inst._zod).deferred ?? (_a2.deferred = []);
        for (const fn of inst._zod.deferred) {
          fn();
        }
        return inst;
      }
      Object.defineProperty(_, "init", { value: init });
      Object.defineProperty(_, Symbol.hasInstance, {
        value: (inst) => {
          if (params?.Parent && inst instanceof params.Parent)
            return true;
          return inst?._zod?.traits?.has(name);
        }
      });
      Object.defineProperty(_, "name", { value: name });
      return _;
    }
    exports.$brand = /* @__PURE__ */ Symbol("zod_brand");
    var $ZodAsyncError = class extends Error {
      constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
      }
    };
    exports.$ZodAsyncError = $ZodAsyncError;
    var $ZodEncodeError = class extends Error {
      constructor(name) {
        super(`Encountered unidirectional transform during encode: ${name}`);
        this.name = "ZodEncodeError";
      }
    };
    exports.$ZodEncodeError = $ZodEncodeError;
    (_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
    exports.globalConfig = globalThis.__zod_globalConfig;
    function config(newConfig) {
      if (newConfig)
        Object.assign(exports.globalConfig, newConfig);
      return exports.globalConfig;
    }
  }
});

// node_modules/zod/v4/core/util.cjs
var require_util = __commonJS({
  "node_modules/zod/v4/core/util.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Class = exports.BIGINT_FORMAT_RANGES = exports.NUMBER_FORMAT_RANGES = exports.primitiveTypes = exports.propertyKeyTypes = exports.getParsedType = exports.allowsEval = exports.captureStackTrace = void 0;
    exports.assertEqual = assertEqual;
    exports.assertNotEqual = assertNotEqual;
    exports.assertIs = assertIs;
    exports.assertNever = assertNever;
    exports.assert = assert;
    exports.getEnumValues = getEnumValues;
    exports.joinValues = joinValues;
    exports.jsonStringifyReplacer = jsonStringifyReplacer;
    exports.cached = cached;
    exports.nullish = nullish;
    exports.cleanRegex = cleanRegex;
    exports.floatSafeRemainder = floatSafeRemainder;
    exports.defineLazy = defineLazy;
    exports.objectClone = objectClone;
    exports.assignProp = assignProp;
    exports.mergeDefs = mergeDefs;
    exports.cloneDef = cloneDef;
    exports.getElementAtPath = getElementAtPath;
    exports.promiseAllObject = promiseAllObject;
    exports.randomString = randomString;
    exports.esc = esc;
    exports.slugify = slugify;
    exports.isObject = isObject;
    exports.isPlainObject = isPlainObject;
    exports.shallowClone = shallowClone;
    exports.numKeys = numKeys;
    exports.escapeRegex = escapeRegex;
    exports.clone = clone;
    exports.normalizeParams = normalizeParams;
    exports.createTransparentProxy = createTransparentProxy;
    exports.stringifyPrimitive = stringifyPrimitive;
    exports.optionalKeys = optionalKeys;
    exports.pick = pick;
    exports.omit = omit;
    exports.extend = extend;
    exports.safeExtend = safeExtend;
    exports.merge = merge;
    exports.partial = partial;
    exports.required = required;
    exports.aborted = aborted;
    exports.explicitlyAborted = explicitlyAborted;
    exports.prefixIssues = prefixIssues;
    exports.unwrapMessage = unwrapMessage;
    exports.finalizeIssue = finalizeIssue;
    exports.getSizableOrigin = getSizableOrigin;
    exports.getLengthableOrigin = getLengthableOrigin;
    exports.parsedType = parsedType;
    exports.issue = issue;
    exports.cleanEnum = cleanEnum;
    exports.base64ToUint8Array = base64ToUint8Array;
    exports.uint8ArrayToBase64 = uint8ArrayToBase64;
    exports.base64urlToUint8Array = base64urlToUint8Array;
    exports.uint8ArrayToBase64url = uint8ArrayToBase64url;
    exports.hexToUint8Array = hexToUint8Array;
    exports.uint8ArrayToHex = uint8ArrayToHex;
    var core_js_1 = require_core();
    function assertEqual(val) {
      return val;
    }
    function assertNotEqual(val) {
      return val;
    }
    function assertIs(_arg) {
    }
    function assertNever(_x) {
      throw new Error("Unexpected value in exhaustive check");
    }
    function assert(_) {
    }
    function getEnumValues(entries) {
      const numericValues = Object.values(entries).filter((v) => typeof v === "number");
      const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
      return values;
    }
    function joinValues(array, separator = "|") {
      return array.map((val) => stringifyPrimitive(val)).join(separator);
    }
    function jsonStringifyReplacer(_, value) {
      if (typeof value === "bigint")
        return value.toString();
      return value;
    }
    function cached(getter) {
      const set = false;
      return {
        get value() {
          if (!set) {
            const value = getter();
            Object.defineProperty(this, "value", { value });
            return value;
          }
          throw new Error("cached value already set");
        }
      };
    }
    function nullish(input) {
      return input === null || input === void 0;
    }
    function cleanRegex(source) {
      const start = source.startsWith("^") ? 1 : 0;
      const end = source.endsWith("$") ? source.length - 1 : source.length;
      return source.slice(start, end);
    }
    function floatSafeRemainder(val, step) {
      const ratio = val / step;
      const roundedRatio = Math.round(ratio);
      const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
      if (Math.abs(ratio - roundedRatio) < tolerance)
        return 0;
      return ratio - roundedRatio;
    }
    var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
    function defineLazy(object, key, getter) {
      let value = void 0;
      Object.defineProperty(object, key, {
        get() {
          if (value === EVALUATING) {
            return void 0;
          }
          if (value === void 0) {
            value = EVALUATING;
            value = getter();
          }
          return value;
        },
        set(v) {
          Object.defineProperty(object, key, {
            value: v
            // configurable: true,
          });
        },
        configurable: true
      });
    }
    function objectClone(obj) {
      return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
    }
    function assignProp(target, prop, value) {
      Object.defineProperty(target, prop, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
    function mergeDefs(...defs) {
      const mergedDescriptors = {};
      for (const def of defs) {
        const descriptors = Object.getOwnPropertyDescriptors(def);
        Object.assign(mergedDescriptors, descriptors);
      }
      return Object.defineProperties({}, mergedDescriptors);
    }
    function cloneDef(schema) {
      return mergeDefs(schema._zod.def);
    }
    function getElementAtPath(obj, path) {
      if (!path)
        return obj;
      return path.reduce((acc, key) => acc?.[key], obj);
    }
    function promiseAllObject(promisesObj) {
      const keys = Object.keys(promisesObj);
      const promises = keys.map((key) => promisesObj[key]);
      return Promise.all(promises).then((results) => {
        const resolvedObj = {};
        for (let i = 0; i < keys.length; i++) {
          resolvedObj[keys[i]] = results[i];
        }
        return resolvedObj;
      });
    }
    function randomString(length = 10) {
      const chars = "abcdefghijklmnopqrstuvwxyz";
      let str = "";
      for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    }
    function esc(str) {
      return JSON.stringify(str);
    }
    function slugify(input) {
      return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    }
    exports.captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
    };
    function isObject(data) {
      return typeof data === "object" && data !== null && !Array.isArray(data);
    }
    exports.allowsEval = cached(() => {
      if (core_js_1.globalConfig.jitless) {
        return false;
      }
      if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
        return false;
      }
      try {
        const F = Function;
        new F("");
        return true;
      } catch (_) {
        return false;
      }
    });
    function isPlainObject(o) {
      if (isObject(o) === false)
        return false;
      const ctor = o.constructor;
      if (ctor === void 0)
        return true;
      if (typeof ctor !== "function")
        return true;
      const prot = ctor.prototype;
      if (isObject(prot) === false)
        return false;
      if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
        return false;
      }
      return true;
    }
    function shallowClone(o) {
      if (isPlainObject(o))
        return { ...o };
      if (Array.isArray(o))
        return [...o];
      if (o instanceof Map)
        return new Map(o);
      if (o instanceof Set)
        return new Set(o);
      return o;
    }
    function numKeys(data) {
      let keyCount = 0;
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          keyCount++;
        }
      }
      return keyCount;
    }
    var getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return "undefined";
        case "string":
          return "string";
        case "number":
          return Number.isNaN(data) ? "nan" : "number";
        case "boolean":
          return "boolean";
        case "function":
          return "function";
        case "bigint":
          return "bigint";
        case "symbol":
          return "symbol";
        case "object":
          if (Array.isArray(data)) {
            return "array";
          }
          if (data === null) {
            return "null";
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return "promise";
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return "map";
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return "set";
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return "date";
          }
          if (typeof File !== "undefined" && data instanceof File) {
            return "file";
          }
          return "object";
        default:
          throw new Error(`Unknown data type: ${t}`);
      }
    };
    exports.getParsedType = getParsedType;
    exports.propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
    exports.primitiveTypes = /* @__PURE__ */ new Set([
      "string",
      "number",
      "bigint",
      "boolean",
      "symbol",
      "undefined"
    ]);
    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function clone(inst, def, params) {
      const cl = new inst._zod.constr(def ?? inst._zod.def);
      if (!def || params?.parent)
        cl._zod.parent = inst;
      return cl;
    }
    function normalizeParams(_params) {
      const params = _params;
      if (!params)
        return {};
      if (typeof params === "string")
        return { error: () => params };
      if (params?.message !== void 0) {
        if (params?.error !== void 0)
          throw new Error("Cannot specify both `message` and `error` params");
        params.error = params.message;
      }
      delete params.message;
      if (typeof params.error === "string")
        return { ...params, error: () => params.error };
      return params;
    }
    function createTransparentProxy(getter) {
      let target;
      return new Proxy({}, {
        get(_, prop, receiver) {
          target ?? (target = getter());
          return Reflect.get(target, prop, receiver);
        },
        set(_, prop, value, receiver) {
          target ?? (target = getter());
          return Reflect.set(target, prop, value, receiver);
        },
        has(_, prop) {
          target ?? (target = getter());
          return Reflect.has(target, prop);
        },
        deleteProperty(_, prop) {
          target ?? (target = getter());
          return Reflect.deleteProperty(target, prop);
        },
        ownKeys(_) {
          target ?? (target = getter());
          return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor(_, prop) {
          target ?? (target = getter());
          return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        defineProperty(_, prop, descriptor) {
          target ?? (target = getter());
          return Reflect.defineProperty(target, prop, descriptor);
        }
      });
    }
    function stringifyPrimitive(value) {
      if (typeof value === "bigint")
        return value.toString() + "n";
      if (typeof value === "string")
        return `"${value}"`;
      return `${value}`;
    }
    function optionalKeys(shape) {
      return Object.keys(shape).filter((k) => {
        return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
      });
    }
    exports.NUMBER_FORMAT_RANGES = {
      safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      int32: [-2147483648, 2147483647],
      uint32: [0, 4294967295],
      float32: [-34028234663852886e22, 34028234663852886e22],
      float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
    };
    exports.BIGINT_FORMAT_RANGES = {
      int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
      uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
    };
    function pick(schema, mask) {
      const currDef = schema._zod.def;
      const checks = currDef.checks;
      const hasChecks = checks && checks.length > 0;
      if (hasChecks) {
        throw new Error(".pick() cannot be used on object schemas containing refinements");
      }
      const def = mergeDefs(schema._zod.def, {
        get shape() {
          const newShape = {};
          for (const key in mask) {
            if (!(key in currDef.shape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
              continue;
            newShape[key] = currDef.shape[key];
          }
          assignProp(this, "shape", newShape);
          return newShape;
        },
        checks: []
      });
      return clone(schema, def);
    }
    function omit(schema, mask) {
      const currDef = schema._zod.def;
      const checks = currDef.checks;
      const hasChecks = checks && checks.length > 0;
      if (hasChecks) {
        throw new Error(".omit() cannot be used on object schemas containing refinements");
      }
      const def = mergeDefs(schema._zod.def, {
        get shape() {
          const newShape = { ...schema._zod.def.shape };
          for (const key in mask) {
            if (!(key in currDef.shape)) {
              throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
              continue;
            delete newShape[key];
          }
          assignProp(this, "shape", newShape);
          return newShape;
        },
        checks: []
      });
      return clone(schema, def);
    }
    function extend(schema, shape) {
      if (!isPlainObject(shape)) {
        throw new Error("Invalid input to extend: expected a plain object");
      }
      const checks = schema._zod.def.checks;
      const hasChecks = checks && checks.length > 0;
      if (hasChecks) {
        const existingShape = schema._zod.def.shape;
        for (const key in shape) {
          if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
            throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
          }
        }
      }
      const def = mergeDefs(schema._zod.def, {
        get shape() {
          const _shape = { ...schema._zod.def.shape, ...shape };
          assignProp(this, "shape", _shape);
          return _shape;
        }
      });
      return clone(schema, def);
    }
    function safeExtend(schema, shape) {
      if (!isPlainObject(shape)) {
        throw new Error("Invalid input to safeExtend: expected a plain object");
      }
      const def = mergeDefs(schema._zod.def, {
        get shape() {
          const _shape = { ...schema._zod.def.shape, ...shape };
          assignProp(this, "shape", _shape);
          return _shape;
        }
      });
      return clone(schema, def);
    }
    function merge(a, b) {
      if (a._zod.def.checks?.length) {
        throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
      }
      const def = mergeDefs(a._zod.def, {
        get shape() {
          const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
          assignProp(this, "shape", _shape);
          return _shape;
        },
        get catchall() {
          return b._zod.def.catchall;
        },
        checks: b._zod.def.checks ?? []
      });
      return clone(a, def);
    }
    function partial(Class2, schema, mask) {
      const currDef = schema._zod.def;
      const checks = currDef.checks;
      const hasChecks = checks && checks.length > 0;
      if (hasChecks) {
        throw new Error(".partial() cannot be used on object schemas containing refinements");
      }
      const def = mergeDefs(schema._zod.def, {
        get shape() {
          const oldShape = schema._zod.def.shape;
          const shape = { ...oldShape };
          if (mask) {
            for (const key in mask) {
              if (!(key in oldShape)) {
                throw new Error(`Unrecognized key: "${key}"`);
              }
              if (!mask[key])
                continue;
              shape[key] = Class2 ? new Class2({
                type: "optional",
                innerType: oldShape[key]
              }) : oldShape[key];
            }
          } else {
            for (const key in oldShape) {
              shape[key] = Class2 ? new Class2({
                type: "optional",
                innerType: oldShape[key]
              }) : oldShape[key];
            }
          }
          assignProp(this, "shape", shape);
          return shape;
        },
        checks: []
      });
      return clone(schema, def);
    }
    function required(Class2, schema, mask) {
      const def = mergeDefs(schema._zod.def, {
        get shape() {
          const oldShape = schema._zod.def.shape;
          const shape = { ...oldShape };
          if (mask) {
            for (const key in mask) {
              if (!(key in shape)) {
                throw new Error(`Unrecognized key: "${key}"`);
              }
              if (!mask[key])
                continue;
              shape[key] = new Class2({
                type: "nonoptional",
                innerType: oldShape[key]
              });
            }
          } else {
            for (const key in oldShape) {
              shape[key] = new Class2({
                type: "nonoptional",
                innerType: oldShape[key]
              });
            }
          }
          assignProp(this, "shape", shape);
          return shape;
        }
      });
      return clone(schema, def);
    }
    function aborted(x, startIndex = 0) {
      if (x.aborted === true)
        return true;
      for (let i = startIndex; i < x.issues.length; i++) {
        if (x.issues[i]?.continue !== true) {
          return true;
        }
      }
      return false;
    }
    function explicitlyAborted(x, startIndex = 0) {
      if (x.aborted === true)
        return true;
      for (let i = startIndex; i < x.issues.length; i++) {
        if (x.issues[i]?.continue === false) {
          return true;
        }
      }
      return false;
    }
    function prefixIssues(path, issues) {
      return issues.map((iss) => {
        var _a;
        (_a = iss).path ?? (_a.path = []);
        iss.path.unshift(path);
        return iss;
      });
    }
    function unwrapMessage(message) {
      return typeof message === "string" ? message : message?.message;
    }
    function finalizeIssue(iss, ctx, config) {
      const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
      const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
      rest.path ?? (rest.path = []);
      rest.message = message;
      if (ctx?.reportInput) {
        rest.input = _input;
      }
      return rest;
    }
    function getSizableOrigin(input) {
      if (input instanceof Set)
        return "set";
      if (input instanceof Map)
        return "map";
      if (input instanceof File)
        return "file";
      return "unknown";
    }
    function getLengthableOrigin(input) {
      if (Array.isArray(input))
        return "array";
      if (typeof input === "string")
        return "string";
      return "unknown";
    }
    function parsedType(data) {
      const t = typeof data;
      switch (t) {
        case "number": {
          return Number.isNaN(data) ? "nan" : "number";
        }
        case "object": {
          if (data === null) {
            return "null";
          }
          if (Array.isArray(data)) {
            return "array";
          }
          const obj = data;
          if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
            return obj.constructor.name;
          }
        }
      }
      return t;
    }
    function issue(...args) {
      const [iss, input, inst] = args;
      if (typeof iss === "string") {
        return {
          message: iss,
          code: "custom",
          input,
          inst
        };
      }
      return { ...iss };
    }
    function cleanEnum(obj) {
      return Object.entries(obj).filter(([k, _]) => {
        return Number.isNaN(Number.parseInt(k, 10));
      }).map((el) => el[1]);
    }
    function base64ToUint8Array(base64) {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    function uint8ArrayToBase64(bytes) {
      let binaryString = "";
      for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }
      return btoa(binaryString);
    }
    function base64urlToUint8Array(base64url) {
      const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
      const padding = "=".repeat((4 - base64.length % 4) % 4);
      return base64ToUint8Array(base64 + padding);
    }
    function uint8ArrayToBase64url(bytes) {
      return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
    function hexToUint8Array(hex) {
      const cleanHex = hex.replace(/^0x/, "");
      if (cleanHex.length % 2 !== 0) {
        throw new Error("Invalid hex string length");
      }
      const bytes = new Uint8Array(cleanHex.length / 2);
      for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
      }
      return bytes;
    }
    function uint8ArrayToHex(bytes) {
      return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    var Class = class {
      constructor(..._args) {
      }
    };
    exports.Class = Class;
  }
});

// node_modules/zod/v4/core/errors.cjs
var require_errors = __commonJS({
  "node_modules/zod/v4/core/errors.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ZodRealError = exports.$ZodError = void 0;
    exports.flattenError = flattenError;
    exports.formatError = formatError;
    exports.treeifyError = treeifyError;
    exports.toDotPath = toDotPath;
    exports.prettifyError = prettifyError;
    var core_js_1 = require_core();
    var util = __importStar(require_util());
    var initializer = (inst, def) => {
      inst.name = "$ZodError";
      Object.defineProperty(inst, "_zod", {
        value: inst._zod,
        enumerable: false
      });
      Object.defineProperty(inst, "issues", {
        value: def,
        enumerable: false
      });
      inst.message = JSON.stringify(def, util.jsonStringifyReplacer, 2);
      Object.defineProperty(inst, "toString", {
        value: () => inst.message,
        enumerable: false
      });
    };
    exports.$ZodError = (0, core_js_1.$constructor)("$ZodError", initializer);
    exports.$ZodRealError = (0, core_js_1.$constructor)("$ZodError", initializer, { Parent: Error });
    function flattenError(error, mapper = (issue) => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of error.issues) {
        if (sub.path.length > 0) {
          fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
          fieldErrors[sub.path[0]].push(mapper(sub));
        } else {
          formErrors.push(mapper(sub));
        }
      }
      return { formErrors, fieldErrors };
    }
    function formatError(error, mapper = (issue) => issue.message) {
      const fieldErrors = { _errors: [] };
      const processError = (error2, path = []) => {
        for (const issue of error2.issues) {
          if (issue.code === "invalid_union" && issue.errors.length) {
            issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
          } else if (issue.code === "invalid_key") {
            processError({ issues: issue.issues }, [...path, ...issue.path]);
          } else if (issue.code === "invalid_element") {
            processError({ issues: issue.issues }, [...path, ...issue.path]);
          } else {
            const fullpath = [...path, ...issue.path];
            if (fullpath.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < fullpath.length) {
                const el = fullpath[i];
                const terminal = i === fullpath.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        }
      };
      processError(error);
      return fieldErrors;
    }
    function treeifyError(error, mapper = (issue) => issue.message) {
      const result2 = { errors: [] };
      const processError = (error2, path = []) => {
        var _a, _b;
        for (const issue of error2.issues) {
          if (issue.code === "invalid_union" && issue.errors.length) {
            issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
          } else if (issue.code === "invalid_key") {
            processError({ issues: issue.issues }, [...path, ...issue.path]);
          } else if (issue.code === "invalid_element") {
            processError({ issues: issue.issues }, [...path, ...issue.path]);
          } else {
            const fullpath = [...path, ...issue.path];
            if (fullpath.length === 0) {
              result2.errors.push(mapper(issue));
              continue;
            }
            let curr = result2;
            let i = 0;
            while (i < fullpath.length) {
              const el = fullpath[i];
              const terminal = i === fullpath.length - 1;
              if (typeof el === "string") {
                curr.properties ?? (curr.properties = {});
                (_a = curr.properties)[el] ?? (_a[el] = { errors: [] });
                curr = curr.properties[el];
              } else {
                curr.items ?? (curr.items = []);
                (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
                curr = curr.items[el];
              }
              if (terminal) {
                curr.errors.push(mapper(issue));
              }
              i++;
            }
          }
        }
      };
      processError(error);
      return result2;
    }
    function toDotPath(_path) {
      const segs = [];
      const path = _path.map((seg) => typeof seg === "object" ? seg.key : seg);
      for (const seg of path) {
        if (typeof seg === "number")
          segs.push(`[${seg}]`);
        else if (typeof seg === "symbol")
          segs.push(`[${JSON.stringify(String(seg))}]`);
        else if (/[^\w$]/.test(seg))
          segs.push(`[${JSON.stringify(seg)}]`);
        else {
          if (segs.length)
            segs.push(".");
          segs.push(seg);
        }
      }
      return segs.join("");
    }
    function prettifyError(error) {
      const lines = [];
      const issues = [...error.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
      for (const issue of issues) {
        lines.push(`\u2716 ${issue.message}`);
        if (issue.path?.length)
          lines.push(`  \u2192 at ${toDotPath(issue.path)}`);
      }
      return lines.join("\n");
    }
  }
});

// node_modules/zod/v4/core/parse.cjs
var require_parse = __commonJS({
  "node_modules/zod/v4/core/parse.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.safeDecodeAsync = exports._safeDecodeAsync = exports.safeEncodeAsync = exports._safeEncodeAsync = exports.safeDecode = exports._safeDecode = exports.safeEncode = exports._safeEncode = exports.decodeAsync = exports._decodeAsync = exports.encodeAsync = exports._encodeAsync = exports.decode = exports._decode = exports.encode = exports._encode = exports.safeParseAsync = exports._safeParseAsync = exports.safeParse = exports._safeParse = exports.parseAsync = exports._parseAsync = exports.parse = exports._parse = void 0;
    var core = __importStar(require_core());
    var errors = __importStar(require_errors());
    var util = __importStar(require_util());
    var _parse = (_Err) => (schema, value, _ctx, _params) => {
      const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
      const result2 = schema._zod.run({ value, issues: [] }, ctx);
      if (result2 instanceof Promise) {
        throw new core.$ZodAsyncError();
      }
      if (result2.issues.length) {
        const e = new (_params?.Err ?? _Err)(result2.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())));
        util.captureStackTrace(e, _params?.callee);
        throw e;
      }
      return result2.value;
    };
    exports._parse = _parse;
    exports.parse = (0, exports._parse)(errors.$ZodRealError);
    var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
      const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
      let result2 = schema._zod.run({ value, issues: [] }, ctx);
      if (result2 instanceof Promise)
        result2 = await result2;
      if (result2.issues.length) {
        const e = new (params?.Err ?? _Err)(result2.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())));
        util.captureStackTrace(e, params?.callee);
        throw e;
      }
      return result2.value;
    };
    exports._parseAsync = _parseAsync;
    exports.parseAsync = (0, exports._parseAsync)(errors.$ZodRealError);
    var _safeParse = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
      const result2 = schema._zod.run({ value, issues: [] }, ctx);
      if (result2 instanceof Promise) {
        throw new core.$ZodAsyncError();
      }
      return result2.issues.length ? {
        success: false,
        error: new (_Err ?? errors.$ZodError)(result2.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())))
      } : { success: true, data: result2.value };
    };
    exports._safeParse = _safeParse;
    exports.safeParse = (0, exports._safeParse)(errors.$ZodRealError);
    var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
      let result2 = schema._zod.run({ value, issues: [] }, ctx);
      if (result2 instanceof Promise)
        result2 = await result2;
      return result2.issues.length ? {
        success: false,
        error: new _Err(result2.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())))
      } : { success: true, data: result2.value };
    };
    exports._safeParseAsync = _safeParseAsync;
    exports.safeParseAsync = (0, exports._safeParseAsync)(errors.$ZodRealError);
    var _encode = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return (0, exports._parse)(_Err)(schema, value, ctx);
    };
    exports._encode = _encode;
    exports.encode = (0, exports._encode)(errors.$ZodRealError);
    var _decode = (_Err) => (schema, value, _ctx) => {
      return (0, exports._parse)(_Err)(schema, value, _ctx);
    };
    exports._decode = _decode;
    exports.decode = (0, exports._decode)(errors.$ZodRealError);
    var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return (0, exports._parseAsync)(_Err)(schema, value, ctx);
    };
    exports._encodeAsync = _encodeAsync;
    exports.encodeAsync = (0, exports._encodeAsync)(errors.$ZodRealError);
    var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
      return (0, exports._parseAsync)(_Err)(schema, value, _ctx);
    };
    exports._decodeAsync = _decodeAsync;
    exports.decodeAsync = (0, exports._decodeAsync)(errors.$ZodRealError);
    var _safeEncode = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return (0, exports._safeParse)(_Err)(schema, value, ctx);
    };
    exports._safeEncode = _safeEncode;
    exports.safeEncode = (0, exports._safeEncode)(errors.$ZodRealError);
    var _safeDecode = (_Err) => (schema, value, _ctx) => {
      return (0, exports._safeParse)(_Err)(schema, value, _ctx);
    };
    exports._safeDecode = _safeDecode;
    exports.safeDecode = (0, exports._safeDecode)(errors.$ZodRealError);
    var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return (0, exports._safeParseAsync)(_Err)(schema, value, ctx);
    };
    exports._safeEncodeAsync = _safeEncodeAsync;
    exports.safeEncodeAsync = (0, exports._safeEncodeAsync)(errors.$ZodRealError);
    var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
      return (0, exports._safeParseAsync)(_Err)(schema, value, _ctx);
    };
    exports._safeDecodeAsync = _safeDecodeAsync;
    exports.safeDecodeAsync = (0, exports._safeDecodeAsync)(errors.$ZodRealError);
  }
});

// node_modules/zod/v4/core/regexes.cjs
var require_regexes = __commonJS({
  "node_modules/zod/v4/core/regexes.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sha256_base64url = exports.sha256_base64 = exports.sha256_hex = exports.sha1_base64url = exports.sha1_base64 = exports.sha1_hex = exports.md5_base64url = exports.md5_base64 = exports.md5_hex = exports.hex = exports.uppercase = exports.lowercase = exports.undefined = exports.null = exports.boolean = exports.number = exports.integer = exports.bigint = exports.string = exports.date = exports.e164 = exports.httpProtocol = exports.domain = exports.hostname = exports.base64url = exports.base64 = exports.cidrv6 = exports.cidrv4 = exports.mac = exports.ipv6 = exports.ipv4 = exports.browserEmail = exports.idnEmail = exports.unicodeEmail = exports.rfc5322Email = exports.html5Email = exports.email = exports.uuid7 = exports.uuid6 = exports.uuid4 = exports.uuid = exports.guid = exports.extendedDuration = exports.duration = exports.nanoid = exports.ksuid = exports.xid = exports.ulid = exports.cuid2 = exports.cuid = void 0;
    exports.sha512_base64url = exports.sha512_base64 = exports.sha512_hex = exports.sha384_base64url = exports.sha384_base64 = exports.sha384_hex = void 0;
    exports.emoji = emoji;
    exports.time = time;
    exports.datetime = datetime;
    var util = __importStar(require_util());
    exports.cuid = /^[cC][0-9a-z]{6,}$/;
    exports.cuid2 = /^[0-9a-z]+$/;
    exports.ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
    exports.xid = /^[0-9a-vA-V]{20}$/;
    exports.ksuid = /^[A-Za-z0-9]{27}$/;
    exports.nanoid = /^[a-zA-Z0-9_-]{21}$/;
    exports.duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
    exports.extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    exports.guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
    var uuid = (version) => {
      if (!version)
        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
      return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
    };
    exports.uuid = uuid;
    exports.uuid4 = (0, exports.uuid)(4);
    exports.uuid6 = (0, exports.uuid)(6);
    exports.uuid7 = (0, exports.uuid)(7);
    exports.email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
    exports.html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    exports.rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    exports.unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
    exports.idnEmail = exports.unicodeEmail;
    exports.browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    function emoji() {
      return new RegExp(_emoji, "u");
    }
    exports.ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    exports.ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    var mac = (delimiter) => {
      const escapedDelim = util.escapeRegex(delimiter ?? ":");
      return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
    };
    exports.mac = mac;
    exports.cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
    exports.cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    exports.base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
    exports.base64url = /^[A-Za-z0-9_-]*$/;
    exports.hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
    exports.domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    exports.httpProtocol = /^https?$/;
    exports.e164 = /^\+[1-9]\d{6,14}$/;
    var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
    exports.date = new RegExp(`^${dateSource}$`);
    function timeSource(args) {
      const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
      const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
      return regex;
    }
    function time(args) {
      return new RegExp(`^${timeSource(args)}$`);
    }
    function datetime(args) {
      const time2 = timeSource({ precision: args.precision });
      const opts = ["Z"];
      if (args.local)
        opts.push("");
      if (args.offset)
        opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
      const timeRegex = `${time2}(?:${opts.join("|")})`;
      return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
    }
    var string = (params) => {
      const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
      return new RegExp(`^${regex}$`);
    };
    exports.string = string;
    exports.bigint = /^-?\d+n?$/;
    exports.integer = /^-?\d+$/;
    exports.number = /^-?\d+(?:\.\d+)?$/;
    exports.boolean = /^(?:true|false)$/i;
    var _null = /^null$/i;
    exports.null = _null;
    var _undefined = /^undefined$/i;
    exports.undefined = _undefined;
    exports.lowercase = /^[^A-Z]*$/;
    exports.uppercase = /^[^a-z]*$/;
    exports.hex = /^[0-9a-fA-F]*$/;
    function fixedBase64(bodyLength, padding) {
      return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
    }
    function fixedBase64url(length) {
      return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
    }
    exports.md5_hex = /^[0-9a-fA-F]{32}$/;
    exports.md5_base64 = fixedBase64(22, "==");
    exports.md5_base64url = fixedBase64url(22);
    exports.sha1_hex = /^[0-9a-fA-F]{40}$/;
    exports.sha1_base64 = fixedBase64(27, "=");
    exports.sha1_base64url = fixedBase64url(27);
    exports.sha256_hex = /^[0-9a-fA-F]{64}$/;
    exports.sha256_base64 = fixedBase64(43, "=");
    exports.sha256_base64url = fixedBase64url(43);
    exports.sha384_hex = /^[0-9a-fA-F]{96}$/;
    exports.sha384_base64 = fixedBase64(64, "");
    exports.sha384_base64url = fixedBase64url(64);
    exports.sha512_hex = /^[0-9a-fA-F]{128}$/;
    exports.sha512_base64 = fixedBase64(86, "==");
    exports.sha512_base64url = fixedBase64url(86);
  }
});

// node_modules/zod/v4/core/checks.cjs
var require_checks = __commonJS({
  "node_modules/zod/v4/core/checks.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ZodCheckOverwrite = exports.$ZodCheckMimeType = exports.$ZodCheckProperty = exports.$ZodCheckEndsWith = exports.$ZodCheckStartsWith = exports.$ZodCheckIncludes = exports.$ZodCheckUpperCase = exports.$ZodCheckLowerCase = exports.$ZodCheckRegex = exports.$ZodCheckStringFormat = exports.$ZodCheckLengthEquals = exports.$ZodCheckMinLength = exports.$ZodCheckMaxLength = exports.$ZodCheckSizeEquals = exports.$ZodCheckMinSize = exports.$ZodCheckMaxSize = exports.$ZodCheckBigIntFormat = exports.$ZodCheckNumberFormat = exports.$ZodCheckMultipleOf = exports.$ZodCheckGreaterThan = exports.$ZodCheckLessThan = exports.$ZodCheck = void 0;
    var core = __importStar(require_core());
    var regexes = __importStar(require_regexes());
    var util = __importStar(require_util());
    exports.$ZodCheck = core.$constructor("$ZodCheck", (inst, def) => {
      var _a;
      inst._zod ?? (inst._zod = {});
      inst._zod.def = def;
      (_a = inst._zod).onattach ?? (_a.onattach = []);
    });
    var numericOriginMap = {
      number: "number",
      bigint: "bigint",
      object: "date"
    };
    exports.$ZodCheckLessThan = core.$constructor("$ZodCheckLessThan", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const origin = numericOriginMap[typeof def.value];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        if (def.value < curr) {
          if (def.inclusive)
            bag.maximum = def.value;
          else
            bag.exclusiveMaximum = def.value;
        }
      });
      inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
          return;
        }
        payload.issues.push({
          origin,
          code: "too_big",
          maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
          input: payload.value,
          inclusive: def.inclusive,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckGreaterThan = core.$constructor("$ZodCheckGreaterThan", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const origin = numericOriginMap[typeof def.value];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        if (def.value > curr) {
          if (def.inclusive)
            bag.minimum = def.value;
          else
            bag.exclusiveMinimum = def.value;
        }
      });
      inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
          return;
        }
        payload.issues.push({
          origin,
          code: "too_small",
          minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
          input: payload.value,
          inclusive: def.inclusive,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMultipleOf = /* @__PURE__ */ core.$constructor("$ZodCheckMultipleOf", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        var _a;
        (_a = inst2._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
      });
      inst._zod.check = (payload) => {
        if (typeof payload.value !== typeof def.value)
          throw new Error("Cannot mix number and bigint in multiple_of check.");
        const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : util.floatSafeRemainder(payload.value, def.value) === 0;
        if (isMultiple)
          return;
        payload.issues.push({
          origin: typeof payload.value,
          code: "not_multiple_of",
          divisor: def.value,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckNumberFormat = core.$constructor("$ZodCheckNumberFormat", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      def.format = def.format || "float64";
      const isInt = def.format?.includes("int");
      const origin = isInt ? "int" : "number";
      const [minimum, maximum] = util.NUMBER_FORMAT_RANGES[def.format];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
        if (isInt)
          bag.pattern = regexes.integer;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        if (isInt) {
          if (!Number.isInteger(input)) {
            payload.issues.push({
              expected: origin,
              format: def.format,
              code: "invalid_type",
              continue: false,
              input,
              inst
            });
            return;
          }
          if (!Number.isSafeInteger(input)) {
            if (input > 0) {
              payload.issues.push({
                input,
                code: "too_big",
                maximum: Number.MAX_SAFE_INTEGER,
                note: "Integers must be within the safe integer range.",
                inst,
                origin,
                inclusive: true,
                continue: !def.abort
              });
            } else {
              payload.issues.push({
                input,
                code: "too_small",
                minimum: Number.MIN_SAFE_INTEGER,
                note: "Integers must be within the safe integer range.",
                inst,
                origin,
                inclusive: true,
                continue: !def.abort
              });
            }
            return;
          }
        }
        if (input < minimum) {
          payload.issues.push({
            origin: "number",
            input,
            code: "too_small",
            minimum,
            inclusive: true,
            inst,
            continue: !def.abort
          });
        }
        if (input > maximum) {
          payload.issues.push({
            origin: "number",
            input,
            code: "too_big",
            maximum,
            inclusive: true,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    exports.$ZodCheckBigIntFormat = core.$constructor("$ZodCheckBigIntFormat", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const [minimum, maximum] = util.BIGINT_FORMAT_RANGES[def.format];
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        if (input < minimum) {
          payload.issues.push({
            origin: "bigint",
            input,
            code: "too_small",
            minimum,
            inclusive: true,
            inst,
            continue: !def.abort
          });
        }
        if (input > maximum) {
          payload.issues.push({
            origin: "bigint",
            input,
            code: "too_big",
            maximum,
            inclusive: true,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    exports.$ZodCheckMaxSize = core.$constructor("$ZodCheckMaxSize", (inst, def) => {
      var _a;
      exports.$ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !util.nullish(val) && val.size !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        if (def.maximum < curr)
          inst2._zod.bag.maximum = def.maximum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size <= def.maximum)
          return;
        payload.issues.push({
          origin: util.getSizableOrigin(input),
          code: "too_big",
          maximum: def.maximum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMinSize = core.$constructor("$ZodCheckMinSize", (inst, def) => {
      var _a;
      exports.$ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !util.nullish(val) && val.size !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        if (def.minimum > curr)
          inst2._zod.bag.minimum = def.minimum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size >= def.minimum)
          return;
        payload.issues.push({
          origin: util.getSizableOrigin(input),
          code: "too_small",
          minimum: def.minimum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckSizeEquals = core.$constructor("$ZodCheckSizeEquals", (inst, def) => {
      var _a;
      exports.$ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !util.nullish(val) && val.size !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.minimum = def.size;
        bag.maximum = def.size;
        bag.size = def.size;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size === def.size)
          return;
        const tooBig = size > def.size;
        payload.issues.push({
          origin: util.getSizableOrigin(input),
          ...tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size },
          inclusive: true,
          exact: true,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMaxLength = core.$constructor("$ZodCheckMaxLength", (inst, def) => {
      var _a;
      exports.$ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !util.nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        if (def.maximum < curr)
          inst2._zod.bag.maximum = def.maximum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum)
          return;
        const origin = util.getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_big",
          maximum: def.maximum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckMinLength = core.$constructor("$ZodCheckMinLength", (inst, def) => {
      var _a;
      exports.$ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !util.nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        if (def.minimum > curr)
          inst2._zod.bag.minimum = def.minimum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum)
          return;
        const origin = util.getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_small",
          minimum: def.minimum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckLengthEquals = core.$constructor("$ZodCheckLengthEquals", (inst, def) => {
      var _a;
      exports.$ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !util.nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length === def.length)
          return;
        const origin = util.getLengthableOrigin(input);
        const tooBig = length > def.length;
        payload.issues.push({
          origin,
          ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
          inclusive: true,
          exact: true,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckStringFormat = core.$constructor("$ZodCheckStringFormat", (inst, def) => {
      var _a, _b;
      exports.$ZodCheck.init(inst, def);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.format = def.format;
        if (def.pattern) {
          bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
          bag.patterns.add(def.pattern);
        }
      });
      if (def.pattern)
        (_a = inst._zod).check ?? (_a.check = (payload) => {
          def.pattern.lastIndex = 0;
          if (def.pattern.test(payload.value))
            return;
          payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: def.format,
            input: payload.value,
            ...def.pattern ? { pattern: def.pattern.toString() } : {},
            inst,
            continue: !def.abort
          });
        });
      else
        (_b = inst._zod).check ?? (_b.check = () => {
        });
    });
    exports.$ZodCheckRegex = core.$constructor("$ZodCheckRegex", (inst, def) => {
      exports.$ZodCheckStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "regex",
          input: payload.value,
          pattern: def.pattern.toString(),
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckLowerCase = core.$constructor("$ZodCheckLowerCase", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.lowercase);
      exports.$ZodCheckStringFormat.init(inst, def);
    });
    exports.$ZodCheckUpperCase = core.$constructor("$ZodCheckUpperCase", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.uppercase);
      exports.$ZodCheckStringFormat.init(inst, def);
    });
    exports.$ZodCheckIncludes = core.$constructor("$ZodCheckIncludes", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const escapedRegex = util.escapeRegex(def.includes);
      const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
      def.pattern = pattern;
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
        if (payload.value.includes(def.includes, def.position))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "includes",
          includes: def.includes,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckStartsWith = core.$constructor("$ZodCheckStartsWith", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const pattern = new RegExp(`^${util.escapeRegex(def.prefix)}.*`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
        if (payload.value.startsWith(def.prefix))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "starts_with",
          prefix: def.prefix,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckEndsWith = core.$constructor("$ZodCheckEndsWith", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const pattern = new RegExp(`.*${util.escapeRegex(def.suffix)}$`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
        bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
        if (payload.value.endsWith(def.suffix))
          return;
        payload.issues.push({
          origin: "string",
          code: "invalid_format",
          format: "ends_with",
          suffix: def.suffix,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    function handleCheckPropertyResult(result2, payload, property) {
      if (result2.issues.length) {
        payload.issues.push(...util.prefixIssues(property, result2.issues));
      }
    }
    exports.$ZodCheckProperty = core.$constructor("$ZodCheckProperty", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      inst._zod.check = (payload) => {
        const result2 = def.schema._zod.run({
          value: payload.value[def.property],
          issues: []
        }, {});
        if (result2 instanceof Promise) {
          return result2.then((result3) => handleCheckPropertyResult(result3, payload, def.property));
        }
        handleCheckPropertyResult(result2, payload, def.property);
        return;
      };
    });
    exports.$ZodCheckMimeType = core.$constructor("$ZodCheckMimeType", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      const mimeSet = new Set(def.mime);
      inst._zod.onattach.push((inst2) => {
        inst2._zod.bag.mime = def.mime;
      });
      inst._zod.check = (payload) => {
        if (mimeSet.has(payload.value.type))
          return;
        payload.issues.push({
          code: "invalid_value",
          values: def.mime,
          input: payload.value.type,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCheckOverwrite = core.$constructor("$ZodCheckOverwrite", (inst, def) => {
      exports.$ZodCheck.init(inst, def);
      inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
      };
    });
  }
});

// node_modules/zod/v4/core/doc.cjs
var require_doc = __commonJS({
  "node_modules/zod/v4/core/doc.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Doc = void 0;
    var Doc = class {
      constructor(args = []) {
        this.content = [];
        this.indent = 0;
        if (this)
          this.args = args;
      }
      indented(fn) {
        this.indent += 1;
        fn(this);
        this.indent -= 1;
      }
      write(arg) {
        if (typeof arg === "function") {
          arg(this, { execution: "sync" });
          arg(this, { execution: "async" });
          return;
        }
        const content = arg;
        const lines = content.split("\n").filter((x) => x);
        const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
        const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
        for (const line of dedented) {
          this.content.push(line);
        }
      }
      compile() {
        const F = Function;
        const args = this?.args;
        const content = this?.content ?? [``];
        const lines = [...content.map((x) => `  ${x}`)];
        return new F(...args, lines.join("\n"));
      }
    };
    exports.Doc = Doc;
  }
});

// node_modules/zod/v4/core/versions.cjs
var require_versions = __commonJS({
  "node_modules/zod/v4/core/versions.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = void 0;
    exports.version = {
      major: 4,
      minor: 4,
      patch: 3
    };
  }
});

// node_modules/zod/v4/core/schemas.cjs
var require_schemas = __commonJS({
  "node_modules/zod/v4/core/schemas.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ZodTuple = exports.$ZodIntersection = exports.$ZodDiscriminatedUnion = exports.$ZodXor = exports.$ZodUnion = exports.$ZodObjectJIT = exports.$ZodObject = exports.$ZodArray = exports.$ZodDate = exports.$ZodVoid = exports.$ZodNever = exports.$ZodUnknown = exports.$ZodAny = exports.$ZodNull = exports.$ZodUndefined = exports.$ZodSymbol = exports.$ZodBigIntFormat = exports.$ZodBigInt = exports.$ZodBoolean = exports.$ZodNumberFormat = exports.$ZodNumber = exports.$ZodCustomStringFormat = exports.$ZodJWT = exports.$ZodE164 = exports.$ZodBase64URL = exports.$ZodBase64 = exports.$ZodCIDRv6 = exports.$ZodCIDRv4 = exports.$ZodMAC = exports.$ZodIPv6 = exports.$ZodIPv4 = exports.$ZodISODuration = exports.$ZodISOTime = exports.$ZodISODate = exports.$ZodISODateTime = exports.$ZodKSUID = exports.$ZodXID = exports.$ZodULID = exports.$ZodCUID2 = exports.$ZodCUID = exports.$ZodNanoID = exports.$ZodEmoji = exports.$ZodURL = exports.$ZodEmail = exports.$ZodUUID = exports.$ZodGUID = exports.$ZodStringFormat = exports.$ZodString = exports.clone = exports.$ZodType = void 0;
    exports.$ZodCustom = exports.$ZodLazy = exports.$ZodPromise = exports.$ZodFunction = exports.$ZodTemplateLiteral = exports.$ZodReadonly = exports.$ZodPreprocess = exports.$ZodCodec = exports.$ZodPipe = exports.$ZodNaN = exports.$ZodCatch = exports.$ZodSuccess = exports.$ZodNonOptional = exports.$ZodPrefault = exports.$ZodDefault = exports.$ZodNullable = exports.$ZodExactOptional = exports.$ZodOptional = exports.$ZodTransform = exports.$ZodFile = exports.$ZodLiteral = exports.$ZodEnum = exports.$ZodSet = exports.$ZodMap = exports.$ZodRecord = void 0;
    exports.isValidBase64 = isValidBase64;
    exports.isValidBase64URL = isValidBase64URL;
    exports.isValidJWT = isValidJWT;
    var checks = __importStar(require_checks());
    var core = __importStar(require_core());
    var doc_js_1 = require_doc();
    var parse_js_1 = require_parse();
    var regexes = __importStar(require_regexes());
    var util = __importStar(require_util());
    var versions_js_1 = require_versions();
    exports.$ZodType = core.$constructor("$ZodType", (inst, def) => {
      var _a;
      inst ?? (inst = {});
      inst._zod.def = def;
      inst._zod.bag = inst._zod.bag || {};
      inst._zod.version = versions_js_1.version;
      const checks2 = [...inst._zod.def.checks ?? []];
      if (inst._zod.traits.has("$ZodCheck")) {
        checks2.unshift(inst);
      }
      for (const ch of checks2) {
        for (const fn of ch._zod.onattach) {
          fn(inst);
        }
      }
      if (checks2.length === 0) {
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        inst._zod.deferred?.push(() => {
          inst._zod.run = inst._zod.parse;
        });
      } else {
        const runChecks = (payload, checks3, ctx) => {
          let isAborted = util.aborted(payload);
          let asyncResult;
          for (const ch of checks3) {
            if (ch._zod.def.when) {
              if (util.explicitlyAborted(payload))
                continue;
              const shouldRun = ch._zod.def.when(payload);
              if (!shouldRun)
                continue;
            } else if (isAborted) {
              continue;
            }
            const currLen = payload.issues.length;
            const _ = ch._zod.check(payload);
            if (_ instanceof Promise && ctx?.async === false) {
              throw new core.$ZodAsyncError();
            }
            if (asyncResult || _ instanceof Promise) {
              asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                await _;
                const nextLen = payload.issues.length;
                if (nextLen === currLen)
                  return;
                if (!isAborted)
                  isAborted = util.aborted(payload, currLen);
              });
            } else {
              const nextLen = payload.issues.length;
              if (nextLen === currLen)
                continue;
              if (!isAborted)
                isAborted = util.aborted(payload, currLen);
            }
          }
          if (asyncResult) {
            return asyncResult.then(() => {
              return payload;
            });
          }
          return payload;
        };
        const handleCanaryResult = (canary, payload, ctx) => {
          if (util.aborted(canary)) {
            canary.aborted = true;
            return canary;
          }
          const checkResult = runChecks(payload, checks2, ctx);
          if (checkResult instanceof Promise) {
            if (ctx.async === false)
              throw new core.$ZodAsyncError();
            return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
          }
          return inst._zod.parse(checkResult, ctx);
        };
        inst._zod.run = (payload, ctx) => {
          if (ctx.skipChecks) {
            return inst._zod.parse(payload, ctx);
          }
          if (ctx.direction === "backward") {
            const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
            if (canary instanceof Promise) {
              return canary.then((canary2) => {
                return handleCanaryResult(canary2, payload, ctx);
              });
            }
            return handleCanaryResult(canary, payload, ctx);
          }
          const result2 = inst._zod.parse(payload, ctx);
          if (result2 instanceof Promise) {
            if (ctx.async === false)
              throw new core.$ZodAsyncError();
            return result2.then((result3) => runChecks(result3, checks2, ctx));
          }
          return runChecks(result2, checks2, ctx);
        };
      }
      util.defineLazy(inst, "~standard", () => ({
        validate: (value) => {
          try {
            const r = (0, parse_js_1.safeParse)(inst, value);
            return r.success ? { value: r.data } : { issues: r.error?.issues };
          } catch (_) {
            return (0, parse_js_1.safeParseAsync)(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
          }
        },
        vendor: "zod",
        version: 1
      }));
    });
    var util_js_1 = require_util();
    Object.defineProperty(exports, "clone", { enumerable: true, get: function() {
      return util_js_1.clone;
    } });
    exports.$ZodString = core.$constructor("$ZodString", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? regexes.string(inst._zod.bag);
      inst._zod.parse = (payload, _) => {
        if (def.coerce)
          try {
            payload.value = String(payload.value);
          } catch (_2) {
          }
        if (typeof payload.value === "string")
          return payload;
        payload.issues.push({
          expected: "string",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    exports.$ZodStringFormat = core.$constructor("$ZodStringFormat", (inst, def) => {
      checks.$ZodCheckStringFormat.init(inst, def);
      exports.$ZodString.init(inst, def);
    });
    exports.$ZodGUID = core.$constructor("$ZodGUID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.guid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodUUID = core.$constructor("$ZodUUID", (inst, def) => {
      if (def.version) {
        const versionMap = {
          v1: 1,
          v2: 2,
          v3: 3,
          v4: 4,
          v5: 5,
          v6: 6,
          v7: 7,
          v8: 8
        };
        const v = versionMap[def.version];
        if (v === void 0)
          throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = regexes.uuid(v));
      } else
        def.pattern ?? (def.pattern = regexes.uuid());
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodEmail = core.$constructor("$ZodEmail", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.email);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodURL = core.$constructor("$ZodURL", (inst, def) => {
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        try {
          const trimmed = payload.value.trim();
          if (!def.normalize && def.protocol?.source === regexes.httpProtocol.source) {
            if (!/^https?:\/\//i.test(trimmed)) {
              payload.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid URL format",
                input: payload.value,
                inst,
                continue: !def.abort
              });
              return;
            }
          }
          const url = new URL(trimmed);
          if (def.hostname) {
            def.hostname.lastIndex = 0;
            if (!def.hostname.test(url.hostname)) {
              payload.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid hostname",
                pattern: def.hostname.source,
                input: payload.value,
                inst,
                continue: !def.abort
              });
            }
          }
          if (def.protocol) {
            def.protocol.lastIndex = 0;
            if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
              payload.issues.push({
                code: "invalid_format",
                format: "url",
                note: "Invalid protocol",
                pattern: def.protocol.source,
                input: payload.value,
                inst,
                continue: !def.abort
              });
            }
          }
          if (def.normalize) {
            payload.value = url.href;
          } else {
            payload.value = trimmed;
          }
          return;
        } catch (_) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    exports.$ZodEmoji = core.$constructor("$ZodEmoji", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.emoji());
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodNanoID = core.$constructor("$ZodNanoID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.nanoid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodCUID = core.$constructor("$ZodCUID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.cuid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodCUID2 = core.$constructor("$ZodCUID2", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.cuid2);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodULID = core.$constructor("$ZodULID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.ulid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodXID = core.$constructor("$ZodXID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.xid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodKSUID = core.$constructor("$ZodKSUID", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.ksuid);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISODateTime = core.$constructor("$ZodISODateTime", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.datetime(def));
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISODate = core.$constructor("$ZodISODate", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.date);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISOTime = core.$constructor("$ZodISOTime", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.time(def));
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodISODuration = core.$constructor("$ZodISODuration", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.duration);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodIPv4 = core.$constructor("$ZodIPv4", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.ipv4);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.bag.format = `ipv4`;
    });
    exports.$ZodIPv6 = core.$constructor("$ZodIPv6", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.ipv6);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.bag.format = `ipv6`;
      inst._zod.check = (payload) => {
        try {
          new URL(`http://[${payload.value}]`);
        } catch {
          payload.issues.push({
            code: "invalid_format",
            format: "ipv6",
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    exports.$ZodMAC = core.$constructor("$ZodMAC", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.mac(def.delimiter));
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.bag.format = `mac`;
    });
    exports.$ZodCIDRv4 = core.$constructor("$ZodCIDRv4", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.cidrv4);
      exports.$ZodStringFormat.init(inst, def);
    });
    exports.$ZodCIDRv6 = core.$constructor("$ZodCIDRv6", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.cidrv6);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        const parts = payload.value.split("/");
        try {
          if (parts.length !== 2)
            throw new Error();
          const [address, prefix] = parts;
          if (!prefix)
            throw new Error();
          const prefixNum = Number(prefix);
          if (`${prefixNum}` !== prefix)
            throw new Error();
          if (prefixNum < 0 || prefixNum > 128)
            throw new Error();
          new URL(`http://[${address}]`);
        } catch {
          payload.issues.push({
            code: "invalid_format",
            format: "cidrv6",
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      };
    });
    function isValidBase64(data) {
      if (data === "")
        return true;
      if (/\s/.test(data))
        return false;
      if (data.length % 4 !== 0)
        return false;
      try {
        atob(data);
        return true;
      } catch {
        return false;
      }
    }
    exports.$ZodBase64 = core.$constructor("$ZodBase64", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.base64);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.bag.contentEncoding = "base64";
      inst._zod.check = (payload) => {
        if (isValidBase64(payload.value))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: "base64",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    function isValidBase64URL(data) {
      if (!regexes.base64url.test(data))
        return false;
      const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      return isValidBase64(padded);
    }
    exports.$ZodBase64URL = core.$constructor("$ZodBase64URL", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.base64url);
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.bag.contentEncoding = "base64url";
      inst._zod.check = (payload) => {
        if (isValidBase64URL(payload.value))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: "base64url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodE164 = core.$constructor("$ZodE164", (inst, def) => {
      def.pattern ?? (def.pattern = regexes.e164);
      exports.$ZodStringFormat.init(inst, def);
    });
    function isValidJWT(token, algorithm = null) {
      try {
        const tokensParts = token.split(".");
        if (tokensParts.length !== 3)
          return false;
        const [header] = tokensParts;
        if (!header)
          return false;
        const parsedHeader = JSON.parse(atob(header));
        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
          return false;
        if (!parsedHeader.alg)
          return false;
        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
          return false;
        return true;
      } catch {
        return false;
      }
    }
    exports.$ZodJWT = core.$constructor("$ZodJWT", (inst, def) => {
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (isValidJWT(payload.value, def.alg))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: "jwt",
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodCustomStringFormat = core.$constructor("$ZodCustomStringFormat", (inst, def) => {
      exports.$ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
        if (def.fn(payload.value))
          return;
        payload.issues.push({
          code: "invalid_format",
          format: def.format,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    exports.$ZodNumber = core.$constructor("$ZodNumber", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = inst._zod.bag.pattern ?? regexes.number;
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
          try {
            payload.value = Number(payload.value);
          } catch (_) {
          }
        const input = payload.value;
        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
          return payload;
        }
        const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
        payload.issues.push({
          expected: "number",
          code: "invalid_type",
          input,
          inst,
          ...received ? { received } : {}
        });
        return payload;
      };
    });
    exports.$ZodNumberFormat = core.$constructor("$ZodNumberFormat", (inst, def) => {
      checks.$ZodCheckNumberFormat.init(inst, def);
      exports.$ZodNumber.init(inst, def);
    });
    exports.$ZodBoolean = core.$constructor("$ZodBoolean", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes.boolean;
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
          try {
            payload.value = Boolean(payload.value);
          } catch (_) {
          }
        const input = payload.value;
        if (typeof input === "boolean")
          return payload;
        payload.issues.push({
          expected: "boolean",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodBigInt = core.$constructor("$ZodBigInt", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes.bigint;
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
          try {
            payload.value = BigInt(payload.value);
          } catch (_) {
          }
        if (typeof payload.value === "bigint")
          return payload;
        payload.issues.push({
          expected: "bigint",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    exports.$ZodBigIntFormat = core.$constructor("$ZodBigIntFormat", (inst, def) => {
      checks.$ZodCheckBigIntFormat.init(inst, def);
      exports.$ZodBigInt.init(inst, def);
    });
    exports.$ZodSymbol = core.$constructor("$ZodSymbol", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "symbol")
          return payload;
        payload.issues.push({
          expected: "symbol",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodUndefined = core.$constructor("$ZodUndefined", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes.undefined;
      inst._zod.values = /* @__PURE__ */ new Set([void 0]);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
          return payload;
        payload.issues.push({
          expected: "undefined",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodNull = core.$constructor("$ZodNull", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.pattern = regexes.null;
      inst._zod.values = /* @__PURE__ */ new Set([null]);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input === null)
          return payload;
        payload.issues.push({
          expected: "null",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodAny = core.$constructor("$ZodAny", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload) => payload;
    });
    exports.$ZodUnknown = core.$constructor("$ZodUnknown", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload) => payload;
    });
    exports.$ZodNever = core.$constructor("$ZodNever", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        payload.issues.push({
          expected: "never",
          code: "invalid_type",
          input: payload.value,
          inst
        });
        return payload;
      };
    });
    exports.$ZodVoid = core.$constructor("$ZodVoid", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
          return payload;
        payload.issues.push({
          expected: "void",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodDate = core.$constructor("$ZodDate", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        if (def.coerce) {
          try {
            payload.value = new Date(payload.value);
          } catch (_err) {
          }
        }
        const input = payload.value;
        const isDate = input instanceof Date;
        const isValidDate = isDate && !Number.isNaN(input.getTime());
        if (isValidDate)
          return payload;
        payload.issues.push({
          expected: "date",
          code: "invalid_type",
          input,
          ...isDate ? { received: "Invalid Date" } : {},
          inst
        });
        return payload;
      };
    });
    function handleArrayResult(result2, final, index) {
      if (result2.issues.length) {
        final.issues.push(...util.prefixIssues(index, result2.issues));
      }
      final.value[index] = result2.value;
    }
    exports.$ZodArray = core.$constructor("$ZodArray", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
          payload.issues.push({
            expected: "array",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for (let i = 0; i < input.length; i++) {
          const item = input[i];
          const result2 = def.element._zod.run({
            value: item,
            issues: []
          }, ctx);
          if (result2 instanceof Promise) {
            proms.push(result2.then((result3) => handleArrayResult(result3, payload, i)));
          } else {
            handleArrayResult(result2, payload, i);
          }
        }
        if (proms.length) {
          return Promise.all(proms).then(() => payload);
        }
        return payload;
      };
    });
    function handlePropertyResult(result2, final, key, input, isOptionalIn, isOptionalOut) {
      const isPresent = key in input;
      if (result2.issues.length) {
        if (isOptionalIn && isOptionalOut && !isPresent) {
          return;
        }
        final.issues.push(...util.prefixIssues(key, result2.issues));
      }
      if (!isPresent && !isOptionalIn) {
        if (!result2.issues.length) {
          final.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: void 0,
            path: [key]
          });
        }
        return;
      }
      if (result2.value === void 0) {
        if (isPresent) {
          final.value[key] = void 0;
        }
      } else {
        final.value[key] = result2.value;
      }
    }
    function normalizeDef(def) {
      const keys = Object.keys(def.shape);
      for (const k of keys) {
        if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
          throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
        }
      }
      const okeys = util.optionalKeys(def.shape);
      return {
        ...def,
        keys,
        keySet: new Set(keys),
        numKeys: keys.length,
        optionalKeys: new Set(okeys)
      };
    }
    function handleCatchall(proms, input, payload, ctx, def, inst) {
      const unrecognized = [];
      const keySet = def.keySet;
      const _catchall = def.catchall._zod;
      const t = _catchall.def.type;
      const isOptionalIn = _catchall.optin === "optional";
      const isOptionalOut = _catchall.optout === "optional";
      for (const key in input) {
        if (key === "__proto__")
          continue;
        if (keySet.has(key))
          continue;
        if (t === "never") {
          unrecognized.push(key);
          continue;
        }
        const r = _catchall.run({ value: input[key], issues: [] }, ctx);
        if (r instanceof Promise) {
          proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
        } else {
          handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
        }
      }
      if (unrecognized.length) {
        payload.issues.push({
          code: "unrecognized_keys",
          keys: unrecognized,
          input,
          inst
        });
      }
      if (!proms.length)
        return payload;
      return Promise.all(proms).then(() => {
        return payload;
      });
    }
    exports.$ZodObject = core.$constructor("$ZodObject", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const desc = Object.getOwnPropertyDescriptor(def, "shape");
      if (!desc?.get) {
        const sh = def.shape;
        Object.defineProperty(def, "shape", {
          get: () => {
            const newSh = { ...sh };
            Object.defineProperty(def, "shape", {
              value: newSh
            });
            return newSh;
          }
        });
      }
      const _normalized = util.cached(() => normalizeDef(def));
      util.defineLazy(inst._zod, "propValues", () => {
        const shape = def.shape;
        const propValues = {};
        for (const key in shape) {
          const field = shape[key]._zod;
          if (field.values) {
            propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
            for (const v of field.values)
              propValues[key].add(v);
          }
        }
        return propValues;
      });
      const isObject = util.isObject;
      const catchall = def.catchall;
      let value;
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject(input)) {
          payload.issues.push({
            expected: "object",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        payload.value = {};
        const proms = [];
        const shape = value.shape;
        for (const key of value.keys) {
          const el = shape[key];
          const isOptionalIn = el._zod.optin === "optional";
          const isOptionalOut = el._zod.optout === "optional";
          const r = el._zod.run({ value: input[key], issues: [] }, ctx);
          if (r instanceof Promise) {
            proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, isOptionalIn, isOptionalOut)));
          } else {
            handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
          }
        }
        if (!catchall) {
          return proms.length ? Promise.all(proms).then(() => payload) : payload;
        }
        return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
      };
    });
    exports.$ZodObjectJIT = core.$constructor("$ZodObjectJIT", (inst, def) => {
      exports.$ZodObject.init(inst, def);
      const superParse = inst._zod.parse;
      const _normalized = util.cached(() => normalizeDef(def));
      const generateFastpass = (shape) => {
        const doc = new doc_js_1.Doc(["shape", "payload", "ctx"]);
        const normalized = _normalized.value;
        const parseStr = (key) => {
          const k = util.esc(key);
          return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        };
        doc.write(`const input = payload.value;`);
        const ids = /* @__PURE__ */ Object.create(null);
        let counter = 0;
        for (const key of normalized.keys) {
          ids[key] = `key_${counter++}`;
        }
        doc.write(`const newResult = {};`);
        for (const key of normalized.keys) {
          const id = ids[key];
          const k = util.esc(key);
          const schema = shape[key];
          const isOptionalIn = schema?._zod?.optin === "optional";
          const isOptionalOut = schema?._zod?.optout === "optional";
          doc.write(`const ${id} = ${parseStr(key)};`);
          if (isOptionalIn && isOptionalOut) {
            doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
          } else if (!isOptionalIn) {
            doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
          } else {
            doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
          }
        }
        doc.write(`payload.value = newResult;`);
        doc.write(`return payload;`);
        const fn = doc.compile();
        return (payload, ctx) => fn(shape, payload, ctx);
      };
      let fastpass;
      const isObject = util.isObject;
      const jit = !core.globalConfig.jitless;
      const allowsEval = util.allowsEval;
      const fastEnabled = jit && allowsEval.value;
      const catchall = def.catchall;
      let value;
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject(input)) {
          payload.issues.push({
            expected: "object",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
          if (!fastpass)
            fastpass = generateFastpass(def.shape);
          payload = fastpass(payload, ctx);
          if (!catchall)
            return payload;
          return handleCatchall([], input, payload, ctx, value, inst);
        }
        return superParse(payload, ctx);
      };
    });
    function handleUnionResults(results, final, inst, ctx) {
      for (const result2 of results) {
        if (result2.issues.length === 0) {
          final.value = result2.value;
          return final;
        }
      }
      const nonaborted = results.filter((r) => !util.aborted(r));
      if (nonaborted.length === 1) {
        final.value = nonaborted[0].value;
        return nonaborted[0];
      }
      final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result2) => result2.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())))
      });
      return final;
    }
    exports.$ZodUnion = core.$constructor("$ZodUnion", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util.defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
      util.defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
      util.defineLazy(inst._zod, "values", () => {
        if (def.options.every((o) => o._zod.values)) {
          return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
        }
        return void 0;
      });
      util.defineLazy(inst._zod, "pattern", () => {
        if (def.options.every((o) => o._zod.pattern)) {
          const patterns = def.options.map((o) => o._zod.pattern);
          return new RegExp(`^(${patterns.map((p) => util.cleanRegex(p.source)).join("|")})$`);
        }
        return void 0;
      });
      const first = def.options.length === 1 ? def.options[0]._zod.run : null;
      inst._zod.parse = (payload, ctx) => {
        if (first) {
          return first(payload, ctx);
        }
        let async = false;
        const results = [];
        for (const option of def.options) {
          const result2 = option._zod.run({
            value: payload.value,
            issues: []
          }, ctx);
          if (result2 instanceof Promise) {
            results.push(result2);
            async = true;
          } else {
            if (result2.issues.length === 0)
              return result2;
            results.push(result2);
          }
        }
        if (!async)
          return handleUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results2) => {
          return handleUnionResults(results2, payload, inst, ctx);
        });
      };
    });
    function handleExclusiveUnionResults(results, final, inst, ctx) {
      const successes = results.filter((r) => r.issues.length === 0);
      if (successes.length === 1) {
        final.value = successes[0].value;
        return final;
      }
      if (successes.length === 0) {
        final.issues.push({
          code: "invalid_union",
          input: final.value,
          inst,
          errors: results.map((result2) => result2.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())))
        });
      } else {
        final.issues.push({
          code: "invalid_union",
          input: final.value,
          inst,
          errors: [],
          inclusive: false
        });
      }
      return final;
    }
    exports.$ZodXor = core.$constructor("$ZodXor", (inst, def) => {
      exports.$ZodUnion.init(inst, def);
      def.inclusive = false;
      const first = def.options.length === 1 ? def.options[0]._zod.run : null;
      inst._zod.parse = (payload, ctx) => {
        if (first) {
          return first(payload, ctx);
        }
        let async = false;
        const results = [];
        for (const option of def.options) {
          const result2 = option._zod.run({
            value: payload.value,
            issues: []
          }, ctx);
          if (result2 instanceof Promise) {
            results.push(result2);
            async = true;
          } else {
            results.push(result2);
          }
        }
        if (!async)
          return handleExclusiveUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results2) => {
          return handleExclusiveUnionResults(results2, payload, inst, ctx);
        });
      };
    });
    exports.$ZodDiscriminatedUnion = /* @__PURE__ */ core.$constructor("$ZodDiscriminatedUnion", (inst, def) => {
      def.inclusive = false;
      exports.$ZodUnion.init(inst, def);
      const _super = inst._zod.parse;
      util.defineLazy(inst._zod, "propValues", () => {
        const propValues = {};
        for (const option of def.options) {
          const pv = option._zod.propValues;
          if (!pv || Object.keys(pv).length === 0)
            throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
          for (const [k, v] of Object.entries(pv)) {
            if (!propValues[k])
              propValues[k] = /* @__PURE__ */ new Set();
            for (const val of v) {
              propValues[k].add(val);
            }
          }
        }
        return propValues;
      });
      const disc = util.cached(() => {
        const opts = def.options;
        const map = /* @__PURE__ */ new Map();
        for (const o of opts) {
          const values = o._zod.propValues?.[def.discriminator];
          if (!values || values.size === 0)
            throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
          for (const v of values) {
            if (map.has(v)) {
              throw new Error(`Duplicate discriminator value "${String(v)}"`);
            }
            map.set(v, o);
          }
        }
        return map;
      });
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!util.isObject(input)) {
          payload.issues.push({
            code: "invalid_type",
            expected: "object",
            input,
            inst
          });
          return payload;
        }
        const opt = disc.value.get(input?.[def.discriminator]);
        if (opt) {
          return opt._zod.run(payload, ctx);
        }
        if (def.unionFallback || ctx.direction === "backward") {
          return _super(payload, ctx);
        }
        payload.issues.push({
          code: "invalid_union",
          errors: [],
          note: "No matching discriminator",
          discriminator: def.discriminator,
          options: Array.from(disc.value.keys()),
          input,
          path: [def.discriminator],
          inst
        });
        return payload;
      };
    });
    exports.$ZodIntersection = core.$constructor("$ZodIntersection", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
          return Promise.all([left, right]).then(([left2, right2]) => {
            return handleIntersectionResults(payload, left2, right2);
          });
        }
        return handleIntersectionResults(payload, left, right);
      };
    });
    function mergeValues(a, b) {
      if (a === b) {
        return { valid: true, data: a };
      }
      if (a instanceof Date && b instanceof Date && +a === +b) {
        return { valid: true, data: a };
      }
      if (util.isPlainObject(a) && util.isPlainObject(b)) {
        const bKeys = Object.keys(b);
        const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
          const sharedValue = mergeValues(a[key], b[key]);
          if (!sharedValue.valid) {
            return {
              valid: false,
              mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
            };
          }
          newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
      }
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          return { valid: false, mergeErrorPath: [] };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
          const itemA = a[index];
          const itemB = b[index];
          const sharedValue = mergeValues(itemA, itemB);
          if (!sharedValue.valid) {
            return {
              valid: false,
              mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
            };
          }
          newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
      }
      return { valid: false, mergeErrorPath: [] };
    }
    function handleIntersectionResults(result2, left, right) {
      const unrecKeys = /* @__PURE__ */ new Map();
      let unrecIssue;
      for (const iss of left.issues) {
        if (iss.code === "unrecognized_keys") {
          unrecIssue ?? (unrecIssue = iss);
          for (const k of iss.keys) {
            if (!unrecKeys.has(k))
              unrecKeys.set(k, {});
            unrecKeys.get(k).l = true;
          }
        } else {
          result2.issues.push(iss);
        }
      }
      for (const iss of right.issues) {
        if (iss.code === "unrecognized_keys") {
          for (const k of iss.keys) {
            if (!unrecKeys.has(k))
              unrecKeys.set(k, {});
            unrecKeys.get(k).r = true;
          }
        } else {
          result2.issues.push(iss);
        }
      }
      const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
      if (bothKeys.length && unrecIssue) {
        result2.issues.push({ ...unrecIssue, keys: bothKeys });
      }
      if (util.aborted(result2))
        return result2;
      const merged = mergeValues(left.value, right.value);
      if (!merged.valid) {
        throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
      }
      result2.value = merged.data;
      return result2;
    }
    exports.$ZodTuple = core.$constructor("$ZodTuple", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const items = def.items;
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
          payload.issues.push({
            input,
            inst,
            expected: "tuple",
            code: "invalid_type"
          });
          return payload;
        }
        payload.value = [];
        const proms = [];
        const optinStart = getTupleOptStart(items, "optin");
        const optoutStart = getTupleOptStart(items, "optout");
        if (!def.rest) {
          if (input.length < optinStart) {
            payload.issues.push({
              code: "too_small",
              minimum: optinStart,
              inclusive: true,
              input,
              inst,
              origin: "array"
            });
            return payload;
          }
          if (input.length > items.length) {
            payload.issues.push({
              code: "too_big",
              maximum: items.length,
              inclusive: true,
              input,
              inst,
              origin: "array"
            });
          }
        }
        const itemResults = new Array(items.length);
        for (let i = 0; i < items.length; i++) {
          const r = items[i]._zod.run({ value: input[i], issues: [] }, ctx);
          if (r instanceof Promise) {
            proms.push(r.then((rr) => {
              itemResults[i] = rr;
            }));
          } else {
            itemResults[i] = r;
          }
        }
        if (def.rest) {
          let i = items.length - 1;
          const rest = input.slice(items.length);
          for (const el of rest) {
            i++;
            const result2 = def.rest._zod.run({ value: el, issues: [] }, ctx);
            if (result2 instanceof Promise) {
              proms.push(result2.then((r) => handleTupleResult(r, payload, i)));
            } else {
              handleTupleResult(result2, payload, i);
            }
          }
        }
        if (proms.length) {
          return Promise.all(proms).then(() => handleTupleResults(itemResults, payload, items, input, optoutStart));
        }
        return handleTupleResults(itemResults, payload, items, input, optoutStart);
      };
    });
    function getTupleOptStart(items, key) {
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i]._zod[key] !== "optional")
          return i + 1;
      }
      return 0;
    }
    function handleTupleResult(result2, final, index) {
      if (result2.issues.length) {
        final.issues.push(...util.prefixIssues(index, result2.issues));
      }
      final.value[index] = result2.value;
    }
    function handleTupleResults(itemResults, final, items, input, optoutStart) {
      for (let i = 0; i < items.length; i++) {
        const r = itemResults[i];
        const isPresent = i < input.length;
        if (r.issues.length) {
          if (!isPresent && i >= optoutStart) {
            final.value.length = i;
            break;
          }
          final.issues.push(...util.prefixIssues(i, r.issues));
        }
        final.value[i] = r.value;
      }
      for (let i = final.value.length - 1; i >= input.length; i--) {
        if (items[i]._zod.optout === "optional" && final.value[i] === void 0) {
          final.value.length = i;
        } else {
          break;
        }
      }
      return final;
    }
    exports.$ZodRecord = core.$constructor("$ZodRecord", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!util.isPlainObject(input)) {
          payload.issues.push({
            expected: "record",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        const proms = [];
        const values = def.keyType._zod.values;
        if (values) {
          payload.value = {};
          const recordKeys = /* @__PURE__ */ new Set();
          for (const key of values) {
            if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
              recordKeys.add(typeof key === "number" ? key.toString() : key);
              const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
              if (keyResult instanceof Promise) {
                throw new Error("Async schemas not supported in object keys currently");
              }
              if (keyResult.issues.length) {
                payload.issues.push({
                  code: "invalid_key",
                  origin: "record",
                  issues: keyResult.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())),
                  input: key,
                  path: [key],
                  inst
                });
                continue;
              }
              const outKey = keyResult.value;
              const result2 = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
              if (result2 instanceof Promise) {
                proms.push(result2.then((result3) => {
                  if (result3.issues.length) {
                    payload.issues.push(...util.prefixIssues(key, result3.issues));
                  }
                  payload.value[outKey] = result3.value;
                }));
              } else {
                if (result2.issues.length) {
                  payload.issues.push(...util.prefixIssues(key, result2.issues));
                }
                payload.value[outKey] = result2.value;
              }
            }
          }
          let unrecognized;
          for (const key in input) {
            if (!recordKeys.has(key)) {
              unrecognized = unrecognized ?? [];
              unrecognized.push(key);
            }
          }
          if (unrecognized && unrecognized.length > 0) {
            payload.issues.push({
              code: "unrecognized_keys",
              input,
              inst,
              keys: unrecognized
            });
          }
        } else {
          payload.value = {};
          for (const key of Reflect.ownKeys(input)) {
            if (key === "__proto__")
              continue;
            if (!Object.prototype.propertyIsEnumerable.call(input, key))
              continue;
            let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
            if (keyResult instanceof Promise) {
              throw new Error("Async schemas not supported in object keys currently");
            }
            const checkNumericKey = typeof key === "string" && regexes.number.test(key) && keyResult.issues.length;
            if (checkNumericKey) {
              const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
              if (retryResult instanceof Promise) {
                throw new Error("Async schemas not supported in object keys currently");
              }
              if (retryResult.issues.length === 0) {
                keyResult = retryResult;
              }
            }
            if (keyResult.issues.length) {
              if (def.mode === "loose") {
                payload.value[key] = input[key];
              } else {
                payload.issues.push({
                  code: "invalid_key",
                  origin: "record",
                  issues: keyResult.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config())),
                  input: key,
                  path: [key],
                  inst
                });
              }
              continue;
            }
            const result2 = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
            if (result2 instanceof Promise) {
              proms.push(result2.then((result3) => {
                if (result3.issues.length) {
                  payload.issues.push(...util.prefixIssues(key, result3.issues));
                }
                payload.value[keyResult.value] = result3.value;
              }));
            } else {
              if (result2.issues.length) {
                payload.issues.push(...util.prefixIssues(key, result2.issues));
              }
              payload.value[keyResult.value] = result2.value;
            }
          }
        }
        if (proms.length) {
          return Promise.all(proms).then(() => payload);
        }
        return payload;
      };
    });
    exports.$ZodMap = core.$constructor("$ZodMap", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Map)) {
          payload.issues.push({
            expected: "map",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        const proms = [];
        payload.value = /* @__PURE__ */ new Map();
        for (const [key, value] of input) {
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          const valueResult = def.valueType._zod.run({ value, issues: [] }, ctx);
          if (keyResult instanceof Promise || valueResult instanceof Promise) {
            proms.push(Promise.all([keyResult, valueResult]).then(([keyResult2, valueResult2]) => {
              handleMapResult(keyResult2, valueResult2, payload, key, input, inst, ctx);
            }));
          } else {
            handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
          }
        }
        if (proms.length)
          return Promise.all(proms).then(() => payload);
        return payload;
      };
    });
    function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
      if (keyResult.issues.length) {
        if (util.propertyKeyTypes.has(typeof key)) {
          final.issues.push(...util.prefixIssues(key, keyResult.issues));
        } else {
          final.issues.push({
            code: "invalid_key",
            origin: "map",
            input,
            inst,
            issues: keyResult.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config()))
          });
        }
      }
      if (valueResult.issues.length) {
        if (util.propertyKeyTypes.has(typeof key)) {
          final.issues.push(...util.prefixIssues(key, valueResult.issues));
        } else {
          final.issues.push({
            origin: "map",
            code: "invalid_element",
            input,
            inst,
            key,
            issues: valueResult.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config()))
          });
        }
      }
      final.value.set(keyResult.value, valueResult.value);
    }
    exports.$ZodSet = core.$constructor("$ZodSet", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Set)) {
          payload.issues.push({
            input,
            inst,
            expected: "set",
            code: "invalid_type"
          });
          return payload;
        }
        const proms = [];
        payload.value = /* @__PURE__ */ new Set();
        for (const item of input) {
          const result2 = def.valueType._zod.run({ value: item, issues: [] }, ctx);
          if (result2 instanceof Promise) {
            proms.push(result2.then((result3) => handleSetResult(result3, payload)));
          } else
            handleSetResult(result2, payload);
        }
        if (proms.length)
          return Promise.all(proms).then(() => payload);
        return payload;
      };
    });
    function handleSetResult(result2, final) {
      if (result2.issues.length) {
        final.issues.push(...result2.issues);
      }
      final.value.add(result2.value);
    }
    exports.$ZodEnum = core.$constructor("$ZodEnum", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const values = util.getEnumValues(def.entries);
      const valuesSet = new Set(values);
      inst._zod.values = valuesSet;
      inst._zod.pattern = new RegExp(`^(${values.filter((k) => util.propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? util.escapeRegex(o) : o.toString()).join("|")})$`);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (valuesSet.has(input)) {
          return payload;
        }
        payload.issues.push({
          code: "invalid_value",
          values,
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodLiteral = core.$constructor("$ZodLiteral", (inst, def) => {
      exports.$ZodType.init(inst, def);
      if (def.values.length === 0) {
        throw new Error("Cannot create literal schema with no valid values");
      }
      const values = new Set(def.values);
      inst._zod.values = values;
      inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? util.escapeRegex(o) : o ? util.escapeRegex(o.toString()) : String(o)).join("|")})$`);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (values.has(input)) {
          return payload;
        }
        payload.issues.push({
          code: "invalid_value",
          values: def.values,
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodFile = core.$constructor("$ZodFile", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input instanceof File)
          return payload;
        payload.issues.push({
          expected: "file",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      };
    });
    exports.$ZodTransform = core.$constructor("$ZodTransform", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          throw new core.$ZodEncodeError(inst.constructor.name);
        }
        const _out = def.transform(payload.value, payload);
        if (ctx.async) {
          const output = _out instanceof Promise ? _out : Promise.resolve(_out);
          return output.then((output2) => {
            payload.value = output2;
            payload.fallback = true;
            return payload;
          });
        }
        if (_out instanceof Promise) {
          throw new core.$ZodAsyncError();
        }
        payload.value = _out;
        payload.fallback = true;
        return payload;
      };
    });
    function handleOptionalResult(result2, input) {
      if (input === void 0 && (result2.issues.length || result2.fallback)) {
        return { issues: [], value: void 0 };
      }
      return result2;
    }
    exports.$ZodOptional = core.$constructor("$ZodOptional", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      inst._zod.optout = "optional";
      util.defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
      });
      util.defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${util.cleanRegex(pattern.source)})?$`) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
          const input = payload.value;
          const result2 = def.innerType._zod.run(payload, ctx);
          if (result2 instanceof Promise)
            return result2.then((r) => handleOptionalResult(r, input));
          return handleOptionalResult(result2, input);
        }
        if (payload.value === void 0) {
          return payload;
        }
        return def.innerType._zod.run(payload, ctx);
      };
    });
    exports.$ZodExactOptional = core.$constructor("$ZodExactOptional", (inst, def) => {
      exports.$ZodOptional.init(inst, def);
      util.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      util.defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
      inst._zod.parse = (payload, ctx) => {
        return def.innerType._zod.run(payload, ctx);
      };
    });
    exports.$ZodNullable = core.$constructor("$ZodNullable", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util.defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      util.defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      util.defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${util.cleanRegex(pattern.source)}|null)$`) : void 0;
      });
      util.defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (payload.value === null)
          return payload;
        return def.innerType._zod.run(payload, ctx);
      };
    });
    exports.$ZodDefault = core.$constructor("$ZodDefault", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      util.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === void 0) {
          payload.value = def.defaultValue;
          return payload;
        }
        const result2 = def.innerType._zod.run(payload, ctx);
        if (result2 instanceof Promise) {
          return result2.then((result3) => handleDefaultResult(result3, def));
        }
        return handleDefaultResult(result2, def);
      };
    });
    function handleDefaultResult(payload, def) {
      if (payload.value === void 0) {
        payload.value = def.defaultValue;
      }
      return payload;
    }
    exports.$ZodPrefault = core.$constructor("$ZodPrefault", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      util.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === void 0) {
          payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
      };
    });
    exports.$ZodNonOptional = core.$constructor("$ZodNonOptional", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util.defineLazy(inst._zod, "values", () => {
        const v = def.innerType._zod.values;
        return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        const result2 = def.innerType._zod.run(payload, ctx);
        if (result2 instanceof Promise) {
          return result2.then((result3) => handleNonOptionalResult(result3, inst));
        }
        return handleNonOptionalResult(result2, inst);
      };
    });
    function handleNonOptionalResult(payload, inst) {
      if (!payload.issues.length && payload.value === void 0) {
        payload.issues.push({
          code: "invalid_type",
          expected: "nonoptional",
          input: payload.value,
          inst
        });
      }
      return payload;
    }
    exports.$ZodSuccess = core.$constructor("$ZodSuccess", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          throw new core.$ZodEncodeError("ZodSuccess");
        }
        const result2 = def.innerType._zod.run(payload, ctx);
        if (result2 instanceof Promise) {
          return result2.then((result3) => {
            payload.value = result3.issues.length === 0;
            return payload;
          });
        }
        payload.value = result2.issues.length === 0;
        return payload;
      };
    });
    exports.$ZodCatch = core.$constructor("$ZodCatch", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.optin = "optional";
      util.defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      util.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        const result2 = def.innerType._zod.run(payload, ctx);
        if (result2 instanceof Promise) {
          return result2.then((result3) => {
            payload.value = result3.value;
            if (result3.issues.length) {
              payload.value = def.catchValue({
                ...payload,
                error: {
                  issues: result3.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config()))
                },
                input: payload.value
              });
              payload.issues = [];
              payload.fallback = true;
            }
            return payload;
          });
        }
        payload.value = result2.value;
        if (result2.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result2.issues.map((iss) => util.finalizeIssue(iss, ctx, core.config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      };
    });
    exports.$ZodNaN = core.$constructor("$ZodNaN", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
          payload.issues.push({
            input: payload.value,
            inst,
            expected: "nan",
            code: "invalid_type"
          });
          return payload;
        }
        return payload;
      };
    });
    exports.$ZodPipe = core.$constructor("$ZodPipe", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util.defineLazy(inst._zod, "values", () => def.in._zod.values);
      util.defineLazy(inst._zod, "optin", () => def.in._zod.optin);
      util.defineLazy(inst._zod, "optout", () => def.out._zod.optout);
      util.defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          const right = def.out._zod.run(payload, ctx);
          if (right instanceof Promise) {
            return right.then((right2) => handlePipeResult(right2, def.in, ctx));
          }
          return handlePipeResult(right, def.in, ctx);
        }
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
          return left.then((left2) => handlePipeResult(left2, def.out, ctx));
        }
        return handlePipeResult(left, def.out, ctx);
      };
    });
    function handlePipeResult(left, next, ctx) {
      if (left.issues.length) {
        left.aborted = true;
        return left;
      }
      return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
    }
    exports.$ZodCodec = core.$constructor("$ZodCodec", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util.defineLazy(inst._zod, "values", () => def.in._zod.values);
      util.defineLazy(inst._zod, "optin", () => def.in._zod.optin);
      util.defineLazy(inst._zod, "optout", () => def.out._zod.optout);
      util.defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
      inst._zod.parse = (payload, ctx) => {
        const direction = ctx.direction || "forward";
        if (direction === "forward") {
          const left = def.in._zod.run(payload, ctx);
          if (left instanceof Promise) {
            return left.then((left2) => handleCodecAResult(left2, def, ctx));
          }
          return handleCodecAResult(left, def, ctx);
        } else {
          const right = def.out._zod.run(payload, ctx);
          if (right instanceof Promise) {
            return right.then((right2) => handleCodecAResult(right2, def, ctx));
          }
          return handleCodecAResult(right, def, ctx);
        }
      };
    });
    function handleCodecAResult(result2, def, ctx) {
      if (result2.issues.length) {
        result2.aborted = true;
        return result2;
      }
      const direction = ctx.direction || "forward";
      if (direction === "forward") {
        const transformed = def.transform(result2.value, result2);
        if (transformed instanceof Promise) {
          return transformed.then((value) => handleCodecTxResult(result2, value, def.out, ctx));
        }
        return handleCodecTxResult(result2, transformed, def.out, ctx);
      } else {
        const transformed = def.reverseTransform(result2.value, result2);
        if (transformed instanceof Promise) {
          return transformed.then((value) => handleCodecTxResult(result2, value, def.in, ctx));
        }
        return handleCodecTxResult(result2, transformed, def.in, ctx);
      }
    }
    function handleCodecTxResult(left, value, nextSchema, ctx) {
      if (left.issues.length) {
        left.aborted = true;
        return left;
      }
      return nextSchema._zod.run({ value, issues: left.issues }, ctx);
    }
    exports.$ZodPreprocess = core.$constructor("$ZodPreprocess", (inst, def) => {
      exports.$ZodPipe.init(inst, def);
    });
    exports.$ZodReadonly = core.$constructor("$ZodReadonly", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util.defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
      util.defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      util.defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
      util.defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        const result2 = def.innerType._zod.run(payload, ctx);
        if (result2 instanceof Promise) {
          return result2.then(handleReadonlyResult);
        }
        return handleReadonlyResult(result2);
      };
    });
    function handleReadonlyResult(payload) {
      payload.value = Object.freeze(payload.value);
      return payload;
    }
    exports.$ZodTemplateLiteral = core.$constructor("$ZodTemplateLiteral", (inst, def) => {
      exports.$ZodType.init(inst, def);
      const regexParts = [];
      for (const part of def.parts) {
        if (typeof part === "object" && part !== null) {
          if (!part._zod.pattern) {
            throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
          }
          const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
          if (!source)
            throw new Error(`Invalid template literal part: ${part._zod.traits}`);
          const start = source.startsWith("^") ? 1 : 0;
          const end = source.endsWith("$") ? source.length - 1 : source.length;
          regexParts.push(source.slice(start, end));
        } else if (part === null || util.primitiveTypes.has(typeof part)) {
          regexParts.push(util.escapeRegex(`${part}`));
        } else {
          throw new Error(`Invalid template literal part: ${part}`);
        }
      }
      inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
      inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "string") {
          payload.issues.push({
            input: payload.value,
            inst,
            expected: "string",
            code: "invalid_type"
          });
          return payload;
        }
        inst._zod.pattern.lastIndex = 0;
        if (!inst._zod.pattern.test(payload.value)) {
          payload.issues.push({
            input: payload.value,
            inst,
            code: "invalid_format",
            format: def.format ?? "template_literal",
            pattern: inst._zod.pattern.source
          });
          return payload;
        }
        return payload;
      };
    });
    exports.$ZodFunction = core.$constructor("$ZodFunction", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._def = def;
      inst._zod.def = def;
      inst.implement = (func) => {
        if (typeof func !== "function") {
          throw new Error("implement() must be called with a function");
        }
        return function(...args) {
          const parsedArgs = inst._def.input ? (0, parse_js_1.parse)(inst._def.input, args) : args;
          const result2 = Reflect.apply(func, this, parsedArgs);
          if (inst._def.output) {
            return (0, parse_js_1.parse)(inst._def.output, result2);
          }
          return result2;
        };
      };
      inst.implementAsync = (func) => {
        if (typeof func !== "function") {
          throw new Error("implementAsync() must be called with a function");
        }
        return async function(...args) {
          const parsedArgs = inst._def.input ? await (0, parse_js_1.parseAsync)(inst._def.input, args) : args;
          const result2 = await Reflect.apply(func, this, parsedArgs);
          if (inst._def.output) {
            return await (0, parse_js_1.parseAsync)(inst._def.output, result2);
          }
          return result2;
        };
      };
      inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "function") {
          payload.issues.push({
            code: "invalid_type",
            expected: "function",
            input: payload.value,
            inst
          });
          return payload;
        }
        const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
        if (hasPromiseOutput) {
          payload.value = inst.implementAsync(payload.value);
        } else {
          payload.value = inst.implement(payload.value);
        }
        return payload;
      };
      inst.input = (...args) => {
        const F = inst.constructor;
        if (Array.isArray(args[0])) {
          return new F({
            type: "function",
            input: new exports.$ZodTuple({
              type: "tuple",
              items: args[0],
              rest: args[1]
            }),
            output: inst._def.output
          });
        }
        return new F({
          type: "function",
          input: args[0],
          output: inst._def.output
        });
      };
      inst.output = (output) => {
        const F = inst.constructor;
        return new F({
          type: "function",
          input: inst._def.input,
          output
        });
      };
      return inst;
    });
    exports.$ZodPromise = core.$constructor("$ZodPromise", (inst, def) => {
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
      };
    });
    exports.$ZodLazy = core.$constructor("$ZodLazy", (inst, def) => {
      exports.$ZodType.init(inst, def);
      util.defineLazy(inst._zod, "innerType", () => {
        const d = def;
        if (!d._cachedInner)
          d._cachedInner = def.getter();
        return d._cachedInner;
      });
      util.defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
      util.defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
      util.defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? void 0);
      util.defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? void 0);
      inst._zod.parse = (payload, ctx) => {
        const inner = inst._zod.innerType;
        return inner._zod.run(payload, ctx);
      };
    });
    exports.$ZodCustom = core.$constructor("$ZodCustom", (inst, def) => {
      checks.$ZodCheck.init(inst, def);
      exports.$ZodType.init(inst, def);
      inst._zod.parse = (payload, _) => {
        return payload;
      };
      inst._zod.check = (payload) => {
        const input = payload.value;
        const r = def.fn(input);
        if (r instanceof Promise) {
          return r.then((r2) => handleRefineResult(r2, payload, input, inst));
        }
        handleRefineResult(r, payload, input, inst);
        return;
      };
    });
    function handleRefineResult(result2, payload, input, inst) {
      if (!result2) {
        const _iss = {
          code: "custom",
          input,
          inst,
          // incorporates params.error into issue reporting
          path: [...inst._zod.def.path ?? []],
          // incorporates params.error into issue reporting
          continue: !inst._zod.def.abort
          // params: inst._zod.def.params,
        };
        if (inst._zod.def.params)
          _iss.params = inst._zod.def.params;
        payload.issues.push(util.issue(_iss));
      }
    }
  }
});

// node_modules/zod/v4/locales/ar.cjs
var require_ar = __commonJS({
  "node_modules/zod/v4/locales/ar.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u062D\u0631\u0641", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
        file: { unit: "\u0628\u0627\u064A\u062A", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
        array: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" },
        set: { unit: "\u0639\u0646\u0635\u0631", verb: "\u0623\u0646 \u064A\u062D\u0648\u064A" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0645\u062F\u062E\u0644",
        email: "\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
        url: "\u0631\u0627\u0628\u0637",
        emoji: "\u0625\u064A\u0645\u0648\u062C\u064A",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
        date: "\u062A\u0627\u0631\u064A\u062E \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
        time: "\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
        duration: "\u0645\u062F\u0629 \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
        ipv4: "\u0639\u0646\u0648\u0627\u0646 IPv4",
        ipv6: "\u0639\u0646\u0648\u0627\u0646 IPv6",
        cidrv4: "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv4",
        cidrv6: "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv6",
        base64: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64-encoded",
        base64url: "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64url-encoded",
        json_string: "\u0646\u064E\u0635 \u0639\u0644\u0649 \u0647\u064A\u0626\u0629 JSON",
        e164: "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0628\u0645\u0639\u064A\u0627\u0631 E.164",
        jwt: "JWT",
        template_literal: "\u0645\u062F\u062E\u0644"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 instanceof ${issue.expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${received}`;
            }
            return `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${expected}\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062A\u0648\u0642\u0639 \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u062D\u062F \u0647\u0630\u0647 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A: ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return ` \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${issue.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0635\u0631"}`;
            return `\u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 ${issue.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629"} ${adj} ${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${issue.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 ${issue.origin} \u0623\u0646 \u064A\u0643\u0648\u0646 ${adj} ${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0628\u062F\u0623 \u0628\u0640 "${issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0646\u062A\u0647\u064A \u0628\u0640 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0636\u0645\u0651\u064E\u0646 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0637\u0627\u0628\u0642 \u0627\u0644\u0646\u0645\u0637 ${_issue.pattern}`;
            return `${FormatDictionary[_issue.format] ?? issue.format} \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644`;
          }
          case "not_multiple_of":
            return `\u0631\u0642\u0645 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0645\u0646 \u0645\u0636\u0627\u0639\u0641\u0627\u062A ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u0645\u0639\u0631\u0641${issue.keys.length > 1 ? "\u0627\u062A" : ""} \u063A\u0631\u064A\u0628${issue.keys.length > 1 ? "\u0629" : ""}: ${util.joinValues(issue.keys, "\u060C ")}`;
          case "invalid_key":
            return `\u0645\u0639\u0631\u0641 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${issue.origin}`;
          case "invalid_union":
            return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
          case "invalid_element":
            return `\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ${issue.origin}`;
          default:
            return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/az.cjs
var require_az = __commonJS({
  "node_modules/zod/v4/locales/az.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
        file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
        array: { unit: "element", verb: "olmal\u0131d\u0131r" },
        set: { unit: "element", verb: "olmal\u0131d\u0131r" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof ${issue.expected}, daxil olan ${received}`;
            }
            return `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${expected}, daxil olan ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ${util.stringifyPrimitive(issue.values[0])}`;
            return `Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${issue.origin ?? "d\u0259y\u0259r"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
            return `\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ${issue.origin ?? "d\u0259y\u0259r"} ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            return `\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ${issue.origin} ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Yanl\u0131\u015F m\u0259tn: "${_issue.prefix}" il\u0259 ba\u015Flamal\u0131d\u0131r`;
            if (_issue.format === "ends_with")
              return `Yanl\u0131\u015F m\u0259tn: "${_issue.suffix}" il\u0259 bitm\u0259lidir`;
            if (_issue.format === "includes")
              return `Yanl\u0131\u015F m\u0259tn: "${_issue.includes}" daxil olmal\u0131d\u0131r`;
            if (_issue.format === "regex")
              return `Yanl\u0131\u015F m\u0259tn: ${_issue.pattern} \u015Fablonuna uy\u011Fun olmal\u0131d\u0131r`;
            return `Yanl\u0131\u015F ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Yanl\u0131\u015F \u0259d\u0259d: ${issue.divisor} il\u0259 b\xF6l\xFCn\u0259 bil\u0259n olmal\u0131d\u0131r`;
          case "unrecognized_keys":
            return `Tan\u0131nmayan a\xE7ar${issue.keys.length > 1 ? "lar" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `${issue.origin} daxilind\u0259 yanl\u0131\u015F a\xE7ar`;
          case "invalid_union":
            return "Yanl\u0131\u015F d\u0259y\u0259r";
          case "invalid_element":
            return `${issue.origin} daxilind\u0259 yanl\u0131\u015F d\u0259y\u0259r`;
          default:
            return `Yanl\u0131\u015F d\u0259y\u0259r`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/be.cjs
var require_be = __commonJS({
  "node_modules/zod/v4/locales/be.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    function getBelarusianPlural(count, one, few, many) {
      const absCount = Math.abs(count);
      const lastDigit = absCount % 10;
      const lastTwoDigits = absCount % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
      }
      if (lastDigit === 1) {
        return one;
      }
      if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
      }
      return many;
    }
    var error = () => {
      const Sizable = {
        string: {
          unit: {
            one: "\u0441\u0456\u043C\u0432\u0430\u043B",
            few: "\u0441\u0456\u043C\u0432\u0430\u043B\u044B",
            many: "\u0441\u0456\u043C\u0432\u0430\u043B\u0430\u045E"
          },
          verb: "\u043C\u0435\u0446\u044C"
        },
        array: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E"
          },
          verb: "\u043C\u0435\u0446\u044C"
        },
        set: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E"
          },
          verb: "\u043C\u0435\u0446\u044C"
        },
        file: {
          unit: {
            one: "\u0431\u0430\u0439\u0442",
            few: "\u0431\u0430\u0439\u0442\u044B",
            many: "\u0431\u0430\u0439\u0442\u0430\u045E"
          },
          verb: "\u043C\u0435\u0446\u044C"
        }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0443\u0432\u043E\u0434",
        email: "email \u0430\u0434\u0440\u0430\u0441",
        url: "URL",
        emoji: "\u044D\u043C\u043E\u0434\u0437\u0456",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u0434\u0430\u0442\u0430 \u0456 \u0447\u0430\u0441",
        date: "ISO \u0434\u0430\u0442\u0430",
        time: "ISO \u0447\u0430\u0441",
        duration: "ISO \u043F\u0440\u0430\u0446\u044F\u0433\u043B\u0430\u0441\u0446\u044C",
        ipv4: "IPv4 \u0430\u0434\u0440\u0430\u0441",
        ipv6: "IPv6 \u0430\u0434\u0440\u0430\u0441",
        cidrv4: "IPv4 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
        cidrv6: "IPv6 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
        base64: "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64",
        base64url: "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64url",
        json_string: "JSON \u0440\u0430\u0434\u043E\u043A",
        e164: "\u043D\u0443\u043C\u0430\u0440 E.164",
        jwt: "JWT",
        template_literal: "\u0443\u0432\u043E\u0434"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u043B\u0456\u043A",
        array: "\u043C\u0430\u0441\u0456\u045E"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F instanceof ${issue.expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${received}`;
            }
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F ${expected}, \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0432\u0430\u0440\u044B\u044F\u043D\u0442: \u0447\u0430\u043A\u0430\u045E\u0441\u044F \u0430\u0434\u0437\u0456\u043D \u0437 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              const maxValue = Number(issue.maximum);
              const unit = getBelarusianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${sizing.verb} ${adj}${issue.maximum.toString()} ${unit}`;
            }
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue.origin ?? "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435"} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              const minValue = Number(issue.minimum);
              const unit = getBelarusianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ${sizing.verb} ${adj}${issue.minimum.toString()} ${unit}`;
            }
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E ${issue.origin} \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u043F\u0430\u0447\u044B\u043D\u0430\u0446\u0446\u0430 \u0437 "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0432\u0430\u0446\u0446\u0430 \u043D\u0430 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u043C\u044F\u0448\u0447\u0430\u0446\u044C "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0430\u0434\u043F\u0430\u0432\u044F\u0434\u0430\u0446\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${_issue.pattern}`;
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043B\u0456\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0431\u044B\u0446\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u0430\u0441\u043F\u0430\u0437\u043D\u0430\u043D\u044B ${issue.keys.length > 1 ? "\u043A\u043B\u044E\u0447\u044B" : "\u043A\u043B\u044E\u0447"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043A\u043B\u044E\u0447 \u0443 ${issue.origin}`;
          case "invalid_union":
            return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
          case "invalid_element":
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u0430\u0435 \u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435 \u045E ${issue.origin}`;
          default:
            return `\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/bg.cjs
var require_bg = __commonJS({
  "node_modules/zod/v4/locales/bg.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
        file: { unit: "\u0431\u0430\u0439\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
        array: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" },
        set: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430", verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0432\u0445\u043E\u0434",
        email: "\u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441",
        url: "URL",
        emoji: "\u0435\u043C\u043E\u0434\u0436\u0438",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u0432\u0440\u0435\u043C\u0435",
        date: "ISO \u0434\u0430\u0442\u0430",
        time: "ISO \u0432\u0440\u0435\u043C\u0435",
        duration: "ISO \u043F\u0440\u043E\u0434\u044A\u043B\u0436\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442",
        ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
        ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
        cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
        cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
        base64: "base64-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
        base64url: "base64url-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
        json_string: "JSON \u043D\u0438\u0437",
        e164: "E.164 \u043D\u043E\u043C\u0435\u0440",
        jwt: "JWT",
        template_literal: "\u0432\u0445\u043E\u0434"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0447\u0438\u0441\u043B\u043E",
        array: "\u043C\u0430\u0441\u0438\u0432"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D instanceof ${issue.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${received}`;
            }
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u043E\u043F\u0446\u0438\u044F: \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u043E \u0435\u0434\u043D\u043E \u043E\u0442 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430"}`;
            return `\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue.origin ?? "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442"} \u0434\u0430 \u0431\u044A\u0434\u0435 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue.origin} \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 ${issue.origin} \u0434\u0430 \u0431\u044A\u0434\u0435 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u0432\u0430 \u0441 "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u0432\u044A\u0440\u0448\u0432\u0430 \u0441 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0432\u0430 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0441\u044A\u0432\u043F\u0430\u0434\u0430 \u0441 ${_issue.pattern}`;
            let invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D";
            if (_issue.format === "emoji")
              invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
            if (_issue.format === "datetime")
              invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
            if (_issue.format === "date")
              invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430";
            if (_issue.format === "time")
              invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
            if (_issue.format === "duration")
              invalid_adj = "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430";
            return `${invalid_adj} ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E \u0447\u0438\u0441\u043B\u043E: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u0430\u0437\u043F\u043E\u0437\u043D\u0430\u0442${issue.keys.length > 1 ? "\u0438" : ""} \u043A\u043B\u044E\u0447${issue.keys.length > 1 ? "\u043E\u0432\u0435" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043A\u043B\u044E\u0447 \u0432 ${issue.origin}`;
          case "invalid_union":
            return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
          case "invalid_element":
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442 \u0432 ${issue.origin}`;
          default:
            return `\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ca.cjs
var require_ca = __commonJS({
  "node_modules/zod/v4/locales/ca.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "car\xE0cters", verb: "contenir" },
        file: { unit: "bytes", verb: "contenir" },
        array: { unit: "elements", verb: "contenir" },
        set: { unit: "elements", verb: "contenir" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "entrada",
        email: "adre\xE7a electr\xF2nica",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "durada ISO",
        ipv4: "adre\xE7a IPv4",
        ipv6: "adre\xE7a IPv6",
        cidrv4: "rang IPv4",
        cidrv6: "rang IPv6",
        base64: "cadena codificada en base64",
        base64url: "cadena codificada en base64url",
        json_string: "cadena JSON",
        e164: "n\xFAmero E.164",
        jwt: "JWT",
        template_literal: "entrada"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Tipus inv\xE0lid: s'esperava instanceof ${issue.expected}, s'ha rebut ${received}`;
            }
            return `Tipus inv\xE0lid: s'esperava ${expected}, s'ha rebut ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Valor inv\xE0lid: s'esperava ${util.stringifyPrimitive(issue.values[0])}`;
            return `Opci\xF3 inv\xE0lida: s'esperava una de ${util.joinValues(issue.values, " o ")}`;
          case "too_big": {
            const adj = issue.inclusive ? "com a m\xE0xim" : "menys de";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} contingu\xE9s ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
            return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} fos ${adj} ${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? "com a m\xEDnim" : "m\xE9s de";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Massa petit: s'esperava que ${issue.origin} contingu\xE9s ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Massa petit: s'esperava que ${issue.origin} fos ${adj} ${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `Format inv\xE0lid: ha de comen\xE7ar amb "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Format inv\xE0lid: ha d'acabar amb "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Format inv\xE0lid: ha d'incloure "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Format inv\xE0lid: ha de coincidir amb el patr\xF3 ${_issue.pattern}`;
            return `Format inv\xE0lid per a ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `N\xFAmero inv\xE0lid: ha de ser m\xFAltiple de ${issue.divisor}`;
          case "unrecognized_keys":
            return `Clau${issue.keys.length > 1 ? "s" : ""} no reconeguda${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Clau inv\xE0lida a ${issue.origin}`;
          case "invalid_union":
            return "Entrada inv\xE0lida";
          // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
          case "invalid_element":
            return `Element inv\xE0lid a ${issue.origin}`;
          default:
            return `Entrada inv\xE0lida`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/cs.cjs
var require_cs = __commonJS({
  "node_modules/zod/v4/locales/cs.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "znak\u016F", verb: "m\xEDt" },
        file: { unit: "bajt\u016F", verb: "m\xEDt" },
        array: { unit: "prvk\u016F", verb: "m\xEDt" },
        set: { unit: "prvk\u016F", verb: "m\xEDt" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "regul\xE1rn\xED v\xFDraz",
        email: "e-mailov\xE1 adresa",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "datum a \u010Das ve form\xE1tu ISO",
        date: "datum ve form\xE1tu ISO",
        time: "\u010Das ve form\xE1tu ISO",
        duration: "doba trv\xE1n\xED ISO",
        ipv4: "IPv4 adresa",
        ipv6: "IPv6 adresa",
        cidrv4: "rozsah IPv4",
        cidrv6: "rozsah IPv6",
        base64: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64",
        base64url: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64url",
        json_string: "\u0159et\u011Bzec ve form\xE1tu JSON",
        e164: "\u010D\xEDslo E.164",
        jwt: "JWT",
        template_literal: "vstup"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u010D\xEDslo",
        string: "\u0159et\u011Bzec",
        function: "funkce",
        array: "pole"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof ${issue.expected}, obdr\u017Eeno ${received}`;
            }
            return `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${expected}, obdr\u017Eeno ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ${util.stringifyPrimitive(issue.values[0])}`;
            return `Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${issue.origin ?? "hodnota"} mus\xED m\xEDt ${adj}${issue.maximum.toString()} ${sizing.unit ?? "prvk\u016F"}`;
            }
            return `Hodnota je p\u0159\xEDli\u0161 velk\xE1: ${issue.origin ?? "hodnota"} mus\xED b\xFDt ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${issue.origin ?? "hodnota"} mus\xED m\xEDt ${adj}${issue.minimum.toString()} ${sizing.unit ?? "prvk\u016F"}`;
            }
            return `Hodnota je p\u0159\xEDli\u0161 mal\xE1: ${issue.origin ?? "hodnota"} mus\xED b\xFDt ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Neplatn\xFD \u0159et\u011Bzec: mus\xED za\u010D\xEDnat na "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Neplatn\xFD \u0159et\u011Bzec: mus\xED kon\u010Dit na "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Neplatn\xFD \u0159et\u011Bzec: mus\xED obsahovat "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Neplatn\xFD \u0159et\u011Bzec: mus\xED odpov\xEDdat vzoru ${_issue.pattern}`;
            return `Neplatn\xFD form\xE1t ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Neplatn\xE9 \u010D\xEDslo: mus\xED b\xFDt n\xE1sobkem ${issue.divisor}`;
          case "unrecognized_keys":
            return `Nezn\xE1m\xE9 kl\xED\u010De: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Neplatn\xFD kl\xED\u010D v ${issue.origin}`;
          case "invalid_union":
            return "Neplatn\xFD vstup";
          case "invalid_element":
            return `Neplatn\xE1 hodnota v ${issue.origin}`;
          default:
            return `Neplatn\xFD vstup`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/da.cjs
var require_da = __commonJS({
  "node_modules/zod/v4/locales/da.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "tegn", verb: "havde" },
        file: { unit: "bytes", verb: "havde" },
        array: { unit: "elementer", verb: "indeholdt" },
        set: { unit: "elementer", verb: "indeholdt" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "e-mailadresse",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dato- og klokkesl\xE6t",
        date: "ISO-dato",
        time: "ISO-klokkesl\xE6t",
        duration: "ISO-varighed",
        ipv4: "IPv4-omr\xE5de",
        ipv6: "IPv6-omr\xE5de",
        cidrv4: "IPv4-spektrum",
        cidrv6: "IPv6-spektrum",
        base64: "base64-kodet streng",
        base64url: "base64url-kodet streng",
        json_string: "JSON-streng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        nan: "NaN",
        string: "streng",
        number: "tal",
        boolean: "boolean",
        array: "liste",
        object: "objekt",
        set: "s\xE6t",
        file: "fil"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Ugyldigt input: forventede instanceof ${issue.expected}, fik ${received}`;
            }
            return `Ugyldigt input: forventede ${expected}, fik ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Ugyldig v\xE6rdi: forventede ${util.stringifyPrimitive(issue.values[0])}`;
            return `Ugyldigt valg: forventede en af f\xF8lgende ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            if (sizing)
              return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
            return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            if (sizing) {
              return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `For lille: forventede ${origin} havde ${adj} ${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ugyldig streng: skal matche m\xF8nsteret ${_issue.pattern}`;
            return `Ugyldig ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Ugyldigt tal: skal v\xE6re deleligt med ${issue.divisor}`;
          case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Ukendte n\xF8gler" : "Ukendt n\xF8gle"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Ugyldig n\xF8gle i ${issue.origin}`;
          case "invalid_union":
            return "Ugyldigt input: matcher ingen af de tilladte typer";
          case "invalid_element":
            return `Ugyldig v\xE6rdi i ${issue.origin}`;
          default:
            return `Ugyldigt input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/de.cjs
var require_de = __commonJS({
  "node_modules/zod/v4/locales/de.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "Zeichen", verb: "zu haben" },
        file: { unit: "Bytes", verb: "zu haben" },
        array: { unit: "Elemente", verb: "zu haben" },
        set: { unit: "Elemente", verb: "zu haben" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "Eingabe",
        email: "E-Mail-Adresse",
        url: "URL",
        emoji: "Emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-Datum und -Uhrzeit",
        date: "ISO-Datum",
        time: "ISO-Uhrzeit",
        duration: "ISO-Dauer",
        ipv4: "IPv4-Adresse",
        ipv6: "IPv6-Adresse",
        cidrv4: "IPv4-Bereich",
        cidrv6: "IPv6-Bereich",
        base64: "Base64-codierter String",
        base64url: "Base64-URL-codierter String",
        json_string: "JSON-String",
        e164: "E.164-Nummer",
        jwt: "JWT",
        template_literal: "Eingabe"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "Zahl",
        array: "Array"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Ung\xFCltige Eingabe: erwartet instanceof ${issue.expected}, erhalten ${received}`;
            }
            return `Ung\xFCltige Eingabe: erwartet ${expected}, erhalten ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Ung\xFCltige Eingabe: erwartet ${util.stringifyPrimitive(issue.values[0])}`;
            return `Ung\xFCltige Option: erwartet eine von ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Zu gro\xDF: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
            return `Zu gro\xDF: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ist`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} hat`;
            }
            return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ist`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Ung\xFCltiger String: muss mit "${_issue.prefix}" beginnen`;
            if (_issue.format === "ends_with")
              return `Ung\xFCltiger String: muss mit "${_issue.suffix}" enden`;
            if (_issue.format === "includes")
              return `Ung\xFCltiger String: muss "${_issue.includes}" enthalten`;
            if (_issue.format === "regex")
              return `Ung\xFCltiger String: muss dem Muster ${_issue.pattern} entsprechen`;
            return `Ung\xFCltig: ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Ung\xFCltige Zahl: muss ein Vielfaches von ${issue.divisor} sein`;
          case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Unbekannte Schl\xFCssel" : "Unbekannter Schl\xFCssel"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Ung\xFCltiger Schl\xFCssel in ${issue.origin}`;
          case "invalid_union":
            return "Ung\xFCltige Eingabe";
          case "invalid_element":
            return `Ung\xFCltiger Wert in ${issue.origin}`;
          default:
            return `Ung\xFCltige Eingabe`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/el.cjs
var require_el = __commonJS({
  "node_modules/zod/v4/locales/el.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u03C7\u03B1\u03C1\u03B1\u03BA\u03C4\u03AE\u03C1\u03B5\u03C2", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" },
        file: { unit: "bytes", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" },
        array: { unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" },
        set: { unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" },
        map: { unit: "\u03BA\u03B1\u03C4\u03B1\u03C7\u03C9\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2", verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
        email: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03BA\u03B1\u03B9 \u03CE\u03C1\u03B1",
        date: "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1",
        time: "ISO \u03CE\u03C1\u03B1",
        duration: "ISO \u03B4\u03B9\u03AC\u03C1\u03BA\u03B5\u03B9\u03B1",
        ipv4: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv4",
        ipv6: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv6",
        mac: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 MAC",
        cidrv4: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv4",
        cidrv6: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv6",
        base64: "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64",
        base64url: "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64url",
        json_string: "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC JSON",
        e164: "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 E.164",
        jwt: "JWT",
        template_literal: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (typeof issue.expected === "string" && /^[A-Z]/.test(issue.expected)) {
              return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD instanceof ${issue.expected}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${received}`;
            }
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${expected}, \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD \u03AD\u03BD\u03B1 \u03B1\u03C0\u03CC ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1"}`;
            return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue.origin ?? "\u03C4\u03B9\u03BC\u03AE"} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue.origin} \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ${issue.origin} \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AC \u03BC\u03B5 "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B5\u03BB\u03B5\u03B9\u03CE\u03BD\u03B5\u03B9 \u03BC\u03B5 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C0\u03B5\u03C1\u03B9\u03AD\u03C7\u03B5\u03B9 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B1\u03B9\u03C1\u03B9\u03AC\u03B6\u03B5\u03B9 \u03BC\u03B5 \u03C4\u03BF \u03BC\u03BF\u03C4\u03AF\u03B2\u03BF ${_issue.pattern}`;
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF: ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF\u03C2 \u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C0\u03BF\u03BB\u03BB\u03B1\u03C0\u03BB\u03AC\u03C3\u03B9\u03BF \u03C4\u03BF\u03C5 ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u0386\u03B3\u03BD\u03C9\u03C3\u03C4${issue.keys.length > 1 ? "\u03B1" : "\u03BF"} \u03BA\u03BB\u03B5\u03B9\u03B4${issue.keys.length > 1 ? "\u03B9\u03AC" : "\u03AF"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF \u03BA\u03BB\u03B5\u03B9\u03B4\u03AF \u03C3\u03C4\u03BF ${issue.origin}`;
          case "invalid_union":
            return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
          case "invalid_element":
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C4\u03B9\u03BC\u03AE \u03C3\u03C4\u03BF ${issue.origin}`;
          default:
            return `\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/en.cjs
var require_en = __commonJS({
  "node_modules/zod/v4/locales/en.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "characters", verb: "to have" },
        file: { unit: "bytes", verb: "to have" },
        array: { unit: "items", verb: "to have" },
        set: { unit: "items", verb: "to have" },
        map: { unit: "entries", verb: "to have" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        mac: "MAC address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        // Compatibility: "nan" -> "NaN" for display
        nan: "NaN"
        // All other type names omitted - they fall back to raw values via ?? operator
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            return `Invalid input: expected ${expected}, received ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Invalid input: expected ${util.stringifyPrimitive(issue.values[0])}`;
            return `Invalid option: expected one of ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
            return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `Invalid string: must start with "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Invalid string: must end with "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Invalid string: must include "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Invalid string: must match pattern ${_issue.pattern}`;
            return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Invalid number: must be a multiple of ${issue.divisor}`;
          case "unrecognized_keys":
            return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Invalid key in ${issue.origin}`;
          case "invalid_union":
            if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) {
              const opts = issue.options.map((o) => `'${o}'`).join(" | ");
              return `Invalid discriminator value. Expected ${opts}`;
            }
            return "Invalid input";
          case "invalid_element":
            return `Invalid value in ${issue.origin}`;
          default:
            return `Invalid input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/eo.cjs
var require_eo = __commonJS({
  "node_modules/zod/v4/locales/eo.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "karaktrojn", verb: "havi" },
        file: { unit: "bajtojn", verb: "havi" },
        array: { unit: "elementojn", verb: "havi" },
        set: { unit: "elementojn", verb: "havi" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "enigo",
        email: "retadreso",
        url: "URL",
        emoji: "emo\u011Dio",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datotempo",
        date: "ISO-dato",
        time: "ISO-tempo",
        duration: "ISO-da\u016Dro",
        ipv4: "IPv4-adreso",
        ipv6: "IPv6-adreso",
        cidrv4: "IPv4-rango",
        cidrv6: "IPv6-rango",
        base64: "64-ume kodita karaktraro",
        base64url: "URL-64-ume kodita karaktraro",
        json_string: "JSON-karaktraro",
        e164: "E.164-nombro",
        jwt: "JWT",
        template_literal: "enigo"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "nombro",
        array: "tabelo",
        null: "senvalora"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Nevalida enigo: atendi\u011Dis instanceof ${issue.expected}, ricevi\u011Dis ${received}`;
            }
            return `Nevalida enigo: atendi\u011Dis ${expected}, ricevi\u011Dis ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Nevalida enigo: atendi\u011Dis ${util.stringifyPrimitive(issue.values[0])}`;
            return `Nevalida opcio: atendi\u011Dis unu el ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Tro granda: atendi\u011Dis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
            return `Tro granda: atendi\u011Dis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Tro malgranda: atendi\u011Dis ke ${issue.origin} havu ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Tro malgranda: atendi\u011Dis ke ${issue.origin} estu ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Nevalida karaktraro: devas komenci\u011Di per "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Nevalida karaktraro: devas fini\u011Di per "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
            return `Nevalida ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Nevalida nombro: devas esti oblo de ${issue.divisor}`;
          case "unrecognized_keys":
            return `Nekonata${issue.keys.length > 1 ? "j" : ""} \u015Dlosilo${issue.keys.length > 1 ? "j" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Nevalida \u015Dlosilo en ${issue.origin}`;
          case "invalid_union":
            return "Nevalida enigo";
          case "invalid_element":
            return `Nevalida valoro en ${issue.origin}`;
          default:
            return `Nevalida enigo`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/es.cjs
var require_es = __commonJS({
  "node_modules/zod/v4/locales/es.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "caracteres", verb: "tener" },
        file: { unit: "bytes", verb: "tener" },
        array: { unit: "elementos", verb: "tener" },
        set: { unit: "elementos", verb: "tener" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "entrada",
        email: "direcci\xF3n de correo electr\xF3nico",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "fecha y hora ISO",
        date: "fecha ISO",
        time: "hora ISO",
        duration: "duraci\xF3n ISO",
        ipv4: "direcci\xF3n IPv4",
        ipv6: "direcci\xF3n IPv6",
        cidrv4: "rango IPv4",
        cidrv6: "rango IPv6",
        base64: "cadena codificada en base64",
        base64url: "URL codificada en base64",
        json_string: "cadena JSON",
        e164: "n\xFAmero E.164",
        jwt: "JWT",
        template_literal: "entrada"
      };
      const TypeDictionary = {
        nan: "NaN",
        string: "texto",
        number: "n\xFAmero",
        boolean: "booleano",
        array: "arreglo",
        object: "objeto",
        set: "conjunto",
        file: "archivo",
        date: "fecha",
        bigint: "n\xFAmero grande",
        symbol: "s\xEDmbolo",
        undefined: "indefinido",
        null: "nulo",
        function: "funci\xF3n",
        map: "mapa",
        record: "registro",
        tuple: "tupla",
        enum: "enumeraci\xF3n",
        union: "uni\xF3n",
        literal: "literal",
        promise: "promesa",
        void: "vac\xEDo",
        never: "nunca",
        unknown: "desconocido",
        any: "cualquiera"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Entrada inv\xE1lida: se esperaba instanceof ${issue.expected}, recibido ${received}`;
            }
            return `Entrada inv\xE1lida: se esperaba ${expected}, recibido ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Entrada inv\xE1lida: se esperaba ${util.stringifyPrimitive(issue.values[0])}`;
            return `Opci\xF3n inv\xE1lida: se esperaba una de ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            if (sizing)
              return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
            return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            if (sizing) {
              return `Demasiado peque\xF1o: se esperaba que ${origin} tuviera ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Demasiado peque\xF1o: se esperaba que ${origin} fuera ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Cadena inv\xE1lida: debe comenzar con "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Cadena inv\xE1lida: debe terminar en "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Cadena inv\xE1lida: debe incluir "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Cadena inv\xE1lida: debe coincidir con el patr\xF3n ${_issue.pattern}`;
            return `Inv\xE1lido ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `N\xFAmero inv\xE1lido: debe ser m\xFAltiplo de ${issue.divisor}`;
          case "unrecognized_keys":
            return `Llave${issue.keys.length > 1 ? "s" : ""} desconocida${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Llave inv\xE1lida en ${TypeDictionary[issue.origin] ?? issue.origin}`;
          case "invalid_union":
            return "Entrada inv\xE1lida";
          case "invalid_element":
            return `Valor inv\xE1lido en ${TypeDictionary[issue.origin] ?? issue.origin}`;
          default:
            return `Entrada inv\xE1lida`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/fa.cjs
var require_fa = __commonJS({
  "node_modules/zod/v4/locales/fa.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
        file: { unit: "\u0628\u0627\u06CC\u062A", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
        array: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
        set: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0648\u0631\u0648\u062F\u06CC",
        email: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
        url: "URL",
        emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\u062A\u0627\u0631\u06CC\u062E \u0648 \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
        date: "\u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0632\u0648",
        time: "\u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
        duration: "\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
        ipv4: "IPv4 \u0622\u062F\u0631\u0633",
        ipv6: "IPv6 \u0622\u062F\u0631\u0633",
        cidrv4: "IPv4 \u062F\u0627\u0645\u0646\u0647",
        cidrv6: "IPv6 \u062F\u0627\u0645\u0646\u0647",
        base64: "base64-encoded \u0631\u0634\u062A\u0647",
        base64url: "base64url-encoded \u0631\u0634\u062A\u0647",
        json_string: "JSON \u0631\u0634\u062A\u0647",
        e164: "E.164 \u0639\u062F\u062F",
        jwt: "JWT",
        template_literal: "\u0648\u0631\u0648\u062F\u06CC"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0639\u062F\u062F",
        array: "\u0622\u0631\u0627\u06CC\u0647"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof ${issue.expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${received} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
            }
            return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${expected} \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ${received} \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F`;
          }
          case "invalid_value":
            if (issue.values.length === 1) {
              return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ${util.stringifyPrimitive(issue.values[0])} \u0645\u06CC\u200C\u0628\u0648\u062F`;
            }
            return `\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ${util.joinValues(issue.values, "|")} \u0645\u06CC\u200C\u0628\u0648\u062F`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${issue.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0635\u0631"} \u0628\u0627\u0634\u062F`;
            }
            return `\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ${issue.origin ?? "\u0645\u0642\u062F\u0627\u0631"} \u0628\u0627\u06CC\u062F ${adj}${issue.maximum.toString()} \u0628\u0627\u0634\u062F`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${issue.origin} \u0628\u0627\u06CC\u062F ${adj}${issue.minimum.toString()} ${sizing.unit} \u0628\u0627\u0634\u062F`;
            }
            return `\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ${issue.origin} \u0628\u0627\u06CC\u062F ${adj}${issue.minimum.toString()} \u0628\u0627\u0634\u062F`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${_issue.prefix}" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F`;
            }
            if (_issue.format === "ends_with") {
              return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "${_issue.suffix}" \u062A\u0645\u0627\u0645 \u0634\u0648\u062F`;
            }
            if (_issue.format === "includes") {
              return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 "${_issue.includes}" \u0628\u0627\u0634\u062F`;
            }
            if (_issue.format === "regex") {
              return `\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC ${_issue.pattern} \u0645\u0637\u0627\u0628\u0642\u062A \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F`;
            }
            return `${FormatDictionary[_issue.format] ?? issue.format} \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
          }
          case "not_multiple_of":
            return `\u0639\u062F\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0645\u0636\u0631\u0628 ${issue.divisor} \u0628\u0627\u0634\u062F`;
          case "unrecognized_keys":
            return `\u06A9\u0644\u06CC\u062F${issue.keys.length > 1 ? "\u0647\u0627\u06CC" : ""} \u0646\u0627\u0634\u0646\u0627\u0633: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u06A9\u0644\u06CC\u062F \u0646\u0627\u0634\u0646\u0627\u0633 \u062F\u0631 ${issue.origin}`;
          case "invalid_union":
            return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
          case "invalid_element":
            return `\u0645\u0642\u062F\u0627\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u062F\u0631 ${issue.origin}`;
          default:
            return `\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/fi.cjs
var require_fi = __commonJS({
  "node_modules/zod/v4/locales/fi.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "merkki\xE4", subject: "merkkijonon" },
        file: { unit: "tavua", subject: "tiedoston" },
        array: { unit: "alkiota", subject: "listan" },
        set: { unit: "alkiota", subject: "joukon" },
        number: { unit: "", subject: "luvun" },
        bigint: { unit: "", subject: "suuren kokonaisluvun" },
        int: { unit: "", subject: "kokonaisluvun" },
        date: { unit: "", subject: "p\xE4iv\xE4m\xE4\xE4r\xE4n" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "s\xE4\xE4nn\xF6llinen lauseke",
        email: "s\xE4hk\xF6postiosoite",
        url: "URL-osoite",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-aikaleima",
        date: "ISO-p\xE4iv\xE4m\xE4\xE4r\xE4",
        time: "ISO-aika",
        duration: "ISO-kesto",
        ipv4: "IPv4-osoite",
        ipv6: "IPv6-osoite",
        cidrv4: "IPv4-alue",
        cidrv6: "IPv6-alue",
        base64: "base64-koodattu merkkijono",
        base64url: "base64url-koodattu merkkijono",
        json_string: "JSON-merkkijono",
        e164: "E.164-luku",
        jwt: "JWT",
        template_literal: "templaattimerkkijono"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Virheellinen tyyppi: odotettiin instanceof ${issue.expected}, oli ${received}`;
            }
            return `Virheellinen tyyppi: odotettiin ${expected}, oli ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Virheellinen sy\xF6te: t\xE4ytyy olla ${util.stringifyPrimitive(issue.values[0])}`;
            return `Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Liian suuri: ${sizing.subject} t\xE4ytyy olla ${adj}${issue.maximum.toString()} ${sizing.unit}`.trim();
            }
            return `Liian suuri: arvon t\xE4ytyy olla ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Liian pieni: ${sizing.subject} t\xE4ytyy olla ${adj}${issue.minimum.toString()} ${sizing.unit}`.trim();
            }
            return `Liian pieni: arvon t\xE4ytyy olla ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Virheellinen sy\xF6te: t\xE4ytyy alkaa "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Virheellinen sy\xF6te: t\xE4ytyy loppua "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Virheellinen sy\xF6te: t\xE4ytyy sis\xE4lt\xE4\xE4 "${_issue.includes}"`;
            if (_issue.format === "regex") {
              return `Virheellinen sy\xF6te: t\xE4ytyy vastata s\xE4\xE4nn\xF6llist\xE4 lauseketta ${_issue.pattern}`;
            }
            return `Virheellinen ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Virheellinen luku: t\xE4ytyy olla luvun ${issue.divisor} monikerta`;
          case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return "Virheellinen avain tietueessa";
          case "invalid_union":
            return "Virheellinen unioni";
          case "invalid_element":
            return "Virheellinen arvo joukossa";
          default:
            return `Virheellinen sy\xF6te`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/fr.cjs
var require_fr = __commonJS({
  "node_modules/zod/v4/locales/fr.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "caract\xE8res", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "\xE9l\xE9ments", verb: "avoir" },
        set: { unit: "\xE9l\xE9ments", verb: "avoir" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "entr\xE9e",
        email: "adresse e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date et heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "dur\xE9e ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "cha\xEEne encod\xE9e en base64",
        base64url: "cha\xEEne encod\xE9e en base64url",
        json_string: "cha\xEEne JSON",
        e164: "num\xE9ro E.164",
        jwt: "JWT",
        template_literal: "entr\xE9e"
      };
      const TypeDictionary = {
        string: "cha\xEEne",
        number: "nombre",
        int: "entier",
        boolean: "bool\xE9en",
        bigint: "grand entier",
        symbol: "symbole",
        undefined: "ind\xE9fini",
        null: "null",
        never: "jamais",
        void: "vide",
        date: "date",
        array: "tableau",
        object: "objet",
        tuple: "tuple",
        record: "enregistrement",
        map: "carte",
        set: "ensemble",
        file: "fichier",
        nonoptional: "non-optionnel",
        nan: "NaN",
        function: "fonction"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Entr\xE9e invalide : instanceof ${issue.expected} attendu, ${received} re\xE7u`;
            }
            return `Entr\xE9e invalide : ${expected} attendu, ${received} re\xE7u`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Entr\xE9e invalide : ${util.stringifyPrimitive(issue.values[0])} attendu`;
            return `Option invalide : une valeur parmi ${util.joinValues(issue.values, "|")} attendue`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Trop grand : ${TypeDictionary[issue.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\xE9l\xE9ment(s)"}`;
            return `Trop grand : ${TypeDictionary[issue.origin] ?? "valeur"} doit \xEAtre ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Trop petit : ${TypeDictionary[issue.origin] ?? "valeur"} doit ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            return `Trop petit : ${TypeDictionary[issue.origin] ?? "valeur"} doit \xEAtre ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Cha\xEEne invalide : doit commencer par "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Cha\xEEne invalide : doit se terminer par "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Cha\xEEne invalide : doit inclure "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Cha\xEEne invalide : doit correspondre au mod\xE8le ${_issue.pattern}`;
            return `${FormatDictionary[_issue.format] ?? issue.format} invalide`;
          }
          case "not_multiple_of":
            return `Nombre invalide : doit \xEAtre un multiple de ${issue.divisor}`;
          case "unrecognized_keys":
            return `Cl\xE9${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Cl\xE9 invalide dans ${issue.origin}`;
          case "invalid_union":
            return "Entr\xE9e invalide";
          case "invalid_element":
            return `Valeur invalide dans ${issue.origin}`;
          default:
            return `Entr\xE9e invalide`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/fr-CA.cjs
var require_fr_CA = __commonJS({
  "node_modules/zod/v4/locales/fr-CA.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "caract\xE8res", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "\xE9l\xE9ments", verb: "avoir" },
        set: { unit: "\xE9l\xE9ments", verb: "avoir" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "entr\xE9e",
        email: "adresse courriel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date-heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "dur\xE9e ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "cha\xEEne encod\xE9e en base64",
        base64url: "cha\xEEne encod\xE9e en base64url",
        json_string: "cha\xEEne JSON",
        e164: "num\xE9ro E.164",
        jwt: "JWT",
        template_literal: "entr\xE9e"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Entr\xE9e invalide : attendu instanceof ${issue.expected}, re\xE7u ${received}`;
            }
            return `Entr\xE9e invalide : attendu ${expected}, re\xE7u ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Entr\xE9e invalide : attendu ${util.stringifyPrimitive(issue.values[0])}`;
            return `Option invalide : attendu l'une des valeurs suivantes ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "\u2264" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Trop grand : attendu que ${issue.origin ?? "la valeur"} ait ${adj}${issue.maximum.toString()} ${sizing.unit}`;
            return `Trop grand : attendu que ${issue.origin ?? "la valeur"} soit ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? "\u2265" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Trop petit : attendu que ${issue.origin} ait ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Trop petit : attendu que ${issue.origin} soit ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `Cha\xEEne invalide : doit commencer par "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Cha\xEEne invalide : doit se terminer par "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Cha\xEEne invalide : doit inclure "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Cha\xEEne invalide : doit correspondre au motif ${_issue.pattern}`;
            return `${FormatDictionary[_issue.format] ?? issue.format} invalide`;
          }
          case "not_multiple_of":
            return `Nombre invalide : doit \xEAtre un multiple de ${issue.divisor}`;
          case "unrecognized_keys":
            return `Cl\xE9${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Cl\xE9 invalide dans ${issue.origin}`;
          case "invalid_union":
            return "Entr\xE9e invalide";
          case "invalid_element":
            return `Valeur invalide dans ${issue.origin}`;
          default:
            return `Entr\xE9e invalide`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/he.cjs
var require_he = __commonJS({
  "node_modules/zod/v4/locales/he.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const TypeNames = {
        string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA", gender: "f" },
        number: { label: "\u05DE\u05E1\u05E4\u05E8", gender: "m" },
        boolean: { label: "\u05E2\u05E8\u05DA \u05D1\u05D5\u05DC\u05D9\u05D0\u05E0\u05D9", gender: "m" },
        bigint: { label: "BigInt", gender: "m" },
        date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA", gender: "m" },
        array: { label: "\u05DE\u05E2\u05E8\u05DA", gender: "m" },
        object: { label: "\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8", gender: "m" },
        null: { label: "\u05E2\u05E8\u05DA \u05E8\u05D9\u05E7 (null)", gender: "m" },
        undefined: { label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 (undefined)", gender: "m" },
        symbol: { label: "\u05E1\u05D9\u05DE\u05D1\u05D5\u05DC (Symbol)", gender: "m" },
        function: { label: "\u05E4\u05D5\u05E0\u05E7\u05E6\u05D9\u05D4", gender: "f" },
        map: { label: "\u05DE\u05E4\u05D4 (Map)", gender: "f" },
        set: { label: "\u05E7\u05D1\u05D5\u05E6\u05D4 (Set)", gender: "f" },
        file: { label: "\u05E7\u05D5\u05D1\u05E5", gender: "m" },
        promise: { label: "Promise", gender: "m" },
        NaN: { label: "NaN", gender: "m" },
        unknown: { label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2", gender: "m" },
        value: { label: "\u05E2\u05E8\u05DA", gender: "m" }
      };
      const Sizable = {
        string: { unit: "\u05EA\u05D5\u05D5\u05D9\u05DD", shortLabel: "\u05E7\u05E6\u05E8", longLabel: "\u05D0\u05E8\u05D5\u05DA" },
        file: { unit: "\u05D1\u05D9\u05D9\u05D8\u05D9\u05DD", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" },
        array: { unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" },
        set: { unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" },
        number: { unit: "", shortLabel: "\u05E7\u05D8\u05DF", longLabel: "\u05D2\u05D3\u05D5\u05DC" }
        // no unit
      };
      const typeEntry = (t) => t ? TypeNames[t] : void 0;
      const typeLabel = (t) => {
        const e = typeEntry(t);
        if (e)
          return e.label;
        return t ?? TypeNames.unknown.label;
      };
      const withDefinite = (t) => `\u05D4${typeLabel(t)}`;
      const verbFor = (t) => {
        const e = typeEntry(t);
        const gender = e?.gender ?? "m";
        return gender === "f" ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA" : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA";
      };
      const getSizing = (origin) => {
        if (!origin)
          return null;
        return Sizable[origin] ?? null;
      };
      const FormatDictionary = {
        regex: { label: "\u05E7\u05DC\u05D8", gender: "m" },
        email: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC", gender: "f" },
        url: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05E8\u05E9\u05EA", gender: "f" },
        emoji: { label: "\u05D0\u05D9\u05DE\u05D5\u05D2'\u05D9", gender: "m" },
        uuid: { label: "UUID", gender: "m" },
        nanoid: { label: "nanoid", gender: "m" },
        guid: { label: "GUID", gender: "m" },
        cuid: { label: "cuid", gender: "m" },
        cuid2: { label: "cuid2", gender: "m" },
        ulid: { label: "ULID", gender: "m" },
        xid: { label: "XID", gender: "m" },
        ksuid: { label: "KSUID", gender: "m" },
        datetime: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA \u05D5\u05D6\u05DE\u05DF ISO", gender: "m" },
        date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA ISO", gender: "m" },
        time: { label: "\u05D6\u05DE\u05DF ISO", gender: "m" },
        duration: { label: "\u05DE\u05E9\u05DA \u05D6\u05DE\u05DF ISO", gender: "m" },
        ipv4: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv4", gender: "f" },
        ipv6: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv6", gender: "f" },
        cidrv4: { label: "\u05D8\u05D5\u05D5\u05D7 IPv4", gender: "m" },
        cidrv6: { label: "\u05D8\u05D5\u05D5\u05D7 IPv6", gender: "m" },
        base64: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64", gender: "f" },
        base64url: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64 \u05DC\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05E8\u05E9\u05EA", gender: "f" },
        json_string: { label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA JSON", gender: "f" },
        e164: { label: "\u05DE\u05E1\u05E4\u05E8 E.164", gender: "m" },
        jwt: { label: "JWT", gender: "m" },
        ends_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
        includes: { label: "\u05E7\u05DC\u05D8", gender: "m" },
        lowercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
        starts_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
        uppercase: { label: "\u05E7\u05DC\u05D8", gender: "m" }
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expectedKey = issue.expected;
            const expected = TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? TypeNames[receivedType]?.label ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof ${issue.expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${received}`;
            }
            return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${received}`;
          }
          case "invalid_value": {
            if (issue.values.length === 1) {
              return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ${util.stringifyPrimitive(issue.values[0])}`;
            }
            const stringified = issue.values.map((v) => util.stringifyPrimitive(v));
            if (issue.values.length === 2) {
              return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${stringified[0]} \u05D0\u05D5 ${stringified[1]}`;
            }
            const lastValue = stringified[stringified.length - 1];
            const restValues = stringified.slice(0, -1).join(", ");
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${restValues} \u05D0\u05D5 ${lastValue}`;
          }
          case "too_big": {
            const sizing = getSizing(issue.origin);
            const subject = withDefinite(issue.origin ?? "value");
            if (issue.origin === "string") {
              return `${sizing?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA"} \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${issue.maximum.toString()} ${sizing?.unit ?? ""} ${issue.inclusive ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA" : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8"}`.trim();
            }
            if (issue.origin === "number") {
              const comparison = issue.inclusive ? `\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${issue.maximum}` : `\u05E7\u05D8\u05DF \u05DE-${issue.maximum}`;
              return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${comparison}`;
            }
            if (issue.origin === "array" || issue.origin === "set") {
              const verb = issue.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA";
              const comparison = issue.inclusive ? `${issue.maximum} ${sizing?.unit ?? ""} \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA` : `\u05E4\u05D7\u05D5\u05EA \u05DE-${issue.maximum} ${sizing?.unit ?? ""}`;
              return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${comparison}`.trim();
            }
            const adj = issue.inclusive ? "<=" : "<";
            const be = verbFor(issue.origin ?? "value");
            if (sizing?.unit) {
              return `${sizing.longLabel} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
            }
            return `${sizing?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC"} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const sizing = getSizing(issue.origin);
            const subject = withDefinite(issue.origin ?? "value");
            if (issue.origin === "string") {
              return `${sizing?.shortLabel ?? "\u05E7\u05E6\u05E8"} \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${issue.minimum.toString()} ${sizing?.unit ?? ""} ${issue.inclusive ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8" : "\u05DC\u05E4\u05D7\u05D5\u05EA"}`.trim();
            }
            if (issue.origin === "number") {
              const comparison = issue.inclusive ? `\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${issue.minimum}` : `\u05D2\u05D3\u05D5\u05DC \u05DE-${issue.minimum}`;
              return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${comparison}`;
            }
            if (issue.origin === "array" || issue.origin === "set") {
              const verb = issue.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA";
              if (issue.minimum === 1 && issue.inclusive) {
                const singularPhrase = issue.origin === "set" ? "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3" : "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3";
                return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${singularPhrase}`;
              }
              const comparison = issue.inclusive ? `${issue.minimum} ${sizing?.unit ?? ""} \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8` : `\u05D9\u05D5\u05EA\u05E8 \u05DE-${issue.minimum} ${sizing?.unit ?? ""}`;
              return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${comparison}`.trim();
            }
            const adj = issue.inclusive ? ">=" : ">";
            const be = verbFor(issue.origin ?? "value");
            if (sizing?.unit) {
              return `${sizing.shortLabel} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `${sizing?.shortLabel ?? "\u05E7\u05D8\u05DF"} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1 "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05E1\u05EA\u05D9\u05D9\u05DD \u05D1 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05DB\u05DC\u05D5\u05DC "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05DC\u05EA\u05D1\u05E0\u05D9\u05EA ${_issue.pattern}`;
            const nounEntry = FormatDictionary[_issue.format];
            const noun = nounEntry?.label ?? _issue.format;
            const gender = nounEntry?.gender ?? "m";
            const adjective = gender === "f" ? "\u05EA\u05E7\u05D9\u05E0\u05D4" : "\u05EA\u05E7\u05D9\u05DF";
            return `${noun} \u05DC\u05D0 ${adjective}`;
          }
          case "not_multiple_of":
            return `\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u05DE\u05E4\u05EA\u05D7${issue.keys.length > 1 ? "\u05D5\u05EA" : ""} \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4${issue.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key": {
            return `\u05E9\u05D3\u05D4 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8`;
          }
          case "invalid_union":
            return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
          case "invalid_element": {
            const place = withDefinite(issue.origin ?? "array");
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1${place}`;
          }
          default:
            return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/hr.cjs
var require_hr = __commonJS({
  "node_modules/zod/v4/locales/hr.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "znakova", verb: "imati" },
        file: { unit: "bajtova", verb: "imati" },
        array: { unit: "stavki", verb: "imati" },
        set: { unit: "stavki", verb: "imati" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "unos",
        email: "email adresa",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum i vrijeme",
        date: "ISO datum",
        time: "ISO vrijeme",
        duration: "ISO trajanje",
        ipv4: "IPv4 adresa",
        ipv6: "IPv6 adresa",
        cidrv4: "IPv4 raspon",
        cidrv6: "IPv6 raspon",
        base64: "base64 kodirani tekst",
        base64url: "base64url kodirani tekst",
        json_string: "JSON tekst",
        e164: "E.164 broj",
        jwt: "JWT",
        template_literal: "unos"
      };
      const TypeDictionary = {
        nan: "NaN",
        string: "tekst",
        number: "broj",
        boolean: "boolean",
        array: "niz",
        object: "objekt",
        set: "skup",
        file: "datoteka",
        date: "datum",
        bigint: "bigint",
        symbol: "simbol",
        undefined: "undefined",
        null: "null",
        function: "funkcija",
        map: "mapa"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Neispravan unos: o\u010Dekuje se instanceof ${issue.expected}, a primljeno je ${received}`;
            }
            return `Neispravan unos: o\u010Dekuje se ${expected}, a primljeno je ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Neispravna vrijednost: o\u010Dekivano ${util.stringifyPrimitive(issue.values[0])}`;
            return `Neispravna opcija: o\u010Dekivano jedno od ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            if (sizing)
              return `Preveliko: o\u010Dekivano da ${origin ?? "vrijednost"} ima ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemenata"}`;
            return `Preveliko: o\u010Dekivano da ${origin ?? "vrijednost"} bude ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            if (sizing) {
              return `Premalo: o\u010Dekivano da ${origin} ima ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Premalo: o\u010Dekivano da ${origin} bude ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Neispravan tekst: mora zapo\u010Dinjati s "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Neispravan tekst: mora zavr\u0161avati s "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Neispravan tekst: mora sadr\u017Eavati "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Neispravan tekst: mora odgovarati uzorku ${_issue.pattern}`;
            return `Neispravna ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Neispravan broj: mora biti vi\u0161ekratnik od ${issue.divisor}`;
          case "unrecognized_keys":
            return `Neprepoznat${issue.keys.length > 1 ? "i klju\u010Devi" : " klju\u010D"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Neispravan klju\u010D u ${TypeDictionary[issue.origin] ?? issue.origin}`;
          case "invalid_union":
            return "Neispravan unos";
          case "invalid_element":
            return `Neispravna vrijednost u ${TypeDictionary[issue.origin] ?? issue.origin}`;
          default:
            return `Neispravan unos`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/hu.cjs
var require_hu = __commonJS({
  "node_modules/zod/v4/locales/hu.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "karakter", verb: "legyen" },
        file: { unit: "byte", verb: "legyen" },
        array: { unit: "elem", verb: "legyen" },
        set: { unit: "elem", verb: "legyen" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "bemenet",
        email: "email c\xEDm",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO id\u0151b\xE9lyeg",
        date: "ISO d\xE1tum",
        time: "ISO id\u0151",
        duration: "ISO id\u0151intervallum",
        ipv4: "IPv4 c\xEDm",
        ipv6: "IPv6 c\xEDm",
        cidrv4: "IPv4 tartom\xE1ny",
        cidrv6: "IPv6 tartom\xE1ny",
        base64: "base64-k\xF3dolt string",
        base64url: "base64url-k\xF3dolt string",
        json_string: "JSON string",
        e164: "E.164 sz\xE1m",
        jwt: "JWT",
        template_literal: "bemenet"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "sz\xE1m",
        array: "t\xF6mb"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k instanceof ${issue.expected}, a kapott \xE9rt\xE9k ${received}`;
            }
            return `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${expected}, a kapott \xE9rt\xE9k ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ${util.stringifyPrimitive(issue.values[0])}`;
            return `\xC9rv\xE9nytelen opci\xF3: valamelyik \xE9rt\xE9k v\xE1rt ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `T\xFAl nagy: ${issue.origin ?? "\xE9rt\xE9k"} m\xE9rete t\xFAl nagy ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elem"}`;
            return `T\xFAl nagy: a bemeneti \xE9rt\xE9k ${issue.origin ?? "\xE9rt\xE9k"} t\xFAl nagy: ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${issue.origin} m\xE9rete t\xFAl kicsi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `T\xFAl kicsi: a bemeneti \xE9rt\xE9k ${issue.origin} t\xFAl kicsi ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\xC9rv\xE9nytelen string: "${_issue.prefix}" \xE9rt\xE9kkel kell kezd\u0151dnie`;
            if (_issue.format === "ends_with")
              return `\xC9rv\xE9nytelen string: "${_issue.suffix}" \xE9rt\xE9kkel kell v\xE9gz\u0151dnie`;
            if (_issue.format === "includes")
              return `\xC9rv\xE9nytelen string: "${_issue.includes}" \xE9rt\xE9ket kell tartalmaznia`;
            if (_issue.format === "regex")
              return `\xC9rv\xE9nytelen string: ${_issue.pattern} mint\xE1nak kell megfelelnie`;
            return `\xC9rv\xE9nytelen ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\xC9rv\xE9nytelen sz\xE1m: ${issue.divisor} t\xF6bbsz\xF6r\xF6s\xE9nek kell lennie`;
          case "unrecognized_keys":
            return `Ismeretlen kulcs${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\xC9rv\xE9nytelen kulcs ${issue.origin}`;
          case "invalid_union":
            return "\xC9rv\xE9nytelen bemenet";
          case "invalid_element":
            return `\xC9rv\xE9nytelen \xE9rt\xE9k: ${issue.origin}`;
          default:
            return `\xC9rv\xE9nytelen bemenet`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/hy.cjs
var require_hy = __commonJS({
  "node_modules/zod/v4/locales/hy.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    function getArmenianPlural(count, one, many) {
      return Math.abs(count) === 1 ? one : many;
    }
    function withDefiniteArticle(word) {
      if (!word)
        return "";
      const vowels = ["\u0561", "\u0565", "\u0568", "\u056B", "\u0578", "\u0578\u0582", "\u0585"];
      const lastChar = word[word.length - 1];
      return word + (vowels.includes(lastChar) ? "\u0576" : "\u0568");
    }
    var error = () => {
      const Sizable = {
        string: {
          unit: {
            one: "\u0576\u0577\u0561\u0576",
            many: "\u0576\u0577\u0561\u0576\u0576\u0565\u0580"
          },
          verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
        },
        file: {
          unit: {
            one: "\u0562\u0561\u0575\u0569",
            many: "\u0562\u0561\u0575\u0569\u0565\u0580"
          },
          verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
        },
        array: {
          unit: {
            one: "\u057F\u0561\u0580\u0580",
            many: "\u057F\u0561\u0580\u0580\u0565\u0580"
          },
          verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
        },
        set: {
          unit: {
            one: "\u057F\u0561\u0580\u0580",
            many: "\u057F\u0561\u0580\u0580\u0565\u0580"
          },
          verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C"
        }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0574\u0578\u0582\u057F\u0584",
        email: "\u0567\u056C. \u0570\u0561\u057D\u0581\u0565",
        url: "URL",
        emoji: "\u0567\u0574\u0578\u057B\u056B",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E \u0587 \u056A\u0561\u0574",
        date: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E",
        time: "ISO \u056A\u0561\u0574",
        duration: "ISO \u057F\u0587\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
        ipv4: "IPv4 \u0570\u0561\u057D\u0581\u0565",
        ipv6: "IPv6 \u0570\u0561\u057D\u0581\u0565",
        cidrv4: "IPv4 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
        cidrv6: "IPv6 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
        base64: "base64 \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
        base64url: "base64url \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
        json_string: "JSON \u057F\u0578\u0572",
        e164: "E.164 \u0570\u0561\u0574\u0561\u0580",
        jwt: "JWT",
        template_literal: "\u0574\u0578\u0582\u057F\u0584"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0569\u056B\u057E",
        array: "\u0566\u0561\u0576\u0563\u057E\u0561\u056E"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 instanceof ${issue.expected}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${received}`;
            }
            return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${expected}, \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ${util.stringifyPrimitive(issue.values[1])}`;
            return `\u054D\u056D\u0561\u056C \u057F\u0561\u0580\u0562\u0565\u0580\u0561\u056F\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 \u0570\u0565\u057F\u0587\u0575\u0561\u056C\u0576\u0565\u0580\u056B\u0581 \u0574\u0565\u056F\u0568\u055D ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              const maxValue = Number(issue.maximum);
              const unit = getArmenianPlural(maxValue, sizing.unit.one, sizing.unit.many);
              return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${adj}${issue.maximum.toString()} ${unit}`;
            }
            return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue.origin ?? "\u0561\u0580\u056A\u0565\u0584")} \u056C\u056B\u0576\u056B ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              const minValue = Number(issue.minimum);
              const unit = getArmenianPlural(minValue, sizing.unit.one, sizing.unit.many);
              return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue.origin)} \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ${adj}${issue.minimum.toString()} ${unit}`;
            }
            return `\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 ${withDefiniteArticle(issue.origin)} \u056C\u056B\u0576\u056B ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057D\u056F\u057D\u057E\u056B "${_issue.prefix}"-\u0578\u057E`;
            if (_issue.format === "ends_with")
              return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0561\u057E\u0561\u0580\u057F\u057E\u056B "${_issue.suffix}"-\u0578\u057E`;
            if (_issue.format === "includes")
              return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057A\u0561\u0580\u0578\u0582\u0576\u0561\u056F\u056B "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0570\u0561\u0574\u0561\u057A\u0561\u057F\u0561\u057D\u056D\u0561\u0576\u056B ${_issue.pattern} \u0571\u0587\u0561\u0579\u0561\u0583\u056B\u0576`;
            return `\u054D\u056D\u0561\u056C ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u054D\u056D\u0561\u056C \u0569\u056B\u057E\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0562\u0561\u0566\u0574\u0561\u057A\u0561\u057F\u056B\u056F \u056C\u056B\u0576\u056B ${issue.divisor}-\u056B`;
          case "unrecognized_keys":
            return `\u0549\u0573\u0561\u0576\u0561\u0579\u057E\u0561\u056E \u0562\u0561\u0576\u0561\u056C\u056B${issue.keys.length > 1 ? "\u0576\u0565\u0580" : ""}. ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u054D\u056D\u0561\u056C \u0562\u0561\u0576\u0561\u056C\u056B ${withDefiniteArticle(issue.origin)}-\u0578\u0582\u0574`;
          case "invalid_union":
            return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
          case "invalid_element":
            return `\u054D\u056D\u0561\u056C \u0561\u0580\u056A\u0565\u0584 ${withDefiniteArticle(issue.origin)}-\u0578\u0582\u0574`;
          default:
            return `\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/id.cjs
var require_id = __commonJS({
  "node_modules/zod/v4/locales/id.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "karakter", verb: "memiliki" },
        file: { unit: "byte", verb: "memiliki" },
        array: { unit: "item", verb: "memiliki" },
        set: { unit: "item", verb: "memiliki" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "alamat email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tanggal dan waktu format ISO",
        date: "tanggal format ISO",
        time: "jam format ISO",
        duration: "durasi format ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "rentang alamat IPv4",
        cidrv6: "rentang alamat IPv6",
        base64: "string dengan enkode base64",
        base64url: "string dengan enkode base64url",
        json_string: "string JSON",
        e164: "angka E.164",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Input tidak valid: diharapkan instanceof ${issue.expected}, diterima ${received}`;
            }
            return `Input tidak valid: diharapkan ${expected}, diterima ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Input tidak valid: diharapkan ${util.stringifyPrimitive(issue.values[0])}`;
            return `Pilihan tidak valid: diharapkan salah satu dari ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Terlalu besar: diharapkan ${issue.origin ?? "value"} memiliki ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
            return `Terlalu besar: diharapkan ${issue.origin ?? "value"} menjadi ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Terlalu kecil: diharapkan ${issue.origin} memiliki ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Terlalu kecil: diharapkan ${issue.origin} menjadi ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `String tidak valid: harus menyertakan "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
            return `${FormatDictionary[_issue.format] ?? issue.format} tidak valid`;
          }
          case "not_multiple_of":
            return `Angka tidak valid: harus kelipatan dari ${issue.divisor}`;
          case "unrecognized_keys":
            return `Kunci tidak dikenali ${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Kunci tidak valid di ${issue.origin}`;
          case "invalid_union":
            return "Input tidak valid";
          case "invalid_element":
            return `Nilai tidak valid di ${issue.origin}`;
          default:
            return `Input tidak valid`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/is.cjs
var require_is = __commonJS({
  "node_modules/zod/v4/locales/is.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "stafi", verb: "a\xF0 hafa" },
        file: { unit: "b\xE6ti", verb: "a\xF0 hafa" },
        array: { unit: "hluti", verb: "a\xF0 hafa" },
        set: { unit: "hluti", verb: "a\xF0 hafa" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "gildi",
        email: "netfang",
        url: "vefsl\xF3\xF0",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dagsetning og t\xEDmi",
        date: "ISO dagsetning",
        time: "ISO t\xEDmi",
        duration: "ISO t\xEDmalengd",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded strengur",
        base64url: "base64url-encoded strengur",
        json_string: "JSON strengur",
        e164: "E.164 t\xF6lugildi",
        jwt: "JWT",
        template_literal: "gildi"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "n\xFAmer",
        array: "fylki"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Rangt gildi: \xDE\xFA sl\xF3st inn ${received} \xFEar sem \xE1 a\xF0 vera instanceof ${issue.expected}`;
            }
            return `Rangt gildi: \xDE\xFA sl\xF3st inn ${received} \xFEar sem \xE1 a\xF0 vera ${expected}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Rangt gildi: gert r\xE1\xF0 fyrir ${util.stringifyPrimitive(issue.values[0])}`;
            return `\xD3gilt val: m\xE1 vera eitt af eftirfarandi ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${issue.origin ?? "gildi"} hafi ${adj}${issue.maximum.toString()} ${sizing.unit ?? "hluti"}`;
            return `Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ${issue.origin ?? "gildi"} s\xE9 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${issue.origin} hafi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ${issue.origin} s\xE9 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\xD3gildur strengur: ver\xF0ur a\xF0 byrja \xE1 "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `\xD3gildur strengur: ver\xF0ur a\xF0 enda \xE1 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\xD3gildur strengur: ver\xF0ur a\xF0 innihalda "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\xD3gildur strengur: ver\xF0ur a\xF0 fylgja mynstri ${_issue.pattern}`;
            return `Rangt ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `R\xF6ng tala: ver\xF0ur a\xF0 vera margfeldi af ${issue.divisor}`;
          case "unrecognized_keys":
            return `\xD3\xFEekkt ${issue.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Rangur lykill \xED ${issue.origin}`;
          case "invalid_union":
            return "Rangt gildi";
          case "invalid_element":
            return `Rangt gildi \xED ${issue.origin}`;
          default:
            return `Rangt gildi`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/it.cjs
var require_it = __commonJS({
  "node_modules/zod/v4/locales/it.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "caratteri", verb: "avere" },
        file: { unit: "byte", verb: "avere" },
        array: { unit: "elementi", verb: "avere" },
        set: { unit: "elementi", verb: "avere" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "indirizzo email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e ora ISO",
        date: "data ISO",
        time: "ora ISO",
        duration: "durata ISO",
        ipv4: "indirizzo IPv4",
        ipv6: "indirizzo IPv6",
        cidrv4: "intervallo IPv4",
        cidrv6: "intervallo IPv6",
        base64: "stringa codificata in base64",
        base64url: "URL codificata in base64",
        json_string: "stringa JSON",
        e164: "numero E.164",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "numero",
        array: "vettore"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Input non valido: atteso instanceof ${issue.expected}, ricevuto ${received}`;
            }
            return `Input non valido: atteso ${expected}, ricevuto ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Input non valido: atteso ${util.stringifyPrimitive(issue.values[0])}`;
            return `Opzione non valida: atteso uno tra ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Troppo grande: ${issue.origin ?? "valore"} deve avere ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementi"}`;
            return `Troppo grande: ${issue.origin ?? "valore"} deve essere ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Troppo piccolo: ${issue.origin} deve avere ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Troppo piccolo: ${issue.origin} deve essere ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Stringa non valida: deve includere "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
            return `Input non valido: ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Numero non valido: deve essere un multiplo di ${issue.divisor}`;
          case "unrecognized_keys":
            return `Chiav${issue.keys.length > 1 ? "i" : "e"} non riconosciut${issue.keys.length > 1 ? "e" : "a"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Chiave non valida in ${issue.origin}`;
          case "invalid_union":
            return "Input non valido";
          case "invalid_element":
            return `Valore non valido in ${issue.origin}`;
          default:
            return `Input non valido`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ja.cjs
var require_ja = __commonJS({
  "node_modules/zod/v4/locales/ja.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u6587\u5B57", verb: "\u3067\u3042\u308B" },
        file: { unit: "\u30D0\u30A4\u30C8", verb: "\u3067\u3042\u308B" },
        array: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
        set: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u5165\u529B\u5024",
        email: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
        url: "URL",
        emoji: "\u7D75\u6587\u5B57",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO\u65E5\u6642",
        date: "ISO\u65E5\u4ED8",
        time: "ISO\u6642\u523B",
        duration: "ISO\u671F\u9593",
        ipv4: "IPv4\u30A2\u30C9\u30EC\u30B9",
        ipv6: "IPv6\u30A2\u30C9\u30EC\u30B9",
        cidrv4: "IPv4\u7BC4\u56F2",
        cidrv6: "IPv6\u7BC4\u56F2",
        base64: "base64\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
        base64url: "base64url\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
        json_string: "JSON\u6587\u5B57\u5217",
        e164: "E.164\u756A\u53F7",
        jwt: "JWT",
        template_literal: "\u5165\u529B\u5024"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u6570\u5024",
        array: "\u914D\u5217"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u7121\u52B9\u306A\u5165\u529B: instanceof ${issue.expected}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${received}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`;
            }
            return `\u7121\u52B9\u306A\u5165\u529B: ${expected}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001${received}\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u7121\u52B9\u306A\u5165\u529B: ${util.stringifyPrimitive(issue.values[0])}\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F`;
            return `\u7121\u52B9\u306A\u9078\u629E: ${util.joinValues(issue.values, "\u3001")}\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          case "too_big": {
            const adj = issue.inclusive ? "\u4EE5\u4E0B\u3067\u3042\u308B" : "\u3088\u308A\u5C0F\u3055\u3044";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u5927\u304D\u3059\u304E\u308B\u5024: ${issue.origin ?? "\u5024"}\u306F${issue.maximum.toString()}${sizing.unit ?? "\u8981\u7D20"}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
            return `\u5927\u304D\u3059\u304E\u308B\u5024: ${issue.origin ?? "\u5024"}\u306F${issue.maximum.toString()}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          }
          case "too_small": {
            const adj = issue.inclusive ? "\u4EE5\u4E0A\u3067\u3042\u308B" : "\u3088\u308A\u5927\u304D\u3044";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${issue.origin}\u306F${issue.minimum.toString()}${sizing.unit}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
            return `\u5C0F\u3055\u3059\u304E\u308B\u5024: ${issue.origin}\u306F${issue.minimum.toString()}${adj}\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${_issue.prefix}"\u3067\u59CB\u307E\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
            if (_issue.format === "ends_with")
              return `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${_issue.suffix}"\u3067\u7D42\u308F\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
            if (_issue.format === "includes")
              return `\u7121\u52B9\u306A\u6587\u5B57\u5217: "${_issue.includes}"\u3092\u542B\u3080\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
            if (_issue.format === "regex")
              return `\u7121\u52B9\u306A\u6587\u5B57\u5217: \u30D1\u30BF\u30FC\u30F3${_issue.pattern}\u306B\u4E00\u81F4\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
            return `\u7121\u52B9\u306A${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u7121\u52B9\u306A\u6570\u5024: ${issue.divisor}\u306E\u500D\u6570\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`;
          case "unrecognized_keys":
            return `\u8A8D\u8B58\u3055\u308C\u3066\u3044\u306A\u3044\u30AD\u30FC${issue.keys.length > 1 ? "\u7FA4" : ""}: ${util.joinValues(issue.keys, "\u3001")}`;
          case "invalid_key":
            return `${issue.origin}\u5185\u306E\u7121\u52B9\u306A\u30AD\u30FC`;
          case "invalid_union":
            return "\u7121\u52B9\u306A\u5165\u529B";
          case "invalid_element":
            return `${issue.origin}\u5185\u306E\u7121\u52B9\u306A\u5024`;
          default:
            return `\u7121\u52B9\u306A\u5165\u529B`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ka.cjs
var require_ka = __commonJS({
  "node_modules/zod/v4/locales/ka.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u10E1\u10D8\u10DB\u10D1\u10DD\u10DA\u10DD", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
        file: { unit: "\u10D1\u10D0\u10D8\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
        array: { unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" },
        set: { unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8", verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
        email: "\u10D4\u10DA-\u10E4\u10DD\u10E1\u10E2\u10D8\u10E1 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
        url: "URL",
        emoji: "\u10D4\u10DB\u10DD\u10EF\u10D8",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8-\u10D3\u10E0\u10DD",
        date: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8",
        time: "\u10D3\u10E0\u10DD",
        duration: "\u10EE\u10D0\u10DC\u10D2\u10E0\u10EB\u10DA\u10D8\u10D5\u10DD\u10D1\u10D0",
        ipv4: "IPv4 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
        ipv6: "IPv6 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
        cidrv4: "IPv4 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
        cidrv6: "IPv6 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
        base64: "base64-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
        base64url: "base64url-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
        json_string: "JSON \u10D5\u10D4\u10DA\u10D8",
        e164: "E.164 \u10DC\u10DD\u10DB\u10D4\u10E0\u10D8",
        jwt: "JWT",
        template_literal: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u10E0\u10D8\u10EA\u10EE\u10D5\u10D8",
        string: "\u10D5\u10D4\u10DA\u10D8",
        boolean: "\u10D1\u10E3\u10DA\u10D4\u10D0\u10DC\u10D8",
        function: "\u10E4\u10E3\u10DC\u10E5\u10EA\u10D8\u10D0",
        array: "\u10DB\u10D0\u10E1\u10D8\u10D5\u10D8"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 instanceof ${issue.expected}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${received}`;
            }
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${expected}, \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D0\u10E0\u10D8\u10D0\u10DC\u10E2\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8\u10D0 \u10D4\u10E0\u10D7-\u10D4\u10E0\u10D7\u10D8 ${util.joinValues(issue.values, "|")}-\u10D3\u10D0\u10DC`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
            return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue.origin ?? "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0"} \u10D8\u10E7\u10DD\u10E1 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ${issue.origin} \u10D8\u10E7\u10DD\u10E1 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10EC\u10E7\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${_issue.prefix}"-\u10D8\u10D7`;
            }
            if (_issue.format === "ends_with")
              return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10DB\u10D7\u10D0\u10D5\u10E0\u10D3\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "${_issue.suffix}"-\u10D8\u10D7`;
            if (_issue.format === "includes")
              return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1 "${_issue.includes}"-\u10E1`;
            if (_issue.format === "regex")
              return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D4\u10E1\u10D0\u10D1\u10D0\u10DB\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 \u10E8\u10D0\u10D1\u10DA\u10DD\u10DC\u10E1 ${_issue.pattern}`;
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E0\u10D8\u10EA\u10EE\u10D5\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10E7\u10DD\u10E1 ${issue.divisor}-\u10D8\u10E1 \u10EF\u10D4\u10E0\u10D0\u10D3\u10D8`;
          case "unrecognized_keys":
            return `\u10E3\u10EA\u10DC\u10DD\u10D1\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1${issue.keys.length > 1 ? "\u10D4\u10D1\u10D8" : "\u10D8"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1\u10D8 ${issue.origin}-\u10E8\u10D8`;
          case "invalid_union":
            return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
          case "invalid_element":
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0 ${issue.origin}-\u10E8\u10D8`;
          default:
            return `\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/km.cjs
var require_km = __commonJS({
  "node_modules/zod/v4/locales/km.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u178F\u17BD\u17A2\u1780\u17D2\u179F\u179A", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
        file: { unit: "\u1794\u17C3", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
        array: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" },
        set: { unit: "\u1792\u17B6\u178F\u17BB", verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
        email: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793\u17A2\u17CA\u17B8\u1798\u17C2\u179B",
        url: "URL",
        emoji: "\u179F\u1789\u17D2\u1789\u17B6\u17A2\u17B6\u179A\u1798\u17D2\u1798\u178E\u17CD",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 \u1793\u17B7\u1784\u1798\u17C9\u17C4\u1784 ISO",
        date: "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 ISO",
        time: "\u1798\u17C9\u17C4\u1784 ISO",
        duration: "\u179A\u1799\u17C8\u1796\u17C1\u179B ISO",
        ipv4: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
        ipv6: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
        cidrv4: "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
        cidrv6: "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
        base64: "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64",
        base64url: "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64url",
        json_string: "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A JSON",
        e164: "\u179B\u17C1\u1781 E.164",
        jwt: "JWT",
        template_literal: "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u179B\u17C1\u1781",
        array: "\u17A2\u17B6\u179A\u17C1 (Array)",
        null: "\u1782\u17D2\u1798\u17B6\u1793\u178F\u1798\u17D2\u179B\u17C3 (null)"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A instanceof ${issue.expected} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${received}`;
            }
            return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${expected} \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u1787\u1798\u17D2\u179A\u17BE\u179F\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1787\u17B6\u1798\u17BD\u1799\u1780\u17D2\u1793\u17BB\u1784\u1785\u17C6\u178E\u17C4\u1798 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "\u1792\u17B6\u178F\u17BB"}`;
            return `\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue.origin ?? "\u178F\u1798\u17D2\u179B\u17C3"} ${adj} ${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue.origin} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ${issue.origin} ${adj} ${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798\u178A\u17C4\u1799 "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1794\u1789\u17D2\u1785\u1794\u17CB\u178A\u17C4\u1799 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1798\u17B6\u1793 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1793\u17B9\u1784\u1791\u1798\u17D2\u179A\u1784\u17CB\u178A\u17C2\u179B\u1794\u17B6\u1793\u1780\u17C6\u178E\u178F\u17CB ${_issue.pattern}`;
            return `\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u179B\u17C1\u1781\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1787\u17B6\u1796\u17A0\u17BB\u1782\u17BB\u178E\u1793\u17C3 ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u179A\u1780\u1783\u17BE\u1789\u179F\u17C4\u1798\u17B7\u1793\u179F\u17D2\u1782\u17B6\u179B\u17CB\u17D6 ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u179F\u17C4\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${issue.origin}`;
          case "invalid_union":
            return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C`;
          case "invalid_element":
            return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ${issue.origin}`;
          default:
            return `\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/kh.cjs
var require_kh = __commonJS({
  "node_modules/zod/v4/locales/kh.cjs"(exports, module) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var km_js_1 = __importDefault(require_km());
    function default_1() {
      return (0, km_js_1.default)();
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ko.cjs
var require_ko = __commonJS({
  "node_modules/zod/v4/locales/ko.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\uBB38\uC790", verb: "to have" },
        file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
        array: { unit: "\uAC1C", verb: "to have" },
        set: { unit: "\uAC1C", verb: "to have" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\uC785\uB825",
        email: "\uC774\uBA54\uC77C \uC8FC\uC18C",
        url: "URL",
        emoji: "\uC774\uBAA8\uC9C0",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \uB0A0\uC9DC\uC2DC\uAC04",
        date: "ISO \uB0A0\uC9DC",
        time: "ISO \uC2DC\uAC04",
        duration: "ISO \uAE30\uAC04",
        ipv4: "IPv4 \uC8FC\uC18C",
        ipv6: "IPv6 \uC8FC\uC18C",
        cidrv4: "IPv4 \uBC94\uC704",
        cidrv6: "IPv6 \uBC94\uC704",
        base64: "base64 \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
        base64url: "base64url \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
        json_string: "JSON \uBB38\uC790\uC5F4",
        e164: "E.164 \uBC88\uD638",
        jwt: "JWT",
        template_literal: "\uC785\uB825"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof ${issue.expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${received}\uC785\uB2C8\uB2E4`;
            }
            return `\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 ${expected}, \uBC1B\uC740 \uD0C0\uC785\uC740 ${received}\uC785\uB2C8\uB2E4`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ${util.stringifyPrimitive(issue.values[0])} \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4`;
            return `\uC798\uBABB\uB41C \uC635\uC158: ${util.joinValues(issue.values, "\uB610\uB294 ")} \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
          case "too_big": {
            const adj = issue.inclusive ? "\uC774\uD558" : "\uBBF8\uB9CC";
            const suffix = adj === "\uBBF8\uB9CC" ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4" : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            const sizing = getSizing(issue.origin);
            const unit = sizing?.unit ?? "\uC694\uC18C";
            if (sizing)
              return `${issue.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${issue.maximum.toString()}${unit} ${adj}${suffix}`;
            return `${issue.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ${issue.maximum.toString()} ${adj}${suffix}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? "\uC774\uC0C1" : "\uCD08\uACFC";
            const suffix = adj === "\uC774\uC0C1" ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4" : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            const sizing = getSizing(issue.origin);
            const unit = sizing?.unit ?? "\uC694\uC18C";
            if (sizing) {
              return `${issue.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${issue.minimum.toString()}${unit} ${adj}${suffix}`;
            }
            return `${issue.origin ?? "\uAC12"}\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ${issue.minimum.toString()} ${adj}${suffix}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${_issue.prefix}"(\uC73C)\uB85C \uC2DC\uC791\uD574\uC57C \uD569\uB2C8\uB2E4`;
            }
            if (_issue.format === "ends_with")
              return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${_issue.suffix}"(\uC73C)\uB85C \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4`;
            if (_issue.format === "includes")
              return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "${_issue.includes}"\uC744(\uB97C) \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4`;
            if (_issue.format === "regex")
              return `\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: \uC815\uADDC\uC2DD ${_issue.pattern} \uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4`;
            return `\uC798\uBABB\uB41C ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\uC798\uBABB\uB41C \uC22B\uC790: ${issue.divisor}\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4`;
          case "unrecognized_keys":
            return `\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\uC798\uBABB\uB41C \uD0A4: ${issue.origin}`;
          case "invalid_union":
            return `\uC798\uBABB\uB41C \uC785\uB825`;
          case "invalid_element":
            return `\uC798\uBABB\uB41C \uAC12: ${issue.origin}`;
          default:
            return `\uC798\uBABB\uB41C \uC785\uB825`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/lt.cjs
var require_lt = __commonJS({
  "node_modules/zod/v4/locales/lt.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var capitalizeFirstCharacter = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };
    function getUnitTypeFromNumber(number) {
      const abs = Math.abs(number);
      const last = abs % 10;
      const last2 = abs % 100;
      if (last2 >= 11 && last2 <= 19 || last === 0)
        return "many";
      if (last === 1)
        return "one";
      return "few";
    }
    var error = () => {
      const Sizable = {
        string: {
          unit: {
            one: "simbolis",
            few: "simboliai",
            many: "simboli\u0173"
          },
          verb: {
            smaller: {
              inclusive: "turi b\u016Bti ne ilgesn\u0117 kaip",
              notInclusive: "turi b\u016Bti trumpesn\u0117 kaip"
            },
            bigger: {
              inclusive: "turi b\u016Bti ne trumpesn\u0117 kaip",
              notInclusive: "turi b\u016Bti ilgesn\u0117 kaip"
            }
          }
        },
        file: {
          unit: {
            one: "baitas",
            few: "baitai",
            many: "bait\u0173"
          },
          verb: {
            smaller: {
              inclusive: "turi b\u016Bti ne didesnis kaip",
              notInclusive: "turi b\u016Bti ma\u017Eesnis kaip"
            },
            bigger: {
              inclusive: "turi b\u016Bti ne ma\u017Eesnis kaip",
              notInclusive: "turi b\u016Bti didesnis kaip"
            }
          }
        },
        array: {
          unit: {
            one: "element\u0105",
            few: "elementus",
            many: "element\u0173"
          },
          verb: {
            smaller: {
              inclusive: "turi tur\u0117ti ne daugiau kaip",
              notInclusive: "turi tur\u0117ti ma\u017Eiau kaip"
            },
            bigger: {
              inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
              notInclusive: "turi tur\u0117ti daugiau kaip"
            }
          }
        },
        set: {
          unit: {
            one: "element\u0105",
            few: "elementus",
            many: "element\u0173"
          },
          verb: {
            smaller: {
              inclusive: "turi tur\u0117ti ne daugiau kaip",
              notInclusive: "turi tur\u0117ti ma\u017Eiau kaip"
            },
            bigger: {
              inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
              notInclusive: "turi tur\u0117ti daugiau kaip"
            }
          }
        }
      };
      function getSizing(origin, unitType, inclusive, targetShouldBe) {
        const result2 = Sizable[origin] ?? null;
        if (result2 === null)
          return result2;
        return {
          unit: result2.unit[unitType],
          verb: result2.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
        };
      }
      const FormatDictionary = {
        regex: "\u012Fvestis",
        email: "el. pa\u0161to adresas",
        url: "URL",
        emoji: "jaustukas",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO data ir laikas",
        date: "ISO data",
        time: "ISO laikas",
        duration: "ISO trukm\u0117",
        ipv4: "IPv4 adresas",
        ipv6: "IPv6 adresas",
        cidrv4: "IPv4 tinklo prefiksas (CIDR)",
        cidrv6: "IPv6 tinklo prefiksas (CIDR)",
        base64: "base64 u\u017Ekoduota eilut\u0117",
        base64url: "base64url u\u017Ekoduota eilut\u0117",
        json_string: "JSON eilut\u0117",
        e164: "E.164 numeris",
        jwt: "JWT",
        template_literal: "\u012Fvestis"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "skai\u010Dius",
        bigint: "sveikasis skai\u010Dius",
        string: "eilut\u0117",
        boolean: "login\u0117 reik\u0161m\u0117",
        undefined: "neapibr\u0117\u017Eta reik\u0161m\u0117",
        function: "funkcija",
        symbol: "simbolis",
        array: "masyvas",
        object: "objektas",
        null: "nulin\u0117 reik\u0161m\u0117"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Gautas tipas ${received}, o tik\u0117tasi - instanceof ${issue.expected}`;
            }
            return `Gautas tipas ${received}, o tik\u0117tasi - ${expected}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Privalo b\u016Bti ${util.stringifyPrimitive(issue.values[0])}`;
            return `Privalo b\u016Bti vienas i\u0161 ${util.joinValues(issue.values, "|")} pasirinkim\u0173`;
          case "too_big": {
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.maximum)), issue.inclusive ?? false, "smaller");
            if (sizing?.verb)
              return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117")} ${sizing.verb} ${issue.maximum.toString()} ${sizing.unit ?? "element\u0173"}`;
            const adj = issue.inclusive ? "ne didesnis kaip" : "ma\u017Eesnis kaip";
            return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${adj} ${issue.maximum.toString()} ${sizing?.unit}`;
          }
          case "too_small": {
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.minimum)), issue.inclusive ?? false, "bigger");
            if (sizing?.verb)
              return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117")} ${sizing.verb} ${issue.minimum.toString()} ${sizing.unit ?? "element\u0173"}`;
            const adj = issue.inclusive ? "ne ma\u017Eesnis kaip" : "didesnis kaip";
            return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117")} turi b\u016Bti ${adj} ${issue.minimum.toString()} ${sizing?.unit}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `Eilut\u0117 privalo prasid\u0117ti "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Eilut\u0117 privalo pasibaigti "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Eilut\u0117 privalo \u012Ftraukti "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Eilut\u0117 privalo atitikti ${_issue.pattern}`;
            return `Neteisingas ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Skai\u010Dius privalo b\u016Bti ${issue.divisor} kartotinis.`;
          case "unrecognized_keys":
            return `Neatpa\u017Eint${issue.keys.length > 1 ? "i" : "as"} rakt${issue.keys.length > 1 ? "ai" : "as"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return "Rastas klaidingas raktas";
          case "invalid_union":
            return "Klaidinga \u012Fvestis";
          case "invalid_element": {
            const origin = TypeDictionary[issue.origin] ?? issue.origin;
            return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117")} turi klaiding\u0105 \u012Fvest\u012F`;
          }
          default:
            return "Klaidinga \u012Fvestis";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/mk.cjs
var require_mk = __commonJS({
  "node_modules/zod/v4/locales/mk.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u0437\u043D\u0430\u0446\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
        file: { unit: "\u0431\u0430\u0458\u0442\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
        array: { unit: "\u0441\u0442\u0430\u0432\u043A\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" },
        set: { unit: "\u0441\u0442\u0430\u0432\u043A\u0438", verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0432\u043D\u0435\u0441",
        email: "\u0430\u0434\u0440\u0435\u0441\u0430 \u043D\u0430 \u0435-\u043F\u043E\u0448\u0442\u0430",
        url: "URL",
        emoji: "\u0435\u043C\u043E\u045F\u0438",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u0434\u0430\u0442\u0443\u043C \u0438 \u0432\u0440\u0435\u043C\u0435",
        date: "ISO \u0434\u0430\u0442\u0443\u043C",
        time: "ISO \u0432\u0440\u0435\u043C\u0435",
        duration: "ISO \u0432\u0440\u0435\u043C\u0435\u0442\u0440\u0430\u0435\u045A\u0435",
        ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441\u0430",
        ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441\u0430",
        cidrv4: "IPv4 \u043E\u043F\u0441\u0435\u0433",
        cidrv6: "IPv6 \u043E\u043F\u0441\u0435\u0433",
        base64: "base64-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
        base64url: "base64url-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
        json_string: "JSON \u043D\u0438\u0437\u0430",
        e164: "E.164 \u0431\u0440\u043E\u0458",
        jwt: "JWT",
        template_literal: "\u0432\u043D\u0435\u0441"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0431\u0440\u043E\u0458",
        array: "\u043D\u0438\u0437\u0430"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 instanceof ${issue.expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${received}`;
            }
            return `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${expected}, \u043F\u0440\u0438\u043C\u0435\u043D\u043E ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Invalid input: expected ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u0413\u0440\u0435\u0448\u0430\u043D\u0430 \u043E\u043F\u0446\u0438\u0458\u0430: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 \u0435\u0434\u043D\u0430 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0438\u043C\u0430 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0438"}`;
            return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue.origin ?? "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430"} \u0434\u0430 \u0431\u0438\u0434\u0435 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue.origin} \u0434\u0430 \u0438\u043C\u0430 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 ${issue.origin} \u0434\u0430 \u0431\u0438\u0434\u0435 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u043D\u0443\u0432\u0430 \u0441\u043E "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u0432\u0440\u0448\u0443\u0432\u0430 \u0441\u043E "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0432\u043A\u043B\u0443\u0447\u0443\u0432\u0430 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u043E\u0434\u0433\u043E\u0430\u0440\u0430 \u043D\u0430 \u043F\u0430\u0442\u0435\u0440\u043D\u043E\u0442 ${_issue.pattern}`;
            return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u0413\u0440\u0435\u0448\u0435\u043D \u0431\u0440\u043E\u0458: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0431\u0438\u0434\u0435 \u0434\u0435\u043B\u0438\u0432 \u0441\u043E ${issue.divisor}`;
          case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D\u0438 \u043A\u043B\u0443\u0447\u0435\u0432\u0438" : "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D \u043A\u043B\u0443\u0447"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u0413\u0440\u0435\u0448\u0435\u043D \u043A\u043B\u0443\u0447 \u0432\u043E ${issue.origin}`;
          case "invalid_union":
            return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
          case "invalid_element":
            return `\u0413\u0440\u0435\u0448\u043D\u0430 \u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442 \u0432\u043E ${issue.origin}`;
          default:
            return `\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ms.cjs
var require_ms = __commonJS({
  "node_modules/zod/v4/locales/ms.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "aksara", verb: "mempunyai" },
        file: { unit: "bait", verb: "mempunyai" },
        array: { unit: "elemen", verb: "mempunyai" },
        set: { unit: "elemen", verb: "mempunyai" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "alamat e-mel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tarikh masa ISO",
        date: "tarikh ISO",
        time: "masa ISO",
        duration: "tempoh ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "julat IPv4",
        cidrv6: "julat IPv6",
        base64: "string dikodkan base64",
        base64url: "string dikodkan base64url",
        json_string: "string JSON",
        e164: "nombor E.164",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "nombor"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Input tidak sah: dijangka instanceof ${issue.expected}, diterima ${received}`;
            }
            return `Input tidak sah: dijangka ${expected}, diterima ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Input tidak sah: dijangka ${util.stringifyPrimitive(issue.values[0])}`;
            return `Pilihan tidak sah: dijangka salah satu daripada ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
            return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} adalah ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Terlalu kecil: dijangka ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Terlalu kecil: dijangka ${issue.origin} adalah ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
            return `${FormatDictionary[_issue.format] ?? issue.format} tidak sah`;
          }
          case "not_multiple_of":
            return `Nombor tidak sah: perlu gandaan ${issue.divisor}`;
          case "unrecognized_keys":
            return `Kunci tidak dikenali: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Kunci tidak sah dalam ${issue.origin}`;
          case "invalid_union":
            return "Input tidak sah";
          case "invalid_element":
            return `Nilai tidak sah dalam ${issue.origin}`;
          default:
            return `Input tidak sah`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/nl.cjs
var require_nl = __commonJS({
  "node_modules/zod/v4/locales/nl.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "tekens", verb: "heeft" },
        file: { unit: "bytes", verb: "heeft" },
        array: { unit: "elementen", verb: "heeft" },
        set: { unit: "elementen", verb: "heeft" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "invoer",
        email: "emailadres",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum en tijd",
        date: "ISO datum",
        time: "ISO tijd",
        duration: "ISO duur",
        ipv4: "IPv4-adres",
        ipv6: "IPv6-adres",
        cidrv4: "IPv4-bereik",
        cidrv6: "IPv6-bereik",
        base64: "base64-gecodeerde tekst",
        base64url: "base64 URL-gecodeerde tekst",
        json_string: "JSON string",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "invoer"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "getal"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Ongeldige invoer: verwacht instanceof ${issue.expected}, ontving ${received}`;
            }
            return `Ongeldige invoer: verwacht ${expected}, ontving ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Ongeldige invoer: verwacht ${util.stringifyPrimitive(issue.values[0])}`;
            return `Ongeldige optie: verwacht \xE9\xE9n van ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            const longName = issue.origin === "date" ? "laat" : issue.origin === "string" ? "lang" : "groot";
            if (sizing)
              return `Te ${longName}: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementen"} ${sizing.verb}`;
            return `Te ${longName}: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} is`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            const shortName = issue.origin === "date" ? "vroeg" : issue.origin === "string" ? "kort" : "klein";
            if (sizing) {
              return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
            }
            return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} is`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
            }
            if (_issue.format === "ends_with")
              return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
            if (_issue.format === "includes")
              return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
            if (_issue.format === "regex")
              return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
            return `Ongeldig: ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Ongeldig getal: moet een veelvoud van ${issue.divisor} zijn`;
          case "unrecognized_keys":
            return `Onbekende key${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Ongeldige key in ${issue.origin}`;
          case "invalid_union":
            return "Ongeldige invoer";
          case "invalid_element":
            return `Ongeldige waarde in ${issue.origin}`;
          default:
            return `Ongeldige invoer`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/no.cjs
var require_no = __commonJS({
  "node_modules/zod/v4/locales/no.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "tegn", verb: "\xE5 ha" },
        file: { unit: "bytes", verb: "\xE5 ha" },
        array: { unit: "elementer", verb: "\xE5 inneholde" },
        set: { unit: "elementer", verb: "\xE5 inneholde" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "input",
        email: "e-postadresse",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dato- og klokkeslett",
        date: "ISO-dato",
        time: "ISO-klokkeslett",
        duration: "ISO-varighet",
        ipv4: "IPv4-omr\xE5de",
        ipv6: "IPv6-omr\xE5de",
        cidrv4: "IPv4-spekter",
        cidrv6: "IPv6-spekter",
        base64: "base64-enkodet streng",
        base64url: "base64url-enkodet streng",
        json_string: "JSON-streng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "tall",
        array: "liste"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Ugyldig input: forventet instanceof ${issue.expected}, fikk ${received}`;
            }
            return `Ugyldig input: forventet ${expected}, fikk ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Ugyldig verdi: forventet ${util.stringifyPrimitive(issue.values[0])}`;
            return `Ugyldig valg: forventet en av ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `For stor(t): forventet ${issue.origin ?? "value"} til \xE5 ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
            return `For stor(t): forventet ${issue.origin ?? "value"} til \xE5 ha ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `For lite(n): forventet ${issue.origin} til \xE5 ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `For lite(n): forventet ${issue.origin} til \xE5 ha ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Ugyldig streng: m\xE5 starte med "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Ugyldig streng: m\xE5 ende med "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ugyldig streng: m\xE5 inneholde "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ugyldig streng: m\xE5 matche m\xF8nsteret ${_issue.pattern}`;
            return `Ugyldig ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Ugyldig tall: m\xE5 v\xE6re et multiplum av ${issue.divisor}`;
          case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Ukjente n\xF8kler" : "Ukjent n\xF8kkel"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Ugyldig n\xF8kkel i ${issue.origin}`;
          case "invalid_union":
            return "Ugyldig input";
          case "invalid_element":
            return `Ugyldig verdi i ${issue.origin}`;
          default:
            return `Ugyldig input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ota.cjs
var require_ota = __commonJS({
  "node_modules/zod/v4/locales/ota.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
        file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
        array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
        set: { unit: "unsur", verb: "olmal\u0131d\u0131r" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "giren",
        email: "epostag\xE2h",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO heng\xE2m\u0131",
        date: "ISO tarihi",
        time: "ISO zaman\u0131",
        duration: "ISO m\xFCddeti",
        ipv4: "IPv4 ni\u015F\xE2n\u0131",
        ipv6: "IPv6 ni\u015F\xE2n\u0131",
        cidrv4: "IPv4 menzili",
        cidrv6: "IPv6 menzili",
        base64: "base64-\u015Fifreli metin",
        base64url: "base64url-\u015Fifreli metin",
        json_string: "JSON metin",
        e164: "E.164 say\u0131s\u0131",
        jwt: "JWT",
        template_literal: "giren"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "numara",
        array: "saf",
        null: "gayb"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `F\xE2sit giren: umulan instanceof ${issue.expected}, al\u0131nan ${received}`;
            }
            return `F\xE2sit giren: umulan ${expected}, al\u0131nan ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `F\xE2sit giren: umulan ${util.stringifyPrimitive(issue.values[0])}`;
            return `F\xE2sit tercih: m\xFBteberler ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Fazla b\xFCy\xFCk: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmal\u0131yd\u0131.`;
            return `Fazla b\xFCy\xFCk: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} olmal\u0131yd\u0131.`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Fazla k\xFC\xE7\xFCk: ${issue.origin}, ${adj}${issue.minimum.toString()} ${sizing.unit} sahip olmal\u0131yd\u0131.`;
            }
            return `Fazla k\xFC\xE7\xFCk: ${issue.origin}, ${adj}${issue.minimum.toString()} olmal\u0131yd\u0131.`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `F\xE2sit metin: "${_issue.prefix}" ile ba\u015Flamal\u0131.`;
            if (_issue.format === "ends_with")
              return `F\xE2sit metin: "${_issue.suffix}" ile bitmeli.`;
            if (_issue.format === "includes")
              return `F\xE2sit metin: "${_issue.includes}" ihtiv\xE2 etmeli.`;
            if (_issue.format === "regex")
              return `F\xE2sit metin: ${_issue.pattern} nak\u015F\u0131na uymal\u0131.`;
            return `F\xE2sit ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `F\xE2sit say\u0131: ${issue.divisor} kat\u0131 olmal\u0131yd\u0131.`;
          case "unrecognized_keys":
            return `Tan\u0131nmayan anahtar ${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `${issue.origin} i\xE7in tan\u0131nmayan anahtar var.`;
          case "invalid_union":
            return "Giren tan\u0131namad\u0131.";
          case "invalid_element":
            return `${issue.origin} i\xE7in tan\u0131nmayan k\u0131ymet var.`;
          default:
            return `K\u0131ymet tan\u0131namad\u0131.`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ps.cjs
var require_ps = __commonJS({
  "node_modules/zod/v4/locales/ps.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
        file: { unit: "\u0628\u0627\u06CC\u067C\u0633", verb: "\u0648\u0644\u0631\u064A" },
        array: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" },
        set: { unit: "\u062A\u0648\u06A9\u064A", verb: "\u0648\u0644\u0631\u064A" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0648\u0631\u0648\u062F\u064A",
        email: "\u0628\u0631\u06CC\u069A\u0646\u0627\u0644\u06CC\u06A9",
        url: "\u06CC\u0648 \u0622\u0631 \u0627\u0644",
        emoji: "\u0627\u06CC\u0645\u0648\u062C\u064A",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\u0646\u06CC\u067C\u0647 \u0627\u0648 \u0648\u062E\u062A",
        date: "\u0646\u06D0\u067C\u0647",
        time: "\u0648\u062E\u062A",
        duration: "\u0645\u0648\u062F\u0647",
        ipv4: "\u062F IPv4 \u067E\u062A\u0647",
        ipv6: "\u062F IPv6 \u067E\u062A\u0647",
        cidrv4: "\u062F IPv4 \u0633\u0627\u062D\u0647",
        cidrv6: "\u062F IPv6 \u0633\u0627\u062D\u0647",
        base64: "base64-encoded \u0645\u062A\u0646",
        base64url: "base64url-encoded \u0645\u062A\u0646",
        json_string: "JSON \u0645\u062A\u0646",
        e164: "\u062F E.164 \u0634\u0645\u06D0\u0631\u0647",
        jwt: "JWT",
        template_literal: "\u0648\u0631\u0648\u062F\u064A"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0639\u062F\u062F",
        array: "\u0627\u0631\u06D0"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F instanceof ${issue.expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${received} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
            }
            return `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${expected} \u0648\u0627\u06CC, \u0645\u06AB\u0631 ${received} \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648`;
          }
          case "invalid_value":
            if (issue.values.length === 1) {
              return `\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ${util.stringifyPrimitive(issue.values[0])} \u0648\u0627\u06CC`;
            }
            return `\u0646\u0627\u0633\u0645 \u0627\u0646\u062A\u062E\u0627\u0628: \u0628\u0627\u06CC\u062F \u06CC\u0648 \u0644\u0647 ${util.joinValues(issue.values, "|")} \u0685\u062E\u0647 \u0648\u0627\u06CC`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${issue.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0635\u0631\u0648\u0646\u0647"} \u0648\u0644\u0631\u064A`;
            }
            return `\u0689\u06CC\u0631 \u0644\u0648\u06CC: ${issue.origin ?? "\u0627\u0631\u0632\u069A\u062A"} \u0628\u0627\u06CC\u062F ${adj}${issue.maximum.toString()} \u0648\u064A`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${issue.origin} \u0628\u0627\u06CC\u062F ${adj}${issue.minimum.toString()} ${sizing.unit} \u0648\u0644\u0631\u064A`;
            }
            return `\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: ${issue.origin} \u0628\u0627\u06CC\u062F ${adj}${issue.minimum.toString()} \u0648\u064A`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${_issue.prefix}" \u0633\u0631\u0647 \u067E\u06CC\u0644 \u0634\u064A`;
            }
            if (_issue.format === "ends_with") {
              return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "${_issue.suffix}" \u0633\u0631\u0647 \u067E\u0627\u06CC \u062A\u0647 \u0648\u0631\u0633\u064A\u0696\u064A`;
            }
            if (_issue.format === "includes") {
              return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F "${_issue.includes}" \u0648\u0644\u0631\u064A`;
            }
            if (_issue.format === "regex") {
              return `\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F ${_issue.pattern} \u0633\u0631\u0647 \u0645\u0637\u0627\u0628\u0642\u062A \u0648\u0644\u0631\u064A`;
            }
            return `${FormatDictionary[_issue.format] ?? issue.format} \u0646\u0627\u0633\u0645 \u062F\u06CC`;
          }
          case "not_multiple_of":
            return `\u0646\u0627\u0633\u0645 \u0639\u062F\u062F: \u0628\u0627\u06CC\u062F \u062F ${issue.divisor} \u0645\u0636\u0631\u0628 \u0648\u064A`;
          case "unrecognized_keys":
            return `\u0646\u0627\u0633\u0645 ${issue.keys.length > 1 ? "\u06A9\u0644\u06CC\u0689\u0648\u0646\u0647" : "\u06A9\u0644\u06CC\u0689"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u0646\u0627\u0633\u0645 \u06A9\u0644\u06CC\u0689 \u067E\u0647 ${issue.origin} \u06A9\u06D0`;
          case "invalid_union":
            return `\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A`;
          case "invalid_element":
            return `\u0646\u0627\u0633\u0645 \u0639\u0646\u0635\u0631 \u067E\u0647 ${issue.origin} \u06A9\u06D0`;
          default:
            return `\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/pl.cjs
var require_pl = __commonJS({
  "node_modules/zod/v4/locales/pl.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "znak\xF3w", verb: "mie\u0107" },
        file: { unit: "bajt\xF3w", verb: "mie\u0107" },
        array: { unit: "element\xF3w", verb: "mie\u0107" },
        set: { unit: "element\xF3w", verb: "mie\u0107" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "wyra\u017Cenie",
        email: "adres email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i godzina w formacie ISO",
        date: "data w formacie ISO",
        time: "godzina w formacie ISO",
        duration: "czas trwania ISO",
        ipv4: "adres IPv4",
        ipv6: "adres IPv6",
        cidrv4: "zakres IPv4",
        cidrv6: "zakres IPv6",
        base64: "ci\u0105g znak\xF3w zakodowany w formacie base64",
        base64url: "ci\u0105g znak\xF3w zakodowany w formacie base64url",
        json_string: "ci\u0105g znak\xF3w w formacie JSON",
        e164: "liczba E.164",
        jwt: "JWT",
        template_literal: "wej\u015Bcie"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "liczba",
        array: "tablica"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof ${issue.expected}, otrzymano ${received}`;
            }
            return `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${expected}, otrzymano ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ${util.stringifyPrimitive(issue.values[0])}`;
            return `Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Za du\u017Ca warto\u015B\u0107: oczekiwano, \u017Ce ${issue.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element\xF3w"}`;
            }
            return `Zbyt du\u017C(y/a/e): oczekiwano, \u017Ce ${issue.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Za ma\u0142a warto\u015B\u0107: oczekiwano, \u017Ce ${issue.origin ?? "warto\u015B\u0107"} b\u0119dzie mie\u0107 ${adj}${issue.minimum.toString()} ${sizing.unit ?? "element\xF3w"}`;
            }
            return `Zbyt ma\u0142(y/a/e): oczekiwano, \u017Ce ${issue.origin ?? "warto\u015B\u0107"} b\u0119dzie wynosi\u0107 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zaczyna\u0107 si\u0119 od "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi ko\u0144czy\u0107 si\u0119 na "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zawiera\u0107 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Nieprawid\u0142owy ci\u0105g znak\xF3w: musi odpowiada\u0107 wzorcowi ${_issue.pattern}`;
            return `Nieprawid\u0142ow(y/a/e) ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Nieprawid\u0142owa liczba: musi by\u0107 wielokrotno\u015Bci\u0105 ${issue.divisor}`;
          case "unrecognized_keys":
            return `Nierozpoznane klucze${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Nieprawid\u0142owy klucz w ${issue.origin}`;
          case "invalid_union":
            return "Nieprawid\u0142owe dane wej\u015Bciowe";
          case "invalid_element":
            return `Nieprawid\u0142owa warto\u015B\u0107 w ${issue.origin}`;
          default:
            return `Nieprawid\u0142owe dane wej\u015Bciowe`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/pt.cjs
var require_pt = __commonJS({
  "node_modules/zod/v4/locales/pt.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "caracteres", verb: "ter" },
        file: { unit: "bytes", verb: "ter" },
        array: { unit: "itens", verb: "ter" },
        set: { unit: "itens", verb: "ter" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "padr\xE3o",
        email: "endere\xE7o de e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "dura\xE7\xE3o ISO",
        ipv4: "endere\xE7o IPv4",
        ipv6: "endere\xE7o IPv6",
        cidrv4: "faixa de IPv4",
        cidrv6: "faixa de IPv6",
        base64: "texto codificado em base64",
        base64url: "URL codificada em base64",
        json_string: "texto JSON",
        e164: "n\xFAmero E.164",
        jwt: "JWT",
        template_literal: "entrada"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "n\xFAmero",
        null: "nulo"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Tipo inv\xE1lido: esperado instanceof ${issue.expected}, recebido ${received}`;
            }
            return `Tipo inv\xE1lido: esperado ${expected}, recebido ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Entrada inv\xE1lida: esperado ${util.stringifyPrimitive(issue.values[0])}`;
            return `Op\xE7\xE3o inv\xE1lida: esperada uma das ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Muito grande: esperado que ${issue.origin ?? "valor"} tivesse ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
            return `Muito grande: esperado que ${issue.origin ?? "valor"} fosse ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Muito pequeno: esperado que ${issue.origin} tivesse ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Muito pequeno: esperado que ${issue.origin} fosse ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Texto inv\xE1lido: deve come\xE7ar com "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Texto inv\xE1lido: deve terminar com "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Texto inv\xE1lido: deve incluir "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Texto inv\xE1lido: deve corresponder ao padr\xE3o ${_issue.pattern}`;
            return `${FormatDictionary[_issue.format] ?? issue.format} inv\xE1lido`;
          }
          case "not_multiple_of":
            return `N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ${issue.divisor}`;
          case "unrecognized_keys":
            return `Chave${issue.keys.length > 1 ? "s" : ""} desconhecida${issue.keys.length > 1 ? "s" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Chave inv\xE1lida em ${issue.origin}`;
          case "invalid_union":
            return "Entrada inv\xE1lida";
          case "invalid_element":
            return `Valor inv\xE1lido em ${issue.origin}`;
          default:
            return `Campo inv\xE1lido`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ro.cjs
var require_ro = __commonJS({
  "node_modules/zod/v4/locales/ro.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "caractere", verb: "s\u0103 aib\u0103" },
        file: { unit: "octe\u021Bi", verb: "s\u0103 aib\u0103" },
        array: { unit: "elemente", verb: "s\u0103 aib\u0103" },
        set: { unit: "elemente", verb: "s\u0103 aib\u0103" },
        map: { unit: "intr\u0103ri", verb: "s\u0103 aib\u0103" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "intrare",
        email: "adres\u0103 de email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "dat\u0103 \u0219i or\u0103 ISO",
        date: "dat\u0103 ISO",
        time: "or\u0103 ISO",
        duration: "durat\u0103 ISO",
        ipv4: "adres\u0103 IPv4",
        ipv6: "adres\u0103 IPv6",
        mac: "adres\u0103 MAC",
        cidrv4: "interval IPv4",
        cidrv6: "interval IPv6",
        base64: "\u0219ir codat base64",
        base64url: "\u0219ir codat base64url",
        json_string: "\u0219ir JSON",
        e164: "num\u0103r E.164",
        jwt: "JWT",
        template_literal: "intrare"
      };
      const TypeDictionary = {
        nan: "NaN",
        string: "\u0219ir",
        number: "num\u0103r",
        boolean: "boolean",
        function: "func\u021Bie",
        array: "matrice",
        object: "obiect",
        undefined: "nedefinit",
        symbol: "simbol",
        bigint: "num\u0103r mare",
        void: "void",
        never: "never",
        map: "hart\u0103",
        set: "set"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            return `Intrare invalid\u0103: a\u0219teptat ${expected}, primit ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Intrare invalid\u0103: a\u0219teptat ${util.stringifyPrimitive(issue.values[0])}`;
            return `Op\u021Biune invalid\u0103: a\u0219teptat una dintre ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Prea mare: a\u0219teptat ca ${issue.origin ?? "valoarea"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemente"}`;
            return `Prea mare: a\u0219teptat ca ${issue.origin ?? "valoarea"} s\u0103 fie ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Prea mic: a\u0219teptat ca ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Prea mic: a\u0219teptat ca ${issue.origin} s\u0103 fie ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u0218ir invalid: trebuie s\u0103 \xEEnceap\u0103 cu "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `\u0218ir invalid: trebuie s\u0103 se termine cu "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u0218ir invalid: trebuie s\u0103 includ\u0103 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u0218ir invalid: trebuie s\u0103 se potriveasc\u0103 cu modelul ${_issue.pattern}`;
            return `Format invalid: ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Num\u0103r invalid: trebuie s\u0103 fie multiplu de ${issue.divisor}`;
          case "unrecognized_keys":
            return `Chei nerecunoscute: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Cheie invalid\u0103 \xEEn ${issue.origin}`;
          case "invalid_union":
            return "Intrare invalid\u0103";
          case "invalid_element":
            return `Valoare invalid\u0103 \xEEn ${issue.origin}`;
          default:
            return `Intrare invalid\u0103`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ru.cjs
var require_ru = __commonJS({
  "node_modules/zod/v4/locales/ru.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    function getRussianPlural(count, one, few, many) {
      const absCount = Math.abs(count);
      const lastDigit = absCount % 10;
      const lastTwoDigits = absCount % 100;
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
      }
      if (lastDigit === 1) {
        return one;
      }
      if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
      }
      return many;
    }
    var error = () => {
      const Sizable = {
        string: {
          unit: {
            one: "\u0441\u0438\u043C\u0432\u043E\u043B",
            few: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
            many: "\u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432"
          },
          verb: "\u0438\u043C\u0435\u0442\u044C"
        },
        file: {
          unit: {
            one: "\u0431\u0430\u0439\u0442",
            few: "\u0431\u0430\u0439\u0442\u0430",
            many: "\u0431\u0430\u0439\u0442"
          },
          verb: "\u0438\u043C\u0435\u0442\u044C"
        },
        array: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432"
          },
          verb: "\u0438\u043C\u0435\u0442\u044C"
        },
        set: {
          unit: {
            one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
            few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432"
          },
          verb: "\u0438\u043C\u0435\u0442\u044C"
        }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0432\u0432\u043E\u0434",
        email: "email \u0430\u0434\u0440\u0435\u0441",
        url: "URL",
        emoji: "\u044D\u043C\u043E\u0434\u0437\u0438",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F",
        date: "ISO \u0434\u0430\u0442\u0430",
        time: "ISO \u0432\u0440\u0435\u043C\u044F",
        duration: "ISO \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
        ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
        ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
        cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
        cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
        base64: "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64",
        base64url: "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64url",
        json_string: "JSON \u0441\u0442\u0440\u043E\u043A\u0430",
        e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
        jwt: "JWT",
        template_literal: "\u0432\u0432\u043E\u0434"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0447\u0438\u0441\u043B\u043E",
        array: "\u043C\u0430\u0441\u0441\u0438\u0432"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C instanceof ${issue.expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${received}`;
            }
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${expected}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0434\u043D\u043E \u0438\u0437 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              const maxValue = Number(issue.maximum);
              const unit = getRussianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${adj}${issue.maximum.toString()} ${unit}`;
            }
            return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435"} \u0431\u0443\u0434\u0435\u0442 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              const minValue = Number(issue.minimum);
              const unit = getRussianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
              return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue.origin} \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ${adj}${issue.minimum.toString()} ${unit}`;
            }
            return `\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E ${issue.origin} \u0431\u0443\u0434\u0435\u0442 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${_issue.pattern}`;
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E: \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D${issue.keys.length > 1 ? "\u044B\u0435" : "\u044B\u0439"} \u043A\u043B\u044E\u0447${issue.keys.length > 1 ? "\u0438" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043B\u044E\u0447 \u0432 ${issue.origin}`;
          case "invalid_union":
            return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
          case "invalid_element":
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 ${issue.origin}`;
          default:
            return `\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/sl.cjs
var require_sl = __commonJS({
  "node_modules/zod/v4/locales/sl.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "znakov", verb: "imeti" },
        file: { unit: "bajtov", verb: "imeti" },
        array: { unit: "elementov", verb: "imeti" },
        set: { unit: "elementov", verb: "imeti" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "vnos",
        email: "e-po\u0161tni naslov",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum in \u010Das",
        date: "ISO datum",
        time: "ISO \u010Das",
        duration: "ISO trajanje",
        ipv4: "IPv4 naslov",
        ipv6: "IPv6 naslov",
        cidrv4: "obseg IPv4",
        cidrv6: "obseg IPv6",
        base64: "base64 kodiran niz",
        base64url: "base64url kodiran niz",
        json_string: "JSON niz",
        e164: "E.164 \u0161tevilka",
        jwt: "JWT",
        template_literal: "vnos"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0161tevilo",
        array: "tabela"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Neveljaven vnos: pri\u010Dakovano instanceof ${issue.expected}, prejeto ${received}`;
            }
            return `Neveljaven vnos: pri\u010Dakovano ${expected}, prejeto ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Neveljaven vnos: pri\u010Dakovano ${util.stringifyPrimitive(issue.values[0])}`;
            return `Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Preveliko: pri\u010Dakovano, da bo ${issue.origin ?? "vrednost"} imelo ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementov"}`;
            return `Preveliko: pri\u010Dakovano, da bo ${issue.origin ?? "vrednost"} ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Premajhno: pri\u010Dakovano, da bo ${issue.origin} imelo ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Premajhno: pri\u010Dakovano, da bo ${issue.origin} ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `Neveljaven niz: mora se za\u010Deti z "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Neveljaven niz: mora se kon\u010Dati z "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
            return `Neveljaven ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Neveljavno \u0161tevilo: mora biti ve\u010Dkratnik ${issue.divisor}`;
          case "unrecognized_keys":
            return `Neprepoznan${issue.keys.length > 1 ? "i klju\u010Di" : " klju\u010D"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Neveljaven klju\u010D v ${issue.origin}`;
          case "invalid_union":
            return "Neveljaven vnos";
          case "invalid_element":
            return `Neveljavna vrednost v ${issue.origin}`;
          default:
            return "Neveljaven vnos";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/sv.cjs
var require_sv = __commonJS({
  "node_modules/zod/v4/locales/sv.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "tecken", verb: "att ha" },
        file: { unit: "bytes", verb: "att ha" },
        array: { unit: "objekt", verb: "att inneh\xE5lla" },
        set: { unit: "objekt", verb: "att inneh\xE5lla" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "regulj\xE4rt uttryck",
        email: "e-postadress",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datum och tid",
        date: "ISO-datum",
        time: "ISO-tid",
        duration: "ISO-varaktighet",
        ipv4: "IPv4-intervall",
        ipv6: "IPv6-intervall",
        cidrv4: "IPv4-spektrum",
        cidrv6: "IPv6-spektrum",
        base64: "base64-kodad str\xE4ng",
        base64url: "base64url-kodad str\xE4ng",
        json_string: "JSON-str\xE4ng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "mall-literal"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "antal",
        array: "lista"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Ogiltig inmatning: f\xF6rv\xE4ntat instanceof ${issue.expected}, fick ${received}`;
            }
            return `Ogiltig inmatning: f\xF6rv\xE4ntat ${expected}, fick ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Ogiltig inmatning: f\xF6rv\xE4ntat ${util.stringifyPrimitive(issue.values[0])}`;
            return `Ogiltigt val: f\xF6rv\xE4ntade en av ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `F\xF6r stor(t): f\xF6rv\xE4ntade ${issue.origin ?? "v\xE4rdet"} att ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
            }
            return `F\xF6r stor(t): f\xF6rv\xE4ntat ${issue.origin ?? "v\xE4rdet"} att ha ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `F\xF6r lite(t): f\xF6rv\xE4ntade ${issue.origin ?? "v\xE4rdet"} att ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `F\xF6r lite(t): f\xF6rv\xE4ntade ${issue.origin ?? "v\xE4rdet"} att ha ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `Ogiltig str\xE4ng: m\xE5ste b\xF6rja med "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `Ogiltig str\xE4ng: m\xE5ste sluta med "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Ogiltig str\xE4ng: m\xE5ste inneh\xE5lla "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Ogiltig str\xE4ng: m\xE5ste matcha m\xF6nstret "${_issue.pattern}"`;
            return `Ogiltig(t) ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Ogiltigt tal: m\xE5ste vara en multipel av ${issue.divisor}`;
          case "unrecognized_keys":
            return `${issue.keys.length > 1 ? "Ok\xE4nda nycklar" : "Ok\xE4nd nyckel"}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Ogiltig nyckel i ${issue.origin ?? "v\xE4rdet"}`;
          case "invalid_union":
            return "Ogiltig input";
          case "invalid_element":
            return `Ogiltigt v\xE4rde i ${issue.origin ?? "v\xE4rdet"}`;
          default:
            return `Ogiltig input`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ta.cjs
var require_ta = __commonJS({
  "node_modules/zod/v4/locales/ta.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
        file: { unit: "\u0BAA\u0BC8\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
        array: { unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" },
        set: { unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD", verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1",
        email: "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u0BA4\u0BC7\u0BA4\u0BBF \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
        date: "ISO \u0BA4\u0BC7\u0BA4\u0BBF",
        time: "ISO \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
        duration: "ISO \u0B95\u0BBE\u0BB2 \u0B85\u0BB3\u0BB5\u0BC1",
        ipv4: "IPv4 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
        ipv6: "IPv6 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
        cidrv4: "IPv4 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
        cidrv6: "IPv6 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
        base64: "base64-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
        base64url: "base64url-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
        json_string: "JSON \u0B9A\u0BB0\u0BAE\u0BCD",
        e164: "E.164 \u0B8E\u0BA3\u0BCD",
        jwt: "JWT",
        template_literal: "input"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0B8E\u0BA3\u0BCD",
        array: "\u0B85\u0BA3\u0BBF",
        null: "\u0BB5\u0BC6\u0BB1\u0BC1\u0BAE\u0BC8"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 instanceof ${issue.expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${received}`;
            }
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${expected}, \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${util.joinValues(issue.values, "|")} \u0B87\u0BB2\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD"} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
            }
            return `\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1"} ${adj}${issue.maximum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
            }
            return `\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ${issue.origin} ${adj}${issue.minimum.toString()} \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${_issue.prefix}" \u0B87\u0BB2\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
            if (_issue.format === "ends_with")
              return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${_issue.suffix}" \u0B87\u0BB2\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0B9F\u0BC8\u0BAF \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
            if (_issue.format === "includes")
              return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "${_issue.includes}" \u0B90 \u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
            if (_issue.format === "regex")
              return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: ${_issue.pattern} \u0BAE\u0BC1\u0BB1\u0BC8\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1\u0B9F\u0BA9\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B8E\u0BA3\u0BCD: ${issue.divisor} \u0B87\u0BA9\u0BCD \u0BAA\u0BB2\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD`;
          case "unrecognized_keys":
            return `\u0B85\u0B9F\u0BC8\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BA4 \u0BB5\u0BBF\u0B9A\u0BC8${issue.keys.length > 1 ? "\u0B95\u0BB3\u0BCD" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `${issue.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0B9A\u0BC8`;
          case "invalid_union":
            return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
          case "invalid_element":
            return `${issue.origin} \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1`;
          default:
            return `\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/th.cjs
var require_th = __commonJS({
  "node_modules/zod/v4/locales/th.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
        file: { unit: "\u0E44\u0E1A\u0E15\u0E4C", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
        array: { unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" },
        set: { unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", verb: "\u0E04\u0E27\u0E23\u0E21\u0E35" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
        email: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E2D\u0E35\u0E40\u0E21\u0E25",
        url: "URL",
        emoji: "\u0E2D\u0E34\u0E42\u0E21\u0E08\u0E34",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
        date: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E1A\u0E1A ISO",
        time: "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
        duration: "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
        ipv4: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv4",
        ipv6: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv6",
        cidrv4: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv4",
        cidrv6: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv6",
        base64: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64",
        base64url: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A URL",
        json_string: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A JSON",
        e164: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28 (E.164)",
        jwt: "\u0E42\u0E17\u0E40\u0E04\u0E19 JWT",
        template_literal: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02",
        array: "\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C (Array)",
        null: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32 (null)"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 instanceof ${issue.expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${received}`;
            }
            return `\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${expected} \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19" : "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue.maximum.toString()} ${sizing.unit ?? "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"}`;
            return `\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue.origin ?? "\u0E04\u0E48\u0E32"} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? "\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22" : "\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: ${issue.origin} \u0E04\u0E27\u0E23\u0E21\u0E35${adj} ${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 "${_issue.prefix}"`;
            }
            if (_issue.format === "ends_with")
              return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E25\u0E07\u0E17\u0E49\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 "${_issue.includes}" \u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21`;
            if (_issue.format === "regex")
              return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ${_issue.pattern}`;
            return `\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22 ${issue.divisor} \u0E44\u0E14\u0E49\u0E25\u0E07\u0E15\u0E31\u0E27`;
          case "unrecognized_keys":
            return `\u0E1E\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u0E04\u0E35\u0E22\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${issue.origin}`;
          case "invalid_union":
            return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E22\u0E39\u0E40\u0E19\u0E35\u0E22\u0E19\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
          case "invalid_element":
            return `\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ${issue.origin}`;
          default:
            return `\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/tr.cjs
var require_tr = __commonJS({
  "node_modules/zod/v4/locales/tr.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "karakter", verb: "olmal\u0131" },
        file: { unit: "bayt", verb: "olmal\u0131" },
        array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
        set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "girdi",
        email: "e-posta adresi",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO tarih ve saat",
        date: "ISO tarih",
        time: "ISO saat",
        duration: "ISO s\xFCre",
        ipv4: "IPv4 adresi",
        ipv6: "IPv6 adresi",
        cidrv4: "IPv4 aral\u0131\u011F\u0131",
        cidrv6: "IPv6 aral\u0131\u011F\u0131",
        base64: "base64 ile \u015Fifrelenmi\u015F metin",
        base64url: "base64url ile \u015Fifrelenmi\u015F metin",
        json_string: "JSON dizesi",
        e164: "E.164 say\u0131s\u0131",
        jwt: "JWT",
        template_literal: "\u015Eablon dizesi"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Ge\xE7ersiz de\u011Fer: beklenen instanceof ${issue.expected}, al\u0131nan ${received}`;
            }
            return `Ge\xE7ersiz de\u011Fer: beklenen ${expected}, al\u0131nan ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Ge\xE7ersiz de\u011Fer: beklenen ${util.stringifyPrimitive(issue.values[0])}`;
            return `Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\xC7ok b\xFCy\xFCk: beklenen ${issue.origin ?? "de\u011Fer"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\xF6\u011Fe"}`;
            return `\xC7ok b\xFCy\xFCk: beklenen ${issue.origin ?? "de\u011Fer"} ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\xC7ok k\xFC\xE7\xFCk: beklenen ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            return `\xC7ok k\xFC\xE7\xFCk: beklenen ${issue.origin} ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Ge\xE7ersiz metin: "${_issue.prefix}" ile ba\u015Flamal\u0131`;
            if (_issue.format === "ends_with")
              return `Ge\xE7ersiz metin: "${_issue.suffix}" ile bitmeli`;
            if (_issue.format === "includes")
              return `Ge\xE7ersiz metin: "${_issue.includes}" i\xE7ermeli`;
            if (_issue.format === "regex")
              return `Ge\xE7ersiz metin: ${_issue.pattern} desenine uymal\u0131`;
            return `Ge\xE7ersiz ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Ge\xE7ersiz say\u0131: ${issue.divisor} ile tam b\xF6l\xFCnebilmeli`;
          case "unrecognized_keys":
            return `Tan\u0131nmayan anahtar${issue.keys.length > 1 ? "lar" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `${issue.origin} i\xE7inde ge\xE7ersiz anahtar`;
          case "invalid_union":
            return "Ge\xE7ersiz de\u011Fer";
          case "invalid_element":
            return `${issue.origin} i\xE7inde ge\xE7ersiz de\u011Fer`;
          default:
            return `Ge\xE7ersiz de\u011Fer`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/uk.cjs
var require_uk = __commonJS({
  "node_modules/zod/v4/locales/uk.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
        file: { unit: "\u0431\u0430\u0439\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
        array: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" },
        set: { unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432", verb: "\u043C\u0430\u0442\u0438\u043C\u0435" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
        email: "\u0430\u0434\u0440\u0435\u0441\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0457 \u043F\u043E\u0448\u0442\u0438",
        url: "URL",
        emoji: "\u0435\u043C\u043E\u0434\u0437\u0456",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\u0434\u0430\u0442\u0430 \u0442\u0430 \u0447\u0430\u0441 ISO",
        date: "\u0434\u0430\u0442\u0430 ISO",
        time: "\u0447\u0430\u0441 ISO",
        duration: "\u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C ISO",
        ipv4: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv4",
        ipv6: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv6",
        cidrv4: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv4",
        cidrv6: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv6",
        base64: "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64",
        base64url: "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64url",
        json_string: "\u0440\u044F\u0434\u043E\u043A JSON",
        e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
        jwt: "JWT",
        template_literal: "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0447\u0438\u0441\u043B\u043E",
        array: "\u043C\u0430\u0441\u0438\u0432"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F instanceof ${issue.expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${received}`;
            }
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${expected}, \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430 \u043E\u043F\u0446\u0456\u044F: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u043D\u0435 \u0437 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432"}`;
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue.origin ?? "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F"} \u0431\u0443\u0434\u0435 ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E ${issue.origin} \u0431\u0443\u0434\u0435 ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0437 "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0437\u0430\u043A\u0456\u043D\u0447\u0443\u0432\u0430\u0442\u0438\u0441\u044F \u043D\u0430 "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043C\u0456\u0441\u0442\u0438\u0442\u0438 "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ${_issue.pattern}`;
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0447\u0438\u0441\u043B\u043E: \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u0431\u0443\u0442\u0438 \u043A\u0440\u0430\u0442\u043D\u0438\u043C ${issue.divisor}`;
          case "unrecognized_keys":
            return `\u041D\u0435\u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0438\u0439 \u043A\u043B\u044E\u0447${issue.keys.length > 1 ? "\u0456" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 \u0443 ${issue.origin}`;
          case "invalid_union":
            return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
          case "invalid_element":
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0443 ${issue.origin}`;
          default:
            return `\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ua.cjs
var require_ua = __commonJS({
  "node_modules/zod/v4/locales/ua.cjs"(exports, module) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var uk_js_1 = __importDefault(require_uk());
    function default_1() {
      return (0, uk_js_1.default)();
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/ur.cjs
var require_ur = __commonJS({
  "node_modules/zod/v4/locales/ur.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u062D\u0631\u0648\u0641", verb: "\u06C1\u0648\u0646\u0627" },
        file: { unit: "\u0628\u0627\u0626\u0679\u0633", verb: "\u06C1\u0648\u0646\u0627" },
        array: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" },
        set: { unit: "\u0622\u0626\u0679\u0645\u0632", verb: "\u06C1\u0648\u0646\u0627" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0627\u0646 \u067E\u0679",
        email: "\u0627\u06CC \u0645\u06CC\u0644 \u0627\u06CC\u0688\u0631\u06CC\u0633",
        url: "\u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644",
        emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
        uuid: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
        uuidv4: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 4",
        uuidv6: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 6",
        nanoid: "\u0646\u06CC\u0646\u0648 \u0622\u0626\u06CC \u0688\u06CC",
        guid: "\u062C\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
        cuid: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
        cuid2: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC 2",
        ulid: "\u06CC\u0648 \u0627\u06CC\u0644 \u0622\u0626\u06CC \u0688\u06CC",
        xid: "\u0627\u06CC\u06A9\u0633 \u0622\u0626\u06CC \u0688\u06CC",
        ksuid: "\u06A9\u06D2 \u0627\u06CC\u0633 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
        datetime: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0688\u06CC\u0679 \u0679\u0627\u0626\u0645",
        date: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u062A\u0627\u0631\u06CC\u062E",
        time: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0648\u0642\u062A",
        duration: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0645\u062F\u062A",
        ipv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0627\u06CC\u0688\u0631\u06CC\u0633",
        ipv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0627\u06CC\u0688\u0631\u06CC\u0633",
        cidrv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0631\u06CC\u0646\u062C",
        cidrv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0631\u06CC\u0646\u062C",
        base64: "\u0628\u06CC\u0633 64 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
        base64url: "\u0628\u06CC\u0633 64 \u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
        json_string: "\u062C\u06D2 \u0627\u06CC\u0633 \u0627\u0648 \u0627\u06CC\u0646 \u0633\u0679\u0631\u0646\u06AF",
        e164: "\u0627\u06CC 164 \u0646\u0645\u0628\u0631",
        jwt: "\u062C\u06D2 \u0688\u0628\u0644\u06CC\u0648 \u0679\u06CC",
        template_literal: "\u0627\u0646 \u067E\u0679"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u0646\u0645\u0628\u0631",
        array: "\u0622\u0631\u06D2",
        null: "\u0646\u0644"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: instanceof ${issue.expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${received} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
            }
            return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${expected} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ${received} \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ${util.stringifyPrimitive(issue.values[0])} \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
            return `\u063A\u0644\u0637 \u0622\u067E\u0634\u0646: ${util.joinValues(issue.values, "|")} \u0645\u06CC\u06BA \u0633\u06D2 \u0627\u06CC\u06A9 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u0628\u06C1\u062A \u0628\u0691\u0627: ${issue.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u06D2 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u0639\u0646\u0627\u0635\u0631"} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`;
            return `\u0628\u06C1\u062A \u0628\u0691\u0627: ${issue.origin ?? "\u0648\u06CC\u0644\u06CC\u0648"} \u06A9\u0627 ${adj}${issue.maximum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${issue.origin} \u06A9\u06D2 ${adj}${issue.minimum.toString()} ${sizing.unit} \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2`;
            }
            return `\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: ${issue.origin} \u06A9\u0627 ${adj}${issue.minimum.toString()} \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${_issue.prefix}" \u0633\u06D2 \u0634\u0631\u0648\u0639 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
            }
            if (_issue.format === "ends_with")
              return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${_issue.suffix}" \u067E\u0631 \u062E\u062A\u0645 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
            if (_issue.format === "includes")
              return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "${_issue.includes}" \u0634\u0627\u0645\u0644 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
            if (_issue.format === "regex")
              return `\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: \u067E\u06CC\u0679\u0631\u0646 ${_issue.pattern} \u0633\u06D2 \u0645\u06CC\u0686 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
            return `\u063A\u0644\u0637 ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u063A\u0644\u0637 \u0646\u0645\u0628\u0631: ${issue.divisor} \u06A9\u0627 \u0645\u0636\u0627\u0639\u0641 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2`;
          case "unrecognized_keys":
            return `\u063A\u06CC\u0631 \u062A\u0633\u0644\u06CC\u0645 \u0634\u062F\u06C1 \u06A9\u06CC${issue.keys.length > 1 ? "\u0632" : ""}: ${util.joinValues(issue.keys, "\u060C ")}`;
          case "invalid_key":
            return `${issue.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u06A9\u06CC`;
          case "invalid_union":
            return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
          case "invalid_element":
            return `${issue.origin} \u0645\u06CC\u06BA \u063A\u0644\u0637 \u0648\u06CC\u0644\u06CC\u0648`;
          default:
            return `\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/uz.cjs
var require_uz = __commonJS({
  "node_modules/zod/v4/locales/uz.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
        file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
        array: { unit: "element", verb: "bo\u2018lishi kerak" },
        set: { unit: "element", verb: "bo\u2018lishi kerak" },
        map: { unit: "yozuv", verb: "bo\u2018lishi kerak" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "kirish",
        email: "elektron pochta manzili",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO sana va vaqti",
        date: "ISO sana",
        time: "ISO vaqt",
        duration: "ISO davomiylik",
        ipv4: "IPv4 manzil",
        ipv6: "IPv6 manzil",
        mac: "MAC manzil",
        cidrv4: "IPv4 diapazon",
        cidrv6: "IPv6 diapazon",
        base64: "base64 kodlangan satr",
        base64url: "base64url kodlangan satr",
        json_string: "JSON satr",
        e164: "E.164 raqam",
        jwt: "JWT",
        template_literal: "kirish"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "raqam",
        array: "massiv"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `Noto\u2018g\u2018ri kirish: kutilgan instanceof ${issue.expected}, qabul qilingan ${received}`;
            }
            return `Noto\u2018g\u2018ri kirish: kutilgan ${expected}, qabul qilingan ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `Noto\u2018g\u2018ri kirish: kutilgan ${util.stringifyPrimitive(issue.values[0])}`;
            return `Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Juda katta: kutilgan ${issue.origin ?? "qiymat"} ${adj}${issue.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
            return `Juda katta: kutilgan ${issue.origin ?? "qiymat"} ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
            }
            return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Noto\u2018g\u2018ri satr: "${_issue.prefix}" bilan boshlanishi kerak`;
            if (_issue.format === "ends_with")
              return `Noto\u2018g\u2018ri satr: "${_issue.suffix}" bilan tugashi kerak`;
            if (_issue.format === "includes")
              return `Noto\u2018g\u2018ri satr: "${_issue.includes}" ni o\u2018z ichiga olishi kerak`;
            if (_issue.format === "regex")
              return `Noto\u2018g\u2018ri satr: ${_issue.pattern} shabloniga mos kelishi kerak`;
            return `Noto\u2018g\u2018ri ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `Noto\u2018g\u2018ri raqam: ${issue.divisor} ning karralisi bo\u2018lishi kerak`;
          case "unrecognized_keys":
            return `Noma\u2019lum kalit${issue.keys.length > 1 ? "lar" : ""}: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `${issue.origin} dagi kalit noto\u2018g\u2018ri`;
          case "invalid_union":
            return "Noto\u2018g\u2018ri kirish";
          case "invalid_element":
            return `${issue.origin} da noto\u2018g\u2018ri qiymat`;
          default:
            return `Noto\u2018g\u2018ri kirish`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/vi.cjs
var require_vi = __commonJS({
  "node_modules/zod/v4/locales/vi.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "k\xFD t\u1EF1", verb: "c\xF3" },
        file: { unit: "byte", verb: "c\xF3" },
        array: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
        set: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u0111\u1EA7u v\xE0o",
        email: "\u0111\u1ECBa ch\u1EC9 email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ng\xE0y gi\u1EDD ISO",
        date: "ng\xE0y ISO",
        time: "gi\u1EDD ISO",
        duration: "kho\u1EA3ng th\u1EDDi gian ISO",
        ipv4: "\u0111\u1ECBa ch\u1EC9 IPv4",
        ipv6: "\u0111\u1ECBa ch\u1EC9 IPv6",
        cidrv4: "d\u1EA3i IPv4",
        cidrv6: "d\u1EA3i IPv6",
        base64: "chu\u1ED7i m\xE3 h\xF3a base64",
        base64url: "chu\u1ED7i m\xE3 h\xF3a base64url",
        json_string: "chu\u1ED7i JSON",
        e164: "s\u1ED1 E.164",
        jwt: "JWT",
        template_literal: "\u0111\u1EA7u v\xE0o"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "s\u1ED1",
        array: "m\u1EA3ng"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i instanceof ${issue.expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${received}`;
            }
            return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${expected}, nh\u1EADn \u0111\u01B0\u1EE3c ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ${util.stringifyPrimitive(issue.values[0])}`;
            return `T\xF9y ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${issue.origin ?? "gi\xE1 tr\u1ECB"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "ph\u1EA7n t\u1EED"}`;
            return `Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i ${issue.origin ?? "gi\xE1 tr\u1ECB"} ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i ${issue.origin} ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i k\u1EBFt th\xFAc b\u1EB1ng "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i bao g\u1ED3m "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i kh\u1EDBp v\u1EDBi m\u1EABu ${_issue.pattern}`;
            return `${FormatDictionary[_issue.format] ?? issue.format} kh\xF4ng h\u1EE3p l\u1EC7`;
          }
          case "not_multiple_of":
            return `S\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i l\xE0 b\u1ED9i s\u1ED1 c\u1EE7a ${issue.divisor}`;
          case "unrecognized_keys":
            return `Kh\xF3a kh\xF4ng \u0111\u01B0\u1EE3c nh\u1EADn d\u1EA1ng: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `Kh\xF3a kh\xF4ng h\u1EE3p l\u1EC7 trong ${issue.origin}`;
          case "invalid_union":
            return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
          case "invalid_element":
            return `Gi\xE1 tr\u1ECB kh\xF4ng h\u1EE3p l\u1EC7 trong ${issue.origin}`;
          default:
            return `\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/zh-CN.cjs
var require_zh_CN = __commonJS({
  "node_modules/zod/v4/locales/zh-CN.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
        file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
        array: { unit: "\u9879", verb: "\u5305\u542B" },
        set: { unit: "\u9879", verb: "\u5305\u542B" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u8F93\u5165",
        email: "\u7535\u5B50\u90AE\u4EF6",
        url: "URL",
        emoji: "\u8868\u60C5\u7B26\u53F7",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO\u65E5\u671F\u65F6\u95F4",
        date: "ISO\u65E5\u671F",
        time: "ISO\u65F6\u95F4",
        duration: "ISO\u65F6\u957F",
        ipv4: "IPv4\u5730\u5740",
        ipv6: "IPv6\u5730\u5740",
        cidrv4: "IPv4\u7F51\u6BB5",
        cidrv6: "IPv6\u7F51\u6BB5",
        base64: "base64\u7F16\u7801\u5B57\u7B26\u4E32",
        base64url: "base64url\u7F16\u7801\u5B57\u7B26\u4E32",
        json_string: "JSON\u5B57\u7B26\u4E32",
        e164: "E.164\u53F7\u7801",
        jwt: "JWT",
        template_literal: "\u8F93\u5165"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "\u6570\u5B57",
        array: "\u6570\u7EC4",
        null: "\u7A7A\u503C(null)"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof ${issue.expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${received}`;
            }
            return `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${expected}\uFF0C\u5B9E\u9645\u63A5\u6536 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${issue.origin ?? "\u503C"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u4E2A\u5143\u7D20"}`;
            return `\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ${issue.origin ?? "\u503C"} ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ${issue.origin} ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${_issue.prefix}" \u5F00\u5934`;
            if (_issue.format === "ends_with")
              return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "${_issue.suffix}" \u7ED3\u5C3E`;
            if (_issue.format === "includes")
              return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u5305\u542B "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u6EE1\u8DB3\u6B63\u5219\u8868\u8FBE\u5F0F ${_issue.pattern}`;
            return `\u65E0\u6548${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u65E0\u6548\u6570\u5B57\uFF1A\u5FC5\u987B\u662F ${issue.divisor} \u7684\u500D\u6570`;
          case "unrecognized_keys":
            return `\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `${issue.origin} \u4E2D\u7684\u952E(key)\u65E0\u6548`;
          case "invalid_union":
            return "\u65E0\u6548\u8F93\u5165";
          case "invalid_element":
            return `${issue.origin} \u4E2D\u5305\u542B\u65E0\u6548\u503C(value)`;
          default:
            return `\u65E0\u6548\u8F93\u5165`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/zh-TW.cjs
var require_zh_TW = __commonJS({
  "node_modules/zod/v4/locales/zh-TW.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
        file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
        array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
        set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u8F38\u5165",
        email: "\u90F5\u4EF6\u5730\u5740",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO \u65E5\u671F\u6642\u9593",
        date: "ISO \u65E5\u671F",
        time: "ISO \u6642\u9593",
        duration: "ISO \u671F\u9593",
        ipv4: "IPv4 \u4F4D\u5740",
        ipv6: "IPv6 \u4F4D\u5740",
        cidrv4: "IPv4 \u7BC4\u570D",
        cidrv6: "IPv6 \u7BC4\u570D",
        base64: "base64 \u7DE8\u78BC\u5B57\u4E32",
        base64url: "base64url \u7DE8\u78BC\u5B57\u4E32",
        json_string: "JSON \u5B57\u4E32",
        e164: "E.164 \u6578\u503C",
        jwt: "JWT",
        template_literal: "\u8F38\u5165"
      };
      const TypeDictionary = {
        nan: "NaN"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof ${issue.expected}\uFF0C\u4F46\u6536\u5230 ${received}`;
            }
            return `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${expected}\uFF0C\u4F46\u6536\u5230 ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ${util.stringifyPrimitive(issue.values[0])}`;
            return `\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${issue.origin ?? "\u503C"} \u61C9\u70BA ${adj}${issue.maximum.toString()} ${sizing.unit ?? "\u500B\u5143\u7D20"}`;
            return `\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ${issue.origin ?? "\u503C"} \u61C9\u70BA ${adj}${issue.maximum.toString()}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing) {
              return `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${issue.origin} \u61C9\u70BA ${adj}${issue.minimum.toString()} ${sizing.unit}`;
            }
            return `\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ${issue.origin} \u61C9\u70BA ${adj}${issue.minimum.toString()}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with") {
              return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${_issue.prefix}" \u958B\u982D`;
            }
            if (_issue.format === "ends_with")
              return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "${_issue.suffix}" \u7D50\u5C3E`;
            if (_issue.format === "includes")
              return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u5305\u542B "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u7B26\u5408\u683C\u5F0F ${_issue.pattern}`;
            return `\u7121\u6548\u7684 ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `\u7121\u6548\u7684\u6578\u5B57\uFF1A\u5FC5\u9808\u70BA ${issue.divisor} \u7684\u500D\u6578`;
          case "unrecognized_keys":
            return `\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C${issue.keys.length > 1 ? "\u5011" : ""}\uFF1A${util.joinValues(issue.keys, "\u3001")}`;
          case "invalid_key":
            return `${issue.origin} \u4E2D\u6709\u7121\u6548\u7684\u9375\u503C`;
          case "invalid_union":
            return "\u7121\u6548\u7684\u8F38\u5165\u503C";
          case "invalid_element":
            return `${issue.origin} \u4E2D\u6709\u7121\u6548\u7684\u503C`;
          default:
            return `\u7121\u6548\u7684\u8F38\u5165\u503C`;
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/yo.cjs
var require_yo = __commonJS({
  "node_modules/zod/v4/locales/yo.cjs"(exports, module) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    var util = __importStar(require_util());
    var error = () => {
      const Sizable = {
        string: { unit: "\xE0mi", verb: "n\xED" },
        file: { unit: "bytes", verb: "n\xED" },
        array: { unit: "nkan", verb: "n\xED" },
        set: { unit: "nkan", verb: "n\xED" }
      };
      function getSizing(origin) {
        return Sizable[origin] ?? null;
      }
      const FormatDictionary = {
        regex: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
        email: "\xE0d\xEDr\u1EB9\u0301s\xEC \xECm\u1EB9\u0301l\xEC",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "\xE0k\xF3k\xF2 ISO",
        date: "\u1ECDj\u1ECD\u0301 ISO",
        time: "\xE0k\xF3k\xF2 ISO",
        duration: "\xE0k\xF3k\xF2 t\xF3 p\xE9 ISO",
        ipv4: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv4",
        ipv6: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv6",
        cidrv4: "\xE0gb\xE8gb\xE8 IPv4",
        cidrv6: "\xE0gb\xE8gb\xE8 IPv6",
        base64: "\u1ECD\u0300r\u1ECD\u0300 t\xED a k\u1ECD\u0301 n\xED base64",
        base64url: "\u1ECD\u0300r\u1ECD\u0300 base64url",
        json_string: "\u1ECD\u0300r\u1ECD\u0300 JSON",
        e164: "n\u1ECD\u0301mb\xE0 E.164",
        jwt: "JWT",
        template_literal: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9"
      };
      const TypeDictionary = {
        nan: "NaN",
        number: "n\u1ECD\u0301mb\xE0",
        array: "akop\u1ECD"
      };
      return (issue) => {
        switch (issue.code) {
          case "invalid_type": {
            const expected = TypeDictionary[issue.expected] ?? issue.expected;
            const receivedType = util.parsedType(issue.input);
            const received = TypeDictionary[receivedType] ?? receivedType;
            if (/^[A-Z]/.test(issue.expected)) {
              return `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi instanceof ${issue.expected}, \xE0m\u1ECD\u0300 a r\xED ${received}`;
            }
            return `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${expected}, \xE0m\u1ECD\u0300 a r\xED ${received}`;
          }
          case "invalid_value":
            if (issue.values.length === 1)
              return `\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ${util.stringifyPrimitive(issue.values[0])}`;
            return `\xC0\u1E63\xE0y\xE0n a\u1E63\xEC\u1E63e: yan \u1ECD\u0300kan l\xE1ra ${util.joinValues(issue.values, "|")}`;
          case "too_big": {
            const adj = issue.inclusive ? "<=" : "<";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${issue.origin ?? "iye"} ${sizing.verb} ${adj}${issue.maximum} ${sizing.unit}`;
            return `T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 ${adj}${issue.maximum}`;
          }
          case "too_small": {
            const adj = issue.inclusive ? ">=" : ">";
            const sizing = getSizing(issue.origin);
            if (sizing)
              return `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 ${issue.origin} ${sizing.verb} ${adj}${issue.minimum} ${sizing.unit}`;
            return `K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 ${adj}${issue.minimum}`;
          }
          case "invalid_format": {
            const _issue = issue;
            if (_issue.format === "starts_with")
              return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\u1EB9\u0300r\u1EB9\u0300 p\u1EB9\u0300l\xFA "${_issue.prefix}"`;
            if (_issue.format === "ends_with")
              return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 par\xED p\u1EB9\u0300l\xFA "${_issue.suffix}"`;
            if (_issue.format === "includes")
              return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 n\xED "${_issue.includes}"`;
            if (_issue.format === "regex")
              return `\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\xE1 \xE0p\u1EB9\u1EB9r\u1EB9 mu ${_issue.pattern}`;
            return `A\u1E63\xEC\u1E63e: ${FormatDictionary[_issue.format] ?? issue.format}`;
          }
          case "not_multiple_of":
            return `N\u1ECD\u0301mb\xE0 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 j\u1EB9\u0301 \xE8y\xE0 p\xEDp\xEDn ti ${issue.divisor}`;
          case "unrecognized_keys":
            return `B\u1ECDt\xECn\xEC \xE0\xECm\u1ECD\u0300: ${util.joinValues(issue.keys, ", ")}`;
          case "invalid_key":
            return `B\u1ECDt\xECn\xEC a\u1E63\xEC\u1E63e n\xEDn\xFA ${issue.origin}`;
          case "invalid_union":
            return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
          case "invalid_element":
            return `Iye a\u1E63\xEC\u1E63e n\xEDn\xFA ${issue.origin}`;
          default:
            return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
        }
      };
    };
    function default_1() {
      return {
        localeError: error()
      };
    }
    module.exports = exports.default;
  }
});

// node_modules/zod/v4/locales/index.cjs
var require_locales = __commonJS({
  "node_modules/zod/v4/locales/index.cjs"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.zhCN = exports.vi = exports.uz = exports.ur = exports.uk = exports.ua = exports.tr = exports.th = exports.ta = exports.sv = exports.sl = exports.ru = exports.ro = exports.pt = exports.pl = exports.ps = exports.ota = exports.no = exports.nl = exports.ms = exports.mk = exports.lt = exports.ko = exports.km = exports.kh = exports.ka = exports.ja = exports.it = exports.is = exports.id = exports.hy = exports.hu = exports.hr = exports.he = exports.frCA = exports.fr = exports.fi = exports.fa = exports.es = exports.eo = exports.en = exports.el = exports.de = exports.da = exports.cs = exports.ca = exports.bg = exports.be = exports.az = exports.ar = void 0;
    exports.yo = exports.zhTW = void 0;
    var ar_js_1 = require_ar();
    Object.defineProperty(exports, "ar", { enumerable: true, get: function() {
      return __importDefault(ar_js_1).default;
    } });
    var az_js_1 = require_az();
    Object.defineProperty(exports, "az", { enumerable: true, get: function() {
      return __importDefault(az_js_1).default;
    } });
    var be_js_1 = require_be();
    Object.defineProperty(exports, "be", { enumerable: true, get: function() {
      return __importDefault(be_js_1).default;
    } });
    var bg_js_1 = require_bg();
    Object.defineProperty(exports, "bg", { enumerable: true, get: function() {
      return __importDefault(bg_js_1).default;
    } });
    var ca_js_1 = require_ca();
    Object.defineProperty(exports, "ca", { enumerable: true, get: function() {
      return __importDefault(ca_js_1).default;
    } });
    var cs_js_1 = require_cs();
    Object.defineProperty(exports, "cs", { enumerable: true, get: function() {
      return __importDefault(cs_js_1).default;
    } });
    var da_js_1 = require_da();
    Object.defineProperty(exports, "da", { enumerable: true, get: function() {
      return __importDefault(da_js_1).default;
    } });
    var de_js_1 = require_de();
    Object.defineProperty(exports, "de", { enumerable: true, get: function() {
      return __importDefault(de_js_1).default;
    } });
    var el_js_1 = require_el();
    Object.defineProperty(exports, "el", { enumerable: true, get: function() {
      return __importDefault(el_js_1).default;
    } });
    var en_js_1 = require_en();
    Object.defineProperty(exports, "en", { enumerable: true, get: function() {
      return __importDefault(en_js_1).default;
    } });
    var eo_js_1 = require_eo();
    Object.defineProperty(exports, "eo", { enumerable: true, get: function() {
      return __importDefault(eo_js_1).default;
    } });
    var es_js_1 = require_es();
    Object.defineProperty(exports, "es", { enumerable: true, get: function() {
      return __importDefault(es_js_1).default;
    } });
    var fa_js_1 = require_fa();
    Object.defineProperty(exports, "fa", { enumerable: true, get: function() {
      return __importDefault(fa_js_1).default;
    } });
    var fi_js_1 = require_fi();
    Object.defineProperty(exports, "fi", { enumerable: true, get: function() {
      return __importDefault(fi_js_1).default;
    } });
    var fr_js_1 = require_fr();
    Object.defineProperty(exports, "fr", { enumerable: true, get: function() {
      return __importDefault(fr_js_1).default;
    } });
    var fr_CA_js_1 = require_fr_CA();
    Object.defineProperty(exports, "frCA", { enumerable: true, get: function() {
      return __importDefault(fr_CA_js_1).default;
    } });
    var he_js_1 = require_he();
    Object.defineProperty(exports, "he", { enumerable: true, get: function() {
      return __importDefault(he_js_1).default;
    } });
    var hr_js_1 = require_hr();
    Object.defineProperty(exports, "hr", { enumerable: true, get: function() {
      return __importDefault(hr_js_1).default;
    } });
    var hu_js_1 = require_hu();
    Object.defineProperty(exports, "hu", { enumerable: true, get: function() {
      return __importDefault(hu_js_1).default;
    } });
    var hy_js_1 = require_hy();
    Object.defineProperty(exports, "hy", { enumerable: true, get: function() {
      return __importDefault(hy_js_1).default;
    } });
    var id_js_1 = require_id();
    Object.defineProperty(exports, "id", { enumerable: true, get: function() {
      return __importDefault(id_js_1).default;
    } });
    var is_js_1 = require_is();
    Object.defineProperty(exports, "is", { enumerable: true, get: function() {
      return __importDefault(is_js_1).default;
    } });
    var it_js_1 = require_it();
    Object.defineProperty(exports, "it", { enumerable: true, get: function() {
      return __importDefault(it_js_1).default;
    } });
    var ja_js_1 = require_ja();
    Object.defineProperty(exports, "ja", { enumerable: true, get: function() {
      return __importDefault(ja_js_1).default;
    } });
    var ka_js_1 = require_ka();
    Object.defineProperty(exports, "ka", { enumerable: true, get: function() {
      return __importDefault(ka_js_1).default;
    } });
    var kh_js_1 = require_kh();
    Object.defineProperty(exports, "kh", { enumerable: true, get: function() {
      return __importDefault(kh_js_1).default;
    } });
    var km_js_1 = require_km();
    Object.defineProperty(exports, "km", { enumerable: true, get: function() {
      return __importDefault(km_js_1).default;
    } });
    var ko_js_1 = require_ko();
    Object.defineProperty(exports, "ko", { enumerable: true, get: function() {
      return __importDefault(ko_js_1).default;
    } });
    var lt_js_1 = require_lt();
    Object.defineProperty(exports, "lt", { enumerable: true, get: function() {
      return __importDefault(lt_js_1).default;
    } });
    var mk_js_1 = require_mk();
    Object.defineProperty(exports, "mk", { enumerable: true, get: function() {
      return __importDefault(mk_js_1).default;
    } });
    var ms_js_1 = require_ms();
    Object.defineProperty(exports, "ms", { enumerable: true, get: function() {
      return __importDefault(ms_js_1).default;
    } });
    var nl_js_1 = require_nl();
    Object.defineProperty(exports, "nl", { enumerable: true, get: function() {
      return __importDefault(nl_js_1).default;
    } });
    var no_js_1 = require_no();
    Object.defineProperty(exports, "no", { enumerable: true, get: function() {
      return __importDefault(no_js_1).default;
    } });
    var ota_js_1 = require_ota();
    Object.defineProperty(exports, "ota", { enumerable: true, get: function() {
      return __importDefault(ota_js_1).default;
    } });
    var ps_js_1 = require_ps();
    Object.defineProperty(exports, "ps", { enumerable: true, get: function() {
      return __importDefault(ps_js_1).default;
    } });
    var pl_js_1 = require_pl();
    Object.defineProperty(exports, "pl", { enumerable: true, get: function() {
      return __importDefault(pl_js_1).default;
    } });
    var pt_js_1 = require_pt();
    Object.defineProperty(exports, "pt", { enumerable: true, get: function() {
      return __importDefault(pt_js_1).default;
    } });
    var ro_js_1 = require_ro();
    Object.defineProperty(exports, "ro", { enumerable: true, get: function() {
      return __importDefault(ro_js_1).default;
    } });
    var ru_js_1 = require_ru();
    Object.defineProperty(exports, "ru", { enumerable: true, get: function() {
      return __importDefault(ru_js_1).default;
    } });
    var sl_js_1 = require_sl();
    Object.defineProperty(exports, "sl", { enumerable: true, get: function() {
      return __importDefault(sl_js_1).default;
    } });
    var sv_js_1 = require_sv();
    Object.defineProperty(exports, "sv", { enumerable: true, get: function() {
      return __importDefault(sv_js_1).default;
    } });
    var ta_js_1 = require_ta();
    Object.defineProperty(exports, "ta", { enumerable: true, get: function() {
      return __importDefault(ta_js_1).default;
    } });
    var th_js_1 = require_th();
    Object.defineProperty(exports, "th", { enumerable: true, get: function() {
      return __importDefault(th_js_1).default;
    } });
    var tr_js_1 = require_tr();
    Object.defineProperty(exports, "tr", { enumerable: true, get: function() {
      return __importDefault(tr_js_1).default;
    } });
    var ua_js_1 = require_ua();
    Object.defineProperty(exports, "ua", { enumerable: true, get: function() {
      return __importDefault(ua_js_1).default;
    } });
    var uk_js_1 = require_uk();
    Object.defineProperty(exports, "uk", { enumerable: true, get: function() {
      return __importDefault(uk_js_1).default;
    } });
    var ur_js_1 = require_ur();
    Object.defineProperty(exports, "ur", { enumerable: true, get: function() {
      return __importDefault(ur_js_1).default;
    } });
    var uz_js_1 = require_uz();
    Object.defineProperty(exports, "uz", { enumerable: true, get: function() {
      return __importDefault(uz_js_1).default;
    } });
    var vi_js_1 = require_vi();
    Object.defineProperty(exports, "vi", { enumerable: true, get: function() {
      return __importDefault(vi_js_1).default;
    } });
    var zh_CN_js_1 = require_zh_CN();
    Object.defineProperty(exports, "zhCN", { enumerable: true, get: function() {
      return __importDefault(zh_CN_js_1).default;
    } });
    var zh_TW_js_1 = require_zh_TW();
    Object.defineProperty(exports, "zhTW", { enumerable: true, get: function() {
      return __importDefault(zh_TW_js_1).default;
    } });
    var yo_js_1 = require_yo();
    Object.defineProperty(exports, "yo", { enumerable: true, get: function() {
      return __importDefault(yo_js_1).default;
    } });
  }
});

// node_modules/zod/v4/core/registries.cjs
var require_registries = __commonJS({
  "node_modules/zod/v4/core/registries.cjs"(exports) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.globalRegistry = exports.$ZodRegistry = exports.$input = exports.$output = void 0;
    exports.registry = registry;
    exports.$output = /* @__PURE__ */ Symbol("ZodOutput");
    exports.$input = /* @__PURE__ */ Symbol("ZodInput");
    var $ZodRegistry = class {
      constructor() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._idmap = /* @__PURE__ */ new Map();
      }
      add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) {
          this._idmap.set(meta.id, schema);
        }
        return this;
      }
      clear() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._idmap = /* @__PURE__ */ new Map();
        return this;
      }
      remove(schema) {
        const meta = this._map.get(schema);
        if (meta && typeof meta === "object" && "id" in meta) {
          this._idmap.delete(meta.id);
        }
        this._map.delete(schema);
        return this;
      }
      get(schema) {
        const p = schema._zod.parent;
        if (p) {
          const pm = { ...this.get(p) ?? {} };
          delete pm.id;
          const f = { ...pm, ...this._map.get(schema) };
          return Object.keys(f).length ? f : void 0;
        }
        return this._map.get(schema);
      }
      has(schema) {
        return this._map.has(schema);
      }
    };
    exports.$ZodRegistry = $ZodRegistry;
    function registry() {
      return new $ZodRegistry();
    }
    (_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
    exports.globalRegistry = globalThis.__zod_globalRegistry;
  }
});

// node_modules/zod/v4/core/api.cjs
var require_api = __commonJS({
  "node_modules/zod/v4/core/api.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TimePrecision = void 0;
    exports._string = _string;
    exports._coercedString = _coercedString;
    exports._email = _email;
    exports._guid = _guid;
    exports._uuid = _uuid;
    exports._uuidv4 = _uuidv4;
    exports._uuidv6 = _uuidv6;
    exports._uuidv7 = _uuidv7;
    exports._url = _url;
    exports._emoji = _emoji;
    exports._nanoid = _nanoid;
    exports._cuid = _cuid;
    exports._cuid2 = _cuid2;
    exports._ulid = _ulid;
    exports._xid = _xid;
    exports._ksuid = _ksuid;
    exports._ipv4 = _ipv4;
    exports._ipv6 = _ipv6;
    exports._mac = _mac;
    exports._cidrv4 = _cidrv4;
    exports._cidrv6 = _cidrv6;
    exports._base64 = _base64;
    exports._base64url = _base64url;
    exports._e164 = _e164;
    exports._jwt = _jwt;
    exports._isoDateTime = _isoDateTime;
    exports._isoDate = _isoDate;
    exports._isoTime = _isoTime;
    exports._isoDuration = _isoDuration;
    exports._number = _number;
    exports._coercedNumber = _coercedNumber;
    exports._int = _int;
    exports._float32 = _float32;
    exports._float64 = _float64;
    exports._int32 = _int32;
    exports._uint32 = _uint32;
    exports._boolean = _boolean;
    exports._coercedBoolean = _coercedBoolean;
    exports._bigint = _bigint;
    exports._coercedBigint = _coercedBigint;
    exports._int64 = _int64;
    exports._uint64 = _uint64;
    exports._symbol = _symbol;
    exports._undefined = _undefined;
    exports._null = _null;
    exports._any = _any;
    exports._unknown = _unknown;
    exports._never = _never;
    exports._void = _void;
    exports._date = _date;
    exports._coercedDate = _coercedDate;
    exports._nan = _nan;
    exports._lt = _lt;
    exports._lte = _lte;
    exports._max = _lte;
    exports._lte = _lte;
    exports._max = _lte;
    exports._gt = _gt;
    exports._gte = _gte;
    exports._min = _gte;
    exports._gte = _gte;
    exports._min = _gte;
    exports._positive = _positive;
    exports._negative = _negative;
    exports._nonpositive = _nonpositive;
    exports._nonnegative = _nonnegative;
    exports._multipleOf = _multipleOf;
    exports._maxSize = _maxSize;
    exports._minSize = _minSize;
    exports._size = _size;
    exports._maxLength = _maxLength;
    exports._minLength = _minLength;
    exports._length = _length;
    exports._regex = _regex;
    exports._lowercase = _lowercase;
    exports._uppercase = _uppercase;
    exports._includes = _includes;
    exports._startsWith = _startsWith;
    exports._endsWith = _endsWith;
    exports._property = _property;
    exports._mime = _mime;
    exports._overwrite = _overwrite;
    exports._normalize = _normalize;
    exports._trim = _trim;
    exports._toLowerCase = _toLowerCase;
    exports._toUpperCase = _toUpperCase;
    exports._slugify = _slugify;
    exports._array = _array;
    exports._union = _union;
    exports._xor = _xor;
    exports._discriminatedUnion = _discriminatedUnion;
    exports._intersection = _intersection;
    exports._tuple = _tuple;
    exports._record = _record;
    exports._map = _map;
    exports._set = _set;
    exports._enum = _enum;
    exports._nativeEnum = _nativeEnum;
    exports._literal = _literal;
    exports._file = _file;
    exports._transform = _transform;
    exports._optional = _optional;
    exports._nullable = _nullable;
    exports._default = _default;
    exports._nonoptional = _nonoptional;
    exports._success = _success;
    exports._catch = _catch;
    exports._pipe = _pipe;
    exports._readonly = _readonly;
    exports._templateLiteral = _templateLiteral;
    exports._lazy = _lazy;
    exports._promise = _promise;
    exports._custom = _custom;
    exports._refine = _refine;
    exports._superRefine = _superRefine;
    exports._check = _check;
    exports.describe = describe;
    exports.meta = meta;
    exports._stringbool = _stringbool;
    exports._stringFormat = _stringFormat;
    var checks = __importStar(require_checks());
    var registries = __importStar(require_registries());
    var schemas = __importStar(require_schemas());
    var util = __importStar(require_util());
    // @__NO_SIDE_EFFECTS__
    function _string(Class, params) {
      return new Class({
        type: "string",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _coercedString(Class, params) {
      return new Class({
        type: "string",
        coerce: true,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _email(Class, params) {
      return new Class({
        type: "string",
        format: "email",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _guid(Class, params) {
      return new Class({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _uuid(Class, params) {
      return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _uuidv4(Class, params) {
      return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v4",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _uuidv6(Class, params) {
      return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v6",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _uuidv7(Class, params) {
      return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v7",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _url(Class, params) {
      return new Class({
        type: "string",
        format: "url",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _emoji(Class, params) {
      return new Class({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _nanoid(Class, params) {
      return new Class({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _cuid(Class, params) {
      return new Class({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _cuid2(Class, params) {
      return new Class({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _ulid(Class, params) {
      return new Class({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _xid(Class, params) {
      return new Class({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _ksuid(Class, params) {
      return new Class({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _ipv4(Class, params) {
      return new Class({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _ipv6(Class, params) {
      return new Class({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _mac(Class, params) {
      return new Class({
        type: "string",
        format: "mac",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _cidrv4(Class, params) {
      return new Class({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _cidrv6(Class, params) {
      return new Class({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _base64(Class, params) {
      return new Class({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _base64url(Class, params) {
      return new Class({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _e164(Class, params) {
      return new Class({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _jwt(Class, params) {
      return new Class({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: false,
        ...util.normalizeParams(params)
      });
    }
    exports.TimePrecision = {
      Any: null,
      Minute: -1,
      Second: 0,
      Millisecond: 3,
      Microsecond: 6
    };
    // @__NO_SIDE_EFFECTS__
    function _isoDateTime(Class, params) {
      return new Class({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: false,
        local: false,
        precision: null,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _isoDate(Class, params) {
      return new Class({
        type: "string",
        format: "date",
        check: "string_format",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _isoTime(Class, params) {
      return new Class({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _isoDuration(Class, params) {
      return new Class({
        type: "string",
        format: "duration",
        check: "string_format",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _number(Class, params) {
      return new Class({
        type: "number",
        checks: [],
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _coercedNumber(Class, params) {
      return new Class({
        type: "number",
        coerce: true,
        checks: [],
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _int(Class, params) {
      return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "safeint",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _float32(Class, params) {
      return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float32",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _float64(Class, params) {
      return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float64",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _int32(Class, params) {
      return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "int32",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _uint32(Class, params) {
      return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "uint32",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _boolean(Class, params) {
      return new Class({
        type: "boolean",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _coercedBoolean(Class, params) {
      return new Class({
        type: "boolean",
        coerce: true,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _bigint(Class, params) {
      return new Class({
        type: "bigint",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _coercedBigint(Class, params) {
      return new Class({
        type: "bigint",
        coerce: true,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _int64(Class, params) {
      return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "int64",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _uint64(Class, params) {
      return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "uint64",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _symbol(Class, params) {
      return new Class({
        type: "symbol",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _undefined(Class, params) {
      return new Class({
        type: "undefined",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _null(Class, params) {
      return new Class({
        type: "null",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _any(Class) {
      return new Class({
        type: "any"
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _unknown(Class) {
      return new Class({
        type: "unknown"
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _never(Class, params) {
      return new Class({
        type: "never",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _void(Class, params) {
      return new Class({
        type: "void",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _date(Class, params) {
      return new Class({
        type: "date",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _coercedDate(Class, params) {
      return new Class({
        type: "date",
        coerce: true,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _nan(Class, params) {
      return new Class({
        type: "nan",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _lt(value, params) {
      return new checks.$ZodCheckLessThan({
        check: "less_than",
        ...util.normalizeParams(params),
        value,
        inclusive: false
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _lte(value, params) {
      return new checks.$ZodCheckLessThan({
        check: "less_than",
        ...util.normalizeParams(params),
        value,
        inclusive: true
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _gt(value, params) {
      return new checks.$ZodCheckGreaterThan({
        check: "greater_than",
        ...util.normalizeParams(params),
        value,
        inclusive: false
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _gte(value, params) {
      return new checks.$ZodCheckGreaterThan({
        check: "greater_than",
        ...util.normalizeParams(params),
        value,
        inclusive: true
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _positive(params) {
      return /* @__PURE__ */ _gt(0, params);
    }
    // @__NO_SIDE_EFFECTS__
    function _negative(params) {
      return /* @__PURE__ */ _lt(0, params);
    }
    // @__NO_SIDE_EFFECTS__
    function _nonpositive(params) {
      return /* @__PURE__ */ _lte(0, params);
    }
    // @__NO_SIDE_EFFECTS__
    function _nonnegative(params) {
      return /* @__PURE__ */ _gte(0, params);
    }
    // @__NO_SIDE_EFFECTS__
    function _multipleOf(value, params) {
      return new checks.$ZodCheckMultipleOf({
        check: "multiple_of",
        ...util.normalizeParams(params),
        value
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _maxSize(maximum, params) {
      return new checks.$ZodCheckMaxSize({
        check: "max_size",
        ...util.normalizeParams(params),
        maximum
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _minSize(minimum, params) {
      return new checks.$ZodCheckMinSize({
        check: "min_size",
        ...util.normalizeParams(params),
        minimum
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _size(size, params) {
      return new checks.$ZodCheckSizeEquals({
        check: "size_equals",
        ...util.normalizeParams(params),
        size
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _maxLength(maximum, params) {
      const ch = new checks.$ZodCheckMaxLength({
        check: "max_length",
        ...util.normalizeParams(params),
        maximum
      });
      return ch;
    }
    // @__NO_SIDE_EFFECTS__
    function _minLength(minimum, params) {
      return new checks.$ZodCheckMinLength({
        check: "min_length",
        ...util.normalizeParams(params),
        minimum
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _length(length, params) {
      return new checks.$ZodCheckLengthEquals({
        check: "length_equals",
        ...util.normalizeParams(params),
        length
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _regex(pattern, params) {
      return new checks.$ZodCheckRegex({
        check: "string_format",
        format: "regex",
        ...util.normalizeParams(params),
        pattern
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _lowercase(params) {
      return new checks.$ZodCheckLowerCase({
        check: "string_format",
        format: "lowercase",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _uppercase(params) {
      return new checks.$ZodCheckUpperCase({
        check: "string_format",
        format: "uppercase",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _includes(includes, params) {
      return new checks.$ZodCheckIncludes({
        check: "string_format",
        format: "includes",
        ...util.normalizeParams(params),
        includes
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _startsWith(prefix, params) {
      return new checks.$ZodCheckStartsWith({
        check: "string_format",
        format: "starts_with",
        ...util.normalizeParams(params),
        prefix
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _endsWith(suffix, params) {
      return new checks.$ZodCheckEndsWith({
        check: "string_format",
        format: "ends_with",
        ...util.normalizeParams(params),
        suffix
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _property(property, schema, params) {
      return new checks.$ZodCheckProperty({
        check: "property",
        property,
        schema,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _mime(types, params) {
      return new checks.$ZodCheckMimeType({
        check: "mime_type",
        mime: types,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _overwrite(tx) {
      return new checks.$ZodCheckOverwrite({
        check: "overwrite",
        tx
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _normalize(form) {
      return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
    }
    // @__NO_SIDE_EFFECTS__
    function _trim() {
      return /* @__PURE__ */ _overwrite((input) => input.trim());
    }
    // @__NO_SIDE_EFFECTS__
    function _toLowerCase() {
      return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
    }
    // @__NO_SIDE_EFFECTS__
    function _toUpperCase() {
      return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
    }
    // @__NO_SIDE_EFFECTS__
    function _slugify() {
      return /* @__PURE__ */ _overwrite((input) => util.slugify(input));
    }
    // @__NO_SIDE_EFFECTS__
    function _array(Class, element, params) {
      return new Class({
        type: "array",
        element,
        // get element() {
        //   return element;
        // },
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _union(Class, options, params) {
      return new Class({
        type: "union",
        options,
        ...util.normalizeParams(params)
      });
    }
    function _xor(Class, options, params) {
      return new Class({
        type: "union",
        options,
        inclusive: false,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _discriminatedUnion(Class, discriminator, options, params) {
      return new Class({
        type: "union",
        options,
        discriminator,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _intersection(Class, left, right) {
      return new Class({
        type: "intersection",
        left,
        right
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _tuple(Class, items, _paramsOrRest, _params) {
      const hasRest = _paramsOrRest instanceof schemas.$ZodType;
      const params = hasRest ? _params : _paramsOrRest;
      const rest = hasRest ? _paramsOrRest : null;
      return new Class({
        type: "tuple",
        items,
        rest,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _record(Class, keyType, valueType, params) {
      return new Class({
        type: "record",
        keyType,
        valueType,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _map(Class, keyType, valueType, params) {
      return new Class({
        type: "map",
        keyType,
        valueType,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _set(Class, valueType, params) {
      return new Class({
        type: "set",
        valueType,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _enum(Class, values, params) {
      const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
      return new Class({
        type: "enum",
        entries,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _nativeEnum(Class, entries, params) {
      return new Class({
        type: "enum",
        entries,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _literal(Class, value, params) {
      return new Class({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _file(Class, params) {
      return new Class({
        type: "file",
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _transform(Class, fn) {
      return new Class({
        type: "transform",
        transform: fn
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _optional(Class, innerType) {
      return new Class({
        type: "optional",
        innerType
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _nullable(Class, innerType) {
      return new Class({
        type: "nullable",
        innerType
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _default(Class, innerType, defaultValue) {
      return new Class({
        type: "default",
        innerType,
        get defaultValue() {
          return typeof defaultValue === "function" ? defaultValue() : util.shallowClone(defaultValue);
        }
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _nonoptional(Class, innerType, params) {
      return new Class({
        type: "nonoptional",
        innerType,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _success(Class, innerType) {
      return new Class({
        type: "success",
        innerType
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _catch(Class, innerType, catchValue) {
      return new Class({
        type: "catch",
        innerType,
        catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _pipe(Class, in_, out) {
      return new Class({
        type: "pipe",
        in: in_,
        out
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _readonly(Class, innerType) {
      return new Class({
        type: "readonly",
        innerType
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _templateLiteral(Class, parts, params) {
      return new Class({
        type: "template_literal",
        parts,
        ...util.normalizeParams(params)
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _lazy(Class, getter) {
      return new Class({
        type: "lazy",
        getter
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _promise(Class, innerType) {
      return new Class({
        type: "promise",
        innerType
      });
    }
    // @__NO_SIDE_EFFECTS__
    function _custom(Class, fn, _params) {
      const norm = util.normalizeParams(_params);
      norm.abort ?? (norm.abort = true);
      const schema = new Class({
        type: "custom",
        check: "custom",
        fn,
        ...norm
      });
      return schema;
    }
    // @__NO_SIDE_EFFECTS__
    function _refine(Class, fn, _params) {
      const schema = new Class({
        type: "custom",
        check: "custom",
        fn,
        ...util.normalizeParams(_params)
      });
      return schema;
    }
    // @__NO_SIDE_EFFECTS__
    function _superRefine(fn, params) {
      const ch = /* @__PURE__ */ _check((payload) => {
        payload.addIssue = (issue) => {
          if (typeof issue === "string") {
            payload.issues.push(util.issue(issue, payload.value, ch._zod.def));
          } else {
            const _issue = issue;
            if (_issue.fatal)
              _issue.continue = false;
            _issue.code ?? (_issue.code = "custom");
            _issue.input ?? (_issue.input = payload.value);
            _issue.inst ?? (_issue.inst = ch);
            _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
            payload.issues.push(util.issue(_issue));
          }
        };
        return fn(payload.value, payload);
      }, params);
      return ch;
    }
    // @__NO_SIDE_EFFECTS__
    function _check(fn, params) {
      const ch = new checks.$ZodCheck({
        check: "custom",
        ...util.normalizeParams(params)
      });
      ch._zod.check = fn;
      return ch;
    }
    // @__NO_SIDE_EFFECTS__
    function describe(description) {
      const ch = new checks.$ZodCheck({ check: "describe" });
      ch._zod.onattach = [
        (inst) => {
          const existing = registries.globalRegistry.get(inst) ?? {};
          registries.globalRegistry.add(inst, { ...existing, description });
        }
      ];
      ch._zod.check = () => {
      };
      return ch;
    }
    // @__NO_SIDE_EFFECTS__
    function meta(metadata) {
      const ch = new checks.$ZodCheck({ check: "meta" });
      ch._zod.onattach = [
        (inst) => {
          const existing = registries.globalRegistry.get(inst) ?? {};
          registries.globalRegistry.add(inst, { ...existing, ...metadata });
        }
      ];
      ch._zod.check = () => {
      };
      return ch;
    }
    // @__NO_SIDE_EFFECTS__
    function _stringbool(Classes, _params) {
      const params = util.normalizeParams(_params);
      let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
      let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
      if (params.case !== "sensitive") {
        truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
        falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
      }
      const truthySet = new Set(truthyArray);
      const falsySet = new Set(falsyArray);
      const _Codec = Classes.Codec ?? schemas.$ZodCodec;
      const _Boolean = Classes.Boolean ?? schemas.$ZodBoolean;
      const _String = Classes.String ?? schemas.$ZodString;
      const stringSchema = new _String({ type: "string", error: params.error });
      const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
      const codec2 = new _Codec({
        type: "pipe",
        in: stringSchema,
        out: booleanSchema,
        transform: ((input, payload) => {
          let data = input;
          if (params.case !== "sensitive")
            data = data.toLowerCase();
          if (truthySet.has(data)) {
            return true;
          } else if (falsySet.has(data)) {
            return false;
          } else {
            payload.issues.push({
              code: "invalid_value",
              expected: "stringbool",
              values: [...truthySet, ...falsySet],
              input: payload.value,
              inst: codec2,
              continue: false
            });
            return {};
          }
        }),
        reverseTransform: ((input, _payload) => {
          if (input === true) {
            return truthyArray[0] || "true";
          } else {
            return falsyArray[0] || "false";
          }
        }),
        error: params.error
      });
      return codec2;
    }
    // @__NO_SIDE_EFFECTS__
    function _stringFormat(Class, format, fnOrRegex, _params = {}) {
      const params = util.normalizeParams(_params);
      const def = {
        ...util.normalizeParams(_params),
        check: "string_format",
        type: "string",
        format,
        fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
        ...params
      };
      if (fnOrRegex instanceof RegExp) {
        def.pattern = fnOrRegex;
      }
      const inst = new Class(def);
      return inst;
    }
  }
});

// node_modules/zod/v4/core/to-json-schema.cjs
var require_to_json_schema = __commonJS({
  "node_modules/zod/v4/core/to-json-schema.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createStandardJSONSchemaMethod = exports.createToJSONSchemaMethod = void 0;
    exports.initializeContext = initializeContext;
    exports.process = process;
    exports.extractDefs = extractDefs;
    exports.finalize = finalize;
    var registries_js_1 = require_registries();
    function initializeContext(params) {
      let target = params?.target ?? "draft-2020-12";
      if (target === "draft-4")
        target = "draft-04";
      if (target === "draft-7")
        target = "draft-07";
      return {
        processors: params.processors ?? {},
        metadataRegistry: params?.metadata ?? registries_js_1.globalRegistry,
        target,
        unrepresentable: params?.unrepresentable ?? "throw",
        override: params?.override ?? (() => {
        }),
        io: params?.io ?? "output",
        counter: 0,
        seen: /* @__PURE__ */ new Map(),
        cycles: params?.cycles ?? "ref",
        reused: params?.reused ?? "inline",
        external: params?.external ?? void 0
      };
    }
    function process(schema, ctx, _params = { path: [], schemaPath: [] }) {
      var _a;
      const def = schema._zod.def;
      const seen = ctx.seen.get(schema);
      if (seen) {
        seen.count++;
        const isCycle = _params.schemaPath.includes(schema);
        if (isCycle) {
          seen.cycle = _params.path;
        }
        return seen.schema;
      }
      const result2 = { schema: {}, count: 1, cycle: void 0, path: _params.path };
      ctx.seen.set(schema, result2);
      const overrideSchema = schema._zod.toJSONSchema?.();
      if (overrideSchema) {
        result2.schema = overrideSchema;
      } else {
        const params = {
          ..._params,
          schemaPath: [..._params.schemaPath, schema],
          path: _params.path
        };
        if (schema._zod.processJSONSchema) {
          schema._zod.processJSONSchema(ctx, result2.schema, params);
        } else {
          const _json = result2.schema;
          const processor = ctx.processors[def.type];
          if (!processor) {
            throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
          }
          processor(schema, ctx, _json, params);
        }
        const parent = schema._zod.parent;
        if (parent) {
          if (!result2.ref)
            result2.ref = parent;
          process(parent, ctx, params);
          ctx.seen.get(parent).isParent = true;
        }
      }
      const meta = ctx.metadataRegistry.get(schema);
      if (meta)
        Object.assign(result2.schema, meta);
      if (ctx.io === "input" && isTransforming(schema)) {
        delete result2.schema.examples;
        delete result2.schema.default;
      }
      if (ctx.io === "input" && "_prefault" in result2.schema)
        (_a = result2.schema).default ?? (_a.default = result2.schema._prefault);
      delete result2.schema._prefault;
      const _result = ctx.seen.get(schema);
      return _result.schema;
    }
    function extractDefs(ctx, schema) {
      const root = ctx.seen.get(schema);
      if (!root)
        throw new Error("Unprocessed schema. This is a bug in Zod.");
      const idToSchema = /* @__PURE__ */ new Map();
      for (const entry of ctx.seen.entries()) {
        const id = ctx.metadataRegistry.get(entry[0])?.id;
        if (id) {
          const existing = idToSchema.get(id);
          if (existing && existing !== entry[0]) {
            throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
          }
          idToSchema.set(id, entry[0]);
        }
      }
      const makeURI = (entry) => {
        const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
        if (ctx.external) {
          const externalId = ctx.external.registry.get(entry[0])?.id;
          const uriGenerator = ctx.external.uri ?? ((id2) => id2);
          if (externalId) {
            return { ref: uriGenerator(externalId) };
          }
          const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
          entry[1].defId = id;
          return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
        }
        if (entry[1] === root) {
          return { ref: "#" };
        }
        const uriPrefix = `#`;
        const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
        const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
        return { defId, ref: defUriPrefix + defId };
      };
      const extractToDef = (entry) => {
        if (entry[1].schema.$ref) {
          return;
        }
        const seen = entry[1];
        const { ref, defId } = makeURI(entry);
        seen.def = { ...seen.schema };
        if (defId)
          seen.defId = defId;
        const schema2 = seen.schema;
        for (const key in schema2) {
          delete schema2[key];
        }
        schema2.$ref = ref;
      };
      if (ctx.cycles === "throw") {
        for (const entry of ctx.seen.entries()) {
          const seen = entry[1];
          if (seen.cycle) {
            throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
          }
        }
      }
      for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        if (schema === entry[0]) {
          extractToDef(entry);
          continue;
        }
        if (ctx.external) {
          const ext = ctx.external.registry.get(entry[0])?.id;
          if (schema !== entry[0] && ext) {
            extractToDef(entry);
            continue;
          }
        }
        const id = ctx.metadataRegistry.get(entry[0])?.id;
        if (id) {
          extractToDef(entry);
          continue;
        }
        if (seen.cycle) {
          extractToDef(entry);
          continue;
        }
        if (seen.count > 1) {
          if (ctx.reused === "ref") {
            extractToDef(entry);
            continue;
          }
        }
      }
    }
    function finalize(ctx, schema) {
      const root = ctx.seen.get(schema);
      if (!root)
        throw new Error("Unprocessed schema. This is a bug in Zod.");
      const flattenRef = (zodSchema) => {
        const seen = ctx.seen.get(zodSchema);
        if (seen.ref === null)
          return;
        const schema2 = seen.def ?? seen.schema;
        const _cached = { ...schema2 };
        const ref = seen.ref;
        seen.ref = null;
        if (ref) {
          flattenRef(ref);
          const refSeen = ctx.seen.get(ref);
          const refSchema = refSeen.schema;
          if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
            schema2.allOf = schema2.allOf ?? [];
            schema2.allOf.push(refSchema);
          } else {
            Object.assign(schema2, refSchema);
          }
          Object.assign(schema2, _cached);
          const isParentRef = zodSchema._zod.parent === ref;
          if (isParentRef) {
            for (const key in schema2) {
              if (key === "$ref" || key === "allOf")
                continue;
              if (!(key in _cached)) {
                delete schema2[key];
              }
            }
          }
          if (refSchema.$ref && refSeen.def) {
            for (const key in schema2) {
              if (key === "$ref" || key === "allOf")
                continue;
              if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
                delete schema2[key];
              }
            }
          }
        }
        const parent = zodSchema._zod.parent;
        if (parent && parent !== ref) {
          flattenRef(parent);
          const parentSeen = ctx.seen.get(parent);
          if (parentSeen?.schema.$ref) {
            schema2.$ref = parentSeen.schema.$ref;
            if (parentSeen.def) {
              for (const key in schema2) {
                if (key === "$ref" || key === "allOf")
                  continue;
                if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
                  delete schema2[key];
                }
              }
            }
          }
        }
        ctx.override({
          zodSchema,
          jsonSchema: schema2,
          path: seen.path ?? []
        });
      };
      for (const entry of [...ctx.seen.entries()].reverse()) {
        flattenRef(entry[0]);
      }
      const result2 = {};
      if (ctx.target === "draft-2020-12") {
        result2.$schema = "https://json-schema.org/draft/2020-12/schema";
      } else if (ctx.target === "draft-07") {
        result2.$schema = "http://json-schema.org/draft-07/schema#";
      } else if (ctx.target === "draft-04") {
        result2.$schema = "http://json-schema.org/draft-04/schema#";
      } else if (ctx.target === "openapi-3.0") {
      } else {
      }
      if (ctx.external?.uri) {
        const id = ctx.external.registry.get(schema)?.id;
        if (!id)
          throw new Error("Schema is missing an `id` property");
        result2.$id = ctx.external.uri(id);
      }
      Object.assign(result2, root.def ?? root.schema);
      const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
      if (rootMetaId !== void 0 && result2.id === rootMetaId)
        delete result2.id;
      const defs = ctx.external?.defs ?? {};
      for (const entry of ctx.seen.entries()) {
        const seen = entry[1];
        if (seen.def && seen.defId) {
          if (seen.def.id === seen.defId)
            delete seen.def.id;
          defs[seen.defId] = seen.def;
        }
      }
      if (ctx.external) {
      } else {
        if (Object.keys(defs).length > 0) {
          if (ctx.target === "draft-2020-12") {
            result2.$defs = defs;
          } else {
            result2.definitions = defs;
          }
        }
      }
      try {
        const finalized = JSON.parse(JSON.stringify(result2));
        Object.defineProperty(finalized, "~standard", {
          value: {
            ...schema["~standard"],
            jsonSchema: {
              input: (0, exports.createStandardJSONSchemaMethod)(schema, "input", ctx.processors),
              output: (0, exports.createStandardJSONSchemaMethod)(schema, "output", ctx.processors)
            }
          },
          enumerable: false,
          writable: false
        });
        return finalized;
      } catch (_err) {
        throw new Error("Error converting schema to JSON.");
      }
    }
    function isTransforming(_schema, _ctx) {
      const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
      if (ctx.seen.has(_schema))
        return false;
      ctx.seen.add(_schema);
      const def = _schema._zod.def;
      if (def.type === "transform")
        return true;
      if (def.type === "array")
        return isTransforming(def.element, ctx);
      if (def.type === "set")
        return isTransforming(def.valueType, ctx);
      if (def.type === "lazy")
        return isTransforming(def.getter(), ctx);
      if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
        return isTransforming(def.innerType, ctx);
      }
      if (def.type === "intersection") {
        return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
      }
      if (def.type === "record" || def.type === "map") {
        return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
      }
      if (def.type === "pipe") {
        if (_schema._zod.traits.has("$ZodCodec"))
          return true;
        return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
      }
      if (def.type === "object") {
        for (const key in def.shape) {
          if (isTransforming(def.shape[key], ctx))
            return true;
        }
        return false;
      }
      if (def.type === "union") {
        for (const option of def.options) {
          if (isTransforming(option, ctx))
            return true;
        }
        return false;
      }
      if (def.type === "tuple") {
        for (const item of def.items) {
          if (isTransforming(item, ctx))
            return true;
        }
        if (def.rest && isTransforming(def.rest, ctx))
          return true;
        return false;
      }
      return false;
    }
    var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
      const ctx = initializeContext({ ...params, processors });
      process(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };
    exports.createToJSONSchemaMethod = createToJSONSchemaMethod;
    var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
      const { libraryOptions, target } = params ?? {};
      const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
      process(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };
    exports.createStandardJSONSchemaMethod = createStandardJSONSchemaMethod;
  }
});

// node_modules/zod/v4/core/json-schema-processors.cjs
var require_json_schema_processors = __commonJS({
  "node_modules/zod/v4/core/json-schema-processors.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.allProcessors = exports.lazyProcessor = exports.optionalProcessor = exports.promiseProcessor = exports.readonlyProcessor = exports.pipeProcessor = exports.catchProcessor = exports.prefaultProcessor = exports.defaultProcessor = exports.nonoptionalProcessor = exports.nullableProcessor = exports.recordProcessor = exports.tupleProcessor = exports.intersectionProcessor = exports.unionProcessor = exports.objectProcessor = exports.arrayProcessor = exports.setProcessor = exports.mapProcessor = exports.transformProcessor = exports.functionProcessor = exports.customProcessor = exports.successProcessor = exports.fileProcessor = exports.templateLiteralProcessor = exports.nanProcessor = exports.literalProcessor = exports.enumProcessor = exports.dateProcessor = exports.unknownProcessor = exports.anyProcessor = exports.neverProcessor = exports.voidProcessor = exports.undefinedProcessor = exports.nullProcessor = exports.symbolProcessor = exports.bigintProcessor = exports.booleanProcessor = exports.numberProcessor = exports.stringProcessor = void 0;
    exports.toJSONSchema = toJSONSchema;
    var to_json_schema_js_1 = require_to_json_schema();
    var util_js_1 = require_util();
    var formatMap = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
      // do not set
    };
    var stringProcessor = (schema, ctx, _json, _params) => {
      const json = _json;
      json.type = "string";
      const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
      if (typeof minimum === "number")
        json.minLength = minimum;
      if (typeof maximum === "number")
        json.maxLength = maximum;
      if (format) {
        json.format = formatMap[format] ?? format;
        if (json.format === "")
          delete json.format;
        if (format === "time") {
          delete json.format;
        }
      }
      if (contentEncoding)
        json.contentEncoding = contentEncoding;
      if (patterns && patterns.size > 0) {
        const regexes = [...patterns];
        if (regexes.length === 1)
          json.pattern = regexes[0].source;
        else if (regexes.length > 1) {
          json.allOf = [
            ...regexes.map((regex) => ({
              ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
              pattern: regex.source
            }))
          ];
        }
      }
    };
    exports.stringProcessor = stringProcessor;
    var numberProcessor = (schema, ctx, _json, _params) => {
      const json = _json;
      const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
      if (typeof format === "string" && format.includes("int"))
        json.type = "integer";
      else
        json.type = "number";
      const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
      const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
      const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
      if (exMin) {
        if (legacy) {
          json.minimum = exclusiveMinimum;
          json.exclusiveMinimum = true;
        } else {
          json.exclusiveMinimum = exclusiveMinimum;
        }
      } else if (typeof minimum === "number") {
        json.minimum = minimum;
      }
      if (exMax) {
        if (legacy) {
          json.maximum = exclusiveMaximum;
          json.exclusiveMaximum = true;
        } else {
          json.exclusiveMaximum = exclusiveMaximum;
        }
      } else if (typeof maximum === "number") {
        json.maximum = maximum;
      }
      if (typeof multipleOf === "number")
        json.multipleOf = multipleOf;
    };
    exports.numberProcessor = numberProcessor;
    var booleanProcessor = (_schema, _ctx, json, _params) => {
      json.type = "boolean";
    };
    exports.booleanProcessor = booleanProcessor;
    var bigintProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("BigInt cannot be represented in JSON Schema");
      }
    };
    exports.bigintProcessor = bigintProcessor;
    var symbolProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Symbols cannot be represented in JSON Schema");
      }
    };
    exports.symbolProcessor = symbolProcessor;
    var nullProcessor = (_schema, ctx, json, _params) => {
      if (ctx.target === "openapi-3.0") {
        json.type = "string";
        json.nullable = true;
        json.enum = [null];
      } else {
        json.type = "null";
      }
    };
    exports.nullProcessor = nullProcessor;
    var undefinedProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Undefined cannot be represented in JSON Schema");
      }
    };
    exports.undefinedProcessor = undefinedProcessor;
    var voidProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Void cannot be represented in JSON Schema");
      }
    };
    exports.voidProcessor = voidProcessor;
    var neverProcessor = (_schema, _ctx, json, _params) => {
      json.not = {};
    };
    exports.neverProcessor = neverProcessor;
    var anyProcessor = (_schema, _ctx, _json, _params) => {
    };
    exports.anyProcessor = anyProcessor;
    var unknownProcessor = (_schema, _ctx, _json, _params) => {
    };
    exports.unknownProcessor = unknownProcessor;
    var dateProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Date cannot be represented in JSON Schema");
      }
    };
    exports.dateProcessor = dateProcessor;
    var enumProcessor = (schema, _ctx, json, _params) => {
      const def = schema._zod.def;
      const values = (0, util_js_1.getEnumValues)(def.entries);
      if (values.every((v) => typeof v === "number"))
        json.type = "number";
      if (values.every((v) => typeof v === "string"))
        json.type = "string";
      json.enum = values;
    };
    exports.enumProcessor = enumProcessor;
    var literalProcessor = (schema, ctx, json, _params) => {
      const def = schema._zod.def;
      const vals = [];
      for (const val of def.values) {
        if (val === void 0) {
          if (ctx.unrepresentable === "throw") {
            throw new Error("Literal `undefined` cannot be represented in JSON Schema");
          } else {
          }
        } else if (typeof val === "bigint") {
          if (ctx.unrepresentable === "throw") {
            throw new Error("BigInt literals cannot be represented in JSON Schema");
          } else {
            vals.push(Number(val));
          }
        } else {
          vals.push(val);
        }
      }
      if (vals.length === 0) {
      } else if (vals.length === 1) {
        const val = vals[0];
        json.type = val === null ? "null" : typeof val;
        if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
          json.enum = [val];
        } else {
          json.const = val;
        }
      } else {
        if (vals.every((v) => typeof v === "number"))
          json.type = "number";
        if (vals.every((v) => typeof v === "string"))
          json.type = "string";
        if (vals.every((v) => typeof v === "boolean"))
          json.type = "boolean";
        if (vals.every((v) => v === null))
          json.type = "null";
        json.enum = vals;
      }
    };
    exports.literalProcessor = literalProcessor;
    var nanProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("NaN cannot be represented in JSON Schema");
      }
    };
    exports.nanProcessor = nanProcessor;
    var templateLiteralProcessor = (schema, _ctx, json, _params) => {
      const _json = json;
      const pattern = schema._zod.pattern;
      if (!pattern)
        throw new Error("Pattern not found in template literal");
      _json.type = "string";
      _json.pattern = pattern.source;
    };
    exports.templateLiteralProcessor = templateLiteralProcessor;
    var fileProcessor = (schema, _ctx, json, _params) => {
      const _json = json;
      const file = {
        type: "string",
        format: "binary",
        contentEncoding: "binary"
      };
      const { minimum, maximum, mime } = schema._zod.bag;
      if (minimum !== void 0)
        file.minLength = minimum;
      if (maximum !== void 0)
        file.maxLength = maximum;
      if (mime) {
        if (mime.length === 1) {
          file.contentMediaType = mime[0];
          Object.assign(_json, file);
        } else {
          Object.assign(_json, file);
          _json.anyOf = mime.map((m) => ({ contentMediaType: m }));
        }
      } else {
        Object.assign(_json, file);
      }
    };
    exports.fileProcessor = fileProcessor;
    var successProcessor = (_schema, _ctx, json, _params) => {
      json.type = "boolean";
    };
    exports.successProcessor = successProcessor;
    var customProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Custom types cannot be represented in JSON Schema");
      }
    };
    exports.customProcessor = customProcessor;
    var functionProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Function types cannot be represented in JSON Schema");
      }
    };
    exports.functionProcessor = functionProcessor;
    var transformProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Transforms cannot be represented in JSON Schema");
      }
    };
    exports.transformProcessor = transformProcessor;
    var mapProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Map cannot be represented in JSON Schema");
      }
    };
    exports.mapProcessor = mapProcessor;
    var setProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Set cannot be represented in JSON Schema");
      }
    };
    exports.setProcessor = setProcessor;
    var arrayProcessor = (schema, ctx, _json, params) => {
      const json = _json;
      const def = schema._zod.def;
      const { minimum, maximum } = schema._zod.bag;
      if (typeof minimum === "number")
        json.minItems = minimum;
      if (typeof maximum === "number")
        json.maxItems = maximum;
      json.type = "array";
      json.items = (0, to_json_schema_js_1.process)(def.element, ctx, {
        ...params,
        path: [...params.path, "items"]
      });
    };
    exports.arrayProcessor = arrayProcessor;
    var objectProcessor = (schema, ctx, _json, params) => {
      const json = _json;
      const def = schema._zod.def;
      json.type = "object";
      json.properties = {};
      const shape = def.shape;
      for (const key in shape) {
        json.properties[key] = (0, to_json_schema_js_1.process)(shape[key], ctx, {
          ...params,
          path: [...params.path, "properties", key]
        });
      }
      const allKeys = new Set(Object.keys(shape));
      const requiredKeys = new Set([...allKeys].filter((key) => {
        const v = def.shape[key]._zod;
        if (ctx.io === "input") {
          return v.optin === void 0;
        } else {
          return v.optout === void 0;
        }
      }));
      if (requiredKeys.size > 0) {
        json.required = Array.from(requiredKeys);
      }
      if (def.catchall?._zod.def.type === "never") {
        json.additionalProperties = false;
      } else if (!def.catchall) {
        if (ctx.io === "output")
          json.additionalProperties = false;
      } else if (def.catchall) {
        json.additionalProperties = (0, to_json_schema_js_1.process)(def.catchall, ctx, {
          ...params,
          path: [...params.path, "additionalProperties"]
        });
      }
    };
    exports.objectProcessor = objectProcessor;
    var unionProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const isExclusive = def.inclusive === false;
      const options = def.options.map((x, i) => (0, to_json_schema_js_1.process)(x, ctx, {
        ...params,
        path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
      }));
      if (isExclusive) {
        json.oneOf = options;
      } else {
        json.anyOf = options;
      }
    };
    exports.unionProcessor = unionProcessor;
    var intersectionProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const a = (0, to_json_schema_js_1.process)(def.left, ctx, {
        ...params,
        path: [...params.path, "allOf", 0]
      });
      const b = (0, to_json_schema_js_1.process)(def.right, ctx, {
        ...params,
        path: [...params.path, "allOf", 1]
      });
      const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
      const allOf = [
        ...isSimpleIntersection(a) ? a.allOf : [a],
        ...isSimpleIntersection(b) ? b.allOf : [b]
      ];
      json.allOf = allOf;
    };
    exports.intersectionProcessor = intersectionProcessor;
    var tupleProcessor = (schema, ctx, _json, params) => {
      const json = _json;
      const def = schema._zod.def;
      json.type = "array";
      const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
      const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
      const prefixItems = def.items.map((x, i) => (0, to_json_schema_js_1.process)(x, ctx, {
        ...params,
        path: [...params.path, prefixPath, i]
      }));
      const rest = def.rest ? (0, to_json_schema_js_1.process)(def.rest, ctx, {
        ...params,
        path: [...params.path, restPath, ...ctx.target === "openapi-3.0" ? [def.items.length] : []]
      }) : null;
      if (ctx.target === "draft-2020-12") {
        json.prefixItems = prefixItems;
        if (rest) {
          json.items = rest;
        }
      } else if (ctx.target === "openapi-3.0") {
        json.items = {
          anyOf: prefixItems
        };
        if (rest) {
          json.items.anyOf.push(rest);
        }
        json.minItems = prefixItems.length;
        if (!rest) {
          json.maxItems = prefixItems.length;
        }
      } else {
        json.items = prefixItems;
        if (rest) {
          json.additionalItems = rest;
        }
      }
      const { minimum, maximum } = schema._zod.bag;
      if (typeof minimum === "number")
        json.minItems = minimum;
      if (typeof maximum === "number")
        json.maxItems = maximum;
    };
    exports.tupleProcessor = tupleProcessor;
    var recordProcessor = (schema, ctx, _json, params) => {
      const json = _json;
      const def = schema._zod.def;
      json.type = "object";
      const keyType = def.keyType;
      const keyBag = keyType._zod.bag;
      const patterns = keyBag?.patterns;
      if (def.mode === "loose" && patterns && patterns.size > 0) {
        const valueSchema = (0, to_json_schema_js_1.process)(def.valueType, ctx, {
          ...params,
          path: [...params.path, "patternProperties", "*"]
        });
        json.patternProperties = {};
        for (const pattern of patterns) {
          json.patternProperties[pattern.source] = valueSchema;
        }
      } else {
        if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
          json.propertyNames = (0, to_json_schema_js_1.process)(def.keyType, ctx, {
            ...params,
            path: [...params.path, "propertyNames"]
          });
        }
        json.additionalProperties = (0, to_json_schema_js_1.process)(def.valueType, ctx, {
          ...params,
          path: [...params.path, "additionalProperties"]
        });
      }
      const keyValues = keyType._zod.values;
      if (keyValues) {
        const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
        if (validKeyValues.length > 0) {
          json.required = validKeyValues;
        }
      }
    };
    exports.recordProcessor = recordProcessor;
    var nullableProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const inner = (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      if (ctx.target === "openapi-3.0") {
        seen.ref = def.innerType;
        json.nullable = true;
      } else {
        json.anyOf = [inner, { type: "null" }];
      }
    };
    exports.nullableProcessor = nullableProcessor;
    var nonoptionalProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
    };
    exports.nonoptionalProcessor = nonoptionalProcessor;
    var defaultProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      json.default = JSON.parse(JSON.stringify(def.defaultValue));
    };
    exports.defaultProcessor = defaultProcessor;
    var prefaultProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      if (ctx.io === "input")
        json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
    };
    exports.prefaultProcessor = prefaultProcessor;
    var catchProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      let catchValue;
      try {
        catchValue = def.catchValue(void 0);
      } catch {
        throw new Error("Dynamic catch values are not supported in JSON Schema");
      }
      json.default = catchValue;
    };
    exports.catchProcessor = catchProcessor;
    var pipeProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      const inIsTransform = def.in._zod.traits.has("$ZodTransform");
      const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
      (0, to_json_schema_js_1.process)(innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = innerType;
    };
    exports.pipeProcessor = pipeProcessor;
    var readonlyProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      json.readOnly = true;
    };
    exports.readonlyProcessor = readonlyProcessor;
    var promiseProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
    };
    exports.promiseProcessor = promiseProcessor;
    var optionalProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      (0, to_json_schema_js_1.process)(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
    };
    exports.optionalProcessor = optionalProcessor;
    var lazyProcessor = (schema, ctx, _json, params) => {
      const innerType = schema._zod.innerType;
      (0, to_json_schema_js_1.process)(innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = innerType;
    };
    exports.lazyProcessor = lazyProcessor;
    exports.allProcessors = {
      string: exports.stringProcessor,
      number: exports.numberProcessor,
      boolean: exports.booleanProcessor,
      bigint: exports.bigintProcessor,
      symbol: exports.symbolProcessor,
      null: exports.nullProcessor,
      undefined: exports.undefinedProcessor,
      void: exports.voidProcessor,
      never: exports.neverProcessor,
      any: exports.anyProcessor,
      unknown: exports.unknownProcessor,
      date: exports.dateProcessor,
      enum: exports.enumProcessor,
      literal: exports.literalProcessor,
      nan: exports.nanProcessor,
      template_literal: exports.templateLiteralProcessor,
      file: exports.fileProcessor,
      success: exports.successProcessor,
      custom: exports.customProcessor,
      function: exports.functionProcessor,
      transform: exports.transformProcessor,
      map: exports.mapProcessor,
      set: exports.setProcessor,
      array: exports.arrayProcessor,
      object: exports.objectProcessor,
      union: exports.unionProcessor,
      intersection: exports.intersectionProcessor,
      tuple: exports.tupleProcessor,
      record: exports.recordProcessor,
      nullable: exports.nullableProcessor,
      nonoptional: exports.nonoptionalProcessor,
      default: exports.defaultProcessor,
      prefault: exports.prefaultProcessor,
      catch: exports.catchProcessor,
      pipe: exports.pipeProcessor,
      readonly: exports.readonlyProcessor,
      promise: exports.promiseProcessor,
      optional: exports.optionalProcessor,
      lazy: exports.lazyProcessor
    };
    function toJSONSchema(input, params) {
      if ("_idmap" in input) {
        const registry = input;
        const ctx2 = (0, to_json_schema_js_1.initializeContext)({ ...params, processors: exports.allProcessors });
        const defs = {};
        for (const entry of registry._idmap.entries()) {
          const [_, schema] = entry;
          (0, to_json_schema_js_1.process)(schema, ctx2);
        }
        const schemas = {};
        const external = {
          registry,
          uri: params?.uri,
          defs
        };
        ctx2.external = external;
        for (const entry of registry._idmap.entries()) {
          const [key, schema] = entry;
          (0, to_json_schema_js_1.extractDefs)(ctx2, schema);
          schemas[key] = (0, to_json_schema_js_1.finalize)(ctx2, schema);
        }
        if (Object.keys(defs).length > 0) {
          const defsSegment = ctx2.target === "draft-2020-12" ? "$defs" : "definitions";
          schemas.__shared = {
            [defsSegment]: defs
          };
        }
        return { schemas };
      }
      const ctx = (0, to_json_schema_js_1.initializeContext)({ ...params, processors: exports.allProcessors });
      (0, to_json_schema_js_1.process)(input, ctx);
      (0, to_json_schema_js_1.extractDefs)(ctx, input);
      return (0, to_json_schema_js_1.finalize)(ctx, input);
    }
  }
});

// node_modules/zod/v4/core/json-schema-generator.cjs
var require_json_schema_generator = __commonJS({
  "node_modules/zod/v4/core/json-schema-generator.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JSONSchemaGenerator = void 0;
    var json_schema_processors_js_1 = require_json_schema_processors();
    var to_json_schema_js_1 = require_to_json_schema();
    var JSONSchemaGenerator = class {
      /** @deprecated Access via ctx instead */
      get metadataRegistry() {
        return this.ctx.metadataRegistry;
      }
      /** @deprecated Access via ctx instead */
      get target() {
        return this.ctx.target;
      }
      /** @deprecated Access via ctx instead */
      get unrepresentable() {
        return this.ctx.unrepresentable;
      }
      /** @deprecated Access via ctx instead */
      get override() {
        return this.ctx.override;
      }
      /** @deprecated Access via ctx instead */
      get io() {
        return this.ctx.io;
      }
      /** @deprecated Access via ctx instead */
      get counter() {
        return this.ctx.counter;
      }
      set counter(value) {
        this.ctx.counter = value;
      }
      /** @deprecated Access via ctx instead */
      get seen() {
        return this.ctx.seen;
      }
      constructor(params) {
        let normalizedTarget = params?.target ?? "draft-2020-12";
        if (normalizedTarget === "draft-4")
          normalizedTarget = "draft-04";
        if (normalizedTarget === "draft-7")
          normalizedTarget = "draft-07";
        this.ctx = (0, to_json_schema_js_1.initializeContext)({
          processors: json_schema_processors_js_1.allProcessors,
          target: normalizedTarget,
          ...params?.metadata && { metadata: params.metadata },
          ...params?.unrepresentable && { unrepresentable: params.unrepresentable },
          ...params?.override && { override: params.override },
          ...params?.io && { io: params.io }
        });
      }
      /**
       * Process a schema to prepare it for JSON Schema generation.
       * This must be called before emit().
       */
      process(schema, _params = { path: [], schemaPath: [] }) {
        return (0, to_json_schema_js_1.process)(schema, this.ctx, _params);
      }
      /**
       * Emit the final JSON Schema after processing.
       * Must call process() first.
       */
      emit(schema, _params) {
        if (_params) {
          if (_params.cycles)
            this.ctx.cycles = _params.cycles;
          if (_params.reused)
            this.ctx.reused = _params.reused;
          if (_params.external)
            this.ctx.external = _params.external;
        }
        (0, to_json_schema_js_1.extractDefs)(this.ctx, schema);
        const result2 = (0, to_json_schema_js_1.finalize)(this.ctx, schema);
        const { "~standard": _, ...plainResult } = result2;
        return plainResult;
      }
    };
    exports.JSONSchemaGenerator = JSONSchemaGenerator;
  }
});

// node_modules/zod/v4/core/json-schema.cjs
var require_json_schema = __commonJS({
  "node_modules/zod/v4/core/json-schema.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/zod/v4/core/index.cjs
var require_core2 = __commonJS({
  "node_modules/zod/v4/core/index.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JSONSchema = exports.JSONSchemaGenerator = exports.toJSONSchema = exports.locales = exports.regexes = exports.util = void 0;
    __exportStar(require_core(), exports);
    __exportStar(require_parse(), exports);
    __exportStar(require_errors(), exports);
    __exportStar(require_schemas(), exports);
    __exportStar(require_checks(), exports);
    __exportStar(require_versions(), exports);
    exports.util = __importStar(require_util());
    exports.regexes = __importStar(require_regexes());
    exports.locales = __importStar(require_locales());
    __exportStar(require_registries(), exports);
    __exportStar(require_doc(), exports);
    __exportStar(require_api(), exports);
    __exportStar(require_to_json_schema(), exports);
    var json_schema_processors_js_1 = require_json_schema_processors();
    Object.defineProperty(exports, "toJSONSchema", { enumerable: true, get: function() {
      return json_schema_processors_js_1.toJSONSchema;
    } });
    var json_schema_generator_js_1 = require_json_schema_generator();
    Object.defineProperty(exports, "JSONSchemaGenerator", { enumerable: true, get: function() {
      return json_schema_generator_js_1.JSONSchemaGenerator;
    } });
    exports.JSONSchema = __importStar(require_json_schema());
  }
});

// node_modules/zod/v4/classic/checks.cjs
var require_checks2 = __commonJS({
  "node_modules/zod/v4/classic/checks.cjs"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.slugify = exports.toUpperCase = exports.toLowerCase = exports.trim = exports.normalize = exports.overwrite = exports.mime = exports.property = exports.endsWith = exports.startsWith = exports.includes = exports.uppercase = exports.lowercase = exports.regex = exports.length = exports.minLength = exports.maxLength = exports.size = exports.minSize = exports.maxSize = exports.multipleOf = exports.nonnegative = exports.nonpositive = exports.negative = exports.positive = exports.gte = exports.gt = exports.lte = exports.lt = void 0;
    var index_js_1 = require_core2();
    Object.defineProperty(exports, "lt", { enumerable: true, get: function() {
      return index_js_1._lt;
    } });
    Object.defineProperty(exports, "lte", { enumerable: true, get: function() {
      return index_js_1._lte;
    } });
    Object.defineProperty(exports, "gt", { enumerable: true, get: function() {
      return index_js_1._gt;
    } });
    Object.defineProperty(exports, "gte", { enumerable: true, get: function() {
      return index_js_1._gte;
    } });
    Object.defineProperty(exports, "positive", { enumerable: true, get: function() {
      return index_js_1._positive;
    } });
    Object.defineProperty(exports, "negative", { enumerable: true, get: function() {
      return index_js_1._negative;
    } });
    Object.defineProperty(exports, "nonpositive", { enumerable: true, get: function() {
      return index_js_1._nonpositive;
    } });
    Object.defineProperty(exports, "nonnegative", { enumerable: true, get: function() {
      return index_js_1._nonnegative;
    } });
    Object.defineProperty(exports, "multipleOf", { enumerable: true, get: function() {
      return index_js_1._multipleOf;
    } });
    Object.defineProperty(exports, "maxSize", { enumerable: true, get: function() {
      return index_js_1._maxSize;
    } });
    Object.defineProperty(exports, "minSize", { enumerable: true, get: function() {
      return index_js_1._minSize;
    } });
    Object.defineProperty(exports, "size", { enumerable: true, get: function() {
      return index_js_1._size;
    } });
    Object.defineProperty(exports, "maxLength", { enumerable: true, get: function() {
      return index_js_1._maxLength;
    } });
    Object.defineProperty(exports, "minLength", { enumerable: true, get: function() {
      return index_js_1._minLength;
    } });
    Object.defineProperty(exports, "length", { enumerable: true, get: function() {
      return index_js_1._length;
    } });
    Object.defineProperty(exports, "regex", { enumerable: true, get: function() {
      return index_js_1._regex;
    } });
    Object.defineProperty(exports, "lowercase", { enumerable: true, get: function() {
      return index_js_1._lowercase;
    } });
    Object.defineProperty(exports, "uppercase", { enumerable: true, get: function() {
      return index_js_1._uppercase;
    } });
    Object.defineProperty(exports, "includes", { enumerable: true, get: function() {
      return index_js_1._includes;
    } });
    Object.defineProperty(exports, "startsWith", { enumerable: true, get: function() {
      return index_js_1._startsWith;
    } });
    Object.defineProperty(exports, "endsWith", { enumerable: true, get: function() {
      return index_js_1._endsWith;
    } });
    Object.defineProperty(exports, "property", { enumerable: true, get: function() {
      return index_js_1._property;
    } });
    Object.defineProperty(exports, "mime", { enumerable: true, get: function() {
      return index_js_1._mime;
    } });
    Object.defineProperty(exports, "overwrite", { enumerable: true, get: function() {
      return index_js_1._overwrite;
    } });
    Object.defineProperty(exports, "normalize", { enumerable: true, get: function() {
      return index_js_1._normalize;
    } });
    Object.defineProperty(exports, "trim", { enumerable: true, get: function() {
      return index_js_1._trim;
    } });
    Object.defineProperty(exports, "toLowerCase", { enumerable: true, get: function() {
      return index_js_1._toLowerCase;
    } });
    Object.defineProperty(exports, "toUpperCase", { enumerable: true, get: function() {
      return index_js_1._toUpperCase;
    } });
    Object.defineProperty(exports, "slugify", { enumerable: true, get: function() {
      return index_js_1._slugify;
    } });
  }
});

// node_modules/zod/v4/classic/iso.cjs
var require_iso = __commonJS({
  "node_modules/zod/v4/classic/iso.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodISODuration = exports.ZodISOTime = exports.ZodISODate = exports.ZodISODateTime = void 0;
    exports.datetime = datetime;
    exports.date = date;
    exports.time = time;
    exports.duration = duration;
    var core = __importStar(require_core2());
    var schemas = __importStar(require_schemas2());
    exports.ZodISODateTime = core.$constructor("ZodISODateTime", (inst, def) => {
      core.$ZodISODateTime.init(inst, def);
      schemas.ZodStringFormat.init(inst, def);
    });
    function datetime(params) {
      return core._isoDateTime(exports.ZodISODateTime, params);
    }
    exports.ZodISODate = core.$constructor("ZodISODate", (inst, def) => {
      core.$ZodISODate.init(inst, def);
      schemas.ZodStringFormat.init(inst, def);
    });
    function date(params) {
      return core._isoDate(exports.ZodISODate, params);
    }
    exports.ZodISOTime = core.$constructor("ZodISOTime", (inst, def) => {
      core.$ZodISOTime.init(inst, def);
      schemas.ZodStringFormat.init(inst, def);
    });
    function time(params) {
      return core._isoTime(exports.ZodISOTime, params);
    }
    exports.ZodISODuration = core.$constructor("ZodISODuration", (inst, def) => {
      core.$ZodISODuration.init(inst, def);
      schemas.ZodStringFormat.init(inst, def);
    });
    function duration(params) {
      return core._isoDuration(exports.ZodISODuration, params);
    }
  }
});

// node_modules/zod/v4/classic/errors.cjs
var require_errors2 = __commonJS({
  "node_modules/zod/v4/classic/errors.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodRealError = exports.ZodError = void 0;
    var core = __importStar(require_core2());
    var index_js_1 = require_core2();
    var util = __importStar(require_util());
    var initializer = (inst, issues) => {
      index_js_1.$ZodError.init(inst, issues);
      inst.name = "ZodError";
      Object.defineProperties(inst, {
        format: {
          value: (mapper) => core.formatError(inst, mapper)
          // enumerable: false,
        },
        flatten: {
          value: (mapper) => core.flattenError(inst, mapper)
          // enumerable: false,
        },
        addIssue: {
          value: (issue) => {
            inst.issues.push(issue);
            inst.message = JSON.stringify(inst.issues, util.jsonStringifyReplacer, 2);
          }
          // enumerable: false,
        },
        addIssues: {
          value: (issues2) => {
            inst.issues.push(...issues2);
            inst.message = JSON.stringify(inst.issues, util.jsonStringifyReplacer, 2);
          }
          // enumerable: false,
        },
        isEmpty: {
          get() {
            return inst.issues.length === 0;
          }
          // enumerable: false,
        }
      });
    };
    exports.ZodError = core.$constructor("ZodError", initializer);
    exports.ZodRealError = core.$constructor("ZodError", initializer, {
      Parent: Error
    });
  }
});

// node_modules/zod/v4/classic/parse.cjs
var require_parse2 = __commonJS({
  "node_modules/zod/v4/classic/parse.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.safeDecodeAsync = exports.safeEncodeAsync = exports.safeDecode = exports.safeEncode = exports.decodeAsync = exports.encodeAsync = exports.decode = exports.encode = exports.safeParseAsync = exports.safeParse = exports.parseAsync = exports.parse = void 0;
    var core = __importStar(require_core2());
    var errors_js_1 = require_errors2();
    exports.parse = core._parse(errors_js_1.ZodRealError);
    exports.parseAsync = core._parseAsync(errors_js_1.ZodRealError);
    exports.safeParse = core._safeParse(errors_js_1.ZodRealError);
    exports.safeParseAsync = core._safeParseAsync(errors_js_1.ZodRealError);
    exports.encode = core._encode(errors_js_1.ZodRealError);
    exports.decode = core._decode(errors_js_1.ZodRealError);
    exports.encodeAsync = core._encodeAsync(errors_js_1.ZodRealError);
    exports.decodeAsync = core._decodeAsync(errors_js_1.ZodRealError);
    exports.safeEncode = core._safeEncode(errors_js_1.ZodRealError);
    exports.safeDecode = core._safeDecode(errors_js_1.ZodRealError);
    exports.safeEncodeAsync = core._safeEncodeAsync(errors_js_1.ZodRealError);
    exports.safeDecodeAsync = core._safeDecodeAsync(errors_js_1.ZodRealError);
  }
});

// node_modules/zod/v4/classic/schemas.cjs
var require_schemas2 = __commonJS({
  "node_modules/zod/v4/classic/schemas.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodLiteral = exports.ZodEnum = exports.ZodSet = exports.ZodMap = exports.ZodRecord = exports.ZodTuple = exports.ZodIntersection = exports.ZodDiscriminatedUnion = exports.ZodXor = exports.ZodUnion = exports.ZodObject = exports.ZodArray = exports.ZodDate = exports.ZodVoid = exports.ZodNever = exports.ZodUnknown = exports.ZodAny = exports.ZodNull = exports.ZodUndefined = exports.ZodSymbol = exports.ZodBigIntFormat = exports.ZodBigInt = exports.ZodBoolean = exports.ZodNumberFormat = exports.ZodNumber = exports.ZodCustomStringFormat = exports.ZodJWT = exports.ZodE164 = exports.ZodBase64URL = exports.ZodBase64 = exports.ZodCIDRv6 = exports.ZodCIDRv4 = exports.ZodIPv6 = exports.ZodMAC = exports.ZodIPv4 = exports.ZodKSUID = exports.ZodXID = exports.ZodULID = exports.ZodCUID2 = exports.ZodCUID = exports.ZodNanoID = exports.ZodEmoji = exports.ZodURL = exports.ZodUUID = exports.ZodGUID = exports.ZodEmail = exports.ZodStringFormat = exports.ZodString = exports._ZodString = exports.ZodType = void 0;
    exports.stringbool = exports.meta = exports.describe = exports.ZodCustom = exports.ZodFunction = exports.ZodPromise = exports.ZodLazy = exports.ZodTemplateLiteral = exports.ZodReadonly = exports.ZodPreprocess = exports.ZodCodec = exports.ZodPipe = exports.ZodNaN = exports.ZodCatch = exports.ZodSuccess = exports.ZodNonOptional = exports.ZodPrefault = exports.ZodDefault = exports.ZodNullable = exports.ZodExactOptional = exports.ZodOptional = exports.ZodTransform = exports.ZodFile = void 0;
    exports.string = string;
    exports.email = email;
    exports.guid = guid;
    exports.uuid = uuid;
    exports.uuidv4 = uuidv4;
    exports.uuidv6 = uuidv6;
    exports.uuidv7 = uuidv7;
    exports.url = url;
    exports.httpUrl = httpUrl;
    exports.emoji = emoji;
    exports.nanoid = nanoid;
    exports.cuid = cuid;
    exports.cuid2 = cuid2;
    exports.ulid = ulid;
    exports.xid = xid;
    exports.ksuid = ksuid;
    exports.ipv4 = ipv4;
    exports.mac = mac;
    exports.ipv6 = ipv6;
    exports.cidrv4 = cidrv4;
    exports.cidrv6 = cidrv6;
    exports.base64 = base64;
    exports.base64url = base64url;
    exports.e164 = e164;
    exports.jwt = jwt;
    exports.stringFormat = stringFormat;
    exports.hostname = hostname;
    exports.hex = hex;
    exports.hash = hash;
    exports.number = number;
    exports.int = int;
    exports.float32 = float32;
    exports.float64 = float64;
    exports.int32 = int32;
    exports.uint32 = uint32;
    exports.boolean = boolean;
    exports.bigint = bigint;
    exports.int64 = int64;
    exports.uint64 = uint64;
    exports.symbol = symbol;
    exports.undefined = _undefined;
    exports.null = _null;
    exports.any = any;
    exports.unknown = unknown;
    exports.never = never;
    exports.void = _void;
    exports.date = date;
    exports.array = array;
    exports.keyof = keyof;
    exports.object = object;
    exports.strictObject = strictObject;
    exports.looseObject = looseObject;
    exports.union = union;
    exports.xor = xor;
    exports.discriminatedUnion = discriminatedUnion;
    exports.intersection = intersection;
    exports.tuple = tuple;
    exports.record = record;
    exports.partialRecord = partialRecord;
    exports.looseRecord = looseRecord;
    exports.map = map;
    exports.set = set;
    exports.enum = _enum;
    exports.nativeEnum = nativeEnum;
    exports.literal = literal;
    exports.file = file;
    exports.transform = transform;
    exports.optional = optional;
    exports.exactOptional = exactOptional;
    exports.nullable = nullable;
    exports.nullish = nullish;
    exports._default = _default;
    exports.prefault = prefault;
    exports.nonoptional = nonoptional;
    exports.success = success;
    exports.catch = _catch;
    exports.nan = nan;
    exports.pipe = pipe;
    exports.codec = codec2;
    exports.invertCodec = invertCodec;
    exports.readonly = readonly;
    exports.templateLiteral = templateLiteral;
    exports.lazy = lazy;
    exports.promise = promise;
    exports._function = _function;
    exports.function = _function;
    exports._function = _function;
    exports.function = _function;
    exports.check = check;
    exports.custom = custom;
    exports.refine = refine;
    exports.superRefine = superRefine;
    exports.instanceof = _instanceof;
    exports.json = json;
    exports.preprocess = preprocess;
    var core = __importStar(require_core2());
    var index_js_1 = require_core2();
    var processors = __importStar(require_json_schema_processors());
    var to_json_schema_js_1 = require_to_json_schema();
    var checks = __importStar(require_checks2());
    var iso = __importStar(require_iso());
    var parse = __importStar(require_parse2());
    var _installedGroups = /* @__PURE__ */ new WeakMap();
    function _installLazyMethods(inst, group, methods) {
      const proto = Object.getPrototypeOf(inst);
      let installed = _installedGroups.get(proto);
      if (!installed) {
        installed = /* @__PURE__ */ new Set();
        _installedGroups.set(proto, installed);
      }
      if (installed.has(group))
        return;
      installed.add(group);
      for (const key in methods) {
        const fn = methods[key];
        Object.defineProperty(proto, key, {
          configurable: true,
          enumerable: false,
          get() {
            const bound = fn.bind(this);
            Object.defineProperty(this, key, {
              configurable: true,
              writable: true,
              enumerable: true,
              value: bound
            });
            return bound;
          },
          set(v) {
            Object.defineProperty(this, key, {
              configurable: true,
              writable: true,
              enumerable: true,
              value: v
            });
          }
        });
      }
    }
    exports.ZodType = core.$constructor("ZodType", (inst, def) => {
      core.$ZodType.init(inst, def);
      Object.assign(inst["~standard"], {
        jsonSchema: {
          input: (0, to_json_schema_js_1.createStandardJSONSchemaMethod)(inst, "input"),
          output: (0, to_json_schema_js_1.createStandardJSONSchemaMethod)(inst, "output")
        }
      });
      inst.toJSONSchema = (0, to_json_schema_js_1.createToJSONSchemaMethod)(inst, {});
      inst.def = def;
      inst.type = def.type;
      Object.defineProperty(inst, "_def", { value: def });
      inst.parse = (data, params) => parse.parse(inst, data, params, { callee: inst.parse });
      inst.safeParse = (data, params) => parse.safeParse(inst, data, params);
      inst.parseAsync = async (data, params) => parse.parseAsync(inst, data, params, { callee: inst.parseAsync });
      inst.safeParseAsync = async (data, params) => parse.safeParseAsync(inst, data, params);
      inst.spa = inst.safeParseAsync;
      inst.encode = (data, params) => parse.encode(inst, data, params);
      inst.decode = (data, params) => parse.decode(inst, data, params);
      inst.encodeAsync = async (data, params) => parse.encodeAsync(inst, data, params);
      inst.decodeAsync = async (data, params) => parse.decodeAsync(inst, data, params);
      inst.safeEncode = (data, params) => parse.safeEncode(inst, data, params);
      inst.safeDecode = (data, params) => parse.safeDecode(inst, data, params);
      inst.safeEncodeAsync = async (data, params) => parse.safeEncodeAsync(inst, data, params);
      inst.safeDecodeAsync = async (data, params) => parse.safeDecodeAsync(inst, data, params);
      _installLazyMethods(inst, "ZodType", {
        check(...chks) {
          const def2 = this.def;
          return this.clone(index_js_1.util.mergeDefs(def2, {
            checks: [
              ...def2.checks ?? [],
              ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
            ]
          }), { parent: true });
        },
        with(...chks) {
          return this.check(...chks);
        },
        clone(def2, params) {
          return core.clone(this, def2, params);
        },
        brand() {
          return this;
        },
        register(reg, meta) {
          reg.add(this, meta);
          return this;
        },
        refine(check2, params) {
          return this.check(refine(check2, params));
        },
        superRefine(refinement, params) {
          return this.check(superRefine(refinement, params));
        },
        overwrite(fn) {
          return this.check(checks.overwrite(fn));
        },
        optional() {
          return optional(this);
        },
        exactOptional() {
          return exactOptional(this);
        },
        nullable() {
          return nullable(this);
        },
        nullish() {
          return optional(nullable(this));
        },
        nonoptional(params) {
          return nonoptional(this, params);
        },
        array() {
          return array(this);
        },
        or(arg) {
          return union([this, arg]);
        },
        and(arg) {
          return intersection(this, arg);
        },
        transform(tx) {
          return pipe(this, transform(tx));
        },
        default(d) {
          return _default(this, d);
        },
        prefault(d) {
          return prefault(this, d);
        },
        catch(params) {
          return _catch(this, params);
        },
        pipe(target) {
          return pipe(this, target);
        },
        readonly() {
          return readonly(this);
        },
        describe(description) {
          const cl = this.clone();
          core.globalRegistry.add(cl, { description });
          return cl;
        },
        meta(...args) {
          if (args.length === 0)
            return core.globalRegistry.get(this);
          const cl = this.clone();
          core.globalRegistry.add(cl, args[0]);
          return cl;
        },
        isOptional() {
          return this.safeParse(void 0).success;
        },
        isNullable() {
          return this.safeParse(null).success;
        },
        apply(fn) {
          return fn(this);
        }
      });
      Object.defineProperty(inst, "description", {
        get() {
          return core.globalRegistry.get(inst)?.description;
        },
        configurable: true
      });
      return inst;
    });
    exports._ZodString = core.$constructor("_ZodString", (inst, def) => {
      core.$ZodString.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.stringProcessor(inst, ctx, json2, params);
      const bag = inst._zod.bag;
      inst.format = bag.format ?? null;
      inst.minLength = bag.minimum ?? null;
      inst.maxLength = bag.maximum ?? null;
      _installLazyMethods(inst, "_ZodString", {
        regex(...args) {
          return this.check(checks.regex(...args));
        },
        includes(...args) {
          return this.check(checks.includes(...args));
        },
        startsWith(...args) {
          return this.check(checks.startsWith(...args));
        },
        endsWith(...args) {
          return this.check(checks.endsWith(...args));
        },
        min(...args) {
          return this.check(checks.minLength(...args));
        },
        max(...args) {
          return this.check(checks.maxLength(...args));
        },
        length(...args) {
          return this.check(checks.length(...args));
        },
        nonempty(...args) {
          return this.check(checks.minLength(1, ...args));
        },
        lowercase(params) {
          return this.check(checks.lowercase(params));
        },
        uppercase(params) {
          return this.check(checks.uppercase(params));
        },
        trim() {
          return this.check(checks.trim());
        },
        normalize(...args) {
          return this.check(checks.normalize(...args));
        },
        toLowerCase() {
          return this.check(checks.toLowerCase());
        },
        toUpperCase() {
          return this.check(checks.toUpperCase());
        },
        slugify() {
          return this.check(checks.slugify());
        }
      });
    });
    exports.ZodString = core.$constructor("ZodString", (inst, def) => {
      core.$ZodString.init(inst, def);
      exports._ZodString.init(inst, def);
      inst.email = (params) => inst.check(core._email(exports.ZodEmail, params));
      inst.url = (params) => inst.check(core._url(exports.ZodURL, params));
      inst.jwt = (params) => inst.check(core._jwt(exports.ZodJWT, params));
      inst.emoji = (params) => inst.check(core._emoji(exports.ZodEmoji, params));
      inst.guid = (params) => inst.check(core._guid(exports.ZodGUID, params));
      inst.uuid = (params) => inst.check(core._uuid(exports.ZodUUID, params));
      inst.uuidv4 = (params) => inst.check(core._uuidv4(exports.ZodUUID, params));
      inst.uuidv6 = (params) => inst.check(core._uuidv6(exports.ZodUUID, params));
      inst.uuidv7 = (params) => inst.check(core._uuidv7(exports.ZodUUID, params));
      inst.nanoid = (params) => inst.check(core._nanoid(exports.ZodNanoID, params));
      inst.guid = (params) => inst.check(core._guid(exports.ZodGUID, params));
      inst.cuid = (params) => inst.check(core._cuid(exports.ZodCUID, params));
      inst.cuid2 = (params) => inst.check(core._cuid2(exports.ZodCUID2, params));
      inst.ulid = (params) => inst.check(core._ulid(exports.ZodULID, params));
      inst.base64 = (params) => inst.check(core._base64(exports.ZodBase64, params));
      inst.base64url = (params) => inst.check(core._base64url(exports.ZodBase64URL, params));
      inst.xid = (params) => inst.check(core._xid(exports.ZodXID, params));
      inst.ksuid = (params) => inst.check(core._ksuid(exports.ZodKSUID, params));
      inst.ipv4 = (params) => inst.check(core._ipv4(exports.ZodIPv4, params));
      inst.ipv6 = (params) => inst.check(core._ipv6(exports.ZodIPv6, params));
      inst.cidrv4 = (params) => inst.check(core._cidrv4(exports.ZodCIDRv4, params));
      inst.cidrv6 = (params) => inst.check(core._cidrv6(exports.ZodCIDRv6, params));
      inst.e164 = (params) => inst.check(core._e164(exports.ZodE164, params));
      inst.datetime = (params) => inst.check(iso.datetime(params));
      inst.date = (params) => inst.check(iso.date(params));
      inst.time = (params) => inst.check(iso.time(params));
      inst.duration = (params) => inst.check(iso.duration(params));
    });
    function string(params) {
      return core._string(exports.ZodString, params);
    }
    exports.ZodStringFormat = core.$constructor("ZodStringFormat", (inst, def) => {
      core.$ZodStringFormat.init(inst, def);
      exports._ZodString.init(inst, def);
    });
    exports.ZodEmail = core.$constructor("ZodEmail", (inst, def) => {
      core.$ZodEmail.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function email(params) {
      return core._email(exports.ZodEmail, params);
    }
    exports.ZodGUID = core.$constructor("ZodGUID", (inst, def) => {
      core.$ZodGUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function guid(params) {
      return core._guid(exports.ZodGUID, params);
    }
    exports.ZodUUID = core.$constructor("ZodUUID", (inst, def) => {
      core.$ZodUUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function uuid(params) {
      return core._uuid(exports.ZodUUID, params);
    }
    function uuidv4(params) {
      return core._uuidv4(exports.ZodUUID, params);
    }
    function uuidv6(params) {
      return core._uuidv6(exports.ZodUUID, params);
    }
    function uuidv7(params) {
      return core._uuidv7(exports.ZodUUID, params);
    }
    exports.ZodURL = core.$constructor("ZodURL", (inst, def) => {
      core.$ZodURL.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function url(params) {
      return core._url(exports.ZodURL, params);
    }
    function httpUrl(params) {
      return core._url(exports.ZodURL, {
        protocol: core.regexes.httpProtocol,
        hostname: core.regexes.domain,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodEmoji = core.$constructor("ZodEmoji", (inst, def) => {
      core.$ZodEmoji.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function emoji(params) {
      return core._emoji(exports.ZodEmoji, params);
    }
    exports.ZodNanoID = core.$constructor("ZodNanoID", (inst, def) => {
      core.$ZodNanoID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function nanoid(params) {
      return core._nanoid(exports.ZodNanoID, params);
    }
    exports.ZodCUID = core.$constructor("ZodCUID", (inst, def) => {
      core.$ZodCUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cuid(params) {
      return core._cuid(exports.ZodCUID, params);
    }
    exports.ZodCUID2 = core.$constructor("ZodCUID2", (inst, def) => {
      core.$ZodCUID2.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cuid2(params) {
      return core._cuid2(exports.ZodCUID2, params);
    }
    exports.ZodULID = core.$constructor("ZodULID", (inst, def) => {
      core.$ZodULID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ulid(params) {
      return core._ulid(exports.ZodULID, params);
    }
    exports.ZodXID = core.$constructor("ZodXID", (inst, def) => {
      core.$ZodXID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function xid(params) {
      return core._xid(exports.ZodXID, params);
    }
    exports.ZodKSUID = core.$constructor("ZodKSUID", (inst, def) => {
      core.$ZodKSUID.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ksuid(params) {
      return core._ksuid(exports.ZodKSUID, params);
    }
    exports.ZodIPv4 = core.$constructor("ZodIPv4", (inst, def) => {
      core.$ZodIPv4.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ipv4(params) {
      return core._ipv4(exports.ZodIPv4, params);
    }
    exports.ZodMAC = core.$constructor("ZodMAC", (inst, def) => {
      core.$ZodMAC.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function mac(params) {
      return core._mac(exports.ZodMAC, params);
    }
    exports.ZodIPv6 = core.$constructor("ZodIPv6", (inst, def) => {
      core.$ZodIPv6.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function ipv6(params) {
      return core._ipv6(exports.ZodIPv6, params);
    }
    exports.ZodCIDRv4 = core.$constructor("ZodCIDRv4", (inst, def) => {
      core.$ZodCIDRv4.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cidrv4(params) {
      return core._cidrv4(exports.ZodCIDRv4, params);
    }
    exports.ZodCIDRv6 = core.$constructor("ZodCIDRv6", (inst, def) => {
      core.$ZodCIDRv6.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function cidrv6(params) {
      return core._cidrv6(exports.ZodCIDRv6, params);
    }
    exports.ZodBase64 = core.$constructor("ZodBase64", (inst, def) => {
      core.$ZodBase64.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function base64(params) {
      return core._base64(exports.ZodBase64, params);
    }
    exports.ZodBase64URL = core.$constructor("ZodBase64URL", (inst, def) => {
      core.$ZodBase64URL.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function base64url(params) {
      return core._base64url(exports.ZodBase64URL, params);
    }
    exports.ZodE164 = core.$constructor("ZodE164", (inst, def) => {
      core.$ZodE164.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function e164(params) {
      return core._e164(exports.ZodE164, params);
    }
    exports.ZodJWT = core.$constructor("ZodJWT", (inst, def) => {
      core.$ZodJWT.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function jwt(params) {
      return core._jwt(exports.ZodJWT, params);
    }
    exports.ZodCustomStringFormat = core.$constructor("ZodCustomStringFormat", (inst, def) => {
      core.$ZodCustomStringFormat.init(inst, def);
      exports.ZodStringFormat.init(inst, def);
    });
    function stringFormat(format, fnOrRegex, _params = {}) {
      return core._stringFormat(exports.ZodCustomStringFormat, format, fnOrRegex, _params);
    }
    function hostname(_params) {
      return core._stringFormat(exports.ZodCustomStringFormat, "hostname", core.regexes.hostname, _params);
    }
    function hex(_params) {
      return core._stringFormat(exports.ZodCustomStringFormat, "hex", core.regexes.hex, _params);
    }
    function hash(alg, params) {
      const enc = params?.enc ?? "hex";
      const format = `${alg}_${enc}`;
      const regex = core.regexes[format];
      if (!regex)
        throw new Error(`Unrecognized hash format: ${format}`);
      return core._stringFormat(exports.ZodCustomStringFormat, format, regex, params);
    }
    exports.ZodNumber = core.$constructor("ZodNumber", (inst, def) => {
      core.$ZodNumber.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.numberProcessor(inst, ctx, json2, params);
      _installLazyMethods(inst, "ZodNumber", {
        gt(value, params) {
          return this.check(checks.gt(value, params));
        },
        gte(value, params) {
          return this.check(checks.gte(value, params));
        },
        min(value, params) {
          return this.check(checks.gte(value, params));
        },
        lt(value, params) {
          return this.check(checks.lt(value, params));
        },
        lte(value, params) {
          return this.check(checks.lte(value, params));
        },
        max(value, params) {
          return this.check(checks.lte(value, params));
        },
        int(params) {
          return this.check(int(params));
        },
        safe(params) {
          return this.check(int(params));
        },
        positive(params) {
          return this.check(checks.gt(0, params));
        },
        nonnegative(params) {
          return this.check(checks.gte(0, params));
        },
        negative(params) {
          return this.check(checks.lt(0, params));
        },
        nonpositive(params) {
          return this.check(checks.lte(0, params));
        },
        multipleOf(value, params) {
          return this.check(checks.multipleOf(value, params));
        },
        step(value, params) {
          return this.check(checks.multipleOf(value, params));
        },
        finite() {
          return this;
        }
      });
      const bag = inst._zod.bag;
      inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
      inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
      inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
      inst.isFinite = true;
      inst.format = bag.format ?? null;
    });
    function number(params) {
      return core._number(exports.ZodNumber, params);
    }
    exports.ZodNumberFormat = core.$constructor("ZodNumberFormat", (inst, def) => {
      core.$ZodNumberFormat.init(inst, def);
      exports.ZodNumber.init(inst, def);
    });
    function int(params) {
      return core._int(exports.ZodNumberFormat, params);
    }
    function float32(params) {
      return core._float32(exports.ZodNumberFormat, params);
    }
    function float64(params) {
      return core._float64(exports.ZodNumberFormat, params);
    }
    function int32(params) {
      return core._int32(exports.ZodNumberFormat, params);
    }
    function uint32(params) {
      return core._uint32(exports.ZodNumberFormat, params);
    }
    exports.ZodBoolean = core.$constructor("ZodBoolean", (inst, def) => {
      core.$ZodBoolean.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.booleanProcessor(inst, ctx, json2, params);
    });
    function boolean(params) {
      return core._boolean(exports.ZodBoolean, params);
    }
    exports.ZodBigInt = core.$constructor("ZodBigInt", (inst, def) => {
      core.$ZodBigInt.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.bigintProcessor(inst, ctx, json2, params);
      inst.gte = (value, params) => inst.check(checks.gte(value, params));
      inst.min = (value, params) => inst.check(checks.gte(value, params));
      inst.gt = (value, params) => inst.check(checks.gt(value, params));
      inst.gte = (value, params) => inst.check(checks.gte(value, params));
      inst.min = (value, params) => inst.check(checks.gte(value, params));
      inst.lt = (value, params) => inst.check(checks.lt(value, params));
      inst.lte = (value, params) => inst.check(checks.lte(value, params));
      inst.max = (value, params) => inst.check(checks.lte(value, params));
      inst.positive = (params) => inst.check(checks.gt(BigInt(0), params));
      inst.negative = (params) => inst.check(checks.lt(BigInt(0), params));
      inst.nonpositive = (params) => inst.check(checks.lte(BigInt(0), params));
      inst.nonnegative = (params) => inst.check(checks.gte(BigInt(0), params));
      inst.multipleOf = (value, params) => inst.check(checks.multipleOf(value, params));
      const bag = inst._zod.bag;
      inst.minValue = bag.minimum ?? null;
      inst.maxValue = bag.maximum ?? null;
      inst.format = bag.format ?? null;
    });
    function bigint(params) {
      return core._bigint(exports.ZodBigInt, params);
    }
    exports.ZodBigIntFormat = core.$constructor("ZodBigIntFormat", (inst, def) => {
      core.$ZodBigIntFormat.init(inst, def);
      exports.ZodBigInt.init(inst, def);
    });
    function int64(params) {
      return core._int64(exports.ZodBigIntFormat, params);
    }
    function uint64(params) {
      return core._uint64(exports.ZodBigIntFormat, params);
    }
    exports.ZodSymbol = core.$constructor("ZodSymbol", (inst, def) => {
      core.$ZodSymbol.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.symbolProcessor(inst, ctx, json2, params);
    });
    function symbol(params) {
      return core._symbol(exports.ZodSymbol, params);
    }
    exports.ZodUndefined = core.$constructor("ZodUndefined", (inst, def) => {
      core.$ZodUndefined.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.undefinedProcessor(inst, ctx, json2, params);
    });
    function _undefined(params) {
      return core._undefined(exports.ZodUndefined, params);
    }
    exports.ZodNull = core.$constructor("ZodNull", (inst, def) => {
      core.$ZodNull.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.nullProcessor(inst, ctx, json2, params);
    });
    function _null(params) {
      return core._null(exports.ZodNull, params);
    }
    exports.ZodAny = core.$constructor("ZodAny", (inst, def) => {
      core.$ZodAny.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.anyProcessor(inst, ctx, json2, params);
    });
    function any() {
      return core._any(exports.ZodAny);
    }
    exports.ZodUnknown = core.$constructor("ZodUnknown", (inst, def) => {
      core.$ZodUnknown.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.unknownProcessor(inst, ctx, json2, params);
    });
    function unknown() {
      return core._unknown(exports.ZodUnknown);
    }
    exports.ZodNever = core.$constructor("ZodNever", (inst, def) => {
      core.$ZodNever.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.neverProcessor(inst, ctx, json2, params);
    });
    function never(params) {
      return core._never(exports.ZodNever, params);
    }
    exports.ZodVoid = core.$constructor("ZodVoid", (inst, def) => {
      core.$ZodVoid.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.voidProcessor(inst, ctx, json2, params);
    });
    function _void(params) {
      return core._void(exports.ZodVoid, params);
    }
    exports.ZodDate = core.$constructor("ZodDate", (inst, def) => {
      core.$ZodDate.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.dateProcessor(inst, ctx, json2, params);
      inst.min = (value, params) => inst.check(checks.gte(value, params));
      inst.max = (value, params) => inst.check(checks.lte(value, params));
      const c = inst._zod.bag;
      inst.minDate = c.minimum ? new Date(c.minimum) : null;
      inst.maxDate = c.maximum ? new Date(c.maximum) : null;
    });
    function date(params) {
      return core._date(exports.ZodDate, params);
    }
    exports.ZodArray = core.$constructor("ZodArray", (inst, def) => {
      core.$ZodArray.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.arrayProcessor(inst, ctx, json2, params);
      inst.element = def.element;
      _installLazyMethods(inst, "ZodArray", {
        min(n, params) {
          return this.check(checks.minLength(n, params));
        },
        nonempty(params) {
          return this.check(checks.minLength(1, params));
        },
        max(n, params) {
          return this.check(checks.maxLength(n, params));
        },
        length(n, params) {
          return this.check(checks.length(n, params));
        },
        unwrap() {
          return this.element;
        }
      });
    });
    function array(element, params) {
      return core._array(exports.ZodArray, element, params);
    }
    function keyof(schema) {
      const shape = schema._zod.def.shape;
      return _enum(Object.keys(shape));
    }
    exports.ZodObject = core.$constructor("ZodObject", (inst, def) => {
      core.$ZodObjectJIT.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.objectProcessor(inst, ctx, json2, params);
      index_js_1.util.defineLazy(inst, "shape", () => {
        return def.shape;
      });
      _installLazyMethods(inst, "ZodObject", {
        keyof() {
          return _enum(Object.keys(this._zod.def.shape));
        },
        catchall(catchall) {
          return this.clone({ ...this._zod.def, catchall });
        },
        passthrough() {
          return this.clone({ ...this._zod.def, catchall: unknown() });
        },
        loose() {
          return this.clone({ ...this._zod.def, catchall: unknown() });
        },
        strict() {
          return this.clone({ ...this._zod.def, catchall: never() });
        },
        strip() {
          return this.clone({ ...this._zod.def, catchall: void 0 });
        },
        extend(incoming) {
          return index_js_1.util.extend(this, incoming);
        },
        safeExtend(incoming) {
          return index_js_1.util.safeExtend(this, incoming);
        },
        merge(other) {
          return index_js_1.util.merge(this, other);
        },
        pick(mask) {
          return index_js_1.util.pick(this, mask);
        },
        omit(mask) {
          return index_js_1.util.omit(this, mask);
        },
        partial(...args) {
          return index_js_1.util.partial(exports.ZodOptional, this, args[0]);
        },
        required(...args) {
          return index_js_1.util.required(exports.ZodNonOptional, this, args[0]);
        }
      });
    });
    function object(shape, params) {
      const def = {
        type: "object",
        shape: shape ?? {},
        ...index_js_1.util.normalizeParams(params)
      };
      return new exports.ZodObject(def);
    }
    function strictObject(shape, params) {
      return new exports.ZodObject({
        type: "object",
        shape,
        catchall: never(),
        ...index_js_1.util.normalizeParams(params)
      });
    }
    function looseObject(shape, params) {
      return new exports.ZodObject({
        type: "object",
        shape,
        catchall: unknown(),
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodUnion = core.$constructor("ZodUnion", (inst, def) => {
      core.$ZodUnion.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.unionProcessor(inst, ctx, json2, params);
      inst.options = def.options;
    });
    function union(options, params) {
      return new exports.ZodUnion({
        type: "union",
        options,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodXor = core.$constructor("ZodXor", (inst, def) => {
      exports.ZodUnion.init(inst, def);
      core.$ZodXor.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.unionProcessor(inst, ctx, json2, params);
      inst.options = def.options;
    });
    function xor(options, params) {
      return new exports.ZodXor({
        type: "union",
        options,
        inclusive: false,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodDiscriminatedUnion = core.$constructor("ZodDiscriminatedUnion", (inst, def) => {
      exports.ZodUnion.init(inst, def);
      core.$ZodDiscriminatedUnion.init(inst, def);
    });
    function discriminatedUnion(discriminator, options, params) {
      return new exports.ZodDiscriminatedUnion({
        type: "union",
        options,
        discriminator,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodIntersection = core.$constructor("ZodIntersection", (inst, def) => {
      core.$ZodIntersection.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.intersectionProcessor(inst, ctx, json2, params);
    });
    function intersection(left, right) {
      return new exports.ZodIntersection({
        type: "intersection",
        left,
        right
      });
    }
    exports.ZodTuple = core.$constructor("ZodTuple", (inst, def) => {
      core.$ZodTuple.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.tupleProcessor(inst, ctx, json2, params);
      inst.rest = (rest) => inst.clone({
        ...inst._zod.def,
        rest
      });
    });
    function tuple(items, _paramsOrRest, _params) {
      const hasRest = _paramsOrRest instanceof core.$ZodType;
      const params = hasRest ? _params : _paramsOrRest;
      const rest = hasRest ? _paramsOrRest : null;
      return new exports.ZodTuple({
        type: "tuple",
        items,
        rest,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodRecord = core.$constructor("ZodRecord", (inst, def) => {
      core.$ZodRecord.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.recordProcessor(inst, ctx, json2, params);
      inst.keyType = def.keyType;
      inst.valueType = def.valueType;
    });
    function record(keyType, valueType, params) {
      if (!valueType || !valueType._zod) {
        return new exports.ZodRecord({
          type: "record",
          keyType: string(),
          valueType: keyType,
          ...index_js_1.util.normalizeParams(valueType)
        });
      }
      return new exports.ZodRecord({
        type: "record",
        keyType,
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    function partialRecord(keyType, valueType, params) {
      const k = core.clone(keyType);
      k._zod.values = void 0;
      return new exports.ZodRecord({
        type: "record",
        keyType: k,
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    function looseRecord(keyType, valueType, params) {
      return new exports.ZodRecord({
        type: "record",
        keyType,
        valueType,
        mode: "loose",
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodMap = core.$constructor("ZodMap", (inst, def) => {
      core.$ZodMap.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.mapProcessor(inst, ctx, json2, params);
      inst.keyType = def.keyType;
      inst.valueType = def.valueType;
      inst.min = (...args) => inst.check(core._minSize(...args));
      inst.nonempty = (params) => inst.check(core._minSize(1, params));
      inst.max = (...args) => inst.check(core._maxSize(...args));
      inst.size = (...args) => inst.check(core._size(...args));
    });
    function map(keyType, valueType, params) {
      return new exports.ZodMap({
        type: "map",
        keyType,
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodSet = core.$constructor("ZodSet", (inst, def) => {
      core.$ZodSet.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.setProcessor(inst, ctx, json2, params);
      inst.min = (...args) => inst.check(core._minSize(...args));
      inst.nonempty = (params) => inst.check(core._minSize(1, params));
      inst.max = (...args) => inst.check(core._maxSize(...args));
      inst.size = (...args) => inst.check(core._size(...args));
    });
    function set(valueType, params) {
      return new exports.ZodSet({
        type: "set",
        valueType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodEnum = core.$constructor("ZodEnum", (inst, def) => {
      core.$ZodEnum.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.enumProcessor(inst, ctx, json2, params);
      inst.enum = def.entries;
      inst.options = Object.values(def.entries);
      const keys = new Set(Object.keys(def.entries));
      inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) {
          if (keys.has(value)) {
            newEntries[value] = def.entries[value];
          } else
            throw new Error(`Key ${value} not found in enum`);
        }
        return new exports.ZodEnum({
          ...def,
          checks: [],
          ...index_js_1.util.normalizeParams(params),
          entries: newEntries
        });
      };
      inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) {
          if (keys.has(value)) {
            delete newEntries[value];
          } else
            throw new Error(`Key ${value} not found in enum`);
        }
        return new exports.ZodEnum({
          ...def,
          checks: [],
          ...index_js_1.util.normalizeParams(params),
          entries: newEntries
        });
      };
    });
    function _enum(values, params) {
      const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
      return new exports.ZodEnum({
        type: "enum",
        entries,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    function nativeEnum(entries, params) {
      return new exports.ZodEnum({
        type: "enum",
        entries,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodLiteral = core.$constructor("ZodLiteral", (inst, def) => {
      core.$ZodLiteral.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.literalProcessor(inst, ctx, json2, params);
      inst.values = new Set(def.values);
      Object.defineProperty(inst, "value", {
        get() {
          if (def.values.length > 1) {
            throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
          }
          return def.values[0];
        }
      });
    });
    function literal(value, params) {
      return new exports.ZodLiteral({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodFile = core.$constructor("ZodFile", (inst, def) => {
      core.$ZodFile.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.fileProcessor(inst, ctx, json2, params);
      inst.min = (size, params) => inst.check(core._minSize(size, params));
      inst.max = (size, params) => inst.check(core._maxSize(size, params));
      inst.mime = (types, params) => inst.check(core._mime(Array.isArray(types) ? types : [types], params));
    });
    function file(params) {
      return core._file(exports.ZodFile, params);
    }
    exports.ZodTransform = core.$constructor("ZodTransform", (inst, def) => {
      core.$ZodTransform.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.transformProcessor(inst, ctx, json2, params);
      inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") {
          throw new core.$ZodEncodeError(inst.constructor.name);
        }
        payload.addIssue = (issue) => {
          if (typeof issue === "string") {
            payload.issues.push(index_js_1.util.issue(issue, payload.value, def));
          } else {
            const _issue = issue;
            if (_issue.fatal)
              _issue.continue = false;
            _issue.code ?? (_issue.code = "custom");
            _issue.input ?? (_issue.input = payload.value);
            _issue.inst ?? (_issue.inst = inst);
            payload.issues.push(index_js_1.util.issue(_issue));
          }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) {
          return output.then((output2) => {
            payload.value = output2;
            payload.fallback = true;
            return payload;
          });
        }
        payload.value = output;
        payload.fallback = true;
        return payload;
      };
    });
    function transform(fn) {
      return new exports.ZodTransform({
        type: "transform",
        transform: fn
      });
    }
    exports.ZodOptional = core.$constructor("ZodOptional", (inst, def) => {
      core.$ZodOptional.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.optionalProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function optional(innerType) {
      return new exports.ZodOptional({
        type: "optional",
        innerType
      });
    }
    exports.ZodExactOptional = core.$constructor("ZodExactOptional", (inst, def) => {
      core.$ZodExactOptional.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.optionalProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function exactOptional(innerType) {
      return new exports.ZodExactOptional({
        type: "optional",
        innerType
      });
    }
    exports.ZodNullable = core.$constructor("ZodNullable", (inst, def) => {
      core.$ZodNullable.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.nullableProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function nullable(innerType) {
      return new exports.ZodNullable({
        type: "nullable",
        innerType
      });
    }
    function nullish(innerType) {
      return optional(nullable(innerType));
    }
    exports.ZodDefault = core.$constructor("ZodDefault", (inst, def) => {
      core.$ZodDefault.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.defaultProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeDefault = inst.unwrap;
    });
    function _default(innerType, defaultValue) {
      return new exports.ZodDefault({
        type: "default",
        innerType,
        get defaultValue() {
          return typeof defaultValue === "function" ? defaultValue() : index_js_1.util.shallowClone(defaultValue);
        }
      });
    }
    exports.ZodPrefault = core.$constructor("ZodPrefault", (inst, def) => {
      core.$ZodPrefault.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.prefaultProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function prefault(innerType, defaultValue) {
      return new exports.ZodPrefault({
        type: "prefault",
        innerType,
        get defaultValue() {
          return typeof defaultValue === "function" ? defaultValue() : index_js_1.util.shallowClone(defaultValue);
        }
      });
    }
    exports.ZodNonOptional = core.$constructor("ZodNonOptional", (inst, def) => {
      core.$ZodNonOptional.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.nonoptionalProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function nonoptional(innerType, params) {
      return new exports.ZodNonOptional({
        type: "nonoptional",
        innerType,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodSuccess = core.$constructor("ZodSuccess", (inst, def) => {
      core.$ZodSuccess.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.successProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function success(innerType) {
      return new exports.ZodSuccess({
        type: "success",
        innerType
      });
    }
    exports.ZodCatch = core.$constructor("ZodCatch", (inst, def) => {
      core.$ZodCatch.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.catchProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeCatch = inst.unwrap;
    });
    function _catch(innerType, catchValue) {
      return new exports.ZodCatch({
        type: "catch",
        innerType,
        catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
      });
    }
    exports.ZodNaN = core.$constructor("ZodNaN", (inst, def) => {
      core.$ZodNaN.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.nanProcessor(inst, ctx, json2, params);
    });
    function nan(params) {
      return core._nan(exports.ZodNaN, params);
    }
    exports.ZodPipe = core.$constructor("ZodPipe", (inst, def) => {
      core.$ZodPipe.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.pipeProcessor(inst, ctx, json2, params);
      inst.in = def.in;
      inst.out = def.out;
    });
    function pipe(in_, out) {
      return new exports.ZodPipe({
        type: "pipe",
        in: in_,
        out
        // ...util.normalizeParams(params),
      });
    }
    exports.ZodCodec = core.$constructor("ZodCodec", (inst, def) => {
      exports.ZodPipe.init(inst, def);
      core.$ZodCodec.init(inst, def);
    });
    function codec2(in_, out, params) {
      return new exports.ZodCodec({
        type: "pipe",
        in: in_,
        out,
        transform: params.decode,
        reverseTransform: params.encode
      });
    }
    function invertCodec(codec3) {
      const def = codec3._zod.def;
      return new exports.ZodCodec({
        type: "pipe",
        in: def.out,
        out: def.in,
        transform: def.reverseTransform,
        reverseTransform: def.transform
      });
    }
    exports.ZodPreprocess = core.$constructor("ZodPreprocess", (inst, def) => {
      exports.ZodPipe.init(inst, def);
      core.$ZodPreprocess.init(inst, def);
    });
    exports.ZodReadonly = core.$constructor("ZodReadonly", (inst, def) => {
      core.$ZodReadonly.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.readonlyProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function readonly(innerType) {
      return new exports.ZodReadonly({
        type: "readonly",
        innerType
      });
    }
    exports.ZodTemplateLiteral = core.$constructor("ZodTemplateLiteral", (inst, def) => {
      core.$ZodTemplateLiteral.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.templateLiteralProcessor(inst, ctx, json2, params);
    });
    function templateLiteral(parts, params) {
      return new exports.ZodTemplateLiteral({
        type: "template_literal",
        parts,
        ...index_js_1.util.normalizeParams(params)
      });
    }
    exports.ZodLazy = core.$constructor("ZodLazy", (inst, def) => {
      core.$ZodLazy.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.lazyProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.getter();
    });
    function lazy(getter) {
      return new exports.ZodLazy({
        type: "lazy",
        getter
      });
    }
    exports.ZodPromise = core.$constructor("ZodPromise", (inst, def) => {
      core.$ZodPromise.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.promiseProcessor(inst, ctx, json2, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    function promise(innerType) {
      return new exports.ZodPromise({
        type: "promise",
        innerType
      });
    }
    exports.ZodFunction = core.$constructor("ZodFunction", (inst, def) => {
      core.$ZodFunction.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.functionProcessor(inst, ctx, json2, params);
    });
    function _function(params) {
      return new exports.ZodFunction({
        type: "function",
        input: Array.isArray(params?.input) ? tuple(params?.input) : params?.input ?? array(unknown()),
        output: params?.output ?? unknown()
      });
    }
    exports.ZodCustom = core.$constructor("ZodCustom", (inst, def) => {
      core.$ZodCustom.init(inst, def);
      exports.ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json2, params) => processors.customProcessor(inst, ctx, json2, params);
    });
    function check(fn) {
      const ch = new core.$ZodCheck({
        check: "custom"
        // ...util.normalizeParams(params),
      });
      ch._zod.check = fn;
      return ch;
    }
    function custom(fn, _params) {
      return core._custom(exports.ZodCustom, fn ?? (() => true), _params);
    }
    function refine(fn, _params = {}) {
      return core._refine(exports.ZodCustom, fn, _params);
    }
    function superRefine(fn, params) {
      return core._superRefine(fn, params);
    }
    exports.describe = core.describe;
    exports.meta = core.meta;
    function _instanceof(cls, params = {}) {
      const inst = new exports.ZodCustom({
        type: "custom",
        check: "custom",
        fn: (data) => data instanceof cls,
        abort: true,
        ...index_js_1.util.normalizeParams(params)
      });
      inst._zod.bag.Class = cls;
      inst._zod.check = (payload) => {
        if (!(payload.value instanceof cls)) {
          payload.issues.push({
            code: "invalid_type",
            expected: cls.name,
            input: payload.value,
            inst,
            path: [...inst._zod.def.path ?? []]
          });
        }
      };
      return inst;
    }
    var stringbool = (...args) => core._stringbool({
      Codec: exports.ZodCodec,
      Boolean: exports.ZodBoolean,
      String: exports.ZodString
    }, ...args);
    exports.stringbool = stringbool;
    function json(params) {
      const jsonSchema = lazy(() => {
        return union([string(params), number(), boolean(), _null(), array(jsonSchema), record(string(), jsonSchema)]);
      });
      return jsonSchema;
    }
    function preprocess(fn, schema) {
      return new exports.ZodPreprocess({
        type: "pipe",
        in: transform(fn),
        out: schema
      });
    }
  }
});

// node_modules/zod/v4/classic/compat.cjs
var require_compat = __commonJS({
  "node_modules/zod/v4/classic/compat.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodFirstPartyTypeKind = exports.config = exports.$brand = exports.ZodIssueCode = void 0;
    exports.setErrorMap = setErrorMap;
    exports.getErrorMap = getErrorMap;
    var core = __importStar(require_core2());
    exports.ZodIssueCode = {
      invalid_type: "invalid_type",
      too_big: "too_big",
      too_small: "too_small",
      invalid_format: "invalid_format",
      not_multiple_of: "not_multiple_of",
      unrecognized_keys: "unrecognized_keys",
      invalid_union: "invalid_union",
      invalid_key: "invalid_key",
      invalid_element: "invalid_element",
      invalid_value: "invalid_value",
      custom: "custom"
    };
    var index_js_1 = require_core2();
    Object.defineProperty(exports, "$brand", { enumerable: true, get: function() {
      return index_js_1.$brand;
    } });
    Object.defineProperty(exports, "config", { enumerable: true, get: function() {
      return index_js_1.config;
    } });
    function setErrorMap(map) {
      core.config({
        customError: map
      });
    }
    function getErrorMap() {
      return core.config().customError;
    }
    var ZodFirstPartyTypeKind;
    /* @__PURE__ */ (function(ZodFirstPartyTypeKind2) {
    })(ZodFirstPartyTypeKind || (exports.ZodFirstPartyTypeKind = ZodFirstPartyTypeKind = {}));
  }
});

// node_modules/zod/v4/classic/from-json-schema.cjs
var require_from_json_schema = __commonJS({
  "node_modules/zod/v4/classic/from-json-schema.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromJSONSchema = fromJSONSchema;
    var registries_js_1 = require_registries();
    var _checks = __importStar(require_checks2());
    var _iso = __importStar(require_iso());
    var _schemas = __importStar(require_schemas2());
    var z2 = {
      ..._schemas,
      ..._checks,
      iso: _iso
    };
    var RECOGNIZED_KEYS = /* @__PURE__ */ new Set([
      // Schema identification
      "$schema",
      "$ref",
      "$defs",
      "definitions",
      // Core schema keywords
      "$id",
      "id",
      "$comment",
      "$anchor",
      "$vocabulary",
      "$dynamicRef",
      "$dynamicAnchor",
      // Type
      "type",
      "enum",
      "const",
      // Composition
      "anyOf",
      "oneOf",
      "allOf",
      "not",
      // Object
      "properties",
      "required",
      "additionalProperties",
      "patternProperties",
      "propertyNames",
      "minProperties",
      "maxProperties",
      // Array
      "items",
      "prefixItems",
      "additionalItems",
      "minItems",
      "maxItems",
      "uniqueItems",
      "contains",
      "minContains",
      "maxContains",
      // String
      "minLength",
      "maxLength",
      "pattern",
      "format",
      // Number
      "minimum",
      "maximum",
      "exclusiveMinimum",
      "exclusiveMaximum",
      "multipleOf",
      // Already handled metadata
      "description",
      "default",
      // Content
      "contentEncoding",
      "contentMediaType",
      "contentSchema",
      // Unsupported (error-throwing)
      "unevaluatedItems",
      "unevaluatedProperties",
      "if",
      "then",
      "else",
      "dependentSchemas",
      "dependentRequired",
      // OpenAPI
      "nullable",
      "readOnly"
    ]);
    function detectVersion(schema, defaultTarget) {
      const $schema = schema.$schema;
      if ($schema === "https://json-schema.org/draft/2020-12/schema") {
        return "draft-2020-12";
      }
      if ($schema === "http://json-schema.org/draft-07/schema#") {
        return "draft-7";
      }
      if ($schema === "http://json-schema.org/draft-04/schema#") {
        return "draft-4";
      }
      return defaultTarget ?? "draft-2020-12";
    }
    function resolveRef(ref, ctx) {
      if (!ref.startsWith("#")) {
        throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
      }
      const path = ref.slice(1).split("/").filter(Boolean);
      if (path.length === 0) {
        return ctx.rootSchema;
      }
      const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
      if (path[0] === defsKey) {
        const key = path[1];
        if (!key || !ctx.defs[key]) {
          throw new Error(`Reference not found: ${ref}`);
        }
        return ctx.defs[key];
      }
      throw new Error(`Reference not found: ${ref}`);
    }
    function convertBaseSchema(schema, ctx) {
      if (schema.not !== void 0) {
        if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) {
          return z2.never();
        }
        throw new Error("not is not supported in Zod (except { not: {} } for never)");
      }
      if (schema.unevaluatedItems !== void 0) {
        throw new Error("unevaluatedItems is not supported");
      }
      if (schema.unevaluatedProperties !== void 0) {
        throw new Error("unevaluatedProperties is not supported");
      }
      if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) {
        throw new Error("Conditional schemas (if/then/else) are not supported");
      }
      if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) {
        throw new Error("dependentSchemas and dependentRequired are not supported");
      }
      if (schema.$ref) {
        const refPath = schema.$ref;
        if (ctx.refs.has(refPath)) {
          return ctx.refs.get(refPath);
        }
        if (ctx.processing.has(refPath)) {
          return z2.lazy(() => {
            if (!ctx.refs.has(refPath)) {
              throw new Error(`Circular reference not resolved: ${refPath}`);
            }
            return ctx.refs.get(refPath);
          });
        }
        ctx.processing.add(refPath);
        const resolved = resolveRef(refPath, ctx);
        const zodSchema2 = convertSchema(resolved, ctx);
        ctx.refs.set(refPath, zodSchema2);
        ctx.processing.delete(refPath);
        return zodSchema2;
      }
      if (schema.enum !== void 0) {
        const enumValues = schema.enum;
        if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) {
          return z2.null();
        }
        if (enumValues.length === 0) {
          return z2.never();
        }
        if (enumValues.length === 1) {
          return z2.literal(enumValues[0]);
        }
        if (enumValues.every((v) => typeof v === "string")) {
          return z2.enum(enumValues);
        }
        const literalSchemas = enumValues.map((v) => z2.literal(v));
        if (literalSchemas.length < 2) {
          return literalSchemas[0];
        }
        return z2.union([literalSchemas[0], literalSchemas[1], ...literalSchemas.slice(2)]);
      }
      if (schema.const !== void 0) {
        return z2.literal(schema.const);
      }
      const type = schema.type;
      if (Array.isArray(type)) {
        const typeSchemas = type.map((t) => {
          const typeSchema = { ...schema, type: t };
          return convertBaseSchema(typeSchema, ctx);
        });
        if (typeSchemas.length === 0) {
          return z2.never();
        }
        if (typeSchemas.length === 1) {
          return typeSchemas[0];
        }
        return z2.union(typeSchemas);
      }
      if (!type) {
        return z2.any();
      }
      let zodSchema;
      switch (type) {
        case "string": {
          let stringSchema = z2.string();
          if (schema.format) {
            const format = schema.format;
            if (format === "email") {
              stringSchema = stringSchema.check(z2.email());
            } else if (format === "uri" || format === "uri-reference") {
              stringSchema = stringSchema.check(z2.url());
            } else if (format === "uuid" || format === "guid") {
              stringSchema = stringSchema.check(z2.uuid());
            } else if (format === "date-time") {
              stringSchema = stringSchema.check(z2.iso.datetime());
            } else if (format === "date") {
              stringSchema = stringSchema.check(z2.iso.date());
            } else if (format === "time") {
              stringSchema = stringSchema.check(z2.iso.time());
            } else if (format === "duration") {
              stringSchema = stringSchema.check(z2.iso.duration());
            } else if (format === "ipv4") {
              stringSchema = stringSchema.check(z2.ipv4());
            } else if (format === "ipv6") {
              stringSchema = stringSchema.check(z2.ipv6());
            } else if (format === "mac") {
              stringSchema = stringSchema.check(z2.mac());
            } else if (format === "cidr") {
              stringSchema = stringSchema.check(z2.cidrv4());
            } else if (format === "cidr-v6") {
              stringSchema = stringSchema.check(z2.cidrv6());
            } else if (format === "base64") {
              stringSchema = stringSchema.check(z2.base64());
            } else if (format === "base64url") {
              stringSchema = stringSchema.check(z2.base64url());
            } else if (format === "e164") {
              stringSchema = stringSchema.check(z2.e164());
            } else if (format === "jwt") {
              stringSchema = stringSchema.check(z2.jwt());
            } else if (format === "emoji") {
              stringSchema = stringSchema.check(z2.emoji());
            } else if (format === "nanoid") {
              stringSchema = stringSchema.check(z2.nanoid());
            } else if (format === "cuid") {
              stringSchema = stringSchema.check(z2.cuid());
            } else if (format === "cuid2") {
              stringSchema = stringSchema.check(z2.cuid2());
            } else if (format === "ulid") {
              stringSchema = stringSchema.check(z2.ulid());
            } else if (format === "xid") {
              stringSchema = stringSchema.check(z2.xid());
            } else if (format === "ksuid") {
              stringSchema = stringSchema.check(z2.ksuid());
            }
          }
          if (typeof schema.minLength === "number") {
            stringSchema = stringSchema.min(schema.minLength);
          }
          if (typeof schema.maxLength === "number") {
            stringSchema = stringSchema.max(schema.maxLength);
          }
          if (schema.pattern) {
            stringSchema = stringSchema.regex(new RegExp(schema.pattern));
          }
          zodSchema = stringSchema;
          break;
        }
        case "number":
        case "integer": {
          let numberSchema = type === "integer" ? z2.number().int() : z2.number();
          if (typeof schema.minimum === "number") {
            numberSchema = numberSchema.min(schema.minimum);
          }
          if (typeof schema.maximum === "number") {
            numberSchema = numberSchema.max(schema.maximum);
          }
          if (typeof schema.exclusiveMinimum === "number") {
            numberSchema = numberSchema.gt(schema.exclusiveMinimum);
          } else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") {
            numberSchema = numberSchema.gt(schema.minimum);
          }
          if (typeof schema.exclusiveMaximum === "number") {
            numberSchema = numberSchema.lt(schema.exclusiveMaximum);
          } else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") {
            numberSchema = numberSchema.lt(schema.maximum);
          }
          if (typeof schema.multipleOf === "number") {
            numberSchema = numberSchema.multipleOf(schema.multipleOf);
          }
          zodSchema = numberSchema;
          break;
        }
        case "boolean": {
          zodSchema = z2.boolean();
          break;
        }
        case "null": {
          zodSchema = z2.null();
          break;
        }
        case "object": {
          const shape = {};
          const properties = schema.properties || {};
          const requiredSet = new Set(schema.required || []);
          for (const [key, propSchema] of Object.entries(properties)) {
            const propZodSchema = convertSchema(propSchema, ctx);
            shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
          }
          if (schema.propertyNames) {
            const keySchema = convertSchema(schema.propertyNames, ctx);
            const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z2.any();
            if (Object.keys(shape).length === 0) {
              zodSchema = z2.record(keySchema, valueSchema);
              break;
            }
            const objectSchema2 = z2.object(shape).passthrough();
            const recordSchema = z2.looseRecord(keySchema, valueSchema);
            zodSchema = z2.intersection(objectSchema2, recordSchema);
            break;
          }
          if (schema.patternProperties) {
            const patternProps = schema.patternProperties;
            const patternKeys = Object.keys(patternProps);
            const looseRecords = [];
            for (const pattern of patternKeys) {
              const patternValue = convertSchema(patternProps[pattern], ctx);
              const keySchema = z2.string().regex(new RegExp(pattern));
              looseRecords.push(z2.looseRecord(keySchema, patternValue));
            }
            const schemasToIntersect = [];
            if (Object.keys(shape).length > 0) {
              schemasToIntersect.push(z2.object(shape).passthrough());
            }
            schemasToIntersect.push(...looseRecords);
            if (schemasToIntersect.length === 0) {
              zodSchema = z2.object({}).passthrough();
            } else if (schemasToIntersect.length === 1) {
              zodSchema = schemasToIntersect[0];
            } else {
              let result2 = z2.intersection(schemasToIntersect[0], schemasToIntersect[1]);
              for (let i = 2; i < schemasToIntersect.length; i++) {
                result2 = z2.intersection(result2, schemasToIntersect[i]);
              }
              zodSchema = result2;
            }
            break;
          }
          const objectSchema = z2.object(shape);
          if (schema.additionalProperties === false) {
            zodSchema = objectSchema.strict();
          } else if (typeof schema.additionalProperties === "object") {
            zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
          } else {
            zodSchema = objectSchema.passthrough();
          }
          break;
        }
        case "array": {
          const prefixItems = schema.prefixItems;
          const items = schema.items;
          if (prefixItems && Array.isArray(prefixItems)) {
            const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
            const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : void 0;
            if (rest) {
              zodSchema = z2.tuple(tupleItems).rest(rest);
            } else {
              zodSchema = z2.tuple(tupleItems);
            }
            if (typeof schema.minItems === "number") {
              zodSchema = zodSchema.check(z2.minLength(schema.minItems));
            }
            if (typeof schema.maxItems === "number") {
              zodSchema = zodSchema.check(z2.maxLength(schema.maxItems));
            }
          } else if (Array.isArray(items)) {
            const tupleItems = items.map((item) => convertSchema(item, ctx));
            const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : void 0;
            if (rest) {
              zodSchema = z2.tuple(tupleItems).rest(rest);
            } else {
              zodSchema = z2.tuple(tupleItems);
            }
            if (typeof schema.minItems === "number") {
              zodSchema = zodSchema.check(z2.minLength(schema.minItems));
            }
            if (typeof schema.maxItems === "number") {
              zodSchema = zodSchema.check(z2.maxLength(schema.maxItems));
            }
          } else if (items !== void 0) {
            const element = convertSchema(items, ctx);
            let arraySchema = z2.array(element);
            if (typeof schema.minItems === "number") {
              arraySchema = arraySchema.min(schema.minItems);
            }
            if (typeof schema.maxItems === "number") {
              arraySchema = arraySchema.max(schema.maxItems);
            }
            zodSchema = arraySchema;
          } else {
            zodSchema = z2.array(z2.any());
          }
          break;
        }
        default:
          throw new Error(`Unsupported type: ${type}`);
      }
      return zodSchema;
    }
    function convertSchema(schema, ctx) {
      if (typeof schema === "boolean") {
        return schema ? z2.any() : z2.never();
      }
      let baseSchema = convertBaseSchema(schema, ctx);
      const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
      if (schema.anyOf && Array.isArray(schema.anyOf)) {
        const options = schema.anyOf.map((s) => convertSchema(s, ctx));
        const anyOfUnion = z2.union(options);
        baseSchema = hasExplicitType ? z2.intersection(baseSchema, anyOfUnion) : anyOfUnion;
      }
      if (schema.oneOf && Array.isArray(schema.oneOf)) {
        const options = schema.oneOf.map((s) => convertSchema(s, ctx));
        const oneOfUnion = z2.xor(options);
        baseSchema = hasExplicitType ? z2.intersection(baseSchema, oneOfUnion) : oneOfUnion;
      }
      if (schema.allOf && Array.isArray(schema.allOf)) {
        if (schema.allOf.length === 0) {
          baseSchema = hasExplicitType ? baseSchema : z2.any();
        } else {
          let result2 = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
          const startIdx = hasExplicitType ? 0 : 1;
          for (let i = startIdx; i < schema.allOf.length; i++) {
            result2 = z2.intersection(result2, convertSchema(schema.allOf[i], ctx));
          }
          baseSchema = result2;
        }
      }
      if (schema.nullable === true && ctx.version === "openapi-3.0") {
        baseSchema = z2.nullable(baseSchema);
      }
      if (schema.readOnly === true) {
        baseSchema = z2.readonly(baseSchema);
      }
      if (schema.default !== void 0) {
        baseSchema = baseSchema.default(schema.default);
      }
      const extraMeta = {};
      const coreMetadataKeys = ["$id", "id", "$comment", "$anchor", "$vocabulary", "$dynamicRef", "$dynamicAnchor"];
      for (const key of coreMetadataKeys) {
        if (key in schema) {
          extraMeta[key] = schema[key];
        }
      }
      const contentMetadataKeys = ["contentEncoding", "contentMediaType", "contentSchema"];
      for (const key of contentMetadataKeys) {
        if (key in schema) {
          extraMeta[key] = schema[key];
        }
      }
      for (const key of Object.keys(schema)) {
        if (!RECOGNIZED_KEYS.has(key)) {
          extraMeta[key] = schema[key];
        }
      }
      if (Object.keys(extraMeta).length > 0) {
        ctx.registry.add(baseSchema, extraMeta);
      }
      if (schema.description) {
        baseSchema = baseSchema.describe(schema.description);
      }
      return baseSchema;
    }
    function fromJSONSchema(schema, params) {
      if (typeof schema === "boolean") {
        return schema ? z2.any() : z2.never();
      }
      let normalized;
      try {
        normalized = JSON.parse(JSON.stringify(schema));
      } catch {
        throw new Error("fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas");
      }
      const version = detectVersion(normalized, params?.defaultTarget);
      const defs = normalized.$defs || normalized.definitions || {};
      const ctx = {
        version,
        defs,
        refs: /* @__PURE__ */ new Map(),
        processing: /* @__PURE__ */ new Set(),
        rootSchema: normalized,
        registry: params?.registry ?? registries_js_1.globalRegistry
      };
      return convertSchema(normalized, ctx);
    }
  }
});

// node_modules/zod/v4/classic/coerce.cjs
var require_coerce = __commonJS({
  "node_modules/zod/v4/classic/coerce.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.string = string;
    exports.number = number;
    exports.boolean = boolean;
    exports.bigint = bigint;
    exports.date = date;
    var core = __importStar(require_core2());
    var schemas = __importStar(require_schemas2());
    function string(params) {
      return core._coercedString(schemas.ZodString, params);
    }
    function number(params) {
      return core._coercedNumber(schemas.ZodNumber, params);
    }
    function boolean(params) {
      return core._coercedBoolean(schemas.ZodBoolean, params);
    }
    function bigint(params) {
      return core._coercedBigint(schemas.ZodBigInt, params);
    }
    function date(params) {
      return core._coercedDate(schemas.ZodDate, params);
    }
  }
});

// node_modules/zod/v4/classic/external.cjs
var require_external = __commonJS({
  "node_modules/zod/v4/classic/external.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coerce = exports.iso = exports.ZodISODuration = exports.ZodISOTime = exports.ZodISODate = exports.ZodISODateTime = exports.locales = exports.fromJSONSchema = exports.toJSONSchema = exports.NEVER = exports.util = exports.TimePrecision = exports.flattenError = exports.formatError = exports.prettifyError = exports.treeifyError = exports.regexes = exports.clone = exports.$brand = exports.$input = exports.$output = exports.config = exports.registry = exports.globalRegistry = exports.core = void 0;
    exports.core = __importStar(require_core2());
    __exportStar(require_schemas2(), exports);
    __exportStar(require_checks2(), exports);
    __exportStar(require_errors2(), exports);
    __exportStar(require_parse2(), exports);
    __exportStar(require_compat(), exports);
    var index_js_1 = require_core2();
    var en_js_1 = __importDefault(require_en());
    (0, index_js_1.config)((0, en_js_1.default)());
    var index_js_2 = require_core2();
    Object.defineProperty(exports, "globalRegistry", { enumerable: true, get: function() {
      return index_js_2.globalRegistry;
    } });
    Object.defineProperty(exports, "registry", { enumerable: true, get: function() {
      return index_js_2.registry;
    } });
    Object.defineProperty(exports, "config", { enumerable: true, get: function() {
      return index_js_2.config;
    } });
    Object.defineProperty(exports, "$output", { enumerable: true, get: function() {
      return index_js_2.$output;
    } });
    Object.defineProperty(exports, "$input", { enumerable: true, get: function() {
      return index_js_2.$input;
    } });
    Object.defineProperty(exports, "$brand", { enumerable: true, get: function() {
      return index_js_2.$brand;
    } });
    Object.defineProperty(exports, "clone", { enumerable: true, get: function() {
      return index_js_2.clone;
    } });
    Object.defineProperty(exports, "regexes", { enumerable: true, get: function() {
      return index_js_2.regexes;
    } });
    Object.defineProperty(exports, "treeifyError", { enumerable: true, get: function() {
      return index_js_2.treeifyError;
    } });
    Object.defineProperty(exports, "prettifyError", { enumerable: true, get: function() {
      return index_js_2.prettifyError;
    } });
    Object.defineProperty(exports, "formatError", { enumerable: true, get: function() {
      return index_js_2.formatError;
    } });
    Object.defineProperty(exports, "flattenError", { enumerable: true, get: function() {
      return index_js_2.flattenError;
    } });
    Object.defineProperty(exports, "TimePrecision", { enumerable: true, get: function() {
      return index_js_2.TimePrecision;
    } });
    Object.defineProperty(exports, "util", { enumerable: true, get: function() {
      return index_js_2.util;
    } });
    Object.defineProperty(exports, "NEVER", { enumerable: true, get: function() {
      return index_js_2.NEVER;
    } });
    var json_schema_processors_js_1 = require_json_schema_processors();
    Object.defineProperty(exports, "toJSONSchema", { enumerable: true, get: function() {
      return json_schema_processors_js_1.toJSONSchema;
    } });
    var from_json_schema_js_1 = require_from_json_schema();
    Object.defineProperty(exports, "fromJSONSchema", { enumerable: true, get: function() {
      return from_json_schema_js_1.fromJSONSchema;
    } });
    exports.locales = __importStar(require_locales());
    var iso_js_1 = require_iso();
    Object.defineProperty(exports, "ZodISODateTime", { enumerable: true, get: function() {
      return iso_js_1.ZodISODateTime;
    } });
    Object.defineProperty(exports, "ZodISODate", { enumerable: true, get: function() {
      return iso_js_1.ZodISODate;
    } });
    Object.defineProperty(exports, "ZodISOTime", { enumerable: true, get: function() {
      return iso_js_1.ZodISOTime;
    } });
    Object.defineProperty(exports, "ZodISODuration", { enumerable: true, get: function() {
      return iso_js_1.ZodISODuration;
    } });
    exports.iso = __importStar(require_iso());
    exports.coerce = __importStar(require_coerce());
  }
});

// node_modules/zod/index.cjs
var require_zod = __commonJS({
  "node_modules/zod/index.cjs"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result2 = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result2, mod, k);
      }
      __setModuleDefault(result2, mod);
      return result2;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.z = void 0;
    var z2 = __importStar(require_external());
    exports.z = z2;
    __exportStar(require_external(), exports);
    exports.default = z2;
  }
});

// src/wire.ts
var import_zod = __toESM(require_zod(), 1);
var rateSchema = import_zod.z.object({
  limit: import_zod.z.number(),
  remaining: import_zod.z.number(),
  reset: import_zod.z.number(),
  source: import_zod.z.union([import_zod.z.literal("core"), import_zod.z.literal("search")])
});
var installMetadataSchema = import_zod.z.object({
  mode: import_zod.z.union([import_zod.z.literal("automatic"), import_zod.z.literal("guided")]),
  source: import_zod.z.union([import_zod.z.literal("github"), import_zod.z.literal("npm"), import_zod.z.literal("tarball"), import_zod.z.literal("manual")]),
  spec: import_zod.z.string(),
  profiles: import_zod.z.array(import_zod.z.string()),
  requiresBuildApproval: import_zod.z.boolean(),
  requiresRestart: import_zod.z.boolean(),
  manualSteps: import_zod.z.boolean(),
  instructionsUrl: import_zod.z.string()
});
var categorySchema = import_zod.z.union([
  import_zod.z.literal("ui"),
  import_zod.z.literal("agents"),
  import_zod.z.literal("developer-tools"),
  import_zod.z.literal("models"),
  import_zod.z.literal("data"),
  import_zod.z.literal("integrations"),
  import_zod.z.literal("media"),
  import_zod.z.literal("security"),
  import_zod.z.literal("observability"),
  import_zod.z.literal("other")
]);
var repoSummarySchema = import_zod.z.object({
  owner: import_zod.z.string(),
  repo: import_zod.z.string(),
  fullName: import_zod.z.string(),
  description: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
  stars: import_zod.z.number(),
  forks: import_zod.z.number(),
  openIssues: import_zod.z.number(),
  language: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
  license: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
  updatedAt: import_zod.z.string(),
  defaultBranch: import_zod.z.string(),
  verifiedCommit: import_zod.z.string(),
  htmlUrl: import_zod.z.string(),
  topics: import_zod.z.array(import_zod.z.string()),
  categories: import_zod.z.array(categorySchema),
  starGrowth7d: import_zod.z.number(),
  packageName: import_zod.z.string(),
  version: import_zod.z.string(),
  bundlePatch: import_zod.z.string(),
  hasClient: import_zod.z.boolean(),
  verifiedAt: import_zod.z.string(),
  install: installMetadataSchema
});
var manifestSchema = import_zod.z.object({
  name: import_zod.z.string(),
  version: import_zod.z.string(),
  description: import_zod.z.string(),
  license: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
  bundlePatch: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
  hasClient: import_zod.z.boolean()
});
var detailsValueSchema = import_zod.z.object({
  repo: import_zod.z.string(),
  ref: import_zod.z.string(),
  resolvedRef: import_zod.z.string(),
  manifest: import_zod.z.union([manifestSchema, import_zod.z.null()]),
  patch: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
  readmeUrl: import_zod.z.string(),
  rate: rateSchema
});
var guidedAgentTaskValueSchema = import_zod.z.object({
  repository: import_zod.z.string(),
  packageName: import_zod.z.string(),
  version: import_zod.z.string(),
  verifiedCommit: import_zod.z.string(),
  profile: import_zod.z.string(),
  workspaceDir: import_zod.z.string(),
  title: import_zod.z.string(),
  prompt: import_zod.z.string(),
  instructionsUrl: import_zod.z.string(),
  assessment: import_zod.z.string(),
  requiresBuildApproval: import_zod.z.boolean(),
  lifecycleScripts: import_zod.z.array(import_zod.z.string())
});
var searchValueSchema = import_zod.z.object({
  totalCount: import_zod.z.number(),
  items: import_zod.z.array(repoSummarySchema),
  rate: rateSchema
});
var jobIdValueSchema = import_zod.z.object({ jobId: import_zod.z.string() });
var jobStatusValueSchema = import_zod.z.object({
  jobId: import_zod.z.string(),
  kind: import_zod.z.string(),
  packageName: import_zod.z.string(),
  phase: import_zod.z.string(),
  log: import_zod.z.string(),
  exitCode: import_zod.z.union([import_zod.z.number(), import_zod.z.null()]),
  startedAt: import_zod.z.number(),
  finishedAt: import_zod.z.union([import_zod.z.number(), import_zod.z.null()]),
  outcome: import_zod.z.union([import_zod.z.object({
    packageName: import_zod.z.string(),
    version: import_zod.z.string(),
    requiresRestart: import_zod.z.boolean()
  }), import_zod.z.null()]),
  failure: import_zod.z.union([import_zod.z.object({
    code: import_zod.z.string(),
    message: import_zod.z.string()
  }), import_zod.z.null()])
});
var jobsValueSchema = import_zod.z.array(jobStatusValueSchema);
var conflictProviderSchema = import_zod.z.object({
  bundle: import_zod.z.string(),
  packageName: import_zod.z.string(),
  id: import_zod.z.string()
});
var conflictSchema = import_zod.z.union([
  import_zod.z.object({
    kind: import_zod.z.literal("service"),
    service: import_zod.z.string(),
    packages: import_zod.z.array(import_zod.z.string()),
    providers: import_zod.z.array(conflictProviderSchema).optional()
  }),
  import_zod.z.object({
    kind: import_zod.z.literal("duplicate-id"),
    id: import_zod.z.string(),
    packages: import_zod.z.array(import_zod.z.string()),
    providers: import_zod.z.array(conflictProviderSchema).optional()
  })
]);
var installedValueSchema = import_zod.z.object({
  profile: import_zod.z.string(),
  installDir: import_zod.z.string().optional(),
  installDirCustom: import_zod.z.boolean().optional(),
  conflicts: import_zod.z.array(conflictSchema).optional(),
  entries: import_zod.z.array(import_zod.z.object({
    packageName: import_zod.z.string(),
    version: import_zod.z.string(),
    isBundle: import_zod.z.boolean(),
    linked: import_zod.z.boolean(),
    location: import_zod.z.string(),
    enabled: import_zod.z.boolean(),
    currentSpec: import_zod.z.string(),
    description: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
    repositoryUrl: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
    registryRepo: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
    availableVersion: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
    availableVersionSource: import_zod.z.union([import_zod.z.literal("registry"), import_zod.z.literal("repository"), import_zod.z.null()]),
    verifiedCommit: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]),
    updateAvailable: import_zod.z.boolean(),
    canUpdate: import_zod.z.boolean(),
    install: import_zod.z.union([installMetadataSchema, import_zod.z.null()])
  }))
});
var installedRequestSchema = import_zod.z.object({ refresh: import_zod.z.boolean() });
var searchRequestSchema = import_zod.z.object({
  query: import_zod.z.string(),
  page: import_zod.z.number(),
  sort: import_zod.z.union([import_zod.z.literal("stars"), import_zod.z.literal("updated"), import_zod.z.literal("trending")]),
  category: import_zod.z.union([import_zod.z.literal("all"), categorySchema])
});
var detailsRequestSchema = import_zod.z.object({
  repo: import_zod.z.string(),
  ref: import_zod.z.string()
});
var installRequestSchema = import_zod.z.object({
  repo: import_zod.z.string(),
  ref: import_zod.z.string()
});
var batchUpdateRequestSchema = import_zod.z.object({
  updates: import_zod.z.array(installRequestSchema).min(1).max(50)
});
var batchPackageRequestSchema = import_zod.z.object({
  packageNames: import_zod.z.array(import_zod.z.string()).min(1).max(50)
});
var batchToggleRequestSchema = batchPackageRequestSchema.extend({ enabled: import_zod.z.boolean() });
var manualInstallRequestSchema = import_zod.z.object({ command: import_zod.z.string() });
var manualInstallValueSchema = import_zod.z.object({
  jobId: import_zod.z.string(),
  operation: import_zod.z.union([import_zod.z.literal("install"), import_zod.z.literal("update")]),
  packageName: import_zod.z.string(),
  repository: import_zod.z.string(),
  verifiedCommit: import_zod.z.string()
});
var guidedAgentRequestSchema = installRequestSchema.extend({
  operation: import_zod.z.union([import_zod.z.literal("install"), import_zod.z.literal("update")])
});
var jobStatusRequestSchema = import_zod.z.object({
  jobId: import_zod.z.string()
});
var uninstallRequestSchema = import_zod.z.object({
  packageName: import_zod.z.string()
});
var toggleRequestSchema = import_zod.z.object({
  packageName: import_zod.z.string(),
  enabled: import_zod.z.boolean()
});
var toggleValueSchema = import_zod.z.object({
  packageName: import_zod.z.string(),
  enabled: import_zod.z.boolean(),
  requiresRestart: import_zod.z.boolean()
});
var restartValueSchema = import_zod.z.object({
  accepted: import_zod.z.literal(true),
  profile: import_zod.z.string()
});
var installDirRequestSchema = import_zod.z.object({ installDir: import_zod.z.string() });
var installDirValueSchema = import_zod.z.object({
  profile: import_zod.z.string(),
  packageNames: import_zod.z.array(import_zod.z.string()),
  installDir: import_zod.z.string(),
  installDirCustom: import_zod.z.boolean()
});
var agentWorkspaceRequestSchema = import_zod.z.object({ workspaceDir: import_zod.z.string() });
var agentWorkspaceValueSchema = import_zod.z.object({
  workspaceDir: import_zod.z.string(),
  workspaceDirCustom: import_zod.z.boolean()
});
var batchUpdateValueSchema = import_zod.z.object({
  jobs: import_zod.z.array(import_zod.z.object({ jobId: import_zod.z.string(), packageName: import_zod.z.string() })),
  failures: import_zod.z.array(import_zod.z.object({ repo: import_zod.z.string(), message: import_zod.z.string() }))
});
var batchUninstallValueSchema = import_zod.z.object({
  jobs: import_zod.z.array(import_zod.z.object({ jobId: import_zod.z.string(), packageName: import_zod.z.string() })),
  failures: import_zod.z.array(import_zod.z.object({ packageName: import_zod.z.string(), message: import_zod.z.string() }))
});
var batchToggleValueSchema = import_zod.z.object({
  results: import_zod.z.array(toggleValueSchema),
  failures: import_zod.z.array(import_zod.z.object({ packageName: import_zod.z.string(), message: import_zod.z.string() })),
  requiresRestart: import_zod.z.boolean()
});
var diagnoseConflictsValueSchema = import_zod.z.object({
  conflicts: import_zod.z.array(conflictSchema),
  scannedAt: import_zod.z.number()
});
var failureSchema = import_zod.z.object({
  code: import_zod.z.string(),
  message: import_zod.z.string(),
  details: import_zod.z.unknown()
});
function resultSchema(value) {
  return import_zod.z.union([
    import_zod.z.object({ ok: import_zod.z.literal(true), value }),
    import_zod.z.object({ ok: import_zod.z.literal(false), error: failureSchema })
  ]);
}
function codec(schema, typeSymbol) {
  return {
    mode: "strict",
    typeSymbol,
    schema,
    create: () => ({ parse: (value) => schema.parse(value) })
  };
}
function param(name, schema, typeSymbol) {
  return {
    name,
    wire: name,
    source: "json",
    codec: codec(schema, typeSymbol)
  };
}
function result(schema, typeSymbol) {
  return codec(schema, typeSymbol);
}
var PKG = "dsh-plugin-marketplace";
var NS = "marketplace";
function invocation(method, parameters, codec2, implementation) {
  return {
    id: `${PKG}#${NS}/${method}`,
    service: NS,
    namespace: NS,
    method,
    invocation: { kind: "direct" },
    ...implementation === void 0 ? {} : { implementation },
    parameters,
    result: codec2
  };
}
var REQUEST_TYPES = `${PKG}/types#`;
var TYPERT = {
  package: PKG,
  face: "host",
  schemas: [],
  invocations: [
    invocation("search", [param("request", searchRequestSchema, `${REQUEST_TYPES}MarketplaceSearchRequest`)], result(resultSchema(searchValueSchema), `${REQUEST_TYPES}MarketplaceSearchOutcome`)),
    invocation("details", [param("request", detailsRequestSchema, `${REQUEST_TYPES}MarketplaceDetailsRequest`)], result(resultSchema(detailsValueSchema), `${REQUEST_TYPES}MarketplaceDetailsOutcome`)),
    invocation("guidedTask", [param("request", guidedAgentRequestSchema, `${REQUEST_TYPES}MarketplaceGuidedAgentRequest`)], result(resultSchema(guidedAgentTaskValueSchema), `${REQUEST_TYPES}MarketplaceGuidedAgentOutcome`)),
    invocation("installPlugin", [param("request", installRequestSchema, `${REQUEST_TYPES}MarketplaceInstallRequest`)], result(resultSchema(jobIdValueSchema), `${REQUEST_TYPES}MarketplaceInstallOutcome`)),
    invocation("manualInstall", [param("request", manualInstallRequestSchema, `${REQUEST_TYPES}MarketplaceManualInstallRequest`)], result(resultSchema(manualInstallValueSchema), `${REQUEST_TYPES}MarketplaceManualInstallOutcome`)),
    invocation("update", [param("request", installRequestSchema, `${REQUEST_TYPES}MarketplaceInstallRequest`)], result(resultSchema(jobIdValueSchema), `${REQUEST_TYPES}MarketplaceInstallOutcome`)),
    invocation("updateBatch", [param("request", batchUpdateRequestSchema, `${REQUEST_TYPES}MarketplaceBatchUpdateRequest`)], result(resultSchema(batchUpdateValueSchema), `${REQUEST_TYPES}MarketplaceBatchUpdateOutcome`)),
    invocation("uninstall", [param("request", uninstallRequestSchema, `${REQUEST_TYPES}MarketplaceUninstallRequest`)], result(resultSchema(jobIdValueSchema), `${REQUEST_TYPES}MarketplaceInstallOutcome`)),
    invocation("uninstallBatch", [param("request", batchPackageRequestSchema, `${REQUEST_TYPES}MarketplaceBatchPackageRequest`)], result(resultSchema(batchUninstallValueSchema), `${REQUEST_TYPES}MarketplaceBatchUninstallOutcome`)),
    invocation("setEnabled", [param("request", toggleRequestSchema, `${REQUEST_TYPES}MarketplaceToggleRequest`)], result(resultSchema(toggleValueSchema), `${REQUEST_TYPES}MarketplaceToggleOutcome`)),
    invocation("setEnabledBatch", [param("request", batchToggleRequestSchema, `${REQUEST_TYPES}MarketplaceBatchToggleRequest`)], result(resultSchema(batchToggleValueSchema), `${REQUEST_TYPES}MarketplaceBatchToggleOutcome`)),
    invocation("jobStatus", [param("request", jobStatusRequestSchema, `${REQUEST_TYPES}MarketplaceJobStatusRequest`)], result(resultSchema(jobStatusValueSchema), `${REQUEST_TYPES}MarketplaceJobStatusOutcome`)),
    invocation("jobs", [], result(resultSchema(jobsValueSchema), `${REQUEST_TYPES}MarketplaceJobsOutcome`), "listJobs"),
    invocation("installed", [param("request", installedRequestSchema, `${REQUEST_TYPES}MarketplaceInstalledRequest`)], result(resultSchema(installedValueSchema), `${REQUEST_TYPES}MarketplaceInstalledOutcome`)),
    invocation("installLocation", [], result(resultSchema(installDirValueSchema), `${REQUEST_TYPES}MarketplaceInstallLocationOutcome`)),
    invocation("setInstallDir", [param("request", installDirRequestSchema, `${REQUEST_TYPES}MarketplaceInstallDirRequest`)], result(resultSchema(installDirValueSchema), `${REQUEST_TYPES}MarketplaceInstallDirOutcome`)),
    invocation("agentWorkspace", [], result(resultSchema(agentWorkspaceValueSchema), `${REQUEST_TYPES}MarketplaceAgentWorkspaceOutcome`)),
    invocation("setAgentWorkspaceDir", [param("request", agentWorkspaceRequestSchema, `${REQUEST_TYPES}MarketplaceAgentWorkspaceRequest`)], result(resultSchema(agentWorkspaceValueSchema), `${REQUEST_TYPES}MarketplaceAgentWorkspaceOutcome`)),
    invocation("diagnoseConflicts", [], result(resultSchema(diagnoseConflictsValueSchema), `${REQUEST_TYPES}MarketplaceDiagnoseConflictsOutcome`)),
    invocation("restart", [], result(resultSchema(restartValueSchema), `${REQUEST_TYPES}MarketplaceRestartOutcome`))
  ],
  model: {
    services: [],
    events: [],
    objects: []
  }
};
var TYPERT_REMOTE = {
  package: PKG,
  descriptors: TYPERT.invocations
};
export {
  TYPERT
};
