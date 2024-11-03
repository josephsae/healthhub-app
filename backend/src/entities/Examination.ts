import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ExaminationResult } from "./ExaminationResult";

@Entity("examinations")
export class Examination {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => ExaminationResult, (result) => result.examination, {
    cascade: true,
  })
  examinationResults!: ExaminationResult[];
}
