import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Activity } from './entities/activity.entity';
import { NftMarketPlace } from '../../common/external/nftMarkets/nftMarketsPlace';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Token } from './entities/token.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Optional } from 'sequelize';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity)
    private activityModel: typeof Activity,
    @InjectModel(Token)
    private tokenModel: typeof Token,
    private readonly nftMarketPlace: NftMarketPlace,
    private eventEmitter: EventEmitter2,
  ) {}

  async insertActivity(createActivityDto) {
    const activity =
      await this.activityModel.bulkCreate<Activity>(createActivityDto);
    this.eventEmitter.emit(
      'new.event',
      activity.map((activity) => activity.toJSON()),
    );
  }

  @Cron(CronExpression.EVERY_5_SECONDS, { name: 'events' })
  private async askForStatusChange() {
    const result = await this.nftMarketPlace.askStatusChange();
    if (result?.length) {
      try {
        await this.insertActivity(result);
      } catch (e) {
        throw new BadRequestException(
          `An error occurred inserting data, ${e.message}`,
          {
            cause: e,
          },
        );
      }
    }
  }

  async findOrCreateToken(createTokenDto: CreateTokenDto) {
    const { contract_address, index, current_price } = createTokenDto;
    try {
      return this.tokenModel.findOrCreate({
        where: { index, contract_address },
        defaults: { current_price },
      });
    } catch (e) {
      throw new BadRequestException(`An error occurred, ${e?.message}`, {
        cause: e,
      });
    }
  }

  async findNFTListing(token_index: string, contract_address: string) {
    return this.activityModel.findAll({
      where: { token_index, contract_address },
    });
  }

  async updateListing(
    updateTokenDto: UpdateTokenDto,
    fieldsToUpdate: Partial<Token>,
  ) {
    const { index, contract_address } = updateTokenDto;
    return this.tokenModel.update(
      { ...fieldsToUpdate },
      { where: { index, contract_address } },
    );
  }
}
