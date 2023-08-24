eval('var __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __values = (this && this.__values) || function(o) {\r\n    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === "number") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");\r\n};\r\nvar __read = (this && this.__read) || function (o, n) {\r\n    var m = typeof Symbol === "function" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i["return"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n};\r\nvar __spread = (this && this.__spread) || function () {\r\n    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n};\r\n/// <reference path="./types.d.ts" />\r\ndefine("c37b52bf-204c-4c8f-aee5-3249129b8141/node_modules/decentraland-builder-scripts/channel", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var REQUEST_VALUE = \'__request_value__\';\r\n    var REPLY_VALUE = \'__reply_value__\';\r\n    var POLL_INTERVAL = 5000;\r\n    function createChannel(id, host, bus) {\r\n        var handlers = {};\r\n        var requests = {};\r\n        var responses = {};\r\n        bus.on(host.name, function (action) {\r\n            var handler = handlers[action.actionId];\r\n            if (handler) {\r\n                handler(action);\r\n            }\r\n            // clear all pending requests for this entity\r\n            requests = {};\r\n        });\r\n        bus.on(REQUEST_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key;\r\n                var response = responses[key];\r\n                if (response) {\r\n                    var value = response();\r\n                    var reply = {\r\n                        entityName: host.name,\r\n                        key: key,\r\n                        sender: id,\r\n                        value: value\r\n                    };\r\n                    bus.emit(REPLY_VALUE, reply);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        bus.on(REPLY_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key, value = message.value;\r\n                var request = requests[key];\r\n                if (request) {\r\n                    request(value);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        return {\r\n            id: id,\r\n            bus: bus,\r\n            createAction: function (actionId, values) {\r\n                var action = {\r\n                    entityName: host.name,\r\n                    actionId: actionId,\r\n                    values: values\r\n                };\r\n                return action;\r\n            },\r\n            sendActions: function (actions) {\r\n                var e_1, _a;\r\n                if (actions === void 0) { actions = []; }\r\n                try {\r\n                    for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {\r\n                        var base = actions_1_1.value;\r\n                        var action = __assign(__assign({}, base), { sender: id });\r\n                        bus.emit(action.entityName, action);\r\n                    }\r\n                }\r\n                catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n                finally {\r\n                    try {\r\n                        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);\r\n                    }\r\n                    finally { if (e_1) throw e_1.error; }\r\n                }\r\n            },\r\n            handleAction: function (actionId, handler) {\r\n                handlers[actionId] = handler;\r\n            },\r\n            request: function (key, callback) {\r\n                requests[key] = callback;\r\n                var request = { entityName: host.name, key: key, sender: id };\r\n                var interval = setInterval(function () {\r\n                    if (key in requests) {\r\n                        bus.emit(REQUEST_VALUE, request);\r\n                    }\r\n                    else {\r\n                        clearInterval(interval);\r\n                    }\r\n                }, POLL_INTERVAL);\r\n            },\r\n            reply: function (key, callback) {\r\n                responses[key] = callback;\r\n            }\r\n        };\r\n    }\r\n    exports.createChannel = createChannel;\r\n});\r\n/// <reference path="./types.d.ts" />\r\ndefine("c37b52bf-204c-4c8f-aee5-3249129b8141/node_modules/decentraland-builder-scripts/inventory", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    function createInventory(UICanvas, UIContainerStack, UIImage) {\r\n        var canvas = null;\r\n        var container = null;\r\n        var images = {};\r\n        function getContainer() {\r\n            if (!canvas) {\r\n                canvas = new UICanvas();\r\n            }\r\n            if (!container) {\r\n                container = new UIContainerStack(canvas);\r\n                container.isPointerBlocker = false;\r\n                container.vAlign = \'bottom\';\r\n                container.hAlign = \'right\';\r\n                container.stackOrientation = 0;\r\n                container.spacing = 0;\r\n                container.positionY = 75;\r\n                container.positionX = -25;\r\n            }\r\n            return container;\r\n        }\r\n        return {\r\n            add: function (id, texture) {\r\n                var image = images[id] || new UIImage(getContainer(), texture);\r\n                image.width = 128;\r\n                image.height = 128;\r\n                image.sourceTop = 0;\r\n                image.sourceLeft = 0;\r\n                image.sourceHeight = 256;\r\n                image.sourceWidth = 256;\r\n                image.isPointerBlocker = false;\r\n                image.visible = true;\r\n                images[id] = image;\r\n            },\r\n            remove: function (id) {\r\n                var image = images[id];\r\n                if (image) {\r\n                    image.visible = false;\r\n                    image.height = 0;\r\n                    image.width = 0;\r\n                }\r\n            },\r\n            has: function (id) {\r\n                return id in images && images[id].visible;\r\n            }\r\n        };\r\n    }\r\n    exports.createInventory = createInventory;\r\n});\r\n/// <reference path="./types.d.ts" />\r\ndefine("c37b52bf-204c-4c8f-aee5-3249129b8141/node_modules/decentraland-builder-scripts/spawner", ["require", "exports", "node_modules/decentraland-builder-scripts/channel", "node_modules/decentraland-builder-scripts/inventory"], function (require, exports, channel_1, inventory_1) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var bus = new MessageBus();\r\n    var Spawner = /** @class */ (function () {\r\n        function Spawner(script) {\r\n            var inventory = inventory_1.createInventory(UICanvas, UIContainerStack, UIImage);\r\n            script.init({ inventory: inventory });\r\n            this.script = script;\r\n        }\r\n        Spawner.prototype.spawn = function (name, transform, props) {\r\n            if (transform === void 0) { transform = new Transform({ position: new Vector3(8, 0, 8) }); }\r\n            var host = new Entity(name);\r\n            host.addComponent(transform);\r\n            engine.addEntity(host);\r\n            var channel = channel_1.createChannel(\'channel-id\', host, bus);\r\n            this.script.spawn(host, props || {}, channel);\r\n        };\r\n        return Spawner;\r\n    }());\r\n    exports.Spawner = Spawner;\r\n});\r\ndefine("c37b52bf-204c-4c8f-aee5-3249129b8141/game", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n});\r\n//import Key, { Props } from \'./item\'\r\n//\r\n//const key = new Key()\r\n//const spawner = new Spawner<Props>(key)\r\n//\r\n//spawner.spawn(\r\n//  \'key\',\r\n//  new Transform({\r\n//    position: new Vector3(4, 2, 8)\r\n//  }),\r\n//  {\r\n//    target: \'pepe\',\r\n//    respawns: true\r\n//  }\r\n//)\r\n//\r\n//spawner.spawn(\r\n//  \'key2\',\r\n//  new Transform({\r\n//    position: new Vector3(4, 1, 8)\r\n//  }),\r\n//  { target: \'pepe2\', respawns: false }\r\n//)\r\n//\r\n//const a = new Entity(\'pepe\')\r\n//a.addComponent(new BoxShape())\r\n//a.addComponent(new Transform({ position: new Vector3(3, 0, 3) }))\r\n//engine.addEntity(a)\r\n//\r\ndefine("c37b52bf-204c-4c8f-aee5-3249129b8141/item", ["require", "exports"], function (require, exports) {\r\n    "use strict";\r\n    Object.defineProperty(exports, "__esModule", { value: true });\r\n    var Button = /** @class */ (function () {\r\n        function Button() {\r\n            this.hiddenKeys = [];\r\n            this.targets = {};\r\n            this.clip = new AudioClip(\'c37b52bf-204c-4c8f-aee5-3249129b8141/sounds/use.mp3\');\r\n            this.equipClip = new AudioClip(\'c37b52bf-204c-4c8f-aee5-3249129b8141/sounds/KeyEquip.mp3\');\r\n            this.canvas = new UICanvas();\r\n            this.container = new UIContainerStack(this.canvas);\r\n            this.texture = new Texture(\'c37b52bf-204c-4c8f-aee5-3249129b8141/images/Key.png\');\r\n        }\r\n        Button.prototype.init = function (_a) {\r\n            var _this = this;\r\n            var inventory = _a.inventory;\r\n            this.inventory = inventory;\r\n            Input.instance.subscribe(\'BUTTON_DOWN\', ActionButton.POINTER, true, function (event) {\r\n                if (event.hit && event.hit.length < 5) {\r\n                    var entity = engine.entities[event.hit.entityId];\r\n                    while (entity) {\r\n                        var target = _this.targets[entity.name];\r\n                        if (target) {\r\n                            var _a = __read(target, 2), key = _a[0], channel = _a[1];\r\n                            if (_this.isEquipped(key)) {\r\n                                var useAction = channel.createAction(\'use\', {});\r\n                                channel.sendActions([useAction]);\r\n                            }\r\n                        }\r\n                        entity = entity.getParent();\r\n                    }\r\n                }\r\n            });\r\n        };\r\n        Button.prototype.playSound = function (key) {\r\n            var source = new AudioSource(this.clip);\r\n            key.addComponentOrReplace(source);\r\n            source.playing = true;\r\n        };\r\n        Button.prototype.isEquipped = function (key) {\r\n            return this.inventory.has(key.name);\r\n        };\r\n        Button.prototype.isHidden = function (key) {\r\n            return this.hiddenKeys.indexOf(key) !== -1;\r\n        };\r\n        Button.prototype.equip = function (key) {\r\n            if (this.isEquipped(key))\r\n                return;\r\n            this.inventory.add(key.name, this.texture);\r\n            this.playSound(key);\r\n        };\r\n        Button.prototype.hide = function (key) {\r\n            if (this.isHidden(key))\r\n                return;\r\n            this.hiddenKeys.push(key);\r\n            var gltfShape = key.getComponent(GLTFShape);\r\n            gltfShape.visible = false;\r\n        };\r\n        Button.prototype.unequip = function (key) {\r\n            if (!this.isEquipped(key))\r\n                return;\r\n            this.inventory.remove(key.name);\r\n            this.playSound(key);\r\n        };\r\n        Button.prototype.show = function (key) {\r\n            if (!this.isHidden(key))\r\n                return;\r\n            var gltfShape = key.getComponent(GLTFShape);\r\n            gltfShape.visible = true;\r\n            this.hiddenKeys = this.hiddenKeys.filter(function (_key) { return _key !== key; });\r\n        };\r\n        Button.prototype.spawn = function (host, props, channel) {\r\n            var _this = this;\r\n            var key = new Entity(host.name + \'-key\');\r\n            key.setParent(host);\r\n            key.addComponent(new GLTFShape(\'c37b52bf-204c-4c8f-aee5-3249129b8141/models/Bronze_Key_Genesis.glb\'));\r\n            key.addComponent(new OnPointerDown(function () {\r\n                var equipAction = channel.createAction(\'equip\', {});\r\n                channel.sendActions([equipAction]);\r\n                var source = new AudioSource(_this.equipClip);\r\n                key.addComponentOrReplace(source);\r\n                source.playing = true;\r\n            }, {\r\n                button: ActionButton.POINTER,\r\n                hoverText: \'Pick up\',\r\n                distance: 6\r\n            }));\r\n            this.targets[props.target] = [key, channel];\r\n            channel.handleAction(\'equip\', function (action) {\r\n                if (!_this.isEquipped(key)) {\r\n                    // we only equip the key for the player who triggered the action\r\n                    if (action.sender === channel.id) {\r\n                        _this.equip(key);\r\n                        channel.sendActions(props.onEquip);\r\n                    }\r\n                    // we remove the key from the scene for everybody\r\n                    _this.hide(key);\r\n                }\r\n            });\r\n            channel.handleAction(\'unequip\', function (action) {\r\n                if (_this.isEquipped(key)) {\r\n                    // we only equip the key for the player who triggered the action\r\n                    if (action.sender === channel.id) {\r\n                        _this.unequip(key);\r\n                    }\r\n                    // we remove the key from the scene for everybody\r\n                }\r\n                if (props.respawns == true) {\r\n                    _this.show(key);\r\n                }\r\n            });\r\n            channel.handleAction(\'use\', function (action) {\r\n                if (_this.isEquipped(key) && action.sender === channel.id) {\r\n                    var unequipAction = channel.createAction(\'unequip\', {});\r\n                    channel.sendActions(__spread([unequipAction], (props.onUse || [])));\r\n                }\r\n            });\r\n            channel.handleAction(\'respawn\', function (action) {\r\n                if (_this.isEquipped(key) && action.sender === channel.id) {\r\n                    var unequipAction = channel.createAction(\'unequip\', {});\r\n                    channel.sendActions(__spread([unequipAction], (props.onUse || [])));\r\n                }\r\n                _this.show(key);\r\n            });\r\n        };\r\n        return Button;\r\n    }());\r\n    exports.default = Button;\r\n});\r\n');