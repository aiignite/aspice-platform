import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: "backlog" }) // backlog, todo, in_progress, review, done
  status!: string;

  @Column({ default: "medium" }) // low, medium, high, critical
  priority!: string;

  @Column("uuid")
  projectId!: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: "projectId" })
  project!: Project;

  @Column("uuid", { nullable: true })
  assigneeId!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assigneeId" })
  assignee!: User;

  @Column({ nullable: true })
  aspiceProcess!: string; // e.g., "SWE.1", "SYS.1"

  @Column({ nullable: true })
  workProduct!: string; // e.g., "SRS", "SDS"

  @Column({ nullable: true })
  sprintId!: string;

  @Column({ nullable: true })
  dueDate!: Date;

  @Column({ type: "int", default: 0 })
  estimatedHours!: number;

  @Column({ type: "int", default: 0 })
  actualHours!: number;

  @Column({ type: "int", default: 0 })
  orderIndex!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
