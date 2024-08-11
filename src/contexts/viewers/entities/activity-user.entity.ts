import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("activity_users")
export class ActivityUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 191 })
  activity_id: string;

  @Column({ type: "varchar", length: 191 })
  user_id: string;
}
