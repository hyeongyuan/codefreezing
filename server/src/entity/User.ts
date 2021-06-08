import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { generateToken } from '@lib/auth'
import { Post } from '@entity/Post'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 48, nullable: false, unique: true })
  username!: string

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[]

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  async generateToken() {
    const accessToken = await generateToken(
      {
        user_id: this.id,
      },
      {
        subject: 'access_token',
        expiresIn: '3h',
      },
    )

    const refreshToken = await generateToken(
      {
        user_id: this.id,
      },
      {
        subject: 'refresh_token',
        expiresIn: '15d',
      },
    )

    return {
      accessToken,
      refreshToken,
    }
  }
}
