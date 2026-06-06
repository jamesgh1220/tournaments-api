import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Tournament } from './tournaments/entities/tournament.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';
import { Team } from './teams/entities/teams.entity';
import { PhaseModule } from './phase/phase.module';
import { Phase } from './phase/entities/phase.entity';
import { PhaseType } from './phase/entities/phase-type.entity';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/entities/group.entity';
import { MatchesModule } from './matches/matches.module';
import { Match } from './matches/entities/match.entity';
import { StandingsModule } from './standings/standings.module';
import { Standing } from './standings/entities/standing.entity';

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
          User,
          Tournament,
          Team,
          Phase,
          PhaseType,
          Group,
          Match,
          Standing,
        ],
        synchronize: true, // false en producción
      }),
    }),

    UsersModule,
    AuthModule,
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
