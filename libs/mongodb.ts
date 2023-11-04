import { MongoClient, GridFSBucket } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let bucket: GridFSBucket
let clientPromise: Promise<MongoClient>

function mdl() {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      bucket = new GridFSBucket(client.db(), {
        bucketName: 'images',
      })
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
    return { clientPromise: clientPromise, bucket: bucket! }
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    bucket = new GridFSBucket(client.db(), {
      bucketName: 'images',
    })
    clientPromise = client.connect()

    return { clientPromise: clientPromise, bucket: bucket! }
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mdl()
