;
/*! code */;
eval("var __assign = (this && this.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __values = (this && this.__values) || function(o) {\r\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\r\n    if (m) return m.call(o);\r\n    if (o && typeof o.length === \"number\") return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\r\n};\r\n/// <reference path=\"./types.d.ts\" />\r\ndefine(\"431f971e-4eee-4691-aa03-d541f0ac3c76/node_modules/decentraland-builder-scripts/channel\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    exports.createChannel = void 0;\r\n    var REQUEST_VALUE = '__request_value__';\r\n    var REPLY_VALUE = '__reply_value__';\r\n    var POLL_INTERVAL = 5000;\r\n    function createChannel(id, host, bus) {\r\n        var handlers = {};\r\n        var requests = {};\r\n        var responses = {};\r\n        bus.on(host.name, function (action) {\r\n            var handler = handlers[action.actionId];\r\n            if (handler) {\r\n                handler(action);\r\n            }\r\n            // clear all pending requests for this entity\r\n            requests = {};\r\n        });\r\n        bus.on(REQUEST_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key;\r\n                var response = responses[key];\r\n                if (response) {\r\n                    var value = response();\r\n                    var reply = {\r\n                        entityName: host.name,\r\n                        key: key,\r\n                        sender: id,\r\n                        value: value\r\n                    };\r\n                    bus.emit(REPLY_VALUE, reply);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        bus.on(REPLY_VALUE, function (message) {\r\n            if (message.sender !== id && message.entityName === host.name) {\r\n                var key = message.key, value = message.value;\r\n                var request = requests[key];\r\n                if (request) {\r\n                    request(value);\r\n                }\r\n                // clear pending request for this key\r\n                delete requests[key];\r\n            }\r\n        });\r\n        return {\r\n            id: id,\r\n            bus: bus,\r\n            createAction: function (actionId, values) {\r\n                var action = {\r\n                    entityName: host.name,\r\n                    actionId: actionId,\r\n                    values: values\r\n                };\r\n                return action;\r\n            },\r\n            sendActions: function (actions) {\r\n                var e_1, _a;\r\n                if (actions === void 0) { actions = []; }\r\n                try {\r\n                    for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {\r\n                        var base = actions_1_1.value;\r\n                        var action = __assign(__assign({}, base), { sender: id });\r\n                        bus.emit(action.entityName, action);\r\n                    }\r\n                }\r\n                catch (e_1_1) { e_1 = { error: e_1_1 }; }\r\n                finally {\r\n                    try {\r\n                        if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);\r\n                    }\r\n                    finally { if (e_1) throw e_1.error; }\r\n                }\r\n            },\r\n            handleAction: function (actionId, handler) {\r\n                handlers[actionId] = handler;\r\n            },\r\n            request: function (key, callback) {\r\n                requests[key] = callback;\r\n                var request = { entityName: host.name, key: key, sender: id };\r\n                var interval = setInterval(function () {\r\n                    if (key in requests) {\r\n                        bus.emit(REQUEST_VALUE, request);\r\n                    }\r\n                    else {\r\n                        clearInterval(interval);\r\n                    }\r\n                }, POLL_INTERVAL);\r\n            },\r\n            reply: function (key, callback) {\r\n                responses[key] = callback;\r\n            }\r\n        };\r\n    }\r\n    exports.createChannel = createChannel;\r\n});\r\n/// <reference path=\"./types.d.ts\" />\r\ndefine(\"431f971e-4eee-4691-aa03-d541f0ac3c76/node_modules/decentraland-builder-scripts/spawner\", [\"require\", \"exports\", \"node_modules/decentraland-builder-scripts/channel\"], function (require, exports, channel_1) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    exports.Spawner = void 0;\r\n    var bus = new MessageBus();\r\n    var Spawner = /** @class */ (function () {\r\n        function Spawner(script) {\r\n            script.init();\r\n            this.script = script;\r\n        }\r\n        Spawner.prototype.spawn = function (name, transform, props) {\r\n            if (transform === void 0) { transform = new Transform({ position: new Vector3(8, 0, 8) }); }\r\n            var host = new Entity(name);\r\n            host.addComponent(transform);\r\n            engine.addEntity(host);\r\n            var channel = channel_1.createChannel('channel-id', host, bus);\r\n            this.script.spawn(host, props || {}, channel);\r\n        };\r\n        return Spawner;\r\n    }());\r\n    exports.Spawner = Spawner;\r\n});\r\ndefine(\"431f971e-4eee-4691-aa03-d541f0ac3c76/game\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n});\r\n//import SignPost, { Props } from './item'\r\n//\r\n//const post = new SignPost()\r\n//const spawner = new Spawner<Props>(post)\r\n//\r\n//spawner.spawn('post', new Transform({ position: new Vector3(4, 1, 8) }), {\r\n//  text: 'Make a donation',\r\n//  fontSize: 10,\r\n//  publicKey: '0xe2b6024873d218B2E83B462D3658D8D7C3f55a18'\r\n//})\r\n//\r\ndefine(\"431f971e-4eee-4691-aa03-d541f0ac3c76/item\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    var SignPost = /** @class */ (function () {\r\n        function SignPost() {\r\n        }\r\n        SignPost.prototype.init = function () { };\r\n        SignPost.prototype.spawn = function (host, props, channel) {\r\n            var sign = new Entity();\r\n            sign.setParent(host);\r\n            sign.addComponent(new GLTFShape('431f971e-4eee-4691-aa03-d541f0ac3c76/models/QR_BlackBoard.glb'));\r\n            sign.addComponent(new Transform({}));\r\n            var url = (\"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\" + props.publicKey).toString();\r\n            var QRTexture = new Texture(url);\r\n            var QRMaterial = new Material();\r\n            QRMaterial.roughness = 1;\r\n            QRMaterial.specularIntensity = 0;\r\n            QRMaterial.albedoTexture = QRTexture;\r\n            var QRPlane = new Entity();\r\n            QRPlane.setParent(host);\r\n            QRPlane.addComponent(new PlaneShape());\r\n            QRPlane.addComponent(QRMaterial);\r\n            QRPlane.addComponent(new Transform({\r\n                position: new Vector3(0, 1.15, 0.2),\r\n                rotation: Quaternion.Euler(-17, 0, 0),\r\n                scale: new Vector3(0.7, 0.7, 0.7),\r\n            }));\r\n            var QRPlane2 = new Entity();\r\n            QRPlane2.setParent(host);\r\n            QRPlane2.addComponent(new PlaneShape());\r\n            QRPlane2.addComponent(QRMaterial);\r\n            QRPlane2.addComponent(new Transform({\r\n                position: new Vector3(0, 1.15, -0.2),\r\n                rotation: Quaternion.Euler(17, 0, 0),\r\n                scale: new Vector3(0.7, 0.7, 0.7),\r\n            }));\r\n            var signText = new Entity();\r\n            signText.setParent(host);\r\n            var text = new TextShape(props.text);\r\n            text.fontSize = props.fontSize;\r\n            text.color = Color3.FromHexString('#78ebff');\r\n            text.font = new Font(Fonts.SanFrancisco_Semibold);\r\n            text.outlineColor = Color3.FromHexString('#78ebff');\r\n            text.outlineWidth = 0.2;\r\n            text.width = 20;\r\n            text.height = 10;\r\n            text.hTextAlign = 'center';\r\n            signText.addComponent(text);\r\n            signText.addComponent(new Transform({\r\n                position: new Vector3(0, 0.52, 0.4),\r\n                rotation: Quaternion.Euler(-17, 180, 0),\r\n                scale: new Vector3(0.1, 0.1, 0.1),\r\n            }));\r\n            var signText2 = new Entity();\r\n            signText2.setParent(host);\r\n            signText2.addComponent(text);\r\n            signText2.addComponent(new Transform({\r\n                position: new Vector3(0, 0.52, -0.4),\r\n                rotation: Quaternion.Euler(17, 0, 0),\r\n                scale: new Vector3(0.1, 0.1, 0.1),\r\n            }));\r\n            channel.handleAction('changeText', function (action) {\r\n                text.value = action.values.newText;\r\n            });\r\n            channel.request('getText', function (signText) { return (text.value = signText); });\r\n            channel.reply('getText', function () { return text.value; });\r\n        };\r\n        return SignPost;\r\n    }());\r\n    exports.default = SignPost;\r\n});\r\n");