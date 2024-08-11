import { Injectable, Logger } from '@nestjs/common';
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

import { ConnectViewerDto } from "../dto/connect-viewer.dto";
import { ActivityUser } from "../entities/activity-user.entity";
import { ActivityViewer } from "../entities/activity-viewer.entity";
import { ActivityViewerRepository } from "../repositories/activity-viewer.repository";

@Injectable()
export class ViewersService {
  async connect(
    client: Socket,
    activityViewerRepository: ActivityViewerRepository,
    connectViewerDto: ConnectViewerDto,
  ): Promise<void> {
    await activityViewerRepository.connect(client, connectViewerDto);
  }

  async disconnect(
    client: Socket,
    activityViewerRepository: ActivityViewerRepository,
  ): Promise<void> {
    await activityViewerRepository.disconnect(client);
  }

  static getAccessToken(client: Socket): string {
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }
    
    const { authorization } = client.handshake.headers;
    // console.log('auth', JSON.stringify(client.handshake.auth));
    // console.log('headers', JSON.stringify(client.handshake.headers));
    // console.log('handshake', JSON.stringify(client.handshake));

    if (!authorization) {
      throw new WsException("Unauthorized: No token provided");
    }

    return authorization.split(" ").pop() as string;
  }

  static getCommunitySubdomain(client: Socket): string {
    const { communitySubdomain } = client.handshake.query;

    if (!communitySubdomain) {
      throw new WsException("Unauthorized: Not community subdomain provided");
    }

    return communitySubdomain as string;
  }
}
