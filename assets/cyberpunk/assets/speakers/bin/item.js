define("da30258e-3cc1-48a4-bc55-508e923ae977/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Door = (function () {
        function Door() {
            this.Clip = new AudioClip("da30258e-3cc1-48a4-bc55-508e923ae977/sounds/EDMLoop.mp3");
            this.active = {};
        }
        Door.prototype.init = function () { };
        Door.prototype.toggle = function (entity) {
            var source = new AudioSource(this.Clip);
            entity.addComponentOrReplace(source);
            source.playing = true;
        };
        Door.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var car = new Entity(host.name + "-button");
            car.setParent(host);
            car.addComponent(new GLTFShape("da30258e-3cc1-48a4-bc55-508e923ae977/models/Cyberpunk_Speakers.glb"));
            if (props.clickable) {
                car.addComponent(new OnPointerDown(function () {
                    var activateAction = channel.createAction('activate', {});
                    channel.sendActions([activateAction]);
                }));
            }
            channel.handleAction("activate", function (_a) {
                var sender = _a.sender;
                _this.toggle(car);
                if (sender === channel.id) {
                    channel.sendActions(props.onActivate);
                }
            });
        };
        return Door;
    }());
    exports.default = Door;
});
