import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from "typeorm";
  import { Appointment } from "./Appointment";
  import { MedicalRecord } from "./MedicalRecord";
  import { MedicationRequest } from "./MedicationRequest";
  import { Authorization } from "./Authorization";
  
  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ unique: true })
    username!: string;
  
    @Column()
    password!: string;
  
    @OneToMany(() => Appointment, (appointment) => appointment.user, { cascade: true })
    appointments!: Appointment[];
  
    @OneToMany(() => MedicalRecord, (record) => record.user, { cascade: true })
    medicalRecords!: MedicalRecord[];
  
    @OneToMany(() => MedicationRequest, (request) => request.user, { cascade: true })
    medicationRequests!: MedicationRequest[];
  
    @OneToMany(() => Authorization, (authorization) => authorization.user, { cascade: true })
    authorizations!: Authorization[];
  }
  