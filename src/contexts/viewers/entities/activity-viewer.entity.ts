import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("activity_viewers")
export class ActivityViewer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 191 })
  activity_id: string;

  @Column({ type: "varchar", length: 191 })
  user_id: string;

  @Column({ type: "varchar", length: 191 })
  ip: string;

  @Column({ type: "varchar", length: 191 })
  socket_id: string;

  @Column({ type: "tinyint" })
  connected: boolean;

  @Column({ type: "enum", enum: ["onwait", "live", "record"] })
  status: string;

  @Column({ type: "bigint", nullable: true })
  connection_time: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(3)",
  })
  updated_at: Date;
}
