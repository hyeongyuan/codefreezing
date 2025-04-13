import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { PostsTags } from '@entity/PostsTags'
import { User } from '@entity/User'
import { Tag } from './Tag'

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  title!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null

  @Column('text')
  code!: string

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @OneToMany(() => PostsTags, (postsTags) => postsTags.post)
  tags!: Tag[]

  @Column({ type: 'varchar', length: 40 })
  filename!: string

  @Column({ type: 'bool', default: true })
  is_private!: boolean

  @Index()
  @Column({ type: 'varchar', length: 255 })
  url_slug!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
