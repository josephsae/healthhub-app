import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ExaminationResult } from "./ExaminationResult";

@Entity("procedures")
export class Procedure {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => ExaminationResult, (result) => result.procedure, {
    cascade: true,
  })
  examinationResults!: ExaminationResult[];
}
