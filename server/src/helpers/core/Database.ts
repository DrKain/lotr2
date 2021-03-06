
import { Injectable } from 'injection-js';
import { Collection, Db, MongoClient } from 'mongodb';

import { BaseService } from '../../interfaces';
import { MetadataStorage } from './db/base';
import { BaseEntity } from './db/base/BaseEntity';

@Injectable()
export class Database extends BaseService {

  private client: MongoClient;
  private db: Db;

  public async init() {
    if (!process.env.DATABASE_URI) {
      this.game.logger.error('Database', 'You must specify a DATABASE_URI.');
      process.exit(0);
    }

    this.client = new MongoClient(process.env.DATABASE_URI as string, { useUnifiedTopology: true });
    await this.client.connect();

    this.db = this.client.db('landoftherair2');
  }

  public getCollection(entity): Collection {
    return this.db.collection(MetadataStorage.getCollectionForEntity(entity));
  }

  public async findSingle<T>(T, filter): Promise<T | null> {
    const foundSingle = await this.getCollection(T).findOne(filter);
    if (!foundSingle) return null;

    const newSingle = new T();

    Object.keys(foundSingle).forEach(key => {
      newSingle[key] = foundSingle[key];
    });

    return newSingle;
  }

  public async findMany<T>(T, filter): Promise<T[]> {
    const foundMany = await this.getCollection(T).find(filter).toArray();
    return foundMany.map(foundSingle => {
      const newSingle = new T();

      Object.keys(foundSingle).forEach(key => {
        newSingle[key] = foundSingle[key];
      });

      return newSingle;
    });
  }

  public getPersistObject(entity: BaseEntity) {
    return MetadataStorage.getPersistObject(entity);
  }

  public async save(entity: BaseEntity): Promise<any> {
    const collection = this.getCollection(entity);
    return collection.replaceOne({ _id: entity._id }, this.getPersistObject(entity), { upsert: true });
  }

  public async delete(entity: BaseEntity): Promise<any> {
    const collection = this.getCollection(entity);
    return collection.findOneAndDelete({ _id: entity._id });
  }

  public prepareForTransmission(entity): any {
    return MetadataStorage.getEnumerableObject(entity);
  }

}
