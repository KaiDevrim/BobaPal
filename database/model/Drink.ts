import { Model } from '@nozbe/watermelondb';
import { field, text, date } from '@nozbe/watermelondb/decorators';

export default class Drink extends Model {
  static table = 'drinks';

  @text('flavor') flavor!: string;
  @field('price') price!: number;
  @text('store') store!: string;
  @text('occasion') occasion!: string;
  @field('rating') rating!: number;
  @text('date') date!: string;
  @text('photo_url') photoUrl!: string | null;
  @text('s3_key') s3Key!: string | null;
  @text('user_id') userId!: string;
  @field('synced') synced!: boolean;
  @date('last_modified') lastModified!: Date;
}
