import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from "mongoose";
import {Auto} from "./auto.shema";

export type RentalDocument = Rental & Document;

@Schema()
export class Rental {

    @Prop({ required: true, unique:true })
    id: number

    @Prop({ required: true })
    startDay: string

    @Prop({ required: true })
    endDay: string

    price: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auto' })
    auto: Auto;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);