eval('var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __values = (this && this.__values) || function(o) {\r\n    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === "number") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");\r\n};\r\nvar __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\ndefine("1ab2733f-1782-4521-9eda-6aa8ad684277/utils", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    // Adapted from Threejs\r\n    var Box = /** @class */ (function () {\r\n        function Box(min, max) {\r\n            this.min = new Vector3(+Infinity, +Infinity, +Infinity);\r\n            this.max = new Vector3(-Infinity, -Infinity, -Infinity);\r\n            this.min = min;\r\n            this.max = max;\r\n        }\r\n        Box.prototype.containsPoint = function (point) {\r\n            return point.x < this.min.x ||\r\n                point.x > this.max.x ||\r\n                point.y < this.min.y ||\r\n                point.y > this.max.y ||\r\n                point.z < this.min.z ||\r\n                point.z > this.max.z\r\n                ? false\r\n                : true;\r\n        };\r\n        return Box;\r\n    }());\r\n    exports.Box = Box;\r\n});\r\ndefine("1ab2733f-1782-4521-9eda-6aa8ad684277/area", ["require", "exports", \"1ab2733f-1782-4521-9eda-6aa8ad684277/utils\"], function (require, exports, utils_1) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var TriggerableArea = /** @class */ (function () {\r\n        function TriggerableArea() {\r\n            this.lastState = 0;\r\n            this.enabled = true;\r\n            this._transformCache = \'(0 0 0)\';\r\n        }\r\n        TriggerableArea = __decorate([\r\n            Component(\'org.decentraland.TriggerableArea\')\r\n        ], TriggerableArea);\r\n        return TriggerableArea;\r\n    }());\r\n    exports.TriggerableArea = TriggerableArea;\r\n    function getGlobalPosition(subject) {\r\n        var entityPosition = subject.hasComponent(Transform)\r\n            ? subject.getComponent(Transform).position.clone()\r\n            : Vector3.Zero();\r\n        var parentEntity = subject.getParent();\r\n        if (parentEntity.alive) {\r\n            if (parentEntity != null) {\r\n                var parentRotation = parentEntity.hasComponent(Transform)\r\n                    ? parentEntity.getComponent(Transform).rotation\r\n                    : Quaternion.Identity;\r\n                return getGlobalPosition(parentEntity).add(entityPosition.rotate(parentRotation));\r\n            }\r\n        }\r\n        return entityPosition;\r\n    }\r\n    exports.getGlobalPosition = getGlobalPosition;\r\n    var TriggerableAreaSystem = /** @class */ (function () {\r\n        function TriggerableAreaSystem() {\r\n            this.group = engine.getComponentGroup(TriggerableArea);\r\n        }\r\n        TriggerableAreaSystem.prototype.update = function (_) {\r\n            var e_1, _a;\r\n            try {\r\n                for (var _b = __values(this.group.entities), _c = _b.next(); !_c.done; _c = _b.next()) {\r\n                    var entity = _c.value;\r\n                    var triggerableArea = entity.getComponent(TriggerableArea);\r\n                    var transform = entity.getComponent(Transform);\r\n                    var rotation = transform.rotation, scale = transform.scale;\r\n                    var position = getGlobalPosition(entity);\r\n                    if (triggerableArea.enabled) {\r\n                        var radius = Math.max(Math.max(Math.abs(scale.x), Math.abs(scale.z)), Math.abs(scale.y));\r\n                        var distance = Vector3.DistanceSquared(position, Camera.instance.position);\r\n                        if (distance >\r\n                            (radius + Camera.instance.playerHeight) *\r\n                                (radius + Camera.instance.playerHeight))\r\n                            continue;\r\n                        var transformCache = position + " " + rotation + " " + scale;\r\n                        var inverseMatrix = Matrix.Invert(Matrix.Compose(Vector3.One(), rotation, position));\r\n                        var playerPos = Camera.instance.position.clone();\r\n                        if (transformCache !== triggerableArea._transformCache) {\r\n                            triggerableArea._boxCache = this.computeBoundingBox(transform);\r\n                            triggerableArea._transformCache = transformCache;\r\n                        }\r\n                        // Feet\r\n                        var inversePoint1 = playerPos.subtractFromFloats(0, Camera.instance.playerHeight, 0);\r\n                        inversePoint1.applyMatrix4(inverseMatrix);\r\n                        // Mid body\r\n                        var inversePoint2 = playerPos.subtractFromFloats(0, Camera.instance.playerHeight / 2, 0);\r\n                        inversePoint2.applyMatrix4(inverseMatrix);\r\n                        // Head\r\n                        var inversePoint3 = playerPos.clone();\r\n                        inversePoint3.applyMatrix4(inverseMatrix);\r\n                        if (triggerableArea._boxCache.containsPoint(inversePoint1) ||\r\n                            triggerableArea._boxCache.containsPoint(inversePoint2) ||\r\n                            triggerableArea._boxCache.containsPoint(inversePoint3)) {\r\n                            if (triggerableArea.lastState === 0) {\r\n                                triggerableArea.onEnter();\r\n                            }\r\n                            triggerableArea.lastState = 1;\r\n                        }\r\n                        else {\r\n                            if (triggerableArea.lastState === 1) {\r\n                                triggerableArea.onLeave();\r\n                            }\r\n                            triggerableArea.lastState = 0;\r\n                        }\r\n                    }\r\n                }\r\n            }\r\n            catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n            finally {\r\n                try {\r\n                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\r\n                }\r\n                finally { if (e_1) throw e_1.error; }\r\n            }\r\n        };\r\n        TriggerableAreaSystem.prototype.computeBoundingBox = function (transform) {\r\n            var scale = transform.scale;\r\n            var halfScaleX = scale.x * 0.5;\r\n            var halfScaleZ = scale.z * 0.5;\r\n            var max = new Vector3(halfScaleX, scale.y, halfScaleZ);\r\n            var min = new Vector3(-halfScaleX, 0, -halfScaleZ);\r\n            var inverseBox = new utils_1.Box(min, max);\r\n            return inverseBox;\r\n        };\r\n        return TriggerableAreaSystem;\r\n    }());\r\n    exports.TriggerableAreaSystem = TriggerableAreaSystem;\r\n});\r\n/// <reference path="./types.d.ts" />\r\ndefine("1ab2733f-1782-4521-9eda-6aa8ad684277/node_modules/decentraland-builder-scripts/channel", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var REQUEST_VALUE = \'__request_value__\';\r\n    var REPLY_VALUE = \'__reply_value__\';\r\n    var POLL_INTERVAL = 5000;\r\n    function createChannel(id, host, bus) {\r\n        var handlers = {};\r\n        var requests = {};\r\n        var responses = {};\r\n        bus.on(host.name, function (action) {\r\n            var handler = handlers[action.actionId];\r\n            if (handler) {\r\n                handler(action);\r\n            }\r\n            // clear all pending requests for this entity\r\n            requests = {};\r\n        });\r\n        bus.on(REQUEST_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key;\r\n                var response = responses[key];\r\n                if (response) {\r\n                    var value = response();\r\n                    var reply = {\r\n                        entityName: host.name,\r\n                        key: key,\r\n                        sender: id,\r\n                        value: value\r\n                    };\r\n                    bus.emit(REPLY_VALUE, reply);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        bus.on(REPLY_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key, value = message.value;\r\n                var request = requests[key];\r\n                if (request) {\r\n                    request(value);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        return {\r\n            id: id,\r\n            bus: bus,\r\n            sendActions: function (actions) {\r\n                var e_2, _a;\r\n                if (actions === void 0) { actions = []; }\r\n                try {\r\n                    for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {\r\n                        var base = actions_1_1.value;\r\n                        var action = __assign(__assign({}, base), { sender: id });\r\n                        bus.emit(action.entityName, action);\r\n                    }\r\n                }\r\n                catch (e_2_1) { e_2 = { error: e_2_1 }; }\r\n                finally {\r\n                    try {\r\n                        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);\r\n                    }\r\n                    finally { if (e_2) throw e_2.error; }\r\n                }\r\n            },\r\n            handleAction: function (actionId, handler) {\r\n                handlers[actionId] = handler;\r\n            },\r\n            request: function (key, callback) {\r\n                requests[key] = callback;\r\n                var request = { entityName: host.name, key: key, sender: id };\r\n                var interval = setInterval(function () {\r\n                    if (key in requests) {\r\n                        bus.emit(REQUEST_VALUE, request);\r\n                    }\r\n                    else {\r\n                        clearInterval(interval);\r\n                    }\r\n                }, POLL_INTERVAL);\r\n            },\r\n            reply: function (key, callback) {\r\n                responses[key] = callback;\r\n            }\r\n        };\r\n    }\r\n    exports.createChannel = createChannel;\r\n});\r\n/// <reference path="./types.d.ts" />\r\ndefine("1ab2733f-1782-4521-9eda-6aa8ad684277/node_modules/decentraland-builder-scripts/spawner", ["require", "exports", "node_modules/decentraland-builder-scripts/channel"], function (require, exports, channel_1) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var bus = new MessageBus();\r\n    var Spawner = /** @class */ (function () {\r\n        function Spawner(script) {\r\n            script.init();\r\n            this.script = script;\r\n        }\r\n        Spawner.prototype.spawn = function (name, transform, props) {\r\n            if (transform === void 0) { transform = new Transform({ position: new Vector3(8, 0, 8) }); }\r\n            var host = new Entity(name);\r\n            host.addComponent(transform);\r\n            engine.addEntity(host);\r\n            var channel = channel_1.createChannel(\'channel-id\', host, bus);\r\n            this.script.spawn(host, props || {}, channel);\r\n        };\r\n        return Spawner;\r\n    }());\r\n    exports.Spawner = Spawner;\r\n});\r\ndefine("1ab2733f-1782-4521-9eda-6aa8ad684277/game", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n});\r\n//import AreaTrigger, { Props } from \'./item\'\r\n//\r\n//const area = new AreaTrigger()\r\n//const spawner = new Spawner<Props>(area)\r\n//\r\n//spawner.spawn(\r\n//  \'area1\',\r\n//  new Transform({\r\n//    position: new Vector3(8, 0, 8),\r\n//    scale: new Vector3(8, 1, 4),\r\n//    rotation: Quaternion.Euler(90, 0, 0)\r\n//  })\r\n//)\r\n//\r\ndefine("1ab2733f-1782-4521-9eda-6aa8ad684277/item", ["require", "exports", \"1ab2733f-1782-4521-9eda-6aa8ad684277/area\"], function (require, exports, area_1) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var Button = /** @class */ (function () {\r\n        function Button() {\r\n        }\r\n        Button.prototype.init = function () {\r\n            engine.addSystem(new area_1.TriggerableAreaSystem());\r\n        };\r\n        Button.prototype.spawn = function (host, props, channel) {\r\n            var trigger = new area_1.TriggerableArea();\r\n            trigger.enabled = props.enabled;\r\n            channel.handleAction(\'enable\', function () {\r\n                trigger.enabled = true;\r\n            });\r\n            channel.handleAction(\'disable\', function () {\r\n                trigger.enabled = false;\r\n            });\r\n            trigger.onEnter = function () {\r\n                if (trigger.enabled) {\r\n                    channel.sendActions(props.onEnter);\r\n                }\r\n            };\r\n            trigger.onLeave = function () {\r\n                if (trigger.enabled) {\r\n                    channel.sendActions(props.onLeave);\r\n                }\r\n            };\r\n            // sync initial values\r\n            channel.request(\'enabled\', function (enabled) { return (trigger.enabled = enabled); });\r\n            channel.reply(\'enabled\', function () { return trigger.enabled; });\r\n            host.addComponent(trigger);\r\n        };\r\n        return Button;\r\n    }());\r\n    exports.default = Button;\r\n});\r\n');