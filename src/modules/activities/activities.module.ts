import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { ActivityCreatedListener } from './listeners/activity-event.listeners';
import { Token } from './entities/token.entity';
import { NftMarketPlace } from '../../common/external/nftMarkets/nftMarketsPlace';

@Module({
  imports: [SequelizeModule.forFeature([Activity, Token])],
  providers: [ActivitiesService, ActivityCreatedListener, NftMarketPlace],
})
export class ActivitiesModule {}
