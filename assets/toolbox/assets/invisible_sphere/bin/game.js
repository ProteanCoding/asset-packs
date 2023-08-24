;
/*! code */;
eval("var __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __values = (this && this.__values) || function(o) {\r\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === \"number\") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\r\n};\r\n/// <reference path=\"./types.d.ts\" />\r\ndefine(\"e64d56c0-9d68-4292-abae-1df6b239dd9f/node_modules/decentraland-builder-scripts/channel\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    exports.createChannel = void 0;\r\n    var REQUEST_VALUE = '__request_value__';\r\n    var REPLY_VALUE = '__reply_value__';\r\n    var POLL_INTERVAL = 5000;\r\n    function createChannel(id, host, bus) {\r\n        var handlers = {};\r\n        var requests = {};\r\n        var responses = {};\r\n        bus.on(host.name, function (action) {\r\n            var handler = handlers[action.actionId];\r\n            if (handler) {\r\n                handler(action);\r\n            }\r\n            // clear all pending requests for this entity\r\n            requests = {};\r\n        });\r\n        bus.on(REQUEST_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key;\r\n                var response = responses[key];\r\n                if (response) {\r\n                    var value = response();\r\n                    var reply = {\r\n                        entityName: host.name,\r\n                        key: key,\r\n                        sender: id,\r\n                        value: value\r\n                    };\r\n                    bus.emit(REPLY_VALUE, reply);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        bus.on(REPLY_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key, value = message.value;\r\n                var request = requests[key];\r\n                if (request) {\r\n                    request(value);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        return {\r\n            id: id,\r\n            bus: bus,\r\n            createAction: function (actionId, values) {\r\n                var action = {\r\n                    entityName: host.name,\r\n                    actionId: actionId,\r\n                    values: values\r\n                };\r\n                return action;\r\n            },\r\n            sendActions: function (actions) {\r\n                var e_1, _a;\r\n                if (actions === void 0) { actions = []; }\r\n                try {\r\n                    for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {\r\n                        var base = actions_1_1.value;\r\n                        var action = __assign(__assign({}, base), { sender: id });\r\n                        bus.emit(action.entityName, action);\r\n                    }\r\n                }\r\n                catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n                finally {\r\n                    try {\r\n                        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);\r\n                    }\r\n                    finally { if (e_1) throw e_1.error; }\r\n                }\r\n            },\r\n            handleAction: function (actionId, handler) {\r\n                handlers[actionId] = handler;\r\n            },\r\n            request: function (key, callback) {\r\n                requests[key] = callback;\r\n                var request = { entityName: host.name, key: key, sender: id };\r\n                var interval = setInterval(function () {\r\n                    if (key in requests) {\r\n                        bus.emit(REQUEST_VALUE, request);\r\n                    }\r\n                    else {\r\n                        clearInterval(interval);\r\n                    }\r\n                }, POLL_INTERVAL);\r\n            },\r\n            reply: function (key, callback) {\r\n                responses[key] = callback;\r\n            }\r\n        };\r\n    }\r\n    exports.createChannel = createChannel;\r\n});\r\n/// <reference path=\"./types.d.ts\" />\r\ndefine(\"e64d56c0-9d68-4292-abae-1df6b239dd9f/node_modules/decentraland-builder-scripts/inventory\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    exports.createInventory = void 0;\r\n    function createInventory(UICanvas, UIContainerStack, UIImage) {\r\n        var canvas = null;\r\n        var container = null;\r\n        var images = {};\r\n        function getContainer() {\r\n            if (!canvas) {\r\n                canvas = new UICanvas();\r\n            }\r\n            if (!container) {\r\n                container = new UIContainerStack(canvas);\r\n                container.isPointerBlocker = false;\r\n                container.vAlign = 'bottom';\r\n                container.hAlign = 'right';\r\n                container.stackOrientation = 0;\r\n                container.spacing = 0;\r\n                container.positionY = 75;\r\n                container.positionX = -25;\r\n            }\r\n            return container;\r\n        }\r\n        return {\r\n            add: function (id, texture) {\r\n                var image = images[id] || new UIImage(getContainer(), texture);\r\n                image.width = 128;\r\n                image.height = 128;\r\n                image.sourceTop = 0;\r\n                image.sourceLeft = 0;\r\n                image.sourceHeight = 256;\r\n                image.sourceWidth = 256;\r\n                image.isPointerBlocker = false;\r\n                image.visible = true;\r\n                images[id] = image;\r\n            },\r\n            remove: function (id) {\r\n                var image = images[id];\r\n                if (image) {\r\n                    image.visible = false;\r\n                    image.height = 0;\r\n                    image.width = 0;\r\n                }\r\n            },\r\n            has: function (id) {\r\n                return id in images && images[id].visible;\r\n            }\r\n        };\r\n    }\r\n    exports.createInventory = createInventory;\r\n});\r\n/// <reference path=\"./types.d.ts\" />\r\ndefine(\"e64d56c0-9d68-4292-abae-1df6b239dd9f/node_modules/decentraland-builder-scripts/spawner\", [\"require\", \"exports\", \"node_modules/decentraland-builder-scripts/channel\", \"node_modules/decentraland-builder-scripts/inventory\"], function (require, exports, channel_1, inventory_1) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    exports.Spawner = void 0;\r\n    var bus = new MessageBus();\r\n    var Spawner = /** @class */ (function () {\r\n        function Spawner(script) {\r\n            var inventory = inventory_1.createInventory(UICanvas, UIContainerStack, UIImage);\r\n            script.init({ inventory: inventory });\r\n            this.script = script;\r\n        }\r\n        Spawner.prototype.spawn = function (name, transform, props) {\r\n            if (transform === void 0) { transform = new Transform({ position: new Vector3(8, 0, 8) }); }\r\n            var host = new Entity(name);\r\n            host.addComponent(transform);\r\n            engine.addEntity(host);\r\n            var channel = channel_1.createChannel('channel-id', host, bus);\r\n            this.script.spawn(host, props || {}, channel);\r\n        };\r\n        return Spawner;\r\n    }());\r\n    exports.Spawner = Spawner;\r\n});\r\ndefine(\"e64d56c0-9d68-4292-abae-1df6b239dd9f/game\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n});\r\n//import InvisibleWall, { Props } from './item'\r\n//\r\n//const wall = new InvisibleWall()\r\n//const spawner = new Spawner<Props>(wall)\r\n//\r\n//spawner.spawn(\r\n//  'wall1',\r\n//  new Transform({\r\n//    position: new Vector3(8, 0, 8),\r\n//    scale: new Vector3(8, 1, 8),\r\n//    rotation: Quaternion.Euler(90, 45, 0)\r\n//  })\r\n//)\r\n//declare var console\r\n////console.log(engine)\r\n//\r\ndefine(\"e64d56c0-9d68-4292-abae-1df6b239dd9f/item\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    var invisibleCube = new BoxShape();\r\n    invisibleCube.visible = false;\r\n    invisibleCube.withCollisions = false;\r\n    invisibleCube.isPointerBlocker = false;\r\n    var Button = /** @class */ (function () {\r\n        function Button() {\r\n            this.active = {};\r\n        }\r\n        Button.prototype.init = function () { };\r\n        Button.prototype.setEnabled = function (host, ent, enabled) {\r\n            if (enabled) {\r\n                ent.removeComponent(BoxShape);\r\n                ent.addComponentOrReplace(new GLTFShape('e64d56c0-9d68-4292-abae-1df6b239dd9f/models/Collider.glb'));\r\n            }\r\n            else if (ent.hasComponent(GLTFShape)) {\r\n                ent.removeComponent(GLTFShape);\r\n                ent.addComponentOrReplace(invisibleCube);\r\n            }\r\n        };\r\n        Button.prototype.spawn = function (host, props, channel) {\r\n            var _this = this;\r\n            var shape = new GLTFShape('e64d56c0-9d68-4292-abae-1df6b239dd9f/models/Collider.glb');\r\n            var ent = new Entity();\r\n            ent.setParent(host);\r\n            ent.addComponent(shape);\r\n            ent.addComponent(new Transform({ position: new Vector3(0, 0, 0) }));\r\n            this.setEnabled(host, ent, props.enabled);\r\n            channel.handleAction('enable', function () {\r\n                _this.setEnabled(host, ent, true);\r\n            });\r\n            channel.handleAction('disable', function () {\r\n                _this.setEnabled(host, ent, false);\r\n            });\r\n            // sync initial values\r\n            channel.request('enabled', function (enabled) {\r\n                _this.setEnabled(host, ent, enabled);\r\n            });\r\n            channel.reply('enabled', function () { return _this.active[host.name]; });\r\n        };\r\n        return Button;\r\n    }());\r\n    exports.default = Button;\r\n});\r\n");