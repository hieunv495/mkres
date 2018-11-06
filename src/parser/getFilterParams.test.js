const assert = require('assert');
const getFilterParams = require('./getFilterParams')

describe('Function: getFilterParams', () => {
    it('Default', () => {
        let pretension = [{
            age: {
                $eq: 10
            }
        }]

        let result = getFilterParams({
            query: {
                f: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Default Array', () => {
        let pretension = [{
            age: {
                $eq: [1, 2, 3, 4, 5]
            }
        }]

        let result = getFilterParams({
            query: {
                f: {
                    age: [1, 2, 3, 4, 5]
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Equal', () => {
        let pretension = [{
            age: {
                $eq: 10
            }
        }]

        let result = getFilterParams({
            query: {
                f_eq: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Not equal', () => {
        let pretension = [{
            age: {
                $ne: 10
            }
        }]

        let result = getFilterParams({
            query: {
                f_ne: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Greate than', () => {
        let pretension = [{
            age: {
                $gt: 10
            }
        }]

        let result = getFilterParams({
            query: {
                f_gt: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Greate than equal', () => {
        let pretension = [{
            age: {
                $gte: 10
            }
        }]

        let result = getFilterParams({
            query: {
                f_gte: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Less than', () => {
        let pretension = [{
            age: {
                $lt: 10
            }
        }]

        let result = getFilterParams({
            query: {
                f_lt: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Less than equal', () => {
        let pretension = [{
            age: {
                $lte: 10
            }
        }]

        let result = getFilterParams({
            query: {
                f_lte: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('In list', () => {
        let pretension = [{
            age: {
                $in: [1, 2, 3, 4, 5]
            }
        }]

        let result = getFilterParams({
            query: {
                f_in: {
                    age: [1, 2, 3, 4, 5]
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Not in list', () => {
        let pretension = [{
            age: {
                $nin: [1, 2, 3, 4, 5]
            }
        }]

        let result = getFilterParams({
            query: {
                f_nin: {
                    age: [1, 2, 3, 4, 5]
                }
            }
        })

        assert.deepEqual(result, pretension)
    })

    it('Other', () => {
        let pretension = []

        let result = getFilterParams({
            query: {
                f_abcd: {
                    age: 10
                }
            }
        })

        assert.deepEqual(result, pretension)
    })
})