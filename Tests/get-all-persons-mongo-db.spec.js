const GetAllPersonsMongoDB = require('../GetAllPersonsMongoDB/index')
const expect = require('chai').expect
const sinon = require('sinon');
const utils = require('./utils');
const repository = require('../GetAllPersonsMongoDB/repository/person-repository');

describe('GetAllPersonsMongoDB function', () => {
    var repositoryStub = {};
    var sandbox = {};
    var response = {};
    var expected = {};

    beforeEach(function() {

        sandbox = sinon.createSandbox();
        
        response = [{"_id":"5b77377807bf861994788ae9","personId":1,"lastName":"Hurtado","firstName":"Hector","id":"5cf9a568-abc6-8ab4-f773-760182fe5564"}];

        expected = {
            data: response,
            message: "Here are all the Persons in Mongo DB"
        }

        repositoryStub = sandbox.stub(repository, 'queryAll').callsFake( (ctx,cb) => {
            ctx.log("Calling Fake Repository"); // eslint-disable-line no-console
            cb(response);
          });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should return all persons in DB properly', (done) => {
        sandbox.spy(utils.context, "done");

        GetAllPersonsMongoDB(utils.context, utils.req);        

        expect(utils.context.res.body).to.equal(JSON.stringify(expected), "Result is wrong!!");
        expect(utils.context.done.called).to.be.true;
        sinon.assert.calledOnce(repositoryStub);
        
        done();
    });
})