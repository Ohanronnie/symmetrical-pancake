"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectGuard = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ProtectGuard = class ProtectGuard {
    canActivate(ctx) {
        const request = ctx.switchToHttp().getRequest();
        if (!["/token/get"].includes(request.route.path)) {
            let __token = request.body;
            if (request.method.toLowerCase() === "get") {
                __token = request.headers;
            }
            let { req_id, spa, app_associate } = __token;
            const { ses_req_id, ses_spa, ses_app_associate } = request.session;
            (function () {
                [
                    req_id,
                    spa,
                    ses_req_id,
                    ses_spa,
                    app_associate,
                    ses_app_associate,
                ].forEach((e, a, arr) => {
                    if (!e) {
                        throw new common_1.UnauthorizedException();
                    }
                });
            })();
            const sessionConfig = [
                {
                    value: req_id,
                    session: ses_req_id,
                },
                {
                    value: spa,
                    session: ses_spa,
                },
                {
                    value: app_associate,
                    session: ses_app_associate,
                },
            ];
            for (const iterator of sessionConfig) {
                const compared = iterator.value === iterator.session;
                if (!compared) {
                    throw new common_1.UnauthorizedException();
                }
            }
            request["spa"] = spa;
            request["req_id"] = req_id;
            request["app_associate"] = app_associate;
            return true;
        }
        else {
            let { ses_req_id, ses_spa, ses_app_associate } = request.session;
            if (ses_spa && ses_req_id && ses_app_associate) {
                request["spa"] = ses_spa;
                request["req_id"] = ses_req_id;
                request["app_associate"] = ses_app_associate;
                return true;
            }
            const config = [
                (0, crypto_1.randomBytes)(6).toString("base64"),
                (0, crypto_1.randomBytes)(10).toString("base64"),
                (0, crypto_1.randomBytes)(5).toString("base64"),
            ];
            const [spa, req_id, app_associate] = config;
            [ses_spa, ses_req_id, ses_app_associate] = config.map((value) => value);
            request.session["ses_spa"] = ses_spa;
            request.session["ses_req_id"] = ses_req_id;
            request.session["ses_app_associate"] = ses_app_associate;
            request["spa"] = spa;
            request["req_id"] = req_id;
            request["app_associate"] = app_associate;
            return true;
        }
    }
};
exports.ProtectGuard = ProtectGuard;
exports.ProtectGuard = ProtectGuard = __decorate([
    (0, common_1.Injectable)()
], ProtectGuard);
//# sourceMappingURL=protect.guard.js.map