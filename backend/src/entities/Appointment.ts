import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Specialist } from "./Specialist";
import { ExaminationResult } from "./ExaminationResult";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp" })
  date!: Date;

  @Column()
  reason!: string;

  @ManyToOne(() => User, (user) => user.appointments, {
    eager: true,
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Specialist, (specialist) => specialist.appointments, {
    eager: true,
    onDelete: "CASCADE",
  })
  specialist!: Specialist;

  @OneToMany(() => ExaminationResult, (result) => result.appointment, {
    cascade: true,
  })
  examinationResults!: ExaminationResult[];
}
