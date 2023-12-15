import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>; //mongoose er data model -> Student, User .... abong method like find()
  public query: Record<string, unknown>; //url e asha query variable gula. -> searchTerm, limit, email ...

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // i. search
  //searchTerm er value ke amra 3 ta filed er value te search korteci. ei  jonno map use kore hoyce. r  name, name.firstName, email je kono akta field e match korlai result dibe ai jonno $or use kora hosce. r $options:i case sensitive er jonno.
  //{'email':{$regex:query.searchTerm, $option:i}}
  //or
  //{'name.firstName':{$regex:query.searchTerm, $option:i}}
  //or
  //{'presentAddress':{$regex:query.searchTerm, $option:i}}
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      //query parameter a searchTerm ase ki na dekha hosce
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this; // chaining korar jonno this return kora hoyce
  }

  // ii. filtering
  //query parameter e asha searchTerm, sort, ba aro onno je gula varibale asbe oigula amra bad deya sudu email ta ke rakteci karon amra email deya filter kortecai.
  filter() {
    const queryObject = { ...this.query }; //making copy of the query object
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);
    //chaining
    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);

    return this; // return this for further chaining
  }

  // iii. sort
  sort() {
    const sort =(this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt'; //default sort value. jodi sort na ase query parameter teka tokon je last e db te add hobe se sobar 1st e asbe.
    
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  // iv. pagination
  paginate() {
    const page = Number(this?.query?.page || 1);
    const limit = Number(this?.query?.limit || 5); // by default limit 1
    const skip = (page - 1) * limit;

    this.modelQuery = this?.modelQuery.skip(skip).limit(limit);
    return this;
  }

  //v. fields limit
  fields() {
    // incoming format -> 'name,email' // converted format -> 'name email'
    const fields = (this?.query?.fields as string)?.split(',')?.join(' ') || '-v'; //formatting
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
