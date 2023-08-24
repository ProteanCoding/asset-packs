eval("//import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'\r\n//import SignPost, { Props } from './item'\r\n//\r\n//const post = new SignPost()\r\n//const spawner = new Spawner<Props>(post)\r\n//\r\n//spawner.spawn(\r\n//  'post',\r\n//  new Transform({\r\n//    position: new Vector3(4, 0, 8),\r\n//    scale: new Vector3(1, 1, 1),\r\n//  }),\r\n//  {\r\n//    image: 'https://i.imgur.com/d25gO61.jpg',\r\n//  }\r\n//)\r\ndefine(\"6ef2baf2-3d2e-4093-b22b-34c2b6bb0e7b/item\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    var SignPost = /** @class */ (function () {\r\n        function SignPost() {\r\n        }\r\n        SignPost.prototype.init = function () { };\r\n        SignPost.prototype.spawn = function (host, props, channel) {\r\n            var sign = new Entity();\r\n            sign.setParent(host);\r\n            sign.addComponent(new GLTFShape('6ef2baf2-3d2e-4093-b22b-34c2b6bb0e7b/models/Screen_Independent.glb'));\r\n            sign.addComponent(new Transform({}));\r\n            var url = props.image;\r\n            var QRTexture = new Texture(url);\r\n            var QRMaterial = new Material();\r\n            QRMaterial.metallic = 0;\r\n            QRMaterial.roughness = 1;\r\n            QRMaterial.specularIntensity = 0;\r\n            QRMaterial.albedoTexture = QRTexture;\r\n            var QRPlane = new Entity();\r\n            QRPlane.setParent(host);\r\n            QRPlane.addComponent(new PlaneShape());\r\n            QRPlane.addComponent(QRMaterial);\r\n            QRPlane.addComponent(new Transform({\r\n                position: new Vector3(0, 3.45, -0.03),\r\n                rotation: Quaternion.Euler(180, 0, 0),\r\n                scale: new Vector3(3.8, 3.8, 3.8),\r\n            }));\r\n        };\r\n        return SignPost;\r\n    }());\r\n    exports.default = SignPost;\r\n});\r\n")