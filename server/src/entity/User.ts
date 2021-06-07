import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { generateToken } from '@lib/auth'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 48, nullable: false, unique: true })
  username!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  async generateToken() {
    return generateToken(
      {
        subject: 'accessToken',
        userId: this.id,
      },
      {
        expiresIn: '15d', // TODO: Set this to 3days later on
      },
    )
  }
}
