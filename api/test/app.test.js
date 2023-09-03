
const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Update the path accordingly
const expect = chai.expect;

chai.use(chaiHttp);


// const mocha = require('mocha');
// const describe = mocha.describe;
// const it = mocha.it;
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// // const app = express();
// const app = require('../index');
// const expect = chai.expect;

// chai.use(chaiHttp);

describe('API Tests', () => {
  // You can use 'before' and 'after' hooks to set up and tear down your test environment if needed.

  it('should return a 404 error for an invalid route', (done) => {
    chai.request(app)
      .get('/invalid-route')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should register a new user', (done) => {
    chai.request(app)
      .post('/api/register')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('username', 'testuser');
        done();
      });
  });

  it('should log in a user', (done) => {
    chai.request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('username', 'testuser');
        done();
      });
  });

  // Add more test cases for other routes and functionalities...
});
