import {Body, Controller, Get, Post, Res} from '@nestjs/common';;
import {RentalService} from "./rental.service";
import {rentalDto} from "../dto/rental.dto";
import {Response} from "express";

@Controller('rental')
export class RentalController {
    constructor(private readonly RentalService: RentalService) {}

    @Post()
    rental(@Body() rentalDto:rentalDto, @Res() response: Response)
    {
        return this.RentalService.rental(rentalDto, response)
    }
}
