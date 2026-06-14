import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './modules/teams/teams.module';
import { PhaseModule } from './phase/phase.module';
import { Phase } from './phase/entities/phase.entity';
import { PhaseType } from './phase/entities/phase-type.entity';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/entities/group.entity';
import { MatchesModule } from './matches/matches.module';
import { Match } from './matches/entities/match.entity';
import { StandingsModule } from './standings/standings.module';
import { Standing } from './standings/entities/standing.entity';
import { UserOrmEntity } from './modules/users/infrastructure/persistence/user.orm-entity';
import { TournamentOrmEntity } from './modules/tournaments/infrastructure/persistence/tournament.orm-entity';
import { TeamOrmEntity } from './modules/teams/infrastructure/persistence/team.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASS'),
        database: cfg.get('DB_NAME'),
        entities: [
          UserOrmEntity,
          TournamentOrmEntity,
          TeamOrmEntity,
          Phase,
          PhaseType,
          Group,
          Match,
          Standing,
        ],
        synchronize: true,
      }),
    }),

    UsersModule,
    TournamentsModule,
    TeamsModule,
    PhaseModule,
    GroupsModule,
    MatchesModule,
    StandingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
