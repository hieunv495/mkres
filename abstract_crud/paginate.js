const paginate = async (model, queryCriterias, {
    itemOnly = false,
    select = undefined,
    sort = undefined,
    populate = undefined,
    leanWithId = false,
    limit = 10,
    offset = 0,
    page = 1
}) => {

    let skip = offset + limit * (page - 1)
    let getItemsPromise = model.find(queryCriterias).sort(sort).skip(skip).limit(limit).populate(populate).select(select)

    if (leanWithId) {
        getItemsPromise = getItemsPromise.then(items => items.map(item => {
            item.id = item._id
            delete item._id
            return item
        }))
    }

    if (itemOnly) {
        return await getItemsPromise
    }

    let getTotalPromise = model.count(queryCriterias)

    let [items, total] = await Promise.all([getItemsPromise, getTotalPromise])

    let pages = Math.ceil((total - offset) / limit)

    // console.log(items)
    return {
        total,
        limit,
        offset,
        page,
        pages,
        items
    }
}


module.exports = paginate