import {
  ExecutionContext,
  CanActivate,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
@Injectable()
export class ProtectGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
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
            throw new UnauthorizedException();
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
          throw new UnauthorizedException();
        }
      }
      request["spa"] = spa;
      request["req_id"] = req_id;
      request["app_associate"] = app_associate;
      return true;
    } else {
      let { ses_req_id, ses_spa, ses_app_associate } = request.session;
      if (ses_spa && ses_req_id && ses_app_associate) {
        request["spa"] = ses_spa;
        request["req_id"] = ses_req_id;
        request["app_associate"] = ses_app_associate;
        return true;
      }
      const config = [
        randomBytes(6).toString("base64"),
        randomBytes(10).toString("base64"),
        randomBytes(5).toString("base64"),
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
}
