import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MedicationRequest } from "./MedicationRequest";

@Entity("medications")
export class Medication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => MedicationRequest, (request) => request.medication, {
    cascade: true,
  })
  medicationRequests!: MedicationRequest[];
}
