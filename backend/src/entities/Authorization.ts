import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { MedicationRequest } from "./MedicationRequest";
import { AuthorizationType } from "../enums/AuthorizationType";

@Entity("authorizations")
export class Authorization {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.authorizations, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => MedicationRequest, { nullable: true, onDelete: "SET NULL" })
  medicationRequest!: MedicationRequest | null;

  @Column({
    type: "enum",
    enum: AuthorizationType,
  })
  type!: AuthorizationType;

  @Column({
    type: "enum",
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  })
  status!: string;

  @Column("text")
  request!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
