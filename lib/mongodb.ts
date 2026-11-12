import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI. Add it to your .env file.")
}

const mongoUri: string = uri
const DB_NAME = "hireloopdb"

declare global {
  // Reuse the connection during development hot reloads.
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function connect() {
  const client = new MongoClient(mongoUri)
  return client.connect()
}

// In production every server instance gets its own connection.
// In development Next.js reloads modules, so we keep one on `globalThis`.
const clientPromise =
  process.env.NODE_ENV === "development"
    ? (globalThis._mongoClientPromise ??= connect())
    : connect()

/** Returns the shared `hireloopdb` database. */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(DB_NAME)
}
