import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "@entity/Post";
import { User } from "@entity/User";


@Entity({ name: 'post_likes' })
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  post_id!: string;

  @Column('uuid')
  user_id!: string;

  @Index()
  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Post, { cascade: true, eager: true })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @ManyToOne(type => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}