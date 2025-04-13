import { getManager } from 'typeorm'
import { Post } from '@entity/Post'
import { User } from '@entity/User'
import { Tag } from '@entity/Tag'

interface IFetchPost {
  username: string
  urlSlug: string
}

export async function fetchPostWithTagsById(
  id: string,
): Promise<Post | undefined> {
  if (!id) return
  const query = await getManager().query(
    `
    SELECT 
      p.id AS id,
      p.title AS title,
      p.description AS description,
      p.code AS code,
      p.filename AS filename,
      p.is_private AS is_private,
      p.url_slug AS url_slug,
      p.created_at AS created_at,
      p.updated_at AS updated_at,
      u.id AS user_id,
      u.email AS email,
      u.username AS username,
      t.id AS tag_id,
      t.name AS tag_name
    FROM posts p
      LEFT JOIN users u ON u.id = p.user_id
      LEFT JOIN posts_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      WHERE p.id = $1;
  `,
    [id],
  )
  return makePostByQuery(query)
}

export async function fetchPostWithTags({
  username,
  urlSlug,
}: IFetchPost): Promise<Post | undefined> {
  if (!username || !urlSlug) return
  const query = await getManager().query(
    `
    SELECT 
      p.id AS id,
      p.title AS title,
      p.description AS description,
      p.code AS code,
      p.filename AS filename,
      p.is_private AS is_private,
      p.url_slug AS url_slug,
      p.created_at AS created_at,
      p.updated_at AS updated_at,
      u.id AS user_id,
      u.email AS email,
      u.username AS username,
      t.id AS tag_id,
      t.name AS tag_name
    FROM posts p
      LEFT JOIN users u ON u.id = p.user_id
      LEFT JOIN posts_tags pt ON pt.post_id = p.id
      LEFT JOIN tags t ON t.id = pt.tag_id
      WHERE u.username = $1 AND p.url_slug = $2;
  `,
    [username, urlSlug],
  )

  return makePostByQuery(query)
}

function makePostByQuery(query: any): Post | undefined {
  if (!query || query.length === 0) {
    return
  }
  const post = new Post()
  post.id = query[0].id
  post.title = query[0].title
  post.description = query[0].description
  post.code = query[0].code
  post.filename = query[0].filename
  post.is_private = query[0].is_private
  post.url_slug = query[0].url_slug
  post.created_at = query[0].created_at
  post.updated_at = query[0].updated_at

  const user = new User()
  user.id = query[0].user_id
  user.email = query[0].email
  user.username = query[0].username
  post.user = user

  const tags = query
    .map((q: any) => {
      if (!q.tag_id || !q.tag_name) {
        return
      }

      const tag = new Tag()
      tag.id = q.tag_id
      tag.name = q.tag_name

      return tag
    })
    .filter(Boolean)
  post.tags = tags

  return post
}
