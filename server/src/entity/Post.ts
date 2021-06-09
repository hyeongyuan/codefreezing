import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'
import { User } from '@entity/User'

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  title!: string

  @Column('text')
  code!: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user!: User

  @OneToMany(() => PostsTags, (postsTags) => postsTags.post)
  tags!: Tag[]

  @Column({ type: 'varchar', length: 40 })
  language!: string

  @Column({ type: 'bool', default: true })
  is_private!: boolean

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  serialize() {
    const { tags, ...rest } = this

    return {
      ...(tags && { tags: tags.map((tag) => tag.name) }),
      ...rest,
    }
  }
}
