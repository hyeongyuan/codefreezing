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
import { normalize } from '@lib/utils'

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

    const prevPostsTags = await repo.find({ where: { post_id: postId } })

    const normalized = {
      prev: normalize(prevPostsTags, (postTag) => postTag.tag_id),
      current: normalize(tags),
    }

    console.log(normalized)

    // Remove tags that are missing
    const missingTags = prevPostsTags.filter(
      (postTag) => !normalized.current[postTag.tag_id],
    )
    console.log({ missingTags })
    missingTags.forEach((tag) => repo.remove(tag))

    // Add tags that are new
    const tagsToAdd = tags.filter((tag) => !normalized.prev[tag.id])
    const postsTags = tagsToAdd.map((tag) => {
      const postTag = new PostsTags()
      postTag.post_id = postId
      postTag.tag_id = tag.id

      return postTag
    })
    console.log({ postsTags })
    return repo.save(postsTags)
  }
}
