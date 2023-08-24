eval('var __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __values = (this && this.__values) || function(o) {\r\n    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === "number") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");\r\n};\r\n/// <reference path="./types.d.ts" />\r\ndefine("4d34d651-8231-4a8f-82bd-d9d3b71505aa/node_modules/decentraland-builder-scripts/channel", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var REQUEST_VALUE = \'__request_value__\';\r\n    var REPLY_VALUE = \'__reply_value__\';\r\n    var POLL_INTERVAL = 5000;\r\n    function createChannel(id, host, bus) {\r\n        var handlers = {};\r\n        var requests = {};\r\n        var responses = {};\r\n        bus.on(host.name, function (action) {\r\n            var handler = handlers[action.actionId];\r\n            if (handler) {\r\n                handler(action);\r\n            }\r\n            // clear all pending requests for this entity\r\n            requests = {};\r\n        });\r\n        bus.on(REQUEST_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key;\r\n                var response = responses[key];\r\n                if (response) {\r\n                    var value = response();\r\n                    var reply = {\r\n                        entityName: host.name,\r\n                        key: key,\r\n                        sender: id,\r\n                        value: value\r\n                    };\r\n                    bus.emit(REPLY_VALUE, reply);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        bus.on(REPLY_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key, value = message.value;\r\n                var request = requests[key];\r\n                if (request) {\r\n                    request(value);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        return {\r\n            id: id,\r\n            bus: bus,\r\n            createAction: function (actionId, values) {\r\n                var action = {\r\n                    entityName: host.name,\r\n                    actionId: actionId,\r\n                    values: values\r\n                };\r\n                return action;\r\n            },\r\n            sendActions: function (actions) {\r\n                var e_1, _a;\r\n                if (actions === void 0) { actions = []; }\r\n                try {\r\n                    for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {\r\n                        var base = actions_1_1.value;\r\n                        var action = __assign(__assign({}, base), { sender: id });\r\n                        bus.emit(action.entityName, action);\r\n                    }\r\n                }\r\n                catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n                finally {\r\n                    try {\r\n                        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);\r\n                    }\r\n                    finally { if (e_1) throw e_1.error; }\r\n                }\r\n            },\r\n            handleAction: function (actionId, handler) {\r\n                handlers[actionId] = handler;\r\n            },\r\n            request: function (key, callback) {\r\n                requests[key] = callback;\r\n                var request = { entityName: host.name, key: key, sender: id };\r\n                var interval = setInterval(function () {\r\n                    if (key in requests) {\r\n                        bus.emit(REQUEST_VALUE, request);\r\n                    }\r\n                    else {\r\n                        clearInterval(interval);\r\n                    }\r\n                }, POLL_INTERVAL);\r\n            },\r\n            reply: function (key, callback) {\r\n                responses[key] = callback;\r\n            }\r\n        };\r\n    }\r\n    exports.createChannel = createChannel;\r\n});\r\n/// <reference path="./types.d.ts" />\r\ndefine("4d34d651-8231-4a8f-82bd-d9d3b71505aa/node_modules/decentraland-builder-scripts/spawner", ["require", "exports", "node_modules/decentraland-builder-scripts/channel"], function (require, exports, channel_1) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var bus = new MessageBus();\r\n    var Spawner = /** @class */ (function () {\r\n        function Spawner(script) {\r\n            script.init();\r\n            this.script = script;\r\n        }\r\n        Spawner.prototype.spawn = function (name, transform, props) {\r\n            if (transform === void 0) { transform = new Transform({ position: new Vector3(8, 0, 8) }); }\r\n            var host = new Entity(name);\r\n            host.addComponent(transform);\r\n            engine.addEntity(host);\r\n            var channel = channel_1.createChannel(\'channel-id\', host, bus);\r\n            this.script.spawn(host, props || {}, channel);\r\n        };\r\n        return Spawner;\r\n    }());\r\n    exports.Spawner = Spawner;\r\n});\r\ndefine("4d34d651-8231-4a8f-82bd-d9d3b71505aa/game", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n});\r\n//import TrapDoor, { Props } from \'./item\'\r\n//\r\n//const door = new TrapDoor()\r\n//const spawner = new Spawner<Props>(door)\r\n//\r\n//spawner.spawn(\'door\', new Transform({ position: new Vector3(4, 1, 8) }), {\r\n//  onClick: [{ entityName: \'door\', actionId: \'toggle\', values: {} }]\r\n//})\r\n//\r\ndefine("4d34d651-8231-4a8f-82bd-d9d3b71505aa/item", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var TrapDoor = /** @class */ (function () {\r\n        function TrapDoor() {\r\n            this.openClip = new AudioClip(\'4d34d651-8231-4a8f-82bd-d9d3b71505aa/sounds/TrapDoor.mp3\');\r\n            this.active = {};\r\n        }\r\n        TrapDoor.prototype.init = function () { };\r\n        TrapDoor.prototype.toggle = function (entity, value, playSound) {\r\n            if (playSound === void 0) { playSound = true; }\r\n            if (this.active[entity.name] === value)\r\n                return;\r\n            if (playSound) {\r\n                var source = new AudioSource(this.openClip);\r\n                entity.addComponentOrReplace(source);\r\n                source.playing = true;\r\n            }\r\n            var animator = entity.getComponent(Animator);\r\n            var openClip = animator.getClip(\'open\');\r\n            var closeClip = animator.getClip(\'close\');\r\n            openClip.stop();\r\n            closeClip.stop();\r\n            var clip = value ? openClip : closeClip;\r\n            clip.play();\r\n            var collider = Object.keys(entity.children).map(function (key) { return entity.children[key]; })[0];\r\n            if (collider) {\r\n                collider.addComponentOrReplace(new Transform({\r\n                    scale: value ? new Vector3(0, 0, 0) : new Vector3(1, 1, 1)\r\n                }));\r\n            }\r\n            this.active[entity.name] = value;\r\n        };\r\n        TrapDoor.prototype.spawn = function (host, props, channel) {\r\n            var _this = this;\r\n            var door = new Entity(host.name + \'-trapdoor\');\r\n            door.setParent(host);\r\n            var animator = new Animator();\r\n            var closeClip = new AnimationState(\'close\', { looping: false });\r\n            var openClip = new AnimationState(\'open\', { looping: false });\r\n            animator.addClip(closeClip);\r\n            animator.addClip(openClip);\r\n            door.addComponent(animator);\r\n            openClip.stop();\r\n            door.addComponent(new GLTFShape(\'4d34d651-8231-4a8f-82bd-d9d3b71505aa/models/Trap_Door.glb\'));\r\n            door.getComponent(GLTFShape).withCollisions = false;\r\n            // door.addComponent(\r\n            //   new OnPointerDown(e => {\r\n            //     if (e.hit.length > 4) return\r\n            //     channel.sendActions(props.onClick)\r\n            //   })\r\n            // )\r\n            // collider\r\n            var collider = new Entity(door.name + \'-collider\');\r\n            collider.setParent(door);\r\n            collider.addComponent(new GLTFShape(\'4d34d651-8231-4a8f-82bd-d9d3b71505aa/models/TrapDoor_collider.glb\'));\r\n            this.active[door.name] = false;\r\n            // handle actions\r\n            channel.handleAction(\'open\', function (_a) {\r\n                var sender = _a.sender;\r\n                if (!_this.active[door.name]) {\r\n                    _this.toggle(door, true);\r\n                }\r\n                if (sender === channel.id) {\r\n                    channel.sendActions(props.onOpen);\r\n                }\r\n            });\r\n            channel.handleAction(\'close\', function (_a) {\r\n                var sender = _a.sender;\r\n                if (_this.active[door.name]) {\r\n                    _this.toggle(door, false);\r\n                }\r\n                if (sender === channel.id) {\r\n                    channel.sendActions(props.onClose);\r\n                }\r\n            });\r\n            channel.handleAction(\'toggle\', function (_a) {\r\n                var sender = _a.sender;\r\n                var newValue = !_this.active[door.name];\r\n                _this.toggle(door, newValue);\r\n                if (sender === channel.id) {\r\n                    channel.sendActions(newValue ? props.onOpen : props.onClose);\r\n                }\r\n            });\r\n            // sync initial values\r\n            channel.request(\'isOpen\', function (isOpen) {\r\n                return _this.toggle(door, isOpen, false);\r\n            });\r\n            channel.reply(\'isOpen\', function () { return _this.active[door.name]; });\r\n        };\r\n        return TrapDoor;\r\n    }());\r\n    exports.default = TrapDoor;\r\n});\r\n');