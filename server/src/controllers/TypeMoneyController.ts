import { FastifyInstance } from 'fastify';
import TypeMoneyModel from '../models/TypeMoneyModel';


export default async function TypeMoneyController(fastify:FastifyInstance) {
    const db = fastify.db
    const typeMoneyModel = new TypeMoneyModel()

    //get all
    fastify.get('/', async (request, replay) => {
        try {
            const { results, totalItem, totalPage} = await typeMoneyModel.getMany(db)

            replay.send({
                message: 'GET TypeMoneys',
                rows: results,
                totalItem,
                totalPage,
            })
        } catch (error) {
            console.log('Error =>', error)
            throw error
        }
    })

    //get by id
    fastify.get('/:id', async (request, replay) => {
        const {id}:any = request.params
        const rs: any = await typeMoneyModel.getById(db,id)

        replay.send({row:rs})
    })

    //insert
    fastify.post('/create', async (request, replay) => {
        try {
            const {code, money_type, durable_goods, building}: any = request.body
            const {id} = await typeMoneyModel.createTypeMoney(db, code, money_type, durable_goods, building);

            replay.send({message: `เพิ่มข้อมูลสำเร็จ`, rows: {id:id, code:code, money_type:money_type, durable_goods:durable_goods, building:building}})

        } catch (error) {
            console.log('Error =>', error)
            throw error
        }
    })

    //update
    fastify.put('/:id', async (request, replay) => {
        try {
            const {id}:any = request.params
            const {code, money_type, durable_goods, building}: any = request.body

            const result = await typeMoneyModel.updateTypeMoney(db, id, code, money_type, durable_goods, building)

            replay.send({message: `แก้ไขข้อมูลสำเร็จ`, rows:result})
        } catch (error) {
            console.log('Error =>', error)
            throw error
        }
        
    } )

    //delete
    fastify.delete('/:id', async(request, replay) => {
        try {
            const {id}:any = request.params
            const result = await typeMoneyModel.deleteTypeMoney(db, id)

            replay.send({message: `ลบข้อมูลสำเร็จ`, rows:result})
        }catch (error) {
            console.log('Error =>', error)
            throw error
        }
    })
}