import {
  CreateDateColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import {Tag} from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'

@Entity({
  name: 'posts',
})
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  title!: string

  @Column('text')
  code!: string

  @OneToMany(() => PostsTags, (postsTags) => postsTags.post)
  tags?: Tag[]

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  serialize() {
    const { tags, ...rest } = this
    
    return {
      ...tags && {tags: tags.map(tag => tag.name)},
      ...rest,
    }
  }
}
