eval("//import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'\r\n//import Button, { Props } from './item'\r\n//\r\n//const button = new Button()\r\n//const spawner = new Spawner<Props>(button)\r\n//\r\n//spawner.spawn(\r\n//  'screen',\r\n//  new Transform({\r\n//    position: new Vector3(4, 0, 8),\r\n//  }),\r\n//  {\r\n//    onClickText: 'Start stream',\r\n//    customStation: 'https://theuniverse.club/live/consensys/index.m3u8',\r\n//    startOn: false,\r\n//    volume: 0.8,\r\n//    onClick: [\r\n//      {\r\n//        actionId: 'toggle',\r\n//        entityName: 'screen',\r\n//        values: {},\r\n//      },\r\n//    ],\r\n//  }\r\n//)\r\n//\r\n//\r\ndefine(\"1f1dfb04-879e-422f-a8da-44852a421199/item\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    var defaultStation = 'https://theuniverse.club/live/genesisplaza/index.m3u8';\r\n    var Button = /** @class */ (function () {\r\n        function Button() {\r\n            this.channel = '';\r\n            this.data = {};\r\n        }\r\n        Button.prototype.init = function () { };\r\n        Button.prototype.toggle = function (hostName, value) {\r\n            // log('all screens: ', this.video, ' setting: ', entity.name, ' to ', value)\r\n            if (value) {\r\n                if (this.activeScreen && this.activeScreen == hostName) {\r\n                    return;\r\n                }\r\n                else if (this.activeScreen) {\r\n                    this.toggle(this.activeScreen, false);\r\n                }\r\n                this.activeScreen = hostName;\r\n                var data = this.data[hostName];\r\n                data.screen1.addComponentOrReplace(data.material);\r\n                data.active = true;\r\n                data.texture.volume = data.volume;\r\n                data.texture.playing = true;\r\n            }\r\n            else {\r\n                if (!this.activeScreen || this.activeScreen != hostName) {\r\n                    return;\r\n                }\r\n                this.activeScreen = null;\r\n                var data = this.data[hostName];\r\n                data.active = false;\r\n                data.texture.playing = false;\r\n            }\r\n            return;\r\n        };\r\n        Button.prototype.spawn = function (host, props, channel) {\r\n            var _this = this;\r\n            var screen = new Entity(host.name + '-screen');\r\n            screen.setParent(host);\r\n            var scaleMult = 0.35;\r\n            screen.addComponent(new PlaneShape());\r\n            screen.addComponent(new Transform({\r\n                scale: new Vector3(1.92 * scaleMult, 1.08 * scaleMult, 10 * scaleMult),\r\n                position: new Vector3(-0.001, 1.5 * scaleMult, -0.001),\r\n                rotation: Quaternion.Euler(0, 180, 180)\r\n            }));\r\n            var billboard = new Entity();\r\n            billboard.setParent(host);\r\n            billboard.addComponent(new Transform({ position: new Vector3(0, 0, 0) }));\r\n            billboard.addComponent(new GLTFShape('1f1dfb04-879e-422f-a8da-44852a421199/models/Display_Monitor.glb'));\r\n            if (props.customStation) {\r\n                this.channel = props.customStation;\r\n            }\r\n            else if (props.station) {\r\n                this.channel = props.station;\r\n            }\r\n            else {\r\n                this.channel = defaultStation;\r\n            }\r\n            // //test\r\n            // let test = new Entity()\r\n            // test.setParent(host)\r\n            // test.addComponentOrReplace(new GLTFShape('models/stream_preview.glb'))\r\n            // video material\r\n            var myTexture = new VideoTexture(new VideoClip(this.channel));\r\n            var myMaterial = new Material();\r\n            myMaterial.albedoTexture = myTexture;\r\n            myMaterial.specularIntensity = 0;\r\n            myMaterial.roughness = 1;\r\n            myMaterial.metallic = 0;\r\n            myMaterial.emissiveTexture = myTexture;\r\n            myMaterial.emissiveIntensity = 0.8;\r\n            myMaterial.emissiveColor = new Color3(1, 1, 1);\r\n            var placeholderMaterial = new Material();\r\n            placeholderMaterial.albedoTexture = new Texture(props.image ? props.image : '1f1dfb04-879e-422f-a8da-44852a421199/images/stream.png');\r\n            placeholderMaterial.specularIntensity = 0;\r\n            placeholderMaterial.roughness = 1;\r\n            screen.addComponent(placeholderMaterial);\r\n            var volume = props.volume;\r\n            if (props.onClick) {\r\n                screen.addComponent(new OnPointerDown(function () {\r\n                    channel.sendActions(props.onClick);\r\n                }, {\r\n                    button: ActionButton.POINTER,\r\n                    hoverText: props.onClickText,\r\n                    distance: 6,\r\n                }));\r\n                billboard.addComponent(new OnPointerDown(function () {\r\n                    log('clicked');\r\n                    channel.sendActions(props.onClick);\r\n                }, {\r\n                    button: ActionButton.POINTER,\r\n                    hoverText: props.onClickText,\r\n                    distance: 6,\r\n                }));\r\n            }\r\n            this.data[host.name] = {\r\n                screen1: screen,\r\n                volume: volume,\r\n                texture: myTexture,\r\n                material: myMaterial,\r\n                active: props.startOn ? true : false,\r\n            };\r\n            if (props.startOn) {\r\n                this.toggle(host.name, true);\r\n            }\r\n            else {\r\n                this.toggle(host.name, false);\r\n            }\r\n            // handle actions\r\n            channel.handleAction('activate', function (_a) {\r\n                var sender = _a.sender;\r\n                _this.toggle(host.name, true);\r\n                if (sender === channel.id) {\r\n                    channel.sendActions(props.onActivate);\r\n                }\r\n            });\r\n            channel.handleAction('deactivate', function (_a) {\r\n                var sender = _a.sender;\r\n                _this.toggle(host.name, false);\r\n                if (sender === channel.id) {\r\n                    channel.sendActions(props.onDeactivate);\r\n                }\r\n            });\r\n            channel.handleAction('toggle', function (_a) {\r\n                var sender = _a.sender;\r\n                var value = !_this.data[host.name].active;\r\n                _this.toggle(host.name, value);\r\n                if (sender === channel.id) {\r\n                    if (value) {\r\n                        channel.sendActions(props.onActivate);\r\n                    }\r\n                    else {\r\n                        channel.sendActions(props.onDeactivate);\r\n                    }\r\n                }\r\n            });\r\n            // sync initial values\r\n            channel.request('isActive', function (isActive) {\r\n                return _this.toggle(host.name, isActive);\r\n            });\r\n            channel.reply('isActive', function () { return _this.data[host.name].active; });\r\n        };\r\n        return Button;\r\n    }());\r\n    exports.default = Button;\r\n});\r\n")