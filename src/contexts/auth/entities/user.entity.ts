import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 191 })
  username: string;

  @Column({ type: "varchar", length: 191 })
  password: string;
}
