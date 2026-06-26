import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './application/services/groups.service';
import { GroupsController } from './infrastructure/http/groups.controller';
import { GroupOrmEntity } from './infrastructure/persistence/group.orm-entity';
import { CreateGroupUseCase } from './application/use-cases/create-group.use-case';
import { UpdateGroupUseCase } from './application/use-cases/update-group.use-case';
import { DeleteGroupUseCase } from './application/use-cases/delete-group.use-case';
import { FindGroupsUseCase } from './application/use-cases/find-groups.use-case';
import { FindByIdGroupUseCase } from './application/use-cases/find-by-id-group.use-case';
import { GroupRepository } from './infrastructure/persistence/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupOrmEntity])],
  providers: [
    GroupsService,
    CreateGroupUseCase,
    UpdateGroupUseCase,
    DeleteGroupUseCase,
    FindGroupsUseCase,
    FindByIdGroupUseCase,
    {
      provide: 'IGroupRepository',
      useClass: GroupRepository,
    },
  ],
  controllers: [GroupsController],
})
export class GroupsModule {}
