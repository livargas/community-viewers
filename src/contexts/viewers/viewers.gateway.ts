import {
  UseGuards,
  UsePipes,
  UseFilters,
  ValidationPipe,
  Logger,
} from "@nestjs/common";
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { ViewersService } from "./services/viewers.service";
import { ConnectViewerDto } from "./dto/connect-viewer.dto";
import { WsException } from "@nestjs/websockets";
import { AuthService } from "@contexts/auth/services/auth.service";
import { ConnectionService } from "@core/database/services/connection.service";
import { WebsocketExceptionsFilter } from "./exceptions/websocket-exceptions.filter";
import { ActivityViewerRepository } from "./repositories/activity-viewer.repository";
import { ActivityViewer } from "./entities/activity-viewer.entity";
import { ActivityUser } from "./entities/activity-user.entity";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@UseFilters(WebsocketExceptionsFilter)
export class ViewersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly viewersService: ViewersService,
    private readonly connectionService: ConnectionService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const token = ViewersService.getAccessToken(client);
    const subdomain = ViewersService.getCommunitySubdomain(client);
    const user = await this.authService.verifyToken(token, subdomain);

    if (!user) {
      client.disconnect();
      Logger.log(client.id, "Client not authorized");
      return null;
    }

    Logger.log(client.id, "Client connected");

    return { id: user.id, username: user.username };
  }

  async handleDisconnect(client: Socket) {
    const subdomain = ViewersService.getCommunitySubdomain(client);
    const user = await this.handleConnection(client);
    const connection = await this.connectionService.getConnection(subdomain, [
      ActivityViewer,
      ActivityUser,
    ]);
    const activityViewerRepository = new ActivityViewerRepository(connection);

    await this.viewersService.disconnect(client, activityViewerRepository);
    Logger.log(client.id, "Client diconnected");
  }

  @SubscribeMessage("connectToServer")
  @UsePipes(ValidationPipe)
  async handleConnectToServer(
    @ConnectedSocket() client: Socket,
    @MessageBody() connectViewerDto: ConnectViewerDto,
  ) {
    Logger.log(`${client.id}`, "connectToServer Received");
    const subdomain = ViewersService.getCommunitySubdomain(client);
    const user = await this.handleConnection(client);
    const connection = await this.connectionService.getConnection(subdomain, [
      ActivityViewer,
      ActivityUser,
    ]);
    const activityViewerRepository = new ActivityViewerRepository(connection);
    const data = {
      ...connectViewerDto,
      userId: user?.id || "0",
    };

    await this.viewersService.connect(client, activityViewerRepository, data);
    Logger.log(`${user?.username}:${client.id}`, "connectToServer");
  }
}
