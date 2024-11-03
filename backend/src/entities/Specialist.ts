import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Entity("specialists")
export class Specialist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false }) 
  name!: string;

  @Column()
  specialization!: string;

  @OneToMany(() => Appointment, (appointment) => appointment.specialist, {
    cascade: true,
  })
  appointments!: Appointment[];
}
