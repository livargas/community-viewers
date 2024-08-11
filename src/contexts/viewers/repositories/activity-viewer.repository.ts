import { DataSource } from 'typeorm';
import { ActivityViewerDatasource } from '../datasources/activity-viewer.datasource';
import { Socket } from 'socket.io';
import { ConnectViewerDto } from '../dto/connect-viewer.dto';

export class ActivityViewerRepository {

  private readonly activityViewerDatasource: ActivityViewerDatasource;

  constructor(private readonly connection: DataSource) {
    this.activityViewerDatasource = new ActivityViewerDatasource(connection);
  }

  async connect(client: Socket, connectViewerDto: ConnectViewerDto) {
    return await this.activityViewerDatasource.connect(client, connectViewerDto);
  }

  async disconnect(client: Socket) {
    return await this.activityViewerDatasource.disconnect(client);
  }

}