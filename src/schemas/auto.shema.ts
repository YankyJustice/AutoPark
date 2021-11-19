import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AutoDocument = Auto & Document;

@Schema()
export class Auto {

    @Prop({ required: true })
    mark: string

    @Prop({ required: true })
    model: string

    @Prop({ required: true, unique:true})
    number: string

    @Prop({ required: true })
    VIN: string;

    @Prop()
    rental:string[]
}

export const AutoSchema = SchemaFactory.createForClass(Auto);