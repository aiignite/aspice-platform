import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: "planning" }) // planning, active, on_hold, completed
  status!: string;

  @Column({ nullable: true })
  startDate!: Date;

  @Column({ nullable: true })
  endDate!: Date;

  @Column({ nullable: true })
  aspiceLevel!: number; // 1, 2, or 3

  @Column("simple-json", { nullable: true })
  vdaScope!: string[]; // VDA scope processes selected

  @Column("uuid")
  ownerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "ownerId" })
  owner!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
