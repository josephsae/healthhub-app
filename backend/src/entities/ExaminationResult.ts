import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Appointment } from "./Appointment";
import { Examination } from "./Examination";
import { Procedure } from "./Procedure";

@Entity("examinationresults")
export class ExaminationResult {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Appointment,
    (appointment) => appointment.examinationResults,
    { onDelete: "CASCADE" }
  )
  appointment!: Appointment;

  @ManyToOne(
    () => Examination,
    (examination) => examination.examinationResults,
    { eager: true }
  )
  examination!: Examination;

  @ManyToOne(() => Procedure, (procedure) => procedure.examinationResults, {
    eager: true,
    nullable: true,
  })
  procedure!: Procedure | null;

  @Column("text")
  resultData!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date!: Date;
}
