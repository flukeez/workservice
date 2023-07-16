import { FastifyInstance } from 'fastify';
import TypeManageModel from '../models/TypeManageModel';


export default async function TypeManageController(fastify:FastifyInstance) {
    const db = fastify.db
    const typeManageModel = new TypeManageModel()

    //get all
    fastify.get('/', async (request, replay) => {
        try {
            const { results, totalItem, totalPage} = await typeManageModel.getMany(db)

            replay.send({
                message: 'GET TypeManages',
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
        const rs: any = await typeManageModel.getById(db,id)

        replay.send({row:rs})
    })

    //insert
    fastify.post('/create', async (request, replay) => {
        try {
            const {manage_type, durable_goods, building}: any = request.body
            const {id} = await typeManageModel.createTypeManage(db, manage_type, durable_goods, building);

            replay.send({message: `เพิ่มข้อมูลสำเร็จ`, rows: {id:id, manage_type:manage_type, durable_goods:durable_goods, building:building}})

        } catch (error) {
            console.log('Error =>', error)
            throw error
        }
    })

    //update
    fastify.put('/:id', async (request, replay) => {
        try {
            const {id}:any = request.params
            const {manage_type, durable_goods, building}: any = request.body

            const result = await typeManageModel.updateTypeManage(db, id, manage_type, durable_goods, building)

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
            const result = await typeManageModel.deleteTypeManage(db, id)

            replay.send({message: `ลบข้อมูลสำเร็จ`, rows:result})
        }catch (error) {
            console.log('Error =>', error)
            throw error
        }
    })
}