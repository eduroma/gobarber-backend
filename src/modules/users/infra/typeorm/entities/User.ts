import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer'

import uploadConfig from '@config/upload';

@Entity('users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {

    if (!this.avatar) {
      return null
    }

    switch (uploadConfig.driver) {

      case 'disk':
        return `${process.env.APP_API_URL} /files/${this.avatar}`

      case 's3':
        return `https://${uploadConfig.config.s3.bucket}.s3.${uploadConfig.config.s3.region}.amazonaws.com/${this.avatar}`

      default:
        return null
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Users;
