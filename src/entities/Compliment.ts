import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { Tag } from './Tag';
import { User } from './User';

@Entity('compliments')
export class Compliment {
  @PrimaryColumn()
  readonly id: string;

  @Exclude()
  @Column()
  sender_id: string;

  @JoinColumn({ name: 'sender_id' })
  @ManyToOne(() => User)
  sender: User;

  @Exclude()
  @Column()
  receiver_id: string;

  @JoinColumn({ name: 'receiver_id' })
  @ManyToOne(() => User)
  receiver: User;

  @Exclude()
  @Column()
  tag_id: string;

  @JoinColumn({ name: 'tag_id' })
  @ManyToOne(() => Tag)
  tag: Tag;

  @Column()
  message: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    this.id = uuid();
  }
}
