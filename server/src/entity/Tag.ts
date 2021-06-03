import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Post } from '@entity/Post'
import { PostsTags } from '@entity/PostsTags'

@Entity({
  name: 'tags',
})
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column({ type: 'varchar', length: 20, nullable: false })
  name!: string

  @OneToMany(() => PostsTags, postsTags => postsTags.tag)
  posts!: Post[]

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  static findByName(name: string) {
    const repo = getRepository(Tag)
    return repo.findOne({ name: name.toLowerCase() })
  }

  static async findOrCreate(name: string) {
    const existTag = await Tag.findByName(name)
    if (existTag) {
      return existTag
    }
    const repo = getRepository(Tag)
    const newTag = new Tag()
    newTag.name = name

    await repo.save(newTag)
    return newTag
  }
}
