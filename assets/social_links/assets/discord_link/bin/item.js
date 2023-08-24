var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
define("src/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseURL = void 0;
    var siteName = 'discord';
    var siteURL = 'discord.com';
    var defaulthover = 'Discord Page';
    var stringsToReplace = [
        'http://',
        'https://',
        'http:',
        'https:',
        'www.',
        siteURL,
        '/',
    ];
    var SMedia_Link = (function () {
        function SMedia_Link() {
        }
        SMedia_Link.prototype.init = function () { };
        SMedia_Link.prototype.spawn = function (host, props, channel) {
            var link = new Entity();
            link.setParent(host);
            if (props.bnw) {
                link.addComponent(new GLTFShape('models/discord_bnw.glb'));
            }
            else {
                link.addComponent(new GLTFShape('models/discord.glb'));
            }
            var url = parseURL(props.url);
            var locationString = props.name ? props.name : defaulthover;
            link.addComponent(new OnPointerDown(function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        openExternalURL(url);
                        return [2];
                    });
                });
            }, {
                button: ActionButton.PRIMARY,
                hoverText: locationString,
            }));
        };
        return SMedia_Link;
    }());
    exports.default = SMedia_Link;
    function parseURL(url) {
        var e_1, _a;
        var newURL = url.trim();
        try {
            for (var stringsToReplace_1 = __values(stringsToReplace), stringsToReplace_1_1 = stringsToReplace_1.next(); !stringsToReplace_1_1.done; stringsToReplace_1_1 = stringsToReplace_1.next()) {
                var str = stringsToReplace_1_1.value;
                if (newURL.substr(0, str.length) == str) {
                    newURL = newURL.substring(str.length).trim();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (stringsToReplace_1_1 && !stringsToReplace_1_1.done && (_a = stringsToReplace_1.return)) _a.call(stringsToReplace_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var finalURL = 'https://www.' + siteURL + '/' + newURL;
        return finalURL;
    }
    exports.parseURL = parseURL;
});
