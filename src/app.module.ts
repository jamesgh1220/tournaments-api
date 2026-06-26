import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './modules/teams/teams.module';
import { PhaseModule } from './modules/phase/phase.module';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/entities/group.entity';
import { MatchesModule } from './modules/matches/matches.module';
import { StandingsModule } from './modules/standings/standings.module';
import { UserOrmEntity } from './modules/users/infrastructure/persistence/user.orm-entity';
import { TournamentOrmEntity } from './modules/tournaments/infrastructure/persistence/tournament.orm-entity';
import { TeamOrmEntity } from './modules/teams/infrastructure/persistence/team.orm-entity';
import { PhaseOrmEntity } from './modules/phase/infrastructure/persistence/phase.orm-entity';
import { PhaseTypeOrmEntity } from './modules/phase/infrastructure/persistence/phase-type.orm-entity';
import { MatchOrmEntity } from './modules/matches/infrastructure/persistence/match.orm-entity';
import { StandingOrmEntity } from './modules/standings/infrastructure/persistence/standing.orm-entity';

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
          PhaseOrmEntity,
          PhaseTypeOrmEntity,
          Group,
          MatchOrmEntity,
          StandingOrmEntity,
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
