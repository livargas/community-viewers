import { Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { DataSource } from "typeorm";
import { Socket } from "socket.io";
import dayjs from "dayjs";

import { ConnectViewerDto } from "../dto/connect-viewer.dto";
import { ActivityUser } from "../entities/activity-user.entity";
import { ActivityViewer } from "../entities/activity-viewer.entity";

export class ActivityViewerDatasource {
  constructor(private readonly connection: DataSource) {}

  async connect(
    client: Socket,
    connectViewerDto: ConnectViewerDto,
  ): Promise<boolean> {
    //await this.getActivityUser(connectViewerDto);
    // TODO: Validar si usuario ya esta conectado en v2
    await this.setActivityViewer(connectViewerDto, client);

    // Destruir conexión a base de datos
    this.connection.destroy();

    return true;
  }

  async disconnect(client: Socket): Promise<boolean> {
    const activityViewer = await this.getActivityViewerBySocketId(client);
    if (activityViewer) {
      const updatedAt = new Date();
      const connectionSeconds = dayjs(updatedAt).diff(
        activityViewer.created_at,
        "seconds",
      );
      await this.connection.getRepository(ActivityViewer).update(
        {
          id: activityViewer.id,
        },
        {
          connected: false,
          connection_time: connectionSeconds,
          updated_at: updatedAt,
        },
      );
    }

    // Destruir conexión a base de datos
    this.connection.destroy();

    return true;
  }

  private async setActivityViewer(
    connectViewerDto: ConnectViewerDto,
    client: Socket,
  ) {
    try {
      if (!(await this.getActivityViewerBySocketId(client))) {
        await this.createActivityViewer(connectViewerDto, client);
      }
    } catch (error) {
      this.connection.destroy();
      Logger.warn("ActivityViewerNotCreated", "Set Activity Viewer");
      throw new WsException("ActivityViewerNotCreated");
    }
  }

  private async getActivityUser(connectViewerDto: ConnectViewerDto) {
    try {
      await this.connection.getRepository(ActivityUser).findOneOrFail({
        where: {
          user_id: connectViewerDto.userId,
          activity_id: connectViewerDto.activityId,
        },
      });
    } catch {
      this.connection.destroy();
      Logger.warn(
        `ActivityUserNotFound ${connectViewerDto.userId}:${connectViewerDto.activityId}`,
        "Get Activity User",
      );
      throw new WsException("ActivityUserNotFound");
    }
  }

  private async createActivityViewer(
    connectViewerDto: ConnectViewerDto,
    client: Socket,
  ) {
    const activityViewerRepository =
      await this.connection.getRepository(ActivityViewer);
    const activityViewer = !connectViewerDto.unique
      ? await this.getActivityViewer(connectViewerDto)
      : null;
    if (activityViewer) {
      await activityViewerRepository.update(
        {
          id: activityViewer.id,
        },
        {
          socket_id: client.id,
        },
      );
    } else {
      const activityViewerEntity = await activityViewerRepository.create({
        user_id: connectViewerDto.userId,
        activity_id: connectViewerDto.activityId,
        connected: true,
        status: connectViewerDto.status,
        ip: client.handshake.address,
        socket_id: client.id,
        created_at: new Date(),
      });
      await activityViewerRepository.save(activityViewerEntity);
    }
  }

  private async getActivityViewerBySocketId(
    client: Socket,
  ): Promise<ActivityViewer | null> {
    try {
      return await this.connection.getRepository(ActivityViewer).findOneOrFail({
        where: {
          socket_id: client.id,
        },
      });
    } catch (error) {
      return null;
    }
  }

  private async getActivityViewer(
    connectViewerDto: ConnectViewerDto,
  ): Promise<ActivityViewer | null> {
    try {
      return await this.connection.getRepository(ActivityViewer).findOne({
        where: {
          user_id: connectViewerDto.userId,
          activity_id: connectViewerDto.activityId,
          connected: true,
          status: connectViewerDto.status,
        },
      });
    } catch (error) {
      return null;
    }
  }
}
