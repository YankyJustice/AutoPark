import {Injectable, Res} from '@nestjs/common';
import {rentalDto} from "../dto/rental.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Rental, RentalDocument} from "../schemas/rental.schema";
import {Model} from "mongoose";
import {Auto, AutoDocument} from "../schemas/auto.shema";

@Injectable()
export class RentalService {
    constructor(
        @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
        @InjectModel(Auto.name) private autoModel: Model<AutoDocument>
    ) {
    }

    async rental(rentalDto: rentalDto, res) {
        const startDay = new Date(rentalDto.startDay)
        const endDay = new Date(startDay)
        endDay.setDate(startDay.getDate() + Number(rentalDto.countOfDays))
        const endDayString = endDay.toISOString().slice(0, 10)
        const startDayString = startDay.toISOString().slice(0, 10)
        const rentalDays = arrayRental(rentalDto.countOfDays, startDay)
        if (rentalDto.countOfDays < 31 && rentalDto.countOfDays > 0) {

            if (getWeekDay(startDay) === 'СБ' || getWeekDay(startDay) === 'ВС') {
                res.status(200).json({message: 'День старта аренды должен начинаться по будням'})
                return
            }
            if (getWeekDay(endDay) === 'СБ' || getWeekDay(endDay) === 'ВС') {
                res.status(200).json({message: 'День окончания аренды должен быть будним'})
                return
            }
            const targetAuto = await this.autoModel.findOne({number: rentalDto.number})
            const rentalBlock = rentalOrNo(targetAuto, rentalDays)
            if (rentalBlock.length === 0) {
                const tariff = chooseTariff(rentalDto.tariff)
                const price = priceCalculation(rentalDto.countOfDays, tariff)
                addRental(
                    rentalDto,
                    targetAuto,
                    this.rentalModel,
                    startDayString,
                    endDayString,
                    rentalDays,
                    res,
                    startDay,
                    endDay,
                    price)
                return
            }
            res.status(200).json({message: 'К сожалению, машина занята в эти дни', rentalBlock})
            return
        }
        res.status(200).json({message: 'Аренда не может длиться более 30 дней и менее 1 дня'})
        return
    }

}



const rentalOrNo = (targetAuto, rentalDays) => {
    const array = targetAuto.rental.filter(el => rentalDays.includes(el))
    return array
}

const arrayRental = (countOfDays, startDay) => {
    let array = []
    for (let i = 0; i < countOfDays; i++) {
        let day = new Date(startDay)
        day.setDate(day.getDate() + i)
        array.push(day)
    }
    return array.map(el => el.toISOString().slice(0, 10))
}

const addRental = async (
    rentalDto,
    targetAuto,
    rentalModel,
    startDayString,
    endDayString,
    arrayRental,
    res,
    startDay,
    endDay,
    price) => {
    const id = Date.now()
    const createRental = new rentalModel({id, startDay: startDayString, endDay: endDayString, auto: targetAuto, price})
    await targetAuto.rental.push(...arrayRental)
    await targetAuto.save()
    await createRental.save()
    res.status(200).json({
        message: 'Вы арендовали тачку',
        auto: {
            mark: targetAuto.mark,
            model: targetAuto.model,
            number: targetAuto.number,
            VIN: targetAuto.VIN
        },
        dateOfStart: startDay.toISOString().slice(0, 10),
        dateOfEnd: endDay.toISOString().slice(0, 10),
        price
    })
}


const getWeekDay = (date) => {
    let days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    return days[date.getDay()];
}

const chooseTariff = (tariff) => {
    switch (tariff) {
        case '200km':
            return 270
        case '350km':
            return 330
        case '500km':
            return 390
    }
}

const priceCalculation = (countOfDays, price) => {
    if (countOfDays > 2 && countOfDays < 6) {
        return (price * countOfDays) / 100 * 95
    }
    if (countOfDays > 5 && countOfDays < 15) {
        return (price * countOfDays) / 100 * 90
    }
    if (countOfDays > 14 && countOfDays < 31) {
        return (price * countOfDays) / 100 * 85
    }
    return price
}


