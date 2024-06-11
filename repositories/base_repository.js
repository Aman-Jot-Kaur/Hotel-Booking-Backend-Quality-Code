exports.base_repository = class base_repository {
    constructor({ model }) {
        this.model = model;
    }
    async create(payload) {
        const data = new  this.model(payload);
        const response = await data.save();
        return response;
    }

    async find_all(criteria, projections ={}, options = {}){
        if(!Object.hasOwnProperty.call(options, "lean")) options.lean = true;
        const response = await this.model.find(criteria, projections, options);
        return response;
    }

    async find_one(criteria, projections = {_id:0}, options = {}) {
        if (!Object.hasOwnProperty.call(options, "lean")) options.lean = true;
        const response = await this.model.findOne(criteria, projections, options);
        return response;
    }

    async update_one(criteria, update, options = {}) {
        if (!Object.hasOwnProperty.call(options, "new")) options.new = true;
        const response = await this.model.findOneAndUpdate(criteria, update, options);
        return response;
    }

    async insert_many(payload){
        const response = await this.model.insertMany(payload)
        return response;
    }

};
