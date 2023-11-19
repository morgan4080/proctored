// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoInvalidArgumentError, ObjectId } from 'mongodb'
import mongoClient from '@/lib/mongodb'
import {
  CategoryWithSubCategoryAndService,
  ServiceCategoriesWithSubCategories,
  ServiceSubCategories,
} from '@/lib/service_types'

const { clientPromise } = mongoClient

type ResponseData = {
  data: Record<any, any>
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const client = await clientPromise
  const db = client.db('proctor')
  const { category, sub_category, slug, links, id } = req.query

  switch (req.method) {
    case 'PUT':
      if (category) {
        try {
          const { _id, title, slug, description, subcategories, products } =
            req.body
          const services_collection = db.collection('services_category')
          const ddd = await services_collection.updateOne(
            { _id: new ObjectId(_id) },
            {
              $set: {
                title,
                slug,
                description,
                subcategories: (subcategories as string[]).map(
                  (sc) => new ObjectId(sc),
                ),
                products,
              },
            },
          )

          const response = {
            data: ddd,
            message: 'Service Category Updated Successfully',
          }
          res.status(200).json(response)
        } catch (e: MongoInvalidArgumentError | any) {
          console.error(e)
          res.status(400).json({
            data: {},
            message: e.message,
          })
        }
      } else if (sub_category) {
        try {
          const { _id, title, slug, description } = req.body
          const services_collection = db.collection('services_sub_category')
          const ddd = await services_collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { title, slug, description } },
          )

          const response = {
            data: ddd,
            message: 'Service Sub-Category Updated Successfully',
          }
          res.status(200).json(response)
        } catch (e: MongoInvalidArgumentError | any) {
          console.error(e)
          res.status(400).json({
            data: {},
            message: e.message,
          })
        }
      } else {
        try {
          const { _id, title, slug, excerpt, description, updated } = req.body
          const services_collection = db.collection('services')
          const ddd = await services_collection.updateOne(
            { _id: new ObjectId(_id) },
            {
              $set: {
                title,
                slug,
                excerpt,
                description,
                category: req.body.category
                  ? new ObjectId(req.body.category)
                  : null,
                subcategory: req.body.subcategory
                  ? new ObjectId(req.body.subcategory)
                  : null,
                updated,
              },
            },
          )

          const response = {
            data: ddd,
            message: 'Service Updated Successfully',
          }
          res.status(200).json(response)
        } catch (e: MongoInvalidArgumentError | any) {
          console.error(e)
          res.status(400).json({
            data: {},
            message: e.message,
          })
        }
      }
      break
    case 'POST':
      if (category) {
        const { title, slug, description, subcategories, products } = req.body
        const services_collection = db.collection('services_category')
        const { acknowledged, insertedId } =
          await services_collection.insertOne({
            title,
            slug,
            description,
            subcategories: (subcategories as string[]).map(
              (sc) => new ObjectId(sc),
            ),
            products,
          })
        if (acknowledged) {
          const response = {
            data: {
              _id: insertedId.toString(),
              ...req.body,
            },
            message: 'Service Category Created Successfully',
          }
          res.status(200).json(response)
        } else {
          res.status(500).json({
            data: {},
            message: 'Failed to create service category',
          })
        }
      } else if (sub_category) {
        const { title, slug, description } = req.body
        const services_collection = db.collection('services_sub_category')
        const { acknowledged, insertedId } =
          await services_collection.insertOne({
            title,
            slug,
            description,
          })
        if (acknowledged) {
          const response = {
            data: {
              _id: insertedId.toString(),
              ...req.body,
            },
            message: 'Service Sub-Category Created Successfully',
          }
          res.status(200).json(response)
        } else {
          res.status(500).json({
            data: {},
            message: 'Failed to create service sub-category',
          })
        }
      } else {
        try {
          const { title, slug, excerpt, description, updated } = req.body
          const services_collection = db.collection('services')
          const { acknowledged, insertedId } =
            await services_collection.insertOne({
              title,
              slug,
              excerpt,
              description,
              category: new ObjectId(req.body.category),
              subcategory: new ObjectId(req.body.subcategory),
              updated,
            })
          if (acknowledged) {
            const response = {
              data: {
                _id: insertedId.toString(),
                ...req.body,
              },
              message: 'Service Created Successfully',
            }
            res.status(200).json(response)
          } else {
            res.status(500).json({
              data: {},
              message: 'Failed to create service',
            })
          }
        } catch (e) {
          console.error(e)
        }
      }
      break
    case 'GET':
      if (category) {
        if (id) {
          if (typeof id == 'string') {
            const services_category = await db
              .collection('services_category')
              .aggregate<ServiceCategoriesWithSubCategories>([
                {
                  $match: {
                    _id: new ObjectId(id),
                  },
                },
                {
                  $lookup: {
                    from: 'services_sub_category',
                    localField: 'subcategories',
                    foreignField: '_id',
                    as: 'subcategories_data',
                  },
                },
                {
                  $project: {
                    title: 1,
                    slug: 1,
                    description: 1,
                    products: 1,
                    subcategories: '$subcategories_data',
                  },
                },
              ])
              .sort({ metacritic: -1 })
              .limit(1)
              .toArray()

            if (services_category && services_category.length > 0) {
              const { _id, subcategories, ...sc } = services_category[0]
              const response = {
                data: {
                  _id: _id.toString(),
                  subcategories: subcategories.map((sc) => {
                    const { _id, ...other } = sc
                    return {
                      _id: _id.toString(),
                      ...other,
                    }
                  }),
                  ...sc,
                },
                message: 'Ok',
              }

              res.status(200).json(response)
            } else {
              res.status(200).json({
                data: {},
                message: 'Service Category not found',
              })
            }
          } else {
            res.status(500).json({
              data: {},
              message: 'ID is not of type string',
            })
          }
        } else {
          // fetch all categories
          const servicesCategories = await db
            .collection('services_category')
            .aggregate<ServiceCategoriesWithSubCategories>([
              {
                $lookup: {
                  from: 'services_sub_category',
                  localField: 'subcategories',
                  foreignField: '_id',
                  as: 'subcategories_data',
                },
              },
              {
                $project: {
                  title: 1,
                  slug: 1,
                  description: 1,
                  products: 1,
                  subcategories: '$subcategories_data',
                },
              },
            ])
            .sort({ metacritic: -1 })
            .limit(1000)
            .toArray()
          const serviceCategories = servicesCategories.map((s) => {
            const { _id, subcategories, ...sc } = s
            return {
              _id: _id.toString(),
              subcategories: subcategories.map((sc) => {
                const { _id, ...other } = sc
                return {
                  _id: _id.toString(),
                  ...other,
                }
              }),
              ...sc,
            }
          })

          const response = {
            data: serviceCategories,
            message: 'Ok',
          }

          res.status(200).json(response)
        }
      } else if (sub_category) {
        if (id) {
          if (typeof id == 'string') {
            const services_sub_category = await db
              .collection<ServiceSubCategories>('services_sub_category')
              .findOne({ _id: new ObjectId(id) as any })

            if (services_sub_category) {
              const { _id, ...ssc } = services_sub_category
              const response = {
                data: {
                  _id: _id.toString(),
                  ...ssc,
                },
                message: 'Ok',
              }

              res.status(200).json(response)
            } else {
              res.status(200).json({
                data: {},
                message: 'Service Sub-Category not found',
              })
            }
          } else {
            res.status(500).json({
              data: {},
              message: 'ID is not of type string',
            })
          }
        } else {
          // fetch all sub category
          const services_sub_category = await db
            .collection<ServiceSubCategories>('services_sub_category')
            .find({})
            .sort({ metacritic: -1 })
            .limit(1000)
            .toArray()
          const services_sub_categories = services_sub_category.map((s) => {
            const { _id, ...ssc } = s
            return {
              _id: _id.toString(),
              ...ssc,
            }
          })

          const response = {
            data: services_sub_categories,
            message: 'Ok',
          }

          res.status(200).json(response)
        }
      } else if (links) {
        try {
          const category_subcategory_services = await db
            .collection('services_category')
            .aggregate<CategoryWithSubCategoryAndService>([
              {
                $lookup: {
                  from: 'services_sub_category',
                  localField: 'subcategories',
                  foreignField: '_id',
                  as: 'subcategories',
                },
              },
              {
                $unwind: '$subcategories', // Deconstruct the array to work with each subcategory
              },
              {
                $lookup: {
                  from: 'services',
                  localField: 'subcategories._id',
                  foreignField: 'subcategory',
                  as: 'services',
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  slug: 1,
                  description: 1,
                  subcategories: {
                    _id: '$subcategories._id',
                    title: '$subcategories.title',
                    slug: '$subcategories.slug',
                    description: '$subcategories.description',
                    services: '$services',
                  },
                },
              },
              {
                $group: {
                  _id: '$_id',
                  title: { $first: '$title' },
                  slug: { $first: '$slug' },
                  description: { $first: '$description' },
                  subcategories: { $push: '$subcategories' }, // Push the modified subcategories array
                },
              },
            ])
            .sort({ metacritic: -1 })
            .toArray()

          const response = {
            data: category_subcategory_services.map((css) => {
              const { _id, title, slug, description, ...other } = css
              return {
                _id: _id.toString(),
                title,
                slug,
                description,
                subcategories: other.subcategories.map((sc) => {
                  const { _id, services, ...rest } = sc
                  return {
                    _id: _id.toString(),
                    ...rest,
                    services: services.map((s) => {
                      const { _id, category, subcategory, ...rests } = s
                      return {
                        _id: _id.toString(),
                        category: category.toString(),
                        subcategory: subcategory.toString(),
                        ...rests,
                      }
                    }),
                  }
                }),
              }
            }),
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      } else if (slug) {
        try {
          const service = await db
            .collection('services')
            .find({ slug: slug })
            .sort({ metacritic: -1 })
            .limit(1000)
            .toArray()

          const response = {
            data: service,
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      } else {
        try {
          const services = await db
            .collection('services')
            .find({})
            .sort({ metacritic: -1 })
            .limit(1000)
            .toArray()
          const response = {
            data: services,
            message: 'Ok',
          }

          res.status(200).json(response)
        } catch (e) {
          console.error(e)
        }
      }
      break
    case 'DELETE':
      if (category && id) {
        const deleteResponse = await db
          .collection('services_category')
          .deleteOne({ _id: id })

        res.status(200).json({
          data: deleteResponse,
          message: 'Service category deleted',
        })
      } else if (sub_category && id) {
        const deleteResponse = await db
          .collection('services_sub_category')
          .deleteOne({ _id: id })

        res.status(200).json({
          data: deleteResponse,
          message: 'Service sub-category deleted',
        })
      } else if (id && typeof id == 'string') {
        const deleteResponse = await db
          .collection('services')
          .deleteOne({ _id: new ObjectId(id) })

        res.status(200).json({
          data: deleteResponse,
          message: 'Service deleted',
        })
      } else {
        res.status(400)
      }
      break
    default:
      res.status(400)
  }
}
