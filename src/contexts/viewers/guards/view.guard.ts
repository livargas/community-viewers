import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthService } from "@contexts/auth/services/auth.service";
import { ViewersService } from '../services/viewers.service';

@Injectable()
export class ViewGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== "ws") {
      console.log("Not a websocket connection")
      console.log("context.getType(): ", context.getType());
      
      return false;
    };

    const client: Socket = context.switchToWs().getClient();
    this.validateToken(client);

    return true;
  }

  async validateToken(client: Socket): Promise<boolean> {
    const token = ViewersService.getAccessToken(client);
    const subdomain = ViewersService.getCommunitySubdomain(client);

    const user = await this.authService.verifyToken(token, subdomain);

    if (!user) {
      throw new WsException("Unauthorized: No token provided");
    }

    return true;
  }
}
