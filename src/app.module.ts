import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import { RentalController } from './rental/rental.controller';
import {RentalService} from "./rental/rental.service";
import {Rental, RentalSchema} from "./schemas/rental.schema";
import {Auto, AutoSchema} from "./schemas/auto.shema";

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://admin:1234@cluster0.pjgwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
            MongooseModule.forFeature([{ name: Rental.name, schema: RentalSchema }, {name:Auto.name, schema:AutoSchema}])],
  controllers: [AppController, RentalController],
  providers: [AppService, RentalService],
})
export class AppModule {}
