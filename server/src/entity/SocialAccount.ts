import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '@entity/User'

@Entity({ name: 'social_accounts' })
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 12, nullable: false })
  provider!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  social_id!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column('uuid')
  user_id!: string;
}
