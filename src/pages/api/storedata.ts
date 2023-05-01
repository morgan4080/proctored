// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json')
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + '/storeData.json',
    'utf8',
  )
  //Return the content of the data file in json format
  res.status(200).json(fileContents)
}
