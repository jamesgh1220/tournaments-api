import { Injectable } from '@nestjs/common';
import { GroupDto } from '../dto/group.dto';
import { CreateGroupUseCase } from '../use-cases/create-group.use-case';
import { UpdateGroupUseCase } from '../use-cases/update-group.use-case';
import { DeleteGroupUseCase } from '../use-cases/delete-group.use-case';
import { FindGroupsUseCase } from '../use-cases/find-groups.use-case';
import { FindByIdGroupUseCase } from '../use-cases/find-by-id-group.use-case';
import { Group } from '../../domain/entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
    private readonly findGroupsUseCase: FindGroupsUseCase,
    private readonly findByIdGroupUseCase: FindByIdGroupUseCase,
  ) {}

  async find(): Promise<Group[] | []> {
    return await this.findGroupsUseCase.execute();
  }

  async findById(id: number): Promise<Group | null> {
    return await this.findByIdGroupUseCase.execute(id);
  }

  async create(dto: GroupDto): Promise<Group | null> {
    return await this.createGroupUseCase.execute(dto);
  }

  async update(id: number, dto: GroupDto): Promise<Group | null> {
    return await this.updateGroupUseCase.execute(id, dto);
  }

  async remove(id: number): Promise<void> {
    await this.deleteGroupUseCase.execute(id);
  }
}
