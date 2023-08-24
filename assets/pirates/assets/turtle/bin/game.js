eval('var __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __values = (this && this.__values) || function(o) {\r\n    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === "number") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");\r\n};\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);\r\n};\r\n/// <reference path="./types.d.ts" />\r\ndefine("34bc4fd3-d422-4ffb-b0e5-0fb6a8d0ff8d/node_modules/decentraland-builder-scripts/channel", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var REQUEST_VALUE = \'__request_value__\';\r\n    var REPLY_VALUE = \'__reply_value__\';\r\n    var POLL_INTERVAL = 5000;\r\n    function createChannel(id, host, bus) {\r\n        var handlers = {};\r\n        var requests = {};\r\n        var responses = {};\r\n        bus.on(host.name, function (action) {\r\n            var handler = handlers[action.actionId];\r\n            if (handler) {\r\n                handler(action);\r\n            }\r\n            // clear all pending requests for this entity\r\n            requests = {};\r\n        });\r\n        bus.on(REQUEST_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key;\r\n                var response = responses[key];\r\n                if (response) {\r\n                    var value = response();\r\n                    var reply = {\r\n                        entityName: host.name,\r\n                        key: key,\r\n                        sender: id,\r\n                        value: value\r\n                    };\r\n                    bus.emit(REPLY_VALUE, reply);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        bus.on(REPLY_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key, value = message.value;\r\n                var request = requests[key];\r\n                if (request) {\r\n                    request(value);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        return {\r\n            id: id,\r\n            bus: bus,\r\n            sendActions: function (actions) {\r\n                var e_1, _a;\r\n                if (actions === void 0) { actions = []; }\r\n                try {\r\n                    for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {\r\n                        var base = actions_1_1.value;\r\n                        var action = __assign(__assign({}, base), { sender: id });\r\n                        bus.emit(action.entityName, action);\r\n                    }\r\n                }\r\n                catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n                finally {\r\n                    try {\r\n                        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);\r\n                    }\r\n                    finally { if (e_1) throw e_1.error; }\r\n                }\r\n            },\r\n            handleAction: function (actionId, handler) {\r\n                handlers[actionId] = handler;\r\n            },\r\n            request: function (key, callback) {\r\n                requests[key] = callback;\r\n                var request = { entityName: host.name, key: key, sender: id };\r\n                var interval = setInterval(function () {\r\n                    if (key in requests) {\r\n                        bus.emit(REQUEST_VALUE, request);\r\n                    }\r\n                    else {\r\n                        clearInterval(interval);\r\n                    }\r\n                }, POLL_INTERVAL);\r\n            },\r\n            reply: function (key, callback) {\r\n                responses[key] = callback;\r\n            }\r\n        };\r\n    }\r\n    exports.createChannel = createChannel;\r\n});\r\n/// <reference path="./types.d.ts" />\r\ndefine("34bc4fd3-d422-4ffb-b0e5-0fb6a8d0ff8d/node_modules/decentraland-builder-scripts/spawner", ["require", "exports", "node_modules/decentraland-builder-scripts/channel"], function (require, exports, channel_1) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var bus = new MessageBus();\r\n    var Spawner = /** @class */ (function () {\r\n        function Spawner(script) {\r\n            script.init();\r\n            this.script = script;\r\n        }\r\n        Spawner.prototype.spawn = function (name, transform, props) {\r\n            if (transform === void 0) { transform = new Transform({ position: new Vector3(8, 0, 8) }); }\r\n            var host = new Entity(name);\r\n            host.addComponent(transform);\r\n            engine.addEntity(host);\r\n            var channel = channel_1.createChannel(\'channel-id\', host, bus);\r\n            this.script.spawn(host, props || {}, channel);\r\n        };\r\n        return Spawner;\r\n    }());\r\n    exports.Spawner = Spawner;\r\n});\r\ndefine("34bc4fd3-d422-4ffb-b0e5-0fb6a8d0ff8d/game", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n});\r\n//import Platform, { Props } from \'./item\'\r\n//\r\n//const platform = new Platform()\r\n//const spawner = new Spawner<Props>(platform)\r\n//\r\n//spawner.spawn(\'platform\', new Transform({ position: new Vector3(8, 4, 8) }), {\r\n//  distance: 10,\r\n//  speed: 5,\r\n//  onReachStart: [{ entityName: \'platform\', actionId: \'goToEnd\', values: {} }],\r\n//  onReachEnd: [{ entityName: \'platform\', actionId: \'goToStart\', values: {} }]\r\n//})\r\n//\r\ndefine("34bc4fd3-d422-4ffb-b0e5-0fb6a8d0ff8d/platform", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var HorizontalPlatform = /** @class */ (function () {\r\n        function HorizontalPlatform(channel, distance, speed, onReachStart, onReachEnd) {\r\n            if (distance === void 0) { distance = 10; }\r\n            if (speed === void 0) { speed = 5; }\r\n            this.channel = channel;\r\n            this.distance = distance;\r\n            this.speed = speed;\r\n            this.onReachStart = onReachStart;\r\n            this.onReachEnd = onReachEnd;\r\n            this.transition = -1;\r\n            this.delay = -1; // this is a delay to stop the animation, to prevent a flickr in the transition\r\n            this.position = \'start\';\r\n        }\r\n        HorizontalPlatform = __decorate([\r\n            Component(\'org.decentraland.Turtle\'),\r\n            __metadata("design:paramtypes", [Object, Number, Number, Array, Array])\r\n        ], HorizontalPlatform);\r\n        return HorizontalPlatform;\r\n    }());\r\n    exports.HorizontalPlatform = HorizontalPlatform;\r\n    var startPosition = new Vector3(0, 0, 0);\r\n    var HorizontalPlatformSystem = /** @class */ (function () {\r\n        function HorizontalPlatformSystem() {\r\n            this.group = engine.getComponentGroup(HorizontalPlatform);\r\n        }\r\n        HorizontalPlatformSystem.prototype.update = function (dt) {\r\n            var e_2, _a;\r\n            try {\r\n                for (var _b = __values(this.group.entities), _c = _b.next(); !_c.done; _c = _b.next()) {\r\n                    var entity = _c.value;\r\n                    var platform = entity.getComponent(HorizontalPlatform);\r\n                    var transform = entity.getComponent(Transform);\r\n                    var endPosition = new Vector3(0, 0, -platform.distance);\r\n                    var isStart = platform.position === \'start\';\r\n                    var start = !isStart ? startPosition : endPosition;\r\n                    var end = !isStart ? endPosition : startPosition;\r\n                    var speed = platform.speed / 20;\r\n                    if (platform.transition >= 0 && platform.transition < 1) {\r\n                        platform.transition += dt * speed;\r\n                        transform.position.copyFrom(Vector3.Lerp(start, end, platform.transition));\r\n                    }\r\n                    else if (platform.transition >= 1) {\r\n                        platform.transition = -1;\r\n                        platform.delay = 0;\r\n                        transform.position.copyFrom(end);\r\n                        // send actions\r\n                        if (!isStart && platform.onReachEnd) {\r\n                            platform.channel.sendActions(platform.onReachEnd);\r\n                        }\r\n                        else if (isStart && platform.onReachStart) {\r\n                            platform.channel.sendActions(platform.onReachStart);\r\n                        }\r\n                    }\r\n                    else if (platform.delay >= 0 && platform.delay < 1) {\r\n                        platform.delay += dt;\r\n                    }\r\n                    else if (platform.delay >= 1) {\r\n                        platform.delay = -1;\r\n                    }\r\n                }\r\n            }\r\n            catch (e_2_1) { e_2 = { error: e_2_1 }; }\r\n            finally {\r\n                try {\r\n                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\r\n                }\r\n                finally { if (e_2) throw e_2.error; }\r\n            }\r\n        };\r\n        return HorizontalPlatformSystem;\r\n    }());\r\n    exports.HorizontalPlatformSystem = HorizontalPlatformSystem;\r\n});\r\ndefine("34bc4fd3-d422-4ffb-b0e5-0fb6a8d0ff8d/item", ["require", "exports", \"34bc4fd3-d422-4ffb-b0e5-0fb6a8d0ff8d/platform\"], function (require, exports, platform_1) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var Door = /** @class */ (function () {\r\n        function Door() {\r\n        }\r\n        Door.prototype.init = function () {\r\n            engine.addSystem(new platform_1.HorizontalPlatformSystem());\r\n        };\r\n        Door.prototype.move = function (entity, newPosition, useTransition) {\r\n            if (useTransition === void 0) { useTransition = true; }\r\n            var platform = entity.getComponent(platform_1.HorizontalPlatform);\r\n            var isStart = platform.position === \'start\';\r\n            // compute new value\r\n            if (newPosition === \'end\') {\r\n                if (!isStart)\r\n                    return;\r\n                platform.position = \'end\';\r\n            }\r\n            else if (newPosition === \'start\') {\r\n                if (isStart)\r\n                    return;\r\n                platform.position = \'start\';\r\n            }\r\n            // start transition\r\n            if (useTransition) {\r\n                if (platform.transition === -1) {\r\n                    platform.transition = 0;\r\n                }\r\n                else {\r\n                    platform.transition = 1 - platform.transition;\r\n                }\r\n            }\r\n            else {\r\n                platform.transition = 1;\r\n            }\r\n        };\r\n        Door.prototype.spawn = function (host, props, channel) {\r\n            var _this = this;\r\n            var distance = props.distance, speed = props.speed, autoStart = props.autoStart, onReachStart = props.onReachStart, onReachEnd = props.onReachEnd;\r\n            var platform = new Entity(host.name + \'-platform\');\r\n            platform.setParent(host);\r\n            platform.addComponent(new Transform({ position: new Vector3(0, 0, 0) }));\r\n            platform.addComponent(new GLTFShape(\'34bc4fd3-d422-4ffb-b0e5-0fb6a8d0ff8d/models/Turtle_Main.glb\'));\r\n            platform.addComponent(new platform_1.HorizontalPlatform(channel, distance, speed, onReachStart, onReachEnd));\r\n            // handle actions\r\n            channel.handleAction(\'goToEnd\', function () { return _this.move(platform, \'end\'); });\r\n            channel.handleAction(\'goToStart\', function () { return _this.move(platform, \'start\'); });\r\n            // sync initial values\r\n            channel.request(\'position\', function (position) {\r\n                return _this.move(platform, position, false);\r\n            });\r\n            channel.reply(\'position\', function () { return platform.getComponent(platform_1.HorizontalPlatform).position; });\r\n            // auto start platform\r\n            if (autoStart !== false) {\r\n                var goToEndAction = {\r\n                    entityName: host.name,\r\n                    actionId: \'goToEnd\',\r\n                    values: {}\r\n                };\r\n                channel.sendActions([goToEndAction]);\r\n            }\r\n        };\r\n        return Door;\r\n    }());\r\n    exports.default = Door;\r\n});\r\n');