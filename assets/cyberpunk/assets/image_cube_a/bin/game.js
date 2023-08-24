eval("//import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'\r\n//import SignPost, { Props } from './item'\r\n//\r\n//const post = new SignPost()\r\n//const spawner = new Spawner<Props>(post)\r\n//\r\n//spawner.spawn(\r\n//  'post',\r\n//  new Transform({\r\n//    position: new Vector3(4, 0, 8),\r\n//    scale: new Vector3(1, 1, 1),\r\n//  }),\r\n//  {\r\n//    image: 'https://i.imgur.com/d25gO61.jpg',\r\n//  }\r\n//)\r\ndefine(\"5af1151e-9def-47ed-88f9-1f4e52caee28/item\", [\"require\", \"exports\"], function (require, exports) {\r\n    \"use strict\";\r\n    Object.defineProperty(exports, \"__esModule\", { value: true });\r\n    var SignPost = /** @class */ (function () {\r\n        function SignPost() {\r\n        }\r\n        SignPost.prototype.init = function () { };\r\n        SignPost.prototype.spawn = function (host, props, channel) {\r\n            var sign = new Entity();\r\n            sign.setParent(host);\r\n            sign.addComponent(new GLTFShape('5af1151e-9def-47ed-88f9-1f4e52caee28/models/Game_Cube_A.glb'));\r\n            sign.addComponent(new Transform({}));\r\n            var url = props.image;\r\n            var QRTexture = new Texture(url);\r\n            var QRMaterial = new Material();\r\n            QRMaterial.metallic = 0;\r\n            QRMaterial.roughness = 1;\r\n            QRMaterial.specularIntensity = 0;\r\n            QRMaterial.albedoTexture = QRTexture;\r\n            var QRPlane = new Entity();\r\n            QRPlane.setParent(host);\r\n            QRPlane.addComponent(new PlaneShape());\r\n            QRPlane.addComponent(QRMaterial);\r\n            QRPlane.addComponent(new Transform({\r\n                position: new Vector3(-0.25, 0.97, -0.03),\r\n                rotation: Quaternion.Euler(180, -15, 0),\r\n                scale: new Vector3(.55, .55, .55),\r\n            }));\r\n            var QRPlane2 = new Entity();\r\n            QRPlane2.setParent(host);\r\n            QRPlane2.addComponent(new PlaneShape());\r\n            QRPlane2.addComponent(QRMaterial);\r\n            QRPlane2.addComponent(new Transform({\r\n                position: new Vector3(-0.4, 0.97, -0.61),\r\n                rotation: Quaternion.Euler(180, 165, 0),\r\n                scale: new Vector3(.55, .55, .55),\r\n            }));\r\n            var QRPlane3 = new Entity();\r\n            QRPlane3.setParent(host);\r\n            QRPlane3.addComponent(new PlaneShape());\r\n            QRPlane3.addComponent(QRMaterial);\r\n            QRPlane3.addComponent(new Transform({\r\n                position: new Vector3(-0.39, 2.265, -0.04),\r\n                rotation: Quaternion.Euler(180, 14.5, 0),\r\n                scale: new Vector3(.55, .55, .55),\r\n            }));\r\n            var QRPlane4 = new Entity();\r\n            QRPlane4.setParent(host);\r\n            QRPlane4.addComponent(new PlaneShape());\r\n            QRPlane4.addComponent(QRMaterial);\r\n            QRPlane4.addComponent(new Transform({\r\n                position: new Vector3(-0.23, 2.265, -0.602),\r\n                rotation: Quaternion.Euler(180, 193, 0),\r\n                scale: new Vector3(.58, .58, .58),\r\n            }));\r\n        };\r\n        return SignPost;\r\n    }());\r\n    exports.default = SignPost;\r\n});\r\n")