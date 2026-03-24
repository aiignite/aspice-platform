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
import { Project } from "./Project";

@Entity("sprints")
export class Sprint {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  goal!: string;

  @Column("uuid")
  projectId!: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "projectId" })
  project!: Project;

  @Column({ nullable: true })
  startDate!: Date;

  @Column({ nullable: true })
  endDate!: Date;

  @Column({ default: "planning" }) // planning, active, completed
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
