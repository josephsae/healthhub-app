import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Medication } from "./Medication";
import { MedicationRequestStatus } from "../enums/MedicationRequestStatus";

@Entity("medicationrequests")
export class MedicationRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.medicationRequests, {
    onDelete: "CASCADE",
  })
  user!: User;

  @ManyToOne(() => Medication, (medication) => medication.medicationRequests, {
    eager: true,
  })
  medication!: Medication;

  @Column({
    type: "enum",
    enum: MedicationRequestStatus,
    default: MedicationRequestStatus.PENDING,
  })
  status!: MedicationRequestStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  requestedAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  approvedAt!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  rejectedAt!: Date | null;

  @Column("text", { nullable: true })
  comments!: string | null;
}
