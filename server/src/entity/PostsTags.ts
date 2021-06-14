import {
  Column,
  Entity,
  getRepository,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'

@Entity({ name: 'posts_tags' })
export class PostsTags {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index()
  @Column('uuid')
  post_id!: string

  @Index()
  @Column('uuid')
  tag_id!: string

  @ManyToOne(() => Post, (post) => post.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post!: Post

  @ManyToOne(() => Tag, (tag) => tag.posts)
  @JoinColumn({ name: 'tag_id' })
  tag!: Tag

  static async syncPostTags(postId: string, tags: Tag[]) {
    const repo = getRepository(PostsTags)

    const postTags = tags.map((tag) => {
      const postTag = new PostsTags()
      postTag.post_id = postId
      postTag.tag_id = tag.id

      return postTag
    })
    return repo.save(postTags)
  }
}
